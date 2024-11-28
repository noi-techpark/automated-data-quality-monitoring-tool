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
        this.template = cs_cast(HTMLElement, sroot.querySelector('.category'));
    }
    async refresh(data) {
        const cat = this.template;
        this.setup_chart(cat, data);
        const cat_name = cs_cast(HTMLElement, cat.querySelector('.category_name'));
        cat_name.textContent = data.check_category;
        const failedelement = cs_cast(LabelAndData, cat.querySelector('.nr_records'));
        failedelement.setData('' + data.failed_records);
        const last_update = cs_cast(LabelAndData, cat.querySelector('.last_update'));
        const date = new Date(data.session_start_ts);
        const dateformat = new Intl.DateTimeFormat('it-IT', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: "2-digit",
            timeZone: 'Europe/Rome'
        }).format(date);
        last_update.setData(dateformat);
        cat_name.onclick = () => {
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
customElements.define('cs-dataset-issue-category', DatasetIssueCategory);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YXNldElzc3VlQ2F0ZWdvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90eXBlc2NyaXB0L0RhdGFzZXRJc3N1ZUNhdGVnb3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7R0FHRztBQUVILE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQTtBQUVoRCxPQUFPLEVBQUUsSUFBSSxFQUF3RSxNQUFNLGVBQWUsQ0FBQTtBQUMxRyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sY0FBYyxDQUFBO0FBR3RDLE1BQU0sT0FBTyxvQkFBcUIsU0FBUSxXQUFXO0lBR3BELFFBQVEsQ0FBQTtJQUVSLGlCQUFpQixDQUFBO0lBQ2pCLGNBQWMsR0FBc0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUE7SUFFN0MsaUJBQWlCO1FBRWhCLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDeEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUMxQixDQUFDO0lBRUQ7UUFDQyxLQUFLLEVBQUUsQ0FBQTtRQUNQLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDbEUsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFBO1FBQ2pELEtBQUssQ0FBQyxTQUFTLEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0E4Q2IsQ0FBQztRQUNFLGNBQWMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FB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QztRQUN0RSxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25DLElBQUksS0FBSyxDQUFDLE9BQU8sRUFBTTtZQUNyQixJQUFJLEVBQUUsVUFBVTtZQUNoQixJQUFJLEVBQUU7Z0JBQ0osTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQztnQkFDdEIsUUFBUSxFQUFFO29CQUNSO3dCQUNFLEtBQUssRUFBRSxXQUFXO3dCQUNsQixJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQzt3QkFDekUsZUFBZSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztxQkFDNUI7aUJBQ0Y7YUFDRjtZQUNELE9BQU8sRUFBRTtnQkFDUCxVQUFVLEVBQUUsSUFBSTtnQkFDaEIsT0FBTyxFQUFFO29CQUNQLE1BQU0sRUFBRTt3QkFDWixPQUFPLEVBQUUsS0FBSzt3QkFDUixRQUFRLEVBQUUsS0FBSztxQkFDaEI7b0JBQ0QsS0FBSyxFQUFFO3dCQUNMLE9BQU8sRUFBRSxLQUFLO3dCQUNkLElBQUksRUFBRSx5QkFBeUI7cUJBQ2hDO2lCQUNGO2FBQ0Y7U0FDRixDQUNBLENBQUE7SUFDTixDQUFDO0NBR0Q7QUFFRCxjQUFjLENBQUMsTUFBTSxDQUFDLDJCQUEyQixFQUFFLG9CQUFvQixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogKEMpIDIwMjQgQ2F0Y2ggU29sdmUgZGkgRGF2aWRlIE1vbnRlc2luXG4gKiBMaWNlbnNlOiBBR1BMXG4gKi9cblxuaW1wb3J0IHsgTGFiZWxBbmREYXRhIH0gZnJvbSBcIi4vTGFiZWxBbmREYXRhLmpzXCJcbmltcG9ydCB7IExvYWRlciB9IGZyb20gXCIuL0xvYWRlci5qc1wiXG5pbXBvcnQgeyBBUEkzLCBjYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X2NoZWNrX2NhdGVnb3J5X2ZhaWxlZF9yZWNvcnNfdndfX3JvdyB9IGZyb20gXCIuL2FwaS9hcGkzLmpzXCJcbmltcG9ydCB7IGNzX2Nhc3QgfSBmcm9tIFwiLi9xdWFsaXR5LmpzXCJcblxuXG5leHBvcnQgY2xhc3MgRGF0YXNldElzc3VlQ2F0ZWdvcnkgZXh0ZW5kcyBIVE1MRWxlbWVudFxue1xuXHRcblx0dGVtcGxhdGVcblx0XG5cdGNvbm5lY3RlZF9wcm9taXNlXG5cdGNvbm5lY3RlZF9mdW5jOiAoczogbnVsbCkgPT4gdm9pZCA9IHMgPT4gbnVsbFxuXHRcblx0Y29ubmVjdGVkQ2FsbGJhY2soKVxuXHR7XG5cdFx0Y29uc29sZS5sb2coJ2Nvbm5lY3RlZCcpXG5cdFx0dGhpcy5jb25uZWN0ZWRfZnVuYyhudWxsKVxuXHR9XG5cdFxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpXG5cdFx0dGhpcy5jb25uZWN0ZWRfcHJvbWlzZSA9IG5ldyBQcm9taXNlKHMgPT4gdGhpcy5jb25uZWN0ZWRfZnVuYyA9IHMpXG5cdFx0Y29uc3Qgc3Jvb3QgPSB0aGlzLmF0dGFjaFNoYWRvdyh7IG1vZGU6ICdvcGVuJyB9KVxuXHRcdHNyb290LmlubmVySFRNTCA9IGBcblx0XHRcdFx0XHRcdDxzdHlsZT5cblx0XHRcdFx0XHRcdFx0Omhvc3Qge1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdC5jYXRlZ29yeSB7XG5cdFx0XHRcdFx0XHRcdFx0Ym9yZGVyOiAxcHggc29saWQgZ3JheTtcblx0XHRcdFx0XHRcdFx0XHR3aWR0aDogMTJyZW07XG5cdFx0XHRcdFx0XHRcdFx0ZGlzcGxheTogaW5saW5lLWJsb2NrO1xuXHRcdFx0XHRcdFx0XHRcdG1hcmdpbjogMXJlbTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHQuY2F0ZWdvcnkgPiBpbWcge1xuXHRcdFx0XHRcdFx0XHRcdHdpZHRoOiAxMDAlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdC5jYXRlZ29yeSAuY2F0ZWdvcnlfbmFtZSB7XG5cdFx0XHRcdFx0XHRcdFx0Zm9udC13ZWlnaHQ6IGJvbGQ7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0LmZyYW1lIHtcblx0XHRcdFx0XHRcdFx0XHRkaXNwbGF5OiBmbGV4XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0LmZyYW1lIC5jb250ZW50IHtcblx0XHRcdFx0XHRcdFx0XHRmbGV4LWdyb3c6IDEwMDtcblx0XHRcdFx0XHRcdFx0XHRkaXNwbGF5OiBmbGV4O1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdC5jaGFydGRpdiB7XG5cdFx0XHRcdFx0XHRcdFx0d2lkdGg6ICAxMDBweDtcblx0XHRcdFx0XHRcdFx0XHRoZWlnaHQ6IDEwMHB4O1xuXHRcdFx0XHRcdFx0XHRcdG1hcmdpbjogYXV0bztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRkZXRhaWxzID4gKjpudGgtY2hpbGQoZXZlbikge1xuXHRcdFx0XHRcdFx0XHQgIGJhY2tncm91bmQtY29sb3I6ICNjY2M7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdDwvc3R5bGU+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY2F0ZWdvcnlcIj5cblx0XHRcdFx0XHRcdFx0PCEtLSA8aW1nIHNyYz1cImtwaS1waWUtY2hhcnQucG5nXCI+IC0tPlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY2hhcnRkaXZcIj5cblx0XHRcdFx0XHRcdFx0XHQ8Y2FudmFzIGNsYXNzPVwiY2hhcnRcIj48L2NhbnZhcz5cblx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjYXRlZ29yeV9uYW1lXCI+Q29tcGxldGVuZXNzPC9kaXY+XG5cdFx0XHRcdFx0XHRcdDxzcGFuPjwvc3Bhbj5cblx0XHRcdFx0XHRcdFx0PGNzLWxhYmVsLWFuZC1kYXRhIGxhYmVsPVwiZmFpbGVkIHJlY3NcIiBjbGFzcz1cIm5yX3JlY29yZHNcIj48L2NzLWxhYmVsLWFuZC1kYXRhPlxuXHRcdFx0XHRcdFx0XHQ8Y3MtbGFiZWwtYW5kLWRhdGEgbGFiZWw9XCJsYXN0IHVwZGF0ZVwiIGNsYXNzPVwibGFzdF91cGRhdGVcIj48L2NzLWxhYmVsLWFuZC1kYXRhPlxuXHRcdFx0XHRcdFx0XHQ8IS0tIDxkaXYgY2xhc3M9XCJucl9yZWNvcmRzXCI+MTIzPC9kaXY+IC0tPlxuXHRcdFx0XHRcdFx0XHQ8ZGV0YWlscz5cblx0XHRcdFx0XHRcdFx0XHQ8c3VtbWFyeT5mYWlsZWQgY2hlY2sgbGlzdDwvc3VtbWFyeT5cblx0XHRcdFx0XHRcdFx0PC9kZXRhaWxzPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRgO1xuXHRcdCAgICAgICAgY3VzdG9tRWxlbWVudHMudXBncmFkZShzcm9vdCk7XG5cdFx0ICAgICAgICB0aGlzLnRlbXBsYXRlID0gY3NfY2FzdChIVE1MRWxlbWVudCwgc3Jvb3QucXVlcnlTZWxlY3RvcignLmNhdGVnb3J5JykpO1xuXHRcdFx0XHRcblx0fVxuXHRcblx0YXN5bmMgcmVmcmVzaChkYXRhOiB7ZGF0YXNldF9uYW1lOiBzdHJpbmcsIHRvdF9yZWNvcmRzOiBudW1iZXIsIGZhaWxlZF9yZWNvcmRzOiBudW1iZXIsIGNoZWNrX2NhdGVnb3J5OiBzdHJpbmcsIHNlc3Npb25fc3RhcnRfdHM6IHN0cmluZ30pXG5cdHtcblxuXHRcdGNvbnN0IGNhdCA9IHRoaXMudGVtcGxhdGVcblx0XHR0aGlzLnNldHVwX2NoYXJ0KGNhdCwgZGF0YSlcblx0XHRjb25zdCBjYXRfbmFtZSA9IGNzX2Nhc3QoSFRNTEVsZW1lbnQsIGNhdC5xdWVyeVNlbGVjdG9yKCcuY2F0ZWdvcnlfbmFtZScpKVxuXHRcdGNhdF9uYW1lLnRleHRDb250ZW50ID0gZGF0YS5jaGVja19jYXRlZ29yeVxuXHRcdGNvbnN0IGZhaWxlZGVsZW1lbnQgPSBjc19jYXN0KExhYmVsQW5kRGF0YSwgY2F0LnF1ZXJ5U2VsZWN0b3IoJy5ucl9yZWNvcmRzJykpXG5cdFx0ZmFpbGVkZWxlbWVudC5zZXREYXRhKCcnICsgZGF0YS5mYWlsZWRfcmVjb3Jkcylcblx0XHRjb25zdCBsYXN0X3VwZGF0ZSA9IGNzX2Nhc3QoTGFiZWxBbmREYXRhLCBjYXQucXVlcnlTZWxlY3RvcignLmxhc3RfdXBkYXRlJykpXG5cdFx0Y29uc3QgZGF0ZSA9IG5ldyBEYXRlKGRhdGEuc2Vzc2lvbl9zdGFydF90cylcblx0XHRcdFx0XG5cdFx0Y29uc3QgZGF0ZWZvcm1hdCA9IG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KCdpdC1JVCcsIHtcblx0XHRcdFx0XHR5ZWFyOiAnbnVtZXJpYycsXG5cdFx0XHRcdFx0bW9udGg6ICcyLWRpZ2l0Jyxcblx0XHRcdFx0XHRkYXk6ICcyLWRpZ2l0Jyxcblx0XHRcdFx0XHRob3VyOiAnMi1kaWdpdCcsXG5cdFx0XHRcdFx0bWludXRlOiBcIjItZGlnaXRcIixcblx0XHRcdFx0XHR0aW1lWm9uZTogJ0V1cm9wZS9Sb21lJ1xuXHRcdFx0XHR9KS5mb3JtYXQoZGF0ZSlcblx0XHRsYXN0X3VwZGF0ZS5zZXREYXRhKGRhdGVmb3JtYXQpXG5cdFx0XG5cdFx0Y2F0X25hbWUub25jbGljayA9ICgpID0+IHtcblx0XHRcdGxvY2F0aW9uLmhhc2ggPSAnI3BhZ2U9c3VtbWFyeSZzZXNzaW9uX3N0YXJ0X3RzPScgKyBkYXRhLnNlc3Npb25fc3RhcnRfdHMgKyAnJmRhdGFzZXRfbmFtZT0nICsgZGF0YS5kYXRhc2V0X25hbWUgKyAnJmNhdGVnb3J5X25hbWU9JyArIGRhdGEuY2hlY2tfY2F0ZWdvcnkgK1xuXHRcdFx0XHRcdFx0XHQnJmZhaWxlZF9yZWNvcmRzPScgKyBkYXRhLmZhaWxlZF9yZWNvcmRzICsgJyZ0b3RfcmVjb3Jkcz0nICsgZGF0YS50b3RfcmVjb3JkcyBcblx0XHR9XG5cdFx0XG5cdFx0Y29uc3QgY2F0X2RldGFpbHMgPSAgY3NfY2FzdChIVE1MRWxlbWVudCwgY2F0LnF1ZXJ5U2VsZWN0b3IoJ2RldGFpbHMnKSlcblx0XHRcblx0XHRBUEkzLmxpc3RfX2NhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfY2hlY2tfY2F0ZWdvcnlfY2hlY2tfbmFtZV9mYWlsZWRfcmVjb3JzX3Z3KHtcblx0XHRcdFx0XHRzZXNzaW9uX3N0YXJ0X3RzOiBkYXRhLnNlc3Npb25fc3RhcnRfdHMsXG5cdFx0XHRcdFx0ZGF0YXNldF9uYW1lIDogZGF0YS5kYXRhc2V0X25hbWUsXG5cdFx0XHRcdFx0Y2hlY2tfY2F0ZWdvcnk6IGRhdGEuY2hlY2tfY2F0ZWdvcnlcblx0XHRcdFx0fSkudGhlbigoY2hlY2tzKSA9PiB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coY2hlY2tzKVxuXHRcdFx0XHRcdGZvciAobGV0IGkyID0gMDsgaTIgPCBjaGVja3MubGVuZ3RoOyBpMisrKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG5cdFx0XHRcdFx0XHRkaXYudGV4dENvbnRlbnQgPSBjaGVja3NbaTJdLmNoZWNrX25hbWUgLy8gKyAnICcgKyBjaGVja3NbaTJdLmZhaWxlZF9yZWNvcmRzICsgICcgLyAnICsgY2hlY2tzW2kyXS50b3RfcmVjb3JkcyBcblx0XHRcdFx0XHRcdGNhdF9kZXRhaWxzLmFwcGVuZENoaWxkKGRpdilcblx0XHRcdFx0XHR9XG5cdFx0fSlcblxuXHR9XG5cblx0YXN5bmMgIHNldHVwX2NoYXJ0KGNhdDogSFRNTEVsZW1lbnQsIGFyZzE6IHt0b3RfcmVjb3JkczogbnVtYmVyLCBmYWlsZWRfcmVjb3JkczogbnVtYmVyfSkge1xuXHRcdGF3YWl0IHRoaXMuY29ubmVjdGVkX3Byb21pc2Vcblx0XHRjb25zdCBjaGFydCA9IGNzX2Nhc3QoSFRNTENhbnZhc0VsZW1lbnQsIGNhdC5xdWVyeVNlbGVjdG9yKCcuY2hhcnQnKSk7XG5cdFx0Y29uc3QgY29udGV4dCA9IGNoYXJ0LmdldENvbnRleHQoJzJkJyk7XG5cdFx0XHRcdFx0XHRuZXcgQ2hhcnQoY29udGV4dCwgXHRcdFx0XHR7XG5cdFx0XHRcdFx0XHQgIHR5cGU6ICdkb3VnaG51dCcsXG5cdFx0XHRcdFx0XHQgIGRhdGE6IHtcblx0XHRcdFx0XHRcdCAgICBsYWJlbHM6IFsnb2snLCAnZmFpbCddLFxuXHRcdFx0XHRcdFx0ICAgIGRhdGFzZXRzOiBbXG5cdFx0XHRcdFx0XHQgICAgICB7XG5cdFx0XHRcdFx0XHQgICAgICAgIGxhYmVsOiAnRGF0YXNldCAxJyxcblx0XHRcdFx0XHRcdCAgICAgICAgZGF0YTogW2FyZzEudG90X3JlY29yZHMgLSBhcmcxLmZhaWxlZF9yZWNvcmRzLCBhcmcxLmZhaWxlZF9yZWNvcmRzXSxcblx0XHRcdFx0XHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFsnIzhmOCcsICcjZjg4J11cblx0XHRcdFx0XHRcdCAgICAgIH1cblx0XHRcdFx0XHRcdCAgICBdXG5cdFx0XHRcdFx0XHQgIH0sXG5cdFx0XHRcdFx0XHQgIG9wdGlvbnM6IHtcblx0XHRcdFx0XHRcdCAgICByZXNwb25zaXZlOiB0cnVlLFxuXHRcdFx0XHRcdFx0ICAgIHBsdWdpbnM6IHtcblx0XHRcdFx0XHRcdCAgICAgIGxlZ2VuZDoge1xuXHRcdFx0XHRcdFx0XHRcdGRpc3BsYXk6IGZhbHNlLFxuXHRcdFx0XHRcdFx0ICAgICAgICBwb3NpdGlvbjogJ3RvcCcsXG5cdFx0XHRcdFx0XHQgICAgICB9LFxuXHRcdFx0XHRcdFx0ICAgICAgdGl0bGU6IHtcblx0XHRcdFx0XHRcdCAgICAgICAgZGlzcGxheTogZmFsc2UsXG5cdFx0XHRcdFx0XHQgICAgICAgIHRleHQ6ICdDaGFydC5qcyBEb3VnaG51dCBDaGFydCdcblx0XHRcdFx0XHRcdCAgICAgIH1cblx0XHRcdFx0XHRcdCAgICB9XG5cdFx0XHRcdFx0XHQgIH0sXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQpXG5cdH1cblxuXG59XG5cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgnY3MtZGF0YXNldC1pc3N1ZS1jYXRlZ29yeScsIERhdGFzZXRJc3N1ZUNhdGVnb3J5KVxuIl19