import prisma from "./lib/db";
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

type TestDatasetRecordCheckFailedCreateInput = {
  session_start_ts: Date;
  dataset_name: string;
  record_jsonpath: string;
  check_name: string;
  record_json: string;
  impacted_attributes_csv: string;
  check_category: string;
  problem_hint: string;
  used_key: string
  impacted_attribute_value?: string | null;
  owner: string;
  test_dataset_id: number
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
  owner: string;
  name: string;
  category: string;
  description: string;
 
  data_scope_filters: DataScopeFilters;
  data_quality_rule: DataQualityRule;

  custom_dashboard_id?: number;
}

interface CustomDashboardFieldName {
  name: string;
  type: string;
  is_array: boolean;
}

interface CustomDashboardCheck {
  field_name: string;
  operation: string;
  compare_value: string;
}

interface CustomDashboardDefinition {
  data_provider: string;
  dataset: string;
  dataset_type: string;
  timeseries: {
    active_status: string;
    datatype: string;
    mperiod: string;
  };
  checks: CustomDashboardCheck[];
}

export async function doPublicTestFor(
  sessionStartTs: Date,
  KEYCLOAK_BASE_URL: string,
  KEYCLOAK_CLIENT_ID: string,
  KEYCLOAK_REALM: string, 
  KEYCLOAK_CLIENT_SECRET: string,
  KEYCLOAK_ASSOCIATED_ROLE: string, 
  LOG_LEVEL: string,
  DATABASE_URL: string,
  METADATA_BASE_URL: string, 
  DATASET_CONTENT_PAGE_LIMIT: string, 
  DEBUG_MODE_CACHE_ON: boolean) {

const metadata_json: MetadataResponse = await fetch_json_with_optional_cache(METADATA_BASE_URL, KEYCLOAK_CLIENT_ID, KEYCLOAK_CLIENT_SECRET, KEYCLOAK_REALM, KEYCLOAK_BASE_URL, KEYCLOAK_ASSOCIATED_ROLE, DEBUG_MODE_CACHE_ON );
const rules: Check[] = await loadRules();

const OWNER = 'public'

for (const item of metadata_json.Items) {
    console.log(`Dataset: ${item.Shortname}, ApiType: ${item.ApiType}, ApiUrl: ${item.ApiUrl}`);

    const p_test_dataset_id = Number((await prisma.test_dataset.create({
        data: {
            session_start_ts: sessionStartTs,
            dataset_name: item.Shortname,
            dataset_dataspace: item.Dataspace,
            dataset_img_url: item.ImageGallery?.[0].ImageUrl,
            owner: OWNER,
            used_key: KEYCLOAK_ASSOCIATED_ROLE
        },
        select: {
            id: true
        }
    })).id);

    let dataset_tested_record_count = 0;

    const rules_of_dataset: Map<string, Check[]> = await findRulesForDatasetGroupByUrlAndQueryParams(item, rules, sessionStartTs);
    for (const [url, rules] of rules_of_dataset.entries()) {

        console.log(`   Scope URL: ${url}`);
        let rule_tested_record_count = 0;
        try {
            for (let pageNumber = 1; pageNumber <= parseInt(DATASET_CONTENT_PAGE_LIMIT); pageNumber++) {

                const dataset_page_json_items: DatasetPageItem[] = await fetch_dataset_items_with_paging(url, pageNumber, KEYCLOAK_CLIENT_ID, KEYCLOAK_CLIENT_SECRET, KEYCLOAK_REALM, KEYCLOAK_BASE_URL, KEYCLOAK_ASSOCIATED_ROLE, DEBUG_MODE_CACHE_ON);

                if (dataset_page_json_items.length == 0)
                    break;

                processDatasetItems(p_test_dataset_id, dataset_page_json_items, rules, item.Shortname, rule_tested_record_count, sessionStartTs, KEYCLOAK_ASSOCIATED_ROLE);
                
                rule_tested_record_count += dataset_page_json_items.length;
            }
        }
        catch (e) {
            console.error(`      Error fetching dataset items from ${url}: ${e}`);
            continue;
        }

        // update counters per all the rules applied to this scope url
        //for (const rule of rules) {
        //    await upsertDatasetCheckTestedRecords(sessionStartTs, item.Shortname, rule.name, rule.category, rule_tested_record_count);
        //}       

        // this is an approximation as multiple rules can apply to same record in different scope urls
        // to avoid overcounting we should define unique record ids across rules and datasets
        dataset_tested_record_count += rule_tested_record_count;
        await updateTestedRecords(p_test_dataset_id, dataset_tested_record_count);
    
    }
}
  }


