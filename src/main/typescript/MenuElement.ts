/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */

import { Loader } from './Loader.js';
import {API3} from './api/api3.js';
import { cs_cast } from './quality.js';

/*

// in the custom element class:
this.shadowRoot.adoptedStyleSheets = [...document.adoptedStyleSheets, myCustomSheet];

https://stackoverflow.com/questions/28664207/importing-styles-into-a-web-component

 */

export class MenuElement extends HTMLElement
{
	sroot
	submenus
	
	menuitemByName: {[k:string]: HTMLElement} = {}
	
	constructor()
	{
		super()
		this.sroot = this.attachShadow({ mode: 'open' })
		this.sroot.innerHTML = `
			<style>
				div.submenus {
					padding-left: 1rem;
				}
				.selected {
					background: #ccc
				}
			</style>
			<div class="title">standard dashboards</div>
			<div class="submenus"></div>
		`;
		this.submenus = cs_cast(HTMLElement, this.sroot.querySelector('div.submenus'));
		this.menuitemByName[''] = cs_cast(HTMLElement, this.sroot.querySelector('div.title'))

		// customElements.upgrade(sroot)
		
		/*
		const menu1_submenus = document.createElement('div');
		menu1_submenus.className = ("menu1_submenus");
		sroot.appendChild(menu1_submenus);


		for (let i = 0; i < 10; i++)
		{
			const menu1_submenu = document.createElement('div');
			menu1_submenu.textContent = ("dashboard "+i);
			menu1_submenus.appendChild(menu1_submenu);
		}
		 */

	}
	
	async refresh()
	{
		const loader = new Loader();
		this.sroot.appendChild(loader);
		const json = await API3.list__catchsolve_noiodh__test_dataset_max_ts_vw({})
		await new Promise((s) =>  { setTimeout(s, 1000)})
		loader.remove();
		for (let dataset of json)
		{
			const menu1_submenu = document.createElement('div');
			menu1_submenu.textContent = (dataset.dataset_name);
			this.menuitemByName[dataset.dataset_name] = menu1_submenu
			this.submenus.appendChild(menu1_submenu);
		}
	}
	
	selectItem(name: string)
	{
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

customElements.define('cs-menu-element', MenuElement)
