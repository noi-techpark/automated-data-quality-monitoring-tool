/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */

import { cs_cast, throwNPE } from "./quality.js";
import {API3} from './api/api3.js';
import { OpenCloseSection } from "./OpenCloseSection.js";
import { SectionRow } from "./SectionRow.js";

export class DatasetIssuesDetail extends HTMLElement
{
	
	container 
	
	last_session_start_ts: string|null = null
	
	last_dataset_name: string|null = null
	
	last_check_category: string|null = null
	
	current_tab: 'issues' | 'records' = 'issues'
	
	constructor() {
		super()
		const sroot = this.attachShadow({ mode: 'open' })
		sroot.innerHTML = `
				<style>
					:host {
						padding: 0.5rem;
						display: block;
					}
					.container {
						border: 1px solid #ccc;
						border-radius: 0.3rem;
					}
					
					.container > * {
						border-bottom: 1px solid #ccc;
					}
				</style>
				<img src="kpi-detail.png" style="max-width: 100%">
				<div style="width: calc(100% - 210px)">
					<div style="text-align: right">
						<button class="issues">Issues</button>
						<button class="records">Records</button>
					</div>
					<div class="container"></div>
				</div>
				`

		customElements.upgrade(sroot)

		this.container = cs_cast(HTMLDivElement, sroot.querySelector('.container'))
		
		const issues = cs_cast(HTMLButtonElement, sroot.querySelector('.issues'))
		const records = cs_cast(HTMLButtonElement, sroot.querySelector('.records'))
		
		issues.onclick = () => {
			this.current_tab = 'issues'
			if (this.last_session_start_ts != null && this.last_dataset_name != null && this.last_check_category != null)
				this.refresh(this.last_session_start_ts, this.last_dataset_name, this.last_check_category)
		}
		
		records.onclick = () => {
			this.current_tab = 'records'
			if (this.last_session_start_ts != null && this.last_dataset_name != null && this.last_check_category != null)
				this.refresh(this.last_session_start_ts, this.last_dataset_name, this.last_check_category)
		}
		
	}
	
	extractHumanReadableName(record_jsonpath: string, json: string): string
	{
		let ret = '';
		for (let fn of ['mvalidtime', 'mvalue', 'AccoDetail.de.Name', 'Detail.de.Title'])
		{
			const fn_parts = fn.split('.')
			let val = JSON.parse(json)
			for (let p of fn_parts)
			{
				val = val[p]
				if (val === undefined)
					break;
			}
			// const val = start[fn] 
			if (val !== undefined)
				ret += (ret === '' ? '' : ', ') + fn + '=' + JSON.stringify(val)
		}
		if (ret == '')
			ret = record_jsonpath
		return ret;
	}
	
	async refresh(p_session_start_ts: string, p_dataset_name: string, p_category_name: string) {
		
		this.last_session_start_ts = p_session_start_ts
		this.last_dataset_name = p_dataset_name
		this.last_check_category = p_category_name
		
		console.log(p_session_start_ts)
		console.log(p_dataset_name)
		console.log(p_category_name)
		
		this.container.textContent = ''

		if (this.current_tab === 'issues')
		{
		
			const json = await API3.list__catchsolve_noiodh__test_dataset_check_category_check_name_record_record_failed_vw({
				session_start_ts: p_session_start_ts,
				dataset_name: p_dataset_name,
				check_category: p_category_name
			})
			
			console.log(json)
	
			for (let i = 0; i < json.length; i++)
			{
				const issue = json[i]
				// console.log(issue)
				const section = new OpenCloseSection()
				section.refresh(issue.check_name, '' + issue.nr_records + ' records')
				this.container.appendChild(section)
				
				section.onopen = async () => {
					//console.log('sezione aperta, ricarico!')
					const json2 = await API3.list__catchsolve_noiodh__test_dataset_record_check_failed({
								session_start_ts: p_session_start_ts,
								dataset_name: p_dataset_name,
								check_category: p_category_name,
								check_name: issue.check_name
					});
					const groupBy = {}
					for (let k = 0; k < json2.length; k++)
					{
						const sname = JSON.parse(json2[k].record_json)['sname'];
						let prev_arr = groupBy[sname]
						prev_arr = prev_arr === undefined ? [] : prev_arr
						prev_arr.push(json2[k])
						groupBy[sname] = prev_arr
					}
					const keys = Object.keys(groupBy)
					console.log(keys)
					for (let k = 0; k < keys.length; k++)
					{
						const sectionRow = new OpenCloseSection();
						section.addElementToContentArea(sectionRow)
						sectionRow.refresh(keys[k], '' + groupBy[keys[k]].length + ' records')
						sectionRow.onclick = () => {
							const list = groupBy[keys[k]]
							console.log(list)
							for (let k2 = 0; k2 < list.length; k2++)
							{
								const sectionRow2 = new SectionRow();
								sectionRow.addElementToContentArea(sectionRow2)
								sectionRow2.refresh(this.extractHumanReadableName(list[k2].record_jsonpath, list[k2].record_json))
								sectionRow2.onclick = () => {
									alert(list[k2].record_json)
								}
							}
						}
					}
					/*
					for (let k = 0; k < json2.length; k++)
					{
						const sectionRow = new SectionRow();
						section.addElementToContentArea(sectionRow)
						sectionRow.refresh(json2[k].record_jsonpath)
						sectionRow.onclick = () => {
							alert(json2[k].record_json)
						}
					}
					*/
				}
			}
					
		}
		
		
		if (this.current_tab === 'records')
		{
			const json = await API3.list__catchsolve_noiodh__test_dataset_check_category_record_jsonpath_failed_vw({
				session_start_ts: p_session_start_ts,
				dataset_name: p_dataset_name,
				check_category: p_category_name
			});
			for (let i = 0; i < json.length; i++)
			{
				const issue = json[i]
				// console.log(issue)
				const section = new OpenCloseSection()
				section.refresh(issue.record_jsonpath, '' + issue.nr_check_names + ' checks')
				this.container.appendChild(section)
				
				section.onopen = async () => {
				//console.log('sezione aperta, ricarico!')
					const json2 = await API3.list__catchsolve_noiodh__test_dataset_record_check_failed({
							session_start_ts: p_session_start_ts,
							dataset_name: p_dataset_name,
							check_category: p_category_name,
							record_jsonpath: issue.record_jsonpath
					});
					for (let k = 0; k < json2.length; k++)
					{
						const sectionRow = new OpenCloseSection();
						section.addElementToContentArea(sectionRow)
						sectionRow.refresh(json2[k].check_name, '')
					}
				}
			}
		}
	}
}

customElements.define('cs-dataset-issues-detail', DatasetIssuesDetail)
