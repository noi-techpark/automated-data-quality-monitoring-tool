/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YXNldElzc3VlQ2F0ZWdvcnlDb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90eXBlc2NyaXB0L0RhdGFzZXRJc3N1ZUNhdGVnb3J5Q29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7R0FHRztBQUVILE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQTtBQUNoRCxPQUFPLEVBQUUsSUFBSSxFQUF3RSxNQUFNLGVBQWUsQ0FBQTtBQUMxRyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sY0FBYyxDQUFBO0FBR3RDLE1BQU0sT0FBTyw2QkFBOEIsU0FBUSxXQUFXO0lBRzdELFFBQVEsQ0FBQTtJQUVSLGlCQUFpQixDQUFBO0lBQ2pCLGNBQWMsR0FBc0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUE7SUFFN0MsUUFBUSxDQUFBO0lBRVIsaUJBQWlCO1FBRWhCLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDeEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUMxQixDQUFDO0lBRUQ7UUFDQyxLQUFLLEVBQUUsQ0FBQTtRQUNQLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDbEUsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFBO1FBQ2pELEtBQUssQ0FBQyxTQUFTLEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQXlHYixDQUFDO1FBRU4sY0FBYyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENB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QUNGO1lBQ0QsT0FBTyxFQUFFO2dCQUNWLE1BQU0sRUFBRSxLQUFLO2dCQUNWLFVBQVUsRUFBRSxJQUFJO2dCQUNoQixPQUFPLEVBQUU7b0JBQ1AsTUFBTSxFQUFFO3dCQUNaLE9BQU8sRUFBRSxLQUFLO3dCQUNSLFFBQVEsRUFBRSxLQUFLO3FCQUNoQjtvQkFDRCxLQUFLLEVBQUU7d0JBQ0wsT0FBTyxFQUFFLEtBQUs7d0JBQ2QsSUFBSSxFQUFFLHlCQUF5QjtxQkFDaEM7aUJBQ0Y7YUFDRjtTQUNGLENBQ0EsQ0FBQTtJQUNOLENBQUM7Q0FHRDtBQUVELGNBQWMsQ0FBQyxNQUFNLENBQUMsMkJBQTJCLEVBQUUsNkJBQTZCLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAoQykgMjAyNCBDYXRjaCBTb2x2ZSBkaSBEYXZpZGUgTW9udGVzaW5cbiAqIExpY2Vuc2U6IEFHUExcbiAqL1xuXG5pbXBvcnQgeyBMYWJlbEFuZERhdGEgfSBmcm9tIFwiLi9MYWJlbEFuZERhdGEuanNcIlxuaW1wb3J0IHsgQVBJMywgY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9jaGVja19jYXRlZ29yeV9mYWlsZWRfcmVjb3JzX3Z3X19yb3cgfSBmcm9tIFwiLi9hcGkvYXBpMy5qc1wiXG5pbXBvcnQgeyBjc19jYXN0IH0gZnJvbSBcIi4vcXVhbGl0eS5qc1wiXG5cblxuZXhwb3J0IGNsYXNzIERhdGFzZXRJc3N1ZUNhdGVnb3J5Q29tcG9uZW50IGV4dGVuZHMgSFRNTEVsZW1lbnRcbntcblx0XG5cdHRlbXBsYXRlXG5cdFxuXHRjb25uZWN0ZWRfcHJvbWlzZVxuXHRjb25uZWN0ZWRfZnVuYzogKHM6IG51bGwpID0+IHZvaWQgPSBzID0+IG51bGxcblx0XG5cdG1vcmVfZGl2XG5cdFxuXHRjb25uZWN0ZWRDYWxsYmFjaygpXG5cdHtcblx0XHRjb25zb2xlLmxvZygnY29ubmVjdGVkJylcblx0XHR0aGlzLmNvbm5lY3RlZF9mdW5jKG51bGwpXG5cdH1cblx0XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKClcblx0XHR0aGlzLmNvbm5lY3RlZF9wcm9taXNlID0gbmV3IFByb21pc2UocyA9PiB0aGlzLmNvbm5lY3RlZF9mdW5jID0gcylcblx0XHRjb25zdCBzcm9vdCA9IHRoaXMuYXR0YWNoU2hhZG93KHsgbW9kZTogJ29wZW4nIH0pXG5cdFx0c3Jvb3QuaW5uZXJIVE1MID0gYFxuXHRcdFx0XHRcdFx0PHN0eWxlPlxuXHRcdFx0XHRcdFx0XHQ6aG9zdCB7XG5cdFx0XHRcdFx0XHRcdFx0ZGlzcGxheTogaW5saW5lLWJsb2NrO1xuXHRcdFx0XHRcdFx0XHRcdGJveC1zaGFkb3c6IDRweCA0cHggI2NjYztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHQuY2F0ZWdvcnkge1xuXHRcdFx0XHRcdFx0XHRcdGJvcmRlcjogMXB4IHNvbGlkIGdyYXk7XG5cdFx0XHRcdFx0XHRcdFx0d2lkdGg6IDEycmVtO1xuXHRcdFx0XHRcdFx0XHRcdGRpc3BsYXk6IGlubGluZS1ibG9jaztcblx0XHRcdFx0XHRcdFx0XHQvKiBtYXJnaW46IDFyZW07ICovXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0LmNhdGVnb3J5ID4gaW1nIHtcblx0XHRcdFx0XHRcdFx0XHR3aWR0aDogMTAwJTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHQuY2F0ZWdvcnkgLmNhdGVnb3J5X25hbWUge1xuXHRcdFx0XHRcdFx0XHRcdGZvbnQtd2VpZ2h0OiBib2xkO1xuXHRcdFx0XHRcdFx0XHRcdHRleHQtYWxpZ246IGNlbnRlcjtcblx0XHRcdFx0XHRcdFx0XHRtYXJnaW4tdG9wOiAwLjRyZW07XG5cdFx0XHRcdFx0XHRcdFx0bWFyZ2luLWJvdHRvbTogMC40cmVtO1xuXHRcdFx0XHRcdFx0XHRcdGxpbmUtaGVpZ2h0OiAxcmVtO1xuXHRcdFx0XHRcdFx0XHRcdGhlaWdodDogMnJlbTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHQuZnJhbWUge1xuXHRcdFx0XHRcdFx0XHRcdGRpc3BsYXk6IGZsZXhcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHQuZnJhbWUgLmNvbnRlbnQge1xuXHRcdFx0XHRcdFx0XHRcdGZsZXgtZ3JvdzogMTAwO1xuXHRcdFx0XHRcdFx0XHRcdGRpc3BsYXk6IGZsZXg7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0LmNoYXJ0ZGl2IHtcblx0XHRcdFx0XHRcdFx0XHR3aWR0aDogIDEwMHB4O1xuXHRcdFx0XHRcdFx0XHRcdGhlaWdodDogMTAwcHg7XG5cdFx0XHRcdFx0XHRcdFx0bWFyZ2luOiBhdXRvO1xuXHRcdFx0XHRcdFx0XHRcdHBvc2l0aW9uOiByZWxhdGl2ZTtcblx0XHRcdFx0XHRcdFx0XHRtYXJnaW4tdG9wOiAwLjRyZW07XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdC5jaGFydGRpdiAucGVyYyB7XG5cdFx0XHRcdFx0XHRcdFx0cG9zaXRpb246IGFic29sdXRlO1xuXHRcdFx0XHRcdFx0XHRcdHRvcDogIGNhbGMoNTAlIC0gMC44cmVtKTtcblx0XHRcdFx0XHRcdFx0XHRsZWZ0OiBjYWxjKDUwJSAtIDEuNnJlbSk7XG5cdFx0XHRcdFx0XHRcdFx0Zm9udC1zaXplOiAxLjVyZW07XG5cdFx0XHRcdFx0XHRcdFx0Zm9udC13ZWlnaHQ6IGJvbGQ7XG5cdFx0XHRcdFx0XHRcdFx0Y29sb3I6ICMwMDA7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdGRldGFpbHMge1xuXHRcdFx0XHRcdFx0XHRcdG1hcmdpbi10b3A6IDAuNHJlbTtcblx0XHRcdFx0XHRcdFx0XHRtYXJnaW4tYm90dG9tOiAwLjRyZW07XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdGRldGFpbHMgPiAqIHtcblx0XHRcdFx0XHRcdFx0XHRwYWRkaW5nOiAwLjVlbTtcblx0XHRcdFx0XHRcdFx0XHRib3JkZXItYm90dG9tOiAxcHggc29saWQgI2NjYztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHQudmlld19kZXRhaWxzIHtcblx0XHRcdFx0XHRcdFx0XHQvKiBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1kYXJrLWJhY2tncm91bmQpOyAqL1xuXHRcdFx0XHRcdFx0XHRcdGJhY2tncm91bmQtY29sb3I6IHJnYig3MSwgMTA1LCA0MSk7XG5cdFx0XHRcdFx0XHRcdFx0Y29sb3I6ICNkZGQ7XG5cdFx0XHRcdFx0XHRcdFx0dGV4dC1hbGlnbjogY2VudGVyO1xuXHRcdFx0XHRcdFx0XHRcdHBhZGRpbmc6IDAuNnJlbTtcblx0XHRcdFx0XHRcdFx0XHRjdXJzb3I6IHBvaW50ZXI7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdC52aWV3X2RldGFpbHM6aG92ZXIge1xuXHRcdFx0XHRcdFx0XHRcdGJhY2tncm91bmQtY29sb3I6IHJnYigzNSwgNzUsIDIwKTtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdC5sYXN0dXBkYXRlIHtcblx0XHRcdFx0XHRcdFx0XHRtYXJnaW4tdG9wOiAwLjRyZW07XG5cdFx0XHRcdFx0XHRcdFx0Zm9udC1zaXplOiAwLjdyZW07XG5cdFx0XHRcdFx0XHRcdFx0bWFyZ2luLWJvdHRvbTogMC40cmVtO1xuXHRcdFx0XHRcdFx0XHRcdG1hcmdpbi1sZWZ0OiAwLjRyZW07XG5cdFx0XHRcdFx0XHRcdFx0bWFyZ2luLXJpZ2h0OiAwLjRyZW07XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdC5ucl9yZWNvcmRzLCBkZXRhaWxzIHtcblx0XHRcdFx0XHRcdFx0XHRtYXJnaW4tbGVmdDogMC40cmVtO1xuXHRcdFx0XHRcdFx0XHRcdG1hcmdpbi1yaWdodDogMC40cmVtO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdDwvc3R5bGU+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY2F0ZWdvcnlcIj5cblx0XHRcdFx0XHRcdFx0PCEtLSA8aW1nIHNyYz1cImtwaS1waWUtY2hhcnQucG5nXCI+IC0tPlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY2hhcnRkaXZcIj5cblx0XHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicGVyY1wiPjEyJTwvZGl2PlxuXHRcdFx0XHRcdFx0XHRcdDxjYW52YXMgY2xhc3M9XCJjaGFydFwiPjwvY2FudmFzPlxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNhdGVnb3J5X25hbWVcIj5Db21wbGV0ZW5lc3M8L2Rpdj5cblx0XHRcdFx0XHRcdFx0PHNwYW4+PC9zcGFuPlxuXHRcdFx0XHRcdFx0XHQ8Y3MtbGFiZWwtYW5kLWRhdGEgbGFiZWw9XCJxdWFsaXR5LWFzc3VyZWQgcmVjc1wiIGNsYXNzPVwibnJfcmVjb3Jkc1wiPjwvY3MtbGFiZWwtYW5kLWRhdGE+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJsYXN0dXBkYXRlXCI+XG5cdFx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3M9XCJkYXRhXCI+PC9zcGFuPlxuXHRcdFx0XHRcdFx0XHRcdDxzcGFuPjwvc3Bhbj5cblx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdDwhLS0gPGRpdiBjbGFzcz1cIm5yX3JlY29yZHNcIj4xMjM8L2Rpdj4gLS0+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJtb3JlXCI+XG5cdFx0XHRcdFx0XHRcdFx0PGRldGFpbHM+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8c3VtbWFyeT5jYXJyaWVkIG91dCB0ZXN0czwvc3VtbWFyeT5cblx0XHRcdFx0XHRcdFx0XHQ8L2RldGFpbHM+XG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInZpZXdfZGV0YWlsc1wiPlZpZXcgZGV0YWlsczwvZGl2PlxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0YDtcblxuXHRcdGN1c3RvbUVsZW1lbnRzLnVwZ3JhZGUoc3Jvb3QpO1xuXHRcdHRoaXMudGVtcGxhdGUgPSBjc19jYXN0KEhUTUxFbGVtZW50LCBzcm9vdC5xdWVyeVNlbGVjdG9yKCcuY2F0ZWdvcnknKSk7XG5cdFx0dGhpcy5tb3JlX2RpdiA9IGNzX2Nhc3QoSFRNTEVsZW1lbnQsIHNyb290LnF1ZXJ5U2VsZWN0b3IoJy5tb3JlJykpO1xuXHR9XG5cdFxuXHRoaWRlTW9yZURpdigpICB7XG5cdFx0dGhpcy5tb3JlX2Rpdi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG5cdH1cblx0XG5cdGFzeW5jIHJlZnJlc2goZGF0YToge2RhdGFzZXRfbmFtZTogc3RyaW5nLCB0b3RfcmVjb3JkczogbnVtYmVyLCBmYWlsZWRfcmVjb3JkczogbnVtYmVyLCBjaGVja19jYXRlZ29yeTogc3RyaW5nLCBzZXNzaW9uX3N0YXJ0X3RzOiBzdHJpbmd9KVxuXHR7XG5cblx0XHRjb25zdCBjYXQgPSB0aGlzLnRlbXBsYXRlXG5cdFx0dGhpcy5zZXR1cF9jaGFydChjYXQsIGRhdGEpXG5cdFx0Y29uc3QgY2F0X25hbWUgPSBjc19jYXN0KEhUTUxFbGVtZW50LCBjYXQucXVlcnlTZWxlY3RvcignLmNhdGVnb3J5X25hbWUnKSlcblx0XHRjYXRfbmFtZS50ZXh0Q29udGVudCA9IGRhdGEuY2hlY2tfY2F0ZWdvcnlcblx0XHRjb25zdCBmYWlsZWRlbGVtZW50ID0gY3NfY2FzdChMYWJlbEFuZERhdGEsIGNhdC5xdWVyeVNlbGVjdG9yKCcubnJfcmVjb3JkcycpKVxuXHRcdGZhaWxlZGVsZW1lbnQuc2V0RGF0YSgnJyArIChkYXRhLnRvdF9yZWNvcmRzIC0gZGF0YS5mYWlsZWRfcmVjb3JkcykpXG5cdFx0Y29uc3QgbGFzdF91cGRhdGUgPSBjc19jYXN0KEhUTUxTcGFuRWxlbWVudCwgY2F0LnF1ZXJ5U2VsZWN0b3IoJy5sYXN0dXBkYXRlIC5kYXRhJykpXG5cdFx0Y29uc3QgZGF0ZSA9IG5ldyBEYXRlKGRhdGEuc2Vzc2lvbl9zdGFydF90cylcblx0XHRcblx0XHRjb25zdCBwZXJjID0gY3NfY2FzdChIVE1MRWxlbWVudCwgY2F0LnF1ZXJ5U2VsZWN0b3IoJy5wZXJjJykpXG5cdFx0cGVyYy50ZXh0Q29udGVudCA9ICcnICsgKChkYXRhLnRvdF9yZWNvcmRzIC0gZGF0YS5mYWlsZWRfcmVjb3JkcykgKiAxMDAgLyBkYXRhLnRvdF9yZWNvcmRzKS50b0ZpeGVkKDEpXG5cdFx0XHRcdFxuXHRcdGNvbnN0IGRhdGVmb3JtYXQgPSBuZXcgSW50bC5EYXRlVGltZUZvcm1hdCgnaXQtSVQnLCB7XG5cdFx0XHRcdFx0eWVhcjogJ251bWVyaWMnLFxuXHRcdFx0XHRcdG1vbnRoOiAnMi1kaWdpdCcsXG5cdFx0XHRcdFx0ZGF5OiAnMi1kaWdpdCcsXG5cdFx0XHRcdFx0aG91cjogJzItZGlnaXQnLFxuXHRcdFx0XHRcdG1pbnV0ZTogXCIyLWRpZ2l0XCIsXG5cdFx0XHRcdFx0dGltZVpvbmU6ICdFdXJvcGUvUm9tZSdcblx0XHRcdFx0fSkuZm9ybWF0KGRhdGUpXG5cblx0XHRsYXN0X3VwZGF0ZS50ZXh0Q29udGVudCA9IGRhdGVmb3JtYXRcblxuXHRcdGNvbnN0IHZpZXdfZGV0YWlscyA9IGNzX2Nhc3QoSFRNTEVsZW1lbnQsIGNhdC5xdWVyeVNlbGVjdG9yKCcudmlld19kZXRhaWxzJykpXG5cdFx0XG5cdFx0dmlld19kZXRhaWxzLm9uY2xpY2sgPSAoKSA9PiB7XG5cdFx0XHRsb2NhdGlvbi5oYXNoID0gJyNwYWdlPXN1bW1hcnkmc2Vzc2lvbl9zdGFydF90cz0nICsgZGF0YS5zZXNzaW9uX3N0YXJ0X3RzICsgJyZkYXRhc2V0X25hbWU9JyArIGRhdGEuZGF0YXNldF9uYW1lICsgJyZjYXRlZ29yeV9uYW1lPScgKyBkYXRhLmNoZWNrX2NhdGVnb3J5ICtcblx0XHRcdFx0XHRcdFx0JyZmYWlsZWRfcmVjb3Jkcz0nICsgZGF0YS5mYWlsZWRfcmVjb3JkcyArICcmdG90X3JlY29yZHM9JyArIGRhdGEudG90X3JlY29yZHMgXG5cdFx0fVxuXHRcdFxuXHRcdGNvbnN0IGNhdF9kZXRhaWxzID0gIGNzX2Nhc3QoSFRNTEVsZW1lbnQsIGNhdC5xdWVyeVNlbGVjdG9yKCdkZXRhaWxzJykpXG5cdFx0XG5cdFx0QVBJMy5saXN0X19jYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X2NoZWNrX2NhdGVnb3J5X2NoZWNrX25hbWVfZmFpbGVkX3JlY29yc192dyh7XG5cdFx0XHRcdFx0c2Vzc2lvbl9zdGFydF90czogZGF0YS5zZXNzaW9uX3N0YXJ0X3RzLFxuXHRcdFx0XHRcdGRhdGFzZXRfbmFtZSA6IGRhdGEuZGF0YXNldF9uYW1lLFxuXHRcdFx0XHRcdGNoZWNrX2NhdGVnb3J5OiBkYXRhLmNoZWNrX2NhdGVnb3J5XG5cdFx0XHRcdH0pLnRoZW4oKGNoZWNrcykgPT4ge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGNoZWNrcylcblx0XHRcdFx0XHRmb3IgKGxldCBpMiA9IDA7IGkyIDwgY2hlY2tzLmxlbmd0aDsgaTIrKylcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXHRcdFx0XHRcdFx0ZGl2LnRleHRDb250ZW50ID0gY2hlY2tzW2kyXS5jaGVja19uYW1lIC8vICsgJyAnICsgY2hlY2tzW2kyXS5mYWlsZWRfcmVjb3JkcyArICAnIC8gJyArIGNoZWNrc1tpMl0udG90X3JlY29yZHMgXG5cdFx0XHRcdFx0XHRjYXRfZGV0YWlscy5hcHBlbmRDaGlsZChkaXYpXG5cdFx0XHRcdFx0fVxuXHRcdH0pXG5cblx0fVxuXG5cdGFzeW5jICBzZXR1cF9jaGFydChjYXQ6IEhUTUxFbGVtZW50LCBhcmcxOiB7dG90X3JlY29yZHM6IG51bWJlciwgZmFpbGVkX3JlY29yZHM6IG51bWJlcn0pIHtcblx0XHRhd2FpdCB0aGlzLmNvbm5lY3RlZF9wcm9taXNlXG5cdFx0Y29uc3QgY2hhcnQgPSBjc19jYXN0KEhUTUxDYW52YXNFbGVtZW50LCBjYXQucXVlcnlTZWxlY3RvcignLmNoYXJ0JykpO1xuXHRcdC8vIGNvbnN0IGNvbnRleHQgPSBjaGFydC5nZXRDb250ZXh0KCcyZCcpO1xuXHRcdFx0XHRcdFx0bmV3IENoYXJ0KGNoYXJ0LCBcdFx0XHRcdHtcblx0XHRcdFx0XHRcdCAgdHlwZTogJ2RvdWdobnV0Jyxcblx0XHRcdFx0XHRcdCAgZGF0YToge1xuXHRcdFx0XHRcdFx0ICAgIGxhYmVsczogWydvaycsICdmYWlsJ10sXG5cdFx0XHRcdFx0XHQgICAgZGF0YXNldHM6IFtcblx0XHRcdFx0XHRcdCAgICAgIHtcblx0XHRcdFx0XHRcdCAgICAgICAgbGFiZWw6ICdEYXRhc2V0IDEnLFxuXHRcdFx0XHRcdFx0ICAgICAgICBkYXRhOiBbYXJnMS50b3RfcmVjb3JkcyAtIGFyZzEuZmFpbGVkX3JlY29yZHMsIGFyZzEuZmFpbGVkX3JlY29yZHMsIF0sXG5cdFx0XHRcdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiBbJyMwYTAnLCAnIzIyMicsIF1cblx0XHRcdFx0XHRcdCAgICAgIH1cblx0XHRcdFx0XHRcdCAgICBdXG5cdFx0XHRcdFx0XHQgIH0sXG5cdFx0XHRcdFx0XHQgIG9wdGlvbnM6IHtcblx0XHRcdFx0XHRcdFx0Y3V0b3V0OiAnODAlJyxcblx0XHRcdFx0XHRcdCAgICByZXNwb25zaXZlOiB0cnVlLFxuXHRcdFx0XHRcdFx0ICAgIHBsdWdpbnM6IHtcblx0XHRcdFx0XHRcdCAgICAgIGxlZ2VuZDoge1xuXHRcdFx0XHRcdFx0XHRcdGRpc3BsYXk6IGZhbHNlLFxuXHRcdFx0XHRcdFx0ICAgICAgICBwb3NpdGlvbjogJ3RvcCcsXG5cdFx0XHRcdFx0XHQgICAgICB9LFxuXHRcdFx0XHRcdFx0ICAgICAgdGl0bGU6IHtcblx0XHRcdFx0XHRcdCAgICAgICAgZGlzcGxheTogZmFsc2UsXG5cdFx0XHRcdFx0XHQgICAgICAgIHRleHQ6ICdDaGFydC5qcyBEb3VnaG51dCBDaGFydCdcblx0XHRcdFx0XHRcdCAgICAgIH1cblx0XHRcdFx0XHRcdCAgICB9XG5cdFx0XHRcdFx0XHQgIH0sXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQpXG5cdH1cblxuXG59XG5cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgnY3MtZGF0YXNldC1pc3N1ZS1jYXRlZ29yeScsIERhdGFzZXRJc3N1ZUNhdGVnb3J5Q29tcG9uZW50KVxuIl19