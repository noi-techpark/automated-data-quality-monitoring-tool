// SPDX-FileCopyrightText: 2025 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import Keycloak from 'keycloak-js';
import { jwtDecode } from 'jwt-decode';
import { API3 } from './api/api3.js';
import { KEYCLOAK_URL, KEYCLOAK_REALM } from './config.js';

// https://www.keycloak.org/securing-apps/javascript-adapter

export const kc = new Keycloak({
    url: KEYCLOAK_URL,
    realm: KEYCLOAK_REALM,
    clientId: "odh-data-quality-web",
});

export async function initAuth() {

    const roleKey = 'used_key_role';
    await kc.init({
        onLoad: 'check-sso',
        // avoid full reload of page with check-sso & spa
        silentCheckSsoRedirectUri: `${location.origin}/silent-check-sso.html`,
    });

    if (!kc.authenticated) {
        sessionStorage.setItem(roleKey, 'opendata');
    } else {
        const roles = await API3.get_auth_user_roles();
        if (roles.length > 0) {
            const currentRole = sessionStorage.getItem(roleKey);
            if (!currentRole || !roles.includes(currentRole)) {
                sessionStorage.setItem(roleKey, roles[0]);
            }
        } else {
            sessionStorage.setItem(roleKey, 'opendata');
        }
    }
    
}
