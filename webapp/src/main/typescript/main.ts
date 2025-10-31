// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import Keycloak from 'keycloak-js';


import { MainComponent } from './MainComponent.js'
import { kc, initAuth } from './auth.js';



async function main() {

    // initialize authentication before anything else
    await initAuth();

    const mainComponent = new MainComponent();
    document.body.appendChild(mainComponent)

}

main();