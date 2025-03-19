// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later


import { Loader } from './Loader.js';
import {API3} from './api/api3.js';
import { cs_cast } from './quality.js';

/*

// in the custom element class:
this.shadowRoot.adoptedStyleSheets = [...document.adoptedStyleSheets, myCustomSheet];

https://stackoverflow.com/questions/28664207/importing-styles-into-a-web-component

 */

export class MenuComponent extends HTMLElement
{
	sroot
	submenus
	
	menuitemByName: {[k:string]: HTMLElement} = {}
	
	menuready_promise
	
	constructor()
	{
		super()
		this.sroot = this.attachShadow({ mode: 'open' })
		this.sroot.innerHTML = `
			<style>

				.title {
					padding: 0.4rem;
				}

				div.submenus {
					padding-left: 1rem;
					overflow: hidden;
				}
				div.submenus > * {
					margin:  0.4rem;
					padding: 0.2rem;
					cursor: pointer;
				}
				.selected {
					background: #666;
					color: white;
				}
				.title.close ~ .submenus {
					display: none;
				}
				.openclose {
					cursor: pointer;
				}
				.openclose:before {
					content: "▲"
				}
				.title.close .openclose:before {
					content: "▼"
				}
			</style>
			<div class="title"><span class="openclose"></span> standard dashboards</div>
			<div class="submenus"></div>
		`;
		this.submenus = cs_cast(HTMLElement, this.sroot.querySelector('div.submenus'));
		const title = cs_cast(HTMLElement, this.sroot.querySelector('div.title'))
		this.menuitemByName[''] = title
		
		title.onclick = () => { location.hash = ''}
		
		const openclose = cs_cast(HTMLElement, this.sroot.querySelector('span.openclose'));
		openclose.onclick = () => { title.classList.toggle('close') }

		let menuready_fun: (x: null) => void
		this.menuready_promise = new Promise(s => menuready_fun = s)
		const json_promise = API3.list__catchsolve_noiodh__test_dataset_max_ts_vw({})
		const loader = new Loader();
		this.sroot.appendChild(loader)
		json_promise.then(async (json) => {
			for (let dataset of json)
			{
				const menu1_submenu = document.createElement('div');
				menu1_submenu.textContent = (dataset.dataset_name);
				this.menuitemByName[dataset.dataset_name] = menu1_submenu
				this.submenus.appendChild(menu1_submenu);
				menu1_submenu.onclick = () => {
					location.hash = '#page=dataset-categories' +
					                '&dataset_name=' + dataset.dataset_name + 
									'&session_start_ts=' + dataset.session_start_ts 
									+ "&failed_records=" + dataset.failed_records
									+ "&tested_records=" + dataset.tested_records

				}
			}
			loader.remove();
			menuready_fun(null)
		})

	}
	
	async refresh()
	{
	}
	
	async selectItem(name: string)
	{
		await this.menuready_promise
		for (let k in this.menuitemByName)
		{
			const item = this.menuitemByName[k]
			if (name == k)
				item.classList.add('selected')
			else
				item.classList.remove('selected')
		}
	}
}

customElements.define('cs-menu-element', MenuComponent)
