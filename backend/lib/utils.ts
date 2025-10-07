import { DEBUG_MODE_CACHE_ON } from "..";
import fs from "fs";

export async function fetch_json_with_optional_cache(url: string)
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
