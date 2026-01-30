// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CommonWebComponent } from './CommonWebComponent.js'
import {MenuComponent} from './MenuComponent.js'
import {StandardDashboardsComponent} from './StandardDashboardsComponent.js'
import {CustomDashboardsComponent} from './CustomDashboardsComponent.js'


import {DatasetIssuesDetail} from './DatasetIssuesDetail.js'
import { cs_cast, cs_notnull } from './quality.js';
import { DatasetIssuesByCategories } from './DatasetIssuesByCategories.js';

import { AuthComponent } from './AuthComponent.js'
import { CustomDatasetForm } from './CustomDatasetForm.js';
import { API3 } from './api/api3.js'
import { kc } from './auth.js'
import template from './MainComponent.html?raw'

export class MainComponent extends CommonWebComponent
{
	dashboards: StandardDashboardsComponent|null = null;
	customDashboards: CustomDashboardsComponent|null = null;
	
	changingSection
	
	logo

	constructor()
	{
		super(template)
		this.changingSection = this.sroot.querySelector('.projects')!
		
		this.logo = cs_cast(HTMLImageElement, this.sroot.querySelector('.logo'))
		this.logo.onclick = () => {
			location.hash = ''
		}
		
		this.sroot.querySelector('.header')!.appendChild(new AuthComponent())
		
		const menu: MenuComponent = new MenuComponent();
		menu.setAttribute("data-testid", "leftmenu")
		menu.refresh()
		this.changingSection.parentElement!.prepend(menu);
		
		const onhashchange = async () => {
			
			console.log('hash')
			console.log(location.hash)
			
			this.changingSection.textContent = ''
			
			let cleanedhash = location.hash
			if (cleanedhash.startsWith('#state='))
				cleanedhash = ''
			
			if (cleanedhash === '')
			{
				if (this.dashboards === null)
				{
					this.dashboards = new StandardDashboardsComponent();
					this.dashboards.refresh();
				}
				this.changingSection.appendChild(this.dashboards)
				menu.selectItem('')
			}

			if (cleanedhash.indexOf('#page=dataset-categories&') === 0)
			{
				this.changingSection.textContent = ''
				const detail = new DatasetIssuesByCategories();
				this.changingSection.appendChild(detail)
				const params = new URLSearchParams(cleanedhash.substring(1));
				const session_start_ts = cs_notnull(params.get('session_start_ts'))
				const dataset_name = cs_notnull(params.get('dataset_name'))
				const failed_records = parseInt(cs_notnull(params.get('failed_records')))
				const tested_records = parseInt(cs_notnull(params.get('tested_records')))
				detail.refresh(session_start_ts, dataset_name, failed_records, tested_records);
				menu.selectItem(dataset_name)
			}
			
			if (cleanedhash.startsWith('#page=summary&'))
			{
				this.changingSection.textContent = ''
				const detail = new DatasetIssuesDetail();
				this.changingSection.appendChild(detail)
				const params = new URLSearchParams(cleanedhash.substring(1));
				const session_start_ts = cs_notnull(params.get('session_start_ts'))
				const dataset_name = cs_notnull(params.get('dataset_name'))
				const category_name = cs_notnull(params.get('category_name'))
				const failed_records = parseInt(cs_notnull(params.get('failed_records')))
				const tot_records = parseInt(cs_notnull(params.get('tot_records')))
				detail.refresh(session_start_ts, dataset_name, category_name, failed_records, tot_records);
				menu.selectItem(dataset_name)
			}

			if (cleanedhash.startsWith('#customdataset'))
			{
				this.changingSection.textContent = ''
				const params = new URLSearchParams(cleanedhash.substring('#customdataset'.length))
				const idParam = params.get('id')
				if (idParam !== null)
				{
					menu.selectItem(`custom:${idParam}`)
					const form = new CustomDatasetForm()
					form.setAttribute('data-testid', 'custom-dataset-form')
					form.addEventListener('save-custom-dashboard', async () => {
						const elaborationHandle = form.setElaborationInProgress()
						let shouldCloseImmediately = true
						try {
							const draft = form.getCustomDashboardDraft()
							const payload: { id: number; name: string; test_definition_json: any } = {
								id: draft.id!,
								name: draft.name,
								test_definition_json: draft.test_definition_json
							}

							const body = new URLSearchParams()
							body.set('action', 'insert_custom_dashboard')
							body.set('test_definition_json', JSON.stringify(payload))
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
							if (response.ok) {
								elaborationHandle.setText('success')
								elaborationHandle.closeAfter(2000)
								shouldCloseImmediately = false
							} else {
								elaborationHandle.setText(`error ${response.status}`)
								elaborationHandle.closeAfter(2000)
								shouldCloseImmediately = false
							}
						} catch {
							elaborationHandle.setText('error')
							elaborationHandle.closeAfter(2000)
							shouldCloseImmediately = false
						} finally {
							if (shouldCloseImmediately) {
								elaborationHandle.close()
							}
						}
					})
					this.changingSection.appendChild(form)
					const elaborationHandle = form.setElaborationInProgress()
					const rows = await API3.list__catchsolve_noiodh__custom_dashboards({ id: Number(idParam) })
					if (rows.length === 0) {
						await form.loadCustomDashboard({}, Number(idParam), 'noname')
						elaborationHandle.close()
						return
					}
					const dashboard = rows[0]
					let definition: any
					try {
						definition = JSON.parse(dashboard.test_definition_json)
					} catch {
						elaborationHandle.close()
						return
					}
					await form.loadCustomDashboard(definition, dashboard.id, dashboard.name)
					elaborationHandle.close()
				}
				else
				{
					menu.selectItem('custom')
					if (this.customDashboards === null)
					{
						this.customDashboards = new CustomDashboardsComponent();
						this.customDashboards.refresh();
					}
					this.changingSection.appendChild(this.customDashboards)
				}
			}
		}
		
		window.onpopstate = (e) => {
			onhashchange()
		}

		onhashchange()

		this.querySelector('.testing').onclick = () => {
			if (this.dashboards != null)
			{
				const first = this.dashboards.testing_htmlelements()[0]
				first.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
			}
		}

		
	}
	
}

customElements.define('cs-main-component', MainComponent)
