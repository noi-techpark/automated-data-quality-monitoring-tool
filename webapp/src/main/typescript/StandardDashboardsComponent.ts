// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CommonWebComponent } from './CommonWebComponent.js';
import { DatasetCardComponent } from './DatasetCardComponent.js';
import { Loader } from './Loader.js';
import { API3 } from './api/api3.js';
import { cs_cast } from './quality.js';
import template from './StandardDashboardsComponent.html?raw'

export class StandardDashboardsComponent extends CommonWebComponent
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

	testing_htmlelements(): DatasetCardComponent[] {
		return this.boxes
	}

	async refresh()
	{
		this.boxes = []
		this.titles = []
		this.boxContainer.textContent = ('');
		const loader = new Loader();
		this.boxContainer.appendChild(loader)
		let used_key = sessionStorage.getItem('used_key_role')!;
		console.log('used key role', used_key);
		const json = await API3.list__catchsolve_noiodh__test_dataset_max_ts_vw({used_key: used_key})
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
