/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */


import { cs_cast, throwNPE } from "./quality.js";
import {API3} from './api/api3.js';
import { OpenCloseSection } from "./OpenCloseSection.js";
import { SectionRow } from "./SectionRow.js";
import { Loader } from "./Loader.js";

export class DatasetCategories extends HTMLElement
{
	
	template
	
	content
	
	constructor() {
		super()
		const sroot = this.attachShadow({ mode: 'open' })
		sroot.innerHTML = `
						<style>
							:host {
							}
							.category {
								border: 1px solid gray;
								width: 10rem;
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
						</style>
						<div class="frame">
							<div class="content"></div>
							<img src="kpi-general-info.png">
						</div>
						<div class="category">
							<img src="kpi-pie-chart.png">
							<div class="category_name">Completeness</div>
							<span>bla bla bla bla</span>
							<div class="nr_records">123</div>
							<details>
								<summary>failed check list</summary>
							</details>
						</div>
						`;
		        customElements.upgrade(sroot);
		        this.content = cs_cast(HTMLElement, sroot.querySelector('.content'));
		        this.template = cs_cast(HTMLElement, sroot.querySelector('.category'));
		        this.template.remove();
		
	}
	
	async refresh(p_session_start_ts: string, p_dataset_name: string) {
		
		console.log(p_session_start_ts)
		console.log(p_dataset_name)
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
			const cat = cs_cast(HTMLElement, this.template.cloneNode(true))
			const cat_name = cs_cast(HTMLElement, cat.querySelector('.category_name'))
			cat_name.textContent = resp[i].check_category
			cs_cast(HTMLElement, cat.querySelector('.nr_records')).textContent = 'failed ' + resp[i].failed_records + ' / '
			+ resp[i].tot_records
			this.content.appendChild(cat)
			
			cat_name.onclick = () => {
				location.hash = '#page=summary&session_start_ts=' + p_session_start_ts + '&dataset_name=' + p_dataset_name + '&category_name=' + resp[i].check_category 
			}
			
			const cat_details =  cs_cast(HTMLElement, cat.querySelector('details'))
			
			API3.list__catchsolve_noiodh__test_dataset_check_category_check_name_failed_recors_vw({
						session_start_ts: p_session_start_ts,
						dataset_name : p_dataset_name,
						check_category: resp[i].check_category
					}).then((checks) => {
						console.log(checks)
						for (let i2 = 0; i2 < checks.length; i2++)
						{
							const div = document.createElement('div')
							div.textContent = checks[i2].check_name // + ' ' + checks[i2].failed_records +  ' / ' + checks[i2].tot_records 
							cat_details.appendChild(div)
						}
					})
			
		}
	}
}

customElements.define('cs-dataset-categories', DatasetCategories)
