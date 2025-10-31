import prisma from "./lib/db";
import { getSessionStartTimestamp } from "./lib/session";
import xml2js from "xml2js"
import fs from "fs/promises"
import { xml2json } from 'xml-js';


import {fetch_json_with_optional_cache} from "./lib/utils";


interface MetadataDatasetImageGallery {
    ImageUrl: string
}

interface MetadataDatasetItem {
    Shortname: string,
    ApiUrl: string,
    ApiType: string,
    Dataspace: string,
    ImageGallery: MetadataDatasetImageGallery[]
}

interface DatasetRuleGroup {
    metadata: MetadataDatasetItem;
    rules: Check[];
}

interface MetadataResponse {
    Items: MetadataDatasetItem[]
}

interface DatasetPageItem {
    // Id: string
}

interface DatasetPage {
    //  NextPage: string | null
    Items: DatasetPageItem[] | undefined
    data:  DatasetPageItem[] | undefined
}

export interface ChecksRoot {
  checks: {
    check: Check[];
  };
}

export interface DataScopeFilters {
  dataset_shortname: string | undefined;
  dataset_dataspace: string |  undefined;
  dataset_apitype:   string | undefined;
  apitype_timeseries_param_datatype: string | undefined;
  apitype_timeseries_param_mperiod: string | undefined;
  apitype_timeseries_param_sactive: string | undefined;
  apitype_timeseries_param_sorigin: string | undefined;
  apitype_timeseries_param_last_from_hours: string | undefined;
  apitype_timeseries_param_last_to_hours: string | undefined;
}

export interface DataQualityRule {
  rule_language: string;
  rule_expression: string;
}

export interface Check {
  name: string;
  category: string;
  description: string;
 
  data_scope_filters: DataScopeFilters;
  data_quality_rule: DataQualityRule;
}




const metadata_json: MetadataResponse = await fetch_json_with_optional_cache(METADATA_BASE_URL);
const rules: Check[] = await loadRules();


for (const item of metadata_json.Items) {
    console.log(`Dataset: ${item.Shortname}, ApiType: ${item.ApiType}, ApiUrl: ${item.ApiUrl}`);

    const sessionStartTs = getSessionStartTimestamp();

    await prisma.test_dataset.create({
        data: {
            session_start_ts: sessionStartTs,
            dataset_name: item.Shortname,
            dataset_dataspace: item.Dataspace,
            dataset_img_url: item.ImageGallery?.[0].ImageUrl,
            used_key: KEYCLOAK_ASSOCIATED_ROLE
        }
    });

    let dataset_tested_record_count = 0;

    const rules_of_dataset: Map<string, Check[]> = await findRulesForDatasetGroupByUrlAndQueryParams(item, rules);
    for (const [url, rules] of rules_of_dataset.entries()) {

        console.log(`   Scope URL: ${url}`);
        let rule_tested_record_count = 0;
        try {
            for (let pageNumber = 1; pageNumber <= parseInt(DATASET_CONTENT_PAGE_LIMIT); pageNumber++) {

                const dataset_page_json_items: DatasetPageItem[] = await fetch_dataset_items_with_paging(url, pageNumber);

                if (dataset_page_json_items.length == 0)
                    break;

                processDatasetItems(dataset_page_json_items, rules, item.Shortname, rule_tested_record_count);
                
                rule_tested_record_count += dataset_page_json_items.length;
            }
        }
        catch (e) {
            console.error(`      Error fetching dataset items from ${url}: ${e}`);
            continue;
        }

        // update counters per all the rules applied to this scope url
        for (const rule of rules) {
            await upsertDatasetCheckTestedRecords(sessionStartTs, item.Shortname, rule.name, rule.category, rule_tested_record_count);
        }       

        // this is an approximation as multiple rules can apply to same record in different scope urls
        // to avoid overcounting we should define unique record ids across rules and datasets
        dataset_tested_record_count += rule_tested_record_count;
        await updateTestedRecords(item.Shortname, dataset_tested_record_count);
    
    }
}

