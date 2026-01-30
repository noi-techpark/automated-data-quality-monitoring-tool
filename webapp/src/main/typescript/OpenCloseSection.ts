// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CommonWebComponent } from "./CommonWebComponent.js";
import { cs_cast, throwNPE } from "./quality.js";
import template from './OpenCloseSection.html?raw'

export class OpenCloseSection extends CommonWebComponent
{
	
	content
	open = true 
	openclose
	label
	actions
	
	onopen = () => {}
	
	constructor() {
		super(template)

		this.label = cs_cast(HTMLSpanElement, this.sroot.querySelector('.label'))
		this.actions = cs_cast(HTMLSpanElement, this.sroot.querySelector('.actions'))
		this.content = cs_cast(HTMLDivElement, this.sroot.querySelector('.content'))
		this.openclose = cs_cast(HTMLSpanElement, this.sroot.querySelector('.openclose'))
		this.openclose.onclick = () => {
			this.toggle();
		}
		this.label.onclick = this.openclose.onclick
		this.toggle();
	}
	
	toggle()
	{
		this.open = !this.open
		this.content.style.height     = !this.open ? '0rem' : 'auto'
		this.openclose.classList.toggle('close', !this.open)
		if (this.open)
		{
			this.content.textContent = '' // svuola la sezione
			this.onopen()
		}
	}
	
	async refresh(label: string, actions: string) {
		this.label.textContent = label
		this.actions.textContent = actions
	}
	
	addElementToContentArea(e: HTMLElement)
	{
		this.content.appendChild(e)
	}
}

customElements.define('cs-open-close-section', OpenCloseSection)
