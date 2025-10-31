import cron from 'node-cron';

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
export const KEYCLOAK_BASE_URL = requireEnvVar('KEYCLOAK_BASE_URL');
export const METADATA_BASE_URL = requireEnvVar('METADATA_BASE_URL');
export const KEYCLOAK_ACCOUNTS_JSON = requireEnvVar('KEYCLOAK_ACCOUNTS_JSON');
export const DATASET_CONTENT_PAGE_LIMIT = requireEnvVar('DATASET_CONTENT_PAGE_LIMIT');
export const DEBUG_MODE_CACHE_ON = requireEnvVar('DEBUG_MODE_CACHE_ON', 'false').trim().toLowerCase() === 'true';


Object.entries(envValues).forEach(([key, value]) => {
  const ok = missingEnvKeys.includes(key) ? '❌' : '✅';
  console.log(`${ok} ${key} = ${value}`);
});

if (missingEnvKeys.length > 0) {
  console.error(`Give up, missing required environment variable, look for ❌`);
  process.exit(1);
}


/*
export const KEYCLOAK_ASSOCIATED_ROLE = requireEnvVar('KEYCLOAK_ASSOCIATED_ROLE', KEYCLOAK_CLIENT_ID_OPENDATA)
export const KEYCLOAK_CLIENT_ID = requireEnvVar('KEYCLOAK_CLIENT_ID', KEYCLOAK_CLIENT_ID_OPENDATA);
export const KEYCLOAK_REALM = requireEnvVar('KEYCLOAK_REALM','');
export const KEYCLOAK_CLIENT_SECRET = requireEnvVar('KEYCLOAK_CLIENT_SECRET','');
 */


cron.schedule('* * * * *', () => {
  console.log('running a task every minute');
});