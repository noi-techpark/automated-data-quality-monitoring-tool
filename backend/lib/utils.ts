import wildcardMatch from "wildcard-match";
import prisma from "./db";
import { getDatasetContent } from "./odhDatasets";
// import ivm from "isolated-vm";
import { censorKey } from "./auth";
import { getSessionStartTimestamp } from "./session";

// const isolate = new ivm.Isolate({ memoryLimit: 128 });

const sessionStartTs = getSessionStartTimestamp();

/*
let nrDataset = 0;
let totalNrDatasets = 0;
async function getTotalDatasetsCount() {
    if (totalNrDatasets) return totalNrDatasets;
    const count = await prisma.test_dataset.count();
    totalNrDatasets = count;
    return count;
}
 */

async function validateRules() {
    const rules = await prisma.rules.findMany({});
    let invalidFound = false;
    if (rules.length === 0) {
        console.warn("⚠️  No rules found. Exiting. Add rules to the database to enable rule checks.");
        invalidFound = true;
    } else {
        for (const rule of rules) {
            if (!rule.name || !rule.type || !rule.value || !rule.searchfilter) {
                console.log(`❌ Invalid rule detected: ${JSON.stringify(rule)}`);
                invalidFound = true;
                break;
            }
            const validTypes = ["matches-wildcard", "null-check", "math-check", "javascript"];
            if (!validTypes.includes(rule.type)) {
                console.log(`❌ Invalid rule type: ${rule.type} in rule ${rule.name}`);
                invalidFound = true;
                break;
            }
            if (rule.type === "null-check" && !["no-null", "only-null"].includes(rule.value)) {
                console.log(`❌ Invalid null-check value: ${rule.value} in rule ${rule.name}`);
                invalidFound = true;
                break;
            }
            if (rule.type === "math-check" && !/^(>=|<=|==|!=|>|<|=)\s*\d+(\.\d+)?$/.test(rule.value)) {
                console.log(`❌ Invalid math-check value: ${rule.value} in rule ${rule.name}`);
                invalidFound = true;
                break;
            }
            if (rule.type === "javascript") {
                try {
                    /*
                    const context = isolate.createContextSync();
                    const isolatedEnv = context.global;
                    isolatedEnv.setSync('log', () => { });
                    isolatedEnv.setSync('getKey', () => 'testKey');
                    isolatedEnv.setSync('getKeyValue', () => 'testValue');
                    isolatedEnv.setSync('getKeyPath', () => 'test.path');
                    isolatedEnv.setSync('getValueType', () => 'string');
                    const code = `(function() { ${rule.value} })()`;
                    context.evalSync(code);
                    context.release();
                     */
                } catch (e) {
                    console.log(`❌ Invalid javascript in rule "${rule.name}". Error:`, e);
                    invalidFound = true;
                    break;
                }
            }
        }
    }
    if (invalidFound) {
        console.log("🚫 Exiting due to invalid rule set.");
        process.exit(1);
    }
    console.log(`✅ All ${rules.length} rules validated successfully.`);
};
validateRules();

let passedRules: {
    session_start_ts: Date;
    dataset_name: string; check_name: string,
    used_key: string;
}[] = [];

let failedRules: {
    session_start_ts: Date;
    dataset_name: string;
    record_jsonpath: string;
    check_name: string;
    record_json: string;
    problem_hint: string;
    impacted_attributes_csv: string;
    check_category: string;
    used_key: string;
    impacted_attribute_value: string;
}[] = [];

/*
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
    } catch (e: any) {
        console.log("❌ Something went wrong while flushing new results: ", e);
        // should handle this better
        passedRules = [];
        failedRules = [];
        return;
    } finally {
        const total = await getTotalDatasetsCount() || 0;
        if ((nrDataset < total) || (nrDataset === 0 && total === 0)) {
            setTimeout(() => {
                ruleFlush().catch(err => console.error('Scheduled ruleFlush error:', err));
            }, 10 * 1000);
        } else {
            process.exit(0);
        }
    }
}
ruleFlush();
*/ 


