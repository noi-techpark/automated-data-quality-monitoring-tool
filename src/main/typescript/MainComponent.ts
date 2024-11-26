/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */

import {Component} from './Component.js'
import {MenuElement} from './MenuElement.js'
import {ProjectsElement} from './ProjectsElement.js'


import {DatasetIssuesDetail} from './DatasetIssuesDetail.js'
import { cs_cast, cs_notnull } from './quality.js';
import { DatasetCategories } from './DatasetCategories.js';

export class MainComponent extends Component
{
	projectsComponent: ProjectsElement|null = null;
	
	changingSection
	
	logo

	constructor()
	{
		super()
		this.element.innerHTML = `
			<div class="header">
				<img class="logo" src="NOI_OPENDATAHUB_NEW_BK_nospace-01.svg">
			</div>
			<div class="body">
				<div class="projects"></div>
			</div>
		`
		this.changingSection = this.element.querySelector('.projects')!
		
		this.logo = cs_cast(HTMLImageElement, this.element.querySelector('.logo'))
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
				if (this.projectsComponent == null)
				{
					this.projectsComponent = new ProjectsElement();
					this.projectsComponent.refresh();
				}
				this.changingSection.appendChild(this.projectsComponent.element)
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
				detail.refresh(session_start_ts, dataset_name);
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
				detail.refresh(session_start_ts, dataset_name, category_name);
				menu.selectItem(dataset_name)
			}
		}
		
		window.onpopstate = (e) => {
			onhashchange()
		}

		onhashchange()

		
	}
	
}
