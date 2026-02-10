// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CommonWebComponent } from "./CommonWebComponent.js";
import { cs_cast, throwNPE } from "./quality.js";

import { LabelAndData } from "./LabelAndData.js"
import { catchsolve_noiodh__test_dataset_max_ts_vw__row } from "./api/api3.js";
import template from './DatasetCardComponent.html?raw'

export class DatasetCardComponent extends CommonWebComponent
{
	dtitle
	img
	checkrecs
	checkattr
	failedrecs
	lastupdate

	#editdiv
	#edit_hash: string
	#menu
	#menuButton
	#menuList
	#menuEdit
	#menuDelete
	#menuDeleteHandler: (() => void) | null
	
	constructor()
	{
		super(template)

		this.checkrecs  = cs_cast(LabelAndData,      this.sroot.querySelector('.checktrec'))
		this.checkattr  = cs_cast(LabelAndData,      this.sroot.querySelector('.checkattr'))
		this.failedrecs = cs_cast(LabelAndData,      this.sroot.querySelector('.totissues'))
		this.dtitle     = cs_cast(HTMLDivElement,    this.sroot.querySelector('.title'))
		this.img        = cs_cast(HTMLImageElement,  this.sroot.querySelector('.img'))
		this.lastupdate = cs_cast(HTMLSpanElement,   this.sroot.querySelector('.lastupdate .data'))
		this.#editdiv   = cs_cast(HTMLDivElement,   this.sroot.querySelector('.edit'))
		this.#menu      = cs_cast(HTMLDivElement,   this.sroot.querySelector('.menu'))
		this.#menuButton = cs_cast(HTMLButtonElement, this.sroot.querySelector('.menu-button'))
		this.#menuList   = cs_cast(HTMLDivElement,   this.sroot.querySelector('.menu-list'))
		this.#menuEdit   = cs_cast(HTMLDivElement,   this.sroot.querySelector('.menu-item.edit'))
		this.#menuDelete = cs_cast(HTMLDivElement,   this.sroot.querySelector('.menu-item.delete'))
				
		// this.img.style.display = 'none';
		
		this.checkrecs.setLabel('total checks')
		this.checkattr.setLabel('checked attrs')
		this.failedrecs.setLabel('passed checks')

		this.#edit_hash = ''
		this.#menuDeleteHandler = null

		this.#menuButton.onclick = (event) => {
			event.stopPropagation()
			this.#menu.classList.toggle('open')
		}
		this.#menuEdit.onclick = (event) => {
			event.stopPropagation()
			this.#menu.classList.remove('open')
			location.hash = this.#edit_hash			
		}
		this.#menuDelete.onclick = (event) => {
			event.stopPropagation()
			this.#menu.classList.remove('open')
			this.#menuDeleteHandler?.()
		}
		/*
		document.addEventListener('click', (event) => {
			if (event.composedPath().includes(this)) {
				return
			}
			this.#menu.classList.remove('open')
		})
		 */
		
		// this.failedrecs.setSeverity("fail")
		// this.failedrecs.setData('123')

	}

	set edit_hash(v: string) {
		this.#edit_hash = v
	}

	set menu_on_delete(v: (() => void) | null) {
		this.#menuDeleteHandler = v
		this.#resync_menu()
	}

	#resync_menu() {
		const showMenu = this.#edit_hash !== ''
		this.#menu.classList.toggle('display-none', !showMenu)
		if (!showMenu) {
			this.#menu.classList.remove('open')
		}
	}

	
	refresh(dataset: catchsolve_noiodh__test_dataset_max_ts_vw__row)
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
		this.#editdiv.classList.toggle('display-none', this.#edit_hash === '')
		this.lastupdate.textContent = dateformat
		this.onclick = () => {
			this.#menu.classList.remove('open')
			const escapedDatasetName = encodeURIComponent(dataset.dataset_name ?? '')
			location.hash = '#page=dataset-categories' + '&dataset_name=' + escapedDatasetName 
							+ "&session_start_ts=" + dataset.session_start_ts
							+ "&failed_records=" + dataset.failed_records
							+ "&tested_records=" + dataset.tested_records
			window.scrollTo(0,0);
		}
	}
}


customElements.define('cs-dataset-box', DatasetCardComponent)
