/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */
import { LabelAndData } from "./LabelAndData.js";
import { API3 } from "./api/api3.js";
import { cs_cast } from "./quality.js";
export class DatasetIssueCategory extends HTMLElement {
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
								text-align: center;
								margin-top: 0.4rem;
								margin-bottom: 0.4rem;
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
							
							details > *:nth-child(even) {
							  background-color: #ccc;
							}
							
							.view_details {
								background-color: var(--dark-background);
								color: #ddd;
								text-align: center;
								padding: 0.6rem;
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
							<cs-label-and-data label="failed recs" class="nr_records"></cs-label-and-data>
							<div class="lastupdate">
								<span class="data"></span>
								<span></span>
							</div>
							<!-- <div class="nr_records">123</div> -->
							<div class="more">
								<details>
									<summary>failed check list</summary>
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
        failedelement.setData('' + data.failed_records);
        const last_update = cs_cast(HTMLSpanElement, cat.querySelector('.lastupdate .data'));
        const date = new Date(data.session_start_ts);
        const perc = cs_cast(HTMLElement, cat.querySelector('.perc'));
        perc.textContent = '' + (data.failed_records * 100 / data.tot_records);
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
                        data: [arg1.failed_records, arg1.tot_records - arg1.failed_records,],
                        backgroundColor: ['#222', '#fff']
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
customElements.define('cs-dataset-issue-category', DatasetIssueCategory);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YXNldElzc3VlQ2F0ZWdvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90eXBlc2NyaXB0L0RhdGFzZXRJc3N1ZUNhdGVnb3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7R0FHRztBQUdILE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQTtBQUVoRCxPQUFPLEVBQUUsSUFBSSxFQUF3RSxNQUFNLGVBQWUsQ0FBQTtBQUMxRyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sY0FBYyxDQUFBO0FBR3RDLE1BQU0sT0FBTyxvQkFBcUIsU0FBUSxXQUFXO0lBR3BELFFBQVEsQ0FBQTtJQUVSLGlCQUFpQixDQUFBO0lBQ2pCLGNBQWMsR0FBc0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUE7SUFFN0MsUUFBUSxDQUFBO0lBRVIsaUJBQWlCO1FBRWhCLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDeEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUMxQixDQUFDO0lBRUQ7UUFDQyxLQUFLLEVBQUUsQ0FBQTtRQUNQLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDbEUsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFBO1FBQ2pELEtBQUssQ0FBQyxTQUFTLEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BeUZiLENBQUM7UUFFTixjQUFjLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlCLElBQUksQ0FBQyxRQUFRLEdBQUcs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UixRQUFRLEVBQUUsS0FBSztxQkFDaEI7b0JBQ0QsS0FBSyxFQUFFO3dCQUNMLE9BQU8sRUFBRSxLQUFLO3dCQUNkLElBQUksRUFBRSx5QkFBeUI7cUJBQ2hDO2lCQUNGO2FBQ0Y7U0FDRixDQUNBLENBQUE7SUFDTixDQUFDO0NBR0Q7QUFFRCxjQUFjLENBQUMsTUFBTSxDQUFDLDJCQUEyQixFQUFFLG9CQUFvQixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogKEMpIDIwMjQgQ2F0Y2ggU29sdmUgZGkgRGF2aWRlIE1vbnRlc2luXG4gKiBMaWNlbnNlOiBBR1BMXG4gKi9cblxuaW1wb3J0IENoYXJ0ID0gcmVxdWlyZShcImNoYXJ0LmpzXCIpXG5pbXBvcnQgeyBMYWJlbEFuZERhdGEgfSBmcm9tIFwiLi9MYWJlbEFuZERhdGEuanNcIlxuaW1wb3J0IHsgTG9hZGVyIH0gZnJvbSBcIi4vTG9hZGVyLmpzXCJcbmltcG9ydCB7IEFQSTMsIGNhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfY2hlY2tfY2F0ZWdvcnlfZmFpbGVkX3JlY29yc192d19fcm93IH0gZnJvbSBcIi4vYXBpL2FwaTMuanNcIlxuaW1wb3J0IHsgY3NfY2FzdCB9IGZyb20gXCIuL3F1YWxpdHkuanNcIlxuXG5cbmV4cG9ydCBjbGFzcyBEYXRhc2V0SXNzdWVDYXRlZ29yeSBleHRlbmRzIEhUTUxFbGVtZW50XG57XG5cdFxuXHR0ZW1wbGF0ZVxuXHRcblx0Y29ubmVjdGVkX3Byb21pc2Vcblx0Y29ubmVjdGVkX2Z1bmM6IChzOiBudWxsKSA9PiB2b2lkID0gcyA9PiBudWxsXG5cdFxuXHRtb3JlX2RpdlxuXHRcblx0Y29ubmVjdGVkQ2FsbGJhY2soKVxuXHR7XG5cdFx0Y29uc29sZS5sb2coJ2Nvbm5lY3RlZCcpXG5cdFx0dGhpcy5jb25uZWN0ZWRfZnVuYyhudWxsKVxuXHR9XG5cdFxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpXG5cdFx0dGhpcy5jb25uZWN0ZWRfcHJvbWlzZSA9IG5ldyBQcm9taXNlKHMgPT4gdGhpcy5jb25uZWN0ZWRfZnVuYyA9IHMpXG5cdFx0Y29uc3Qgc3Jvb3QgPSB0aGlzLmF0dGFjaFNoYWRvdyh7IG1vZGU6ICdvcGVuJyB9KVxuXHRcdHNyb290LmlubmVySFRNTCA9IGBcblx0XHRcdFx0XHRcdDxzdHlsZT5cblx0XHRcdFx0XHRcdFx0Omhvc3Qge1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdC5jYXRlZ29yeSB7XG5cdFx0XHRcdFx0XHRcdFx0Ym9yZGVyOiAxcHggc29saWQgZ3JheTtcblx0XHRcdFx0XHRcdFx0XHR3aWR0aDogMTJyZW07XG5cdFx0XHRcdFx0XHRcdFx0ZGlzcGxheTogaW5saW5lLWJsb2NrO1xuXHRcdFx0XHRcdFx0XHRcdG1hcmdpbjogMXJlbTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHQuY2F0ZWdvcnkgPiBpbWcge1xuXHRcdFx0XHRcdFx0XHRcdHdpZHRoOiAxMDAlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdC5jYXRlZ29yeSAuY2F0ZWdvcnlfbmFtZSB7XG5cdFx0XHRcdFx0XHRcdFx0Zm9udC13ZWlnaHQ6IGJvbGQ7XG5cdFx0XHRcdFx0XHRcdFx0dGV4dC1hbGlnbjogY2VudGVyO1xuXHRcdFx0XHRcdFx0XHRcdG1hcmdpbi10b3A6IDAuNHJlbTtcblx0XHRcdFx0XHRcdFx0XHRtYXJnaW4tYm90dG9tOiAwLjRyZW07XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0LmZyYW1lIHtcblx0XHRcdFx0XHRcdFx0XHRkaXNwbGF5OiBmbGV4XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0LmZyYW1lIC5jb250ZW50IHtcblx0XHRcdFx0XHRcdFx0XHRmbGV4LWdyb3c6IDEwMDtcblx0XHRcdFx0XHRcdFx0XHRkaXNwbGF5OiBmbGV4O1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdC5jaGFydGRpdiB7XG5cdFx0XHRcdFx0XHRcdFx0d2lkdGg6ICAxMDBweDtcblx0XHRcdFx0XHRcdFx0XHRoZWlnaHQ6IDEwMHB4O1xuXHRcdFx0XHRcdFx0XHRcdG1hcmdpbjogYXV0bztcblx0XHRcdFx0XHRcdFx0XHRwb3NpdGlvbjogcmVsYXRpdmU7XG5cdFx0XHRcdFx0XHRcdFx0bWFyZ2luLXRvcDogMC40cmVtO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHQuY2hhcnRkaXYgLnBlcmMge1xuXHRcdFx0XHRcdFx0XHRcdHBvc2l0aW9uOiBhYnNvbHV0ZTtcblx0XHRcdFx0XHRcdFx0XHR0b3A6ICBjYWxjKDUwJSAtIDAuOHJlbSk7XG5cdFx0XHRcdFx0XHRcdFx0bGVmdDogY2FsYyg1MCUgLSAxLjZyZW0pO1xuXHRcdFx0XHRcdFx0XHRcdGZvbnQtc2l6ZTogMS41cmVtO1xuXHRcdFx0XHRcdFx0XHRcdGZvbnQtd2VpZ2h0OiBib2xkO1xuXHRcdFx0XHRcdFx0XHRcdGNvbG9yOiAjMDAwO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRkZXRhaWxzID4gKjpudGgtY2hpbGQoZXZlbikge1xuXHRcdFx0XHRcdFx0XHQgIGJhY2tncm91bmQtY29sb3I6ICNjY2M7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdC52aWV3X2RldGFpbHMge1xuXHRcdFx0XHRcdFx0XHRcdGJhY2tncm91bmQtY29sb3I6IHZhcigtLWRhcmstYmFja2dyb3VuZCk7XG5cdFx0XHRcdFx0XHRcdFx0Y29sb3I6ICNkZGQ7XG5cdFx0XHRcdFx0XHRcdFx0dGV4dC1hbGlnbjogY2VudGVyO1xuXHRcdFx0XHRcdFx0XHRcdHBhZGRpbmc6IDAuNnJlbTtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdC5sYXN0dXBkYXRlIHtcblx0XHRcdFx0XHRcdFx0XHRtYXJnaW4tdG9wOiAwLjRyZW07XG5cdFx0XHRcdFx0XHRcdFx0Zm9udC1zaXplOiAwLjdyZW07XG5cdFx0XHRcdFx0XHRcdFx0bWFyZ2luLWJvdHRvbTogMC40cmVtO1xuXHRcdFx0XHRcdFx0XHRcdG1hcmdpbi1sZWZ0OiAwLjRyZW07XG5cdFx0XHRcdFx0XHRcdFx0bWFyZ2luLXJpZ2h0OiAwLjRyZW07XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdC5ucl9yZWNvcmRzLCBkZXRhaWxzIHtcblx0XHRcdFx0XHRcdFx0XHRtYXJnaW4tbGVmdDogMC40cmVtO1xuXHRcdFx0XHRcdFx0XHRcdG1hcmdpbi1yaWdodDogMC40cmVtO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdDwvc3R5bGU+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY2F0ZWdvcnlcIj5cblx0XHRcdFx0XHRcdFx0PCEtLSA8aW1nIHNyYz1cImtwaS1waWUtY2hhcnQucG5nXCI+IC0tPlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY2hhcnRkaXZcIj5cblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicGVyY1wiPjEyJTwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdDxjYW52YXMgY2xhc3M9XCJjaGFydFwiPjwvY2FudmFzPlxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNhdGVnb3J5X25hbWVcIj5Db21wbGV0ZW5lc3M8L2Rpdj5cblx0XHRcdFx0XHRcdFx0PHNwYW4+PC9zcGFuPlxuXHRcdFx0XHRcdFx0XHQ8Y3MtbGFiZWwtYW5kLWRhdGEgbGFiZWw9XCJmYWlsZWQgcmVjc1wiIGNsYXNzPVwibnJfcmVjb3Jkc1wiPjwvY3MtbGFiZWwtYW5kLWRhdGE+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJsYXN0dXBkYXRlXCI+XG5cdFx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3M9XCJkYXRhXCI+PC9zcGFuPlxuXHRcdFx0XHRcdFx0XHRcdDxzcGFuPjwvc3Bhbj5cblx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdDwhLS0gPGRpdiBjbGFzcz1cIm5yX3JlY29yZHNcIj4xMjM8L2Rpdj4gLS0+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJtb3JlXCI+XG5cdFx0XHRcdFx0XHRcdFx0PGRldGFpbHM+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8c3VtbWFyeT5mYWlsZWQgY2hlY2sgbGlzdDwvc3VtbWFyeT5cblx0XHRcdFx0XHRcdFx0XHQ8L2RldGFpbHM+XG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInZpZXdfZGV0YWlsc1wiPlZpZXcgZGV0YWlsczwvZGl2PlxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0YDtcblxuXHRcdGN1c3RvbUVsZW1lbnRzLnVwZ3JhZGUoc3Jvb3QpO1xuXHRcdHRoaXMudGVtcGxhdGUgPSBjc19jYXN0KEhUTUxFbGVtZW50LCBzcm9vdC5xdWVyeVNlbGVjdG9yKCcuY2F0ZWdvcnknKSk7XG5cdFx0dGhpcy5tb3JlX2RpdiA9IGNzX2Nhc3QoSFRNTEVsZW1lbnQsIHNyb290LnF1ZXJ5U2VsZWN0b3IoJy5tb3JlJykpO1xuXHR9XG5cdFxuXHRoaWRlTW9yZURpdigpICB7XG5cdFx0dGhpcy5tb3JlX2Rpdi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG5cdH1cblx0XG5cdGFzeW5jIHJlZnJlc2goZGF0YToge2RhdGFzZXRfbmFtZTogc3RyaW5nLCB0b3RfcmVjb3JkczogbnVtYmVyLCBmYWlsZWRfcmVjb3JkczogbnVtYmVyLCBjaGVja19jYXRlZ29yeTogc3RyaW5nLCBzZXNzaW9uX3N0YXJ0X3RzOiBzdHJpbmd9KVxuXHR7XG5cblx0XHRjb25zdCBjYXQgPSB0aGlzLnRlbXBsYXRlXG5cdFx0dGhpcy5zZXR1cF9jaGFydChjYXQsIGRhdGEpXG5cdFx0Y29uc3QgY2F0X25hbWUgPSBjc19jYXN0KEhUTUxFbGVtZW50LCBjYXQucXVlcnlTZWxlY3RvcignLmNhdGVnb3J5X25hbWUnKSlcblx0XHRjYXRfbmFtZS50ZXh0Q29udGVudCA9IGRhdGEuY2hlY2tfY2F0ZWdvcnlcblx0XHRjb25zdCBmYWlsZWRlbGVtZW50ID0gY3NfY2FzdChMYWJlbEFuZERhdGEsIGNhdC5xdWVyeVNlbGVjdG9yKCcubnJfcmVjb3JkcycpKVxuXHRcdGZhaWxlZGVsZW1lbnQuc2V0RGF0YSgnJyArIGRhdGEuZmFpbGVkX3JlY29yZHMpXG5cdFx0Y29uc3QgbGFzdF91cGRhdGUgPSBjc19jYXN0KEhUTUxTcGFuRWxlbWVudCwgY2F0LnF1ZXJ5U2VsZWN0b3IoJy5sYXN0dXBkYXRlIC5kYXRhJykpXG5cdFx0Y29uc3QgZGF0ZSA9IG5ldyBEYXRlKGRhdGEuc2Vzc2lvbl9zdGFydF90cylcblx0XHRcblx0XHRjb25zdCBwZXJjID0gY3NfY2FzdChIVE1MRWxlbWVudCwgY2F0LnF1ZXJ5U2VsZWN0b3IoJy5wZXJjJykpXG5cdFx0cGVyYy50ZXh0Q29udGVudCA9ICcnICsgKGRhdGEuZmFpbGVkX3JlY29yZHMgKiAxMDAgLyBkYXRhLnRvdF9yZWNvcmRzKVxuXHRcdFx0XHRcblx0XHRjb25zdCBkYXRlZm9ybWF0ID0gbmV3IEludGwuRGF0ZVRpbWVGb3JtYXQoJ2l0LUlUJywge1xuXHRcdFx0XHRcdHllYXI6ICdudW1lcmljJyxcblx0XHRcdFx0XHRtb250aDogJzItZGlnaXQnLFxuXHRcdFx0XHRcdGRheTogJzItZGlnaXQnLFxuXHRcdFx0XHRcdGhvdXI6ICcyLWRpZ2l0Jyxcblx0XHRcdFx0XHRtaW51dGU6IFwiMi1kaWdpdFwiLFxuXHRcdFx0XHRcdHRpbWVab25lOiAnRXVyb3BlL1JvbWUnXG5cdFx0XHRcdH0pLmZvcm1hdChkYXRlKVxuXG5cdFx0bGFzdF91cGRhdGUudGV4dENvbnRlbnQgPSBkYXRlZm9ybWF0XG5cblx0XHRjb25zdCB2aWV3X2RldGFpbHMgPSBjc19jYXN0KEhUTUxFbGVtZW50LCBjYXQucXVlcnlTZWxlY3RvcignLnZpZXdfZGV0YWlscycpKVxuXHRcdFxuXHRcdHZpZXdfZGV0YWlscy5vbmNsaWNrID0gKCkgPT4ge1xuXHRcdFx0bG9jYXRpb24uaGFzaCA9ICcjcGFnZT1zdW1tYXJ5JnNlc3Npb25fc3RhcnRfdHM9JyArIGRhdGEuc2Vzc2lvbl9zdGFydF90cyArICcmZGF0YXNldF9uYW1lPScgKyBkYXRhLmRhdGFzZXRfbmFtZSArICcmY2F0ZWdvcnlfbmFtZT0nICsgZGF0YS5jaGVja19jYXRlZ29yeSArXG5cdFx0XHRcdFx0XHRcdCcmZmFpbGVkX3JlY29yZHM9JyArIGRhdGEuZmFpbGVkX3JlY29yZHMgKyAnJnRvdF9yZWNvcmRzPScgKyBkYXRhLnRvdF9yZWNvcmRzIFxuXHRcdH1cblx0XHRcblx0XHRjb25zdCBjYXRfZGV0YWlscyA9ICBjc19jYXN0KEhUTUxFbGVtZW50LCBjYXQucXVlcnlTZWxlY3RvcignZGV0YWlscycpKVxuXHRcdFxuXHRcdEFQSTMubGlzdF9fY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9jaGVja19jYXRlZ29yeV9jaGVja19uYW1lX2ZhaWxlZF9yZWNvcnNfdncoe1xuXHRcdFx0XHRcdHNlc3Npb25fc3RhcnRfdHM6IGRhdGEuc2Vzc2lvbl9zdGFydF90cyxcblx0XHRcdFx0XHRkYXRhc2V0X25hbWUgOiBkYXRhLmRhdGFzZXRfbmFtZSxcblx0XHRcdFx0XHRjaGVja19jYXRlZ29yeTogZGF0YS5jaGVja19jYXRlZ29yeVxuXHRcdFx0XHR9KS50aGVuKChjaGVja3MpID0+IHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhjaGVja3MpXG5cdFx0XHRcdFx0Zm9yIChsZXQgaTIgPSAwOyBpMiA8IGNoZWNrcy5sZW5ndGg7IGkyKyspXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Y29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jylcblx0XHRcdFx0XHRcdGRpdi50ZXh0Q29udGVudCA9IGNoZWNrc1tpMl0uY2hlY2tfbmFtZSAvLyArICcgJyArIGNoZWNrc1tpMl0uZmFpbGVkX3JlY29yZHMgKyAgJyAvICcgKyBjaGVja3NbaTJdLnRvdF9yZWNvcmRzIFxuXHRcdFx0XHRcdFx0Y2F0X2RldGFpbHMuYXBwZW5kQ2hpbGQoZGl2KVxuXHRcdFx0XHRcdH1cblx0XHR9KVxuXG5cdH1cblxuXHRhc3luYyAgc2V0dXBfY2hhcnQoY2F0OiBIVE1MRWxlbWVudCwgYXJnMToge3RvdF9yZWNvcmRzOiBudW1iZXIsIGZhaWxlZF9yZWNvcmRzOiBudW1iZXJ9KSB7XG5cdFx0YXdhaXQgdGhpcy5jb25uZWN0ZWRfcHJvbWlzZVxuXHRcdGNvbnN0IGNoYXJ0ID0gY3NfY2FzdChIVE1MQ2FudmFzRWxlbWVudCwgY2F0LnF1ZXJ5U2VsZWN0b3IoJy5jaGFydCcpKTtcblx0XHQvLyBjb25zdCBjb250ZXh0ID0gY2hhcnQuZ2V0Q29udGV4dCgnMmQnKTtcblx0XHRcdFx0XHRcdG5ldyBDaGFydChjaGFydCwgXHRcdFx0XHR7XG5cdFx0XHRcdFx0XHQgIHR5cGU6ICdkb3VnaG51dCcsXG5cdFx0XHRcdFx0XHQgIGRhdGE6IHtcblx0XHRcdFx0XHRcdCAgICBsYWJlbHM6IFsnb2snLCAnZmFpbCddLFxuXHRcdFx0XHRcdFx0ICAgIGRhdGFzZXRzOiBbXG5cdFx0XHRcdFx0XHQgICAgICB7XG5cdFx0XHRcdFx0XHQgICAgICAgIGxhYmVsOiAnRGF0YXNldCAxJyxcblx0XHRcdFx0XHRcdCAgICAgICAgZGF0YTogW2FyZzEuZmFpbGVkX3JlY29yZHMsIGFyZzEudG90X3JlY29yZHMgLSBhcmcxLmZhaWxlZF9yZWNvcmRzLCBdLFxuXHRcdFx0XHRcdFx0XHRcdGJhY2tncm91bmRDb2xvcjogWycjMjIyJywgJyNmZmYnXVxuXHRcdFx0XHRcdFx0ICAgICAgfVxuXHRcdFx0XHRcdFx0ICAgIF1cblx0XHRcdFx0XHRcdCAgfSxcblx0XHRcdFx0XHRcdCAgb3B0aW9uczoge1xuXHRcdFx0XHRcdFx0XHRjdXRvdXQ6ICc4MCUnLFxuXHRcdFx0XHRcdFx0ICAgIHJlc3BvbnNpdmU6IHRydWUsXG5cdFx0XHRcdFx0XHQgICAgcGx1Z2luczoge1xuXHRcdFx0XHRcdFx0ICAgICAgbGVnZW5kOiB7XG5cdFx0XHRcdFx0XHRcdFx0ZGlzcGxheTogZmFsc2UsXG5cdFx0XHRcdFx0XHQgICAgICAgIHBvc2l0aW9uOiAndG9wJyxcblx0XHRcdFx0XHRcdCAgICAgIH0sXG5cdFx0XHRcdFx0XHQgICAgICB0aXRsZToge1xuXHRcdFx0XHRcdFx0ICAgICAgICBkaXNwbGF5OiBmYWxzZSxcblx0XHRcdFx0XHRcdCAgICAgICAgdGV4dDogJ0NoYXJ0LmpzIERvdWdobnV0IENoYXJ0J1xuXHRcdFx0XHRcdFx0ICAgICAgfVxuXHRcdFx0XHRcdFx0ICAgIH1cblx0XHRcdFx0XHRcdCAgfSxcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdClcblx0fVxuXG5cbn1cblxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCdjcy1kYXRhc2V0LWlzc3VlLWNhdGVnb3J5JywgRGF0YXNldElzc3VlQ2F0ZWdvcnkpXG4iXX0=