import type { DatasetsList } from "../types/odhResponses";
import prisma from "./db";
import { writeFile } from "fs/promises";
import { censorKey, getKeycloakToken } from "./auth";
import { getSessionStartTimestamp } from "./session";

export async function getDatasetLists() {
    try {
        let list;
        let delayMultiplier = 0;
        const sessionStartTs = getSessionStartTimestamp();
        while (true) {

            const metadataUrl = process.env.METADATA_BASE_URL!
            const rawList = await fetch(metadataUrl);
            
            if (rawList.status === 200) {
                const data = await rawList.text()
                const tempList = (await JSON.parse(data)) as DatasetsList;
                tempList.Items.map(async (dataset) => {
                    await prisma.test_dataset.create({
                        data: {
                            session_start_ts: sessionStartTs,
                            dataset_name: dataset.Shortname || "",
                            dataset_dataspace: dataset.Dataspace || "",
                            dataset_img_url: Array.isArray(dataset.ImageGallery) && dataset.ImageGallery?.length > 0 ? dataset.ImageGallery[0]?.ImageUrl || "" : "",
                            used_key: process.env.KEYCLOAK_CLIENT_ID || "public"
                        }
                    });
                });
                list = tempList;
                delayMultiplier = 0;
                break;
            } else if (rawList.status == 429) {
                const waitTime = rawList.headers.get("Retry-After");
                const waitSeconds = waitTime ? parseInt(waitTime, 10) : 5;
                console.log(`⚠️ Rate limited. Waiting for ${waitSeconds * delayMultiplier} seconds before retrying...`);
                await new Promise(resolve => setTimeout(resolve, waitSeconds * delayMultiplier * 1000));
                delayMultiplier++;
            }
        }
        return list;
    } catch (e) {
        console.error(`❌ Error fetching dataset list:`, e);
        return {} as DatasetsList
    }
}

export async function getDatasetContent(datasetName: string, datasetLink: string, pageNumber: number = 1) {
    try {
        let data;
        let delayMultiplier = 0;
        while (true) {
            let rawContent;
            const datasetLinkWithPagination = datasetLink + ( datasetLink.includes("?") ? '&' : '?' ) + `pagesize=1&pagenumber=${pageNumber}`;
            if (process.env.KEYCLOAK_CLIENT_SECRET) {
                const token = await getKeycloakToken({});
                rawContent = await fetch(datasetLinkWithPagination,
                    {
                        headers: {
                            "Authorization": token!
                        }
                    }
                );
            } else {
                rawContent = await fetch(datasetLinkWithPagination);
            }
            if (rawContent.status === 200) {
                data = await rawContent.text();
                // Writes the content to a temporary file to verify differences with or without the key...
                // await writeFile("/tmp/a.json", data, "utf-8");
                delayMultiplier = 0;
                break;
            } else {
                if (rawContent.status === 429) {
                    const waitTime = rawContent.headers.get("Retry-After");
                    const waitSeconds = waitTime ? parseInt(waitTime, 10) : 5;
                    console.log(`⚠️ Rate limited. Waiting for ${waitSeconds * delayMultiplier} seconds before retrying...`);
                    await new Promise(resolve => setTimeout(resolve, waitSeconds * delayMultiplier * 1000));
                    delayMultiplier++;
                } else {
                    throw new Error(`Failed to fetch dataset content from ${datasetLinkWithPagination}`);
                }
            }
        }

        const content = await JSON.parse(data);
        return content;
    } catch (e) {
        console.error(`❌ Error fetching dataset content from ${datasetLink}:`, e);
        console.log(`Dataset Name: ${datasetName}`);
        await prisma.test_dataset.update({
            where: {
                session_start_ts_dataset_name: {
                    session_start_ts: getSessionStartTimestamp(),
                    dataset_name: datasetName,
                }
            },
            data: {
                errors: String(e)
            }
        })
        return {}
    }
}
