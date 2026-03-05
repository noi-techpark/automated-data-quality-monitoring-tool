// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CommonWebComponent } from "./CommonWebComponent.js";
import { cs_cast, throwNPE } from "./quality.js";
import {API3, catchsolve_noiodh__test_dataset_record_check_failed__row} from './api/api3.js';
import { OpenCloseSection } from "./OpenCloseSection.js";
import { SectionRow } from "./SectionRow.js";
import { Loader } from "./Loader.js";
import { DatasetIssueCategoryComponent } from "./DatasetIssueCategoryComponent.js";
import { GeneralInfoAndSettings } from "./GeneralInfoAndSettings.js";
import template from './DatasetIssuesDetail.html?raw'

export class DatasetIssuesDetail extends CommonWebComponent
{
	
	container 
	
	last_session_start_ts: string|null = null
	last_dataset_name: string|null = null
	last_check_category: string|null = null
	last_failed_records: number|null = null
	last_tot_records: number|null = null
	last_test_dataset_id: number|null=null
	
	current_tab: 'issues' | 'records' = 'issues'
	
	canvas
	
	// connected_promise
	// connected_func: (s: null) => void = s => null
	
	chartjs_success: (s: Chart) => void
	chartjs_promise: Promise<Chart>

	issues: HTMLSpanElement;
	records: HTMLSpanElement;
    // info_and_settings: GeneralInfoAndSettings;

	connectedCallback()
	{
		// chartjs need to be created when element is attached into the dom
		const chart = new Chart(this.canvas, {
			type: 'line',
			data: {
				labels: ['-5','-4','-3', '-2', '-1'],
				datasets: []
			},
			options: {
				scales: {
					y: {
						stacked: true,
						beginAtZero: true
					}
					
				}
				
			}
		});
		
		this.chartjs_success(chart)
	}
	
	constructor() {
		super(template)
		this.chartjs_success = (s) => {} // dummy initialization, next line will init chartjs_success but compiler don't understand this!
		this.chartjs_promise = new Promise(s => this.chartjs_success = s)

		this.container = cs_cast(HTMLDivElement, this.sroot.querySelector('.container'))
		
		this.issues = cs_cast(HTMLSpanElement, this.sroot.querySelector('.issues'))
		this.records = cs_cast(HTMLSpanElement, this.sroot.querySelector('.records'))
		
		this.issues.onclick = () => {
			this.current_tab = 'issues'
			if (this.last_session_start_ts != null && this.last_dataset_name != null && this.last_check_category != null
				&& this.last_failed_records != null && this.last_tot_records != null)
				this.refresh(this.last_session_start_ts, this.last_dataset_name, this.last_check_category, this.last_failed_records, this.last_tot_records)
		}
		
		this.records.onclick = () => {
			this.current_tab = 'records'
			if (this.last_session_start_ts != null && this.last_dataset_name != null && this.last_check_category != null
				&& this.last_failed_records != null && this.last_tot_records != null)
				this.refresh(this.last_session_start_ts, this.last_dataset_name, this.last_check_category, this.last_failed_records, this.last_tot_records)
		}
		
		this.canvas = cs_cast(HTMLCanvasElement, this.sroot.querySelector('canvas'));
		
		// this.info_and_settings = cs_cast(GeneralInfoAndSettings, this.sroot.querySelector('cs-general-info-and-settings'));


	}
	
