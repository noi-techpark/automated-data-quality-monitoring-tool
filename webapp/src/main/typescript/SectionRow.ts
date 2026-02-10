// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CommonWebComponent } from "./CommonWebComponent.js";
import { cs_cast, throwNPE } from "./quality.js";
import template from './SectionRow.html?raw'

export class SectionRow extends CommonWebComponent
{
	label

	constructor() {
		super(template)

		this.label = cs_cast(HTMLSpanElement, this.sroot.querySelector('.label'))

	}
	
	
	async refresh(s: string) {
		this.label.textContent = s;
	}
	
}

customElements.define('cs-section-row', SectionRow)
