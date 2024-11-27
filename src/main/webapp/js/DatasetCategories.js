/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */
import { cs_cast } from "./quality.js";
import { API3 } from './api/api3.js';
import { Loader } from "./Loader.js";
export class DatasetCategories extends HTMLElement {
    template;
    content;
    connected_promise;
    connected_func = s => null;
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
								width: 10rem;
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
							}
						</style>
						<div class="frame">
							<div class="content"></div>
							<img src="kpi-general-info.png">
						</div>
						<div class="category">
							<!-- <img src="kpi-pie-chart.png"> -->
							<div class="chartdiv">
								<canvas class="chart"></canvas>
							</div>
							<div class="category_name">Completeness</div>
							<span>bla bla bla bla</span>
							<div class="nr_records">123</div>
							<details>
								<summary>failed check list</summary>
							</details>
						</div>
						`;
        customElements.upgrade(sroot);
        this.content = cs_cast(HTMLElement, sroot.querySelector('.content'));
        this.template = cs_cast(HTMLElement, sroot.querySelector('.category'));
        this.template.remove();
    }
    async refresh(p_session_start_ts, p_dataset_name) {
        console.log(p_session_start_ts);
        console.log(p_dataset_name);
        const loader = new Loader();
        this.content.appendChild(loader);
        const resp = await API3.list__catchsolve_noiodh__test_dataset_check_category_failed_recors_vw({
            session_start_ts: p_session_start_ts,
            dataset_name: p_dataset_name
        });
        loader.remove();
        console.log(resp);
        for (let i = 0; i < resp.length; i++) {
            const cat = cs_cast(HTMLElement, this.template.cloneNode(true));
            this.setup_chart(cat, resp[i]);
            const cat_name = cs_cast(HTMLElement, cat.querySelector('.category_name'));
            cat_name.textContent = resp[i].check_category;
            cs_cast(HTMLElement, cat.querySelector('.nr_records')).textContent = 'failed ' + resp[i].failed_records + ' / '
                + resp[i].tot_records;
            this.content.appendChild(cat);
            cat_name.onclick = () => {
                location.hash = '#page=summary&session_start_ts=' + p_session_start_ts + '&dataset_name=' + p_dataset_name + '&category_name=' + resp[i].check_category;
            };
            const cat_details = cs_cast(HTMLElement, cat.querySelector('details'));
            API3.list__catchsolve_noiodh__test_dataset_check_category_check_name_failed_recors_vw({
                session_start_ts: p_session_start_ts,
                dataset_name: p_dataset_name,
                check_category: resp[i].check_category
            }).then((checks) => {
                console.log(checks);
                for (let i2 = 0; i2 < checks.length; i2++) {
                    const div = document.createElement('div');
                    div.textContent = checks[i2].check_name; // + ' ' + checks[i2].failed_records +  ' / ' + checks[i2].tot_records 
                    cat_details.appendChild(div);
                }
            });
        }
    }
    async setup_chart(cat, arg1) {
        await this.connected_promise;
        const chart = cs_cast(HTMLCanvasElement, cat.querySelector('.chart'));
        const context = chart.getContext('2d');
        new Chart(context, {
            type: 'doughnut',
            data: {
                labels: ['ok', 'fail'],
                datasets: [
                    {
                        label: 'Dataset 1',
                        data: [arg1.tot_records - arg1.failed_records, arg1.failed_records],
                        backgroundColor: ['#8f8', '#f88']
                    }
                ]
            },
            options: {
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
customElements.define('cs-dataset-categories', DatasetCategories);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YXNldENhdGVnb3JpZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90eXBlc2NyaXB0L0RhdGFzZXRDYXRlZ29yaWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7R0FHRztBQUdILE9BQU8sRUFBRSxPQUFPLEVBQVksTUFBTSxjQUFjLENBQUM7QUFDakQsT0FBTyxFQUFDLElBQUksRUFBdUUsTUFBTSxlQUFlLENBQUM7QUFHekcsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUVyQyxNQUFNLE9BQU8saUJBQWtCLFNBQVEsV0FBVztJQUdqRCxRQUFRLENBQUE7SUFFUixPQUFPLENBQUE7SUFFUCxpQkFBaUIsQ0FBQTtJQUNqQixjQUFjLEdBQXNCLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFBO0lBRTdDLGlCQUFpQjtRQUVoQixPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBQ3hCLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDMUIsQ0FBQztJQUVEO1FBQ0MsS0FBSyxFQUFFLENBQUE7UUFDUCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsY0FBYyxHQUFHLENBQUMsQ0FBQyxDQUFBO1FBQ2xFLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQTtRQUNqRCxLQUFLLENBQUMsU0FBUyxHQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0E2Q2IsQ0FBQztRQUNFLGNBQWMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUNyRSxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBQ3ZFLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7SUFFaEMsQ0FBQztJQUVELEtBQUssQ0FBQyxPQUFPLENBQUMsa0JBQTBCLEVBQUUsY0FBc0I7UUFFL0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO1FBQy9CLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUE7UUFDM0IsTUFBTSxNQUFNLEdBQUcsSUFBSSxNQUFNLEVBQUUsQ0FBQTtRQUMzQixJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUNoQyxNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxxRUFBcUUsQ0FBQztZQUM3RixnQkFBZ0IsRUFBRSxrQkFBa0I7WUFDcEMsWUFBWSxFQUFHLGNBQWM7U0FDN0IsQ0FBQyxDQUFBO1FBQ0YsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFBO1FBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNqQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFDcEMsQ0FBQztZQUNBLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtZQUMvRCxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUM5QixNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFBO1lBQzFFLFFBQVEsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQTtZQUM3QyxPQUFPLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxXQUFXLEdBQUcsU0FBUyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLEdBQUcsS0FBSztrQkFDN0csSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQTtZQUNyQixJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUU3QixRQUFRLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRTtnQkFDdkIsUUFBUSxDQUFDLElBQUksR0FBRyxpQ0FBaUMsR0FBRyxrQkFBa0IsR0FBRyxnQkFBZ0IsR0FBRyxjQUFjLEdBQUcsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQTtZQUN4SixDQUFDLENBQUE7WUFFRCxNQUFNLFdBQVcsR0FBSSxPQUFPLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQTtZQUV2RSxJQUFJLENBQUMsZ0ZBQWdGLENBQUM7Z0JBQ25GLGdCQUFnQixFQUFFLGtCQUFrQjtnQkFDcEMsWUFBWSxFQUFHLGNBQWM7Z0JBQzdCLGNBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYzthQUN0QyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7Z0JBQ2xCLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUE7Z0JBQ25CLEtBQUssSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLEVBQUUsRUFBRSxFQUN6QyxDQUFDO29CQUNBLE1BQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7b0JBQ3pDLEdBQUcsQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQSxDQUFDLHVFQUF1RTtvQkFDL0csV0FBVyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtnQkFDN0IsQ0FBQztZQUNGLENBQUMsQ0FBQyxDQUFBO1FBRUwsQ0FBQztJQUNGLENBQUM7SUFFRCxLQUFLLENBQUUsV0FBVyxDQUFDLEdBQWdCLEVBQUUsSUFBMEU7UUFDOUcsTUFBTSxJQUFJLENBQUMsaUJBQWlCLENBQUE7UUFDNUIsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUN0RSxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25DLElBQUksS0FBSyxDQUFDLE9BQU8sRUFBTTtZQUNyQixJQUFJLEVBQUUsVUFBVTtZQUNoQixJQUFJLEVBQUU7Z0JBQ0osTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQztnQkFDdEIsUUFBUSxFQUFFO29CQUNSO3dCQUNFLEtBQUssRUFBRSxXQUFXO3dCQUNsQixJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQzt3QkFDekUsZUFBZSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztxQkFDNUI7aUJBQ0Y7YUFDRjtZQUNELE9BQU8sRUFBRTtnQkFDUCxVQUFVLEVBQUUsSUFBSTtnQkFDaEIsT0FBTyxFQUFFO29CQUNQLE1BQU0sRUFBRTt3QkFDWixPQUFPLEVBQUUsS0FBSzt3QkFDUixRQUFRLEVBQUUsS0FBSztxQkFDaEI7b0JBQ0QsS0FBSyxFQUFFO3dCQUNMLE9BQU8sRUFBRSxLQUFLO3dCQUNkLElBQUksRUFBRSx5QkFBeUI7cUJBQ2hDO2lCQUNGO2FBQ0Y7U0FDRixDQUNBLENBQUE7SUFDTixDQUFDO0NBR0Q7QUFFRCxjQUFjLENBQUMsTUFBTSxDQUFDLHVCQUF1QixFQUFFLGlCQUFpQixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogKEMpIDIwMjQgQ2F0Y2ggU29sdmUgZGkgRGF2aWRlIE1vbnRlc2luXG4gKiBMaWNlbnNlOiBBR1BMXG4gKi9cblxuXG5pbXBvcnQgeyBjc19jYXN0LCB0aHJvd05QRSB9IGZyb20gXCIuL3F1YWxpdHkuanNcIjtcbmltcG9ydCB7QVBJMywgY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9jaGVja19jYXRlZ29yeV9mYWlsZWRfcmVjb3JzX3Z3X19yb3d9IGZyb20gJy4vYXBpL2FwaTMuanMnO1xuaW1wb3J0IHsgT3BlbkNsb3NlU2VjdGlvbiB9IGZyb20gXCIuL09wZW5DbG9zZVNlY3Rpb24uanNcIjtcbmltcG9ydCB7IFNlY3Rpb25Sb3cgfSBmcm9tIFwiLi9TZWN0aW9uUm93LmpzXCI7XG5pbXBvcnQgeyBMb2FkZXIgfSBmcm9tIFwiLi9Mb2FkZXIuanNcIjtcblxuZXhwb3J0IGNsYXNzIERhdGFzZXRDYXRlZ29yaWVzIGV4dGVuZHMgSFRNTEVsZW1lbnRcbntcblx0XG5cdHRlbXBsYXRlXG5cdFxuXHRjb250ZW50XG5cdFxuXHRjb25uZWN0ZWRfcHJvbWlzZVxuXHRjb25uZWN0ZWRfZnVuYzogKHM6IG51bGwpID0+IHZvaWQgPSBzID0+IG51bGxcblx0XG5cdGNvbm5lY3RlZENhbGxiYWNrKClcblx0e1xuXHRcdGNvbnNvbGUubG9nKCdjb25uZWN0ZWQnKVxuXHRcdHRoaXMuY29ubmVjdGVkX2Z1bmMobnVsbClcblx0fVxuXHRcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKVxuXHRcdHRoaXMuY29ubmVjdGVkX3Byb21pc2UgPSBuZXcgUHJvbWlzZShzID0+IHRoaXMuY29ubmVjdGVkX2Z1bmMgPSBzKVxuXHRcdGNvbnN0IHNyb290ID0gdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSlcblx0XHRzcm9vdC5pbm5lckhUTUwgPSBgXG5cdFx0XHRcdFx0XHQ8c3R5bGU+XG5cdFx0XHRcdFx0XHRcdDpob3N0IHtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHQuY2F0ZWdvcnkge1xuXHRcdFx0XHRcdFx0XHRcdGJvcmRlcjogMXB4IHNvbGlkIGdyYXk7XG5cdFx0XHRcdFx0XHRcdFx0d2lkdGg6IDEwcmVtO1xuXHRcdFx0XHRcdFx0XHRcdGRpc3BsYXk6IGlubGluZS1ibG9jaztcblx0XHRcdFx0XHRcdFx0XHRtYXJnaW46IDFyZW07XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0LmNhdGVnb3J5ID4gaW1nIHtcblx0XHRcdFx0XHRcdFx0XHR3aWR0aDogMTAwJTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHQuY2F0ZWdvcnkgLmNhdGVnb3J5X25hbWUge1xuXHRcdFx0XHRcdFx0XHRcdGZvbnQtd2VpZ2h0OiBib2xkO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdC5mcmFtZSB7XG5cdFx0XHRcdFx0XHRcdFx0ZGlzcGxheTogZmxleFxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdC5mcmFtZSAuY29udGVudCB7XG5cdFx0XHRcdFx0XHRcdFx0ZmxleC1ncm93OiAxMDA7XG5cdFx0XHRcdFx0XHRcdFx0ZGlzcGxheTogZmxleDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHQuY2hhcnRkaXYge1xuXHRcdFx0XHRcdFx0XHRcdHdpZHRoOiAgMTAwcHg7XG5cdFx0XHRcdFx0XHRcdFx0aGVpZ2h0OiAxMDBweDtcblx0XHRcdFx0XHRcdFx0XHRtYXJnaW46IGF1dG87XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdDwvc3R5bGU+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiZnJhbWVcIj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbnRlbnRcIj48L2Rpdj5cblx0XHRcdFx0XHRcdFx0PGltZyBzcmM9XCJrcGktZ2VuZXJhbC1pbmZvLnBuZ1wiPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY2F0ZWdvcnlcIj5cblx0XHRcdFx0XHRcdFx0PCEtLSA8aW1nIHNyYz1cImtwaS1waWUtY2hhcnQucG5nXCI+IC0tPlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY2hhcnRkaXZcIj5cblx0XHRcdFx0XHRcdFx0XHQ8Y2FudmFzIGNsYXNzPVwiY2hhcnRcIj48L2NhbnZhcz5cblx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjYXRlZ29yeV9uYW1lXCI+Q29tcGxldGVuZXNzPC9kaXY+XG5cdFx0XHRcdFx0XHRcdDxzcGFuPmJsYSBibGEgYmxhIGJsYTwvc3Bhbj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm5yX3JlY29yZHNcIj4xMjM8L2Rpdj5cblx0XHRcdFx0XHRcdFx0PGRldGFpbHM+XG5cdFx0XHRcdFx0XHRcdFx0PHN1bW1hcnk+ZmFpbGVkIGNoZWNrIGxpc3Q8L3N1bW1hcnk+XG5cdFx0XHRcdFx0XHRcdDwvZGV0YWlscz5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0YDtcblx0XHQgICAgICAgIGN1c3RvbUVsZW1lbnRzLnVwZ3JhZGUoc3Jvb3QpO1xuXHRcdCAgICAgICAgdGhpcy5jb250ZW50ID0gY3NfY2FzdChIVE1MRWxlbWVudCwgc3Jvb3QucXVlcnlTZWxlY3RvcignLmNvbnRlbnQnKSk7XG5cdFx0ICAgICAgICB0aGlzLnRlbXBsYXRlID0gY3NfY2FzdChIVE1MRWxlbWVudCwgc3Jvb3QucXVlcnlTZWxlY3RvcignLmNhdGVnb3J5JykpO1xuXHRcdCAgICAgICAgdGhpcy50ZW1wbGF0ZS5yZW1vdmUoKTtcblx0XHRcdFx0XG5cdH1cblx0XG5cdGFzeW5jIHJlZnJlc2gocF9zZXNzaW9uX3N0YXJ0X3RzOiBzdHJpbmcsIHBfZGF0YXNldF9uYW1lOiBzdHJpbmcpIHtcblx0XHRcblx0XHRjb25zb2xlLmxvZyhwX3Nlc3Npb25fc3RhcnRfdHMpXG5cdFx0Y29uc29sZS5sb2cocF9kYXRhc2V0X25hbWUpXG5cdFx0Y29uc3QgbG9hZGVyID0gbmV3IExvYWRlcigpXG5cdFx0dGhpcy5jb250ZW50LmFwcGVuZENoaWxkKGxvYWRlcilcblx0XHRjb25zdCByZXNwID0gYXdhaXQgQVBJMy5saXN0X19jYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X2NoZWNrX2NhdGVnb3J5X2ZhaWxlZF9yZWNvcnNfdncoe1xuXHRcdFx0c2Vzc2lvbl9zdGFydF90czogcF9zZXNzaW9uX3N0YXJ0X3RzLFxuXHRcdFx0ZGF0YXNldF9uYW1lIDogcF9kYXRhc2V0X25hbWVcblx0XHR9KVxuXHRcdGxvYWRlci5yZW1vdmUoKVxuXHRcdGNvbnNvbGUubG9nKHJlc3ApIFxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcmVzcC5sZW5ndGg7IGkrKylcblx0XHR7XG5cdFx0XHRjb25zdCBjYXQgPSBjc19jYXN0KEhUTUxFbGVtZW50LCB0aGlzLnRlbXBsYXRlLmNsb25lTm9kZSh0cnVlKSlcblx0XHRcdHRoaXMuc2V0dXBfY2hhcnQoY2F0LCByZXNwW2ldKVxuXHRcdFx0Y29uc3QgY2F0X25hbWUgPSBjc19jYXN0KEhUTUxFbGVtZW50LCBjYXQucXVlcnlTZWxlY3RvcignLmNhdGVnb3J5X25hbWUnKSlcblx0XHRcdGNhdF9uYW1lLnRleHRDb250ZW50ID0gcmVzcFtpXS5jaGVja19jYXRlZ29yeVxuXHRcdFx0Y3NfY2FzdChIVE1MRWxlbWVudCwgY2F0LnF1ZXJ5U2VsZWN0b3IoJy5ucl9yZWNvcmRzJykpLnRleHRDb250ZW50ID0gJ2ZhaWxlZCAnICsgcmVzcFtpXS5mYWlsZWRfcmVjb3JkcyArICcgLyAnXG5cdFx0XHQrIHJlc3BbaV0udG90X3JlY29yZHNcblx0XHRcdHRoaXMuY29udGVudC5hcHBlbmRDaGlsZChjYXQpXG5cdFx0XHRcblx0XHRcdGNhdF9uYW1lLm9uY2xpY2sgPSAoKSA9PiB7XG5cdFx0XHRcdGxvY2F0aW9uLmhhc2ggPSAnI3BhZ2U9c3VtbWFyeSZzZXNzaW9uX3N0YXJ0X3RzPScgKyBwX3Nlc3Npb25fc3RhcnRfdHMgKyAnJmRhdGFzZXRfbmFtZT0nICsgcF9kYXRhc2V0X25hbWUgKyAnJmNhdGVnb3J5X25hbWU9JyArIHJlc3BbaV0uY2hlY2tfY2F0ZWdvcnkgXG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdGNvbnN0IGNhdF9kZXRhaWxzID0gIGNzX2Nhc3QoSFRNTEVsZW1lbnQsIGNhdC5xdWVyeVNlbGVjdG9yKCdkZXRhaWxzJykpXG5cdFx0XHRcblx0XHRcdEFQSTMubGlzdF9fY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9jaGVja19jYXRlZ29yeV9jaGVja19uYW1lX2ZhaWxlZF9yZWNvcnNfdncoe1xuXHRcdFx0XHRcdFx0c2Vzc2lvbl9zdGFydF90czogcF9zZXNzaW9uX3N0YXJ0X3RzLFxuXHRcdFx0XHRcdFx0ZGF0YXNldF9uYW1lIDogcF9kYXRhc2V0X25hbWUsXG5cdFx0XHRcdFx0XHRjaGVja19jYXRlZ29yeTogcmVzcFtpXS5jaGVja19jYXRlZ29yeVxuXHRcdFx0XHRcdH0pLnRoZW4oKGNoZWNrcykgPT4ge1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coY2hlY2tzKVxuXHRcdFx0XHRcdFx0Zm9yIChsZXQgaTIgPSAwOyBpMiA8IGNoZWNrcy5sZW5ndGg7IGkyKyspXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG5cdFx0XHRcdFx0XHRcdGRpdi50ZXh0Q29udGVudCA9IGNoZWNrc1tpMl0uY2hlY2tfbmFtZSAvLyArICcgJyArIGNoZWNrc1tpMl0uZmFpbGVkX3JlY29yZHMgKyAgJyAvICcgKyBjaGVja3NbaTJdLnRvdF9yZWNvcmRzIFxuXHRcdFx0XHRcdFx0XHRjYXRfZGV0YWlscy5hcHBlbmRDaGlsZChkaXYpXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSlcblx0XHRcdFxuXHRcdH1cblx0fVxuXG5cdGFzeW5jICBzZXR1cF9jaGFydChjYXQ6IEhUTUxFbGVtZW50LCBhcmcxOiBjYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X2NoZWNrX2NhdGVnb3J5X2ZhaWxlZF9yZWNvcnNfdndfX3Jvdykge1xuXHRcdGF3YWl0IHRoaXMuY29ubmVjdGVkX3Byb21pc2Vcblx0XHRjb25zdCBjaGFydCA9IGNzX2Nhc3QoSFRNTENhbnZhc0VsZW1lbnQsIGNhdC5xdWVyeVNlbGVjdG9yKCcuY2hhcnQnKSk7XG5cdFx0Y29uc3QgY29udGV4dCA9IGNoYXJ0LmdldENvbnRleHQoJzJkJyk7XG5cdFx0XHRcdFx0XHRuZXcgQ2hhcnQoY29udGV4dCwgXHRcdFx0XHR7XG5cdFx0XHRcdFx0XHQgIHR5cGU6ICdkb3VnaG51dCcsXG5cdFx0XHRcdFx0XHQgIGRhdGE6IHtcblx0XHRcdFx0XHRcdCAgICBsYWJlbHM6IFsnb2snLCAnZmFpbCddLFxuXHRcdFx0XHRcdFx0ICAgIGRhdGFzZXRzOiBbXG5cdFx0XHRcdFx0XHQgICAgICB7XG5cdFx0XHRcdFx0XHQgICAgICAgIGxhYmVsOiAnRGF0YXNldCAxJyxcblx0XHRcdFx0XHRcdCAgICAgICAgZGF0YTogW2FyZzEudG90X3JlY29yZHMgLSBhcmcxLmZhaWxlZF9yZWNvcmRzLCBhcmcxLmZhaWxlZF9yZWNvcmRzXSxcblx0XHRcdFx0XHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFsnIzhmOCcsICcjZjg4J11cblx0XHRcdFx0XHRcdCAgICAgIH1cblx0XHRcdFx0XHRcdCAgICBdXG5cdFx0XHRcdFx0XHQgIH0sXG5cdFx0XHRcdFx0XHQgIG9wdGlvbnM6IHtcblx0XHRcdFx0XHRcdCAgICByZXNwb25zaXZlOiB0cnVlLFxuXHRcdFx0XHRcdFx0ICAgIHBsdWdpbnM6IHtcblx0XHRcdFx0XHRcdCAgICAgIGxlZ2VuZDoge1xuXHRcdFx0XHRcdFx0XHRcdGRpc3BsYXk6IGZhbHNlLFxuXHRcdFx0XHRcdFx0ICAgICAgICBwb3NpdGlvbjogJ3RvcCcsXG5cdFx0XHRcdFx0XHQgICAgICB9LFxuXHRcdFx0XHRcdFx0ICAgICAgdGl0bGU6IHtcblx0XHRcdFx0XHRcdCAgICAgICAgZGlzcGxheTogZmFsc2UsXG5cdFx0XHRcdFx0XHQgICAgICAgIHRleHQ6ICdDaGFydC5qcyBEb3VnaG51dCBDaGFydCdcblx0XHRcdFx0XHRcdCAgICAgIH1cblx0XHRcdFx0XHRcdCAgICB9XG5cdFx0XHRcdFx0XHQgIH0sXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQpXG5cdH1cblxuXG59XG5cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgnY3MtZGF0YXNldC1jYXRlZ29yaWVzJywgRGF0YXNldENhdGVnb3JpZXMpXG5cbiJdfQ==