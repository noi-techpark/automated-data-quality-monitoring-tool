// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { initAuth } from './auth.js';
import { MainComponent } from './MainComponent.js';

async function main() {

    // initialize authentication before anything else
    await initAuth();

    const mainComponent = new MainComponent();
    mainComponent.setAttribute('data-testid','main-component')
    document.body.appendChild(mainComponent)

}

main();

