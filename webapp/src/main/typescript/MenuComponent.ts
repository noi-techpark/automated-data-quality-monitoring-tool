// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CommonWebComponent } from './CommonWebComponent.js';
import { Loader } from './Loader.js';
import {API3, catchsolve_noiodh__custom_dashboards__row} from './api/api3.js';
import { cs_cast } from './quality.js';
import { kc } from './auth.js';
import template from './MenuComponent.html?raw'

export class MenuComponent extends CommonWebComponent
{
	submenus
	
	menuitemByName: {[k:string]: HTMLElement} = {}
	
	menuready_promise
	
	constructor()
	{
		super(template);
		this.submenus = cs_cast(HTMLElement, this.sroot.querySelector('div.submenus'));
		const submenusCustom = cs_cast(HTMLElement, this.sroot.querySelector('div.submenus_custom'));
		const title = cs_cast(HTMLElement, this.sroot.querySelector('div.title.standard-title'))
		const customTitle = cs_cast(HTMLElement, this.sroot.querySelector('div.title.custom-title'))
		this.menuitemByName[''] = title
		this.menuitemByName['custom'] = customTitle

		const isPublic: boolean = !kc.authenticated;

		customTitle.classList.toggle('display-none', isPublic)
		submenusCustom.classList.toggle('display-none', isPublic)
		
		title.onclick = () => {
			title.classList.toggle('close')
			location.hash = ''
		}
		customTitle.onclick = () => {
			customTitle.classList.toggle('close')
			location.hash = '#customdataset'
		}
		
		const openclose = cs_cast(HTMLElement, title.querySelector('span.openclose'));
		openclose.onclick = (event) => {
			event.stopPropagation()
			const wasClosed = title.classList.contains('close')
			title.classList.toggle('close')
			if (wasClosed) {
				customTitle.classList.add('close')
			} else {
				customTitle.classList.remove('close')
			}
		}
		const opencloseCustom = cs_cast(HTMLElement, customTitle.querySelector('span.openclose'));
		opencloseCustom.onclick = (event) => {
			event.stopPropagation()
			const wasClosed = customTitle.classList.contains('close')
			customTitle.classList.toggle('close')
			if (wasClosed) {
				title.classList.add('close')
			} else {
				title.classList.remove('close')
			}
		}


		let menuready_fun: (x: null) => void
		this.menuready_promise = new Promise(s => menuready_fun = s);
		const used_key = sessionStorage.getItem('used_key_role')!
		const json_promise = API3.list__catchsolve_noiodh__custom_dashboards({used_key: used_key, kind: 'standard'})
		const custom_dashboards_promise = API3.list__catchsolve_noiodh__custom_dashboards({used_key: used_key, kind: 'custom'})
		const loader = new Loader();
		this.sroot.appendChild(loader)
		Promise.all([json_promise, custom_dashboards_promise]).then(([json, customDashboards]) => {
			/*
			const datasetByName = new Map(json.map((dataset) => [dataset.dataset_name, dataset]))
			const datasetByCustomDashboardId = new Map(
				customDashboards.map((dashboard) => {
					const definition = JSON.parse(dashboard.test_definition_json)
					return [dashboard.id, datasetByName.get(definition.dataset)]
				})
			)
			 */
			for (let dataset of json)
			{
				const menu1_submenu = document.createElement('div');
				menu1_submenu.textContent = (dataset.dataset_name);
				this.menuitemByName[dataset.dataset_name] = menu1_submenu
				this.submenus.appendChild(menu1_submenu);
				menu1_submenu.onclick = () => {
					location.hash = '#page=dataset-categories&test_dataset_ids=' + dataset.ids_csv
				}
			}
			for (let dashboard of customDashboards)
			{
				const customDashboardsList = dashboard.custom_dashboards == null || dashboard.custom_dashboards === 'null' ? [] : JSON.parse(dashboard.custom_dashboards)
				const firstCustomDashboardId = customDashboardsList.length === 0 ? '' : customDashboardsList[0].custom_dashboard_id
				const menuCustom = document.createElement('div');
				menuCustom.className = 'flex-row'
				const label = document.createElement('span');
				label.textContent = dashboard.dataset_name;
				label.className = 'flex-grow'
				menuCustom.onclick = () => {
					location.hash = dashboard.ids_csv === '' ? `#customdataset?id=${firstCustomDashboardId}` : '#page=dataset-categories&test_dataset_ids=' + dashboard.ids_csv
				};
				// TODO
				// this.menuitemByName[`custom:${dashboard.id}`] = menuCustom
				menuCustom.appendChild(label);
				submenusCustom.appendChild(menuCustom);
			}
			loader.remove();
			menuready_fun(null)
		});

	}
	
	async refresh()
	{
	}
	
	async selectItem(name: string)
	{
		await this.menuready_promise
		if (!(name in this.menuitemByName) && name.startsWith('custom:')) {
			name = 'custom'
		}
		for (let k in this.menuitemByName)
		{
			const item = this.menuitemByName[k]
			if (name === k)
				item.classList.add('selected')
			else
				item.classList.remove('selected')
		}
	}
}

customElements.define('cs-menu-element', MenuComponent)
