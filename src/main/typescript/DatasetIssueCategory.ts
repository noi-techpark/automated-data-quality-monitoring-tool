/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */

import { LabelAndData } from "./LabelAndData.js"
import { Loader } from "./Loader.js"
import { API3, catchsolve_noiodh__test_dataset_check_category_failed_recors_vw__row } from "./api/api3.js"
import { cs_cast } from "./quality.js"


export class DatasetIssueCategory extends HTMLElement
{
	
	template
	
	connected_promise
	connected_func: (s: null) => void = s => null
	
	connectedCallback()
	{
		console.log('connected')
		this.connected_func(null)
	}
	
	constructor() {
		super()
		this.connected_promise = new Promise(s => this.connected_func = s)
		const sroot = this.attachShadow({ mode: 'open' })
		sroot.innerHTML = `
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
						<div class="category">
							<!-- <img src="kpi-pie-chart.png"> -->
							<div class="chartdiv">
								<canvas class="chart"></canvas>
							</div>
							<div class="category_name">Completeness</div>
							<span></span>
							<cs-label-and-data label="failed recs" class="nr_records"></cs-label-and-data>
							<cs-label-and-data label="last update" class="last_update"></cs-label-and-data>
							<!-- <div class="nr_records">123</div> -->
							<details>
								<summary>failed check list</summary>
							</details>
						</div>
						`;
		        customElements.upgrade(sroot);
		        this.template = cs_cast(HTMLElement, sroot.querySelector('.category'));
				
	}
	
	async refresh(data: {dataset_name: string, tot_records: number, failed_records: number, check_category: string, session_start_ts: string})
	{

		const cat = this.template
		this.setup_chart(cat, data)
		const cat_name = cs_cast(HTMLElement, cat.querySelector('.category_name'))
		cat_name.textContent = data.check_category
		const failedelement = cs_cast(LabelAndData, cat.querySelector('.nr_records'))
		failedelement.setData('' + data.failed_records)
		const last_update = cs_cast(LabelAndData, cat.querySelector('.last_update'))
		const date = new Date(data.session_start_ts)
				
		const dateformat = new Intl.DateTimeFormat('it-IT', {
					year: 'numeric',
					month: '2-digit',
					day: '2-digit',
					hour: '2-digit',
					minute: "2-digit",
					timeZone: 'Europe/Rome'
				}).format(date)
		last_update.setData(dateformat)
		
		cat_name.onclick = () => {
			location.hash = '#page=summary&session_start_ts=' + data.session_start_ts + '&dataset_name=' + data.dataset_name + '&category_name=' + data.check_category +
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
		const context = chart.getContext('2d');
						new Chart(context, 				{
						  type: 'doughnut',
						  data: {
						    labels: ['ok', 'fail'],
						    datasets: [
						      {
						        label: 'Dataset 1',
						        data: [arg1.tot_records - arg1.failed_records, arg1.failed_records],
								backgroundColor: ['#8f8', '#f88']
						      }
						    ]
						  },
						  options: {
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

customElements.define('cs-dataset-issue-category', DatasetIssueCategory)
