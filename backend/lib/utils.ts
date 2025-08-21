import wildcardMatch from "wildcard-match";
import prisma from "./db";
import { getDatasetContent } from "./odhDatasets";
import ivm from "isolated-vm";

const isolate = new ivm.Isolate({ memoryLimit: 128 });

export async function recursiveJsonChecks(json: any, seenDatasets: Set<string>, datasetName?: string, path: string[] = []) {
    const rules = await prisma.rules.findMany({});
    const dataset_name = json.Shortname || datasetName || "unknown_dataset";

    let passedRules: { dataset_name: string; check_name: string }[] = [];
    let failedRules: {
        dataset_name: string;
        record_jsonpath: string;
        check_name: string;
        record_json: string;
        problem_hint: string;
        impacted_attributes_csv: string;
        check_category: string;
    }[] = [];

    async function onRuleMatch(rule: any, key: string, keyValue: unknown, keyPath: string) {
        passedRules.push({
            dataset_name: dataset_name,
            check_name: rule.name
        });
        console.log(`Rule "${rule.name}" Passed ✅ for key "${key}" at path "${keyPath}" with value:`, keyValue);
    }

    async function onRuleFail(rule: any, key: string, keyValue: unknown, keyPath: string, hint?: string) {
        failedRules.push({
            dataset_name: dataset_name,
            record_jsonpath: keyPath,
            check_name: rule.name,
            record_json: JSON.stringify(json),
            problem_hint: hint ?? `Rule "${rule.name}" failed for key "${key}" with value: ${keyValue}`,
            impacted_attributes_csv: key,
            check_category: rule.type || "unknown",
        });
        console.log(`Rule "${rule.name}" Failed ❌ for key "${key}" at path "${keyPath}" with value:`, keyValue);
    }

    async function ruleFlush() {
        try {
            if (passedRules.length > 0) {
                await prisma.test_dataset_check.createMany({
                    data: passedRules,
                    skipDuplicates: true,
                });
                passedRules = [];
            }
            if (failedRules.length > 0) {
                await prisma.test_dataset_record_check_failed.createMany({
                    data: failedRules,
                    skipDuplicates: true
                });
                failedRules = [];
            }
        } catch (err: any) {
            console.error("Error during ruleFlush batch write:", err);
        }
    }

    setInterval(ruleFlush, 90 * 1000);

    await Promise.all(Object.keys(json).map(async (key) => {
        const keyValueType = typeof json[key];
        const keyValue = json[key] || "";
        const keyPath = [...path, key].join(".");

        if (key == "ApiUrl") {
            if (seenDatasets.has(keyValue)) {
                return;
            }
            seenDatasets.add(keyValue);
            const datasetContent = await getDatasetContent(keyValue);
            await recursiveJsonChecks(datasetContent, seenDatasets, dataset_name);
            return;
        } else if (keyValueType === "object" && json[key] !== null) {
            await recursiveJsonChecks(json[key], seenDatasets, dataset_name, [...path, key]);
            return;
        } else {
            await Promise.all(rules.map(async rule => {
                const isSearchFilterMatch = wildcardMatch(rule.searchFilter);
                if (isSearchFilterMatch(keyPath)) {
                    if (rule.type == "matches-wildcard") {
                        const valueWildcardMatch = wildcardMatch(rule.value);
                        valueWildcardMatch(String(keyValue)) ?
                            onRuleMatch(rule, key, keyValue, keyPath) :
                            onRuleFail(rule, key, keyValue, keyPath);
                        return;
                    }
                    if (rule.type === "null-check") {
                        const isNull = json[key] == null;
                        if (rule.value === "no-null") {
                            isNull ? onRuleFail(rule, key, keyValue, keyPath) : onRuleMatch(rule, key, keyValue, keyPath);
                            return;
                        } else if (rule.value === "only-null") {
                            isNull ? onRuleMatch(rule, key, keyValue, keyPath) : onRuleFail(rule, key, keyValue, keyPath);
                            return;
                        } else {
                            console.log("Unknown null-check value:", rule.value);
                            return;
                        }
                    }
                    if (rule.type == "math-check") {
                        if (keyValueType !== "number") {
                            return;
                        } else {
                            const comparator = rule.value.match(/(>=|<=|==|!=|>|<|=)/)?.[0] || "";
                            const comparasionValue = Number(rule.value.match(/[\d.]+/)?.[0]);
                            switch (comparator) {
                                case ">":
                                    Number(keyValue) > comparasionValue ? onRuleMatch(rule, key, keyValue, keyPath) : onRuleFail(rule, key, keyValue, keyPath);
                                    return;
                                case "<":
                                    Number(keyValue) < comparasionValue ? onRuleMatch(rule, key, keyValue, keyPath) : onRuleFail(rule, key, keyValue, keyPath);
                                    return;
                                case "=":
                                case "==":
                                    Number(keyValue) == comparasionValue ? onRuleMatch(rule, key, keyValue, keyPath) : onRuleFail(rule, key, keyValue, keyPath);
                                    return;
                                case "!":
                                case "!=":
                                    Number(keyValue) != comparasionValue ? onRuleMatch(rule, key, keyValue, keyPath) : onRuleFail(rule, key, keyValue, keyPath);
                                    return;
                                case ">=":
                                    Number(keyValue) >= comparasionValue ? onRuleMatch(rule, key, keyValue, keyPath) : onRuleFail(rule, key, keyValue, keyPath);
                                    return;
                                case "<=":
                                    Number(keyValue) <= comparasionValue ? onRuleMatch(rule, key, keyValue, keyPath) : onRuleFail(rule, key, keyValue, keyPath);
                                    return;
                                default:
                                    onRuleFail(rule, key, keyValue, keyPath);
                                    return;
                            }
                        }
                    }
                    if (rule.type == "javascript") {
                        try {
                            const context = isolate.createContextSync();
                            const isolatedEnv = context.global;
                            isolatedEnv.setSync('log', (...args: any[]) => {
                                console.log("-------- DEBUG ----------");
                                console.log(...args);
                                console.log("-------- END DEBUG ----------");
                            });
                            isolatedEnv.setSync('getKey', () => key);
                            isolatedEnv.setSync('getKeyValue', () => keyValue);
                            isolatedEnv.setSync('getKeyPath', () => keyPath);
                            isolatedEnv.setSync('getValueType', () => keyValueType);
                            const code = `(function() { ${rule.value} })()`;
                            context.evalSync(code) ? onRuleMatch(rule, key, keyValue, keyPath) : onRuleFail(rule, key, keyValue, keyPath)
                            context.release();
                        } catch {
                            onRuleFail(rule, key, keyValue, keyPath, "Javascript execution error")
                        }
                    } else {
                        onRuleFail(rule, key, keyValue, keyPath, "Invalid rule type, valid rule types include: matches-wildcard, null-check, math-check, javascript");
                        return;
                    }
                }
            }));
        }
    }));
}