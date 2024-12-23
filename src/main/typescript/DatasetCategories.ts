/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */


import { cs_cast, throwNPE } from "./quality.js";
import {API3, catchsolve_noiodh__test_dataset_check_category_failed_recors_vw__row} from './api/api3.js';
import { OpenCloseSection } from "./OpenCloseSection.js";
import { SectionRow } from "./SectionRow.js";
import { Loader } from "./Loader.js";
import { LabelAndData } from "./LabelAndData.js";
import { DatasetIssueCategory } from "./DatasetIssueCategory.js";
import { GeneralInfoAndSettings } from "./GeneralInfoAndSettings.js";

export class DatasetIssuesByCategories extends HTMLElement
{
	
	content
	
	connected_promise
	connected_func: (s: null) => void = s => null
	
	connectedCallback()
	{
		console.log('connected')
		this.connected_func(null)
	}
	
	sroot
	
	info_and_settings
	
	constructor() {
		super()
		this.connected_promise = new Promise(s => this.connected_func = s)
		this.sroot = this.attachShadow({ mode: 'open' })
		this.sroot.innerHTML = `
						<style>
							:host {
							}
							.category {
								border: 1px solid gray;
								width: 12rem;
								display: inline-block;
								margin: 1rem;
							}
							.category > img {
								width: 100%;
							}
							.category .category_name {
								font-weight: bold;
							}
							.frame {
								display: flex
							}
							.frame .content {
								flex-grow: 100;
								display: flex;
							}
							.chartdiv {
								width:  100px;
								height: 100px;
								margin: auto;
							}
							details > *:nth-child(even) {
							  background-color: #ccc;
							}
						</style>
						<div class="frame">
							<div class="content"></div>
							<cs-general-info-and-settings></cs-general-info-and-settings>
							<!--<img src="kpi-general-info.png">-->
						</div>
						`;
		customElements.upgrade(this.sroot);
		this.content = cs_cast(HTMLElement, this.sroot.querySelector('.content'));
		this.info_and_settings = cs_cast(GeneralInfoAndSettings, this.sroot.querySelector('cs-general-info-and-settings'));

	}
	
	async refresh(p_session_start_ts: string, p_dataset_name: string, p_failed_records: number, p_tot_records: number) {
		
		this.info_and_settings.refresh(p_session_start_ts, p_dataset_name, p_failed_records, p_tot_records);
		
		const loader = new Loader()
		this.content.appendChild(loader)
		const resp = await API3.list__catchsolve_noiodh__test_dataset_check_category_failed_recors_vw({
			session_start_ts: p_session_start_ts,
			dataset_name : p_dataset_name
		})
		loader.remove()
		console.log(resp) 
		for (let i = 0; i < resp.length; i++)
		{
			const category = new DatasetIssueCategory();
			this.content.appendChild(category);
			category.refresh(resp[i])
			
		}
	}


}

customElements.define('cs-dataset-categories', DatasetIssuesByCategories)

