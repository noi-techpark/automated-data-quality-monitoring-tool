


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
						color: #888;
					}
					
				</style>
				<div class="loader" style="margin-top: 0px; margin-left:20px"></div>
				`
		customElements.upgrade(sroot)
		
	}
	
}

customElements.define('cs-loader', Loader)