export async function recursiveJsonDatasetChecks(json: any, dataset_name:string, record_jsonpath: string, recursive_key_prefix: string) {
    const rules = await prisma.rules.findMany({});

    function onRuleMatch(rule: any, key: string, keyValue: unknown, record_jsonpath: string, keyPath: string) {
        /*
        passedRules.push({
            session_start_ts: sessionStartTs,
            dataset_name: String(dataset_name),
            check_name: String(rule.name),
            used_key: String(censorKey(process.env.KEYCLOAK_CLIENT_SECRET as string) ?? "public")
        });
         */
        if (process.env.LOG_LEVEL == "extended") {
            console.log(`Rule "${rule.name}" Passed ✅ for key "${key}" at path "${keyPath}" with value:`, keyValue);
        }
    }

    function onRuleFail(rule: any, key: string, keyValue: unknown, record_jsonpath: string, keyPath: string, hint?: string) {
        try {
            const safeDatasetName = String(dataset_name ?? "unknown_dataset");
            // const safeKeyPath = String(keyPath ?? "");
            const safeCheckName = String(rule?.name ?? "unknown_check");
            let safeRecordJson: string;
            try {
                safeRecordJson = JSON.stringify(json);
            } catch {
                safeRecordJson = "[unserializable]";
            }
            const safeHint = String(
                hint ??
                `Rule "${safeCheckName}" failed for key "${String(key ?? "")}" with value: ${String(keyValue ?? "")}`
            );

            /*
            const safeImpactedAttributes = typeof key === "string"
                ? key
                : Array.isArray(key)
                    ? (key as any).join(",")
                    : String(key ?? "");
             */

            const safeCategory = String(rule?.type ?? "unknown");

            /*
            let safeUsedKey = "public";
            try {
                const ck = censorKey(process.env.KEYCLOAK_CLIENT_SECRET as string);
                safeUsedKey = String(ck ?? "public");
            } catch {
                safeUsedKey = "public";
            }
             */

            failedRules.push({
                session_start_ts: sessionStartTs,
                dataset_name: safeDatasetName,
                record_jsonpath: record_jsonpath,
                check_name: safeCheckName,
                record_json: safeRecordJson,
                problem_hint: safeHint,
                impacted_attributes_csv: keyPath,
                check_category: safeCategory,
                used_key: process.env.KEYCLOAK_CLIENT_ID || 'public',
                impacted_attribute_value: String(keyValue)
            });
        } catch (e) {
            // don't let push errors break the scan
            console.error("Error preparing failed rule entry:", e);
        }
        if (process.env.LOG_LEVEL == "extended") {
            console.log(`Rule "${rule.name}" Failed ❌ for key "${key}" at path "${keyPath}" with value:`, keyValue);
        }
    }

    const keys = Object.keys(json)

    for (let key of keys)
    {
        const keyValue = json[key];
        const keyValueType = typeof keyValue;
        const keyPath = recursive_key_prefix + key

        if (!['string', 'object', 'boolean', 'number'].includes(keyValueType)) {
            console.error(`data type not managed (already): ${keyValueType}`);
            process.exit(1); // codice 1 = errore
        }

        if (keyValueType === "object" && keyValue !== null) { // old story bug: null is an object
            // if (Array.isArray(keyValue)) condition not required.
            // An Array is an object in JavaScript, so Object.keys(...) works for both
            // plain objects and arrays (returns string indices for arrays).
            // Internally arrays have string indices
            await recursiveJsonDatasetChecks(keyValue, dataset_name, record_jsonpath, keyPath + '.');
            continue
        }

        // const keyPath = record_jsonpath + '-' + key // TODO manage nested properties //[...path, key].join(".");
        for (let rule of rules)
        {
                const isSearchFilterMatch = wildcardMatch(rule.searchfilter);
                const isDatasetNameFilterMatch = wildcardMatch(rule.datasetname_searchfilter);
                if (isSearchFilterMatch(keyPath) && isDatasetNameFilterMatch(dataset_name)) {
                    if (rule.type == "matches-wildcard") {
                        const valueWildcardMatch = wildcardMatch(rule.value);
                        valueWildcardMatch(String(keyValue)) ?
                            onRuleMatch(rule, key, keyValue, record_jsonpath, keyPath) :
                            onRuleFail(rule, key, keyValue, record_jsonpath, keyPath);
                        continue;
                    }
                    if (rule.type === "null-check") {
                        const isNull = json[key] == null;
                        if (rule.value === "no-null") {
                            isNull ? onRuleFail(rule, key, keyValue, record_jsonpath, keyPath) : onRuleMatch(rule, key, keyValue, record_jsonpath, keyPath);
                            continue;
                        } else if (rule.value === "only-null") {
                            isNull ? onRuleMatch(rule, key, keyValue, record_jsonpath, keyPath) : onRuleFail(rule, key, keyValue, record_jsonpath, keyPath);
                            continue;
                        } else {
                            console.log("Unknown null-check value:", rule.value);
                            continue;
                        }
                    }
                    if (rule.type == "math-check") {
                        if (keyValueType !== "number") {
                            continue;
                        } else {
                            const comparator = rule.value.match(/(>=|<=|==|!=|>|<|=)/)?.[0] || "";
                            const comparasionValue = Number(rule.value.match(/[\d.]+/)?.[0]);
                            switch (comparator) {
                                case ">":
                                    Number(keyValue) > comparasionValue ? onRuleMatch(rule, key, keyValue, record_jsonpath, keyPath) : onRuleFail(rule, key, keyValue, record_jsonpath, keyPath);
                                    continue;
                                case "<":
                                    Number(keyValue) < comparasionValue ? onRuleMatch(rule, key, keyValue, record_jsonpath, keyPath) : onRuleFail(rule, key, keyValue, record_jsonpath, keyPath);
                                    continue;
                                case "=":
                                case "==":
                                    Number(keyValue) == comparasionValue ? onRuleMatch(rule, key, keyValue, record_jsonpath, keyPath) : onRuleFail(rule, key, keyValue, record_jsonpath, keyPath);
                                    continue;
                                case "!":
                                case "!=":
                                    Number(keyValue) != comparasionValue ? onRuleMatch(rule, key, keyValue, record_jsonpath, keyPath) : onRuleFail(rule, key, keyValue, record_jsonpath, keyPath);
                                    continue;
                                case ">=":
                                    Number(keyValue) >= comparasionValue ? onRuleMatch(rule, key, keyValue, record_jsonpath, keyPath) : onRuleFail(rule, key, keyValue, record_jsonpath, keyPath);
                                    continue;
                                case "<=":
                                    Number(keyValue) <= comparasionValue ? onRuleMatch(rule, key, keyValue, record_jsonpath, keyPath) : onRuleFail(rule, key, keyValue, record_jsonpath, keyPath);
                                    continue;
                                default:
                                    onRuleFail(rule, key, keyValue, record_jsonpath, keyPath);
                                    continue;
                            }
                        }
                    }
                    if (rule.type == "javascript") {
                        try {
                            /*
                            const context = isolate.createContextSync();
                            const isolatedEnv = context.global;
                            isolatedEnv.setSync('log', (...args: any[]) => {
                                console.log(...args);
                            });
                            isolatedEnv.setSync('getKey', () => key);
                            isolatedEnv.setSync('getKeyValue', () => keyValue);
                            isolatedEnv.setSync('getKeyPath', () => keyPath);
                            isolatedEnv.setSync('getValueType', () => keyValueType);
                            const code = `(function() { ${rule.value} })()`;
                            context.evalSync(code) ? onRuleMatch(rule, key, keyValue, keyPath) : onRuleFail(rule, key, keyValue, keyPath)
                            context.release();
                             */
                             onRuleFail(rule, key, keyValue, record_jsonpath, keyPath)
                        } catch {
                            onRuleFail(rule, key, keyValue, record_jsonpath, keyPath, "Javascript execution error")
                        }
                    } else {
                        onRuleFail(rule, key, keyValue, record_jsonpath, keyPath, "Invalid rule type, valid rule types include: matches-wildcard, null-check, math-check, javascript");
                        continue;
                    }
                }
        }

        
        

    }


    // after each dataset write failes rules, one time to optimize performance
        
    if (failedRules.length > 0) {
        await prisma.test_dataset_record_check_failed.createMany({
            data: failedRules,
            skipDuplicates: false
        });
        failedRules = [];
    }

    /*
    await Promise.all(Object.keys(record_jsondata).map(async (key) => {
        const keyValueType = typeof json[key];
        const keyValue = json[key] || "";
        const keyPath = [...path, key].join(".");
        if (key == "ApiUrl") {
            if (seenDatasets.has(String(keyValue).trim())) {
                return;
            }
            seenDatasets.add(String(keyValue).trim());
            let pageNumber = 1;
            let nr_records = 0;
            while (true) {
                const datasetContent = await getDatasetContent(dataset_name, dataset_data_space, keyValue, pageNumber);
                nr_records += datasetContent.Items.length
                await recursiveJsonChecks(datasetContent, seenDatasets, dataset_name);
                if (datasetContent.TotalPages) {
                    if ((datasetContent.TotalPages == datasetContent.CurrentPage) || (datasetContent.CurrentPage >= Number(process.env.DATASET_CONTENT_PAGE_LIMIT))) {
                        pageNumber = 1;
                        break;
                    } else {
                        pageNumber++;
                    }
                } else {
                    break;
                }
            }
            
            await prisma.test_dataset.update({
                where: {
                    session_start_ts_dataset_name: {
                        session_start_ts: sessionStartTs,
                        dataset_name: dataset_name,
                    }
                },
                data: {
                    tested_records: nr_records
                }
            });
           
            console.log(`✅ Processed dataset ${++nrDataset}/${await getTotalDatasetsCount()} - ${dataset_name}`);
            return;
        } else if (keyValueType === "object" && json[key] !== null) {
            await recursiveJsonChecks(json[key], seenDatasets, dataset_name, dataset_data_space, [...path, key]);
            return;
        } else {
            await Promise.all(rules.map(async rule => {
                
            }));
        }
    }));
    */
}
