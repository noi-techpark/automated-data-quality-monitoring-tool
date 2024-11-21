/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */

import {Component} from './Component.js'

export class MenuElement extends Component
{
	constructor()
	{
		super();
		const menu1 = document.createElement('div');
		menu1.textContent = ("standard dashboards");
		this.element.appendChild(menu1);
		const menu1_submenus = document.createElement('div');
		menu1_submenus.className = ("menu1_submenus");
		this.element.appendChild(menu1_submenus);
		
		for (let i = 0; i < 10; i++)
		{
			const menu1_submenu = document.createElement('div');
			menu1_submenu.textContent = ("dashboard"+i);
			menu1_submenus.appendChild(menu1_submenu);
		}

		/*
		const menu2 = document.createElement('div');
		menu2.textContent = ("my dashboards");
		
		this.element.appendChild(menu2)
		 */
	}
}
