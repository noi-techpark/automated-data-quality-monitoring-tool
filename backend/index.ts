import { getDatasetLists } from "./lib/odhDatasets";
import { recursiveJsonChecks } from "./lib/utils";

console.log("\r\n\r\n          _ _               _           _           \r\n  ___  __| | |_    ___   __| |_  ___ __| |_____ _ _ \r\n \/ _ \\\/ _` | \' \\  |___| \/ _| \' \\\/ -_) _| \/ \/ -_) \'_|\r\n \\___\/\\__,_|_||_|       \\__|_||_\\___\\__|_\\_\\___|_|  \r\n                                                    \r\n\r\n");
if (!process.env.DATABASE_URL || !process.env.KEYCLOAK_BASE_URL || !process.env.KEYCLOAK_REALM || !process.env.KEYCLOAK_CLIENT_ID) {
    console.error("Missing environment variables. Please set PORT, DATABASE_URL, KEYCLOAK_BASE_URL, KEYCLOAK_REALM, and KEYCLOAK_CLIENT_ID. (Did you forget to create the .env file?)");
    process.exit(1);
}

let page = 1;
while (true) {
    const datasetsList = await getDatasetLists(page);
    if (!datasetsList || !datasetsList.Items || datasetsList.Items.length === 0) break;
    recursiveJsonChecks(datasetsList, new Set<string>());
    if (datasetsList.Items.length < 100) break;
    page++;
}