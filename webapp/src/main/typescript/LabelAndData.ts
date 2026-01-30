// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CommonWebComponent } from "./CommonWebComponent.js";
import { cs_cast } from "./quality.js";
import template from './LabelAndData.html?raw'

export class LabelAndData extends CommonWebComponent
{
	label
	data
	
	private state: {
		labelValue: string
		dataValue: string
		qualityLevel: undefined | "good" | "warn" | "fail"
	}
	
	constructor()
	{
		super(template)
		
		this.label = cs_cast(HTMLSpanElement, this.sroot.querySelector('.label'))
		this.data  = cs_cast(HTMLSpanElement, this.sroot.querySelector('.data'))
		this.state = {
			labelValue: this.getAttribute('label') !== null ? this.getAttribute('label')! : 'label',
			dataValue: this.data.textContent ?? '',
			qualityLevel: undefined,
		}
		this.#resync_derived_resources()
		
	}
	
	setLabel(s: string)
	{
		if (this.state.labelValue === s)
			return
		this.state.labelValue = s
		this.#resync_derived_resources()
	}

	setData(s: string)
	{
		if (this.state.dataValue === s)
			return
		this.state.dataValue = s
		this.#resync_derived_resources()
	}
	
	setQualityLevel(severity: "good" | "warn" | "fail")
	{
		if (this.state.qualityLevel === severity)
			return
		this.state.qualityLevel = severity
		this.#resync_derived_resources()
	}

	#resync_derived_resources(): void
	{
		this.label.textContent = this.state.labelValue
		this.data.textContent = this.state.dataValue
		this.classList.remove("good", "warn", "fail")
		if (this.state.qualityLevel !== undefined)
			this.classList.add(this.state.qualityLevel)
	}
	
}

customElements.define('cs-label-and-data', LabelAndData)
