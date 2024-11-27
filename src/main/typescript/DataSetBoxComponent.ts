/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */

import { cs_cast, throwNPE } from "./quality.js";

import { LabelAndData } from "./LabelAndData.js"
import { catchsolve_noiodh__test_dataset_max_ts_vw__row } from "./api/api3.js";

export class DataSetBoxComponent extends HTMLElement
{
	dtitle
	img
	checkrecs
	checkattr
	totissues
	lastupdate
	
	constructor()
	{
		super()
		const sroot = this.attachShadow({mode: 'open'})
		sroot.innerHTML = `
			<style>
				:host {
					padding: 0.5rem;
					border: 1px solid #ccc;
					margin: 0.5rem;
					border-radius: 4px;
					cursor: pointer;
					width: 14rem;
				}
				.title {
					font-weight: bold;
					margin-bottom: 1rem;
				}
				:host(:hover) .title {
					text-decoration: underline;
				}
				.ts {
					font-size: 0.7rem
				}
				
				
				
			</style>
			<img class="img">
			<div class="title">XXX</div>
			<cs-label-and-data class="checktrec">checked records</cs-label-and-data>
			<cs-label-and-data class="checkattr" style="display: none">checked attributes</cs-label-and-data>
			<cs-label-and-data class="totissues" xstyle="display: none">total issues</cs-label-and-data>
			<cs-label-and-data class="lastupdate">total issues</cs-label-and-data>
		`

		customElements.upgrade(sroot)

		this.checkrecs  = cs_cast(LabelAndData,      sroot.querySelector('.checktrec'))
		this.checkattr  = cs_cast(LabelAndData,      sroot.querySelector('.checkattr'))
		this.totissues  = cs_cast(LabelAndData,      sroot.querySelector('.totissues'))
		this.dtitle     = cs_cast(HTMLDivElement,    sroot.querySelector('.title'))
		this.img        = cs_cast(HTMLImageElement,  sroot.querySelector('.img'))
		this.lastupdate = cs_cast(LabelAndData,      sroot.querySelector('.lastupdate'))
				
		this.img.style.display = 'none';
		
		this.checkrecs.setLabel('checked recs')
		this.checkattr.setLabel('checked attrs')
		this.totissues.setLabel('tot issues')
		this.lastupdate.setLabel('last update')
		
		this.totissues.setSeverity("fail")
		this.totissues.setData('123')

	}

	
	refresh(dataset: catchsolve_noiodh__test_dataset_max_ts_vw__row)
	{
		/*
		this.dtitle.textContent=(dataset.Shortname);
		// console.log(dataset)
		if (dataset.ImageGallery != null && dataset.ImageGallery.length > 0)
			this.img.src=(dataset.ImageGallery[0].ImageUrl + "&width=160");
		 */
		
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
		this.checkrecs.setData('' + dataset.tested_records)
		this.checkattr.setData('123')
		this.totissues.setData('' + dataset.failed_records)
		this.lastupdate.setData(dateformat)
		this.onclick = () => {
			location.hash = '#page=dataset-categories' + '&dataset_name=' + dataset.dataset_name + "&session_start_ts=" + dataset.session_start_ts
		}
	}
}


customElements.define('cs-dataset-box', DataSetBoxComponent)