export async function doPrivateTestFor(
  sessionStartTs: Date,
  KEYCLOAK_BASE_URL: string,
  KEYCLOAK_CLIENT_ID: string,
  KEYCLOAK_REALM: string, 
  KEYCLOAK_CLIENT_SECRET: string,
  KEYCLOAK_ASSOCIATED_ROLE: string, 
  LOG_LEVEL: string,
  DATABASE_URL: string,
  METADATA_BASE_URL: string, 
  DATASET_CONTENT_PAGE_LIMIT: string, 
  DEBUG_MODE_CACHE_ON: boolean) {

    console.log("doPrivateTestFor start for " + KEYCLOAK_ASSOCIATED_ROLE);

const metadata_json: MetadataResponse = await fetch_json_with_optional_cache(METADATA_BASE_URL, KEYCLOAK_CLIENT_ID, KEYCLOAK_CLIENT_SECRET, KEYCLOAK_REALM, KEYCLOAK_BASE_URL, KEYCLOAK_ASSOCIATED_ROLE, DEBUG_MODE_CACHE_ON );

const rules: Check[] = await loadRulesFromCustomDashboard(KEYCLOAK_ASSOCIATED_ROLE);

for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];
    console.log(rule)
    const dataset_name = rule.data_scope_filters.dataset_shortname;
    console.log(metadata_json.Items.length)
    for (let j = 0; j < metadata_json.Items.length; j++) {
        const metadata_item = metadata_json.Items[j];
        console.log(metadata_item.Shortname)
        if (metadata_item.Shortname === dataset_name) {

            const p_test_dataset_id = Number((await prisma.test_dataset.create({
                data: {
                    session_start_ts: sessionStartTs,
                    dataset_name: rule.name,
                    dataset_dataspace: metadata_item.Dataspace,
                    dataset_img_url: metadata_item.ImageGallery?.[0].ImageUrl,
                    owner: rule.owner,
                    used_key: KEYCLOAK_ASSOCIATED_ROLE,
                    custom_dashboard_id: Number(rule.custom_dashboard_id)
                },
                select: {
                    id: true
                }
            })).id);

            let rule_tested_record_count = 0;
            
            for (let pageNumber = 1; pageNumber <= parseInt(DATASET_CONTENT_PAGE_LIMIT); pageNumber++) {

                const dataset_page_json_items: DatasetPageItem[] = await fetch_dataset_items_with_paging(metadata_item.ApiUrl, pageNumber, KEYCLOAK_CLIENT_ID, KEYCLOAK_CLIENT_SECRET, KEYCLOAK_REALM, KEYCLOAK_BASE_URL, KEYCLOAK_ASSOCIATED_ROLE, DEBUG_MODE_CACHE_ON);
                console.log(dataset_page_json_items)
                if (dataset_page_json_items.length == 0)
                    break;

                processDatasetItems(p_test_dataset_id, dataset_page_json_items, [rule], metadata_item.Shortname, rule_tested_record_count, sessionStartTs, KEYCLOAK_ASSOCIATED_ROLE);

                rule_tested_record_count += dataset_page_json_items.length;
            }

            const  dataset_tested_record_count = rule_tested_record_count;
            await updateTestedRecords(p_test_dataset_id, dataset_tested_record_count);


            break;
        }
    }
}
  }



