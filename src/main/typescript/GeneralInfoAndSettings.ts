/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */

import { cs_cast, throwNPE } from "./quality.js";

export class GeneralInfoAndSettings extends HTMLElement
{
	
	constructor()
	{
		super();
		const sroot = this.attachShadow({mode: 'open'});
		sroot.innerHTML = `
		<style>
		</style>
		<div class="title">General Info &amp; Setting</div>
		`
		
	}

}

customElements.define('cs-general-info-and-settings', GeneralInfoAndSettings)
