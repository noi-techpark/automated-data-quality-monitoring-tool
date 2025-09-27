(() => {
// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later
// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later
// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later
// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later
class $50fcf601af37099e$export$3b0d6d7590275603 extends HTMLElement {
    constructor(){
        super();
        const sroot = this.attachShadow({
            mode: 'open'
        });
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
				`;
        customElements.upgrade(sroot);
    }
}
customElements.define('cs-loader', $50fcf601af37099e$export$3b0d6d7590275603);


// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later
class $1e820cf339dfc6f8$export$3a4b11f05d5e029f {
    static async call(action, json) {
        const params = new URLSearchParams();
        params.append('action', action);
        params.append('filter_byexample', JSON.stringify(json));
        // https://www.catch-solve.tech/noi-odh-testing-tool/api?
        // http://localhost:8080/api?
        const resp = await fetch('api?' + params.toString());
        const respjson = await resp.json();
        // wait for debug pourpose
        // await new Promise((s) =>  { setTimeout(s, 1000)})
        return respjson;
    }
    // begin crudl methods
    static async list__catchsolve_noiodh__test_dataset_max_ts_vw(filter) {
        const resp = await $1e820cf339dfc6f8$export$3a4b11f05d5e029f.call('catchsolve_noiodh.catchsolve_noiodh__test_dataset_max_ts_vw', filter);
        return resp;
    }
    static async list__catchsolve_noiodh__test_dataset_check_category_failed_recors_vw(filter) {
        const resp = await $1e820cf339dfc6f8$export$3a4b11f05d5e029f.call('catchsolve_noiodh.test_dataset_check_category_failed_recors_vw', filter);
        return resp;
    }
    static async list__catchsolve_noiodh__test_dataset_check_category_check_name_failed_recors_vw(filter) {
        const resp = await $1e820cf339dfc6f8$export$3a4b11f05d5e029f.call('catchsolve_noiodh.test_dataset_check_category_check_name_failed_recors_vw', filter);
        return resp;
    }
    static async list__catchsolve_noiodh__test_dataset_check_category_check_name_record_record_failed_vw(filter) {
        const resp = await $1e820cf339dfc6f8$export$3a4b11f05d5e029f.call('catchsolve_noiodh.test_dataset_check_category_check_name_record_record_failed_vw', filter);
        return resp;
    }
    static async list__catchsolve_noiodh__test_dataset_record_check_failed(filter) {
        const resp = await $1e820cf339dfc6f8$export$3a4b11f05d5e029f.call('catchsolve_noiodh.test_dataset_record_check_failed', filter);
        return resp;
    }
    static async list__catchsolve_noiodh__test_dataset_check_category_record_jsonpath_failed_vw(filter) {
        const resp = await $1e820cf339dfc6f8$export$3a4b11f05d5e029f.call('catchsolve_noiodh.test_dataset_check_category_record_jsonpath_failed_vw', filter);
        return resp;
    }
    static async list__catchsolve_noiodh__test_dataset_history_vw(filter) {
        const resp = await $1e820cf339dfc6f8$export$3a4b11f05d5e029f.call('catchsolve_noiodh.test_dataset_history_vw', filter);
        return resp;
    }
}
 // end interfaces


// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later
function $372cab4458345058$export$26be2e78a9bc3271() {
    throw new Error('unexpected null or undefined value');
}
function $372cab4458345058$export$d885650843ca84a5(tc, x) {
    if (x === undefined) throw new Error('runtime cast: x is undefined instead of ' + tc.name);
    if (x === null) throw new Error('runtime cast: x is null instead of ' + tc.name);
    if (typeof x !== 'object') throw new Error('runtime cast: this function check only objects <T extends object>, instead of ' + typeof x);
    if (!(x instanceof tc)) throw new Error('runtime cast: x with type: ' + x.constructor.name + ' does not match required type: ' + tc.name);
    return x;
}
function $372cab4458345058$export$2ddf4623c78330ee(x) {
    if (x === null) throw new Error('unexpected null value');
    return x;
}


class $de236afea176a079$export$c0941f68287dbcd1 extends HTMLElement {
    sroot;
    submenus;
    menuitemByName = {};
    menuready_promise;
    constructor(){
        super();
        this.sroot = this.attachShadow({
            mode: 'open'
        });
        this.sroot.innerHTML = `
			<style>

				.title {
					padding: 0.4rem;
				}

				div.submenus {
					padding-left: 1rem;
					overflow: hidden;
				}
				div.submenus > * {
					margin:  0.4rem;
					padding: 0.2rem;
					cursor: pointer;
				}
				.selected {
					background: #666;
					color: white;
				}
				.title.close ~ .submenus {
					display: none;
				}
				.openclose {
					cursor: pointer;
				}
				.openclose:before {
					content: "\u{25B2}"
				}
				.title.close .openclose:before {
					content: "\u{25BC}"
				}
			</style>
			<div class="title"><span class="openclose"></span> standard dashboards</div>
			<div class="submenus"></div>
		`;
        this.submenus = (0, $372cab4458345058$export$d885650843ca84a5)(HTMLElement, this.sroot.querySelector('div.submenus'));
        const title = (0, $372cab4458345058$export$d885650843ca84a5)(HTMLElement, this.sroot.querySelector('div.title'));
        this.menuitemByName[''] = title;
        title.onclick = ()=>{
            location.hash = '';
        };
        const openclose = (0, $372cab4458345058$export$d885650843ca84a5)(HTMLElement, this.sroot.querySelector('span.openclose'));
        openclose.onclick = ()=>{
            title.classList.toggle('close');
        };
        let menuready_fun;
        this.menuready_promise = new Promise((s)=>menuready_fun = s);
        const json_promise = (0, $1e820cf339dfc6f8$export$3a4b11f05d5e029f).list__catchsolve_noiodh__test_dataset_max_ts_vw({});
        const loader = new (0, $50fcf601af37099e$export$3b0d6d7590275603)();
        this.sroot.appendChild(loader);
        json_promise.then(async (json)=>{
            for (let dataset of json){
                const menu1_submenu = document.createElement('div');
                menu1_submenu.textContent = dataset.dataset_name;
                this.menuitemByName[dataset.dataset_name] = menu1_submenu;
                this.submenus.appendChild(menu1_submenu);
                menu1_submenu.onclick = ()=>{
                    location.hash = "#page=dataset-categories&dataset_name=" + dataset.dataset_name + '&session_start_ts=' + dataset.session_start_ts + "&failed_records=" + dataset.failed_records + "&tested_records=" + dataset.tested_records;
                };
            }
            loader.remove();
            menuready_fun(null);
        });
    }
    async refresh() {}
    async selectItem(name) {
        await this.menuready_promise;
        for(let k in this.menuitemByName){
            const item = this.menuitemByName[k];
            if (name == k) item.classList.add('selected');
            else item.classList.remove('selected');
        }
    }
}
customElements.define('cs-menu-element', $de236afea176a079$export$c0941f68287dbcd1);


// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later
// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later

// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later

class $5fa5f0f9910be384$export$1e36da95ba633cee extends HTMLElement {
    label;
    data;
    constructor(){
        super();
        const sroot = this.attachShadow({
            mode: 'open'
        });
        sroot.innerHTML = `
		<style>
			:host {
				display: flex;
				border-top: 1px solid #ccc;
				padding-top: 0.3rem;
				padding-bottom: 0.3rem;
				align-items: center;
			}
			span {
				font-size: 0.7rem;
			}
			span.label {
				flex-grow: 1;
				margin-right: 0.3rem;
				padding: 0.2rem
			}
			span.data {
				padding: 0.2rem;
				border-radius: 0.3rem;
				margin-right: 0.3rem;
				background-color: var(--dark-background);
				color: #ddd;
				min-width: 2rem;
				text-align: right;
			}
			:host(.fail) span.label {
				background-color: #faa;
				color: #400;
				font-weight: bold;
			}
			:host(.good) span.label {
				background-color: #afa;
				color: #040;
				font-weight: bold;
			}
			:host(.warn) span.label {
				background-color: #ffa;
				color: #440;
				font-weight: bold;
			}
		</style>
		<span class="data">.</span>
		<span class="label"></span>
		`;
        this.label = (0, $372cab4458345058$export$d885650843ca84a5)(HTMLSpanElement, sroot.querySelector('.label'));
        this.setLabel(this.getAttribute('label') !== null ? this.getAttribute('label') : 'label');
        this.data = (0, $372cab4458345058$export$d885650843ca84a5)(HTMLSpanElement, sroot.querySelector('.data'));
    }
    setLabel(s) {
        this.label.textContent = s;
    }
    setData(s) {
        this.data.textContent = s;
    }
    setQualityLevel(severity) {
        this.classList.add(severity);
    }
}
customElements.define('cs-label-and-data', $5fa5f0f9910be384$export$1e36da95ba633cee);


class $8fd4ce611e531164$export$56131fb252e2dabc extends HTMLElement {
    dtitle;
    img;
    checkrecs;
    checkattr;
    failedrecs;
    lastupdate;
    constructor(){
        super();
        const sroot = this.attachShadow({
            mode: 'open'
        });
        sroot.innerHTML = `
			<style>
				:host {
					border: 1px solid #ccc;
					margin: 0.5rem;
					border-radius: 4px;
					cursor: pointer;
					width: 13rem;
					box-shadow: 4px 4px #ccc;
				}
				.title {
					font-weight: bold;
					margin-top: .7rem;
					margin-bottom: 0.3rem;
					text-align: center;
					overflow: hidden;
					height: 2rem;
					line-height: 1rem;
				}
				
				/*
				:host(:hover) .title {
					text-decoration: underline;
				}
				 */
				
				.ts {
					font-size: 0.7rem
				}
				
				.view_dashboard {
					/* background-color: var(--dark-background); */
					background-color: rgb(71, 105, 41);
					color: #ddd;
					text-align: center;
					padding: 0.6rem;
				}
				.view_dashboard:hover {
					background-color: rgb(35, 75, 20);
				}
				
				.wrapper {
					padding: 1rem;
				}

				.lastupdate {
					margin-top: 0.4rem;
					font-size: 0.7rem;
				}
				
				img {
					height: 100px;
					width: 100%;
					object-fit: contain;
					margin-bottom: 0.5rem;
				}
	
			</style>
			<div class="wrapper">
				<div class="title">XXX</div>
				<img class="img">
				<cs-label-and-data class="checktrec">checked records</cs-label-and-data>
				<cs-label-and-data class="checkattr" style="display: none">checked attributes</cs-label-and-data>
				<cs-label-and-data class="totissues" xstyle="display: none">total issues</cs-label-and-data>
				<div class="lastupdate">
					\u{1F551} <span class="data"></span>
					<span></span>
				</div>
			</div>
			<div class="view_dashboard">View dashboard</div>
		`;
        customElements.upgrade(sroot);
        this.checkrecs = (0, $372cab4458345058$export$d885650843ca84a5)((0, $5fa5f0f9910be384$export$1e36da95ba633cee), sroot.querySelector('.checktrec'));
        this.checkattr = (0, $372cab4458345058$export$d885650843ca84a5)((0, $5fa5f0f9910be384$export$1e36da95ba633cee), sroot.querySelector('.checkattr'));
        this.failedrecs = (0, $372cab4458345058$export$d885650843ca84a5)((0, $5fa5f0f9910be384$export$1e36da95ba633cee), sroot.querySelector('.totissues'));
        this.dtitle = (0, $372cab4458345058$export$d885650843ca84a5)(HTMLDivElement, sroot.querySelector('.title'));
        this.img = (0, $372cab4458345058$export$d885650843ca84a5)(HTMLImageElement, sroot.querySelector('.img'));
        this.lastupdate = (0, $372cab4458345058$export$d885650843ca84a5)(HTMLSpanElement, sroot.querySelector('.lastupdate .data'));
        // this.img.style.display = 'none';
        this.checkrecs.setLabel('checked recs');
        this.checkattr.setLabel('checked attrs');
        this.failedrecs.setLabel('quality-assured recs');
    // this.failedrecs.setSeverity("fail")
    // this.failedrecs.setData('123')
    }
    refresh(dataset) {
        const datestr = dataset.session_start_ts;
        const date = new Date(datestr);
        const dateformat = new Intl.DateTimeFormat('it-IT', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: "2-digit",
            timeZone: 'Europe/Rome'
        }).format(date);
        this.dtitle.textContent = dataset.dataset_name;
        this.img.src = dataset.dataset_img_url.length > 0 ? dataset.dataset_img_url : 'dataset-placeholder.png';
        this.checkrecs.setData('' + dataset.tested_records);
        this.checkattr.setData('123');
        this.failedrecs.setData('' + (dataset.tested_records - dataset.failed_records));
        const quality_ratio = dataset.tested_records == 0 ? 100 : dataset.failed_records / dataset.tested_records;
        if (quality_ratio < 0.1) this.failedrecs.setQualityLevel("good");
        else if (quality_ratio < 0.3) this.failedrecs.setQualityLevel("warn");
        else this.failedrecs.setQualityLevel("fail");
        this.lastupdate.textContent = dateformat;
        this.onclick = ()=>{
            location.hash = "#page=dataset-categories&dataset_name=" + dataset.dataset_name + "&session_start_ts=" + dataset.session_start_ts + "&failed_records=" + dataset.failed_records + "&tested_records=" + dataset.tested_records;
            window.scrollTo(0, 0);
        };
    }
}
customElements.define('cs-dataset-box', $8fd4ce611e531164$export$56131fb252e2dabc);





class $8669cd8837fe1d69$export$2bdcae992c3953b6 extends HTMLElement {
    sroot;
    boxContainer;
    boxes = [];
    titles = [];
    constructor(){
        super();
        this.sroot = this.attachShadow({
            mode: 'open'
        });
        this.sroot.innerHTML = `
			<link rel="stylesheet" href="index.css">
			<div class="ProjectsElement">
				<div class="title" style="padding: 1rem">standard dashboards</div>
				<div class="searchbar">
					<input> \u{1F50D} <span class="clearinput">\u{2715}</span>
				</div>
				<div class="container"></div>
			</div>
		`;
        this.boxContainer = (0, $372cab4458345058$export$d885650843ca84a5)(HTMLDivElement, this.sroot.querySelector('.container'));
        this.boxContainer.textContent = "loading ...";
        const refreshlist = ()=>{
            for(let b = 0; b < this.titles.length; b++)if (this.titles[b].toLowerCase().indexOf(input.value.toLowerCase()) >= 0) this.boxes[b].style.display = 'block';
            else this.boxes[b].style.display = 'none';
        };
        const input = this.sroot.querySelector('input');
        input.oninput = refreshlist;
        const clearinput = this.sroot.querySelector('.clearinput');
        clearinput.onclick = ()=>{
            input.value = '';
            refreshlist();
        };
    }
    async refresh() {
        this.boxes = [];
        this.titles = [];
        this.boxContainer.textContent = '';
        const loader = new (0, $50fcf601af37099e$export$3b0d6d7590275603)();
        this.boxContainer.appendChild(loader);
        const json = await (0, $1e820cf339dfc6f8$export$3a4b11f05d5e029f).list__catchsolve_noiodh__test_dataset_max_ts_vw({});
        loader.remove();
        console.log(json);
        for (let dataset of json){
            const box = new (0, $8fd4ce611e531164$export$56131fb252e2dabc)();
            this.boxContainer.appendChild(box);
            box.refresh(dataset);
            this.boxes.push(box);
            this.titles.push(dataset.dataset_name);
        }
    }
}
customElements.define('cs-standard-dashboards-element', $8669cd8837fe1d69$export$2bdcae992c3953b6);


// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later


// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later

class $a733ad434eb12a41$export$a31dc9dd1a4cb4b2 extends HTMLElement {
    content;
    open = true;
    openclose;
    label;
    actions;
    onopen = ()=>{};
    constructor(){
        super();
        const sroot = this.attachShadow({
            mode: 'open'
        });
        sroot.innerHTML = `
				<style>
					:host {
						display: block;
					}
					.header {
						display: flex;
						align-items: center;
					}
					.label {
						flex-grow: 1;
						cursor: pointer;
						padding: 0.4rem;
						user-select: none;
					}
					.openclose {
						cursor: pointer;
						padding: 0.4rem;
						user-select: none;
					}
					.content {
						overflow: hidden;
						transition: transform 1s;
						transform-origin: top;
					}
					
					/*
					span.label::before {
					  content: "";
					  display: inline-block;
					  width: 8px;
					  height: 8px;
					  background-color: red;
					  border-radius: 50%;
					  margin-right: 5px;
					}
					 */
					
					.nextpagebutton {
															margin: auto;
															display: block;
															background-color: black;
															color: white;
														}
														
					
				</style>
				<div class="header">
				<span class="label">title</span>
				<span class="actions">actions</span>
				<span class="openclose"></span>
				</div>
				<div class="content"></div>
				`;
        customElements.upgrade(sroot);
        this.label = (0, $372cab4458345058$export$d885650843ca84a5)(HTMLSpanElement, sroot.querySelector('.label'));
        this.actions = (0, $372cab4458345058$export$d885650843ca84a5)(HTMLSpanElement, sroot.querySelector('.actions'));
        this.content = (0, $372cab4458345058$export$d885650843ca84a5)(HTMLDivElement, sroot.querySelector('.content'));
        this.openclose = (0, $372cab4458345058$export$d885650843ca84a5)(HTMLSpanElement, sroot.querySelector('.openclose'));
        this.openclose.onclick = ()=>{
            this.toggle();
        };
        this.label.onclick = this.openclose.onclick;
        this.toggle();
    }
    toggle() {
        this.open = !this.open;
        this.content.style.height = !this.open ? '0rem' : 'auto';
        this.openclose.textContent = !this.open ? "\u25BC" : "\u25B2";
        if (this.open) {
            this.content.textContent = '' // svuola la sezione
            ;
            this.onopen();
        }
    }
    async refresh(label, actions) {
        this.label.textContent = label;
        this.actions.textContent = actions;
    }
    addElementToContentArea(e) {
        this.content.appendChild(e);
    }
}
customElements.define('cs-open-close-section', $a733ad434eb12a41$export$a31dc9dd1a4cb4b2);


// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later

class $909a658809776454$export$f955a0e263c4d7d2 extends HTMLElement {
    label;
    constructor(){
        super();
        const sroot = this.attachShadow({
            mode: 'open'
        });
        sroot.innerHTML = `
				<style>
					:host {
						display: block;
						border: 1px solid #eee;
						padding: 1rem;
					}
					
				</style>
				<span class="label">title</span>
				`;
        customElements.upgrade(sroot);
        this.label = (0, $372cab4458345058$export$d885650843ca84a5)(HTMLSpanElement, sroot.querySelector('.label'));
    }
    async refresh(s) {
        this.label.textContent = s;
    }
}
customElements.define('cs-section-row', $909a658809776454$export$f955a0e263c4d7d2);



// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later



class $ca572d4d6d9b8dd6$export$729e7aa079c22ee6 extends HTMLElement {
    template;
    connected_promise;
    connected_func = (s)=>null;
    more_div;
    connectedCallback() {
        console.log('connected');
        this.connected_func(null);
    }
    constructor(){
        super();
        this.connected_promise = new Promise((s)=>this.connected_func = s);
        const sroot = this.attachShadow({
            mode: 'open'
        });
        sroot.innerHTML = `
						<style>
							:host {
								display: inline-block;
								box-shadow: 4px 4px #ccc;
							}
							.category {
								border: 1px solid gray;
								width: 12rem;
								display: inline-block;
								/* margin: 1rem; */
							}
							.category > img {
								width: 100%;
							}
							.category .category_name {
								font-weight: bold;
								text-align: center;
								margin-top: 0.4rem;
								margin-bottom: 0.4rem;
								line-height: 1rem;
								height: 2rem;
							}
							.frame {
								display: flex
							}
							.frame .content {
								flex-grow: 100;
								display: flex;
							}
							.chartdiv {
								width:  100px;
								height: 100px;
								margin: auto;
								position: relative;
								margin-top: 0.4rem;
							}
							
							.chartdiv .perc {
								position: absolute;
								top:  calc(50% - 0.8rem);
								left: calc(50% - 1.6rem);
								font-size: 1.5rem;
								font-weight: bold;
								color: #000;
							}
							
							details {
								margin-top: 0.4rem;
								margin-bottom: 0.4rem;
							}
							
							details > * {
								padding: 0.5em;
								border-bottom: 1px solid #ccc;
							}
														
							.view_details {
								/* background-color: var(--dark-background); */
								background-color: rgb(71, 105, 41);
								color: #ddd;
								text-align: center;
								padding: 0.6rem;
								cursor: pointer;
							}
							
							.view_details:hover {
								background-color: rgb(35, 75, 20);
							}

							.lastupdate {
								margin-top: 0.4rem;
								font-size: 0.7rem;
								margin-bottom: 0.4rem;
								margin-left: 0.4rem;
								margin-right: 0.4rem;
							}
							
							.nr_records, details {
								margin-left: 0.4rem;
								margin-right: 0.4rem;
							}

						</style>
						<div class="category">
							<!-- <img src="kpi-pie-chart.png"> -->
							<div class="chartdiv">
								<div class="perc">12%</div>
								<canvas class="chart"></canvas>
							</div>
							<div class="category_name">Completeness</div>
							<span></span>
							<cs-label-and-data label="quality-assured recs" class="nr_records"></cs-label-and-data>
							<div class="lastupdate">
								<span class="data"></span>
								<span></span>
							</div>
							<!-- <div class="nr_records">123</div> -->
							<div class="more">
								<details>
									<summary>carried out tests</summary>
								</details>
								<div class="view_details">View details</div>
							</div>
						</div>
						`;
        customElements.upgrade(sroot);
        this.template = (0, $372cab4458345058$export$d885650843ca84a5)(HTMLElement, sroot.querySelector('.category'));
        this.more_div = (0, $372cab4458345058$export$d885650843ca84a5)(HTMLElement, sroot.querySelector('.more'));
    }
    hideMoreDiv() {
        this.more_div.style.display = 'none';
    }
    async refresh(data) {
        const cat = this.template;
        this.setup_chart(cat, data);
        const cat_name = (0, $372cab4458345058$export$d885650843ca84a5)(HTMLElement, cat.querySelector('.category_name'));
        cat_name.textContent = data.check_category;
        const failedelement = (0, $372cab4458345058$export$d885650843ca84a5)((0, $5fa5f0f9910be384$export$1e36da95ba633cee), cat.querySelector('.nr_records'));
        failedelement.setData('' + (data.tot_records - data.failed_records));
        const last_update = (0, $372cab4458345058$export$d885650843ca84a5)(HTMLSpanElement, cat.querySelector('.lastupdate .data'));
        const date = new Date(data.session_start_ts);
        const perc = (0, $372cab4458345058$export$d885650843ca84a5)(HTMLElement, cat.querySelector('.perc'));
        perc.textContent = '' + ((data.tot_records - data.failed_records) * 100 / data.tot_records).toFixed(1);
        const dateformat = new Intl.DateTimeFormat('it-IT', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: "2-digit",
            timeZone: 'Europe/Rome'
        }).format(date);
        last_update.textContent = dateformat;
        const view_details = (0, $372cab4458345058$export$d885650843ca84a5)(HTMLElement, cat.querySelector('.view_details'));
        view_details.onclick = ()=>{
            location.hash = '#page=summary&session_start_ts=' + data.session_start_ts + '&dataset_name=' + data.dataset_name + '&category_name=' + data.check_category + '&failed_records=' + data.failed_records + '&tot_records=' + data.tot_records;
        };
        const cat_details = (0, $372cab4458345058$export$d885650843ca84a5)(HTMLElement, cat.querySelector('details'));
        (0, $1e820cf339dfc6f8$export$3a4b11f05d5e029f).list__catchsolve_noiodh__test_dataset_check_category_check_name_failed_recors_vw({
            session_start_ts: data.session_start_ts,
            dataset_name: data.dataset_name,
            check_category: data.check_category
        }).then((checks)=>{
            console.log(checks);
            for(let i2 = 0; i2 < checks.length; i2++){
                const div = document.createElement('div');
                div.textContent = checks[i2].check_name // + ' ' + checks[i2].failed_records +  ' / ' + checks[i2].tot_records 
                ;
                cat_details.appendChild(div);
            }
        });
    }
    async setup_chart(cat, arg1) {
        await this.connected_promise;
        const chart = (0, $372cab4458345058$export$d885650843ca84a5)(HTMLCanvasElement, cat.querySelector('.chart'));
        // const context = chart.getContext('2d');
        new Chart(chart, {
            type: 'doughnut',
            data: {
                labels: [
                    'ok',
                    'fail'
                ],
                datasets: [
                    {
                        label: 'Dataset 1',
                        data: [
                            arg1.tot_records - arg1.failed_records,
                            arg1.failed_records
                        ],
                        backgroundColor: [
                            '#0a0',
                            '#222'
                        ]
                    }
                ]
            },
            options: {
                cutout: '80%',
                responsive: true,
                plugins: {
                    legend: {
                        display: false,
                        position: 'top'
                    },
                    title: {
                        display: false,
                        text: 'Chart.js Doughnut Chart'
                    }
                }
            }
        });
    }
}
customElements.define('cs-dataset-issue-category', $ca572d4d6d9b8dd6$export$729e7aa079c22ee6);


class $c8d932129275398d$export$2dcbc072ead0b1fd extends HTMLElement {
    container;
    last_session_start_ts = null;
    last_dataset_name = null;
    last_check_category = null;
    last_failed_records = null;
    last_tot_records = null;
    current_tab = 'issues';
    sroot;
    canvas;
    // connected_promise
    // connected_func: (s: null) => void = s => null
    chartjs_success;
    chartjs_promise;
    issues;
    records;
    // info_and_settings: GeneralInfoAndSettings;
    connectedCallback() {
        // chartjs need to be created when element is attached into the dom
        const chart = new Chart(this.canvas, {
            type: 'line',
            data: {
                labels: [
                    '-5',
                    '-4',
                    '-3',
                    '-2',
                    '-1'
                ],
                datasets: []
            },
            options: {
                scales: {
                    y: {
                        stacked: true,
                        beginAtZero: true
                    }
                }
            }
        });
        this.chartjs_success(chart);
    }
    constructor(){
        super();
        this.chartjs_success = (s)=>{} // dummy initialization, next line will init chartjs_success but compiler don't understand this!
        ;
        this.chartjs_promise = new Promise((s)=>this.chartjs_success = s);
        this.sroot = this.attachShadow({
            mode: 'open'
        });
        this.sroot.innerHTML = `
				<style>
					:host {
						padding: 0.5rem;
						display: block;
					}
					.container {
						border: 1px solid #ccc;
						border-radius: 0.3rem;
					}
					
					.container > * {
						border-bottom: 1px solid #ccc;
					}
					.header {
						display: flex;
					}
					.header .chart {
						width: 50%;
					}
					
					.actions {
						border: 1px solid black;
						width: 10rem;
						margin-left: auto;
						display: flex;
						border-radius: 0.4rem;
						margin-bottom: 0.5rem;
					}
					
					.actions span.selected {
						color: white;
						background-color: black;
					}
					
					.actions span {
						flex-grow: 50;
						text-align: center;
						cursor: pointer;
					}
					
					.nextpagebutton {
															margin: auto;
															display: block;
															background-color: black;
															color: white;
														}
														
					

				
				</style>
				<!-- <img src="kpi-detail.png" style="max-width: 100%"> -->
				<div class="header">
					<div>
						<cs-dataset-issue-category></cs-dataset-issue-category>
					</div>
					<div class="chart">
						<canvas></canvas>
					</div>
					<!--<cs-general-info-and-settings></cs-general-info-and-settings>-->
				</div>
				<div style="width: calc(100% - 20px)">
					<div style="text-align: right" class="actions">
						<span class="issues">Issues</span>
						<span class="records">Records</span>
					</div>
					<div class="container"></div>
				</div>
				`;
        customElements.upgrade(this.sroot);
        this.container = (0, $372cab4458345058$export$d885650843ca84a5)(HTMLDivElement, this.sroot.querySelector('.container'));
        this.issues = (0, $372cab4458345058$export$d885650843ca84a5)(HTMLSpanElement, this.sroot.querySelector('.issues'));
        this.records = (0, $372cab4458345058$export$d885650843ca84a5)(HTMLSpanElement, this.sroot.querySelector('.records'));
        this.issues.onclick = ()=>{
            this.current_tab = 'issues';
            if (this.last_session_start_ts != null && this.last_dataset_name != null && this.last_check_category != null && this.last_failed_records != null && this.last_tot_records != null) this.refresh(this.last_session_start_ts, this.last_dataset_name, this.last_check_category, this.last_failed_records, this.last_tot_records);
        };
        this.records.onclick = ()=>{
            this.current_tab = 'records';
            if (this.last_session_start_ts != null && this.last_dataset_name != null && this.last_check_category != null && this.last_failed_records != null && this.last_tot_records != null) this.refresh(this.last_session_start_ts, this.last_dataset_name, this.last_check_category, this.last_failed_records, this.last_tot_records);
        };
        this.canvas = (0, $372cab4458345058$export$d885650843ca84a5)(HTMLCanvasElement, this.sroot.querySelector('canvas'));
    // this.info_and_settings = cs_cast(GeneralInfoAndSettings, this.sroot.querySelector('cs-general-info-and-settings'));
    }
    extractHumanReadableName(record_jsonpath, json) {
        let ret = '';
        for (let fn of [
            'sname',
            'mvalidtime',
            'mvalue',
            'AccoDetail.de.Name',
            'Detail.de.Title'
        ]){
            const fn_parts = fn.split('.');
            let val = JSON.parse(json);
            for (let p of fn_parts){
                val = val[p];
                if (val === undefined) break;
            }
            // const val = start[fn] 
            if (val !== undefined) ret += (ret === '' ? '' : ', ') + fn + '=' + JSON.stringify(val);
        }
        if (ret == '') ret = record_jsonpath;
        return ret;
    }
    groupRecords(list) {
        const groupBy = {};
        for(let k = 0; k < list.length; k++){
            const json = JSON.parse(list[k].record_json);
            let sname = json['sname'];
            if (typeof sname !== 'string') sname = '';
            let prev_arr = groupBy[sname];
            prev_arr = prev_arr === undefined ? [] : prev_arr;
            prev_arr.push(list[k]);
            groupBy[sname] = prev_arr;
        }
        return groupBy;
    }
    async refresh(p_session_start_ts, p_dataset_name, p_category_name, p_failed_records, p_tot_records) {
        this.last_session_start_ts = p_session_start_ts;
        this.last_dataset_name = p_dataset_name;
        this.last_check_category = p_category_name;
        this.last_failed_records = p_failed_records;
        this.last_tot_records = p_tot_records;
        // this.info_and_settings.refresh(p_session_start_ts, p_dataset_name, p_failed_records, p_tot_records)
        console.log(p_session_start_ts);
        console.log(p_dataset_name);
        console.log(p_category_name);
        (async ()=>{
            const data = await (0, $1e820cf339dfc6f8$export$3a4b11f05d5e029f).list__catchsolve_noiodh__test_dataset_history_vw({
                dataset_name: this.last_dataset_name,
                check_category: this.last_check_category
            });
            // const goodarr  = []
            // const failarr  = []
            const labels = [];
            const datasets = [];
            for(let x = 0; x < data.length; x++){
                const row = data[x];
                labels.push(row.session_start_ts.slice(0, 16).replace('T', ' '));
                const check_stats = JSON.parse(row.check_stats);
                console.log(check_stats);
                for(let c = 0; c < check_stats.length; c++){
                    const check_stat = check_stats[c];
                    let found = false;
                    for(let d = 0; d < datasets.length; d++)if (datasets[d].label == check_stat.check_name) {
                        datasets[d].data.push(check_stat.failed_recs);
                        found = true;
                        break;
                    }
                    if (!found) datasets.push({
                        label: check_stat.check_name,
                        data: [
                            check_stat.failed_recs
                        ],
                        fill: false,
                        backgroundColor: '#aaa',
                        borderColor: '#aaa',
                        tension: 0.1
                    });
                }
            /*
						goodarr.push(data[x].tested_records - data[x].failed_recs)
						failarr.push(data[x].failed_recs)
						 */ }
            const chartjs = await this.chartjs_promise;
            chartjs.data.labels = labels;
            chartjs.data.datasets = datasets;
            /*
					chartjs.data.datasets = [
												{
													label: 'fail trend',
													data: failarr,
													fill: false,
													backgroundColor: '#222',
													borderColor: '#222',
													tension: 0.1
												},
												{
													label: 'total trend',
													data: goodarr,
													fill: false,
													backgroundColor: '#aaa',
													borderColor: '#aaa',
													tension: 0.1
												},						
											]
					*/ chartjs.update();
        })();
        const category = (0, $372cab4458345058$export$d885650843ca84a5)((0, $ca572d4d6d9b8dd6$export$729e7aa079c22ee6), this.sroot.querySelector('cs-dataset-issue-category'));
        category.hideMoreDiv();
        category.refresh({
            dataset_name: p_dataset_name,
            session_start_ts: p_session_start_ts,
            check_category: p_category_name,
            failed_records: p_failed_records,
            tot_records: p_tot_records
        });
        this.container.textContent = '';
        if (this.current_tab === 'issues') {
            this.records.classList.remove('selected');
            this.issues.classList.add('selected');
            const loader = new (0, $50fcf601af37099e$export$3b0d6d7590275603)();
            this.container.appendChild(loader);
            const json = await (0, $1e820cf339dfc6f8$export$3a4b11f05d5e029f).list__catchsolve_noiodh__test_dataset_check_category_check_name_record_record_failed_vw({
                session_start_ts: p_session_start_ts,
                dataset_name: p_dataset_name,
                check_category: p_category_name
            });
            loader.remove();
            for(let i = 0; i < json.length; i++){
                const issue = json[i];
                // console.log(issue)
                const section = new (0, $a733ad434eb12a41$export$a31dc9dd1a4cb4b2)();
                section.refresh(issue.check_name, 'failed: ' + issue.nr_records + ' records');
                this.container.appendChild(section);
                section.onopen = async ()=>{
                    const moreButton = document.createElement('button');
                    moreButton.classList.add('nextpagebutton');
                    moreButton.textContent = 'next 100';
                    section.addElementToContentArea(moreButton);
                    let list_offset = 0;
                    const nextFun = async ()=>{
                        const json2 = await (0, $1e820cf339dfc6f8$export$3a4b11f05d5e029f).list__catchsolve_noiodh__test_dataset_record_check_failed({
                            session_start_ts: p_session_start_ts,
                            dataset_name: p_dataset_name,
                            check_category: p_category_name,
                            check_name: issue.check_name,
                            limit: 100,
                            offset: list_offset
                        });
                        // const list = groupBy[keys[0]]
                        for(let k2 = 0; k2 < json2.length; k2++){
                            const sectionRow2 = new (0, $909a658809776454$export$f955a0e263c4d7d2)();
                            // section.addElementToContentArea(sectionRow2)
                            moreButton.parentElement.insertBefore(sectionRow2, moreButton);
                            sectionRow2.refresh(this.extractHumanReadableName(json2[k2].record_jsonpath, json2[k2].record_json));
                            // sectionRow2.refresh(json2[k2].problem_hint)
                            sectionRow2.onclick = ()=>{
                                alert(json2[k2].record_json);
                            };
                        }
                        list_offset += 100;
                    };
                    moreButton.onclick = nextFun;
                    nextFun();
                /*
					//console.log('sezione aperta, ricarico!')
					const json2 = await API3.list__catchsolve_noiodh__test_dataset_record_check_failed({
								session_start_ts: p_session_start_ts,
								dataset_name: p_dataset_name,
								check_category: p_category_name,
								check_name: issue.check_name
					});
					const groupBy = this.groupRecords(json2)
					const keys = Object.keys(groupBy)
					console.log(keys)
					if (keys.length == 1 && keys[0] == '')
					{
						const moreButton = document.createElement('button')
						moreButton.textContent = 'next 10'
						section.addElementToContentArea(moreButton)
						const nextFun = () => {
							const list = groupBy[keys[0]]
							for (let k2 = 0; k2 < list.length; k2++)
							{
								const sectionRow2 = new SectionRow();
								section.addElementToContentArea(sectionRow2)
								// sectionRow2.refresh(this.extractHumanReadableName(list[k2].record_jsonpath, list[k2].record_json))
								sectionRow2.refresh(list[k2].problem_hint)
								sectionRow2.onclick = () => {
									alert(list[k2].record_json)
								}
							}
							
						}
						moreButton.onclick = nextFun
					}
					else
					{
						for (let k = 0; k < keys.length; k++)
						{
							const sectionRow = new OpenCloseSection();
							section.addElementToContentArea(sectionRow)
							sectionRow.refresh(keys[k], '' + groupBy[keys[k]].length + ' records')
							sectionRow.onclick = () => {
								const list = groupBy[keys[k]]
								console.log(list)
								for (let k2 = 0; k2 < list.length; k2++)
								{
									const sectionRow2 = new SectionRow();
									sectionRow.addElementToContentArea(sectionRow2)
									// sectionRow2.refresh(this.extractHumanReadableName(list[k2].record_jsonpath, list[k2].record_json))
									sectionRow2.refresh(list[k2].problem_hint)
									sectionRow2.onclick = () => {
										alert(list[k2].record_json)
									}
								}
							}
						}
					}
					*/ };
            }
        }
        if (this.current_tab === 'records') {
            this.issues.classList.remove('selected');
            this.records.classList.add('selected');
            const moreButton = document.createElement('button');
            moreButton.classList.add('nextpagebutton');
            moreButton.textContent = 'next 100';
            this.container.appendChild(moreButton);
            let list_offset = 0;
            const nextFun = async ()=>{
                const loader = new (0, $50fcf601af37099e$export$3b0d6d7590275603)();
                this.container.appendChild(loader);
                const list = await (0, $1e820cf339dfc6f8$export$3a4b11f05d5e029f).list__catchsolve_noiodh__test_dataset_check_category_record_jsonpath_failed_vw({
                    session_start_ts: p_session_start_ts,
                    dataset_name: p_dataset_name,
                    check_category: p_category_name,
                    offset: list_offset,
                    limit: 100
                });
                loader.remove();
                for(let k2 = 0; k2 < list.length; k2++){
                    const sectionRow2 = new (0, $a733ad434eb12a41$export$a31dc9dd1a4cb4b2)();
                    // this.container.appendChild(sectionRow2)
                    moreButton.parentElement.insertBefore(sectionRow2, moreButton);
                    sectionRow2.refresh(this.extractHumanReadableName(list[k2].record_jsonpath, list[k2].record_json), '' + list[k2].nr_check_names + ' check failed');
                    sectionRow2.onclick = async ()=>{
                        const json2 = await (0, $1e820cf339dfc6f8$export$3a4b11f05d5e029f).list__catchsolve_noiodh__test_dataset_record_check_failed({
                            session_start_ts: p_session_start_ts,
                            dataset_name: p_dataset_name,
                            check_category: p_category_name,
                            record_jsonpath: list[k2].record_jsonpath
                        });
                        for(let k = 0; k < json2.length; k++){
                            const sectionRow = new (0, $909a658809776454$export$f955a0e263c4d7d2)();
                            sectionRow2.addElementToContentArea(sectionRow);
                            sectionRow.refresh("failed: " + json2[k].check_name);
                        }
                    };
                }
                list_offset += 100;
            };
            moreButton.onclick = nextFun;
            nextFun();
        /*
			const groupBy = this.groupRecords(json)
			const keys = Object.keys(groupBy)
			console.log(keys)
			if (keys.length == 1 && keys[0] == '')
			{
				const list = groupBy[keys[0]]
				for (let k2 = 0; k2 < list.length; k2++)
				{
					const sectionRow2 = new OpenCloseSection();
					this.container.appendChild(sectionRow2)
					sectionRow2.refresh(this.extractHumanReadableName(list[k2].record_jsonpath, list[k2].record_json), '' + list[k2].nr_check_names + ' check failed')
					sectionRow2.onclick = async () => {
						const json2 = await API3.list__catchsolve_noiodh__test_dataset_record_check_failed({
													session_start_ts: p_session_start_ts,
													dataset_name: p_dataset_name,
													check_category: p_category_name,
													record_jsonpath: list[k2].record_jsonpath
											});

						for (let k = 0; k < json2.length; k++)
						{
							const sectionRow = new SectionRow();
							sectionRow2.addElementToContentArea(sectionRow)
							sectionRow.refresh("failed: " + json2[k].check_name)
						}
					}
				}
			}
			else
			{
				for (let k = 0; k < keys.length; k++)
				{
					const sectionRow = new OpenCloseSection();
					this.container.appendChild(sectionRow)
					sectionRow.refresh(keys[k], '' + groupBy[keys[k]].length + ' records')
					sectionRow.onclick = () => {
						const list = groupBy[keys[k]]
						console.log(list)
						for (let k2 = 0; k2 < list.length; k2++)
						{
							const sectionRow2 = new OpenCloseSection();
							sectionRow.addElementToContentArea(sectionRow2)
							sectionRow2.refresh(this.extractHumanReadableName(list[k2].record_jsonpath, list[k2].record_json), list[k2].nr_check_names)
							sectionRow2.onclick = async (e) => {
								e.stopPropagation()
								const json2 = await API3.list__catchsolve_noiodh__test_dataset_record_check_failed({
																					session_start_ts: p_session_start_ts,
																					dataset_name: p_dataset_name,
																					check_category: p_category_name,
																					record_jsonpath: list[k2].record_jsonpath
													});
								for (let k = 0; k < json2.length; k++)
								{
									const sectionRow = new SectionRow();
									sectionRow2.addElementToContentArea(sectionRow)
									sectionRow.refresh(json2[k].check_name)
								}
								
							}
						}
					}
				}
			}
			 */ }
    }
}
customElements.define('cs-dataset-issues-detail', $c8d932129275398d$export$2dcbc072ead0b1fd);



// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later




class $37b7d08b4187bf8a$export$1b80eba8896b3ede extends HTMLElement {
    content;
    connected_promise;
    connected_func = (s)=>null;
    connectedCallback() {
        console.log('connected');
        this.connected_func(null);
    }
    sroot;
    // info_and_settings
    noissues;
    constructor(){
        super();
        this.connected_promise = new Promise((s)=>this.connected_func = s);
        this.sroot = this.attachShadow({
            mode: 'open'
        });
        this.sroot.innerHTML = `
						<style>
							:host {
							}
							.category {
								border: 1px solid gray;
								width: 12rem;
								display: inline-block;
								margin: 1rem;
							}
							.category > img {
								width: 100%;
							}
							.category .category_name {
								font-weight: bold;
							}
							.frame {
								display: flex;
								align-items: start;
							}
							.frame .content {
								flex-grow: 100;
								display: flex;
								align-items: start;
							}
							.chartdiv {
								width:  100px;
								height: 100px;
								margin: auto;
							}
							details > *:nth-child(even) {
							  background-color: #ccc;
							}
							
							.content > * {
								margin-top: 1rem;
								margin-left: 1rem;
							}
							.noissues {
								display: none;
							}
						</style>
						<div class="frame">
							<div class="noissues">sound good, no problems found here!</div>
							<div class="content"></div>
							<!--<cs-general-info-and-settings></cs-general-info-and-settings>-->
							<!--<img src="kpi-general-info.png">-->
						</div>
						`;
        customElements.upgrade(this.sroot);
        this.content = (0, $372cab4458345058$export$d885650843ca84a5)(HTMLElement, this.sroot.querySelector('.content'));
        // this.info_and_settings = cs_cast(GeneralInfoAndSettings, this.sroot.querySelector('cs-general-info-and-settings'));
        this.noissues = (0, $372cab4458345058$export$d885650843ca84a5)(HTMLDivElement, this.sroot.querySelector('.noissues'));
    }
    async refresh(p_session_start_ts, p_dataset_name, p_failed_records, p_tot_records) {
        // this.info_and_settings.refresh(p_session_start_ts, p_dataset_name, p_failed_records, p_tot_records);
        const loader = new (0, $50fcf601af37099e$export$3b0d6d7590275603)();
        this.content.appendChild(loader);
        const resp = await (0, $1e820cf339dfc6f8$export$3a4b11f05d5e029f).list__catchsolve_noiodh__test_dataset_check_category_failed_recors_vw({
            session_start_ts: p_session_start_ts,
            dataset_name: p_dataset_name
        });
        loader.remove();
        console.log(resp);
        for(let i = 0; i < resp.length; i++){
            const category = new (0, $ca572d4d6d9b8dd6$export$729e7aa079c22ee6)();
            this.content.appendChild(category);
            category.refresh(resp[i]);
        }
        this.noissues.style.display = resp.length == 0 ? 'block' : 'none';
    }
}
customElements.define('cs-dataset-categories', $37b7d08b4187bf8a$export$1b80eba8896b3ede);


/*
 * Copyright 2016 Red Hat, Inc. and/or its affiliates
 * and other contributors as indicated by the @author tags.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function $0a57ee69e1387252$var$Keycloak(config) {
    if (!(this instanceof $0a57ee69e1387252$var$Keycloak)) throw new Error("The 'Keycloak' constructor must be invoked with 'new'.");
    if (typeof config !== 'string' && !$0a57ee69e1387252$var$isObject(config)) throw new Error("The 'Keycloak' constructor must be provided with a configuration object, or a URL to a JSON configuration file.");
    if ($0a57ee69e1387252$var$isObject(config)) {
        const requiredProperties = 'oidcProvider' in config ? [
            'clientId'
        ] : [
            'url',
            'realm',
            'clientId'
        ];
        for (const property of requiredProperties){
            if (!config[property]) throw new Error(`The configuration object is missing the required '${property}' property.`);
        }
    }
    var kc = this;
    var adapter;
    var refreshQueue = [];
    var callbackStorage;
    var loginIframe = {
        enable: true,
        callbackList: [],
        interval: 5
    };
    kc.didInitialize = false;
    var useNonce = true;
    var logInfo = createLogger(console.info);
    var logWarn = createLogger(console.warn);
    if (!globalThis.isSecureContext) logWarn("[KEYCLOAK] Keycloak JS must be used in a 'secure context' to function properly as it relies on browser APIs that are otherwise not available.\nContinuing to run your application insecurely will lead to unexpected behavior and breakage.\n\nFor more information see: https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts");
    kc.init = function(initOptions = {}) {
        if (kc.didInitialize) throw new Error("A 'Keycloak' instance can only be initialized once.");
        kc.didInitialize = true;
        kc.authenticated = false;
        callbackStorage = createCallbackStorage();
        var adapters = [
            'default',
            'cordova',
            'cordova-native'
        ];
        if (adapters.indexOf(initOptions.adapter) > -1) adapter = loadAdapter(initOptions.adapter);
        else if (typeof initOptions.adapter === "object") adapter = initOptions.adapter;
        else if (window.Cordova || window.cordova) adapter = loadAdapter('cordova');
        else adapter = loadAdapter();
        if (typeof initOptions.useNonce !== 'undefined') useNonce = initOptions.useNonce;
        if (typeof initOptions.checkLoginIframe !== 'undefined') loginIframe.enable = initOptions.checkLoginIframe;
        if (initOptions.checkLoginIframeInterval) loginIframe.interval = initOptions.checkLoginIframeInterval;
        if (initOptions.onLoad === 'login-required') kc.loginRequired = true;
        if (initOptions.responseMode) {
            if (initOptions.responseMode === 'query' || initOptions.responseMode === 'fragment') kc.responseMode = initOptions.responseMode;
            else throw 'Invalid value for responseMode';
        }
        if (initOptions.flow) {
            switch(initOptions.flow){
                case 'standard':
                    kc.responseType = 'code';
                    break;
                case 'implicit':
                    kc.responseType = 'id_token token';
                    break;
                case 'hybrid':
                    kc.responseType = 'code id_token token';
                    break;
                default:
                    throw 'Invalid value for flow';
            }
            kc.flow = initOptions.flow;
        }
        if (initOptions.timeSkew != null) kc.timeSkew = initOptions.timeSkew;
        if (initOptions.redirectUri) kc.redirectUri = initOptions.redirectUri;
        if (initOptions.silentCheckSsoRedirectUri) kc.silentCheckSsoRedirectUri = initOptions.silentCheckSsoRedirectUri;
        if (typeof initOptions.silentCheckSsoFallback === 'boolean') kc.silentCheckSsoFallback = initOptions.silentCheckSsoFallback;
        else kc.silentCheckSsoFallback = true;
        if (typeof initOptions.pkceMethod !== "undefined") {
            if (initOptions.pkceMethod !== "S256" && initOptions.pkceMethod !== false) throw new TypeError(`Invalid value for pkceMethod', expected 'S256' or false but got ${initOptions.pkceMethod}.`);
            kc.pkceMethod = initOptions.pkceMethod;
        } else kc.pkceMethod = "S256";
        if (typeof initOptions.enableLogging === 'boolean') kc.enableLogging = initOptions.enableLogging;
        else kc.enableLogging = false;
        if (initOptions.logoutMethod === 'POST') kc.logoutMethod = 'POST';
        else kc.logoutMethod = 'GET';
        if (typeof initOptions.scope === 'string') kc.scope = initOptions.scope;
        if (typeof initOptions.acrValues === 'string') kc.acrValues = initOptions.acrValues;
        if (typeof initOptions.messageReceiveTimeout === 'number' && initOptions.messageReceiveTimeout > 0) kc.messageReceiveTimeout = initOptions.messageReceiveTimeout;
        else kc.messageReceiveTimeout = 10000;
        if (!kc.responseMode) kc.responseMode = 'fragment';
        if (!kc.responseType) {
            kc.responseType = 'code';
            kc.flow = 'standard';
        }
        var promise = createPromise();
        var initPromise = createPromise();
        initPromise.promise.then(function() {
            kc.onReady && kc.onReady(kc.authenticated);
            promise.setSuccess(kc.authenticated);
        }).catch(function(error) {
            promise.setError(error);
        });
        var configPromise = loadConfig();
        function onLoad() {
            var doLogin = function(prompt) {
                if (!prompt) options.prompt = 'none';
                if (initOptions.locale) options.locale = initOptions.locale;
                kc.login(options).then(function() {
                    initPromise.setSuccess();
                }).catch(function(error) {
                    initPromise.setError(error);
                });
            };
            var checkSsoSilently = async function() {
                var ifrm = document.createElement("iframe");
                var src = await kc.createLoginUrl({
                    prompt: 'none',
                    redirectUri: kc.silentCheckSsoRedirectUri
                });
                ifrm.setAttribute("src", src);
                ifrm.setAttribute("sandbox", "allow-storage-access-by-user-activation allow-scripts allow-same-origin");
                ifrm.setAttribute("title", "keycloak-silent-check-sso");
                ifrm.style.display = "none";
                document.body.appendChild(ifrm);
                var messageCallback = function(event) {
                    if (event.origin !== window.location.origin || ifrm.contentWindow !== event.source) return;
                    var oauth = parseCallback(event.data);
                    processCallback(oauth, initPromise);
                    document.body.removeChild(ifrm);
                    window.removeEventListener("message", messageCallback);
                };
                window.addEventListener("message", messageCallback);
            };
            var options = {};
            switch(initOptions.onLoad){
                case 'check-sso':
                    if (loginIframe.enable) setupCheckLoginIframe().then(function() {
                        checkLoginIframe().then(function(unchanged) {
                            if (!unchanged) kc.silentCheckSsoRedirectUri ? checkSsoSilently() : doLogin(false);
                            else initPromise.setSuccess();
                        }).catch(function(error) {
                            initPromise.setError(error);
                        });
                    });
                    else kc.silentCheckSsoRedirectUri ? checkSsoSilently() : doLogin(false);
                    break;
                case 'login-required':
                    doLogin(true);
                    break;
                default:
                    throw 'Invalid value for onLoad';
            }
        }
        function processInit() {
            var callback = parseCallback(window.location.href);
            if (callback) window.history.replaceState(window.history.state, null, callback.newUrl);
            if (callback && callback.valid) return setupCheckLoginIframe().then(function() {
                processCallback(callback, initPromise);
            }).catch(function(error) {
                initPromise.setError(error);
            });
            if (initOptions.token && initOptions.refreshToken) {
                setToken(initOptions.token, initOptions.refreshToken, initOptions.idToken);
                if (loginIframe.enable) setupCheckLoginIframe().then(function() {
                    checkLoginIframe().then(function(unchanged) {
                        if (unchanged) {
                            kc.onAuthSuccess && kc.onAuthSuccess();
                            initPromise.setSuccess();
                            scheduleCheckIframe();
                        } else initPromise.setSuccess();
                    }).catch(function(error) {
                        initPromise.setError(error);
                    });
                });
                else kc.updateToken(-1).then(function() {
                    kc.onAuthSuccess && kc.onAuthSuccess();
                    initPromise.setSuccess();
                }).catch(function(error) {
                    kc.onAuthError && kc.onAuthError();
                    if (initOptions.onLoad) onLoad();
                    else initPromise.setError(error);
                });
            } else if (initOptions.onLoad) onLoad();
            else initPromise.setSuccess();
        }
        configPromise.then(function() {
            check3pCookiesSupported().then(processInit).catch(function(error) {
                promise.setError(error);
            });
        });
        configPromise.catch(function(error) {
            promise.setError(error);
        });
        return promise.promise;
    };
    kc.login = function(options) {
        return adapter.login(options);
    };
    function generateRandomData(len) {
        if (typeof crypto === "undefined" || typeof crypto.getRandomValues === "undefined") throw new Error("Web Crypto API is not available.");
        return crypto.getRandomValues(new Uint8Array(len));
    }
    function generateCodeVerifier(len) {
        return generateRandomString(len, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');
    }
    function generateRandomString(len, alphabet) {
        var randomData = generateRandomData(len);
        var chars = new Array(len);
        for(var i = 0; i < len; i++)chars[i] = alphabet.charCodeAt(randomData[i] % alphabet.length);
        return String.fromCharCode.apply(null, chars);
    }
    async function generatePkceChallenge(pkceMethod, codeVerifier) {
        if (pkceMethod !== "S256") throw new TypeError(`Invalid value for 'pkceMethod', expected 'S256' but got '${pkceMethod}'.`);
        // hash codeVerifier, then encode as url-safe base64 without padding
        const hashBytes = new Uint8Array(await $0a57ee69e1387252$var$sha256Digest(codeVerifier));
        const encodedHash = $0a57ee69e1387252$var$bytesToBase64(hashBytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '');
        return encodedHash;
    }
    function buildClaimsParameter(requestedAcr) {
        var claims = {
            id_token: {
                acr: requestedAcr
            }
        };
        return JSON.stringify(claims);
    }
    kc.createLoginUrl = async function(options) {
        var state = createUUID();
        var nonce = createUUID();
        var redirectUri = adapter.redirectUri(options);
        var callbackState = {
            state: state,
            nonce: nonce,
            redirectUri: encodeURIComponent(redirectUri),
            loginOptions: options
        };
        if (options && options.prompt) callbackState.prompt = options.prompt;
        var baseUrl;
        if (options && options.action == 'register') baseUrl = kc.endpoints.register();
        else baseUrl = kc.endpoints.authorize();
        var scope = options && options.scope || kc.scope;
        if (!scope) // if scope is not set, default to "openid"
        scope = "openid";
        else if (scope.indexOf("openid") === -1) // if openid scope is missing, prefix the given scopes with it
        scope = "openid " + scope;
        var url = baseUrl + '?client_id=' + encodeURIComponent(kc.clientId) + '&redirect_uri=' + encodeURIComponent(redirectUri) + '&state=' + encodeURIComponent(state) + '&response_mode=' + encodeURIComponent(kc.responseMode) + '&response_type=' + encodeURIComponent(kc.responseType) + '&scope=' + encodeURIComponent(scope);
        if (useNonce) url = url + '&nonce=' + encodeURIComponent(nonce);
        if (options && options.prompt) url += '&prompt=' + encodeURIComponent(options.prompt);
        if (options && typeof options.maxAge === 'number') url += '&max_age=' + encodeURIComponent(options.maxAge);
        if (options && options.loginHint) url += '&login_hint=' + encodeURIComponent(options.loginHint);
        if (options && options.idpHint) url += '&kc_idp_hint=' + encodeURIComponent(options.idpHint);
        if (options && options.action && options.action != 'register') url += '&kc_action=' + encodeURIComponent(options.action);
        if (options && options.locale) url += '&ui_locales=' + encodeURIComponent(options.locale);
        if (options && options.acr) {
            var claimsParameter = buildClaimsParameter(options.acr);
            url += '&claims=' + encodeURIComponent(claimsParameter);
        }
        if (options && options.acrValues || kc.acrValues) url += '&acr_values=' + encodeURIComponent(options.acrValues || kc.acrValues);
        if (kc.pkceMethod) try {
            const codeVerifier = generateCodeVerifier(96);
            const pkceChallenge = await generatePkceChallenge(kc.pkceMethod, codeVerifier);
            callbackState.pkceCodeVerifier = codeVerifier;
            url += '&code_challenge=' + pkceChallenge;
            url += '&code_challenge_method=' + kc.pkceMethod;
        } catch (error) {
            throw new Error("Failed to generate PKCE challenge.", {
                cause: error
            });
        }
        callbackStorage.add(callbackState);
        return url;
    };
    kc.logout = function(options) {
        return adapter.logout(options);
    };
    kc.createLogoutUrl = function(options) {
        const logoutMethod = options?.logoutMethod ?? kc.logoutMethod;
        if (logoutMethod === 'POST') return kc.endpoints.logout();
        var url = kc.endpoints.logout() + '?client_id=' + encodeURIComponent(kc.clientId) + '&post_logout_redirect_uri=' + encodeURIComponent(adapter.redirectUri(options, false));
        if (kc.idToken) url += '&id_token_hint=' + encodeURIComponent(kc.idToken);
        return url;
    };
    kc.register = function(options) {
        return adapter.register(options);
    };
    kc.createRegisterUrl = async function(options) {
        if (!options) options = {};
        options.action = 'register';
        return await kc.createLoginUrl(options);
    };
    kc.createAccountUrl = function(options) {
        var realm = getRealmUrl();
        var url = undefined;
        if (typeof realm !== 'undefined') url = realm + '/account' + '?referrer=' + encodeURIComponent(kc.clientId) + '&referrer_uri=' + encodeURIComponent(adapter.redirectUri(options));
        return url;
    };
    kc.accountManagement = function() {
        return adapter.accountManagement();
    };
    kc.hasRealmRole = function(role) {
        var access = kc.realmAccess;
        return !!access && access.roles.indexOf(role) >= 0;
    };
    kc.hasResourceRole = function(role, resource) {
        if (!kc.resourceAccess) return false;
        var access = kc.resourceAccess[resource || kc.clientId];
        return !!access && access.roles.indexOf(role) >= 0;
    };
    kc.loadUserProfile = function() {
        var url = getRealmUrl() + '/account';
        var req = new XMLHttpRequest();
        req.open('GET', url, true);
        req.setRequestHeader('Accept', 'application/json');
        req.setRequestHeader('Authorization', 'bearer ' + kc.token);
        var promise = createPromise();
        req.onreadystatechange = function() {
            if (req.readyState == 4) {
                if (req.status == 200) {
                    kc.profile = JSON.parse(req.responseText);
                    promise.setSuccess(kc.profile);
                } else promise.setError();
            }
        };
        req.send();
        return promise.promise;
    };
    kc.loadUserInfo = function() {
        var url = kc.endpoints.userinfo();
        var req = new XMLHttpRequest();
        req.open('GET', url, true);
        req.setRequestHeader('Accept', 'application/json');
        req.setRequestHeader('Authorization', 'bearer ' + kc.token);
        var promise = createPromise();
        req.onreadystatechange = function() {
            if (req.readyState == 4) {
                if (req.status == 200) {
                    kc.userInfo = JSON.parse(req.responseText);
                    promise.setSuccess(kc.userInfo);
                } else promise.setError();
            }
        };
        req.send();
        return promise.promise;
    };
    kc.isTokenExpired = function(minValidity) {
        if (!kc.tokenParsed || !kc.refreshToken && kc.flow != 'implicit') throw 'Not authenticated';
        if (kc.timeSkew == null) {
            logInfo('[KEYCLOAK] Unable to determine if token is expired as timeskew is not set');
            return true;
        }
        var expiresIn = kc.tokenParsed['exp'] - Math.ceil(new Date().getTime() / 1000) + kc.timeSkew;
        if (minValidity) {
            if (isNaN(minValidity)) throw 'Invalid minValidity';
            expiresIn -= minValidity;
        }
        return expiresIn < 0;
    };
    kc.updateToken = function(minValidity) {
        var promise = createPromise();
        if (!kc.refreshToken) {
            promise.setError();
            return promise.promise;
        }
        minValidity = minValidity || 5;
        var exec = function() {
            var refreshToken = false;
            if (minValidity == -1) {
                refreshToken = true;
                logInfo('[KEYCLOAK] Refreshing token: forced refresh');
            } else if (!kc.tokenParsed || kc.isTokenExpired(minValidity)) {
                refreshToken = true;
                logInfo('[KEYCLOAK] Refreshing token: token expired');
            }
            if (!refreshToken) promise.setSuccess(false);
            else {
                var params = "grant_type=refresh_token&refresh_token=" + kc.refreshToken;
                var url = kc.endpoints.token();
                refreshQueue.push(promise);
                if (refreshQueue.length == 1) {
                    var req = new XMLHttpRequest();
                    req.open('POST', url, true);
                    req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                    req.withCredentials = true;
                    params += '&client_id=' + encodeURIComponent(kc.clientId);
                    var timeLocal = new Date().getTime();
                    req.onreadystatechange = function() {
                        if (req.readyState == 4) {
                            if (req.status == 200) {
                                logInfo('[KEYCLOAK] Token refreshed');
                                timeLocal = (timeLocal + new Date().getTime()) / 2;
                                var tokenResponse = JSON.parse(req.responseText);
                                setToken(tokenResponse['access_token'], tokenResponse['refresh_token'], tokenResponse['id_token'], timeLocal);
                                kc.onAuthRefreshSuccess && kc.onAuthRefreshSuccess();
                                for(var p = refreshQueue.pop(); p != null; p = refreshQueue.pop())p.setSuccess(true);
                            } else {
                                logWarn('[KEYCLOAK] Failed to refresh token');
                                if (req.status == 400) kc.clearToken();
                                kc.onAuthRefreshError && kc.onAuthRefreshError();
                                for(var p = refreshQueue.pop(); p != null; p = refreshQueue.pop())p.setError("Failed to refresh token: An unexpected HTTP error occurred while attempting to refresh the token.");
                            }
                        }
                    };
                    req.send(params);
                }
            }
        };
        if (loginIframe.enable) {
            var iframePromise = checkLoginIframe();
            iframePromise.then(function() {
                exec();
            }).catch(function(error) {
                promise.setError(error);
            });
        } else exec();
        return promise.promise;
    };
    kc.clearToken = function() {
        if (kc.token) {
            setToken(null, null, null);
            kc.onAuthLogout && kc.onAuthLogout();
            if (kc.loginRequired) kc.login();
        }
    };
    function getRealmUrl() {
        if (typeof kc.authServerUrl !== 'undefined') {
            if (kc.authServerUrl.charAt(kc.authServerUrl.length - 1) == '/') return kc.authServerUrl + 'realms/' + encodeURIComponent(kc.realm);
            else return kc.authServerUrl + '/realms/' + encodeURIComponent(kc.realm);
        } else return undefined;
    }
    function getOrigin() {
        if (!window.location.origin) return window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
        else return window.location.origin;
    }
    function processCallback(oauth, promise) {
        var code = oauth.code;
        var error = oauth.error;
        var prompt = oauth.prompt;
        var timeLocal = new Date().getTime();
        if (oauth['kc_action_status']) kc.onActionUpdate && kc.onActionUpdate(oauth['kc_action_status'], oauth['kc_action']);
        if (error) {
            if (prompt != 'none') {
                if (oauth.error_description && oauth.error_description === "authentication_expired") kc.login(oauth.loginOptions);
                else {
                    var errorData = {
                        error: error,
                        error_description: oauth.error_description
                    };
                    kc.onAuthError && kc.onAuthError(errorData);
                    promise && promise.setError(errorData);
                }
            } else promise && promise.setSuccess();
            return;
        } else if (kc.flow != 'standard' && (oauth.access_token || oauth.id_token)) authSuccess(oauth.access_token, null, oauth.id_token, true);
        if (kc.flow != 'implicit' && code) {
            var params = 'code=' + code + '&grant_type=authorization_code';
            var url = kc.endpoints.token();
            var req = new XMLHttpRequest();
            req.open('POST', url, true);
            req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            params += '&client_id=' + encodeURIComponent(kc.clientId);
            params += '&redirect_uri=' + oauth.redirectUri;
            if (oauth.pkceCodeVerifier) params += '&code_verifier=' + oauth.pkceCodeVerifier;
            req.withCredentials = true;
            req.onreadystatechange = function() {
                if (req.readyState == 4) {
                    if (req.status == 200) {
                        var tokenResponse = JSON.parse(req.responseText);
                        authSuccess(tokenResponse['access_token'], tokenResponse['refresh_token'], tokenResponse['id_token'], kc.flow === 'standard');
                        scheduleCheckIframe();
                    } else {
                        kc.onAuthError && kc.onAuthError();
                        promise && promise.setError();
                    }
                }
            };
            req.send(params);
        }
        function authSuccess(accessToken, refreshToken, idToken, fulfillPromise) {
            timeLocal = (timeLocal + new Date().getTime()) / 2;
            setToken(accessToken, refreshToken, idToken, timeLocal);
            if (useNonce && kc.idTokenParsed && kc.idTokenParsed.nonce != oauth.storedNonce) {
                logInfo('[KEYCLOAK] Invalid nonce, clearing token');
                kc.clearToken();
                promise && promise.setError();
            } else if (fulfillPromise) {
                kc.onAuthSuccess && kc.onAuthSuccess();
                promise && promise.setSuccess();
            }
        }
    }
    function loadConfig() {
        var promise = createPromise();
        var configUrl;
        if (typeof config === 'string') configUrl = config;
        function setupOidcEndoints(oidcConfiguration) {
            if (!oidcConfiguration) kc.endpoints = {
                authorize: function() {
                    return getRealmUrl() + '/protocol/openid-connect/auth';
                },
                token: function() {
                    return getRealmUrl() + '/protocol/openid-connect/token';
                },
                logout: function() {
                    return getRealmUrl() + '/protocol/openid-connect/logout';
                },
                checkSessionIframe: function() {
                    return getRealmUrl() + '/protocol/openid-connect/login-status-iframe.html';
                },
                thirdPartyCookiesIframe: function() {
                    return getRealmUrl() + '/protocol/openid-connect/3p-cookies/step1.html';
                },
                register: function() {
                    return getRealmUrl() + '/protocol/openid-connect/registrations';
                },
                userinfo: function() {
                    return getRealmUrl() + '/protocol/openid-connect/userinfo';
                }
            };
            else kc.endpoints = {
                authorize: function() {
                    return oidcConfiguration.authorization_endpoint;
                },
                token: function() {
                    return oidcConfiguration.token_endpoint;
                },
                logout: function() {
                    if (!oidcConfiguration.end_session_endpoint) throw "Not supported by the OIDC server";
                    return oidcConfiguration.end_session_endpoint;
                },
                checkSessionIframe: function() {
                    if (!oidcConfiguration.check_session_iframe) throw "Not supported by the OIDC server";
                    return oidcConfiguration.check_session_iframe;
                },
                register: function() {
                    throw 'Redirection to "Register user" page not supported in standard OIDC mode';
                },
                userinfo: function() {
                    if (!oidcConfiguration.userinfo_endpoint) throw "Not supported by the OIDC server";
                    return oidcConfiguration.userinfo_endpoint;
                }
            };
        }
        if (configUrl) {
            var req = new XMLHttpRequest();
            req.open('GET', configUrl, true);
            req.setRequestHeader('Accept', 'application/json');
            req.onreadystatechange = function() {
                if (req.readyState == 4) {
                    if (req.status == 200 || fileLoaded(req)) {
                        var config = JSON.parse(req.responseText);
                        kc.authServerUrl = config['auth-server-url'];
                        kc.realm = config['realm'];
                        kc.clientId = config['resource'];
                        setupOidcEndoints(null);
                        promise.setSuccess();
                    } else promise.setError();
                }
            };
            req.send();
        } else {
            kc.clientId = config.clientId;
            var oidcProvider = config['oidcProvider'];
            if (!oidcProvider) {
                kc.authServerUrl = config.url;
                kc.realm = config.realm;
                setupOidcEndoints(null);
                promise.setSuccess();
            } else if (typeof oidcProvider === 'string') {
                var oidcProviderConfigUrl;
                if (oidcProvider.charAt(oidcProvider.length - 1) == '/') oidcProviderConfigUrl = oidcProvider + '.well-known/openid-configuration';
                else oidcProviderConfigUrl = oidcProvider + '/.well-known/openid-configuration';
                var req = new XMLHttpRequest();
                req.open('GET', oidcProviderConfigUrl, true);
                req.setRequestHeader('Accept', 'application/json');
                req.onreadystatechange = function() {
                    if (req.readyState == 4) {
                        if (req.status == 200 || fileLoaded(req)) {
                            var oidcProviderConfig = JSON.parse(req.responseText);
                            setupOidcEndoints(oidcProviderConfig);
                            promise.setSuccess();
                        } else promise.setError();
                    }
                };
                req.send();
            } else {
                setupOidcEndoints(oidcProvider);
                promise.setSuccess();
            }
        }
        return promise.promise;
    }
    function fileLoaded(xhr) {
        return xhr.status == 0 && xhr.responseText && xhr.responseURL.startsWith('file:');
    }
    function setToken(token, refreshToken, idToken, timeLocal) {
        if (kc.tokenTimeoutHandle) {
            clearTimeout(kc.tokenTimeoutHandle);
            kc.tokenTimeoutHandle = null;
        }
        if (refreshToken) {
            kc.refreshToken = refreshToken;
            kc.refreshTokenParsed = $0a57ee69e1387252$var$decodeToken(refreshToken);
        } else {
            delete kc.refreshToken;
            delete kc.refreshTokenParsed;
        }
        if (idToken) {
            kc.idToken = idToken;
            kc.idTokenParsed = $0a57ee69e1387252$var$decodeToken(idToken);
        } else {
            delete kc.idToken;
            delete kc.idTokenParsed;
        }
        if (token) {
            kc.token = token;
            kc.tokenParsed = $0a57ee69e1387252$var$decodeToken(token);
            kc.sessionId = kc.tokenParsed.sid;
            kc.authenticated = true;
            kc.subject = kc.tokenParsed.sub;
            kc.realmAccess = kc.tokenParsed.realm_access;
            kc.resourceAccess = kc.tokenParsed.resource_access;
            if (timeLocal) kc.timeSkew = Math.floor(timeLocal / 1000) - kc.tokenParsed.iat;
            if (kc.timeSkew != null) {
                logInfo('[KEYCLOAK] Estimated time difference between browser and server is ' + kc.timeSkew + ' seconds');
                if (kc.onTokenExpired) {
                    var expiresIn = (kc.tokenParsed['exp'] - new Date().getTime() / 1000 + kc.timeSkew) * 1000;
                    logInfo('[KEYCLOAK] Token expires in ' + Math.round(expiresIn / 1000) + ' s');
                    if (expiresIn <= 0) kc.onTokenExpired();
                    else kc.tokenTimeoutHandle = setTimeout(kc.onTokenExpired, expiresIn);
                }
            }
        } else {
            delete kc.token;
            delete kc.tokenParsed;
            delete kc.subject;
            delete kc.realmAccess;
            delete kc.resourceAccess;
            kc.authenticated = false;
        }
    }
    function createUUID() {
        if (typeof crypto === "undefined" || typeof crypto.randomUUID === "undefined") throw new Error("Web Crypto API is not available.");
        return crypto.randomUUID();
    }
    function parseCallback(url) {
        var oauth = parseCallbackUrl(url);
        if (!oauth) return;
        var oauthState = callbackStorage.get(oauth.state);
        if (oauthState) {
            oauth.valid = true;
            oauth.redirectUri = oauthState.redirectUri;
            oauth.storedNonce = oauthState.nonce;
            oauth.prompt = oauthState.prompt;
            oauth.pkceCodeVerifier = oauthState.pkceCodeVerifier;
            oauth.loginOptions = oauthState.loginOptions;
        }
        return oauth;
    }
    function parseCallbackUrl(url) {
        var supportedParams;
        switch(kc.flow){
            case 'standard':
                supportedParams = [
                    'code',
                    'state',
                    'session_state',
                    'kc_action_status',
                    'kc_action',
                    'iss'
                ];
                break;
            case 'implicit':
                supportedParams = [
                    'access_token',
                    'token_type',
                    'id_token',
                    'state',
                    'session_state',
                    'expires_in',
                    'kc_action_status',
                    'kc_action',
                    'iss'
                ];
                break;
            case 'hybrid':
                supportedParams = [
                    'access_token',
                    'token_type',
                    'id_token',
                    'code',
                    'state',
                    'session_state',
                    'expires_in',
                    'kc_action_status',
                    'kc_action',
                    'iss'
                ];
                break;
        }
        supportedParams.push('error');
        supportedParams.push('error_description');
        supportedParams.push('error_uri');
        var queryIndex = url.indexOf('?');
        var fragmentIndex = url.indexOf('#');
        var newUrl;
        var parsed;
        if (kc.responseMode === 'query' && queryIndex !== -1) {
            newUrl = url.substring(0, queryIndex);
            parsed = parseCallbackParams(url.substring(queryIndex + 1, fragmentIndex !== -1 ? fragmentIndex : url.length), supportedParams);
            if (parsed.paramsString !== '') newUrl += '?' + parsed.paramsString;
            if (fragmentIndex !== -1) newUrl += url.substring(fragmentIndex);
        } else if (kc.responseMode === 'fragment' && fragmentIndex !== -1) {
            newUrl = url.substring(0, fragmentIndex);
            parsed = parseCallbackParams(url.substring(fragmentIndex + 1), supportedParams);
            if (parsed.paramsString !== '') newUrl += '#' + parsed.paramsString;
        }
        if (parsed && parsed.oauthParams) {
            if (kc.flow === 'standard' || kc.flow === 'hybrid') {
                if ((parsed.oauthParams.code || parsed.oauthParams.error) && parsed.oauthParams.state) {
                    parsed.oauthParams.newUrl = newUrl;
                    return parsed.oauthParams;
                }
            } else if (kc.flow === 'implicit') {
                if ((parsed.oauthParams.access_token || parsed.oauthParams.error) && parsed.oauthParams.state) {
                    parsed.oauthParams.newUrl = newUrl;
                    return parsed.oauthParams;
                }
            }
        }
    }
    function parseCallbackParams(paramsString, supportedParams) {
        var p = paramsString.split('&');
        var result = {
            paramsString: '',
            oauthParams: {}
        };
        for(var i = 0; i < p.length; i++){
            var split = p[i].indexOf("=");
            var key = p[i].slice(0, split);
            if (supportedParams.indexOf(key) !== -1) result.oauthParams[key] = p[i].slice(split + 1);
            else {
                if (result.paramsString !== '') result.paramsString += '&';
                result.paramsString += p[i];
            }
        }
        return result;
    }
    function createPromise() {
        // Need to create a native Promise which also preserves the
        // interface of the custom promise type previously used by the API
        var p = {
            setSuccess: function(result) {
                p.resolve(result);
            },
            setError: function(result) {
                p.reject(result);
            }
        };
        p.promise = new Promise(function(resolve, reject) {
            p.resolve = resolve;
            p.reject = reject;
        });
        return p;
    }
    // Function to extend existing native Promise with timeout
    function applyTimeoutToPromise(promise, timeout, errorMessage) {
        var timeoutHandle = null;
        var timeoutPromise = new Promise(function(resolve, reject) {
            timeoutHandle = setTimeout(function() {
                reject({
                    "error": errorMessage || "Promise is not settled within timeout of " + timeout + "ms"
                });
            }, timeout);
        });
        return Promise.race([
            promise,
            timeoutPromise
        ]).finally(function() {
            clearTimeout(timeoutHandle);
        });
    }
    function setupCheckLoginIframe() {
        var promise = createPromise();
        if (!loginIframe.enable) {
            promise.setSuccess();
            return promise.promise;
        }
        if (loginIframe.iframe) {
            promise.setSuccess();
            return promise.promise;
        }
        var iframe = document.createElement('iframe');
        loginIframe.iframe = iframe;
        iframe.onload = function() {
            var authUrl = kc.endpoints.authorize();
            if (authUrl.charAt(0) === '/') loginIframe.iframeOrigin = getOrigin();
            else loginIframe.iframeOrigin = authUrl.substring(0, authUrl.indexOf('/', 8));
            promise.setSuccess();
        };
        var src = kc.endpoints.checkSessionIframe();
        iframe.setAttribute('src', src);
        iframe.setAttribute('sandbox', 'allow-storage-access-by-user-activation allow-scripts allow-same-origin');
        iframe.setAttribute('title', 'keycloak-session-iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        var messageCallback = function(event) {
            if (event.origin !== loginIframe.iframeOrigin || loginIframe.iframe.contentWindow !== event.source) return;
            if (!(event.data == 'unchanged' || event.data == 'changed' || event.data == 'error')) return;
            if (event.data != 'unchanged') kc.clearToken();
            var callbacks = loginIframe.callbackList.splice(0, loginIframe.callbackList.length);
            for(var i = callbacks.length - 1; i >= 0; --i){
                var promise = callbacks[i];
                if (event.data == 'error') promise.setError();
                else promise.setSuccess(event.data == 'unchanged');
            }
        };
        window.addEventListener('message', messageCallback, false);
        return promise.promise;
    }
    function scheduleCheckIframe() {
        if (loginIframe.enable) {
            if (kc.token) setTimeout(function() {
                checkLoginIframe().then(function(unchanged) {
                    if (unchanged) scheduleCheckIframe();
                });
            }, loginIframe.interval * 1000);
        }
    }
    function checkLoginIframe() {
        var promise = createPromise();
        if (loginIframe.iframe && loginIframe.iframeOrigin) {
            var msg = kc.clientId + ' ' + (kc.sessionId ? kc.sessionId : '');
            loginIframe.callbackList.push(promise);
            var origin = loginIframe.iframeOrigin;
            if (loginIframe.callbackList.length == 1) loginIframe.iframe.contentWindow.postMessage(msg, origin);
        } else promise.setSuccess();
        return promise.promise;
    }
    function check3pCookiesSupported() {
        var promise = createPromise();
        if ((loginIframe.enable || kc.silentCheckSsoRedirectUri) && typeof kc.endpoints.thirdPartyCookiesIframe === 'function') {
            var iframe = document.createElement('iframe');
            iframe.setAttribute('src', kc.endpoints.thirdPartyCookiesIframe());
            iframe.setAttribute('sandbox', 'allow-storage-access-by-user-activation allow-scripts allow-same-origin');
            iframe.setAttribute('title', 'keycloak-3p-check-iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
            var messageCallback = function(event) {
                if (iframe.contentWindow !== event.source) return;
                if (event.data !== "supported" && event.data !== "unsupported") return;
                else if (event.data === "unsupported") {
                    logWarn("[KEYCLOAK] Your browser is blocking access to 3rd-party cookies, this means:\n\n - It is not possible to retrieve tokens without redirecting to the Keycloak server (a.k.a. no support for silent authentication).\n - It is not possible to automatically detect changes to the session status (such as the user logging out in another tab).\n\nFor more information see: https://www.keycloak.org/securing-apps/javascript-adapter#_modern_browsers");
                    loginIframe.enable = false;
                    if (kc.silentCheckSsoFallback) kc.silentCheckSsoRedirectUri = false;
                }
                document.body.removeChild(iframe);
                window.removeEventListener("message", messageCallback);
                promise.setSuccess();
            };
            window.addEventListener('message', messageCallback, false);
        } else promise.setSuccess();
        return applyTimeoutToPromise(promise.promise, kc.messageReceiveTimeout, "Timeout when waiting for 3rd party check iframe message.");
    }
    function loadAdapter(type) {
        if (!type || type == 'default') return {
            login: async function(options) {
                window.location.assign(await kc.createLoginUrl(options));
                return createPromise().promise;
            },
            logout: async function(options) {
                const logoutMethod = options?.logoutMethod ?? kc.logoutMethod;
                if (logoutMethod === "GET") {
                    window.location.replace(kc.createLogoutUrl(options));
                    return;
                }
                // Create form to send POST request.
                const form = document.createElement("form");
                form.setAttribute("method", "POST");
                form.setAttribute("action", kc.createLogoutUrl(options));
                form.style.display = "none";
                // Add data to form as hidden input fields.
                const data = {
                    id_token_hint: kc.idToken,
                    client_id: kc.clientId,
                    post_logout_redirect_uri: adapter.redirectUri(options, false)
                };
                for (const [name, value] of Object.entries(data)){
                    const input = document.createElement("input");
                    input.setAttribute("type", "hidden");
                    input.setAttribute("name", name);
                    input.setAttribute("value", value);
                    form.appendChild(input);
                }
                // Append form to page and submit it to perform logout and redirect.
                document.body.appendChild(form);
                form.submit();
            },
            register: async function(options) {
                window.location.assign(await kc.createRegisterUrl(options));
                return createPromise().promise;
            },
            accountManagement: function() {
                var accountUrl = kc.createAccountUrl();
                if (typeof accountUrl !== 'undefined') window.location.href = accountUrl;
                else throw "Not supported by the OIDC server";
                return createPromise().promise;
            },
            redirectUri: function(options, encodeHash) {
                if (arguments.length == 1) encodeHash = true;
                if (options && options.redirectUri) return options.redirectUri;
                else if (kc.redirectUri) return kc.redirectUri;
                else return location.href;
            }
        };
        if (type == 'cordova') {
            loginIframe.enable = false;
            var cordovaOpenWindowWrapper = function(loginUrl, target, options) {
                if (window.cordova && window.cordova.InAppBrowser) // Use inappbrowser for IOS and Android if available
                return window.cordova.InAppBrowser.open(loginUrl, target, options);
                else return window.open(loginUrl, target, options);
            };
            var shallowCloneCordovaOptions = function(userOptions) {
                if (userOptions && userOptions.cordovaOptions) return Object.keys(userOptions.cordovaOptions).reduce(function(options, optionName) {
                    options[optionName] = userOptions.cordovaOptions[optionName];
                    return options;
                }, {});
                else return {};
            };
            var formatCordovaOptions = function(cordovaOptions) {
                return Object.keys(cordovaOptions).reduce(function(options, optionName) {
                    options.push(optionName + "=" + cordovaOptions[optionName]);
                    return options;
                }, []).join(",");
            };
            var createCordovaOptions = function(userOptions) {
                var cordovaOptions = shallowCloneCordovaOptions(userOptions);
                cordovaOptions.location = 'no';
                if (userOptions && userOptions.prompt == 'none') cordovaOptions.hidden = 'yes';
                return formatCordovaOptions(cordovaOptions);
            };
            var getCordovaRedirectUri = function() {
                return kc.redirectUri || 'http://localhost';
            };
            return {
                login: async function(options) {
                    var promise = createPromise();
                    var cordovaOptions = createCordovaOptions(options);
                    var loginUrl = await kc.createLoginUrl(options);
                    var ref = cordovaOpenWindowWrapper(loginUrl, '_blank', cordovaOptions);
                    var completed = false;
                    var closed = false;
                    var closeBrowser = function() {
                        closed = true;
                        ref.close();
                    };
                    ref.addEventListener('loadstart', function(event) {
                        if (event.url.indexOf(getCordovaRedirectUri()) == 0) {
                            var callback = parseCallback(event.url);
                            processCallback(callback, promise);
                            closeBrowser();
                            completed = true;
                        }
                    });
                    ref.addEventListener('loaderror', function(event) {
                        if (!completed) {
                            if (event.url.indexOf(getCordovaRedirectUri()) == 0) {
                                var callback = parseCallback(event.url);
                                processCallback(callback, promise);
                                closeBrowser();
                                completed = true;
                            } else {
                                promise.setError();
                                closeBrowser();
                            }
                        }
                    });
                    ref.addEventListener('exit', function(event) {
                        if (!closed) promise.setError({
                            reason: "closed_by_user"
                        });
                    });
                    return promise.promise;
                },
                logout: function(options) {
                    var promise = createPromise();
                    var logoutUrl = kc.createLogoutUrl(options);
                    var ref = cordovaOpenWindowWrapper(logoutUrl, '_blank', 'location=no,hidden=yes,clearcache=yes');
                    var error;
                    ref.addEventListener('loadstart', function(event) {
                        if (event.url.indexOf(getCordovaRedirectUri()) == 0) ref.close();
                    });
                    ref.addEventListener('loaderror', function(event) {
                        if (event.url.indexOf(getCordovaRedirectUri()) == 0) ref.close();
                        else {
                            error = true;
                            ref.close();
                        }
                    });
                    ref.addEventListener('exit', function(event) {
                        if (error) promise.setError();
                        else {
                            kc.clearToken();
                            promise.setSuccess();
                        }
                    });
                    return promise.promise;
                },
                register: async function(options) {
                    var promise = createPromise();
                    var registerUrl = await kc.createRegisterUrl();
                    var cordovaOptions = createCordovaOptions(options);
                    var ref = cordovaOpenWindowWrapper(registerUrl, '_blank', cordovaOptions);
                    ref.addEventListener('loadstart', function(event) {
                        if (event.url.indexOf(getCordovaRedirectUri()) == 0) {
                            ref.close();
                            var oauth = parseCallback(event.url);
                            processCallback(oauth, promise);
                        }
                    });
                    return promise.promise;
                },
                accountManagement: function() {
                    var accountUrl = kc.createAccountUrl();
                    if (typeof accountUrl !== 'undefined') {
                        var ref = cordovaOpenWindowWrapper(accountUrl, '_blank', 'location=no');
                        ref.addEventListener('loadstart', function(event) {
                            if (event.url.indexOf(getCordovaRedirectUri()) == 0) ref.close();
                        });
                    } else throw "Not supported by the OIDC server";
                },
                redirectUri: function(options) {
                    return getCordovaRedirectUri();
                }
            };
        }
        if (type == 'cordova-native') {
            loginIframe.enable = false;
            return {
                login: async function(options) {
                    var promise = createPromise();
                    var loginUrl = await kc.createLoginUrl(options);
                    universalLinks.subscribe('keycloak', function(event) {
                        universalLinks.unsubscribe('keycloak');
                        window.cordova.plugins.browsertab.close();
                        var oauth = parseCallback(event.url);
                        processCallback(oauth, promise);
                    });
                    window.cordova.plugins.browsertab.openUrl(loginUrl);
                    return promise.promise;
                },
                logout: function(options) {
                    var promise = createPromise();
                    var logoutUrl = kc.createLogoutUrl(options);
                    universalLinks.subscribe('keycloak', function(event) {
                        universalLinks.unsubscribe('keycloak');
                        window.cordova.plugins.browsertab.close();
                        kc.clearToken();
                        promise.setSuccess();
                    });
                    window.cordova.plugins.browsertab.openUrl(logoutUrl);
                    return promise.promise;
                },
                register: async function(options) {
                    var promise = createPromise();
                    var registerUrl = await kc.createRegisterUrl(options);
                    universalLinks.subscribe('keycloak', function(event) {
                        universalLinks.unsubscribe('keycloak');
                        window.cordova.plugins.browsertab.close();
                        var oauth = parseCallback(event.url);
                        processCallback(oauth, promise);
                    });
                    window.cordova.plugins.browsertab.openUrl(registerUrl);
                    return promise.promise;
                },
                accountManagement: function() {
                    var accountUrl = kc.createAccountUrl();
                    if (typeof accountUrl !== 'undefined') window.cordova.plugins.browsertab.openUrl(accountUrl);
                    else throw "Not supported by the OIDC server";
                },
                redirectUri: function(options) {
                    if (options && options.redirectUri) return options.redirectUri;
                    else if (kc.redirectUri) return kc.redirectUri;
                    else return "http://localhost";
                }
            };
        }
        throw 'invalid adapter type: ' + type;
    }
    const STORAGE_KEY_PREFIX = 'kc-callback-';
    var LocalStorage = function() {
        if (!(this instanceof LocalStorage)) return new LocalStorage();
        localStorage.setItem('kc-test', 'test');
        localStorage.removeItem('kc-test');
        var cs = this;
        /**
         * Clears all values from local storage that are no longer valid.
         */ function clearInvalidValues() {
            const currentTime = Date.now();
            for (const [key, value] of getStoredEntries()){
                // Attempt to parse the expiry time from the value.
                const expiry = parseExpiry(value);
                // Discard the value if it is malformed or expired.
                if (expiry === null || expiry < currentTime) localStorage.removeItem(key);
            }
        }
        /**
         * Clears all known values from local storage.
         */ function clearAllValues() {
            for (const [key] of getStoredEntries())localStorage.removeItem(key);
        }
        /**
         * Gets all entries stored in local storage that are known to be managed by this class.
         * @returns {Array<[string, unknown]>} An array of key-value pairs.
         */ function getStoredEntries() {
            return Object.entries(localStorage).filter(([key])=>key.startsWith(STORAGE_KEY_PREFIX));
        }
        /**
         * Parses the expiry time from a value stored in local storage.
         * @param {unknown} value
         * @returns {number | null} The expiry time in milliseconds, or `null` if the value is malformed.
         */ function parseExpiry(value) {
            let parsedValue;
            // Attempt to parse the value as JSON.
            try {
                parsedValue = JSON.parse(value);
            } catch (error) {
                return null;
            }
            // Attempt to extract the 'expires' property.
            if ($0a57ee69e1387252$var$isObject(parsedValue) && 'expires' in parsedValue && typeof parsedValue.expires === 'number') return parsedValue.expires;
            return null;
        }
        cs.get = function(state) {
            if (!state) return;
            var key = STORAGE_KEY_PREFIX + state;
            var value = localStorage.getItem(key);
            if (value) {
                localStorage.removeItem(key);
                value = JSON.parse(value);
            }
            clearInvalidValues();
            return value;
        };
        cs.add = function(state) {
            clearInvalidValues();
            const key = STORAGE_KEY_PREFIX + state.state;
            const value = JSON.stringify({
                ...state,
                // Set the expiry time to 1 hour from now.
                expires: Date.now() + 3600000
            });
            try {
                localStorage.setItem(key, value);
            } catch (error) {
                // If the storage is full, clear all known values and try again.
                clearAllValues();
                localStorage.setItem(key, value);
            }
        };
    };
    var CookieStorage = function() {
        if (!(this instanceof CookieStorage)) return new CookieStorage();
        var cs = this;
        cs.get = function(state) {
            if (!state) return;
            var value = getCookie(STORAGE_KEY_PREFIX + state);
            setCookie(STORAGE_KEY_PREFIX + state, '', cookieExpiration(-100));
            if (value) return JSON.parse(value);
        };
        cs.add = function(state) {
            setCookie(STORAGE_KEY_PREFIX + state.state, JSON.stringify(state), cookieExpiration(60));
        };
        cs.removeItem = function(key) {
            setCookie(key, '', cookieExpiration(-100));
        };
        var cookieExpiration = function(minutes) {
            var exp = new Date();
            exp.setTime(exp.getTime() + minutes * 60000);
            return exp;
        };
        var getCookie = function(key) {
            var name = key + '=';
            var ca = document.cookie.split(';');
            for(var i = 0; i < ca.length; i++){
                var c = ca[i];
                while(c.charAt(0) == ' ')c = c.substring(1);
                if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
            }
            return '';
        };
        var setCookie = function(key, value, expirationDate) {
            var cookie = key + '=' + value + '; ' + 'expires=' + expirationDate.toUTCString() + '; ';
            document.cookie = cookie;
        };
    };
    function createCallbackStorage() {
        try {
            return new LocalStorage();
        } catch (err) {}
        return new CookieStorage();
    }
    function createLogger(fn) {
        return function() {
            if (kc.enableLogging) fn.apply(console, Array.prototype.slice.call(arguments));
        };
    }
}
var $0a57ee69e1387252$export$2e2bcd8739ae039 = $0a57ee69e1387252$var$Keycloak;
/**
 * @param {ArrayBuffer} bytes
 * @see https://developer.mozilla.org/en-US/docs/Glossary/Base64#the_unicode_problem
 */ function $0a57ee69e1387252$var$bytesToBase64(bytes) {
    const binString = String.fromCodePoint(...bytes);
    return btoa(binString);
}
/**
 * @param {string} message
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#basic_example
 */ async function $0a57ee69e1387252$var$sha256Digest(message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    if (typeof crypto === "undefined" || typeof crypto.subtle === "undefined") throw new Error("Web Crypto API is not available.");
    return await crypto.subtle.digest("SHA-256", data);
}
/**
 * @param {string} token
 */ function $0a57ee69e1387252$var$decodeToken(token) {
    const [header, payload] = token.split(".");
    if (typeof payload !== "string") throw new Error("Unable to decode token, payload not found.");
    let decoded;
    try {
        decoded = $0a57ee69e1387252$var$base64UrlDecode(payload);
    } catch (error) {
        throw new Error("Unable to decode token, payload is not a valid Base64URL value.", {
            cause: error
        });
    }
    try {
        return JSON.parse(decoded);
    } catch (error) {
        throw new Error("Unable to decode token, payload is not a valid JSON value.", {
            cause: error
        });
    }
}
/**
 * @param {string} input
 */ function $0a57ee69e1387252$var$base64UrlDecode(input) {
    let output = input.replaceAll("-", "+").replaceAll("_", "/");
    switch(output.length % 4){
        case 0:
            break;
        case 2:
            output += "==";
            break;
        case 3:
            output += "=";
            break;
        default:
            throw new Error("Input is not of the correct length.");
    }
    try {
        return $0a57ee69e1387252$var$b64DecodeUnicode(output);
    } catch (error) {
        return atob(output);
    }
}
/**
 * @param {string} input
 */ function $0a57ee69e1387252$var$b64DecodeUnicode(input) {
    return decodeURIComponent(atob(input).replace(/(.)/g, (m, p)=>{
        let code = p.charCodeAt(0).toString(16).toUpperCase();
        if (code.length < 2) code = "0" + code;
        return "%" + code;
    }));
}
/**
 * Check if the input is an object that can be operated on.
 * @param {unknown} input
 */ function $0a57ee69e1387252$var$isObject(input) {
    return typeof input === 'object' && input !== null;
}


class $646b7289fb27eacc$export$b9721ef022f71a68 extends Error {
}
$646b7289fb27eacc$export$b9721ef022f71a68.prototype.name = "InvalidTokenError";
function $646b7289fb27eacc$var$b64DecodeUnicode(str) {
    return decodeURIComponent(atob(str).replace(/(.)/g, (m, p)=>{
        let code = p.charCodeAt(0).toString(16).toUpperCase();
        if (code.length < 2) code = "0" + code;
        return "%" + code;
    }));
}
function $646b7289fb27eacc$var$base64UrlDecode(str) {
    let output = str.replace(/-/g, "+").replace(/_/g, "/");
    switch(output.length % 4){
        case 0:
            break;
        case 2:
            output += "==";
            break;
        case 3:
            output += "=";
            break;
        default:
            throw new Error("base64 string is not of the correct length");
    }
    try {
        return $646b7289fb27eacc$var$b64DecodeUnicode(output);
    } catch (err) {
        return atob(output);
    }
}
function $646b7289fb27eacc$export$fa1e2fb699b7861e(token, options) {
    if (typeof token !== "string") throw new $646b7289fb27eacc$export$b9721ef022f71a68("Invalid token specified: must be a string");
    options || (options = {});
    const pos = options.header === true ? 0 : 1;
    const part = token.split(".")[pos];
    if (typeof part !== "string") throw new $646b7289fb27eacc$export$b9721ef022f71a68(`Invalid token specified: missing part #${pos + 1}`);
    let decoded;
    try {
        decoded = $646b7289fb27eacc$var$base64UrlDecode(part);
    } catch (e) {
        throw new $646b7289fb27eacc$export$b9721ef022f71a68(`Invalid token specified: invalid base64 for part #${pos + 1} (${e.message})`);
    }
    try {
        return JSON.parse(decoded);
    } catch (e) {
        throw new $646b7289fb27eacc$export$b9721ef022f71a68(`Invalid token specified: invalid json for part #${pos + 1} (${e.message})`);
    }
}


class $d96156a0a1b95fa8$export$7da08f6375958bbe extends HTMLElement {
    sroot;
    keycloak;
    div_unauthenticated;
    div_authenticated;
    button_login;
    user_button;
    user_menu;
    constructor(){
        super();
        this.sroot = this.attachShadow({
            mode: 'open'
        });
        this.sroot.innerHTML = `
			<link rel="stylesheet" href="index.css">
			<style>
				:host {
					position: relative;
					display: inline-block;
					font-family: sans-serif;
				}
				.display-none {
					display: none;
				}
				.auth-container {
					position: relative;
				}
				.user-button {
					background: none;
					border: none;
					cursor: pointer;
					font-size: 1rem;
				}
				.user-menu {
					position: absolute;
					top: 100%;
					right: 0;
					background: white;
					border: 1px solid #ccc;
					box-shadow: 0 2px 6px rgba(0,0,0,0.2);
					display: none;
					min-width: 120px;
					z-index: 10;
				}
				.user-menu.show {
					display: block;
				}
				.user-menu button {
					width: 100%;
					background: none;
					border: none;
					padding: 8px 12px;
					text-align: left;
					cursor: pointer;
				}
				.user-menu button:hover {
					background: #eee;
				}

				/* Stile bottone login */
				.unauthenticated button {
					background-color: black;
					color: white;
					text-transform: uppercase;
					font-weight: bold;
					border: none;
					padding: 8px 16px;
					border-radius: 6px;
					cursor: pointer;
					transition: background-color 0.2s;
				}
				.unauthenticated button:hover {
					background-color: #333;
				}
			</style>
			<div class="unauthenticated display-none">
				<button>Login</button>
			</div>
			<div class="authenticated display-none auth-container">
				<button class="user-button">User \u{25BC}</button>
				<div class="user-menu">
					<button class="logout-button">Logout</button>
					<!-- Altre voci future -->
				</div>
			</div>
		`;
        this.div_unauthenticated = this.sroot.querySelector('.unauthenticated');
        this.div_authenticated = this.sroot.querySelector('.authenticated');
        this.button_login = this.sroot.querySelector('.unauthenticated button');
        this.user_button = this.sroot.querySelector('.user-button');
        this.user_menu = this.sroot.querySelector('.user-menu');
        this.keycloak = new (0, $0a57ee69e1387252$export$2e2bcd8739ae039)({
            url: "https://auth.opendatahub.testingmachine.eu/auth/",
            realm: "noi",
            clientId: "odh-data-quality-web"
        });
        this.button_login.onclick = ()=>{
            this.keycloak.login();
        };
        this.user_button.onclick = (e)=>{
            e.stopPropagation(); // 🔥 blocca la chiusura immediata
            this.user_menu.classList.toggle('show');
        };
        const logout_button = this.sroot.querySelector('.logout-button');
        logout_button.onclick = ()=>{
            this.keycloak.logout();
        };
        // Listener globale per chiudere il menu se si clicca fuori
        document.addEventListener('click', (e)=>{
            if (!this.sroot.contains(e.target)) this.user_menu.classList.remove('show');
        });
        this.refreshLoginState();
    }
    async refreshLoginState() {
        const authenticated = await this.keycloak.init({
            redirectUri: 'http://localhost:8080'
        });
        if (authenticated) {
            const token = this.keycloak.token;
            const decoded = (0, $646b7289fb27eacc$export$fa1e2fb699b7861e)(token);
            const username = decoded.preferred_username || decoded.name || 'User';
            this.user_button.textContent = `${username} \u{25BC}`;
            this.div_unauthenticated.classList.add('display-none');
            this.div_authenticated.classList.remove('display-none');
        } else {
            this.div_authenticated.classList.add('display-none');
            this.div_unauthenticated.classList.remove('display-none');
        }
    }
}
customElements.define('cs-auth-component', $d96156a0a1b95fa8$export$7da08f6375958bbe);


class $115949517378a2ec$export$5ff9e46e0b0ff25f extends HTMLElement {
    sroot;
    dashboards = null;
    changingSection;
    logo;
    constructor(){
        super();
        this.sroot = this.attachShadow({
            mode: 'open'
        });
        this.sroot.innerHTML = `
			<link rel="stylesheet" href="index.css">
			<style>
				cs-menu-element {
					width: 12rem;
				}
				.header {
					display: flex;
					align-items: center;
					width: 100%;
					gap: 1rem;
				}
				.header-center {
					flex-grow: 1;
					text-align: center;
				}
			</style>
			<div class="MainComponent">
				<div class="header">
					<img class="logo" src="NOI_OPENDATAHUB_NEW_BK_nospace-01.svg">
					<div class="header-center"></div>
				</div>
				<div class="body">
					<div class="projects"></div>
				</div>
			</div>
		`;
        this.changingSection = this.sroot.querySelector('.projects');
        this.logo = (0, $372cab4458345058$export$d885650843ca84a5)(HTMLImageElement, this.sroot.querySelector('.logo'));
        this.logo.onclick = ()=>{
            location.hash = '';
        };
        // Sposta AuthComponent a destra della header
        this.sroot.querySelector('.header').appendChild(new (0, $d96156a0a1b95fa8$export$7da08f6375958bbe)());
        const menu = new (0, $de236afea176a079$export$c0941f68287dbcd1)();
        menu.refresh();
        this.changingSection.parentElement.prepend(menu);
        // this.projectsComponent = new ProjectsElement();
        // projects.appendChild(this.projectsComponent.element);
        const onhashchange = ()=>{
            console.log('hash');
            console.log(location.hash);
            this.changingSection.textContent = '';
            let cleanedhash = location.hash;
            if (cleanedhash.startsWith('#state=')) cleanedhash = '';
            if (cleanedhash == '') {
                if (this.dashboards == null) {
                    this.dashboards = new (0, $8669cd8837fe1d69$export$2bdcae992c3953b6)();
                    this.dashboards.refresh();
                }
                this.changingSection.appendChild(this.dashboards);
                menu.selectItem('');
            }
            if (cleanedhash.indexOf('#page=dataset-categories&') == 0) {
                this.changingSection.textContent = '';
                const detail = new (0, $37b7d08b4187bf8a$export$1b80eba8896b3ede)();
                this.changingSection.appendChild(detail);
                const params = new URLSearchParams(cleanedhash.substring(1));
                const session_start_ts = (0, $372cab4458345058$export$2ddf4623c78330ee)(params.get('session_start_ts'));
                const dataset_name = (0, $372cab4458345058$export$2ddf4623c78330ee)(params.get('dataset_name'));
                const failed_records = parseInt((0, $372cab4458345058$export$2ddf4623c78330ee)(params.get('failed_records')));
                const tested_records = parseInt((0, $372cab4458345058$export$2ddf4623c78330ee)(params.get('tested_records')));
                detail.refresh(session_start_ts, dataset_name, failed_records, tested_records);
                menu.selectItem(dataset_name);
            }
            if (cleanedhash.startsWith('#page=summary&')) {
                this.changingSection.textContent = '';
                const detail = new (0, $c8d932129275398d$export$2dcbc072ead0b1fd)();
                this.changingSection.appendChild(detail);
                const params = new URLSearchParams(cleanedhash.substring(1));
                const session_start_ts = (0, $372cab4458345058$export$2ddf4623c78330ee)(params.get('session_start_ts'));
                const dataset_name = (0, $372cab4458345058$export$2ddf4623c78330ee)(params.get('dataset_name'));
                const category_name = (0, $372cab4458345058$export$2ddf4623c78330ee)(params.get('category_name'));
                const failed_records = parseInt((0, $372cab4458345058$export$2ddf4623c78330ee)(params.get('failed_records')));
                const tot_records = parseInt((0, $372cab4458345058$export$2ddf4623c78330ee)(params.get('tot_records')));
                detail.refresh(session_start_ts, dataset_name, category_name, failed_records, tot_records);
                menu.selectItem(dataset_name);
            }
        };
        window.onpopstate = (e)=>{
            onhashchange();
        };
        onhashchange();
    }
}
customElements.define('cs-main-component', $115949517378a2ec$export$5ff9e46e0b0ff25f);


const $06e375734b18a473$var$mainComponent = new (0, $115949517378a2ec$export$5ff9e46e0b0ff25f)();
// mainComponent.refresh();
document.body.appendChild($06e375734b18a473$var$mainComponent);

})();
//# sourceMappingURL=main.js.map
