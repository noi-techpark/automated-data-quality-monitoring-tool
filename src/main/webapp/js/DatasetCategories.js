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
    constructor() {
        super();
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
						</style>
						<div class="frame">
							<div class="content"></div>
							<img src="kpi-general-info.png">
						</div>
						<div class="category">
							<img src="kpi-pie-chart.png">
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
}
customElements.define('cs-dataset-categories', DatasetCategories);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YXNldENhdGVnb3JpZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90eXBlc2NyaXB0L0RhdGFzZXRDYXRlZ29yaWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7R0FHRztBQUdILE9BQU8sRUFBRSxPQUFPLEVBQVksTUFBTSxjQUFjLENBQUM7QUFDakQsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUduQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBRXJDLE1BQU0sT0FBTyxpQkFBa0IsU0FBUSxXQUFXO0lBR2pELFFBQVEsQ0FBQTtJQUVSLE9BQU8sQ0FBQTtJQUVQO1FBQ0MsS0FBSyxFQUFFLENBQUE7UUFDUCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUE7UUFDakQsS0FBSyxDQUFDLFNBQVMsR0FBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQXFDYixDQUFDO1FBQ0UsY0FBYyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ3JFLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFDdkUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUVoQyxDQUFDO0lBRUQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxrQkFBMEIsRUFBRSxjQUFzQjtRQUUvRCxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUE7UUFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQTtRQUMzQixNQUFNLE1BQU0sR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFBO1FBQzNCLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ2hDLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLHFFQUFxRSxDQUFDO1lBQzdGLGdCQUFnQixFQUFFLGtCQUFrQjtZQUNwQyxZQUFZLEVBQUcsY0FBYztTQUM3QixDQUFDLENBQUE7UUFDRixNQUFNLENBQUMsTUFBTSxFQUFFLENBQUE7UUFDZixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ2pCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUNwQyxDQUFDO1lBQ0EsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO1lBQy9ELE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUE7WUFDMUUsUUFBUSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFBO1lBQzdDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLFdBQVcsR0FBRyxTQUFTLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsR0FBRyxLQUFLO2tCQUM3RyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFBO1lBQ3JCLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBRTdCLFFBQVEsQ0FBQyxPQUFPLEdBQUcsR0FBRyxFQUFFO2dCQUN2QixRQUFRLENBQUMsSUFBSSxHQUFHLGlDQUFpQyxHQUFHLGtCQUFrQixHQUFHLGdCQUFnQixHQUFHLGNBQWMsR0FBRyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFBO1lBQ3hKLENBQUMsQ0FBQTtZQUVELE1BQU0sV0FBVyxHQUFJLE9BQU8sQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFBO1lBRXZFLElBQUksQ0FBQyxnRkFBZ0YsQ0FBQztnQkFDbkYsZ0JBQWdCLEVBQUUsa0JBQWtCO2dCQUNwQyxZQUFZLEVBQUcsY0FBYztnQkFDN0IsY0FBYyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjO2FBQ3RDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtnQkFDbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtnQkFDbkIsS0FBSyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsRUFBRSxFQUFFLEVBQ3pDLENBQUM7b0JBQ0EsTUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtvQkFDekMsR0FBRyxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFBLENBQUMsdUVBQXVFO29CQUMvRyxXQUFXLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFBO2dCQUM3QixDQUFDO1lBQ0YsQ0FBQyxDQUFDLENBQUE7UUFFTCxDQUFDO0lBQ0YsQ0FBQztDQUNEO0FBRUQsY0FBYyxDQUFDLE1BQU0sQ0FBQyx1QkFBdUIsRUFBRSxpQkFBaUIsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIChDKSAyMDI0IENhdGNoIFNvbHZlIGRpIERhdmlkZSBNb250ZXNpblxuICogTGljZW5zZTogQUdQTFxuICovXG5cblxuaW1wb3J0IHsgY3NfY2FzdCwgdGhyb3dOUEUgfSBmcm9tIFwiLi9xdWFsaXR5LmpzXCI7XG5pbXBvcnQge0FQSTN9IGZyb20gJy4vYXBpL2FwaTMuanMnO1xuaW1wb3J0IHsgT3BlbkNsb3NlU2VjdGlvbiB9IGZyb20gXCIuL09wZW5DbG9zZVNlY3Rpb24uanNcIjtcbmltcG9ydCB7IFNlY3Rpb25Sb3cgfSBmcm9tIFwiLi9TZWN0aW9uUm93LmpzXCI7XG5pbXBvcnQgeyBMb2FkZXIgfSBmcm9tIFwiLi9Mb2FkZXIuanNcIjtcblxuZXhwb3J0IGNsYXNzIERhdGFzZXRDYXRlZ29yaWVzIGV4dGVuZHMgSFRNTEVsZW1lbnRcbntcblx0XG5cdHRlbXBsYXRlXG5cdFxuXHRjb250ZW50XG5cdFxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpXG5cdFx0Y29uc3Qgc3Jvb3QgPSB0aGlzLmF0dGFjaFNoYWRvdyh7IG1vZGU6ICdvcGVuJyB9KVxuXHRcdHNyb290LmlubmVySFRNTCA9IGBcblx0XHRcdFx0XHRcdDxzdHlsZT5cblx0XHRcdFx0XHRcdFx0Omhvc3Qge1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdC5jYXRlZ29yeSB7XG5cdFx0XHRcdFx0XHRcdFx0Ym9yZGVyOiAxcHggc29saWQgZ3JheTtcblx0XHRcdFx0XHRcdFx0XHR3aWR0aDogMTByZW07XG5cdFx0XHRcdFx0XHRcdFx0ZGlzcGxheTogaW5saW5lLWJsb2NrO1xuXHRcdFx0XHRcdFx0XHRcdG1hcmdpbjogMXJlbTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHQuY2F0ZWdvcnkgPiBpbWcge1xuXHRcdFx0XHRcdFx0XHRcdHdpZHRoOiAxMDAlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdC5jYXRlZ29yeSAuY2F0ZWdvcnlfbmFtZSB7XG5cdFx0XHRcdFx0XHRcdFx0Zm9udC13ZWlnaHQ6IGJvbGQ7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0LmZyYW1lIHtcblx0XHRcdFx0XHRcdFx0XHRkaXNwbGF5OiBmbGV4XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0LmZyYW1lIC5jb250ZW50IHtcblx0XHRcdFx0XHRcdFx0XHRmbGV4LWdyb3c6IDEwMDtcblx0XHRcdFx0XHRcdFx0XHRkaXNwbGF5OiBmbGV4O1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQ8L3N0eWxlPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImZyYW1lXCI+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjb250ZW50XCI+PC9kaXY+XG5cdFx0XHRcdFx0XHRcdDxpbWcgc3JjPVwia3BpLWdlbmVyYWwtaW5mby5wbmdcIj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNhdGVnb3J5XCI+XG5cdFx0XHRcdFx0XHRcdDxpbWcgc3JjPVwia3BpLXBpZS1jaGFydC5wbmdcIj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNhdGVnb3J5X25hbWVcIj5Db21wbGV0ZW5lc3M8L2Rpdj5cblx0XHRcdFx0XHRcdFx0PHNwYW4+YmxhIGJsYSBibGEgYmxhPC9zcGFuPlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwibnJfcmVjb3Jkc1wiPjEyMzwvZGl2PlxuXHRcdFx0XHRcdFx0XHQ8ZGV0YWlscz5cblx0XHRcdFx0XHRcdFx0XHQ8c3VtbWFyeT5mYWlsZWQgY2hlY2sgbGlzdDwvc3VtbWFyeT5cblx0XHRcdFx0XHRcdFx0PC9kZXRhaWxzPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRgO1xuXHRcdCAgICAgICAgY3VzdG9tRWxlbWVudHMudXBncmFkZShzcm9vdCk7XG5cdFx0ICAgICAgICB0aGlzLmNvbnRlbnQgPSBjc19jYXN0KEhUTUxFbGVtZW50LCBzcm9vdC5xdWVyeVNlbGVjdG9yKCcuY29udGVudCcpKTtcblx0XHQgICAgICAgIHRoaXMudGVtcGxhdGUgPSBjc19jYXN0KEhUTUxFbGVtZW50LCBzcm9vdC5xdWVyeVNlbGVjdG9yKCcuY2F0ZWdvcnknKSk7XG5cdFx0ICAgICAgICB0aGlzLnRlbXBsYXRlLnJlbW92ZSgpO1xuXHRcdFxuXHR9XG5cdFxuXHRhc3luYyByZWZyZXNoKHBfc2Vzc2lvbl9zdGFydF90czogc3RyaW5nLCBwX2RhdGFzZXRfbmFtZTogc3RyaW5nKSB7XG5cdFx0XG5cdFx0Y29uc29sZS5sb2cocF9zZXNzaW9uX3N0YXJ0X3RzKVxuXHRcdGNvbnNvbGUubG9nKHBfZGF0YXNldF9uYW1lKVxuXHRcdGNvbnN0IGxvYWRlciA9IG5ldyBMb2FkZXIoKVxuXHRcdHRoaXMuY29udGVudC5hcHBlbmRDaGlsZChsb2FkZXIpXG5cdFx0Y29uc3QgcmVzcCA9IGF3YWl0IEFQSTMubGlzdF9fY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9jaGVja19jYXRlZ29yeV9mYWlsZWRfcmVjb3JzX3Z3KHtcblx0XHRcdHNlc3Npb25fc3RhcnRfdHM6IHBfc2Vzc2lvbl9zdGFydF90cyxcblx0XHRcdGRhdGFzZXRfbmFtZSA6IHBfZGF0YXNldF9uYW1lXG5cdFx0fSlcblx0XHRsb2FkZXIucmVtb3ZlKClcblx0XHRjb25zb2xlLmxvZyhyZXNwKSBcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHJlc3AubGVuZ3RoOyBpKyspXG5cdFx0e1xuXHRcdFx0Y29uc3QgY2F0ID0gY3NfY2FzdChIVE1MRWxlbWVudCwgdGhpcy50ZW1wbGF0ZS5jbG9uZU5vZGUodHJ1ZSkpXG5cdFx0XHRjb25zdCBjYXRfbmFtZSA9IGNzX2Nhc3QoSFRNTEVsZW1lbnQsIGNhdC5xdWVyeVNlbGVjdG9yKCcuY2F0ZWdvcnlfbmFtZScpKVxuXHRcdFx0Y2F0X25hbWUudGV4dENvbnRlbnQgPSByZXNwW2ldLmNoZWNrX2NhdGVnb3J5XG5cdFx0XHRjc19jYXN0KEhUTUxFbGVtZW50LCBjYXQucXVlcnlTZWxlY3RvcignLm5yX3JlY29yZHMnKSkudGV4dENvbnRlbnQgPSAnZmFpbGVkICcgKyByZXNwW2ldLmZhaWxlZF9yZWNvcmRzICsgJyAvICdcblx0XHRcdCsgcmVzcFtpXS50b3RfcmVjb3Jkc1xuXHRcdFx0dGhpcy5jb250ZW50LmFwcGVuZENoaWxkKGNhdClcblx0XHRcdFxuXHRcdFx0Y2F0X25hbWUub25jbGljayA9ICgpID0+IHtcblx0XHRcdFx0bG9jYXRpb24uaGFzaCA9ICcjcGFnZT1zdW1tYXJ5JnNlc3Npb25fc3RhcnRfdHM9JyArIHBfc2Vzc2lvbl9zdGFydF90cyArICcmZGF0YXNldF9uYW1lPScgKyBwX2RhdGFzZXRfbmFtZSArICcmY2F0ZWdvcnlfbmFtZT0nICsgcmVzcFtpXS5jaGVja19jYXRlZ29yeSBcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0Y29uc3QgY2F0X2RldGFpbHMgPSAgY3NfY2FzdChIVE1MRWxlbWVudCwgY2F0LnF1ZXJ5U2VsZWN0b3IoJ2RldGFpbHMnKSlcblx0XHRcdFxuXHRcdFx0QVBJMy5saXN0X19jYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X2NoZWNrX2NhdGVnb3J5X2NoZWNrX25hbWVfZmFpbGVkX3JlY29yc192dyh7XG5cdFx0XHRcdFx0XHRzZXNzaW9uX3N0YXJ0X3RzOiBwX3Nlc3Npb25fc3RhcnRfdHMsXG5cdFx0XHRcdFx0XHRkYXRhc2V0X25hbWUgOiBwX2RhdGFzZXRfbmFtZSxcblx0XHRcdFx0XHRcdGNoZWNrX2NhdGVnb3J5OiByZXNwW2ldLmNoZWNrX2NhdGVnb3J5XG5cdFx0XHRcdFx0fSkudGhlbigoY2hlY2tzKSA9PiB7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhjaGVja3MpXG5cdFx0XHRcdFx0XHRmb3IgKGxldCBpMiA9IDA7IGkyIDwgY2hlY2tzLmxlbmd0aDsgaTIrKylcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jylcblx0XHRcdFx0XHRcdFx0ZGl2LnRleHRDb250ZW50ID0gY2hlY2tzW2kyXS5jaGVja19uYW1lIC8vICsgJyAnICsgY2hlY2tzW2kyXS5mYWlsZWRfcmVjb3JkcyArICAnIC8gJyArIGNoZWNrc1tpMl0udG90X3JlY29yZHMgXG5cdFx0XHRcdFx0XHRcdGNhdF9kZXRhaWxzLmFwcGVuZENoaWxkKGRpdilcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KVxuXHRcdFx0XG5cdFx0fVxuXHR9XG59XG5cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgnY3MtZGF0YXNldC1jYXRlZ29yaWVzJywgRGF0YXNldENhdGVnb3JpZXMpXG4iXX0=