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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YXNldElzc3VlQ2F0ZWdvcnlDb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90eXBlc2NyaXB0L0RhdGFzZXRJc3N1ZUNhdGVnb3J5Q29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7R0FHRztBQUdILE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQTtBQUVoRCxPQUFPLEVBQUUsSUFBSSxFQUF3RSxNQUFNLGVBQWUsQ0FBQTtBQUMxRyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sY0FBYyxDQUFBO0FBR3RDLE1BQU0sT0FBTyw2QkFBOEIsU0FBUSxXQUFXO0lBRzdELFFBQVEsQ0FBQTtJQUVSLGlCQUFpQixDQUFBO0lBQ2pCLGNBQWMsR0FBc0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUE7SUFFN0MsUUFBUSxDQUFBO0lBRVIsaUJBQWlCO1FBRWhCLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDeEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUMxQixDQUFDO0lBRUQ7UUFDQyxLQUFLLEVBQUUsQ0FBQTtRQUNQLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDbEUsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFBO1FBQ2pELEtBQUssQ0FBQyxTQUFTLEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09Ba0diLENBQUM7UUFFTixjQUFjLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFD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QUs7Z0JBQ1YsVUFBVSxFQUFFLElBQUk7Z0JBQ2hCLE9BQU8sRUFBRTtvQkFDUCxNQUFNLEVBQUU7d0JBQ1osT0FBTyxFQUFFLEtBQUs7d0JBQ1IsUUFBUSxFQUFFLEtBQUs7cUJBQ2hCO29CQUNELEtBQUssRUFBRTt3QkFDTCxPQUFPLEVBQUUsS0FBSzt3QkFDZCxJQUFJLEVBQUUseUJBQXlCO3FCQUNoQztpQkFDRjthQUNGO1NBQ0YsQ0FDQSxDQUFBO0lBQ04sQ0FBQztDQUdEO0FBRUQsY0FBYyxDQUFDLE1BQU0sQ0FBQywyQkFBMkIsRUFBRSw2QkFBNkIsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIChDKSAyMDI0IENhdGNoIFNvbHZlIGRpIERhdmlkZSBNb250ZXNpblxuICogTGljZW5zZTogQUdQTFxuICovXG5cbmltcG9ydCBDaGFydCA9IHJlcXVpcmUoXCJjaGFydC5qc1wiKVxuaW1wb3J0IHsgTGFiZWxBbmREYXRhIH0gZnJvbSBcIi4vTGFiZWxBbmREYXRhLmpzXCJcbmltcG9ydCB7IExvYWRlciB9IGZyb20gXCIuL0xvYWRlci5qc1wiXG5pbXBvcnQgeyBBUEkzLCBjYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X2NoZWNrX2NhdGVnb3J5X2ZhaWxlZF9yZWNvcnNfdndfX3JvdyB9IGZyb20gXCIuL2FwaS9hcGkzLmpzXCJcbmltcG9ydCB7IGNzX2Nhc3QgfSBmcm9tIFwiLi9xdWFsaXR5LmpzXCJcblxuXG5leHBvcnQgY2xhc3MgRGF0YXNldElzc3VlQ2F0ZWdvcnlDb21wb25lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudFxue1xuXHRcblx0dGVtcGxhdGVcblx0XG5cdGNvbm5lY3RlZF9wcm9taXNlXG5cdGNvbm5lY3RlZF9mdW5jOiAoczogbnVsbCkgPT4gdm9pZCA9IHMgPT4gbnVsbFxuXHRcblx0bW9yZV9kaXZcblx0XG5cdGNvbm5lY3RlZENhbGxiYWNrKClcblx0e1xuXHRcdGNvbnNvbGUubG9nKCdjb25uZWN0ZWQnKVxuXHRcdHRoaXMuY29ubmVjdGVkX2Z1bmMobnVsbClcblx0fVxuXHRcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKVxuXHRcdHRoaXMuY29ubmVjdGVkX3Byb21pc2UgPSBuZXcgUHJvbWlzZShzID0+IHRoaXMuY29ubmVjdGVkX2Z1bmMgPSBzKVxuXHRcdGNvbnN0IHNyb290ID0gdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSlcblx0XHRzcm9vdC5pbm5lckhUTUwgPSBgXG5cdFx0XHRcdFx0XHQ8c3R5bGU+XG5cdFx0XHRcdFx0XHRcdDpob3N0IHtcblx0XHRcdFx0XHRcdFx0XHRkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG5cdFx0XHRcdFx0XHRcdFx0Ym94LXNoYWRvdzogNHB4IDRweCAjY2NjO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdC5jYXRlZ29yeSB7XG5cdFx0XHRcdFx0XHRcdFx0Ym9yZGVyOiAxcHggc29saWQgZ3JheTtcblx0XHRcdFx0XHRcdFx0XHR3aWR0aDogMTJyZW07XG5cdFx0XHRcdFx0XHRcdFx0ZGlzcGxheTogaW5saW5lLWJsb2NrO1xuXHRcdFx0XHRcdFx0XHRcdC8qIG1hcmdpbjogMXJlbTsgKi9cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHQuY2F0ZWdvcnkgPiBpbWcge1xuXHRcdFx0XHRcdFx0XHRcdHdpZHRoOiAxMDAlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdC5jYXRlZ29yeSAuY2F0ZWdvcnlfbmFtZSB7XG5cdFx0XHRcdFx0XHRcdFx0Zm9udC13ZWlnaHQ6IGJvbGQ7XG5cdFx0XHRcdFx0XHRcdFx0dGV4dC1hbGlnbjogY2VudGVyO1xuXHRcdFx0XHRcdFx0XHRcdG1hcmdpbi10b3A6IDAuNHJlbTtcblx0XHRcdFx0XHRcdFx0XHRtYXJnaW4tYm90dG9tOiAwLjRyZW07XG5cdFx0XHRcdFx0XHRcdFx0bGluZS1oZWlnaHQ6IDFyZW07XG5cdFx0XHRcdFx0XHRcdFx0aGVpZ2h0OiAycmVtO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdC5mcmFtZSB7XG5cdFx0XHRcdFx0XHRcdFx0ZGlzcGxheTogZmxleFxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdC5mcmFtZSAuY29udGVudCB7XG5cdFx0XHRcdFx0XHRcdFx0ZmxleC1ncm93OiAxMDA7XG5cdFx0XHRcdFx0XHRcdFx0ZGlzcGxheTogZmxleDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHQuY2hhcnRkaXYge1xuXHRcdFx0XHRcdFx0XHRcdHdpZHRoOiAgMTAwcHg7XG5cdFx0XHRcdFx0XHRcdFx0aGVpZ2h0OiAxMDBweDtcblx0XHRcdFx0XHRcdFx0XHRtYXJnaW46IGF1dG87XG5cdFx0XHRcdFx0XHRcdFx0cG9zaXRpb246IHJlbGF0aXZlO1xuXHRcdFx0XHRcdFx0XHRcdG1hcmdpbi10b3A6IDAuNHJlbTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0LmNoYXJ0ZGl2IC5wZXJjIHtcblx0XHRcdFx0XHRcdFx0XHRwb3NpdGlvbjogYWJzb2x1dGU7XG5cdFx0XHRcdFx0XHRcdFx0dG9wOiAgY2FsYyg1MCUgLSAwLjhyZW0pO1xuXHRcdFx0XHRcdFx0XHRcdGxlZnQ6IGNhbGMoNTAlIC0gMS42cmVtKTtcblx0XHRcdFx0XHRcdFx0XHRmb250LXNpemU6IDEuNXJlbTtcblx0XHRcdFx0XHRcdFx0XHRmb250LXdlaWdodDogYm9sZDtcblx0XHRcdFx0XHRcdFx0XHRjb2xvcjogIzAwMDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0ZGV0YWlscyB7XG5cdFx0XHRcdFx0XHRcdFx0bWFyZ2luLXRvcDogMC40cmVtO1xuXHRcdFx0XHRcdFx0XHRcdG1hcmdpbi1ib3R0b206IDAuNHJlbTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0ZGV0YWlscyA+ICo6bnRoLWNoaWxkKGV2ZW4pIHtcblx0XHRcdFx0XHRcdFx0ICBiYWNrZ3JvdW5kLWNvbG9yOiAjY2NjO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHQudmlld19kZXRhaWxzIHtcblx0XHRcdFx0XHRcdFx0XHRiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1kYXJrLWJhY2tncm91bmQpO1xuXHRcdFx0XHRcdFx0XHRcdGNvbG9yOiAjZGRkO1xuXHRcdFx0XHRcdFx0XHRcdHRleHQtYWxpZ246IGNlbnRlcjtcblx0XHRcdFx0XHRcdFx0XHRwYWRkaW5nOiAwLjZyZW07XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHQubGFzdHVwZGF0ZSB7XG5cdFx0XHRcdFx0XHRcdFx0bWFyZ2luLXRvcDogMC40cmVtO1xuXHRcdFx0XHRcdFx0XHRcdGZvbnQtc2l6ZTogMC43cmVtO1xuXHRcdFx0XHRcdFx0XHRcdG1hcmdpbi1ib3R0b206IDAuNHJlbTtcblx0XHRcdFx0XHRcdFx0XHRtYXJnaW4tbGVmdDogMC40cmVtO1xuXHRcdFx0XHRcdFx0XHRcdG1hcmdpbi1yaWdodDogMC40cmVtO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHQubnJfcmVjb3JkcywgZGV0YWlscyB7XG5cdFx0XHRcdFx0XHRcdFx0bWFyZ2luLWxlZnQ6IDAuNHJlbTtcblx0XHRcdFx0XHRcdFx0XHRtYXJnaW4tcmlnaHQ6IDAuNHJlbTtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQ8L3N0eWxlPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNhdGVnb3J5XCI+XG5cdFx0XHRcdFx0XHRcdDwhLS0gPGltZyBzcmM9XCJrcGktcGllLWNoYXJ0LnBuZ1wiPiAtLT5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNoYXJ0ZGl2XCI+XG5cdFx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cInBlcmNcIj4xMiU8L2Rpdj5cblx0XHRcdFx0XHRcdFx0XHQ8Y2FudmFzIGNsYXNzPVwiY2hhcnRcIj48L2NhbnZhcz5cblx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjYXRlZ29yeV9uYW1lXCI+Q29tcGxldGVuZXNzPC9kaXY+XG5cdFx0XHRcdFx0XHRcdDxzcGFuPjwvc3Bhbj5cblx0XHRcdFx0XHRcdFx0PGNzLWxhYmVsLWFuZC1kYXRhIGxhYmVsPVwiZmFpbGVkIHJlY3NcIiBjbGFzcz1cIm5yX3JlY29yZHNcIj48L2NzLWxhYmVsLWFuZC1kYXRhPlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwibGFzdHVwZGF0ZVwiPlxuXHRcdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzPVwiZGF0YVwiPjwvc3Bhbj5cblx0XHRcdFx0XHRcdFx0XHQ8c3Bhbj48L3NwYW4+XG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHQ8IS0tIDxkaXYgY2xhc3M9XCJucl9yZWNvcmRzXCI+MTIzPC9kaXY+IC0tPlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwibW9yZVwiPlxuXHRcdFx0XHRcdFx0XHRcdDxkZXRhaWxzPlxuXHRcdFx0XHRcdFx0XHRcdFx0PHN1bW1hcnk+ZmFpbGVkIGNoZWNrIGxpc3Q8L3N1bW1hcnk+XG5cdFx0XHRcdFx0XHRcdFx0PC9kZXRhaWxzPlxuXHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJ2aWV3X2RldGFpbHNcIj5WaWV3IGRldGFpbHM8L2Rpdj5cblx0XHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdGA7XG5cblx0XHRjdXN0b21FbGVtZW50cy51cGdyYWRlKHNyb290KTtcblx0XHR0aGlzLnRlbXBsYXRlID0gY3NfY2FzdChIVE1MRWxlbWVudCwgc3Jvb3QucXVlcnlTZWxlY3RvcignLmNhdGVnb3J5JykpO1xuXHRcdHRoaXMubW9yZV9kaXYgPSBjc19jYXN0KEhUTUxFbGVtZW50LCBzcm9vdC5xdWVyeVNlbGVjdG9yKCcubW9yZScpKTtcblx0fVxuXHRcblx0aGlkZU1vcmVEaXYoKSAge1xuXHRcdHRoaXMubW9yZV9kaXYuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuXHR9XG5cdFxuXHRhc3luYyByZWZyZXNoKGRhdGE6IHtkYXRhc2V0X25hbWU6IHN0cmluZywgdG90X3JlY29yZHM6IG51bWJlciwgZmFpbGVkX3JlY29yZHM6IG51bWJlciwgY2hlY2tfY2F0ZWdvcnk6IHN0cmluZywgc2Vzc2lvbl9zdGFydF90czogc3RyaW5nfSlcblx0e1xuXG5cdFx0Y29uc3QgY2F0ID0gdGhpcy50ZW1wbGF0ZVxuXHRcdHRoaXMuc2V0dXBfY2hhcnQoY2F0LCBkYXRhKVxuXHRcdGNvbnN0IGNhdF9uYW1lID0gY3NfY2FzdChIVE1MRWxlbWVudCwgY2F0LnF1ZXJ5U2VsZWN0b3IoJy5jYXRlZ29yeV9uYW1lJykpXG5cdFx0Y2F0X25hbWUudGV4dENvbnRlbnQgPSBkYXRhLmNoZWNrX2NhdGVnb3J5XG5cdFx0Y29uc3QgZmFpbGVkZWxlbWVudCA9IGNzX2Nhc3QoTGFiZWxBbmREYXRhLCBjYXQucXVlcnlTZWxlY3RvcignLm5yX3JlY29yZHMnKSlcblx0XHRmYWlsZWRlbGVtZW50LnNldERhdGEoJycgKyBkYXRhLmZhaWxlZF9yZWNvcmRzKVxuXHRcdGNvbnN0IGxhc3RfdXBkYXRlID0gY3NfY2FzdChIVE1MU3BhbkVsZW1lbnQsIGNhdC5xdWVyeVNlbGVjdG9yKCcubGFzdHVwZGF0ZSAuZGF0YScpKVxuXHRcdGNvbnN0IGRhdGUgPSBuZXcgRGF0ZShkYXRhLnNlc3Npb25fc3RhcnRfdHMpXG5cdFx0XG5cdFx0Y29uc3QgcGVyYyA9IGNzX2Nhc3QoSFRNTEVsZW1lbnQsIGNhdC5xdWVyeVNlbGVjdG9yKCcucGVyYycpKVxuXHRcdHBlcmMudGV4dENvbnRlbnQgPSAnJyArICgoZGF0YS50b3RfcmVjb3JkcyAtIGRhdGEuZmFpbGVkX3JlY29yZHMpICogMTAwIC8gZGF0YS50b3RfcmVjb3JkcykudG9GaXhlZCgxKVxuXHRcdFx0XHRcblx0XHRjb25zdCBkYXRlZm9ybWF0ID0gbmV3IEludGwuRGF0ZVRpbWVGb3JtYXQoJ2l0LUlUJywge1xuXHRcdFx0XHRcdHllYXI6ICdudW1lcmljJyxcblx0XHRcdFx0XHRtb250aDogJzItZGlnaXQnLFxuXHRcdFx0XHRcdGRheTogJzItZGlnaXQnLFxuXHRcdFx0XHRcdGhvdXI6ICcyLWRpZ2l0Jyxcblx0XHRcdFx0XHRtaW51dGU6IFwiMi1kaWdpdFwiLFxuXHRcdFx0XHRcdHRpbWVab25lOiAnRXVyb3BlL1JvbWUnXG5cdFx0XHRcdH0pLmZvcm1hdChkYXRlKVxuXG5cdFx0bGFzdF91cGRhdGUudGV4dENvbnRlbnQgPSBkYXRlZm9ybWF0XG5cblx0XHRjb25zdCB2aWV3X2RldGFpbHMgPSBjc19jYXN0KEhUTUxFbGVtZW50LCBjYXQucXVlcnlTZWxlY3RvcignLnZpZXdfZGV0YWlscycpKVxuXHRcdFxuXHRcdHZpZXdfZGV0YWlscy5vbmNsaWNrID0gKCkgPT4ge1xuXHRcdFx0bG9jYXRpb24uaGFzaCA9ICcjcGFnZT1zdW1tYXJ5JnNlc3Npb25fc3RhcnRfdHM9JyArIGRhdGEuc2Vzc2lvbl9zdGFydF90cyArICcmZGF0YXNldF9uYW1lPScgKyBkYXRhLmRhdGFzZXRfbmFtZSArICcmY2F0ZWdvcnlfbmFtZT0nICsgZGF0YS5jaGVja19jYXRlZ29yeSArXG5cdFx0XHRcdFx0XHRcdCcmZmFpbGVkX3JlY29yZHM9JyArIGRhdGEuZmFpbGVkX3JlY29yZHMgKyAnJnRvdF9yZWNvcmRzPScgKyBkYXRhLnRvdF9yZWNvcmRzIFxuXHRcdH1cblx0XHRcblx0XHRjb25zdCBjYXRfZGV0YWlscyA9ICBjc19jYXN0KEhUTUxFbGVtZW50LCBjYXQucXVlcnlTZWxlY3RvcignZGV0YWlscycpKVxuXHRcdFxuXHRcdEFQSTMubGlzdF9fY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9jaGVja19jYXRlZ29yeV9jaGVja19uYW1lX2ZhaWxlZF9yZWNvcnNfdncoe1xuXHRcdFx0XHRcdHNlc3Npb25fc3RhcnRfdHM6IGRhdGEuc2Vzc2lvbl9zdGFydF90cyxcblx0XHRcdFx0XHRkYXRhc2V0X25hbWUgOiBkYXRhLmRhdGFzZXRfbmFtZSxcblx0XHRcdFx0XHRjaGVja19jYXRlZ29yeTogZGF0YS5jaGVja19jYXRlZ29yeVxuXHRcdFx0XHR9KS50aGVuKChjaGVja3MpID0+IHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhjaGVja3MpXG5cdFx0XHRcdFx0Zm9yIChsZXQgaTIgPSAwOyBpMiA8IGNoZWNrcy5sZW5ndGg7IGkyKyspXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Y29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jylcblx0XHRcdFx0XHRcdGRpdi50ZXh0Q29udGVudCA9IGNoZWNrc1tpMl0uY2hlY2tfbmFtZSAvLyArICcgJyArIGNoZWNrc1tpMl0uZmFpbGVkX3JlY29yZHMgKyAgJyAvICcgKyBjaGVja3NbaTJdLnRvdF9yZWNvcmRzIFxuXHRcdFx0XHRcdFx0Y2F0X2RldGFpbHMuYXBwZW5kQ2hpbGQoZGl2KVxuXHRcdFx0XHRcdH1cblx0XHR9KVxuXG5cdH1cblxuXHRhc3luYyAgc2V0dXBfY2hhcnQoY2F0OiBIVE1MRWxlbWVudCwgYXJnMToge3RvdF9yZWNvcmRzOiBudW1iZXIsIGZhaWxlZF9yZWNvcmRzOiBudW1iZXJ9KSB7XG5cdFx0YXdhaXQgdGhpcy5jb25uZWN0ZWRfcHJvbWlzZVxuXHRcdGNvbnN0IGNoYXJ0ID0gY3NfY2FzdChIVE1MQ2FudmFzRWxlbWVudCwgY2F0LnF1ZXJ5U2VsZWN0b3IoJy5jaGFydCcpKTtcblx0XHQvLyBjb25zdCBjb250ZXh0ID0gY2hhcnQuZ2V0Q29udGV4dCgnMmQnKTtcblx0XHRcdFx0XHRcdG5ldyBDaGFydChjaGFydCwgXHRcdFx0XHR7XG5cdFx0XHRcdFx0XHQgIHR5cGU6ICdkb3VnaG51dCcsXG5cdFx0XHRcdFx0XHQgIGRhdGE6IHtcblx0XHRcdFx0XHRcdCAgICBsYWJlbHM6IFsnb2snLCAnZmFpbCddLFxuXHRcdFx0XHRcdFx0ICAgIGRhdGFzZXRzOiBbXG5cdFx0XHRcdFx0XHQgICAgICB7XG5cdFx0XHRcdFx0XHQgICAgICAgIGxhYmVsOiAnRGF0YXNldCAxJyxcblx0XHRcdFx0XHRcdCAgICAgICAgZGF0YTogW2FyZzEudG90X3JlY29yZHMgLSBhcmcxLmZhaWxlZF9yZWNvcmRzLCBhcmcxLmZhaWxlZF9yZWNvcmRzLCBdLFxuXHRcdFx0XHRcdFx0XHRcdGJhY2tncm91bmRDb2xvcjogWycjMGEwJywgJyMyMjInLCBdXG5cdFx0XHRcdFx0XHQgICAgICB9XG5cdFx0XHRcdFx0XHQgICAgXVxuXHRcdFx0XHRcdFx0ICB9LFxuXHRcdFx0XHRcdFx0ICBvcHRpb25zOiB7XG5cdFx0XHRcdFx0XHRcdGN1dG91dDogJzgwJScsXG5cdFx0XHRcdFx0XHQgICAgcmVzcG9uc2l2ZTogdHJ1ZSxcblx0XHRcdFx0XHRcdCAgICBwbHVnaW5zOiB7XG5cdFx0XHRcdFx0XHQgICAgICBsZWdlbmQ6IHtcblx0XHRcdFx0XHRcdFx0XHRkaXNwbGF5OiBmYWxzZSxcblx0XHRcdFx0XHRcdCAgICAgICAgcG9zaXRpb246ICd0b3AnLFxuXHRcdFx0XHRcdFx0ICAgICAgfSxcblx0XHRcdFx0XHRcdCAgICAgIHRpdGxlOiB7XG5cdFx0XHRcdFx0XHQgICAgICAgIGRpc3BsYXk6IGZhbHNlLFxuXHRcdFx0XHRcdFx0ICAgICAgICB0ZXh0OiAnQ2hhcnQuanMgRG91Z2hudXQgQ2hhcnQnXG5cdFx0XHRcdFx0XHQgICAgICB9XG5cdFx0XHRcdFx0XHQgICAgfVxuXHRcdFx0XHRcdFx0ICB9LFxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0KVxuXHR9XG5cblxufVxuXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ2NzLWRhdGFzZXQtaXNzdWUtY2F0ZWdvcnknLCBEYXRhc2V0SXNzdWVDYXRlZ29yeUNvbXBvbmVudClcbiJdfQ==