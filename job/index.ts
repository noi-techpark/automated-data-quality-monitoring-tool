import { getDatasetContent, getDatasetLists } from "./lib/odhDatasets";
import prisma from "./lib/db";
import { getSessionStartTimestamp } from "./lib/session";
import xml2js from "xml2js"
import fs from "fs/promises"
import { xml2json } from 'xml-js';


import {fetch_json_with_optional_cache} from "./lib/utils";

console.log("\r\n\r\n          _ _               _           _           \r\n  ___  __| | |_    ___   __| |_  ___ __| |_____ _ _ \r\n \/ _ \\\/ _` | \' \\  |___| \/ _| \' \\\/ -_) _| \/ \/ -_) \'_|\r\n \\___\/\\__,_|_||_|       \\__|_||_\\___\\__|_\\_\\___|_|  \r\n                                                    \r\n\r\n");

const envValues: Record<string, string | undefined> = {};
const missingEnvKeys: string[] = [];


function requireEnvVar(key: string, defaultValue?: string): string {
  let value = process.env[key] ?? defaultValue;
  if (value === undefined)
  {
    missingEnvKeys.push(key);
    value = ''
  }
  envValues[key] = value;
  return value;
}

export const KEYCLOAK_CLIENT_ID_OPENDATA = 'opendata';

export const LOG_LEVEL = requireEnvVar('LOG_LEVEL', 'minimal');
export const DATABASE_URL = requireEnvVar('DATABASE_URL');
export const KEYCLOAK_BASE_URL = requireEnvVar('KEYCLOAK_BASE_URL','');
export const KEYCLOAK_CLIENT_ID = requireEnvVar('KEYCLOAK_CLIENT_ID', KEYCLOAK_CLIENT_ID_OPENDATA);
export const KEYCLOAK_REALM = requireEnvVar('KEYCLOAK_REALM','');
export const KEYCLOAK_CLIENT_SECRET = requireEnvVar('KEYCLOAK_CLIENT_SECRET','');
export const METADATA_BASE_URL = requireEnvVar('METADATA_BASE_URL');
export const DATASET_CONTENT_PAGE_LIMIT = requireEnvVar('DATASET_CONTENT_PAGE_LIMIT');
export const DEBUG_MODE_CACHE_ON = requireEnvVar('DEBUG_MODE_CACHE_ON', 'false');

Object.entries(envValues).forEach(([key, value]) => {
  const ok = missingEnvKeys.includes(key) ? '❌' : '✅';
  console.log(`${ok} ${key} = ${value}`);
});

if (missingEnvKeys.length > 0) {
  console.error(`Give up, missing required environment variable, look for ❌`);
  process.exit(1);
}

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

const group_rules_by_same_url: Record<string, DatasetRuleGroup> = await processRulesAndMetadata();

for (const [url, { metadata, rules }] of Object.entries(group_rules_by_same_url)) {
 
    console.log('Processing URL', url, 'with', rules.length, 'rules for dataset', metadata.Shortname, metadata.Dataspace, metadata.ApiType);

    const human_friendly_dataset_name = url === metadata.ApiUrl ? metadata.Shortname 
                                                                : metadata.Shortname + ' ' + url.replace(metadata.ApiUrl, '');
    await prisma.test_dataset.create({
                            data: {
                                session_start_ts: getSessionStartTimestamp(),
                                dataset_name: human_friendly_dataset_name,
                                dataset_dataspace: metadata.Dataspace,
                                dataset_img_url: metadata.ImageGallery?.[0].ImageUrl,
                                used_key: KEYCLOAK_CLIENT_ID
                            }
                        });

        let tested_record_count = 0;
        for (let pageNumber = 1; pageNumber <= parseInt(DATASET_CONTENT_PAGE_LIMIT); pageNumber++)
        {
            const pageUrl = url + (url.includes("?") ? '&' : '?' ) + `pagesize=1&pagenumber=${pageNumber}`;
            console.log("pageUrl", pageUrl)
            const dataset_page_json: DatasetPage = await fetch_json_with_optional_cache(pageUrl)
            
            const records = []

            if (Array.isArray(dataset_page_json.Items))
                records.push(...dataset_page_json.Items)

            if (Array.isArray(dataset_page_json.data))
                records.push(...dataset_page_json.data)

            if (records.length == 0)
                break;
            await processDatasetItems(records, rules, human_friendly_dataset_name, tested_record_count)
            tested_record_count += records.length
            await updateTestedRecords(human_friendly_dataset_name, tested_record_count);
        }
        await updateTestedRecords(human_friendly_dataset_name, tested_record_count);
}

