import cron from 'node-cron';
import { readFileSync } from 'fs';
import path from 'path';
import { doTestFor } from '.';

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

const LOG_LEVEL = requireEnvVar('LOG_LEVEL', 'minimal');
const DATABASE_URL = requireEnvVar('DATABASE_URL');
const KEYCLOAK_BASE_URL = requireEnvVar('KEYCLOAK_BASE_URL');
const METADATA_BASE_URL = requireEnvVar('METADATA_BASE_URL');
const KEYCLOAK_ACCOUNTS_JSON = requireEnvVar('KEYCLOAK_ACCOUNTS_JSON');
const CRON_SCHEDULE = requireEnvVar('CRON_SCHEDULE');
const DATASET_CONTENT_PAGE_LIMIT = requireEnvVar('DATASET_CONTENT_PAGE_LIMIT');
const DEBUG_MODE_CACHE_ON = requireEnvVar('DEBUG_MODE_CACHE_ON', 'false').trim().toLowerCase() === 'true';


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

export interface KeycloakAccountConfig {
  CLIENT_ID: string;
  REALM: string;
  CLIENT_SECRET: string;
  ASSOCIATED_ROLE: string;
}


const KEYCLOAK_ACCOUNTS: KeycloakAccountConfig[] = JSON.parse(readFileSync(KEYCLOAK_ACCOUNTS_JSON, 'utf8'));

console.log(`Loaded ${KEYCLOAK_ACCOUNTS.length} Keycloak account(s) from ${KEYCLOAK_ACCOUNTS_JSON}`);



if (CRON_SCHEDULE === '') {
    console.log('No CRON_SCHEDULE provided, running once and exiting');
    await onTick();
    process.exit(0);
}

console.log(`Scheduling cron job with schedule: ${CRON_SCHEDULE}`);
cron.schedule(CRON_SCHEDULE,async  () => {
   await onTick()
});

async function onTick() {
    for(let account of KEYCLOAK_ACCOUNTS) {
        const test_start_ts = new Date();
        console.log('Cron job executed at', test_start_ts.toISOString());
        console.log(`Account for client_id=${account.CLIENT_ID}, realm=${account.REALM}, associated_role=${account.ASSOCIATED_ROLE}`);
        await doTestFor(
          test_start_ts,
          KEYCLOAK_BASE_URL,
          account.CLIENT_ID,
          account.REALM,
          account.CLIENT_SECRET,
          account.ASSOCIATED_ROLE,
          LOG_LEVEL,
          DATABASE_URL,
          METADATA_BASE_URL,
          DATASET_CONTENT_PAGE_LIMIT,
          DEBUG_MODE_CACHE_ON,
        );
    }
}