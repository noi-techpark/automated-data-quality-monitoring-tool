// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CommonWebComponent } from "./CommonWebComponent.js";
import { cs_cast, throwNPE } from "./quality.js";

import { LabelAndData } from "./LabelAndData.js"
import { catchsolve_noiodh__standard_dashboards_latest__row } from "./api/api3.js";
import template from './DatasetCardComponent.html?raw'

interface DashboardOption {
	custom_dashboard_id: number
	name: string
}

export class DatasetCardComponent extends CommonWebComponent
{
	dtitle
	datasetQueryUrl
	img
	checkrecs
	checkattr
	failedrecs
	lastupdate

	#edit_hash: string
	#menu
	#menuButton
	#menuList
	#dashboardOptions: DashboardOption[]
	
	constructor()
	{
		super(template)

		this.checkrecs  = cs_cast(LabelAndData,      this.sroot.querySelector('.checktrec'))
		this.checkattr  = cs_cast(LabelAndData,      this.sroot.querySelector('.checkattr'))
		this.failedrecs = cs_cast(LabelAndData,      this.sroot.querySelector('.totissues'))
		this.dtitle     = cs_cast(HTMLDivElement,    this.sroot.querySelector('.title'))
		this.datasetQueryUrl = cs_cast(HTMLDivElement, this.sroot.querySelector('.dataset-query-url'))
		this.img        = cs_cast(HTMLImageElement,  this.sroot.querySelector('.img'))
		this.lastupdate = cs_cast(HTMLSpanElement,   this.sroot.querySelector('.lastupdate .data'))
		this.#menu      = cs_cast(HTMLDivElement,   this.sroot.querySelector('.menu'))
		this.#menuButton = cs_cast(HTMLButtonElement, this.sroot.querySelector('.menu-button'))
		this.#menuList = cs_cast(HTMLDivElement, this.sroot.querySelector('.menu-list'))
				
		// this.img.style.display = 'none';
		
		this.checkrecs.setLabel('total checks')
		this.checkattr.setLabel('checked attrs')
		this.failedrecs.setLabel('passed checks')

		this.#edit_hash = ''
		this.#dashboardOptions = []

		this.#menuButton.onclick = (event) => {
			event.stopPropagation()
			this.#menu.classList.toggle('open')
		}
		
		// this.failedrecs.setSeverity("fail")
		// this.failedrecs.setData('123')

	}

	set edit_hash(v: string) {
		this.#edit_hash = v
	}

	set menu_on_delete(v: (() => void) | null) {
		this.#resync_menu()
	}

	#resync_menu() {
		const showMenu = this.#dashboardOptions.length > 0
		this.#menu.classList.toggle('display-none', !showMenu)
		if (!showMenu)
			this.#menu.classList.remove('open')
	}

	#renderMenuList()
	{
		this.#menuList.textContent = ''
		for (let i = 0; i < this.#dashboardOptions.length; i++)
		{
			const option = this.#dashboardOptions[i]
			const item = document.createElement('div')
			item.classList.add('menu-item')
			item.textContent = option.name
			item.onclick = (event) => {
				event.stopPropagation()
				this.#menu.classList.remove('open')
				location.hash = '#customdataset?id=' + option.custom_dashboard_id
			}
			this.#menuList.appendChild(item)
		}
	}

	
	refresh(dataset: catchsolve_noiodh__standard_dashboards_latest__row)
	{
		const datestr = dataset.session_start_ts
		const date = new Date(datestr)
		
		const dateformat = new Intl.DateTimeFormat('it-IT', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: "2-digit",
			timeZone: 'Europe/Rome'
		}).format(date)
		
		this.dtitle.textContent = dataset.dataset_name
		this.datasetQueryUrl.textContent = dataset.dataset_subset ?? ''
		this.#dashboardOptions = dataset.custom_dashboards == null || dataset.custom_dashboards === 'null' ? [] : JSON.parse(dataset.custom_dashboards)
		this.#renderMenuList()
		this.#resync_menu()
		this.img.src = dataset.dataset_img_url.length > 0 ? dataset.dataset_img_url : 'dataset-placeholder.png'
		this.checkrecs.setData('' + dataset.tested_records)
		this.shadowRoot!.querySelector('div.wrapper')!.setAttribute('data-length', '' + dataset.tested_records)
		this.checkattr.setData('123')
		this.failedrecs.setData('' + (dataset.tested_records - dataset.failed_records))
		const quality_ratio = dataset.tested_records == 0 ? 100 : dataset.failed_records / dataset.tested_records
		/*
		if (dataset.tested_records > 0)
		{
			if (quality_ratio < 0.1)
				this.failedrecs.setQualityLevel("good")
			else if (quality_ratio < 0.3)
				this.failedrecs.setQualityLevel("warn")
			else
				this.failedrecs.setQualityLevel("fail")
		}
		 */
		this.lastupdate.textContent = dateformat
		this.onclick = () => {
			this.#menu.classList.remove('open')
			/*
			if (dataset.test_dataset_id != null)
				location.hash = '#page=dataset-categories&test_dataset_id=' + dataset.test_dataset_id
			else if (dataset.custom_dashboard_id != null)
				location.hash = '#customdataset?id=' + dataset.custom_dashboard_id
			*/
			location.hash = '#page=dataset-categories&test_dataset_ids=' + dataset.ids_csv
			window.scrollTo(0,0);
		}
	}
}


customElements.define('cs-dataset-box', DatasetCardComponent)
