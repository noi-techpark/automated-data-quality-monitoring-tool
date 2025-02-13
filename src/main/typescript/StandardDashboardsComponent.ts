/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */

import { DatasetCardComponent } from './DatasetCardComponent.js';
import { Loader } from './Loader.js';
import { API3 } from './api/api3.js';
import { cs_cast } from './quality.js';

export class StandardDashboardsComponent extends HTMLElement
{
	sroot
	
	boxContainer;
	
	boxes: DatasetCardComponent[] = []
	titles: string[] = []

	constructor()
	{
		super()
		
		this.sroot = this.attachShadow({ mode: 'open' })
		this.sroot.innerHTML = `
			<link rel="stylesheet" href="index.css">
			<div class="ProjectsElement">
				<div class="title" style="padding: 1rem">standard dashboards</div>
				<div class="searchbar">
					<input> 🔍 <span class="clearinput">✕</span>
				</div>
				<div class="container"></div>
			</div>
		`
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
		const json = await API3.list__catchsolve_noiodh__test_dataset_max_ts_vw({})
		loader.remove();
		console.log(json)
		for (let dataset of json)
		{
			const box = new DatasetCardComponent();
			this.boxContainer.appendChild(box)
			box.refresh(dataset)
			this.boxes.push(box)
			this.titles.push(dataset.dataset_name)
		}
		
	} 
}

customElements.define('cs-standard-dashboards-element', StandardDashboardsComponent)