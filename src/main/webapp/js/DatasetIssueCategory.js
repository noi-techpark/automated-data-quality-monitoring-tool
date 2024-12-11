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
							
							details {
								margin-top: 0.4rem;
								margin-bottom: 0.4rem;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YXNldElzc3VlQ2F0ZWdvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90eXBlc2NyaXB0L0RhdGFzZXRJc3N1ZUNhdGVnb3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7R0FHRztBQUdILE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQTtBQUVoRCxPQUFPLEVBQUUsSUFBSSxFQUF3RSxNQUFNLGVBQWUsQ0FBQTtBQUMxRyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sY0FBYyxDQUFBO0FBR3RDLE1BQU0sT0FBTyxvQkFBcUIsU0FBUSxXQUFXO0lBR3BELFFBQVEsQ0FBQTtJQUVSLGlCQUFpQixDQUFBO0lBQ2pCLGNBQWMsR0FBc0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUE7SUFFN0MsUUFBUSxDQUFBO0lBRVIsaUJBQWlCO1FBRWhCLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDeEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUMxQixDQUFDO0lBRUQ7UUFDQyxLQUFLLEVBQUUsQ0FBQTtRQUNQLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDbEUsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFBO1FBQ2pELEtBQUssQ0FBQyxTQUFTLEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0E4RmIsQ0FBQztRQUVOLGNBQWMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUIsSUFBSSxDQUFDLFFBQVEs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O3dCQUNSLFFBQVEsRUFBRSxLQUFLO3FCQUNoQjtvQkFDRCxLQUFLLEVBQUU7d0JBQ0wsT0FBTyxFQUFFLEtBQUs7d0JBQ2QsSUFBSSxFQUFFLHlCQUF5QjtxQkFDaEM7aUJBQ0Y7YUFDRjtTQUNGLENBQ0EsQ0FBQTtJQUNOLENBQUM7Q0FHRDtBQUVELGNBQWMsQ0FBQyxNQUFNLENBQUMsMkJBQTJCLEVBQUUsb0JBQW9CLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAoQykgMjAyNCBDYXRjaCBTb2x2ZSBkaSBEYXZpZGUgTW9udGVzaW5cbiAqIExpY2Vuc2U6IEFHUExcbiAqL1xuXG5pbXBvcnQgQ2hhcnQgPSByZXF1aXJlKFwiY2hhcnQuanNcIilcbmltcG9ydCB7IExhYmVsQW5kRGF0YSB9IGZyb20gXCIuL0xhYmVsQW5kRGF0YS5qc1wiXG5pbXBvcnQgeyBMb2FkZXIgfSBmcm9tIFwiLi9Mb2FkZXIuanNcIlxuaW1wb3J0IHsgQVBJMywgY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9jaGVja19jYXRlZ29yeV9mYWlsZWRfcmVjb3JzX3Z3X19yb3cgfSBmcm9tIFwiLi9hcGkvYXBpMy5qc1wiXG5pbXBvcnQgeyBjc19jYXN0IH0gZnJvbSBcIi4vcXVhbGl0eS5qc1wiXG5cblxuZXhwb3J0IGNsYXNzIERhdGFzZXRJc3N1ZUNhdGVnb3J5IGV4dGVuZHMgSFRNTEVsZW1lbnRcbntcblx0XG5cdHRlbXBsYXRlXG5cdFxuXHRjb25uZWN0ZWRfcHJvbWlzZVxuXHRjb25uZWN0ZWRfZnVuYzogKHM6IG51bGwpID0+IHZvaWQgPSBzID0+IG51bGxcblx0XG5cdG1vcmVfZGl2XG5cdFxuXHRjb25uZWN0ZWRDYWxsYmFjaygpXG5cdHtcblx0XHRjb25zb2xlLmxvZygnY29ubmVjdGVkJylcblx0XHR0aGlzLmNvbm5lY3RlZF9mdW5jKG51bGwpXG5cdH1cblx0XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKClcblx0XHR0aGlzLmNvbm5lY3RlZF9wcm9taXNlID0gbmV3IFByb21pc2UocyA9PiB0aGlzLmNvbm5lY3RlZF9mdW5jID0gcylcblx0XHRjb25zdCBzcm9vdCA9IHRoaXMuYXR0YWNoU2hhZG93KHsgbW9kZTogJ29wZW4nIH0pXG5cdFx0c3Jvb3QuaW5uZXJIVE1MID0gYFxuXHRcdFx0XHRcdFx0PHN0eWxlPlxuXHRcdFx0XHRcdFx0XHQ6aG9zdCB7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0LmNhdGVnb3J5IHtcblx0XHRcdFx0XHRcdFx0XHRib3JkZXI6IDFweCBzb2xpZCBncmF5O1xuXHRcdFx0XHRcdFx0XHRcdHdpZHRoOiAxMnJlbTtcblx0XHRcdFx0XHRcdFx0XHRkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG5cdFx0XHRcdFx0XHRcdFx0bWFyZ2luOiAxcmVtO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdC5jYXRlZ29yeSA+IGltZyB7XG5cdFx0XHRcdFx0XHRcdFx0d2lkdGg6IDEwMCU7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0LmNhdGVnb3J5IC5jYXRlZ29yeV9uYW1lIHtcblx0XHRcdFx0XHRcdFx0XHRmb250LXdlaWdodDogYm9sZDtcblx0XHRcdFx0XHRcdFx0XHR0ZXh0LWFsaWduOiBjZW50ZXI7XG5cdFx0XHRcdFx0XHRcdFx0bWFyZ2luLXRvcDogMC40cmVtO1xuXHRcdFx0XHRcdFx0XHRcdG1hcmdpbi1ib3R0b206IDAuNHJlbTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHQuZnJhbWUge1xuXHRcdFx0XHRcdFx0XHRcdGRpc3BsYXk6IGZsZXhcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHQuZnJhbWUgLmNvbnRlbnQge1xuXHRcdFx0XHRcdFx0XHRcdGZsZXgtZ3JvdzogMTAwO1xuXHRcdFx0XHRcdFx0XHRcdGRpc3BsYXk6IGZsZXg7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0LmNoYXJ0ZGl2IHtcblx0XHRcdFx0XHRcdFx0XHR3aWR0aDogIDEwMHB4O1xuXHRcdFx0XHRcdFx0XHRcdGhlaWdodDogMTAwcHg7XG5cdFx0XHRcdFx0XHRcdFx0bWFyZ2luOiBhdXRvO1xuXHRcdFx0XHRcdFx0XHRcdHBvc2l0aW9uOiByZWxhdGl2ZTtcblx0XHRcdFx0XHRcdFx0XHRtYXJnaW4tdG9wOiAwLjRyZW07XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdC5jaGFydGRpdiAucGVyYyB7XG5cdFx0XHRcdFx0XHRcdFx0cG9zaXRpb246IGFic29sdXRlO1xuXHRcdFx0XHRcdFx0XHRcdHRvcDogIGNhbGMoNTAlIC0gMC44cmVtKTtcblx0XHRcdFx0XHRcdFx0XHRsZWZ0OiBjYWxjKDUwJSAtIDEuNnJlbSk7XG5cdFx0XHRcdFx0XHRcdFx0Zm9udC1zaXplOiAxLjVyZW07XG5cdFx0XHRcdFx0XHRcdFx0Zm9udC13ZWlnaHQ6IGJvbGQ7XG5cdFx0XHRcdFx0XHRcdFx0Y29sb3I6ICMwMDA7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdGRldGFpbHMge1xuXHRcdFx0XHRcdFx0XHRcdG1hcmdpbi10b3A6IDAuNHJlbTtcblx0XHRcdFx0XHRcdFx0XHRtYXJnaW4tYm90dG9tOiAwLjRyZW07XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdGRldGFpbHMgPiAqOm50aC1jaGlsZChldmVuKSB7XG5cdFx0XHRcdFx0XHRcdCAgYmFja2dyb3VuZC1jb2xvcjogI2NjYztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0LnZpZXdfZGV0YWlscyB7XG5cdFx0XHRcdFx0XHRcdFx0YmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZGFyay1iYWNrZ3JvdW5kKTtcblx0XHRcdFx0XHRcdFx0XHRjb2xvcjogI2RkZDtcblx0XHRcdFx0XHRcdFx0XHR0ZXh0LWFsaWduOiBjZW50ZXI7XG5cdFx0XHRcdFx0XHRcdFx0cGFkZGluZzogMC42cmVtO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0Lmxhc3R1cGRhdGUge1xuXHRcdFx0XHRcdFx0XHRcdG1hcmdpbi10b3A6IDAuNHJlbTtcblx0XHRcdFx0XHRcdFx0XHRmb250LXNpemU6IDAuN3JlbTtcblx0XHRcdFx0XHRcdFx0XHRtYXJnaW4tYm90dG9tOiAwLjRyZW07XG5cdFx0XHRcdFx0XHRcdFx0bWFyZ2luLWxlZnQ6IDAuNHJlbTtcblx0XHRcdFx0XHRcdFx0XHRtYXJnaW4tcmlnaHQ6IDAuNHJlbTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0Lm5yX3JlY29yZHMsIGRldGFpbHMge1xuXHRcdFx0XHRcdFx0XHRcdG1hcmdpbi1sZWZ0OiAwLjRyZW07XG5cdFx0XHRcdFx0XHRcdFx0bWFyZ2luLXJpZ2h0OiAwLjRyZW07XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0PC9zdHlsZT5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjYXRlZ29yeVwiPlxuXHRcdFx0XHRcdFx0XHQ8IS0tIDxpbWcgc3JjPVwia3BpLXBpZS1jaGFydC5wbmdcIj4gLS0+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjaGFydGRpdlwiPlxuXHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwZXJjXCI+MTIlPC9kaXY+XG5cdFx0XHRcdFx0XHRcdFx0PGNhbnZhcyBjbGFzcz1cImNoYXJ0XCI+PC9jYW52YXM+XG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY2F0ZWdvcnlfbmFtZVwiPkNvbXBsZXRlbmVzczwvZGl2PlxuXHRcdFx0XHRcdFx0XHQ8c3Bhbj48L3NwYW4+XG5cdFx0XHRcdFx0XHRcdDxjcy1sYWJlbC1hbmQtZGF0YSBsYWJlbD1cImZhaWxlZCByZWNzXCIgY2xhc3M9XCJucl9yZWNvcmRzXCI+PC9jcy1sYWJlbC1hbmQtZGF0YT5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImxhc3R1cGRhdGVcIj5cblx0XHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzcz1cImRhdGFcIj48L3NwYW4+XG5cdFx0XHRcdFx0XHRcdFx0PHNwYW4+PC9zcGFuPlxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0PCEtLSA8ZGl2IGNsYXNzPVwibnJfcmVjb3Jkc1wiPjEyMzwvZGl2PiAtLT5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm1vcmVcIj5cblx0XHRcdFx0XHRcdFx0XHQ8ZGV0YWlscz5cblx0XHRcdFx0XHRcdFx0XHRcdDxzdW1tYXJ5PmZhaWxlZCBjaGVjayBsaXN0PC9zdW1tYXJ5PlxuXHRcdFx0XHRcdFx0XHRcdDwvZGV0YWlscz5cblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwidmlld19kZXRhaWxzXCI+VmlldyBkZXRhaWxzPC9kaXY+XG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRgO1xuXG5cdFx0Y3VzdG9tRWxlbWVudHMudXBncmFkZShzcm9vdCk7XG5cdFx0dGhpcy50ZW1wbGF0ZSA9IGNzX2Nhc3QoSFRNTEVsZW1lbnQsIHNyb290LnF1ZXJ5U2VsZWN0b3IoJy5jYXRlZ29yeScpKTtcblx0XHR0aGlzLm1vcmVfZGl2ID0gY3NfY2FzdChIVE1MRWxlbWVudCwgc3Jvb3QucXVlcnlTZWxlY3RvcignLm1vcmUnKSk7XG5cdH1cblx0XG5cdGhpZGVNb3JlRGl2KCkgIHtcblx0XHR0aGlzLm1vcmVfZGl2LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcblx0fVxuXHRcblx0YXN5bmMgcmVmcmVzaChkYXRhOiB7ZGF0YXNldF9uYW1lOiBzdHJpbmcsIHRvdF9yZWNvcmRzOiBudW1iZXIsIGZhaWxlZF9yZWNvcmRzOiBudW1iZXIsIGNoZWNrX2NhdGVnb3J5OiBzdHJpbmcsIHNlc3Npb25fc3RhcnRfdHM6IHN0cmluZ30pXG5cdHtcblxuXHRcdGNvbnN0IGNhdCA9IHRoaXMudGVtcGxhdGVcblx0XHR0aGlzLnNldHVwX2NoYXJ0KGNhdCwgZGF0YSlcblx0XHRjb25zdCBjYXRfbmFtZSA9IGNzX2Nhc3QoSFRNTEVsZW1lbnQsIGNhdC5xdWVyeVNlbGVjdG9yKCcuY2F0ZWdvcnlfbmFtZScpKVxuXHRcdGNhdF9uYW1lLnRleHRDb250ZW50ID0gZGF0YS5jaGVja19jYXRlZ29yeVxuXHRcdGNvbnN0IGZhaWxlZGVsZW1lbnQgPSBjc19jYXN0KExhYmVsQW5kRGF0YSwgY2F0LnF1ZXJ5U2VsZWN0b3IoJy5ucl9yZWNvcmRzJykpXG5cdFx0ZmFpbGVkZWxlbWVudC5zZXREYXRhKCcnICsgZGF0YS5mYWlsZWRfcmVjb3Jkcylcblx0XHRjb25zdCBsYXN0X3VwZGF0ZSA9IGNzX2Nhc3QoSFRNTFNwYW5FbGVtZW50LCBjYXQucXVlcnlTZWxlY3RvcignLmxhc3R1cGRhdGUgLmRhdGEnKSlcblx0XHRjb25zdCBkYXRlID0gbmV3IERhdGUoZGF0YS5zZXNzaW9uX3N0YXJ0X3RzKVxuXHRcdFxuXHRcdGNvbnN0IHBlcmMgPSBjc19jYXN0KEhUTUxFbGVtZW50LCBjYXQucXVlcnlTZWxlY3RvcignLnBlcmMnKSlcblx0XHRwZXJjLnRleHRDb250ZW50ID0gJycgKyAoZGF0YS5mYWlsZWRfcmVjb3JkcyAqIDEwMCAvIGRhdGEudG90X3JlY29yZHMpXG5cdFx0XHRcdFxuXHRcdGNvbnN0IGRhdGVmb3JtYXQgPSBuZXcgSW50bC5EYXRlVGltZUZvcm1hdCgnaXQtSVQnLCB7XG5cdFx0XHRcdFx0eWVhcjogJ251bWVyaWMnLFxuXHRcdFx0XHRcdG1vbnRoOiAnMi1kaWdpdCcsXG5cdFx0XHRcdFx0ZGF5OiAnMi1kaWdpdCcsXG5cdFx0XHRcdFx0aG91cjogJzItZGlnaXQnLFxuXHRcdFx0XHRcdG1pbnV0ZTogXCIyLWRpZ2l0XCIsXG5cdFx0XHRcdFx0dGltZVpvbmU6ICdFdXJvcGUvUm9tZSdcblx0XHRcdFx0fSkuZm9ybWF0KGRhdGUpXG5cblx0XHRsYXN0X3VwZGF0ZS50ZXh0Q29udGVudCA9IGRhdGVmb3JtYXRcblxuXHRcdGNvbnN0IHZpZXdfZGV0YWlscyA9IGNzX2Nhc3QoSFRNTEVsZW1lbnQsIGNhdC5xdWVyeVNlbGVjdG9yKCcudmlld19kZXRhaWxzJykpXG5cdFx0XG5cdFx0dmlld19kZXRhaWxzLm9uY2xpY2sgPSAoKSA9PiB7XG5cdFx0XHRsb2NhdGlvbi5oYXNoID0gJyNwYWdlPXN1bW1hcnkmc2Vzc2lvbl9zdGFydF90cz0nICsgZGF0YS5zZXNzaW9uX3N0YXJ0X3RzICsgJyZkYXRhc2V0X25hbWU9JyArIGRhdGEuZGF0YXNldF9uYW1lICsgJyZjYXRlZ29yeV9uYW1lPScgKyBkYXRhLmNoZWNrX2NhdGVnb3J5ICtcblx0XHRcdFx0XHRcdFx0JyZmYWlsZWRfcmVjb3Jkcz0nICsgZGF0YS5mYWlsZWRfcmVjb3JkcyArICcmdG90X3JlY29yZHM9JyArIGRhdGEudG90X3JlY29yZHMgXG5cdFx0fVxuXHRcdFxuXHRcdGNvbnN0IGNhdF9kZXRhaWxzID0gIGNzX2Nhc3QoSFRNTEVsZW1lbnQsIGNhdC5xdWVyeVNlbGVjdG9yKCdkZXRhaWxzJykpXG5cdFx0XG5cdFx0QVBJMy5saXN0X19jYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X2NoZWNrX2NhdGVnb3J5X2NoZWNrX25hbWVfZmFpbGVkX3JlY29yc192dyh7XG5cdFx0XHRcdFx0c2Vzc2lvbl9zdGFydF90czogZGF0YS5zZXNzaW9uX3N0YXJ0X3RzLFxuXHRcdFx0XHRcdGRhdGFzZXRfbmFtZSA6IGRhdGEuZGF0YXNldF9uYW1lLFxuXHRcdFx0XHRcdGNoZWNrX2NhdGVnb3J5OiBkYXRhLmNoZWNrX2NhdGVnb3J5XG5cdFx0XHRcdH0pLnRoZW4oKGNoZWNrcykgPT4ge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGNoZWNrcylcblx0XHRcdFx0XHRmb3IgKGxldCBpMiA9IDA7IGkyIDwgY2hlY2tzLmxlbmd0aDsgaTIrKylcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXHRcdFx0XHRcdFx0ZGl2LnRleHRDb250ZW50ID0gY2hlY2tzW2kyXS5jaGVja19uYW1lIC8vICsgJyAnICsgY2hlY2tzW2kyXS5mYWlsZWRfcmVjb3JkcyArICAnIC8gJyArIGNoZWNrc1tpMl0udG90X3JlY29yZHMgXG5cdFx0XHRcdFx0XHRjYXRfZGV0YWlscy5hcHBlbmRDaGlsZChkaXYpXG5cdFx0XHRcdFx0fVxuXHRcdH0pXG5cblx0fVxuXG5cdGFzeW5jICBzZXR1cF9jaGFydChjYXQ6IEhUTUxFbGVtZW50LCBhcmcxOiB7dG90X3JlY29yZHM6IG51bWJlciwgZmFpbGVkX3JlY29yZHM6IG51bWJlcn0pIHtcblx0XHRhd2FpdCB0aGlzLmNvbm5lY3RlZF9wcm9taXNlXG5cdFx0Y29uc3QgY2hhcnQgPSBjc19jYXN0KEhUTUxDYW52YXNFbGVtZW50LCBjYXQucXVlcnlTZWxlY3RvcignLmNoYXJ0JykpO1xuXHRcdC8vIGNvbnN0IGNvbnRleHQgPSBjaGFydC5nZXRDb250ZXh0KCcyZCcpO1xuXHRcdFx0XHRcdFx0bmV3IENoYXJ0KGNoYXJ0LCBcdFx0XHRcdHtcblx0XHRcdFx0XHRcdCAgdHlwZTogJ2RvdWdobnV0Jyxcblx0XHRcdFx0XHRcdCAgZGF0YToge1xuXHRcdFx0XHRcdFx0ICAgIGxhYmVsczogWydvaycsICdmYWlsJ10sXG5cdFx0XHRcdFx0XHQgICAgZGF0YXNldHM6IFtcblx0XHRcdFx0XHRcdCAgICAgIHtcblx0XHRcdFx0XHRcdCAgICAgICAgbGFiZWw6ICdEYXRhc2V0IDEnLFxuXHRcdFx0XHRcdFx0ICAgICAgICBkYXRhOiBbYXJnMS5mYWlsZWRfcmVjb3JkcywgYXJnMS50b3RfcmVjb3JkcyAtIGFyZzEuZmFpbGVkX3JlY29yZHMsIF0sXG5cdFx0XHRcdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiBbJyMyMjInLCAnI2ZmZiddXG5cdFx0XHRcdFx0XHQgICAgICB9XG5cdFx0XHRcdFx0XHQgICAgXVxuXHRcdFx0XHRcdFx0ICB9LFxuXHRcdFx0XHRcdFx0ICBvcHRpb25zOiB7XG5cdFx0XHRcdFx0XHRcdGN1dG91dDogJzgwJScsXG5cdFx0XHRcdFx0XHQgICAgcmVzcG9uc2l2ZTogdHJ1ZSxcblx0XHRcdFx0XHRcdCAgICBwbHVnaW5zOiB7XG5cdFx0XHRcdFx0XHQgICAgICBsZWdlbmQ6IHtcblx0XHRcdFx0XHRcdFx0XHRkaXNwbGF5OiBmYWxzZSxcblx0XHRcdFx0XHRcdCAgICAgICAgcG9zaXRpb246ICd0b3AnLFxuXHRcdFx0XHRcdFx0ICAgICAgfSxcblx0XHRcdFx0XHRcdCAgICAgIHRpdGxlOiB7XG5cdFx0XHRcdFx0XHQgICAgICAgIGRpc3BsYXk6IGZhbHNlLFxuXHRcdFx0XHRcdFx0ICAgICAgICB0ZXh0OiAnQ2hhcnQuanMgRG91Z2hudXQgQ2hhcnQnXG5cdFx0XHRcdFx0XHQgICAgICB9XG5cdFx0XHRcdFx0XHQgICAgfVxuXHRcdFx0XHRcdFx0ICB9LFxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0KVxuXHR9XG5cblxufVxuXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ2NzLWRhdGFzZXQtaXNzdWUtY2F0ZWdvcnknLCBEYXRhc2V0SXNzdWVDYXRlZ29yeSlcbiJdfQ==