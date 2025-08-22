
import type { DatasetsList } from "../types/odhResponses";
import prisma from "./db";
import { getKeycloakToken } from "./auth";

export async function getDatasetLists(page?: number) {
    let rawList;
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
    const data = await rawList.text()
    try {
        const list = (await JSON.parse(data)) as DatasetsList;
        list.Items.map(async (dataset) => {
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
        })
        return list;
    } catch {
        return {} as DatasetsList
    }
}

export async function getDatasetContent(datasetLink: string) {
    let rawContent;
    if (process.env.KEYCLOAK_CLIENT_SECRET) {
        const token = await getKeycloakToken({});
        rawContent = await fetch(datasetLink,
            {
                headers: {
                    "Authorization": token!
                }
            }
        );
    } else {
        rawContent = await fetch(datasetLink);
    }

    const data = await rawContent.text()
    try {
        const content = await JSON.parse(data);
        return content;
    } catch {
        return {}
    }
}