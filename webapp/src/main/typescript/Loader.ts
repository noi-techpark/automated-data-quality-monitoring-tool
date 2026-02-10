// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CommonWebComponent } from "./CommonWebComponent.js";
import template from './Loader.html?raw'

export class Loader extends CommonWebComponent
{
	constructor() {
		super(template)
	}
	
}

customElements.define('cs-loader', Loader)
