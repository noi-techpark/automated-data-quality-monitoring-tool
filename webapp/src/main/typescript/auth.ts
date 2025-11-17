// SPDX-FileCopyrightText: 2025 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import Keycloak from 'keycloak-js';
import { jwtDecode } from 'jwt-decode';

// https://www.keycloak.org/securing-apps/javascript-adapter

export const kc = new Keycloak({
    url: "https://auth.opendatahub.com/auth/",
    realm: "noi",
    clientId: "odh-data-quality-web",
});

export async function initAuth() {
    await kc.init({
        onLoad: 'check-sso',
        // avoid full reload of page with check-sso & spa
        silentCheckSsoRedirectUri: `${location.origin}/silent-check-sso.html`,
    });
}

function getDecodedToken(): any {
    console.log('kc auth', kc);
    const token = kc.token!;
    console.log('token', token);
    const decoded: any = jwtDecode(token);
    return decoded;
}

export function getUsedKeyRole(): string {
    if (!kc.authenticated) {
        return 'opendata';
    }
    const decoded: any = getDecodedToken();
    const resourceAccess = decoded.resource_access ?? {};
    for (const key in resourceAccess) {
        const access = resourceAccess[key];
        const roles = access.roles ?? [];
        if (roles.includes("BDP_BLC")) {
            return "blc";
        }
        if (roles.includes("IDM")) {
            return "idm";
        }
    }
    return 'opendata';
}
