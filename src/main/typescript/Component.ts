/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */

export class Component
{
	element: HTMLDivElement;

	constructor()
	{
		this.element = window.document.createElement('div');
		this.element.className = this.constructor.name;
	}
}
