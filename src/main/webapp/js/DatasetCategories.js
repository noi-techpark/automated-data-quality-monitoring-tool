/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */
import { cs_cast } from "./quality.js";
import { API3 } from './api/api3.js';
import { Loader } from "./Loader.js";
import { LabelAndData } from "./LabelAndData.js";
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
							details > *:nth-child(even) {
							  background-color: #ccc;
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
							<span></span>
							<cs-label-and-data label="failed recs" class="nr_records"></cs-label-and-data>
							<cs-label-and-data label="last update" class="last_update"></cs-label-and-data>
							<!-- <div class="nr_records">123</div> -->
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
            const failedelement = cs_cast(LabelAndData, cat.querySelector('.nr_records'));
            failedelement.setData('' + resp[i].failed_records);
            const last_update = cs_cast(LabelAndData, cat.querySelector('.last_update'));
            const date = new Date(p_session_start_ts);
            const dateformat = new Intl.DateTimeFormat('it-IT', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: "2-digit",
                timeZone: 'Europe/Rome'
            }).format(date);
            last_update.setData(dateformat);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YXNldENhdGVnb3JpZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90eXBlc2NyaXB0L0RhdGFzZXRDYXRlZ29yaWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7R0FHRztBQUdILE9BQU8sRUFBRSxPQUFPLEVBQVksTUFBTSxjQUFjLENBQUM7QUFDakQsT0FBTyxFQUFDLElBQUksRUFBdUUsTUFBTSxlQUFlLENBQUM7QUFHekcsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUNyQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFFakQsTUFBTSxPQUFPLGlCQUFrQixTQUFRLFdBQVc7SUFHakQsUUFBUSxDQUFBO0lBRVIsT0FBTyxDQUFBO0lBRVAsaUJBQWlCLENBQUE7SUFDakIsY0FBYyxHQUFzQixDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQTtJQUU3QyxpQkFBaUI7UUFFaEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUN4QixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQzFCLENBQUM7SUFFRDtRQUNDLEtBQUssRUFBRSxDQUFBO1FBQ1AsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUMsQ0FBQTtRQUNsRSxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUE7UUFDakQsS0FBSyxDQUFDLFNBQVMsR0FBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FrRGIsQ0FBQztRQUNFLGNBQWMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFP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QUFFO29CQUNSO3dCQUNFLEtBQUssRUFBRSxXQUFXO3dCQUNsQixJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQzt3QkFDekUsZUFBZSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztxQkFDNUI7aUJBQ0Y7YUFDRjtZQUNELE9BQU8sRUFBRTtnQkFDUCxVQUFVLEVBQUUsSUFBSTtnQkFDaEIsT0FBTyxFQUFFO29CQUNQLE1BQU0sRUFBRTt3QkFDWixPQUFPLEVBQUUsS0FBSzt3QkFDUixRQUFRLEVBQUUsS0FBSztxQkFDaEI7b0JBQ0QsS0FBSyxFQUFFO3dCQUNMLE9BQU8sRUFBRSxLQUFLO3dCQUNkLElBQUksRUFBRSx5QkFBeUI7cUJBQ2hDO2lCQUNGO2FBQ0Y7U0FDRixDQUNBLENBQUE7SUFDTixDQUFDO0NBR0Q7QUFFRCxjQUFjLENBQUMsTUFBTSxDQUFDLHVCQUF1QixFQUFFLGlCQUFpQixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogKEMpIDIwMjQgQ2F0Y2ggU29sdmUgZGkgRGF2aWRlIE1vbnRlc2luXG4gKiBMaWNlbnNlOiBBR1BMXG4gKi9cblxuXG5pbXBvcnQgeyBjc19jYXN0LCB0aHJvd05QRSB9IGZyb20gXCIuL3F1YWxpdHkuanNcIjtcbmltcG9ydCB7QVBJMywgY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9jaGVja19jYXRlZ29yeV9mYWlsZWRfcmVjb3JzX3Z3X19yb3d9IGZyb20gJy4vYXBpL2FwaTMuanMnO1xuaW1wb3J0IHsgT3BlbkNsb3NlU2VjdGlvbiB9IGZyb20gXCIuL09wZW5DbG9zZVNlY3Rpb24uanNcIjtcbmltcG9ydCB7IFNlY3Rpb25Sb3cgfSBmcm9tIFwiLi9TZWN0aW9uUm93LmpzXCI7XG5pbXBvcnQgeyBMb2FkZXIgfSBmcm9tIFwiLi9Mb2FkZXIuanNcIjtcbmltcG9ydCB7IExhYmVsQW5kRGF0YSB9IGZyb20gXCIuL0xhYmVsQW5kRGF0YS5qc1wiO1xuXG5leHBvcnQgY2xhc3MgRGF0YXNldENhdGVnb3JpZXMgZXh0ZW5kcyBIVE1MRWxlbWVudFxue1xuXHRcblx0dGVtcGxhdGVcblx0XG5cdGNvbnRlbnRcblx0XG5cdGNvbm5lY3RlZF9wcm9taXNlXG5cdGNvbm5lY3RlZF9mdW5jOiAoczogbnVsbCkgPT4gdm9pZCA9IHMgPT4gbnVsbFxuXHRcblx0Y29ubmVjdGVkQ2FsbGJhY2soKVxuXHR7XG5cdFx0Y29uc29sZS5sb2coJ2Nvbm5lY3RlZCcpXG5cdFx0dGhpcy5jb25uZWN0ZWRfZnVuYyhudWxsKVxuXHR9XG5cdFxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpXG5cdFx0dGhpcy5jb25uZWN0ZWRfcHJvbWlzZSA9IG5ldyBQcm9taXNlKHMgPT4gdGhpcy5jb25uZWN0ZWRfZnVuYyA9IHMpXG5cdFx0Y29uc3Qgc3Jvb3QgPSB0aGlzLmF0dGFjaFNoYWRvdyh7IG1vZGU6ICdvcGVuJyB9KVxuXHRcdHNyb290LmlubmVySFRNTCA9IGBcblx0XHRcdFx0XHRcdDxzdHlsZT5cblx0XHRcdFx0XHRcdFx0Omhvc3Qge1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdC5jYXRlZ29yeSB7XG5cdFx0XHRcdFx0XHRcdFx0Ym9yZGVyOiAxcHggc29saWQgZ3JheTtcblx0XHRcdFx0XHRcdFx0XHR3aWR0aDogMTJyZW07XG5cdFx0XHRcdFx0XHRcdFx0ZGlzcGxheTogaW5saW5lLWJsb2NrO1xuXHRcdFx0XHRcdFx0XHRcdG1hcmdpbjogMXJlbTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHQuY2F0ZWdvcnkgPiBpbWcge1xuXHRcdFx0XHRcdFx0XHRcdHdpZHRoOiAxMDAlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdC5jYXRlZ29yeSAuY2F0ZWdvcnlfbmFtZSB7XG5cdFx0XHRcdFx0XHRcdFx0Zm9udC13ZWlnaHQ6IGJvbGQ7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0LmZyYW1lIHtcblx0XHRcdFx0XHRcdFx0XHRkaXNwbGF5OiBmbGV4XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0LmZyYW1lIC5jb250ZW50IHtcblx0XHRcdFx0XHRcdFx0XHRmbGV4LWdyb3c6IDEwMDtcblx0XHRcdFx0XHRcdFx0XHRkaXNwbGF5OiBmbGV4O1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdC5jaGFydGRpdiB7XG5cdFx0XHRcdFx0XHRcdFx0d2lkdGg6ICAxMDBweDtcblx0XHRcdFx0XHRcdFx0XHRoZWlnaHQ6IDEwMHB4O1xuXHRcdFx0XHRcdFx0XHRcdG1hcmdpbjogYXV0bztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRkZXRhaWxzID4gKjpudGgtY2hpbGQoZXZlbikge1xuXHRcdFx0XHRcdFx0XHQgIGJhY2tncm91bmQtY29sb3I6ICNjY2M7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdDwvc3R5bGU+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiZnJhbWVcIj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbnRlbnRcIj48L2Rpdj5cblx0XHRcdFx0XHRcdFx0PGltZyBzcmM9XCJrcGktZ2VuZXJhbC1pbmZvLnBuZ1wiPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY2F0ZWdvcnlcIj5cblx0XHRcdFx0XHRcdFx0PCEtLSA8aW1nIHNyYz1cImtwaS1waWUtY2hhcnQucG5nXCI+IC0tPlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY2hhcnRkaXZcIj5cblx0XHRcdFx0XHRcdFx0XHQ8Y2FudmFzIGNsYXNzPVwiY2hhcnRcIj48L2NhbnZhcz5cblx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjYXRlZ29yeV9uYW1lXCI+Q29tcGxldGVuZXNzPC9kaXY+XG5cdFx0XHRcdFx0XHRcdDxzcGFuPjwvc3Bhbj5cblx0XHRcdFx0XHRcdFx0PGNzLWxhYmVsLWFuZC1kYXRhIGxhYmVsPVwiZmFpbGVkIHJlY3NcIiBjbGFzcz1cIm5yX3JlY29yZHNcIj48L2NzLWxhYmVsLWFuZC1kYXRhPlxuXHRcdFx0XHRcdFx0XHQ8Y3MtbGFiZWwtYW5kLWRhdGEgbGFiZWw9XCJsYXN0IHVwZGF0ZVwiIGNsYXNzPVwibGFzdF91cGRhdGVcIj48L2NzLWxhYmVsLWFuZC1kYXRhPlxuXHRcdFx0XHRcdFx0XHQ8IS0tIDxkaXYgY2xhc3M9XCJucl9yZWNvcmRzXCI+MTIzPC9kaXY+IC0tPlxuXHRcdFx0XHRcdFx0XHQ8ZGV0YWlscz5cblx0XHRcdFx0XHRcdFx0XHQ8c3VtbWFyeT5mYWlsZWQgY2hlY2sgbGlzdDwvc3VtbWFyeT5cblx0XHRcdFx0XHRcdFx0PC9kZXRhaWxzPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRgO1xuXHRcdCAgICAgICAgY3VzdG9tRWxlbWVudHMudXBncmFkZShzcm9vdCk7XG5cdFx0ICAgICAgICB0aGlzLmNvbnRlbnQgPSBjc19jYXN0KEhUTUxFbGVtZW50LCBzcm9vdC5xdWVyeVNlbGVjdG9yKCcuY29udGVudCcpKTtcblx0XHQgICAgICAgIHRoaXMudGVtcGxhdGUgPSBjc19jYXN0KEhUTUxFbGVtZW50LCBzcm9vdC5xdWVyeVNlbGVjdG9yKCcuY2F0ZWdvcnknKSk7XG5cdFx0ICAgICAgICB0aGlzLnRlbXBsYXRlLnJlbW92ZSgpO1xuXHRcdFx0XHRcblx0fVxuXHRcblx0YXN5bmMgcmVmcmVzaChwX3Nlc3Npb25fc3RhcnRfdHM6IHN0cmluZywgcF9kYXRhc2V0X25hbWU6IHN0cmluZykge1xuXHRcdFxuXHRcdGNvbnNvbGUubG9nKHBfc2Vzc2lvbl9zdGFydF90cylcblx0XHRjb25zb2xlLmxvZyhwX2RhdGFzZXRfbmFtZSlcblx0XHRjb25zdCBsb2FkZXIgPSBuZXcgTG9hZGVyKClcblx0XHR0aGlzLmNvbnRlbnQuYXBwZW5kQ2hpbGQobG9hZGVyKVxuXHRcdGNvbnN0IHJlc3AgPSBhd2FpdCBBUEkzLmxpc3RfX2NhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfY2hlY2tfY2F0ZWdvcnlfZmFpbGVkX3JlY29yc192dyh7XG5cdFx0XHRzZXNzaW9uX3N0YXJ0X3RzOiBwX3Nlc3Npb25fc3RhcnRfdHMsXG5cdFx0XHRkYXRhc2V0X25hbWUgOiBwX2RhdGFzZXRfbmFtZVxuXHRcdH0pXG5cdFx0bG9hZGVyLnJlbW92ZSgpXG5cdFx0Y29uc29sZS5sb2cocmVzcCkgXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCByZXNwLmxlbmd0aDsgaSsrKVxuXHRcdHtcblx0XHRcdGNvbnN0IGNhdCA9IGNzX2Nhc3QoSFRNTEVsZW1lbnQsIHRoaXMudGVtcGxhdGUuY2xvbmVOb2RlKHRydWUpKVxuXHRcdFx0dGhpcy5zZXR1cF9jaGFydChjYXQsIHJlc3BbaV0pXG5cdFx0XHRjb25zdCBjYXRfbmFtZSA9IGNzX2Nhc3QoSFRNTEVsZW1lbnQsIGNhdC5xdWVyeVNlbGVjdG9yKCcuY2F0ZWdvcnlfbmFtZScpKVxuXHRcdFx0Y2F0X25hbWUudGV4dENvbnRlbnQgPSByZXNwW2ldLmNoZWNrX2NhdGVnb3J5XG5cdFx0XHRjb25zdCBmYWlsZWRlbGVtZW50ID0gY3NfY2FzdChMYWJlbEFuZERhdGEsIGNhdC5xdWVyeVNlbGVjdG9yKCcubnJfcmVjb3JkcycpKVxuXHRcdFx0ZmFpbGVkZWxlbWVudC5zZXREYXRhKCcnICsgcmVzcFtpXS5mYWlsZWRfcmVjb3Jkcylcblx0XHRcdGNvbnN0IGxhc3RfdXBkYXRlID0gY3NfY2FzdChMYWJlbEFuZERhdGEsIGNhdC5xdWVyeVNlbGVjdG9yKCcubGFzdF91cGRhdGUnKSlcblx0XHRcdGNvbnN0IGRhdGUgPSBuZXcgRGF0ZShwX3Nlc3Npb25fc3RhcnRfdHMpXG5cdFx0XHRcdFx0XG5cdFx0XHRjb25zdCBkYXRlZm9ybWF0ID0gbmV3IEludGwuRGF0ZVRpbWVGb3JtYXQoJ2l0LUlUJywge1xuXHRcdFx0XHRcdFx0eWVhcjogJ251bWVyaWMnLFxuXHRcdFx0XHRcdFx0bW9udGg6ICcyLWRpZ2l0Jyxcblx0XHRcdFx0XHRcdGRheTogJzItZGlnaXQnLFxuXHRcdFx0XHRcdFx0aG91cjogJzItZGlnaXQnLFxuXHRcdFx0XHRcdFx0bWludXRlOiBcIjItZGlnaXRcIixcblx0XHRcdFx0XHRcdHRpbWVab25lOiAnRXVyb3BlL1JvbWUnXG5cdFx0XHRcdFx0fSkuZm9ybWF0KGRhdGUpXG5cdFx0XHRsYXN0X3VwZGF0ZS5zZXREYXRhKGRhdGVmb3JtYXQpXG5cdFx0XHR0aGlzLmNvbnRlbnQuYXBwZW5kQ2hpbGQoY2F0KVxuXHRcdFx0XG5cdFx0XHRjYXRfbmFtZS5vbmNsaWNrID0gKCkgPT4ge1xuXHRcdFx0XHRsb2NhdGlvbi5oYXNoID0gJyNwYWdlPXN1bW1hcnkmc2Vzc2lvbl9zdGFydF90cz0nICsgcF9zZXNzaW9uX3N0YXJ0X3RzICsgJyZkYXRhc2V0X25hbWU9JyArIHBfZGF0YXNldF9uYW1lICsgJyZjYXRlZ29yeV9uYW1lPScgKyByZXNwW2ldLmNoZWNrX2NhdGVnb3J5IFxuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRjb25zdCBjYXRfZGV0YWlscyA9ICBjc19jYXN0KEhUTUxFbGVtZW50LCBjYXQucXVlcnlTZWxlY3RvcignZGV0YWlscycpKVxuXHRcdFx0XG5cdFx0XHRBUEkzLmxpc3RfX2NhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfY2hlY2tfY2F0ZWdvcnlfY2hlY2tfbmFtZV9mYWlsZWRfcmVjb3JzX3Z3KHtcblx0XHRcdFx0XHRcdHNlc3Npb25fc3RhcnRfdHM6IHBfc2Vzc2lvbl9zdGFydF90cyxcblx0XHRcdFx0XHRcdGRhdGFzZXRfbmFtZSA6IHBfZGF0YXNldF9uYW1lLFxuXHRcdFx0XHRcdFx0Y2hlY2tfY2F0ZWdvcnk6IHJlc3BbaV0uY2hlY2tfY2F0ZWdvcnlcblx0XHRcdFx0XHR9KS50aGVuKChjaGVja3MpID0+IHtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGNoZWNrcylcblx0XHRcdFx0XHRcdGZvciAobGV0IGkyID0gMDsgaTIgPCBjaGVja3MubGVuZ3RoOyBpMisrKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXHRcdFx0XHRcdFx0XHRkaXYudGV4dENvbnRlbnQgPSBjaGVja3NbaTJdLmNoZWNrX25hbWUgLy8gKyAnICcgKyBjaGVja3NbaTJdLmZhaWxlZF9yZWNvcmRzICsgICcgLyAnICsgY2hlY2tzW2kyXS50b3RfcmVjb3JkcyBcblx0XHRcdFx0XHRcdFx0Y2F0X2RldGFpbHMuYXBwZW5kQ2hpbGQoZGl2KVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcblx0XHR9XG5cdH1cblxuXHRhc3luYyAgc2V0dXBfY2hhcnQoY2F0OiBIVE1MRWxlbWVudCwgYXJnMTogY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9jaGVja19jYXRlZ29yeV9mYWlsZWRfcmVjb3JzX3Z3X19yb3cpIHtcblx0XHRhd2FpdCB0aGlzLmNvbm5lY3RlZF9wcm9taXNlXG5cdFx0Y29uc3QgY2hhcnQgPSBjc19jYXN0KEhUTUxDYW52YXNFbGVtZW50LCBjYXQucXVlcnlTZWxlY3RvcignLmNoYXJ0JykpO1xuXHRcdGNvbnN0IGNvbnRleHQgPSBjaGFydC5nZXRDb250ZXh0KCcyZCcpO1xuXHRcdFx0XHRcdFx0bmV3IENoYXJ0KGNvbnRleHQsIFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0ICB0eXBlOiAnZG91Z2hudXQnLFxuXHRcdFx0XHRcdFx0ICBkYXRhOiB7XG5cdFx0XHRcdFx0XHQgICAgbGFiZWxzOiBbJ29rJywgJ2ZhaWwnXSxcblx0XHRcdFx0XHRcdCAgICBkYXRhc2V0czogW1xuXHRcdFx0XHRcdFx0ICAgICAge1xuXHRcdFx0XHRcdFx0ICAgICAgICBsYWJlbDogJ0RhdGFzZXQgMScsXG5cdFx0XHRcdFx0XHQgICAgICAgIGRhdGE6IFthcmcxLnRvdF9yZWNvcmRzIC0gYXJnMS5mYWlsZWRfcmVjb3JkcywgYXJnMS5mYWlsZWRfcmVjb3Jkc10sXG5cdFx0XHRcdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiBbJyM4ZjgnLCAnI2Y4OCddXG5cdFx0XHRcdFx0XHQgICAgICB9XG5cdFx0XHRcdFx0XHQgICAgXVxuXHRcdFx0XHRcdFx0ICB9LFxuXHRcdFx0XHRcdFx0ICBvcHRpb25zOiB7XG5cdFx0XHRcdFx0XHQgICAgcmVzcG9uc2l2ZTogdHJ1ZSxcblx0XHRcdFx0XHRcdCAgICBwbHVnaW5zOiB7XG5cdFx0XHRcdFx0XHQgICAgICBsZWdlbmQ6IHtcblx0XHRcdFx0XHRcdFx0XHRkaXNwbGF5OiBmYWxzZSxcblx0XHRcdFx0XHRcdCAgICAgICAgcG9zaXRpb246ICd0b3AnLFxuXHRcdFx0XHRcdFx0ICAgICAgfSxcblx0XHRcdFx0XHRcdCAgICAgIHRpdGxlOiB7XG5cdFx0XHRcdFx0XHQgICAgICAgIGRpc3BsYXk6IGZhbHNlLFxuXHRcdFx0XHRcdFx0ICAgICAgICB0ZXh0OiAnQ2hhcnQuanMgRG91Z2hudXQgQ2hhcnQnXG5cdFx0XHRcdFx0XHQgICAgICB9XG5cdFx0XHRcdFx0XHQgICAgfVxuXHRcdFx0XHRcdFx0ICB9LFxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0KVxuXHR9XG5cblxufVxuXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ2NzLWRhdGFzZXQtY2F0ZWdvcmllcycsIERhdGFzZXRDYXRlZ29yaWVzKVxuXG4iXX0=