// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later
import { LabelAndData } from "./LabelAndData.js";
import { API3 } from "./api/api3.js";
import { cs_cast } from "./quality.js";
export class DatasetIssueCategoryComponent extends HTMLElement {
    template;
    connected_promise;
    connected_func = s => null;
    more_div;
    connectedCallback() {
        console.log('connected');
        this.connected_func(null);
    }
    constructor() {
        super();
        this.connected_promise = new Promise(s => this.connected_func = s);
        const sroot = this.attachShadow({ mode: 'open' });
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
        this.template = cs_cast(HTMLElement, sroot.querySelector('.category'));
        this.more_div = cs_cast(HTMLElement, sroot.querySelector('.more'));
    }
    hideMoreDiv() {
        this.more_div.style.display = 'none';
    }
    async refresh(data) {
        const cat = this.template;
        this.setup_chart(cat, data);
        const cat_name = cs_cast(HTMLElement, cat.querySelector('.category_name'));
        cat_name.textContent = data.check_category;
        const failedelement = cs_cast(LabelAndData, cat.querySelector('.nr_records'));
        failedelement.setData('' + (data.tot_records - data.failed_records));
        const last_update = cs_cast(HTMLSpanElement, cat.querySelector('.lastupdate .data'));
        const date = new Date(data.session_start_ts);
        const perc = cs_cast(HTMLElement, cat.querySelector('.perc'));
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
        const view_details = cs_cast(HTMLElement, cat.querySelector('.view_details'));
        view_details.onclick = () => {
            location.hash = '#page=summary&session_start_ts=' + data.session_start_ts + '&dataset_name=' + data.dataset_name + '&category_name=' + data.check_category +
                '&failed_records=' + data.failed_records + '&tot_records=' + data.tot_records;
        };
        const cat_details = cs_cast(HTMLElement, cat.querySelector('details'));
        API3.list__catchsolve_noiodh__test_dataset_check_category_check_name_failed_recors_vw({
            session_start_ts: data.session_start_ts,
            dataset_name: data.dataset_name,
            check_category: data.check_category
        }).then((checks) => {
            console.log(checks);
            for (let i2 = 0; i2 < checks.length; i2++) {
                const div = document.createElement('div');
                div.textContent = checks[i2].check_name; // + ' ' + checks[i2].failed_records +  ' / ' + checks[i2].tot_records 
                cat_details.appendChild(div);
            }
        });
    }
    async setup_chart(cat, arg1) {
        await this.connected_promise;
        const chart = cs_cast(HTMLCanvasElement, cat.querySelector('.chart'));
        // const context = chart.getContext('2d');
        new Chart(chart, {
            type: 'doughnut',
            data: {
                labels: ['ok', 'fail'],
                datasets: [
                    {
                        label: 'Dataset 1',
                        data: [arg1.tot_records - arg1.failed_records, arg1.failed_records,],
                        backgroundColor: ['#0a0', '#222',]
                    }
                ]
            },
            options: {
                cutout: '80%',
                responsive: true,
                plugins: {
                    legend: {
                        display: false,
                        position: 'top',
                    },
                    title: {
                        display: false,
                        text: 'Chart.js Doughnut Chart'
                    }
                }
            },
        });
    }
}
customElements.define('cs-dataset-issue-category', DatasetIssueCategoryComponent);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YXNldElzc3VlQ2F0ZWdvcnlDb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90eXBlc2NyaXB0L0RhdGFzZXRJc3N1ZUNhdGVnb3J5Q29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDhEQUE4RDtBQUM5RCxFQUFFO0FBQ0YsNkNBQTZDO0FBRzdDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQTtBQUNoRCxPQUFPLEVBQUUsSUFBSSxFQUF3RSxNQUFNLGVBQWUsQ0FBQTtBQUMxRyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sY0FBYyxDQUFBO0FBR3RDLE1BQU0sT0FBTyw2QkFBOEIsU0FBUSxXQUFXO0lBRzdELFFBQVEsQ0FBQTtJQUVSLGlCQUFpQixDQUFBO0lBQ2pCLGNBQWMsR0FBc0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUE7SUFFN0MsUUFBUSxDQUFBO0lBRVIsaUJBQWlCO1FBRWhCLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDeEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUMxQixDQUFDO0lBRUQ7UUFDQyxLQUFLLEVBQUUsQ0FBQTtRQUNQLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDbEUsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFBO1FBQ2pELEtBQUssQ0FBQyxTQUFTLEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQXlHYixDQUFDO1FBRU4sY0FB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TUFBTSxFQUFHO3FCQUM5QjtpQkFDRjthQUNGO1lBQ0QsT0FBTyxFQUFFO2dCQUNWLE1BQU0sRUFBRSxLQUFLO2dCQUNWLFVBQVUsRUFBRSxJQUFJO2dCQUNoQixPQUFPLEVBQUU7b0JBQ1AsTUFBTSxFQUFFO3dCQUNaLE9BQU8sRUFBRSxLQUFLO3dCQUNSLFFBQVEsRUFBRSxLQUFLO3FCQUNoQjtvQkFDRCxLQUFLLEVBQUU7d0JBQ0wsT0FBTyxFQUFFLEtBQUs7d0JBQ2QsSUFBSSxFQUFFLHlCQUF5QjtxQkFDaEM7aUJBQ0Y7YUFDRjtTQUNGLENBQ0EsQ0FBQTtJQUNOLENBQUM7Q0FHRDtBQUVELGNBQWMsQ0FBQyxNQUFNLENBQUMsMkJBQTJCLEVBQUUsNkJBQTZCLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIFNQRFgtRmlsZUNvcHlyaWdodFRleHQ6IDIwMjQgQ2F0Y2ggU29sdmUgZGkgRGF2aWRlIE1vbnRlc2luXG4vL1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9yLWxhdGVyXG5cblxuaW1wb3J0IHsgTGFiZWxBbmREYXRhIH0gZnJvbSBcIi4vTGFiZWxBbmREYXRhLmpzXCJcbmltcG9ydCB7IEFQSTMsIGNhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfY2hlY2tfY2F0ZWdvcnlfZmFpbGVkX3JlY29yc192d19fcm93IH0gZnJvbSBcIi4vYXBpL2FwaTMuanNcIlxuaW1wb3J0IHsgY3NfY2FzdCB9IGZyb20gXCIuL3F1YWxpdHkuanNcIlxuXG5cbmV4cG9ydCBjbGFzcyBEYXRhc2V0SXNzdWVDYXRlZ29yeUNvbXBvbmVudCBleHRlbmRzIEhUTUxFbGVtZW50XG57XG5cdFxuXHR0ZW1wbGF0ZVxuXHRcblx0Y29ubmVjdGVkX3Byb21pc2Vcblx0Y29ubmVjdGVkX2Z1bmM6IChzOiBudWxsKSA9PiB2b2lkID0gcyA9PiBudWxsXG5cdFxuXHRtb3JlX2RpdlxuXHRcblx0Y29ubmVjdGVkQ2FsbGJhY2soKVxuXHR7XG5cdFx0Y29uc29sZS5sb2coJ2Nvbm5lY3RlZCcpXG5cdFx0dGhpcy5jb25uZWN0ZWRfZnVuYyhudWxsKVxuXHR9XG5cdFxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpXG5cdFx0dGhpcy5jb25uZWN0ZWRfcHJvbWlzZSA9IG5ldyBQcm9taXNlKHMgPT4gdGhpcy5jb25uZWN0ZWRfZnVuYyA9IHMpXG5cdFx0Y29uc3Qgc3Jvb3QgPSB0aGlzLmF0dGFjaFNoYWRvdyh7IG1vZGU6ICdvcGVuJyB9KVxuXHRcdHNyb290LmlubmVySFRNTCA9IGBcblx0XHRcdFx0XHRcdDxzdHlsZT5cblx0XHRcdFx0XHRcdFx0Omhvc3Qge1xuXHRcdFx0XHRcdFx0XHRcdGRpc3BsYXk6IGlubGluZS1ibG9jaztcblx0XHRcdFx0XHRcdFx0XHRib3gtc2hhZG93OiA0cHggNHB4ICNjY2M7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0LmNhdGVnb3J5IHtcblx0XHRcdFx0XHRcdFx0XHRib3JkZXI6IDFweCBzb2xpZCBncmF5O1xuXHRcdFx0XHRcdFx0XHRcdHdpZHRoOiAxMnJlbTtcblx0XHRcdFx0XHRcdFx0XHRkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG5cdFx0XHRcdFx0XHRcdFx0LyogbWFyZ2luOiAxcmVtOyAqL1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdC5jYXRlZ29yeSA+IGltZyB7XG5cdFx0XHRcdFx0XHRcdFx0d2lkdGg6IDEwMCU7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0LmNhdGVnb3J5IC5jYXRlZ29yeV9uYW1lIHtcblx0XHRcdFx0XHRcdFx0XHRmb250LXdlaWdodDogYm9sZDtcblx0XHRcdFx0XHRcdFx0XHR0ZXh0LWFsaWduOiBjZW50ZXI7XG5cdFx0XHRcdFx0XHRcdFx0bWFyZ2luLXRvcDogMC40cmVtO1xuXHRcdFx0XHRcdFx0XHRcdG1hcmdpbi1ib3R0b206IDAuNHJlbTtcblx0XHRcdFx0XHRcdFx0XHRsaW5lLWhlaWdodDogMXJlbTtcblx0XHRcdFx0XHRcdFx0XHRoZWlnaHQ6IDJyZW07XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0LmZyYW1lIHtcblx0XHRcdFx0XHRcdFx0XHRkaXNwbGF5OiBmbGV4XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0LmZyYW1lIC5jb250ZW50IHtcblx0XHRcdFx0XHRcdFx0XHRmbGV4LWdyb3c6IDEwMDtcblx0XHRcdFx0XHRcdFx0XHRkaXNwbGF5OiBmbGV4O1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdC5jaGFydGRpdiB7XG5cdFx0XHRcdFx0XHRcdFx0d2lkdGg6ICAxMDBweDtcblx0XHRcdFx0XHRcdFx0XHRoZWlnaHQ6IDEwMHB4O1xuXHRcdFx0XHRcdFx0XHRcdG1hcmdpbjogYXV0bztcblx0XHRcdFx0XHRcdFx0XHRwb3NpdGlvbjogcmVsYXRpdmU7XG5cdFx0XHRcdFx0XHRcdFx0bWFyZ2luLXRvcDogMC40cmVtO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHQuY2hhcnRkaXYgLnBlcmMge1xuXHRcdFx0XHRcdFx0XHRcdHBvc2l0aW9uOiBhYnNvbHV0ZTtcblx0XHRcdFx0XHRcdFx0XHR0b3A6ICBjYWxjKDUwJSAtIDAuOHJlbSk7XG5cdFx0XHRcdFx0XHRcdFx0bGVmdDogY2FsYyg1MCUgLSAxLjZyZW0pO1xuXHRcdFx0XHRcdFx0XHRcdGZvbnQtc2l6ZTogMS41cmVtO1xuXHRcdFx0XHRcdFx0XHRcdGZvbnQtd2VpZ2h0OiBib2xkO1xuXHRcdFx0XHRcdFx0XHRcdGNvbG9yOiAjMDAwO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRkZXRhaWxzIHtcblx0XHRcdFx0XHRcdFx0XHRtYXJnaW4tdG9wOiAwLjRyZW07XG5cdFx0XHRcdFx0XHRcdFx0bWFyZ2luLWJvdHRvbTogMC40cmVtO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRkZXRhaWxzID4gKiB7XG5cdFx0XHRcdFx0XHRcdFx0cGFkZGluZzogMC41ZW07XG5cdFx0XHRcdFx0XHRcdFx0Ym9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNjY2M7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0LnZpZXdfZGV0YWlscyB7XG5cdFx0XHRcdFx0XHRcdFx0LyogYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZGFyay1iYWNrZ3JvdW5kKTsgKi9cblx0XHRcdFx0XHRcdFx0XHRiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoNzEsIDEwNSwgNDEpO1xuXHRcdFx0XHRcdFx0XHRcdGNvbG9yOiAjZGRkO1xuXHRcdFx0XHRcdFx0XHRcdHRleHQtYWxpZ246IGNlbnRlcjtcblx0XHRcdFx0XHRcdFx0XHRwYWRkaW5nOiAwLjZyZW07XG5cdFx0XHRcdFx0XHRcdFx0Y3Vyc29yOiBwb2ludGVyO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHQudmlld19kZXRhaWxzOmhvdmVyIHtcblx0XHRcdFx0XHRcdFx0XHRiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMzUsIDc1LCAyMCk7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHQubGFzdHVwZGF0ZSB7XG5cdFx0XHRcdFx0XHRcdFx0bWFyZ2luLXRvcDogMC40cmVtO1xuXHRcdFx0XHRcdFx0XHRcdGZvbnQtc2l6ZTogMC43cmVtO1xuXHRcdFx0XHRcdFx0XHRcdG1hcmdpbi1ib3R0b206IDAuNHJlbTtcblx0XHRcdFx0XHRcdFx0XHRtYXJnaW4tbGVmdDogMC40cmVtO1xuXHRcdFx0XHRcdFx0XHRcdG1hcmdpbi1yaWdodDogMC40cmVtO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHQubnJfcmVjb3JkcywgZGV0YWlscyB7XG5cdFx0XHRcdFx0XHRcdFx0bWFyZ2luLWxlZnQ6IDAuNHJlbTtcblx0XHRcdFx0XHRcdFx0XHRtYXJnaW4tcmlnaHQ6IDAuNHJlbTtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQ8L3N0eWxlPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNhdGVnb3J5XCI+XG5cdFx0XHRcdFx0XHRcdDwhLS0gPGltZyBzcmM9XCJrcGktcGllLWNoYXJ0LnBuZ1wiPiAtLT5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNoYXJ0ZGl2XCI+XG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInBlcmNcIj4xMiU8L2Rpdj5cblx0XHRcdFx0XHRcdFx0XHQ8Y2FudmFzIGNsYXNzPVwiY2hhcnRcIj48L2NhbnZhcz5cblx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjYXRlZ29yeV9uYW1lXCI+Q29tcGxldGVuZXNzPC9kaXY+XG5cdFx0XHRcdFx0XHRcdDxzcGFuPjwvc3Bhbj5cblx0XHRcdFx0XHRcdFx0PGNzLWxhYmVsLWFuZC1kYXRhIGxhYmVsPVwicXVhbGl0eS1hc3N1cmVkIHJlY3NcIiBjbGFzcz1cIm5yX3JlY29yZHNcIj48L2NzLWxhYmVsLWFuZC1kYXRhPlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwibGFzdHVwZGF0ZVwiPlxuXHRcdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzPVwiZGF0YVwiPjwvc3Bhbj5cblx0XHRcdFx0XHRcdFx0XHQ8c3Bhbj48L3NwYW4+XG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHQ8IS0tIDxkaXYgY2xhc3M9XCJucl9yZWNvcmRzXCI+MTIzPC9kaXY+IC0tPlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwibW9yZVwiPlxuXHRcdFx0XHRcdFx0XHRcdDxkZXRhaWxzPlxuXHRcdFx0XHRcdFx0XHRcdFx0PHN1bW1hcnk+Y2FycmllZCBvdXQgdGVzdHM8L3N1bW1hcnk+XG5cdFx0XHRcdFx0XHRcdFx0PC9kZXRhaWxzPlxuXHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJ2aWV3X2RldGFpbHNcIj5WaWV3IGRldGFpbHM8L2Rpdj5cblx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdGA7XG5cblx0XHRjdXN0b21FbGVtZW50cy51cGdyYWRlKHNyb290KTtcblx0XHR0aGlzLnRlbXBsYXRlID0gY3NfY2FzdChIVE1MRWxlbWVudCwgc3Jvb3QucXVlcnlTZWxlY3RvcignLmNhdGVnb3J5JykpO1xuXHRcdHRoaXMubW9yZV9kaXYgPSBjc19jYXN0KEhUTUxFbGVtZW50LCBzcm9vdC5xdWVyeVNlbGVjdG9yKCcubW9yZScpKTtcblx0fVxuXHRcblx0aGlkZU1vcmVEaXYoKSAge1xuXHRcdHRoaXMubW9yZV9kaXYuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuXHR9XG5cdFxuXHRhc3luYyByZWZyZXNoKGRhdGE6IHtkYXRhc2V0X25hbWU6IHN0cmluZywgdG90X3JlY29yZHM6IG51bWJlciwgZmFpbGVkX3JlY29yZHM6IG51bWJlciwgY2hlY2tfY2F0ZWdvcnk6IHN0cmluZywgc2Vzc2lvbl9zdGFydF90czogc3RyaW5nfSlcblx0e1xuXG5cdFx0Y29uc3QgY2F0ID0gdGhpcy50ZW1wbGF0ZVxuXHRcdHRoaXMuc2V0dXBfY2hhcnQoY2F0LCBkYXRhKVxuXHRcdGNvbnN0IGNhdF9uYW1lID0gY3NfY2FzdChIVE1MRWxlbWVudCwgY2F0LnF1ZXJ5U2VsZWN0b3IoJy5jYXRlZ29yeV9uYW1lJykpXG5cdFx0Y2F0X25hbWUudGV4dENvbnRlbnQgPSBkYXRhLmNoZWNrX2NhdGVnb3J5XG5cdFx0Y29uc3QgZmFpbGVkZWxlbWVudCA9IGNzX2Nhc3QoTGFiZWxBbmREYXRhLCBjYXQucXVlcnlTZWxlY3RvcignLm5yX3JlY29yZHMnKSlcblx0XHRmYWlsZWRlbGVtZW50LnNldERhdGEoJycgKyAoZGF0YS50b3RfcmVjb3JkcyAtIGRhdGEuZmFpbGVkX3JlY29yZHMpKVxuXHRcdGNvbnN0IGxhc3RfdXBkYXRlID0gY3NfY2FzdChIVE1MU3BhbkVsZW1lbnQsIGNhdC5xdWVyeVNlbGVjdG9yKCcubGFzdHVwZGF0ZSAuZGF0YScpKVxuXHRcdGNvbnN0IGRhdGUgPSBuZXcgRGF0ZShkYXRhLnNlc3Npb25fc3RhcnRfdHMpXG5cdFx0XG5cdFx0Y29uc3QgcGVyYyA9IGNzX2Nhc3QoSFRNTEVsZW1lbnQsIGNhdC5xdWVyeVNlbGVjdG9yKCcucGVyYycpKVxuXHRcdHBlcmMudGV4dENvbnRlbnQgPSAnJyArICgoZGF0YS50b3RfcmVjb3JkcyAtIGRhdGEuZmFpbGVkX3JlY29yZHMpICogMTAwIC8gZGF0YS50b3RfcmVjb3JkcykudG9GaXhlZCgxKVxuXHRcdFx0XHRcblx0XHRjb25zdCBkYXRlZm9ybWF0ID0gbmV3IEludGwuRGF0ZVRpbWVGb3JtYXQoJ2l0LUlUJywge1xuXHRcdFx0XHRcdHllYXI6ICdudW1lcmljJyxcblx0XHRcdFx0XHRtb250aDogJzItZGlnaXQnLFxuXHRcdFx0XHRcdGRheTogJzItZGlnaXQnLFxuXHRcdFx0XHRcdGhvdXI6ICcyLWRpZ2l0Jyxcblx0XHRcdFx0XHRtaW51dGU6IFwiMi1kaWdpdFwiLFxuXHRcdFx0XHRcdHRpbWVab25lOiAnRXVyb3BlL1JvbWUnXG5cdFx0XHRcdH0pLmZvcm1hdChkYXRlKVxuXG5cdFx0bGFzdF91cGRhdGUudGV4dENvbnRlbnQgPSBkYXRlZm9ybWF0XG5cblx0XHRjb25zdCB2aWV3X2RldGFpbHMgPSBjc19jYXN0KEhUTUxFbGVtZW50LCBjYXQucXVlcnlTZWxlY3RvcignLnZpZXdfZGV0YWlscycpKVxuXHRcdFxuXHRcdHZpZXdfZGV0YWlscy5vbmNsaWNrID0gKCkgPT4ge1xuXHRcdFx0bG9jYXRpb24uaGFzaCA9ICcjcGFnZT1zdW1tYXJ5JnNlc3Npb25fc3RhcnRfdHM9JyArIGRhdGEuc2Vzc2lvbl9zdGFydF90cyArICcmZGF0YXNldF9uYW1lPScgKyBkYXRhLmRhdGFzZXRfbmFtZSArICcmY2F0ZWdvcnlfbmFtZT0nICsgZGF0YS5jaGVja19jYXRlZ29yeSArXG5cdFx0XHRcdFx0XHRcdCcmZmFpbGVkX3JlY29yZHM9JyArIGRhdGEuZmFpbGVkX3JlY29yZHMgKyAnJnRvdF9yZWNvcmRzPScgKyBkYXRhLnRvdF9yZWNvcmRzIFxuXHRcdH1cblx0XHRcblx0XHRjb25zdCBjYXRfZGV0YWlscyA9ICBjc19jYXN0KEhUTUxFbGVtZW50LCBjYXQucXVlcnlTZWxlY3RvcignZGV0YWlscycpKVxuXHRcdFxuXHRcdEFQSTMubGlzdF9fY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9jaGVja19jYXRlZ29yeV9jaGVja19uYW1lX2ZhaWxlZF9yZWNvcnNfdncoe1xuXHRcdFx0XHRcdHNlc3Npb25fc3RhcnRfdHM6IGRhdGEuc2Vzc2lvbl9zdGFydF90cyxcblx0XHRcdFx0XHRkYXRhc2V0X25hbWUgOiBkYXRhLmRhdGFzZXRfbmFtZSxcblx0XHRcdFx0XHRjaGVja19jYXRlZ29yeTogZGF0YS5jaGVja19jYXRlZ29yeVxuXHRcdFx0XHR9KS50aGVuKChjaGVja3MpID0+IHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhjaGVja3MpXG5cdFx0XHRcdFx0Zm9yIChsZXQgaTIgPSAwOyBpMiA8IGNoZWNrcy5sZW5ndGg7IGkyKyspXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Y29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jylcblx0XHRcdFx0XHRcdGRpdi50ZXh0Q29udGVudCA9IGNoZWNrc1tpMl0uY2hlY2tfbmFtZSAvLyArICcgJyArIGNoZWNrc1tpMl0uZmFpbGVkX3JlY29yZHMgKyAgJyAvICcgKyBjaGVja3NbaTJdLnRvdF9yZWNvcmRzIFxuXHRcdFx0XHRcdFx0Y2F0X2RldGFpbHMuYXBwZW5kQ2hpbGQoZGl2KVxuXHRcdFx0XHRcdH1cblx0XHR9KVxuXG5cdH1cblxuXHRhc3luYyAgc2V0dXBfY2hhcnQoY2F0OiBIVE1MRWxlbWVudCwgYXJnMToge3RvdF9yZWNvcmRzOiBudW1iZXIsIGZhaWxlZF9yZWNvcmRzOiBudW1iZXJ9KSB7XG5cdFx0YXdhaXQgdGhpcy5jb25uZWN0ZWRfcHJvbWlzZVxuXHRcdGNvbnN0IGNoYXJ0ID0gY3NfY2FzdChIVE1MQ2FudmFzRWxlbWVudCwgY2F0LnF1ZXJ5U2VsZWN0b3IoJy5jaGFydCcpKTtcblx0XHQvLyBjb25zdCBjb250ZXh0ID0gY2hhcnQuZ2V0Q29udGV4dCgnMmQnKTtcblx0XHRcdFx0XHRcdG5ldyBDaGFydChjaGFydCwgXHRcdFx0XHR7XG5cdFx0XHRcdFx0XHQgIHR5cGU6ICdkb3VnaG51dCcsXG5cdFx0XHRcdFx0XHQgIGRhdGE6IHtcblx0XHRcdFx0XHRcdCAgICBsYWJlbHM6IFsnb2snLCAnZmFpbCddLFxuXHRcdFx0XHRcdFx0ICAgIGRhdGFzZXRzOiBbXG5cdFx0XHRcdFx0XHQgICAgICB7XG5cdFx0XHRcdFx0XHQgICAgICAgIGxhYmVsOiAnRGF0YXNldCAxJyxcblx0XHRcdFx0XHRcdCAgICAgICAgZGF0YTogW2FyZzEudG90X3JlY29yZHMgLSBhcmcxLmZhaWxlZF9yZWNvcmRzLCBhcmcxLmZhaWxlZF9yZWNvcmRzLCBdLFxuXHRcdFx0XHRcdFx0XHRcdGJhY2tncm91bmRDb2xvcjogWycjMGEwJywgJyMyMjInLCBdXG5cdFx0XHRcdFx0XHQgICAgICB9XG5cdFx0XHRcdFx0XHQgICAgXVxuXHRcdFx0XHRcdFx0ICB9LFxuXHRcdFx0XHRcdFx0ICBvcHRpb25zOiB7XG5cdFx0XHRcdFx0XHRcdGN1dG91dDogJzgwJScsXG5cdFx0XHRcdFx0XHQgICAgcmVzcG9uc2l2ZTogdHJ1ZSxcblx0XHRcdFx0XHRcdCAgICBwbHVnaW5zOiB7XG5cdFx0XHRcdFx0XHQgICAgICBsZWdlbmQ6IHtcblx0XHRcdFx0XHRcdFx0XHRkaXNwbGF5OiBmYWxzZSxcblx0XHRcdFx0XHRcdCAgICAgICAgcG9zaXRpb246ICd0b3AnLFxuXHRcdFx0XHRcdFx0ICAgICAgfSxcblx0XHRcdFx0XHRcdCAgICAgIHRpdGxlOiB7XG5cdFx0XHRcdFx0XHQgICAgICAgIGRpc3BsYXk6IGZhbHNlLFxuXHRcdFx0XHRcdFx0ICAgICAgICB0ZXh0OiAnQ2hhcnQuanMgRG91Z2hudXQgQ2hhcnQnXG5cdFx0XHRcdFx0XHQgICAgICB9XG5cdFx0XHRcdFx0XHQgICAgfVxuXHRcdFx0XHRcdFx0ICB9LFxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0KVxuXHR9XG5cblxufVxuXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ2NzLWRhdGFzZXQtaXNzdWUtY2F0ZWdvcnknLCBEYXRhc2V0SXNzdWVDYXRlZ29yeUNvbXBvbmVudClcbiJdfQ==