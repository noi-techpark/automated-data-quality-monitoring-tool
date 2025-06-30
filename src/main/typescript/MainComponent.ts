// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later


import {MenuComponent} from './MenuComponent.js'
import {StandardDashboardsComponent} from './StandardDashboardsComponent.js'


import {DatasetIssuesDetail} from './DatasetIssuesDetail.js'
import { cs_cast, cs_notnull } from './quality.js';
import { DatasetIssuesByCategories } from './DatasetIssuesByCategories.js';

export class MainComponent extends HTMLElement
{
	sroot
	
	dashboards: StandardDashboardsComponent|null = null;
	
	changingSection
	
	logo

	constructor()
	{
		super()
		this.sroot = this.attachShadow({ mode: 'open' })
		this.sroot.innerHTML = `
			<link rel="stylesheet" href="index.css">
			<style>
				cs-menu-element {
					width: 12rem;
				}
			</style>
			<div class="MainComponent">
				<div class="header" style="position: relative">
					<img class="logo" src="NOI_OPENDATAHUB_NEW_BK_nospace-01.svg" >

					<a 
						href="https://europa.provincia.bz.it/it/informazione-e-visibilita-fesr"
					>
						<img src="https://databrowser.impact.digital.noi.bz.it/EFRmod.png"
							alt="Autonomous Province of Bolzano"
							style="position: absolute; top: 10px; right: 20px; height: 30px; " 
						>
					</a>
				</div>
				<div class="body" style="margin-top: 20px">
					<div class="projects"></div>
				</div>
			</div>
		`
		this.changingSection = this.sroot.querySelector('.projects')!
		
		this.logo = cs_cast(HTMLImageElement, this.sroot.querySelector('.logo'))
		this.logo.onclick = () => {
			location.hash = ''
		}
		
		const menu: MenuComponent = new MenuComponent();
		menu.refresh()
		this.changingSection.parentElement!.prepend(menu);
		
		// this.projectsComponent = new ProjectsElement();
		// projects.appendChild(this.projectsComponent.element);
		
		const onhashchange = () => {
			console.log(location.hash)
			
			this.changingSection.textContent = ''
			
			if (location.hash == '')
			{
				if (this.dashboards == null)
				{
					this.dashboards = new StandardDashboardsComponent();
					this.dashboards.refresh();
				}
				this.changingSection.appendChild(this.dashboards)
				menu.selectItem('')
			}

			if (location.hash.indexOf('#page=dataset-categories&') == 0)
			{
				this.changingSection.textContent = ''
				const detail = new DatasetIssuesByCategories();
				this.changingSection.appendChild(detail)
				const params = new URLSearchParams(location.hash.substring(1));
				const session_start_ts = cs_notnull(params.get('session_start_ts'))
				const dataset_name = cs_notnull(params.get('dataset_name'))
				const failed_records = parseInt(cs_notnull(params.get('failed_records')))
				const tested_records = parseInt(cs_notnull(params.get('tested_records')))
				detail.refresh(session_start_ts, dataset_name, failed_records, tested_records);
				menu.selectItem(dataset_name)
			}
			
			if (location.hash.startsWith('#page=summary&'))
			{
				this.changingSection.textContent = ''
				const detail = new DatasetIssuesDetail();
				this.changingSection.appendChild(detail)
				const params = new URLSearchParams(location.hash.substring(1));
				const session_start_ts = cs_notnull(params.get('session_start_ts'))
				const dataset_name = cs_notnull(params.get('dataset_name'))
				const category_name = cs_notnull(params.get('category_name'))
				const failed_records = parseInt(cs_notnull(params.get('failed_records')))
				const tot_records = parseInt(cs_notnull(params.get('tot_records')))
				detail.refresh(session_start_ts, dataset_name, category_name, failed_records, tot_records);
				menu.selectItem(dataset_name)
			}
		}
		
		window.onpopstate = (e) => {
			onhashchange()
		}

		onhashchange()

		
	}
	
}

customElements.define('cs-main-component', MainComponent)
