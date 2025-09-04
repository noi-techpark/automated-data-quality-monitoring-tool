import type { DatasetsList } from "../types/odhResponses";
import prisma from "./db";
import { getKeycloakToken } from "./auth";

export async function getDatasetLists(page?: number) {
    try {
        let rawList;
        let list;
        let delayMultiplier = 0;
        while (true) {
            if (process.env.KEYCLOAK_CLIENT_SECRET) {
                const token = await getKeycloakToken({});
                rawList = await fetch(`https://tourism.api.opendatahub.com/v1/MetaData?pagesize=100&pagenumber=${page ? page : 1}&origin=webcomp-datasets-list`,
                    {
                        headers: {
                            "Authorization": token!
                        }
                    }
                );
            } else {
                rawList = await fetch(`https://tourism.api.opendatahub.com/v1/MetaData?pagesize=100&pagenumber=${page ? page : 1}&origin=webcomp-datasets-list`);
            }
            if (rawList.status === 200) {
                const data = await rawList.text()
                const tempList = (await JSON.parse(data)) as DatasetsList;
                tempList.Items.map(async (dataset) => {
                    await prisma.test_dataset.upsert({
                        where: {
                            dataset_name_dataset_dataspace: {
                                dataset_name: dataset.Shortname || "",
                                dataset_dataspace: dataset.Dataspace || ""
                            }
                        },
                        create: {
                            dataset_name: dataset.Shortname || "",
                            dataset_dataspace: dataset.Dataspace || "",
                            dataset_img_url: Array.isArray(dataset.ImageGallery) && dataset.ImageGallery?.length > 0 ? dataset.ImageGallery[0]?.ImageUrl || "" : "",
                        },
                        update: {
                            dataset_name: dataset.Shortname || "",
                            dataset_dataspace: dataset.Dataspace || "",
                            dataset_img_url: Array.isArray(dataset.ImageGallery) && dataset.ImageGallery?.length > 0 ? dataset.ImageGallery[0]?.ImageUrl || "" : "",
                            session_start_ts: new Date()
                        }
                    })
                });
                list = tempList;
                delayMultiplier = 0;
                break;
            } else {
                const waitTime = rawList.headers.get("Retry-After");
                const waitSeconds = waitTime ? parseInt(waitTime, 10) : 5;
                console.log(`⚠️ Rate limited. Waiting for ${waitSeconds * delayMultiplier} seconds before retrying...`);
                await new Promise(resolve => setTimeout(resolve, waitSeconds * delayMultiplier * 1000));
                delayMultiplier++;
            }
            console.log(rawList)
        }

        return list;
    } catch {
        return {} as DatasetsList
    }
}

export async function getDatasetContent(datasetLink: string, pageNumber: number = 1) {
    try {
        let data;
        let delayMultiplier = 0;
        while (true) {
            let rawContent;
            const datasetLinkWithPagination = datasetLink.includes("?") ? `${datasetLink}&pagesize=100&pagenumber=${pageNumber}` : `${datasetLink}?pagesize=100&pagenumber=${pageNumber}`;
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
                delayMultiplier = 0;
                break;
            } else {
                const waitTime = rawContent.headers.get("Retry-After");
                const waitSeconds = waitTime ? parseInt(waitTime, 10) : 5;
                console.log(`⚠️ Rate limited. Waiting for ${waitSeconds * delayMultiplier} seconds before retrying...`);
                await new Promise(resolve => setTimeout(resolve, waitSeconds * delayMultiplier * 1000));
                delayMultiplier++;
            }
        }

        const content = await JSON.parse(data);
        return content;
    } catch {
        return {}
    }
}