// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export class Loader extends HTMLElement
{
	constructor() {
		super()
		const sroot = this.attachShadow({ mode: 'open' })
		sroot.innerHTML = `
				<link rel="stylesheet" href="loader.css">
				<style>
					:host {
						width: 65px;
						height: 15px;
						display: inline-block;
						overflow: hidden;
						margin: 2rem;
					}
					div.loader {
						color: #222;
					}
					
				</style>
				<div class="loader" style="margin-top: 0px; margin-left:20px"></div>
				`
		customElements.upgrade(sroot)
		
	}
	
}

customElements.define('cs-loader', Loader)
