import { getDatasetContent, getDatasetLists } from "./lib/odhDatasets";
import prisma from "./lib/db";
import { getSessionStartTimestamp } from "./lib/session";


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

const KEYCLOAK_CLIENT_ID_OPENDATA = 'opendata';

export const LOG_LEVEL = requireEnvVar('LOG_LEVEL', 'minimal');
export const DATABASE_URL = requireEnvVar('DATABASE_URL');
export const KEYCLOAK_BASE_URL = requireEnvVar('KEYCLOAK_BASE_URL');
export const KEYCLOAK_CLIENT_ID = requireEnvVar('KEYCLOAK_CLIENT_ID', KEYCLOAK_CLIENT_ID_OPENDATA);
export const KEYCLOAK_REALM = requireEnvVar('KEYCLOAK_REALM');
export const KEYCLOAK_CLIENT_SECRET = requireEnvVar('KEYCLOAK_CLIENT_SECRET');
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
    Shortname: string
    ApiUrl: string
    Dataspace: string,
    ImageGallery: MetadataDatasetImageGallery[]
}

interface MetadataResponse {
    Items: MetadataDatasetItem[]
}

interface DatasetPageItem {
    Id: string
}

interface DatasetPage {
    NextPage: string | null
    Items: DatasetPageItem[]
}



const metadata_json: MetadataResponse = await fetch_json_with_optional_cache(METADATA_BASE_URL);

const rules = await prisma.rules.findMany({});

for (let m = 0; m < metadata_json.Items.length; m++)
{
    const metadata_dataset_json = metadata_json.Items[m]
    console.log(metadata_dataset_json.Shortname)
    console.log(metadata_dataset_json.ApiUrl)
    console.log(metadata_dataset_json.Dataspace)
    console.log(metadata_dataset_json.ImageGallery?.[0].ImageUrl)

    const dataset_rules = rules.filter(r => r.active && r.datasetname_searchfilter == metadata_dataset_json.Shortname)
    // console.log(dataset_rules)

    processDataset(metadata_dataset_json, dataset_rules)
}


async function processDataset(metadata_dataset_json: MetadataDatasetItem, dataset_rules: any[]) {

        await prisma.test_dataset.create({
                        data: {
                            session_start_ts: getSessionStartTimestamp(),
                            dataset_name: metadata_dataset_json.Shortname,
                            dataset_dataspace: metadata_dataset_json.Dataspace,
                            dataset_img_url: metadata_dataset_json.ImageGallery?.[0].ImageUrl,
                            used_key: process.env.KEYCLOAK_CLIENT_ID
                        }
                    });

    if (dataset_rules.length == 0)
    {
        console.log('dataset senza regole')
        // TODO record that no rule was applied
        return
    }
    let tested_record_count = 0;
    for (let pageNumber = 1; pageNumber <= parseInt(DATASET_CONTENT_PAGE_LIMIT); pageNumber++)
    {
        const pageUrl = metadata_dataset_json.ApiUrl + ( metadata_dataset_json.ApiUrl.includes("?") ? '&' : '?' ) + `pagesize=1000&pagenumber=${pageNumber}`;
        const dataset_page_json: DatasetPage = await fetch_json_with_optional_cache(pageUrl)
        // console.log(dataset_page_json)
        if (dataset_page_json.Items.length == 0)
            break;
        tested_record_count += await processDatasetItems(dataset_page_json, dataset_rules, metadata_dataset_json.Shortname)
    }
    await prisma.test_dataset.update({
        where: {
            session_start_ts_dataset_name: {
                session_start_ts: getSessionStartTimestamp(),
                dataset_name: metadata_dataset_json.Shortname,
            }
        },
        data: {
            tested_records: tested_record_count
        }
    });

}

async function processDatasetItems(dataset_page_json: DatasetPage, dataset_rules: any[], dataset_Shortname: string): Promise<number> {
    let tested_record_count = 0;
    const failed_records: any = []
    for (let i = 0; i < dataset_page_json.Items.length; i++) {
        tested_record_count++;
        const obj = dataset_page_json.Items[i]
        for (let rule of dataset_rules) {
           checkRecordWithRule(rule, obj, failed_records, dataset_Shortname)
        }

    }
    await prisma.test_dataset_record_check_failed.createMany({ data: failed_records });
    return tested_record_count;
}

function checkRecordWithRule(rule: any, obj: DatasetPageItem, failed_records: any, dataset_Shortname: string) {
    switch (rule.type) {
        case 'javascript':
            const fn = new Function("$", `return ${rule.value};`);
            try {
                const result = fn(obj);
                if (typeof result != 'boolean')
                    throw new Error('rule code invalid, instead of boolean has returned a ' + (typeof result))
                if (!result) {
                    console.log(`rule ${rule.name} failed for ${obj.Id}`)
                    // await prisma.test_dataset_record_check_failed.create({
                    //    data: {
                    failed_records.push({
                        session_start_ts: getSessionStartTimestamp(),
                        dataset_name: dataset_Shortname,
                        record_jsonpath: obj.Id,
                        check_name: rule.name,
                        record_json: JSON.stringify(obj, null, 3),
                        problem_hint: '',
                        impacted_attributes_csv: '',
                        check_category: rule.category,
                        used_key: process.env.KEYCLOAK_CLIENT_ID,
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
            throw new Error('type not implemented ' + rule.type)
    }
}

