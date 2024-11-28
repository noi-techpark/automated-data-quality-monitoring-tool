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
        // const context = chart.getContext('2d');
        new Chart(chart, {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YXNldElzc3VlQ2F0ZWdvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90eXBlc2NyaXB0L0RhdGFzZXRJc3N1ZUNhdGVnb3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7R0FHRztBQUdILE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQTtBQUVoRCxPQUFPLEVBQUUsSUFBSSxFQUF3RSxNQUFNLGVBQWUsQ0FBQTtBQUMxRyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sY0FBYyxDQUFBO0FBR3RDLE1BQU0sT0FBTyxvQkFBcUIsU0FBUSxXQUFXO0lBR3BELFFBQVEsQ0FBQTtJQUVSLGlCQUFpQixDQUFBO0lBQ2pCLGNBQWMsR0FBc0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUE7SUFFN0MsaUJBQWlCO1FBRWhCLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDeEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUMxQixDQUFDO0lBRUQ7UUFDQyxLQUFLLEVBQUUsQ0FBQTtRQUNQLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDbEUsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFBO1FBQ2pELEtBQUssQ0FBQyxTQUFTLEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0E4Q2IsQ0FBQztRQUVOLGNBQWMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FB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QztRQUN0RSwwQ0FBMEM7UUFDdEMsSUFBSSxLQUFLLENBQUMsS0FBSyxFQUFNO1lBQ25CLElBQUksRUFBRSxVQUFVO1lBQ2hCLElBQUksRUFBRTtnQkFDSixNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDO2dCQUN0QixRQUFRLEVBQUU7b0JBQ1I7d0JBQ0UsS0FBSyxFQUFFLFdBQVc7d0JBQ2xCLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDO3dCQUN6RSxlQUFlLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO3FCQUM1QjtpQkFDRjthQUNGO1lBQ0QsT0FBTyxFQUFFO2dCQUNQLFVBQVUsRUFBRSxJQUFJO2dCQUNoQixPQUFPLEVBQUU7b0JBQ1AsTUFBTSxFQUFFO3dCQUNaLE9BQU8sRUFBRSxLQUFLO3dCQUNSLFFBQVEsRUFBRSxLQUFLO3FCQUNoQjtvQkFDRCxLQUFLLEVBQUU7d0JBQ0wsT0FBTyxFQUFFLEtBQUs7d0JBQ2QsSUFBSSxFQUFFLHlCQUF5QjtxQkFDaEM7aUJBQ0Y7YUFDRjtTQUNGLENBQ0EsQ0FBQTtJQUNOLENBQUM7Q0FHRDtBQUVELGNBQWMsQ0FBQyxNQUFNLENBQUMsMkJBQTJCLEVBQUUsb0JBQW9CLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAoQykgMjAyNCBDYXRjaCBTb2x2ZSBkaSBEYXZpZGUgTW9udGVzaW5cbiAqIExpY2Vuc2U6IEFHUExcbiAqL1xuXG5pbXBvcnQgQ2hhcnQgPSByZXF1aXJlKFwiY2hhcnQuanNcIilcbmltcG9ydCB7IExhYmVsQW5kRGF0YSB9IGZyb20gXCIuL0xhYmVsQW5kRGF0YS5qc1wiXG5pbXBvcnQgeyBMb2FkZXIgfSBmcm9tIFwiLi9Mb2FkZXIuanNcIlxuaW1wb3J0IHsgQVBJMywgY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9jaGVja19jYXRlZ29yeV9mYWlsZWRfcmVjb3JzX3Z3X19yb3cgfSBmcm9tIFwiLi9hcGkvYXBpMy5qc1wiXG5pbXBvcnQgeyBjc19jYXN0IH0gZnJvbSBcIi4vcXVhbGl0eS5qc1wiXG5cblxuZXhwb3J0IGNsYXNzIERhdGFzZXRJc3N1ZUNhdGVnb3J5IGV4dGVuZHMgSFRNTEVsZW1lbnRcbntcblx0XG5cdHRlbXBsYXRlXG5cdFxuXHRjb25uZWN0ZWRfcHJvbWlzZVxuXHRjb25uZWN0ZWRfZnVuYzogKHM6IG51bGwpID0+IHZvaWQgPSBzID0+IG51bGxcblx0XG5cdGNvbm5lY3RlZENhbGxiYWNrKClcblx0e1xuXHRcdGNvbnNvbGUubG9nKCdjb25uZWN0ZWQnKVxuXHRcdHRoaXMuY29ubmVjdGVkX2Z1bmMobnVsbClcblx0fVxuXHRcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKVxuXHRcdHRoaXMuY29ubmVjdGVkX3Byb21pc2UgPSBuZXcgUHJvbWlzZShzID0+IHRoaXMuY29ubmVjdGVkX2Z1bmMgPSBzKVxuXHRcdGNvbnN0IHNyb290ID0gdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSlcblx0XHRzcm9vdC5pbm5lckhUTUwgPSBgXG5cdFx0XHRcdFx0XHQ8c3R5bGU+XG5cdFx0XHRcdFx0XHRcdDpob3N0IHtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHQuY2F0ZWdvcnkge1xuXHRcdFx0XHRcdFx0XHRcdGJvcmRlcjogMXB4IHNvbGlkIGdyYXk7XG5cdFx0XHRcdFx0XHRcdFx0d2lkdGg6IDEycmVtO1xuXHRcdFx0XHRcdFx0XHRcdGRpc3BsYXk6IGlubGluZS1ibG9jaztcblx0XHRcdFx0XHRcdFx0XHRtYXJnaW46IDFyZW07XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0LmNhdGVnb3J5ID4gaW1nIHtcblx0XHRcdFx0XHRcdFx0XHR3aWR0aDogMTAwJTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHQuY2F0ZWdvcnkgLmNhdGVnb3J5X25hbWUge1xuXHRcdFx0XHRcdFx0XHRcdGZvbnQtd2VpZ2h0OiBib2xkO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdC5mcmFtZSB7XG5cdFx0XHRcdFx0XHRcdFx0ZGlzcGxheTogZmxleFxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdC5mcmFtZSAuY29udGVudCB7XG5cdFx0XHRcdFx0XHRcdFx0ZmxleC1ncm93OiAxMDA7XG5cdFx0XHRcdFx0XHRcdFx0ZGlzcGxheTogZmxleDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHQuY2hhcnRkaXYge1xuXHRcdFx0XHRcdFx0XHRcdHdpZHRoOiAgMTAwcHg7XG5cdFx0XHRcdFx0XHRcdFx0aGVpZ2h0OiAxMDBweDtcblx0XHRcdFx0XHRcdFx0XHRtYXJnaW46IGF1dG87XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0ZGV0YWlscyA+ICo6bnRoLWNoaWxkKGV2ZW4pIHtcblx0XHRcdFx0XHRcdFx0ICBiYWNrZ3JvdW5kLWNvbG9yOiAjY2NjO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQ8L3N0eWxlPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNhdGVnb3J5XCI+XG5cdFx0XHRcdFx0XHRcdDwhLS0gPGltZyBzcmM9XCJrcGktcGllLWNoYXJ0LnBuZ1wiPiAtLT5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNoYXJ0ZGl2XCI+XG5cdFx0XHRcdFx0XHRcdFx0PGNhbnZhcyBjbGFzcz1cImNoYXJ0XCI+PC9jYW52YXM+XG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY2F0ZWdvcnlfbmFtZVwiPkNvbXBsZXRlbmVzczwvZGl2PlxuXHRcdFx0XHRcdFx0XHQ8c3Bhbj48L3NwYW4+XG5cdFx0XHRcdFx0XHRcdDxjcy1sYWJlbC1hbmQtZGF0YSBsYWJlbD1cImZhaWxlZCByZWNzXCIgY2xhc3M9XCJucl9yZWNvcmRzXCI+PC9jcy1sYWJlbC1hbmQtZGF0YT5cblx0XHRcdFx0XHRcdFx0PGNzLWxhYmVsLWFuZC1kYXRhIGxhYmVsPVwibGFzdCB1cGRhdGVcIiBjbGFzcz1cImxhc3RfdXBkYXRlXCI+PC9jcy1sYWJlbC1hbmQtZGF0YT5cblx0XHRcdFx0XHRcdFx0PCEtLSA8ZGl2IGNsYXNzPVwibnJfcmVjb3Jkc1wiPjEyMzwvZGl2PiAtLT5cblx0XHRcdFx0XHRcdFx0PGRldGFpbHM+XG5cdFx0XHRcdFx0XHRcdFx0PHN1bW1hcnk+ZmFpbGVkIGNoZWNrIGxpc3Q8L3N1bW1hcnk+XG5cdFx0XHRcdFx0XHRcdDwvZGV0YWlscz5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0YDtcblxuXHRcdGN1c3RvbUVsZW1lbnRzLnVwZ3JhZGUoc3Jvb3QpO1xuXHRcdHRoaXMudGVtcGxhdGUgPSBjc19jYXN0KEhUTUxFbGVtZW50LCBzcm9vdC5xdWVyeVNlbGVjdG9yKCcuY2F0ZWdvcnknKSk7XG5cdH1cblx0XG5cdGFzeW5jIHJlZnJlc2goZGF0YToge2RhdGFzZXRfbmFtZTogc3RyaW5nLCB0b3RfcmVjb3JkczogbnVtYmVyLCBmYWlsZWRfcmVjb3JkczogbnVtYmVyLCBjaGVja19jYXRlZ29yeTogc3RyaW5nLCBzZXNzaW9uX3N0YXJ0X3RzOiBzdHJpbmd9KVxuXHR7XG5cblx0XHRjb25zdCBjYXQgPSB0aGlzLnRlbXBsYXRlXG5cdFx0dGhpcy5zZXR1cF9jaGFydChjYXQsIGRhdGEpXG5cdFx0Y29uc3QgY2F0X25hbWUgPSBjc19jYXN0KEhUTUxFbGVtZW50LCBjYXQucXVlcnlTZWxlY3RvcignLmNhdGVnb3J5X25hbWUnKSlcblx0XHRjYXRfbmFtZS50ZXh0Q29udGVudCA9IGRhdGEuY2hlY2tfY2F0ZWdvcnlcblx0XHRjb25zdCBmYWlsZWRlbGVtZW50ID0gY3NfY2FzdChMYWJlbEFuZERhdGEsIGNhdC5xdWVyeVNlbGVjdG9yKCcubnJfcmVjb3JkcycpKVxuXHRcdGZhaWxlZGVsZW1lbnQuc2V0RGF0YSgnJyArIGRhdGEuZmFpbGVkX3JlY29yZHMpXG5cdFx0Y29uc3QgbGFzdF91cGRhdGUgPSBjc19jYXN0KExhYmVsQW5kRGF0YSwgY2F0LnF1ZXJ5U2VsZWN0b3IoJy5sYXN0X3VwZGF0ZScpKVxuXHRcdGNvbnN0IGRhdGUgPSBuZXcgRGF0ZShkYXRhLnNlc3Npb25fc3RhcnRfdHMpXG5cdFx0XHRcdFxuXHRcdGNvbnN0IGRhdGVmb3JtYXQgPSBuZXcgSW50bC5EYXRlVGltZUZvcm1hdCgnaXQtSVQnLCB7XG5cdFx0XHRcdFx0eWVhcjogJ251bWVyaWMnLFxuXHRcdFx0XHRcdG1vbnRoOiAnMi1kaWdpdCcsXG5cdFx0XHRcdFx0ZGF5OiAnMi1kaWdpdCcsXG5cdFx0XHRcdFx0aG91cjogJzItZGlnaXQnLFxuXHRcdFx0XHRcdG1pbnV0ZTogXCIyLWRpZ2l0XCIsXG5cdFx0XHRcdFx0dGltZVpvbmU6ICdFdXJvcGUvUm9tZSdcblx0XHRcdFx0fSkuZm9ybWF0KGRhdGUpXG5cdFx0bGFzdF91cGRhdGUuc2V0RGF0YShkYXRlZm9ybWF0KVxuXHRcdFxuXHRcdGNhdF9uYW1lLm9uY2xpY2sgPSAoKSA9PiB7XG5cdFx0XHRsb2NhdGlvbi5oYXNoID0gJyNwYWdlPXN1bW1hcnkmc2Vzc2lvbl9zdGFydF90cz0nICsgZGF0YS5zZXNzaW9uX3N0YXJ0X3RzICsgJyZkYXRhc2V0X25hbWU9JyArIGRhdGEuZGF0YXNldF9uYW1lICsgJyZjYXRlZ29yeV9uYW1lPScgKyBkYXRhLmNoZWNrX2NhdGVnb3J5ICtcblx0XHRcdFx0XHRcdFx0JyZmYWlsZWRfcmVjb3Jkcz0nICsgZGF0YS5mYWlsZWRfcmVjb3JkcyArICcmdG90X3JlY29yZHM9JyArIGRhdGEudG90X3JlY29yZHMgXG5cdFx0fVxuXHRcdFxuXHRcdGNvbnN0IGNhdF9kZXRhaWxzID0gIGNzX2Nhc3QoSFRNTEVsZW1lbnQsIGNhdC5xdWVyeVNlbGVjdG9yKCdkZXRhaWxzJykpXG5cdFx0XG5cdFx0QVBJMy5saXN0X19jYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X2NoZWNrX2NhdGVnb3J5X2NoZWNrX25hbWVfZmFpbGVkX3JlY29yc192dyh7XG5cdFx0XHRcdFx0c2Vzc2lvbl9zdGFydF90czogZGF0YS5zZXNzaW9uX3N0YXJ0X3RzLFxuXHRcdFx0XHRcdGRhdGFzZXRfbmFtZSA6IGRhdGEuZGF0YXNldF9uYW1lLFxuXHRcdFx0XHRcdGNoZWNrX2NhdGVnb3J5OiBkYXRhLmNoZWNrX2NhdGVnb3J5XG5cdFx0XHRcdH0pLnRoZW4oKGNoZWNrcykgPT4ge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGNoZWNrcylcblx0XHRcdFx0XHRmb3IgKGxldCBpMiA9IDA7IGkyIDwgY2hlY2tzLmxlbmd0aDsgaTIrKylcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXHRcdFx0XHRcdFx0ZGl2LnRleHRDb250ZW50ID0gY2hlY2tzW2kyXS5jaGVja19uYW1lIC8vICsgJyAnICsgY2hlY2tzW2kyXS5mYWlsZWRfcmVjb3JkcyArICAnIC8gJyArIGNoZWNrc1tpMl0udG90X3JlY29yZHMgXG5cdFx0XHRcdFx0XHRjYXRfZGV0YWlscy5hcHBlbmRDaGlsZChkaXYpXG5cdFx0XHRcdFx0fVxuXHRcdH0pXG5cblx0fVxuXG5cdGFzeW5jICBzZXR1cF9jaGFydChjYXQ6IEhUTUxFbGVtZW50LCBhcmcxOiB7dG90X3JlY29yZHM6IG51bWJlciwgZmFpbGVkX3JlY29yZHM6IG51bWJlcn0pIHtcblx0XHRhd2FpdCB0aGlzLmNvbm5lY3RlZF9wcm9taXNlXG5cdFx0Y29uc3QgY2hhcnQgPSBjc19jYXN0KEhUTUxDYW52YXNFbGVtZW50LCBjYXQucXVlcnlTZWxlY3RvcignLmNoYXJ0JykpO1xuXHRcdC8vIGNvbnN0IGNvbnRleHQgPSBjaGFydC5nZXRDb250ZXh0KCcyZCcpO1xuXHRcdFx0XHRcdFx0bmV3IENoYXJ0KGNoYXJ0LCBcdFx0XHRcdHtcblx0XHRcdFx0XHRcdCAgdHlwZTogJ2RvdWdobnV0Jyxcblx0XHRcdFx0XHRcdCAgZGF0YToge1xuXHRcdFx0XHRcdFx0ICAgIGxhYmVsczogWydvaycsICdmYWlsJ10sXG5cdFx0XHRcdFx0XHQgICAgZGF0YXNldHM6IFtcblx0XHRcdFx0XHRcdCAgICAgIHtcblx0XHRcdFx0XHRcdCAgICAgICAgbGFiZWw6ICdEYXRhc2V0IDEnLFxuXHRcdFx0XHRcdFx0ICAgICAgICBkYXRhOiBbYXJnMS50b3RfcmVjb3JkcyAtIGFyZzEuZmFpbGVkX3JlY29yZHMsIGFyZzEuZmFpbGVkX3JlY29yZHNdLFxuXHRcdFx0XHRcdFx0XHRcdGJhY2tncm91bmRDb2xvcjogWycjOGY4JywgJyNmODgnXVxuXHRcdFx0XHRcdFx0ICAgICAgfVxuXHRcdFx0XHRcdFx0ICAgIF1cblx0XHRcdFx0XHRcdCAgfSxcblx0XHRcdFx0XHRcdCAgb3B0aW9uczoge1xuXHRcdFx0XHRcdFx0ICAgIHJlc3BvbnNpdmU6IHRydWUsXG5cdFx0XHRcdFx0XHQgICAgcGx1Z2luczoge1xuXHRcdFx0XHRcdFx0ICAgICAgbGVnZW5kOiB7XG5cdFx0XHRcdFx0XHRcdFx0ZGlzcGxheTogZmFsc2UsXG5cdFx0XHRcdFx0XHQgICAgICAgIHBvc2l0aW9uOiAndG9wJyxcblx0XHRcdFx0XHRcdCAgICAgIH0sXG5cdFx0XHRcdFx0XHQgICAgICB0aXRsZToge1xuXHRcdFx0XHRcdFx0ICAgICAgICBkaXNwbGF5OiBmYWxzZSxcblx0XHRcdFx0XHRcdCAgICAgICAgdGV4dDogJ0NoYXJ0LmpzIERvdWdobnV0IENoYXJ0J1xuXHRcdFx0XHRcdFx0ICAgICAgfVxuXHRcdFx0XHRcdFx0ICAgIH1cblx0XHRcdFx0XHRcdCAgfSxcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdClcblx0fVxuXG5cbn1cblxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCdjcy1kYXRhc2V0LWlzc3VlLWNhdGVnb3J5JywgRGF0YXNldElzc3VlQ2F0ZWdvcnkpXG4iXX0=