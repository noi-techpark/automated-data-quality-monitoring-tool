import { DEBUG_MODE_CACHE_ON, KEYCLOAK_ASSOCIATED_ROLE, KEYCLOAK_BASE_URL, KEYCLOAK_CLIENT_ID, KEYCLOAK_CLIENT_ID_OPENDATA, KEYCLOAK_CLIENT_SECRET, KEYCLOAK_REALM } from "..";
import fs from "fs";

export async function fetch_json_with_optional_cache(url: string)
{
    const cache_name = `/tmp/ODH-CACHE-${KEYCLOAK_CLIENT_ID}-${url.replace(/[^a-zA-Z0-9-]/g,'_')}.json`
    if (DEBUG_MODE_CACHE_ON )
      if (fs.existsSync(cache_name))  
      {
          console.log(`using cache ${cache_name}`)
          const content = fs.readFileSync(cache_name).toString()
          return JSON.parse(content)
      }
    let fetch_options: any = { headers: {}}
    if (KEYCLOAK_CLIENT_ID != KEYCLOAK_CLIENT_ID_OPENDATA)
    {
      if (KEYCLOAK_ASSOCIATED_ROLE == KEYCLOAK_CLIENT_ID_OPENDATA)
        throw new Error(`Cannot use ODH client role (${KEYCLOAK_ASSOCIATED_ROLE}) with non open client id (${KEYCLOAK_CLIENT_ID})`)  
      fetch_options.headers.Authorization = await getKeycloakToken()
    }
    const response = await fetch(url, fetch_options);
     if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Failed to fetch : ${response.status} ${response.statusText}\nResponse: ${errorText}`);
        throw new Error('Failed to fetch')
    }
    const json = await response.json()
    if (DEBUG_MODE_CACHE_ON)
      fs.writeFileSync(cache_name, JSON.stringify(json, null, 3))
    return json
}

async function getKeycloakToken() {
    const url = `${KEYCLOAK_BASE_URL}realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`;
    const body = new URLSearchParams({
        client_id: KEYCLOAK_CLIENT_ID,
        client_secret: KEYCLOAK_CLIENT_SECRET,
        grant_type: 'client_credentials',
    });
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body,
    });
    if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Failed to fetch token: ${response.status} ${response.statusText}\nResponse: ${errorText}`);
        throw new Error('Failed to get access token')
    }
    const data = await response.json();
    const access_token = data.access_token;
    // console.log(access_token)
    return `Bearer ${access_token}`;
}
