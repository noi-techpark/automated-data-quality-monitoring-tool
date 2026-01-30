// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CommonWebComponent } from './CommonWebComponent.js';
import { DatasetCardComponent } from './DatasetCardComponent.js';
import { Loader } from './Loader.js';
import { API3, catchsolve_noiodh__test_dataset_max_ts_vw__row } from './api/api3.js';
import { kc } from './auth.js';
import { cs_cast } from './quality.js';
import template from './CustomDashboardsComponent.html?raw'

export class CustomDashboardsComponent extends CommonWebComponent
{
	boxContainer;
	boxes: DatasetCardComponent[] = []
	titles: string[] = []

	constructor()
	{
		super(template)
		this.boxContainer = cs_cast(HTMLDivElement, this.sroot.querySelector('.container'))

		this.boxContainer.textContent = ("loading ...");

		const refreshlist = () => {
			for (let b = 0; b < this.titles.length; b++)
				if (this.titles[b].toLowerCase().indexOf(input.value.toLowerCase()) >= 0)
					this.boxes[b].style.display = 'block'
				else
					this.boxes[b].style.display = 'none'
		}

		const input = this.sroot.querySelector('input')!
		input.oninput = refreshlist

		const clearinput = <HTMLSpanElement> this.sroot.querySelector('.clearinput')!
		clearinput.onclick = () => {
			input.value = ''
			refreshlist()
		}
	}

	async refresh()
	{
		this.boxes = []
		this.titles = []
		this.boxContainer.textContent = ('');
		const loader = new Loader();
		this.boxContainer.appendChild(loader)
		const used_key = sessionStorage.getItem('used_key_role') ?? ''
		const [datasets, dashboards] = await Promise.all([
			// TODO manage custom dataset test too
			[] as catchsolve_noiodh__test_dataset_max_ts_vw__row[],
			API3.list__catchsolve_noiodh__custom_dashboards({})
		])
		loader.remove();
		const datasetByName = new Map(datasets.map((row) => [row.dataset_name, row]))
		for (let dashboard of dashboards)
		{
			const dataset = datasetByName.get(dashboard.name) ?? this.buildFallbackDataset(dashboard.name)
			const box = new DatasetCardComponent();
			box.edit_hash = `#customdataset?id=${dashboard.id}`;
			box.menu_edit_hash = `#customdataset?id=${dashboard.id}`
			box.menu_on_delete = async () => {
				if (!confirm(`Delete "${dashboard.name}"?`)) {
					return
				}
				const ok = await this.deleteCustomDashboard(dashboard.id)
				if (!ok) {
					alert('Delete failed')
					return
				}
				const index = this.boxes.indexOf(box)
				if (index !== -1) {
					this.boxes.splice(index, 1)
					this.titles.splice(index, 1)
				}
				box.remove()
			}
			this.boxContainer.appendChild(box)
			box.refresh(dataset)
			/*
			box.onclick = () => {
				location.hash = `#customdataset?id=${dashboard.id}`;
				window.scrollTo(0,0);
			}
			 */
			this.boxes.push(box)
			this.titles.push(dashboard.name)
		}
		this.boxContainer.appendChild(this.createAddDatasetCard())
	}

	private async deleteCustomDashboard(id: number): Promise<boolean>
	{
		const body = new URLSearchParams()
		body.set('action', 'delete_custom_dashboard')
		body.set('id', String(id))
		body.set('current_role', sessionStorage.getItem('used_key_role') ?? '')
		const headers: HeadersInit = { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
		if (kc.token) {
			headers.Authorization = `Bearer ${kc.token}`
		}
		const response = await fetch('api', {
			method: 'POST',
			headers,
			body
		})
		return response.ok
	}

	private createAddDatasetCard(): HTMLDivElement
	{
		const card = document.createElement('div')
		card.className = 'add-dataset-card'
		card.setAttribute('data-testid', 'add-custom-dashboard-card')
		const plus = document.createElement('div')
		plus.className = 'add-dataset-plus'
		plus.textContent = '+'
		const label = document.createElement('div')
		label.className = 'add-dataset-text'
		label.textContent = 'Add dataset'
		card.appendChild(plus)
		card.appendChild(label)
		card.onclick = async () => {
			const newid = await API3.get__catchsolve_noiodh__custom_dashboards_next_id()
			location.hash = `#customdataset?id=${newid}`
		}
		return card
	}

	private buildFallbackDataset(datasetName: string): catchsolve_noiodh__test_dataset_max_ts_vw__row
	{
		return {
			dataset_img_url: '',
			dataset_name: datasetName,
			failed_records: 0,
			session_start_ts: new Date().toISOString(),
			tested_records: 0
		}
	}
}

customElements.define('cs-custom-dashboards-element', CustomDashboardsComponent)
