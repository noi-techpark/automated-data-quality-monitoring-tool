/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */

import { cs_cast, throwNPE } from "./quality.js";

import { LabelAndData } from "./LabelAndData.js"
import { catchsolve_noiodh__test_dataset_max_ts_vw__row } from "./api/api3.js";

export class DatasetCardComponent extends HTMLElement
{
	dtitle
	img
	checkrecs
	checkattr
	failedrecs
	lastupdate
	
	constructor()
	{
		super()
		const sroot = this.attachShadow({mode: 'open'})
		sroot.innerHTML = `
			<style>
				:host {
					border: 1px solid #ccc;
					margin: 0.5rem;
					border-radius: 4px;
					cursor: pointer;
					width: 13rem;
					box-shadow: 4px 4px #ccc;
				}
				.title {
					font-weight: bold;
					margin-top: .7rem;
					margin-bottom: 0.3rem;
					text-align: center;
					overflow: hidden;
					height: 2rem;
					line-height: 1rem;
				}
				
				/*
				:host(:hover) .title {
					text-decoration: underline;
				}
				 */
				
				.ts {
					font-size: 0.7rem
				}
				
				.view_dashboard {
					/* background-color: var(--dark-background); */
					background-color: rgb(71, 105, 41);
					color: #ddd;
					text-align: center;
					padding: 0.6rem;
				}
				.view_dashboard:hover {
					background-color: rgb(35, 75, 20);
				}
				
				.wrapper {
					padding: 1rem;
				}

				.lastupdate {
					margin-top: 0.4rem;
					font-size: 0.7rem;
				}
				
				img {
					height: 100px;
					width: 100%;
					object-fit: contain;
					margin-bottom: 0.5rem;
				}
	
			</style>
			<div class="wrapper">
				<div class="title">XXX</div>
				<img class="img">
				<cs-label-and-data class="checktrec">checked records</cs-label-and-data>
				<cs-label-and-data class="checkattr" style="display: none">checked attributes</cs-label-and-data>
				<cs-label-and-data class="totissues" xstyle="display: none">total issues</cs-label-and-data>
				<div class="lastupdate">
					🕑 <span class="data"></span>
					<span></span>
				</div>
			</div>
			<div class="view_dashboard">View dashboard</div>
		`

		customElements.upgrade(sroot)

		this.checkrecs  = cs_cast(LabelAndData,      sroot.querySelector('.checktrec'))
		this.checkattr  = cs_cast(LabelAndData,      sroot.querySelector('.checkattr'))
		this.failedrecs = cs_cast(LabelAndData,     sroot.querySelector('.totissues'))
		this.dtitle     = cs_cast(HTMLDivElement,    sroot.querySelector('.title'))
		this.img        = cs_cast(HTMLImageElement,  sroot.querySelector('.img'))
		this.lastupdate = cs_cast(HTMLSpanElement,      sroot.querySelector('.lastupdate .data'))
				
		// this.img.style.display = 'none';
		
		this.checkrecs.setLabel('checked recs')
		this.checkattr.setLabel('checked attrs')
		this.failedrecs.setLabel('quality-assured recs')
		
		// this.failedrecs.setSeverity("fail")
		// this.failedrecs.setData('123')

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
		this.checkattr.setData('123')
		this.failedrecs.setData('' + (dataset.tested_records - dataset.failed_records))
		const quality_ratio = dataset.tested_records == 0 ? 100 : dataset.failed_records / dataset.tested_records
		if (quality_ratio < 0.1)
			this.failedrecs.setQualityLevel("good")
		else if (quality_ratio < 0.3)
			this.failedrecs.setQualityLevel("warn")
		else
			this.failedrecs.setQualityLevel("fail")
		this.lastupdate.textContent = dateformat
		this.onclick = () => {
			location.hash = '#page=dataset-categories' + '&dataset_name=' + dataset.dataset_name 
							+ "&session_start_ts=" + dataset.session_start_ts
							+ "&failed_records=" + dataset.failed_records
							+ "&tested_records=" + dataset.tested_records
			window.scrollTo(0,0);
		}
	}
}


customElements.define('cs-dataset-box', DatasetCardComponent)
