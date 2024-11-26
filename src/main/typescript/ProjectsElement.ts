/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */

import {Component} from './Component.js'
import { DataSetBoxComponent } from './DataSetBoxComponent.js';
import { Loader } from './Loader.js';
import { API3 } from './api/api3.js';
import { cs_cast } from './quality.js';

export class ProjectsElement extends Component
{
	boxContainer;

	constructor()
	{
		super()
		
		this.element.innerHTML = `
			<style>
				
			</style>
			<div class="title">standard dashboards</div>
			<input>
			<!-- <img src="dashitems.png" style="max-width: 100%"> --> 
			<div class="container"></div>
		`
		this.boxContainer = cs_cast(HTMLDivElement, this.element.querySelector('.container'))

		this.boxContainer.textContent = ("loading ...");
	}
	

	async refresh()
	{
		this.boxContainer.textContent = ('');
		const loader = new Loader();
		this.boxContainer.appendChild(loader)
		const json = await API3.list__catchsolve_noiodh__test_dataset_max_ts_vw({})
		await new Promise((s) =>  { setTimeout(s, 1000)})
		loader.remove();
		console.log(json)
		for (let dataset of json)
		{
			const box = new DataSetBoxComponent();
			this.boxContainer.appendChild(box)
			box.refresh(dataset)
		}
		/*
		const resp = await API.get_dataset_list({})
		this.boxContainer.textContent = ('');
		for (let dataset of resp.Items)
		{
			const box = new DataSetBoxComponent();
			this.boxContainer.appendChild(box)
			box.refresh(dataset)
		}
		 */
	} 
}
