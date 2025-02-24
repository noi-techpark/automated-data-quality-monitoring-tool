// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later

/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */

import { cs_cast, throwNPE } from "./quality.js";

export class SectionRow extends HTMLElement
{
	label

	constructor() {
		super()
		const sroot = this.attachShadow({ mode: 'open' })
		sroot.innerHTML = `
				<style>
					:host {
						display: block;
						border: 1px solid #eee;
						padding: 1rem;
					}
					
				</style>
				<span class="label">title</span>
				`

		customElements.upgrade(sroot)
		this.label = cs_cast(HTMLSpanElement, sroot.querySelector('.label'))

	}
	
	
	async refresh(s: string) {
		this.label.textContent = s;
	}
	
}

customElements.define('cs-section-row', SectionRow)