async function processRulesAndMetadata(): Promise<Record<string, DatasetRuleGroup>> {

    const metadata_json: MetadataResponse = await fetch_json_with_optional_cache(METADATA_BASE_URL);

    const rules: Check[] = await loadRules();

    const group_rules_by_same_url: Record<string, DatasetRuleGroup> = {};

    for (const rule of rules) {
        
        for (const dataset_metadata of metadata_json.Items) {
        
            let scope_url = dataset_metadata.ApiUrl;

            let rest: any;
            const { dataset_shortname, dataset_dataspace, dataset_apitype, ...rest1 } = rule.data_scope_filters;
            const match_dataset_shortname =  dataset_shortname === undefined || dataset_shortname === '' || dataset_shortname === dataset_metadata.Shortname
            const match_dataset_dataspace =  dataset_dataspace === undefined || dataset_dataspace === '' || dataset_dataspace === dataset_metadata.Dataspace
            const match_dataset_apitype   =  dataset_apitype   === undefined || dataset_apitype   === '' || dataset_apitype   === dataset_metadata.ApiType
            rest = rest1

            if (dataset_apitype === 'timeseries') {

                const { apitype_timeseries_param_datatype, apitype_timeseries_param_mperiod,
                        apitype_timeseries_param_last_from_hours, apitype_timeseries_param_last_to_hours, ...rest2 } = rest;
                // build url like https://mobility.api.opendatahub.com/v2/flat/EnvironmentStation/NO2%20-%20Ossidi%20di%20azoto/2025-10-14T00:00:00.000Z/2025-10-17T23:59:59.999Z?limit=-1&distinct=true&select=sname,mvalue,mvalidtime&where=mperiod.eq.3600,sactive.eq.true,sorigin.eq.APPABZ
                scope_url += '/' + (apitype_timeseries_param_datatype ?? '*'); // datatype
                const now = new Date();
                const fromHours = Number(apitype_timeseries_param_last_from_hours ?? '24');
                const toHours = Number(apitype_timeseries_param_last_to_hours ?? '0');
                const fromDate = new Date(now.getTime() - fromHours * 3600_000);
                const toDate = new Date(now.getTime() - toHours * 3600_000);
                scope_url += '/' + fromDate.toISOString();
                scope_url += '/' + toDate.toISOString();
                scope_url += '?limit=-1&';    
                if (apitype_timeseries_param_mperiod !== undefined) {
                    scope_url += `mperiod=${apitype_timeseries_param_mperiod}&`;
                }

                // TODO endw with & or ? properly not both
                if (scope_url.endsWith('?') || scope_url.endsWith('&')) 
                    scope_url = scope_url.slice(0, -1);
                
                rest = rest2
            }

            if ( Object.keys(rest).length > 0) {
                throw new Error(`Unexpected filter attribute(s): ${ Object.keys(rest).join(', ')}`);
            }

            if (match_dataset_shortname && match_dataset_dataspace && match_dataset_apitype) {
            
                console.log('Evaluating rule', rule.name, 'for dataset', dataset_metadata.Shortname, 'with scope url', scope_url);

                if (!group_rules_by_same_url[scope_url]) {
                    group_rules_by_same_url[scope_url] = { metadata: dataset_metadata, rules: [] };
                }
                if (group_rules_by_same_url[scope_url].metadata !== dataset_metadata)
                    throw new Error('Internal error, conflicting metadata for same scope url ' + scope_url);
                group_rules_by_same_url[scope_url].rules.push(rule);

            }
        }
    }

    return group_rules_by_same_url;
    
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


async function processDataset(metadata_dataset_json: MetadataDatasetItem, dataset_rules: Check[]) {

    if (dataset_rules.length == 0)
    {
        console.error('====================== dataset without rules  ======================')
        console.log('Shortname', metadata_dataset_json.Shortname);
        console.log('Dataspace', metadata_dataset_json.Dataspace);
        console.log('ApiType', metadata_dataset_json.ApiType);
        console.error('=====================================================================')
        return
    }

    const additional_params: string[] = []

    for (let r of dataset_rules)
    {
        if (!additional_params.includes(r.additional_url_parameters ?? ''))
            additional_params.push(r.additional_url_parameters ?? '')
    }

    console.log(additional_params)

    for (let additional_par of additional_params)
    {
        const combined_shorname = metadata_dataset_json.Shortname + additional_par
        await prisma.test_dataset.create({
                            data: {
                                session_start_ts: getSessionStartTimestamp(),
                                dataset_name: combined_shorname,
                                dataset_dataspace: metadata_dataset_json.Dataspace,
                                dataset_img_url: metadata_dataset_json.ImageGallery?.[0].ImageUrl,
                                used_key: KEYCLOAK_CLIENT_ID
                            }
                        });



        let tested_record_count = 0;
        for (let pageNumber = 1; pageNumber <= parseInt(DATASET_CONTENT_PAGE_LIMIT); pageNumber++)
        {
            const pageUrl = metadata_dataset_json.ApiUrl + additional_par + ( (metadata_dataset_json.ApiUrl + additional_par).includes("?") ? '&' : '?' ) + `pagesize=1&pagenumber=${pageNumber}`;
            console.log("pageUrl", pageUrl)
            const dataset_page_json: DatasetPage = await fetch_json_with_optional_cache(pageUrl)
            
            const records = []

            if (Array.isArray(dataset_page_json.Items))
                records.push(...dataset_page_json.Items)

            if (Array.isArray(dataset_page_json.data))
                records.push(...dataset_page_json.data)

            if (records.length == 0)
                break;
            await processDatasetItems(records, dataset_rules, combined_shorname, tested_record_count, additional_par)
            tested_record_count += records.length
            await updateTestedRecords(combined_shorname, tested_record_count);
            if (additional_par != '') // don't' combine paging with additional params
                break;
        }
        await updateTestedRecords(combined_shorname, tested_record_count);
    }

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
    // return tested_record_count;
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
