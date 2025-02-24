// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later

/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */

import { cs_cast, throwNPE } from "./quality.js";

export class LabelAndData extends HTMLElement
{
	label
	data 
	
	constructor()
	{
		super();
		const sroot = this.attachShadow({mode: 'open'});
		sroot.innerHTML = `
		<style>
			:host {
				display: flex;
				border-top: 1px solid #ccc;
				padding-top: 0.3rem;
				padding-bottom: 0.3rem;
				align-items: center;
			}
			span {
				font-size: 0.7rem;
			}
			span.label {
				flex-grow: 1;
				margin-right: 0.3rem;
				padding: 0.2rem
			}
			span.data {
				padding: 0.2rem;
				border-radius: 0.3rem;
				margin-right: 0.3rem;
				background-color: var(--dark-background);
				color: #ddd;
				min-width: 2rem;
				text-align: right;
			}
			:host(.fail) span.label {
				background-color: #faa;
				color: #400;
				font-weight: bold;
			}
			:host(.good) span.label {
				background-color: #afa;
				color: #040;
				font-weight: bold;
			}
			:host(.warn) span.label {
				background-color: #ffa;
				color: #440;
				font-weight: bold;
			}
		</style>
		<span class="data">.</span>
		<span class="label"></span>
		`
		
		this.label = cs_cast(HTMLSpanElement, sroot.querySelector('.label'))
		this.setLabel(this.getAttribute('label') !== null ? this.getAttribute('label')! : 'label')
		this.data  = cs_cast(HTMLSpanElement, sroot.querySelector('.data'))
		
	}
	
	setLabel(s: string)
	{
		this.label.textContent = s
	}

	setData(s: string)
	{
		this.data.textContent = s
	}
	
	setQualityLevel(severity: "good" | "warn" | "fail")
	{
		this.classList.add(severity)
	}
	
}

customElements.define('cs-label-and-data', LabelAndData)
