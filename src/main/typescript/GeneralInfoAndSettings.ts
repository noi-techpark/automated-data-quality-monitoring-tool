// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later


import { cs_cast, throwNPE } from "./quality.js";

export class GeneralInfoAndSettings extends HTMLElement
{
	
	private dataset_name
	private tested_records
	private failed_records
	private last_checked
	
	constructor()
	{
		super();
		const sroot = this.attachShadow({mode: 'open'});
		sroot.innerHTML = `
		<style>
			:host {
				border: 1px solid #ccc;
				margin: 0.6rem;
				border-radius: 0.4rem;
				padding: 0.4rem;
			}
			.row {
				display: flex;
				margin-bottom: 0.6rem;
				font-size: 0.8rem;
			}
		
			.row .label {
				font-weight: bold;
				display: inline-block;
				width: 8rem;
			}
			
			.row .data {
				width: 8rem;
			}
			
			.title {
				margin-top: 1rem;
				margin-bottom: 1rem;
				font-weight: bold;
			}

		</style>
		<div class="title">General Info &amp; Setting</div>
		<div>
			<div class="row dataset">
				<span class="label">dataset</span>
				<span class="data">data</span>
			</div>
			<div class="row tested_records">
				<span class="label">tested records</span>
				<span class="data">data</span>
			</div>
			<div class="row failed_records">
				<span class="label">failed records</span>
				<span class="data">data</span>
			</div>
			<div class="row last_checked">
				<span class="label">last checked</span>
				<span class="data">data</span>
			</div>
		</div>
		`
		
		this.dataset_name   = cs_cast(HTMLSpanElement, sroot.querySelector('.dataset .data'))
		this.tested_records = cs_cast(HTMLSpanElement, sroot.querySelector('.tested_records .data'))
		this.failed_records = cs_cast(HTMLSpanElement, sroot.querySelector('.failed_records .data'))
		this.last_checked   = cs_cast(HTMLSpanElement, sroot.querySelector('.last_checked .data'))
		
	}
	
	refresh(p_session_start_ts: string, p_dataset_name: string, p_failed_records: number, p_tot_records: number)
	{
		this.dataset_name.textContent = p_dataset_name;
		this.failed_records.textContent = '' + p_failed_records;
		this.tested_records.textContent = '' + p_tot_records
		
		const date = new Date(p_session_start_ts)
		const dateformat = new Intl.DateTimeFormat('it-IT', {
							year: 'numeric',
							month: '2-digit',
							day: '2-digit',
							hour: '2-digit',
							minute: "2-digit",
							timeZone: 'Europe/Rome'
						}).format(date)

		this.last_checked.textContent = dateformat
		
	}

}

customElements.define('cs-general-info-and-settings', GeneralInfoAndSettings)
