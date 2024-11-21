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
			}
			span.data {
				font-weight: bold;
				padding: 0.2rem;
				border-radius: 0.3rem;
			}
			span.data.fail {
				background-color: #fcc;
				color: #833;
			}
		</style>
		<span class="label">label</span>
		<span class="data">.</span>
		`
		
		this.label = cs_cast(HTMLSpanElement, sroot.querySelector('.label'))
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
	
	setSeverity(severity: "info" | "warn" | "fail")
	{
		this.data.classList.add(severity)
	}
	
}

customElements.define('cs-label-and-data', LabelAndData)
