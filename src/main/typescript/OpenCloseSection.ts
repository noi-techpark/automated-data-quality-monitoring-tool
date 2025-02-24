// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later

/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */

import { cs_cast, throwNPE } from "./quality.js";

export class OpenCloseSection extends HTMLElement
{
	
	content
	open = true 
	openclose
	label
	actions
	
	onopen = () => {}
	
	constructor() {
		super()
		const sroot = this.attachShadow({ mode: 'open' })
		sroot.innerHTML = `
				<style>
					:host {
						display: block;
					}
					.header {
						display: flex;
						align-items: center;
					}
					.label {
						flex-grow: 1;
						cursor: pointer;
						padding: 0.4rem;
						user-select: none;
					}
					.openclose {
						cursor: pointer;
						padding: 0.4rem;
						user-select: none;
					}
					.content {
						overflow: hidden;
						transition: transform 1s;
						transform-origin: top;
					}
					
					span.label::before {
					  content: "";
					  display: inline-block;
					  width: 8px;
					  height: 8px;
					  background-color: red;
					  border-radius: 50%;
					  margin-right: 5px;
					}
					
				</style>
				<div class="header">
				<span class="label">title</span>
				<span class="actions">actions</span>
				<span class="openclose"></span>
				</div>
				<div class="content"></div>
				`

		customElements.upgrade(sroot)
		this.label = cs_cast(HTMLSpanElement, sroot.querySelector('.label'))
		this.actions = cs_cast(HTMLSpanElement, sroot.querySelector('.actions'))
		this.content = cs_cast(HTMLDivElement, sroot.querySelector('.content'))
		this.openclose = cs_cast(HTMLSpanElement, sroot.querySelector('.openclose'))
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
		this.openclose.textContent    = !this.open ? '▼' : '▲'
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
