// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CommonWebComponent } from "./CommonWebComponent.js";
import { cs_cast, throwNPE } from "./quality.js";
import template from './GeneralInfoAndSettings.html?raw'

export class GeneralInfoAndSettings extends CommonWebComponent
{
	
	private dataset_name
	private tested_records
	private failed_records
	private last_checked
	
	constructor()
	{
		super(template)
		
		this.dataset_name   = cs_cast(HTMLSpanElement, this.sroot.querySelector('.dataset .data'))
		this.tested_records = cs_cast(HTMLSpanElement, this.sroot.querySelector('.tested_records .data'))
		this.failed_records = cs_cast(HTMLSpanElement, this.sroot.querySelector('.failed_records .data'))
		this.last_checked   = cs_cast(HTMLSpanElement, this.sroot.querySelector('.last_checked .data'))
		
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
