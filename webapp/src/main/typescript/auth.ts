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

    const roleKey = 'used_key_role';
    if (!sessionStorage.getItem(roleKey)) {
        sessionStorage.setItem(roleKey, 'opendata');
    }

    await kc.init({
        onLoad: 'check-sso',
        // avoid full reload of page with check-sso & spa
        silentCheckSsoRedirectUri: `${location.origin}/silent-check-sso.html`,
    });
    
}
