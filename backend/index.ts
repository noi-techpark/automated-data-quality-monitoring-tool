import { getDatasetContent, getDatasetLists } from "./lib/odhDatasets";
import { recursiveJsonDatasetChecks } from "./lib/utils";
import prisma from "./lib/db";
import { getSessionStartTimestamp } from "./lib/session";

console.log("\r\n\r\n          _ _               _           _           \r\n  ___  __| | |_    ___   __| |_  ___ __| |_____ _ _ \r\n \/ _ \\\/ _` | \' \\  |___| \/ _| \' \\\/ -_) _| \/ \/ -_) \'_|\r\n \\___\/\\__,_|_||_|       \\__|_||_\\___\\__|_\\_\\___|_|  \r\n                                                    \r\n\r\n");
if (!process.env.DATABASE_URL || !process.env.KEYCLOAK_BASE_URL || !process.env.KEYCLOAK_REALM || !process.env.KEYCLOAK_CLIENT_ID) {
    console.error("Missing environment variables. Please set PORT, DATABASE_URL, KEYCLOAK_BASE_URL, KEYCLOAK_REALM, and KEYCLOAK_CLIENT_ID. (Did you forget to create the .env file?)");
    process.exit(1);
}

const datasetsList = await getDatasetLists();
for (let dataset_meta of datasetsList.Items)
{
    const datasetContent = await getDatasetContent(dataset_meta.Shortname, dataset_meta.ApiUrl, 1);
    let nr_records = 0;
    for (let record of datasetContent.Items)
    {
        await recursiveJsonDatasetChecks(record, dataset_meta.Shortname, 'Items.' + nr_records, '');
        nr_records++
    }

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

}

console.log('fine index.ts')

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