/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */

import {Component} from './Component.js'
import { DataSetBoxComponent } from './DataSetBoxComponent.js';
import { Loader } from './Loader.js';
import { API3 } from './api/api3.js';
import { cs_cast } from './quality.js';

export class StandardDashboardsComponent extends HTMLElement
{
	sroot
	
	boxContainer;

	constructor()
	{
		super()
		
		this.sroot = this.attachShadow({ mode: 'open' })
		this.sroot.innerHTML = `
			<link rel="stylesheet" href="index.css">
			<div class="ProjectsElement">
				<div class="title" style="padding: 1rem">standard dashboards</div>
				<input>
				<!-- <img src="dashitems.png" style="max-width: 100%"> --> 
				<div class="container"></div>
			</div>
		`
		this.boxContainer = cs_cast(HTMLDivElement, this.sroot.querySelector('.container'))

		this.boxContainer.textContent = ("loading ...");
	}
	

	async refresh()
	{
		this.boxContainer.textContent = ('');
		const loader = new Loader();
		this.boxContainer.appendChild(loader)
		const json = await API3.list__catchsolve_noiodh__test_dataset_max_ts_vw({})
		loader.remove();
		console.log(json)
		for (let dataset of json)
		{
			const box = new DataSetBoxComponent();
			this.boxContainer.appendChild(box)
			box.refresh(dataset)
		}
		
	} 
}

customElements.define('cs-standard-dashboards-element', StandardDashboardsComponent)