async function fetch_dataset_items_with_paging(url: string, pageNumber: number) : Promise<DatasetPageItem[]> {

    const pageUrl = url + (url.includes("?") ? '&' : '?' ) + `pagesize=100&pagenumber=${pageNumber}`;
    console.log("pageUrl", pageUrl)
    const dataset_page_json: DatasetPage = await fetch_json_with_optional_cache(pageUrl)
    
    const records = []

    if (Array.isArray(dataset_page_json.Items))
        records.push(...dataset_page_json.Items)

    if (Array.isArray(dataset_page_json.data))
        records.push(...dataset_page_json.data)

    return records;

}

/*
    to optimize api calls and avoid fetching and count same dataset multiple times
*/

async function findRulesForDatasetGroupByUrlAndQueryParams(dataset_metadata: MetadataDatasetItem, rules: Check[]): Promise<Map<string, Check[]>> {

    const matched_rules = new Map<string, Check[]>();

    for (const rule of rules) {

            let scope_url = dataset_metadata.ApiUrl;

            let rest: any;
            const { dataset_shortname, dataset_dataspace, dataset_apitype, ...rest1 } = rule.data_scope_filters;
            const match_dataset_shortname =  dataset_shortname === undefined || dataset_shortname === '' || dataset_shortname === dataset_metadata.Shortname
            const match_dataset_dataspace =  dataset_dataspace === undefined || dataset_dataspace === '' || dataset_dataspace === dataset_metadata.Dataspace
            const match_dataset_apitype   =  dataset_apitype   === undefined || dataset_apitype   === '' || dataset_apitype   === dataset_metadata.ApiType
            rest = rest1

            if (dataset_apitype === 'timeseries') {

                const { apitype_timeseries_param_datatype, apitype_timeseries_param_mperiod,
                        apitype_timeseries_param_last_from_hours, apitype_timeseries_param_last_to_hours,
                        apitype_timeseries_param_sactive, apitype_timeseries_param_sorigin,
                        ...rest2 } = rest;
                // build url like https://mobility.api.opendatahub.com/v2/flat/EnvironmentStation/NO2%20-%20Ossidi%20di%20azoto/2025-10-14T00:00:00.000Z/2025-10-17T23:59:59.999Z?limit=-1&distinct=true&select=sname,mvalue,mvalidtime&where=mperiod.eq.3600,sactive.eq.true,sorigin.eq.APPABZ
                scope_url += '/' + (apitype_timeseries_param_datatype ?? '*'); // datatype
                const now = getSessionStartTimestamp(); // use session start timestamp to have consistent results across rules
                const fromHours = Number(apitype_timeseries_param_last_from_hours ?? '24');
                const toHours = Number(apitype_timeseries_param_last_to_hours ?? '0');
                const fromDate = new Date(now.getTime() - fromHours * 3600_000);
                const toDate = new Date(now.getTime() - toHours * 3600_000);
                scope_url += '/' + fromDate.toISOString();
                scope_url += '/' + toDate.toISOString();
                scope_url += '?limit=-1&';
                let where = ''
                if (apitype_timeseries_param_mperiod !== undefined) {
                    where += `mperiod.eq.${apitype_timeseries_param_mperiod},`;
                }
                if (apitype_timeseries_param_sactive !== undefined) {
                    where += `sactive.eq.${apitype_timeseries_param_sactive},`;
                }
                if (apitype_timeseries_param_sorigin !== undefined) {
                    where += `sorigin.eq.${apitype_timeseries_param_sorigin},`;
                }
                if (where != '')
                    scope_url += 'where=' + where.slice(0, -1) + '&';

                // TODO endw with & or ? properly not both
                if (scope_url.endsWith('?') || scope_url.endsWith('&')) 
                    scope_url = scope_url.slice(0, -1);
                
                rest = rest2
            }

            if ( Object.keys(rest).length > 0) {
                throw new Error(`Unexpected filter attribute(s): ${ Object.keys(rest).join(', ')}`);
            }

            if (match_dataset_shortname && match_dataset_dataspace && match_dataset_apitype) {
            
                // console.log('Evaluating rule', rule.name, 'for dataset', dataset_metadata.Shortname, 'with scope url', scope_url);

                if (!matched_rules.has(scope_url)) {
                    matched_rules.set(scope_url, []);
                }
                matched_rules.get(scope_url)!.push(rule);

            }

    }

    return matched_rules;
}

