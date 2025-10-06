import { getDatasetContent, getDatasetLists } from "./lib/odhDatasets";
import { recursiveJsonDatasetChecks } from "./lib/utils";
import prisma from "./lib/db";
import { getSessionStartTimestamp } from "./lib/session";
import fs from "fs";

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

async function fetch_json_with_optional_cache(url: string)
{
    const cache_name = `/tmp/ODH-CACHE-${url.replace(/[^a-zA-Z0-9-]/g,'_')}.json`
    if (DEBUG_MODE_CACHE_ON && fs.existsSync(cache_name))  
    {
        console.log(`using cache ${cache_name}`)
        const content = fs.readFileSync(cache_name).toString()
        return JSON.parse(content)
    }
    const response = await fetch(url);
    const json = await response.json()
    fs.writeFileSync(cache_name, JSON.stringify(json, null, 3))
    return json
}

const metadata_json: MetadataResponse = await fetch_json_with_optional_cache(METADATA_BASE_URL);

// console.log(metadata_json)

const rules = await prisma.rules.findMany({});
// console.log(rules)

for (let m = 0; m < metadata_json.Items.length; m++)
{
    const metadata_dataset_json = metadata_json.Items[m]
    console.log(metadata_dataset_json.Shortname)
    console.log(metadata_dataset_json.ApiUrl)
    console.log(metadata_dataset_json.Dataspace)
    console.log(metadata_dataset_json.ImageGallery?.[0].ImageUrl)

    const dataset_rules = rules.filter(r => r.datasetname_searchfilter == metadata_dataset_json.Shortname)
    // console.log(dataset_rules)

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
        continue
    }
    let tested_record_count = 0;
    for (let pageNumber = 1; pageNumber <= parseInt(DATASET_CONTENT_PAGE_LIMIT); pageNumber++)
    {
        const dataset_cache_name = `/tmp/ODH-DATASET-${metadata_dataset_json.Shortname}-${pageNumber}.json`
        const pageUrl = metadata_dataset_json.ApiUrl + ( metadata_dataset_json.ApiUrl.includes("?") ? '&' : '?' ) + `pagesize=1000&pagenumber=${pageNumber}`;
        const dataset_page_json: DatasetPage = await fetch_json_with_optional_cache(pageUrl)
        // console.log(dataset_page_json)
        if (dataset_page_json.Items.length == 0)
            break;
        const failed_records: any = []
        for (let i = 0; i < dataset_page_json.Items.length; i++)
        {
            tested_record_count++;
            const obj = dataset_page_json.Items[i]
            for (let rule of dataset_rules)
            {
                if (!rule.active)
                    continue
                switch(rule.type)
                {
                    case 'javascript':
                        const fn = new Function("$", `return ${rule.value};`);
                        try
                        {
                            const result = fn(obj);
                            if (typeof result != 'boolean')
                                throw new Error('rule code invalid, instead of boolean has returned a ' + (typeof result))
                            if (!result)
                            {
                                console.log(`rule ${rule.name} failed for ${obj.Id}`)
                                // await prisma.test_dataset_record_check_failed.create({
                                //    data: {
                                failed_records.push({
                                        session_start_ts: getSessionStartTimestamp(),
                                        dataset_name: metadata_dataset_json.Shortname,
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
                        catch (e)
                        {
                            console.log(e)
                        }
                    break;
                    default:
                        throw new Error('type not implemented ' + rule.type)
                }
            }

        }
        await prisma.test_dataset_record_check_failed.createMany({ data: failed_records });
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







/* 
    _@.GpsInfo.length > 0

    _@.GpsInfo.array_length(length).gt(0)
*/

/*
const datasetsList = await getDatasetLists();
for (let dataset_meta of datasetsList.Items)
{
    let page = 1
    while (true) { // page loop

        const datasetContent = await getDatasetContent(dataset_meta.Shortname, dataset_meta.ApiUrl, page);
        let nr_records = 0;
        for (let record of datasetContent.Items)
        {
            await recursiveJsonDatasetChecks(record, record, dataset_meta.Shortname, 'Items.' + nr_records, '');
            nr_records++
        }

        // save the number of records
        await prisma.test_dataset.update({
                where: {
                    session_start_ts_dataset_name: {
                        session_start_ts: getSessionStartTimestamp(),
                        dataset_name: dataset_meta.Shortname,
                    }
                },
                data: {
                    tested_records: nr_records
                }
            });
        if (page >= Number(process.env.DATASET_CONTENT_PAGE_LIMIT))
            break;
        if (datasetContent.NextPage === null)
            break;
        page++;
    }

}

console.log('end index.ts')
 */
/*
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

 */