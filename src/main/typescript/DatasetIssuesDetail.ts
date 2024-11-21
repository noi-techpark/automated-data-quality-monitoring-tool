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
								sectionRow2.refresh(list[k2].record_jsonpath + ' ' + JSON.parse(list[k2].record_json)['mvalue'])
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
		/*
		if (this.current_tab === 'issues')
		{
			const json = await API3.list__catchsolve_noiodh__test_dataset_check_name_count_records_vw({
						session_start_ts: p_session_start_ts,
						dataset_name: p_dataset_name
					});
			//console.log(json)
			
			for (let i = 0; i < json.length; i++)
			{
				const issue = json[i]
				// console.log(issue)
				const section = new OpenCloseSection()
				section.refresh(issue.check_name, '' + issue.nr_records + ' records')
				this.container.appendChild(section)
				section.onopen = async () => {
					//console.log('sezione aperta, ricarico!')
					const json2 = await API3.list__catchsolve_noiodh__test_dataset_check_name_fields_record_id_snippet_vw({
								session_start_ts: p_session_start_ts,
								dataset_name: p_dataset_name,
								check_name: issue.check_name
							});
					//console.log(json2)
					for (let k = 0; k < json2.length; k++)
					{
						const sectionRow = new SectionRow();
						section.addElementToContentArea(sectionRow)
						sectionRow.refresh(json2[k].record_names + ' [' + json2[k].record_id + ']' + ' (' + json2[k].fields + ')')
						sectionRow.onclick = () => {
							alert(json2[k].record_failed_json_snippet)
						}
					}
				}
			}
		}
		
		if (this.current_tab === 'records')
		{
			const json3 = await API3.list__catchsolve_noiodh__test_dataset_record_count_attributes_vw({
				session_start_ts: p_session_start_ts,
				dataset_name: p_dataset_name
			});
			//console.log(json3)
			for (let i = 0; i < json3.length; i++)
			{
				const issue = json3[i]
				//console.log(issue)
				const section = new OpenCloseSection()
				section.refresh(issue.record_names, '' + issue.count_attributes)
				this.container.appendChild(section)
				section.onopen = async () => {
					//console.log('sezione aperta, ricarico!')
					const json2 = await API3.list__catchsolve_noiodh__test_dataset_attribute_name_checks_record_id_snippet_vw({
								session_start_ts: p_session_start_ts,
								dataset_name: p_dataset_name,
								record_id: issue.record_id
							});
					//console.log(json2)
					for (let k = 0; k < json2.length; k++)
					{
						const sectionRow = new SectionRow();
						section.addElementToContentArea(sectionRow)
						sectionRow.refresh(json2[k].attribute_name + ' (' + json2[k].checks + ')')
						sectionRow.onclick = () => {
							alert(json2[k].record_failed_json_snippet)
						}
					}
				}
			}
		}
		 */

		/*
		const resp = await API.issues_tree({})
		console.log(resp)
		for (let i = 0; i < resp.issues.length; i++)
		{
			const issue = resp.issues[i]
			console.log(issue)
			const section = new OpenCloseSection()
			section.setLabel(issue.issue)
			this.container.appendChild(section)
			for (let r = 0; r < issue.records.length; r++)
			{
				const record = issue.records[r]
				console.log(record)
				
				const sectionRow = new SectionRow();
				section.addElementToContentArea(sectionRow)
				sectionRow.refresh(record.record_id)
				
				for (let f = 0; f < record.fields.length; f++)
					console.log(record.fields[f])
			}
		}
		*/
		
		// const resp = await API.test_dataset_check_vw({})
		// console.log(resp)
		
		/*
		
		const resp = await API.readFails({})
		console.log(resp)
	
		const viewtree: {[k:string]:{[k:string]:string[]}} = {};
		
		for (let ai = 0; ai < resp.length; ai++)
		{
			const issue = resp[ai]
			
			const group = viewtree[issue.check_name]??{};
			const subgroup = group[issue.record_description]??[];
			subgroup.push(issue.record_id)
			group[issue.record_description] = subgroup
			viewtree[issue.check_name] = group
		}
		console.log(viewtree)
		const issnames = Object.keys(viewtree)
		console.log(issnames)
		for (let i = 0; i < issnames.length; i++)
		{
			const section = new OpenCloseSection()
			section.refresh(issnames[i], 'X')
			this.container.appendChild(section)
			const group = viewtree[issnames[i]]
			const k2 = Object.keys(group)
			for (let i2 = 0; i2 < k2.length; i2++)
			{
				const list = group[k2[i2]]
				if (list.length === 1)
				{
					const sectionRow = new SectionRow();
					section.addElementToContentArea(sectionRow)
					sectionRow.refresh(list[0])					
				}
				else
				{
					const section2 = new OpenCloseSection()
					section2.refresh(k2[i2], 'X')
					section.addElementToContentArea(section2)
					for (let i3 = 0; i3 < list.length; i3++)
					{
						const sectionRow = new SectionRow();
						section2.addElementToContentArea(sectionRow)
						sectionRow.refresh(list[i3])					
					}
				}
			}
		}
			
		*/	
		/*
		const resp = await API.attrnamepath_issues_records_arr({})
		// console.log(resp)
		for (let ai = 0; ai < resp.length; ai++)
		{
			const issue = resp[ai]
			// console.log(issue)
			const section = new OpenCloseSection()
			section.refresh(issue.attrnamepath + ' is ' + issue.issue, '' + issue.records.length + '/' + issue.tot_records + ' records')
			this.container.appendChild(section)
			for (let r = 0; r < issue.records.length; r++)
			{
				const record = issue.records[r]
				// console.log(record)
				
				const sectionRow = new SectionRow();
				section.addElementToContentArea(sectionRow)
				sectionRow.refresh(record)
				
				if (r == 10)
				{
					const more = new SectionRow();
					section.addElementToContentArea(sectionRow)
					sectionRow.refresh('...')
					break;
				}
			}
		}
		
		
		const resp2 = await API.test_dataset_record_with_counts({});
		resp2.forEach((r) => {
			const section = new OpenCloseSection()
			section.refresh(r.record_id + '/' + r.record_description +  ' fail ' + r.failing_attrs_count + ' attrs', '')
			this.container.appendChild(section)
			
		})
		 */
	}
}

customElements.define('cs-dataset-issues-detail', DatasetIssuesDetail)
