let cachedToken: string | null = null;
let tokenExpiry: number | null = null;
interface KeycloakTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  token_type: string;
  'not-before-policy': number;
  scope: string;
  [key: string]: unknown;
}

export async function getKeycloakToken(headers: Record<string, string> = {}): Promise<string | null> {
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return `Bearer ${cachedToken}`;
  }
  const url = `${process.env.KEYCLOAK_BASE_URL}realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`;

  const body = new URLSearchParams({
    client_id: process.env.KEYCLOAK_CLIENT_ID ?? '',
    client_secret: process.env.KEYCLOAK_CLIENT_SECRET ?? '',
    grant_type: 'client_credentials',
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...headers,
      },
      body,
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Failed to fetch token: ${response.status} ${response.statusText}\nResponse: ${errorText}`);
      process.exit(1);
    }

    const data = (await response.json()) as KeycloakTokenResponse;

    if (data.access_token && data.expires_in) {
      cachedToken = data.access_token;
      tokenExpiry = Date.now() + data.expires_in * 1000 - 30000;
      return `Bearer ${cachedToken}`;
    } else {
      console.error('No access token received from Keycloak');
      process.exit(1);
    }
  } catch (error) {
    console.error('Error fetching Keycloak token:', error);
    process.exit(1);
  }
}

export function clearTokenCache() {
  cachedToken = null;
  tokenExpiry = null;
}

export const censorKey = (s: string) => {
  if (!s) return s;
  const len = s.length;
  const keepCount = Math.ceil(len * 0.3);
  const maskedCount = Math.max(0, len - keepCount);
  return s.slice(0, keepCount) + "*".repeat(maskedCount);
};