async function fetch_dataset_items_with_paging(url: string, pageNumber: number, KEYCLOAK_CLIENT_ID: string, KEYCLOAK_CLIENT_SECRET: string, KEYCLOAK_REALM: string, KEYCLOAK_BASE_URL: string, KEYCLOAK_ASSOCIATED_ROLE: string, DEBUG_MODE_CACHE_ON: boolean) : Promise<DatasetPageItem[]> {

    const pageUrl = url + (url.includes("?") ? '&' : '?' ) + `pagesize=100&pagenumber=${pageNumber}`;
    console.log("pageUrl", pageUrl)
    const dataset_page_json: DatasetPage = await fetch_json_with_optional_cache(pageUrl, KEYCLOAK_CLIENT_ID, KEYCLOAK_CLIENT_SECRET, KEYCLOAK_REALM, KEYCLOAK_BASE_URL, KEYCLOAK_ASSOCIATED_ROLE, DEBUG_MODE_CACHE_ON);  
    
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

async function findRulesForDatasetGroupByUrlAndQueryParams(dataset_metadata: MetadataDatasetItem, rules: Check[], sessionStartTs: Date): Promise<Map<string, Check[]>> {

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
                const now = sessionStartTs; // use session start timestamp to have consistent results across rules
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

async function loadRulesFromCustomDashboard(KEYCLOAK_ASSOCIATED_ROLE: string): Promise<Check[]> {
    const dashboards = await prisma.custom_dashboards.findMany({
        where: {
            user_role: KEYCLOAK_ASSOCIATED_ROLE,
            // id: 22
        },
        select: {
            user_id: true,
            name: true,
            test_definition_json: true,
            id: true
        }
    });

    const rules: Check[] = [];

    for (let i = 0; i < dashboards.length; i++) {
        const dashboard = dashboards[i];
        const definition = JSON.parse(dashboard.test_definition_json) as CustomDashboardDefinition;

        for (let j = 0; j < definition.checks.length; j++) {
            const check = definition.checks[j];
            const field = JSON.parse(check.field_name) as CustomDashboardFieldName;
            const op = check.operation === "=" ? "==" : check.operation;
            const compareLiteral = field.type === "number" ? String(Number(check.compare_value)) : JSON.stringify(check.compare_value);
            const expr = field.is_array
                ? `Array.isArray($.${field.name}) && $.${field.name}.every(v => v ${op} ${compareLiteral})`
                : `$.${field.name} ${op} ${compareLiteral}`;

            const rule: Check = {
                custom_dashboard_id: dashboard.id as unknown as number,
                owner: dashboard.user_id,
                name: dashboard.name,
                category: dashboard.name,
                description: `${definition.data_provider} | ${definition.dataset}`,
                data_scope_filters: {
                    dataset_shortname: definition.dataset,
                    dataset_dataspace: undefined,
                    dataset_apitype: definition.dataset_type,
                    apitype_timeseries_param_datatype: definition.timeseries.datatype,
                    apitype_timeseries_param_mperiod: definition.timeseries.mperiod,
                    apitype_timeseries_param_sactive: definition.timeseries.active_status === "only-active" ? "true" : undefined,
                    apitype_timeseries_param_sorigin: undefined,
                    apitype_timeseries_param_last_from_hours: undefined,
                    apitype_timeseries_param_last_to_hours: undefined
                },
                data_quality_rule: {
                    rule_language: "javascript",
                    rule_expression: expr
                }
            };

            rules.push(rule);
        }
    }

    return rules;
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

/*
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
 */

async function updateTestedRecords(testDatasetId: number, testedRecordCount: number): Promise<void> {
    await prisma.test_dataset.updateMany({
        where: {
            id: testDatasetId
        },
        data: {
            tested_records: testedRecordCount
        }
    });
}

async function processDatasetItems(p_test_dataset_id: number,dataset_page_json_item: DatasetPageItem[], dataset_rules: Check[], dataset_Shortname: string, start_number: number, sessionStartTs: Date,  KEYCLOAK_ASSOCIATED_ROLE: string): Promise<void> {
    // let tested_record_count = 0;
    const failed_records: TestDatasetRecordCheckFailedCreateInput[] = []
    for (let i = 0; i < dataset_page_json_item.length; i++) {
        // tested_record_count++;
        const obj = dataset_page_json_item[i]
        for (let rule of dataset_rules) {
             checkRecordWithRule(p_test_dataset_id, rule, obj, failed_records, dataset_Shortname, 'seq=' + (start_number + i), sessionStartTs, KEYCLOAK_ASSOCIATED_ROLE)
        }

    }
    await prisma.test_dataset_record_check_failed.createMany({ data: failed_records });
}
function checkRecordWithRule(p_test_dataset_id: number, rule: Check, obj: DatasetPageItem, failed_records: TestDatasetRecordCheckFailedCreateInput[], dataset_Shortname: string, rec_id: string, sessionStartTs: Date, KEYCLOAK_ASSOCIATED_ROLE: string) {
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
                        session_start_ts: sessionStartTs,
                        dataset_name: dataset_Shortname,
                        record_jsonpath: rec_id, // shold be unique
                        check_name: rule.name,
                        record_json: JSON.stringify(obj, null, 3),
                        problem_hint: '',
                        impacted_attributes_csv: '',
                        check_category: rule.category,
                        used_key: KEYCLOAK_ASSOCIATED_ROLE,
                        impacted_attribute_value: '',
                        owner: rule.owner,
                        test_dataset_id: p_test_dataset_id
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