	extractHumanReadableName(record_jsonpath: string, json: string): string
	{
		let ret = '';
		for (let fn of ['sname', 'mvalidtime', 'mvalue', 'AccoDetail.de.Name', 'Detail.de.Title'])
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
	
	groupRecords(list: {record_json: string}[]): {[k:string]: any[]}
	{
		const groupBy: {[k:string]: any[]} = {}
		for (let k = 0; k < list.length; k++)
		{
			const json = JSON.parse(list[k].record_json);
			let sname = json['sname'];
			if (typeof sname !== 'string')
				sname = ''
			let prev_arr = groupBy[sname]
			prev_arr = prev_arr === undefined ? [] : prev_arr
			prev_arr.push(list[k])
			groupBy[sname] = prev_arr
		}
		return groupBy; 
	}
	
	async refresh(p_test_dataset_id: string, p_test_dataset_ids: string) {


		const resp = await API3.list__catchsolve_noiodh__test_dataset_check_category_failed_recors_vw({
			test_dataset_ids: p_test_dataset_id
		})

		if (resp.length != 1)
			alert(resp.length)

		const data = resp[0]

		const category = cs_cast(DatasetIssueCategoryComponent, this.sroot.querySelector('cs-dataset-issue-category'))
		category.hideMoreDiv()
		category.refresh(data, p_test_dataset_ids)

		this.last_session_start_ts = data.session_start_ts
		this.last_dataset_name = data.dataset_name
		this.last_check_category = data.check_category
		this.last_failed_records = data.failed_records
		this.last_tot_records = data.tot_records
		this.last_test_dataset_id = data.test_dataset_id
		
		// this.info_and_settings.refresh(p_session_start_ts, p_dataset_name, p_failed_records, p_tot_records)
		
		;(async () => {
					
					// TOD invece di dataset_name usa 
					const data = await API3.list__catchsolve_noiodh__test_dataset_history_vw({
						test_dataset_id: this.last_test_dataset_id!,					
						check_category: this.last_check_category!
					})


					console.log('history data', data)

					// const goodarr  = []
					// const failarr  = []
					
					const labels = []
					const values = []
					const totals = []

					// TODO aggiungi un secondo dataset che è total trend è che usa  

					for (let x = 0; x < data.length; x++)
					{
						const row = data[x]
						labels.unshift(row.session_start_ts.slice(0,16).replace('T', ' '))
						values.unshift(row.failed_recs)
						totals.unshift(row.tested_records - row.failed_recs)
						/*
						goodarr.push(data[x].tested_records - data[x].failed_recs)
						failarr.push(data[x].failed_recs)
						 */
					}

					const chartjs = await this.chartjs_promise
					chartjs.data.labels = labels
					chartjs.data.datasets = [
						{
							label: 'good records',
							data: totals,
							fill: true,
							backgroundColor: '#080',
							borderColor: '#080',
							tension: 0.1
						},
						{
							label: 'failed records',
							data: values,
							fill: true,
							backgroundColor: '#800',
							borderColor: '#800',
							tension: 0.1
						}
					]
					
					/*
					chartjs.data.datasets = [
												{
													label: 'fail trend',
													data: failarr,
													fill: false,
													backgroundColor: '#222',
													borderColor: '#222',
													tension: 0.1
												},
												{
													label: 'total trend',
													data: goodarr,
													fill: false,
													backgroundColor: '#aaa',
													borderColor: '#aaa',
													tension: 0.1
												},						
											]
					*/
											
					chartjs.update()
									
		})();
		

		
		this.container.textContent = ''
		
		if (this.current_tab === 'issues')
		{
			this.records.classList.remove('selected')
			this.issues.classList.add('selected')
			
			const loader = new Loader();
			this.container.appendChild(loader)

			/*
			const json = await API3.list__catchsolve_noiodh__test_dataset_check_category_check_name_record_record_failed_vw({
				session_start_ts: p_session_start_ts,
				dataset_name: p_dataset_name,
				check_category: p_category_name
			})
			 */

		/*
		this.last_session_start_ts = data.session_start_ts
		this.last_dataset_name = data.dataset_name
		this.last_check_category = data.check_category
		this.last_failed_records = data.failed_records
		this.last_tot_records = data.tot_records
		this.last_test_dataset_id = data.test_dataset_id
		 */

			const json = [{
				check_name: 'failed',
				nr_records: -1
			}

			]

			loader.remove();
	
			for (let i = 0; i < json.length; i++)
			{
				const issue = json[i]
				// console.log(issue)
				const section = new OpenCloseSection()
				section.refresh(issue.check_name, 'failed: ' + issue.nr_records + ' records')
				this.container.appendChild(section)
				
				section.onopen = async () => {
					
					const moreButton = document.createElement('button')
					moreButton.classList.add('nextpagebutton')
					moreButton.textContent = 'next 100'
					section.addElementToContentArea(moreButton)
					let list_offset = 0
					const nextFun = async () => {
						
						const json2 = await API3.list__catchsolve_noiodh__test_dataset_record_check_failed({
														limit: 100,
														offset: list_offset,
														test_dataset_id: data.test_dataset_id
											});
						
						// const list = groupBy[keys[0]]
						for (let k2 = 0; k2 < json2.length; k2++)
						{
							const sectionRow2 = new SectionRow();
							// section.addElementToContentArea(sectionRow2)
							moreButton.parentElement!.insertBefore(sectionRow2, moreButton)
							sectionRow2.refresh(this.extractHumanReadableName(json2[k2].record_jsonpath, json2[k2].record_json))
							// sectionRow2.refresh(json2[k2].problem_hint)
							sectionRow2.onclick = () => {
								alert(json2[k2].record_json)
							}
						}
						list_offset += 100
					}
					moreButton.onclick = nextFun
					nextFun()
					
					/*
					//console.log('sezione aperta, ricarico!')
					const json2 = await API3.list__catchsolve_noiodh__test_dataset_record_check_failed({
								session_start_ts: p_session_start_ts,
								dataset_name: p_dataset_name,
								check_category: p_category_name,
								check_name: issue.check_name
					});
					const groupBy = this.groupRecords(json2)
					const keys = Object.keys(groupBy)
					console.log(keys)
					if (keys.length == 1 && keys[0] == '')
					{
						const moreButton = document.createElement('button')
						moreButton.textContent = 'next 10'
						section.addElementToContentArea(moreButton)
						const nextFun = () => {
							const list = groupBy[keys[0]]
							for (let k2 = 0; k2 < list.length; k2++)
							{
								const sectionRow2 = new SectionRow();
								section.addElementToContentArea(sectionRow2)
								// sectionRow2.refresh(this.extractHumanReadableName(list[k2].record_jsonpath, list[k2].record_json))
								sectionRow2.refresh(list[k2].problem_hint)
								sectionRow2.onclick = () => {
									alert(list[k2].record_json)
								}
							}
							
						}
						moreButton.onclick = nextFun
					}
					else
					{
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
									// sectionRow2.refresh(this.extractHumanReadableName(list[k2].record_jsonpath, list[k2].record_json))
									sectionRow2.refresh(list[k2].problem_hint)
									sectionRow2.onclick = () => {
										alert(list[k2].record_json)
									}
								}
							}
						}
					}
					*/
				}
			}
					
		}
		
		
		if (this.current_tab === 'records')
		{
			this.issues.classList.remove('selected')
			this.records.classList.add('selected')
			
			const moreButton = document.createElement('button')
			moreButton.classList.add('nextpagebutton')
			moreButton.textContent = 'next 100'
			this.container.appendChild(moreButton)
			let list_offset = 0
			const nextFun = async () => {

				const loader = new Loader();
				this.container.appendChild(loader)

				const list = await API3.list__catchsolve_noiodh__test_dataset_check_category_record_jsonpath_failed_vw({
					session_start_ts: p_session_start_ts,
					dataset_name: p_dataset_name,
					check_category: p_category_name,
					offset: list_offset,
					limit: 100
				});
				loader.remove();
				for (let k2 = 0; k2 < list.length; k2++)
				{
					const sectionRow2 = new OpenCloseSection();
					// this.container.appendChild(sectionRow2)
					moreButton.parentElement!.insertBefore(sectionRow2, moreButton)
					sectionRow2.refresh(this.extractHumanReadableName(list[k2].record_jsonpath, list[k2].record_json), '' + list[k2].nr_check_names + ' check failed')
					
					
					sectionRow2.onclick = async () => {
							const json2 = await API3.list__catchsolve_noiodh__test_dataset_record_check_failed({
														session_start_ts: p_session_start_ts,
														dataset_name: p_dataset_name,
														check_category: p_category_name,
														record_jsonpath: list[k2].record_jsonpath
												});

						for (let k = 0; k < json2.length; k++)
						{
							const sectionRow = new SectionRow();
							sectionRow2.addElementToContentArea(sectionRow)
							sectionRow.refresh("failed: " + json2[k].check_name)
						}
					}
				}
				list_offset += 100
			}
			moreButton.onclick = nextFun
			nextFun()

	
			/*
			const groupBy = this.groupRecords(json)
			const keys = Object.keys(groupBy)
			console.log(keys)
			if (keys.length == 1 && keys[0] == '')
			{
				const list = groupBy[keys[0]]
				for (let k2 = 0; k2 < list.length; k2++)
				{
					const sectionRow2 = new OpenCloseSection();
					this.container.appendChild(sectionRow2)
					sectionRow2.refresh(this.extractHumanReadableName(list[k2].record_jsonpath, list[k2].record_json), '' + list[k2].nr_check_names + ' check failed')
					sectionRow2.onclick = async () => {
						const json2 = await API3.list__catchsolve_noiodh__test_dataset_record_check_failed({
													session_start_ts: p_session_start_ts,
													dataset_name: p_dataset_name,
													check_category: p_category_name,
													record_jsonpath: list[k2].record_jsonpath
											});

						for (let k = 0; k < json2.length; k++)
						{
							const sectionRow = new SectionRow();
							sectionRow2.addElementToContentArea(sectionRow)
							sectionRow.refresh("failed: " + json2[k].check_name)
						}
					}
				}
			}
			else
			{
				for (let k = 0; k < keys.length; k++)
				{
					const sectionRow = new OpenCloseSection();
					this.container.appendChild(sectionRow)
					sectionRow.refresh(keys[k], '' + groupBy[keys[k]].length + ' records')
					sectionRow.onclick = () => {
						const list = groupBy[keys[k]]
						console.log(list)
						for (let k2 = 0; k2 < list.length; k2++)
						{
							const sectionRow2 = new OpenCloseSection();
							sectionRow.addElementToContentArea(sectionRow2)
							sectionRow2.refresh(this.extractHumanReadableName(list[k2].record_jsonpath, list[k2].record_json), list[k2].nr_check_names)
							sectionRow2.onclick = async (e) => {
								e.stopPropagation()
								const json2 = await API3.list__catchsolve_noiodh__test_dataset_record_check_failed({
																					session_start_ts: p_session_start_ts,
																					dataset_name: p_dataset_name,
																					check_category: p_category_name,
																					record_jsonpath: list[k2].record_jsonpath
													});
								for (let k = 0; k < json2.length; k++)
								{
									const sectionRow = new SectionRow();
									sectionRow2.addElementToContentArea(sectionRow)
									sectionRow.refresh(json2[k].check_name)
								}
								
							}
						}
					}
				}
			}
			 */
		}
	}
}

customElements.define('cs-dataset-issues-detail', DatasetIssuesDetail)