async function loadRules(): Promise<Check[]> {

    const checks_xml = await fs.readFile("checks.xml", 'utf-8')

    // const jsonString = xml2json(checks_xml, { compact: true, spaces: 2 });
    // console.log(jsonString)

    const parser = new xml2js.Parser({ explicitArray: false });
    const rules: ChecksRoot = await parser.parseStringPromise(checks_xml)
    if (!Array.isArray(rules.checks.check)) // fix xml2js problem when only one check
        rules.checks.check = [rules.checks.check]
    
    return rules.checks.check;

}

async function upsertDatasetCheckTestedRecords(
sessionStartTs: Date, datasetName: string, checkName: string, category: string, testedRecords: number): Promise<void> {
    await prisma.test_dataset_check.upsert({
        where: {
            session_start_ts_dataset_name_check_name: {
                session_start_ts: sessionStartTs,
                dataset_name: datasetName,
                check_name: checkName,
            },
        },
        update: {
            tested_records: testedRecords,
        },
        create: {
            session_start_ts: sessionStartTs,
            dataset_name: datasetName,
            check_name: checkName,
            check_category: category,
            tested_records: testedRecords,
        },
    });
}

async function updateTestedRecords(datasetName: string, testedRecordCount: number): Promise<void> {
    await prisma.test_dataset.update({
        where: {
            session_start_ts_dataset_name: {
                session_start_ts: getSessionStartTimestamp(),
                dataset_name: datasetName,
            }
        },
        data: {
            tested_records: testedRecordCount
        }
    });
}

async function processDatasetItems(dataset_page_json_item: DatasetPageItem[], dataset_rules: Check[], dataset_Shortname: string, start_number: number): Promise<void> {
    // let tested_record_count = 0;
    const failed_records: any = []
    for (let i = 0; i < dataset_page_json_item.length; i++) {
        // tested_record_count++;
        const obj = dataset_page_json_item[i]
        for (let rule of dataset_rules) {
             checkRecordWithRule(rule, obj, failed_records, dataset_Shortname, 'seq=' + (start_number + i))
        }

    }
    await prisma.test_dataset_record_check_failed.createMany({ data: failed_records });
}

function checkRecordWithRule(rule: Check, obj: DatasetPageItem, failed_records: any, dataset_Shortname: string, rec_id: string) {
    switch (rule.data_quality_rule.rule_language) {
        case 'javascript':
            const fn = new Function("$", `return (${rule.data_quality_rule.rule_expression});`);
            try {
                const result = fn(obj);
                if (typeof result != 'boolean')
                    throw new Error('rule code invalid, instead of boolean has returned a ' + (typeof result))
                if (!result) {
                    console.log(`rule ${rule.name} failed for ${obj}`)
                    failed_records.push({
                        session_start_ts: getSessionStartTimestamp(),
                        dataset_name: dataset_Shortname,
                        record_jsonpath: rec_id, // shold be unique
                        check_name: rule.name,
                        record_json: JSON.stringify(obj, null, 3),
                        problem_hint: '',
                        impacted_attributes_csv: '',
                        check_category: rule.category,
                        used_key: KEYCLOAK_CLIENT_ID,
                        impacted_attribute_value: ''
                    })
                }
            }
            catch (e) {
                console.log(e)
            }
            break;
        default:
            throw new Error('type not implemented ' + rule.data_quality_rule.rule_language)
    }
}
