// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CommonWebComponent } from "./CommonWebComponent.js";
import { LabelAndData } from "./LabelAndData.js"
import { API3, catchsolve_noiodh__test_dataset_check_category_failed_recors_vw__row } from "./api/api3.js"
import { cs_cast } from "./quality.js"
import template from './DatasetIssueCategoryComponent.html?raw'


export class DatasetIssueCategoryComponent extends CommonWebComponent
{
	
	template
	
	connected_promise
	connected_func: (s: null) => void = s => null
	
	more_div
	
	connectedCallback()
	{
		console.log('connected')
		this.connected_func(null)
	}
	
	constructor() {
		super(template);
		this.connected_promise = new Promise(s => this.connected_func = s)
		this.template = cs_cast(HTMLElement, this.sroot.querySelector('.category'));
		this.more_div = cs_cast(HTMLElement, this.sroot.querySelector('.more'));
	}
	
	hideMoreDiv()  {
		this.more_div.style.display = 'none'
	}
	
	async refresh(data: {dataset_name: string, tot_records: number, failed_records: number, check_category: string, session_start_ts: string})
	{

		const cat = this.template
		this.setup_chart(cat, data)
		const cat_name = cs_cast(HTMLElement, cat.querySelector('.category_name'))
		cat_name.textContent = data.check_category
		const failedelement = cs_cast(LabelAndData, cat.querySelector('.nr_records'))
		failedelement.setData('' + (data.tot_records - data.failed_records))
		const checked_nr_records = cs_cast(LabelAndData, cat.querySelector('.checked_nr_records'))
		checked_nr_records.setData('' + data.tot_records)
		const last_update = cs_cast(HTMLSpanElement, cat.querySelector('.lastupdate .data'))
		const date = new Date(data.session_start_ts)
		
		const perc = cs_cast(HTMLElement, cat.querySelector('.perc'))
		perc.textContent = '' + ((data.tot_records - data.failed_records) * 100 / data.tot_records).toFixed(1)
				
		const dateformat = new Intl.DateTimeFormat('it-IT', {
					year: 'numeric',
					month: '2-digit',
					day: '2-digit',
					hour: '2-digit',
					minute: "2-digit",
					timeZone: 'Europe/Rome'
				}).format(date)

		last_update.textContent = dateformat

		const view_details = cs_cast(HTMLElement, cat.querySelector('.view_details'))
		
		view_details.onclick = () => {
			location.hash = '#page=summary&session_start_ts=' + data.session_start_ts + '&dataset_name=' + encodeURIComponent(data.dataset_name) + '&category_name=' + data.check_category +
							'&failed_records=' + data.failed_records + '&tot_records=' + data.tot_records 
		}
		
		const cat_details =  cs_cast(HTMLElement, cat.querySelector('details'))
		
		API3.list__catchsolve_noiodh__test_dataset_check_category_check_name_failed_recors_vw({
					session_start_ts: data.session_start_ts,
					dataset_name : data.dataset_name,
					check_category: data.check_category
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

	async  setup_chart(cat: HTMLElement, arg1: {tot_records: number, failed_records: number}) {
		await this.connected_promise
		const chart = cs_cast(HTMLCanvasElement, cat.querySelector('.chart'));
		// const context = chart.getContext('2d');
						new Chart(chart, 				{
						  type: 'doughnut',
						  data: {
						    labels: ['ok', 'fail'],
						    datasets: [
						      {
						        label: 'Dataset 1',
						        data: [arg1.tot_records - arg1.failed_records, arg1.failed_records, ],
								backgroundColor: ['#0a0', '#222', ]
						      }
						    ]
						  },
						  options: {
							cutout: '80%',
						    responsive: true,
						    plugins: {
						      legend: {
								display: false,
						        position: 'top',
						      },
						      title: {
						        display: false,
						        text: 'Chart.js Doughnut Chart'
						      }
						    }
						  },
						}
						)
	}


}

customElements.define('cs-dataset-issue-category', DatasetIssueCategoryComponent)
