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

export interface Check {
  name: string;
  category: string;
  description: string;
  dataset_shortname: string;
  dataset_dataspace: string;
  dataset_apitype: string;
  additional_url_parameters: string
  rule_language: string;
  rule_code: string;
}



const metadata_json: MetadataResponse = await fetch_json_with_optional_cache(METADATA_BASE_URL);

const checks_xml = await fs.readFile("checks.xml", 'utf-8')

// const jsonString = xml2json(checks_xml, { compact: true, spaces: 2 });
// console.log(jsonString)

const parser = new xml2js.Parser({ explicitArray: false });
const rules: ChecksRoot  = await parser.parseStringPromise(checks_xml)
if (!Array.isArray(rules.checks.check)) // fix xml2js problem when only one check
    rules.checks.check = [rules.checks.check]
// console.log(JSON.stringify(rules, null, 2))

// process.exit(0)

// const rules = await prisma.rules.findMany({});

for (let m = 0; m < metadata_json.Items.length; m++)
{
    const metadata_dataset_json = metadata_json.Items[m]
    console.log(metadata_dataset_json.Shortname)
    console.log(metadata_dataset_json.ApiUrl)
    console.log(metadata_dataset_json.Dataspace)
    console.log(metadata_dataset_json.ImageGallery?.[0].ImageUrl)


    const dataset_rules: Check[] = [];
    for (const rule of rules.checks.check) {
        const matchesShortname = rule.dataset_shortname == null || rule.dataset_shortname == ''  || rule.dataset_shortname === metadata_dataset_json.Shortname;
        const matchesDataspace = rule.dataset_dataspace == null || rule.dataset_dataspace   == '' || rule.dataset_dataspace === metadata_dataset_json.Dataspace;
        const matchesApiType   = rule.dataset_apitype   == null || rule.dataset_apitype     == '' || rule.dataset_apitype === metadata_dataset_json.ApiType;
        if (matchesShortname && matchesDataspace && matchesApiType) {
            dataset_rules.push(rule);
        }
    }
    // console.log(dataset_rules)

    try
    {
        await processDataset(metadata_dataset_json, dataset_rules)
    }
    catch (e)
    {
        console.error(e)
    }
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
            const pageUrl = metadata_dataset_json.ApiUrl + additional_par + ( (metadata_dataset_json.ApiUrl + additional_par).includes("?") ? '&' : '?' ) + `pagesize=100&pagenumber=${pageNumber}`;
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

async function processDatasetItems(dataset_page_json_item: DatasetPageItem[], dataset_rules: Check[], dataset_Shortname: string, start_number: number, additional_par: string): Promise<void> {
    // let tested_record_count = 0;
    const failed_records: any = []
    for (let i = 0; i < dataset_page_json_item.length; i++) {
        // tested_record_count++;
        const obj = dataset_page_json_item[i]
        for (let rule of dataset_rules) {
            if ((rule.additional_url_parameters ?? '') == additional_par)
               checkRecordWithRule(rule, obj, failed_records, dataset_Shortname, 'seq=' + (start_number + i))
        }

    }
    await prisma.test_dataset_record_check_failed.createMany({ data: failed_records });
    // return tested_record_count;
}

function checkRecordWithRule(rule: Check, obj: DatasetPageItem, failed_records: any, dataset_Shortname: string, rec_id: string) {
    switch (rule.rule_language) {
        case 'javascript':
            const fn = new Function("$", `return (${rule.rule_code});`);
            try {
                const result = fn(obj);
                if (typeof result != 'boolean')
                    throw new Error('rule code invalid, instead of boolean has returned a ' + (typeof result))
                if (!result) {
                    console.log(`rule ${rule.name} failed for ${obj}`)
                    // await prisma.test_dataset_record_check_failed.create({
                    //    data: {
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
                    //})
                }
            }
            catch (e) {
                console.log(e)
            }
            break;
        default:
            throw new Error('type not implemented ' + rule.rule_language)
    }
}
