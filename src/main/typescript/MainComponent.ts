/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */

import {MenuElement} from './MenuElement.js'
import {StandardDashboardsComponent} from './StandardDashboardsComponent.js'


import {DatasetIssuesDetail} from './DatasetIssuesDetail.js'
import { cs_cast, cs_notnull } from './quality.js';
import { DatasetCategories } from './DatasetCategories.js';

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
			<div class="MainComponent">
				<div class="header">
					<img class="logo" src="NOI_OPENDATAHUB_NEW_BK_nospace-01.svg">
				</div>
				<div class="body">
					<div class="projects"></div>
				</div>
			</div>
		`
		this.changingSection = this.sroot.querySelector('.projects')!
		
		this.logo = cs_cast(HTMLImageElement, this.sroot.querySelector('.logo'))
		this.logo.onclick = () => {
			location.hash = ''
		}
		
		const menu: MenuElement = new MenuElement();
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
				const detail = new DatasetCategories();
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
