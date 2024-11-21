/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */
import { cs_cast } from "./quality.js";
import { API3 } from './api/api3.js';
export class DatasetCategories extends HTMLElement {
    template;
    constructor() {
        super();
        const sroot = this.attachShadow({ mode: 'open' });
        sroot.innerHTML = `
				<style>
					:host {
					}
					.category {
						border: 1px solid gray;
						width: 20rem;
						display: inline-block;
					}
					.category > img {
						width: 100%;
					}
					.category .category_name {
						font-weight: bold;
					}
				</style>
				<img src="kpi.png">
				<div class="category">
					<img src="kpi-pie-chart.png">
					<div class="category_name">Completeness</div>
					<span>bla bla bla bla</span>
					<div class="nr_records">123</div>
				</div>
				`;
        customElements.upgrade(sroot);
        this.template = cs_cast(HTMLElement, sroot.querySelector('.category'));
        this.template.remove();
    }
    async refresh(p_session_start_ts, p_dataset_name) {
        console.log(p_session_start_ts);
        console.log(p_dataset_name);
        const resp = await API3.list__catchsolve_noiodh__test_dataset_check_category_failed_recors_vw({
            session_start_ts: p_session_start_ts,
            dataset_name: p_dataset_name
        });
        console.log(resp);
        for (let i = 0; i < resp.length; i++) {
            const cat = cs_cast(HTMLElement, this.template.cloneNode(true));
            cs_cast(HTMLElement, cat.querySelector('.category_name')).textContent = resp[i].check_category;
            cs_cast(HTMLElement, cat.querySelector('.nr_records')).textContent = 'failed ' + resp[i].failed_records + ' / '
                + resp[i].tot_records;
            this.shadowRoot.appendChild(cat);
            cat.onclick = () => {
                location.hash = '#page=summary&session_start_ts=' + p_session_start_ts + '&dataset_name=' + p_dataset_name + '&category_name=' + resp[i].check_category;
            };
            API3.list__catchsolve_noiodh__test_dataset_check_category_check_name_failed_recors_vw({
                session_start_ts: p_session_start_ts,
                dataset_name: p_dataset_name,
                check_category: resp[i].check_category
            }).then((checks) => {
                console.log(checks);
                for (let i2 = 0; i2 < checks.length; i2++) {
                    const div = document.createElement('div');
                    div.textContent = checks[i2].check_name; // + ' ' + checks[i2].failed_records +  ' / ' + checks[i2].tot_records 
                    cat.appendChild(div);
                }
            });
        }
    }
}
customElements.define('cs-dataset-categories', DatasetCategories);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YXNldENhdGVnb3JpZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90eXBlc2NyaXB0L0RhdGFzZXRDYXRlZ29yaWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7R0FHRztBQUdILE9BQU8sRUFBRSxPQUFPLEVBQVksTUFBTSxjQUFjLENBQUM7QUFDakQsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUluQyxNQUFNLE9BQU8saUJBQWtCLFNBQVEsV0FBVztJQUdqRCxRQUFRLENBQUE7SUFFUjtRQUNDLEtBQUssRUFBRSxDQUFBO1FBQ1AsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFBO1FBQ2pELEtBQUssQ0FBQyxTQUFTLEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0tBdUJmLENBQUE7UUFFSCxjQUFjLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBRTdCLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUE7UUFDdEUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtJQUV2QixDQUFDO0lBRUQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxrQkFBMEIsRUFBRSxjQUFzQjtRQUUvRCxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUE7UUFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQTtRQUUzQixNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxxRUFBcUUsQ0FBQztZQUM3RixnQkFBZ0IsRUFBRSxrQkFBa0I7WUFDcEMsWUFBWSxFQUFHLGNBQWM7U0FDN0IsQ0FBQyxDQUFBO1FBQ0YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNqQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFDcEMsQ0FBQztZQUNBLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtZQUMvRCxPQUFPLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFBO1lBQzlGLE9BQU8sQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLFdBQVcsR0FBRyxTQUFTLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsR0FBRyxLQUFLO2tCQUM3RyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFBO1lBQ3JCLElBQUksQ0FBQyxVQUFXLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBRWpDLEdBQUcsQ0FBQyxPQUFPLEdBQUcsR0FBRyxFQUFFO2dCQUNsQixRQUFRLENBQUMsSUFBSSxHQUFHLGlDQUFpQyxHQUFHLGtCQUFrQixHQUFHLGdCQUFnQixHQUFHLGNBQWMsR0FBRyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFBO1lBQ3hKLENBQUMsQ0FBQTtZQUVELElBQUksQ0FBQyxnRkFBZ0YsQ0FBQztnQkFDbkYsZ0JBQWdCLEVBQUUsa0JBQWtCO2dCQUNwQyxZQUFZLEVBQUcsY0FBYztnQkFDN0IsY0FBYyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjO2FBQ3RDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtnQkFDbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtnQkFDbkIsS0FBSyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsRUFBRSxFQUFFLEVBQ3pDLENBQUM7b0JBQ0EsTUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtvQkFDekMsR0FBRyxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFBLENBQUMsdUVBQXVFO29CQUMvRyxHQUFHLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFBO2dCQUNyQixDQUFDO1lBQ0YsQ0FBQyxDQUFDLENBQUE7UUFFTCxDQUFDO0lBQ0YsQ0FBQztDQUNEO0FBRUQsY0FBYyxDQUFDLE1BQU0sQ0FBQyx1QkFBdUIsRUFBRSxpQkFBaUIsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIChDKSAyMDI0IENhdGNoIFNvbHZlIGRpIERhdmlkZSBNb250ZXNpblxuICogTGljZW5zZTogQUdQTFxuICovXG5cblxuaW1wb3J0IHsgY3NfY2FzdCwgdGhyb3dOUEUgfSBmcm9tIFwiLi9xdWFsaXR5LmpzXCI7XG5pbXBvcnQge0FQSTN9IGZyb20gJy4vYXBpL2FwaTMuanMnO1xuaW1wb3J0IHsgT3BlbkNsb3NlU2VjdGlvbiB9IGZyb20gXCIuL09wZW5DbG9zZVNlY3Rpb24uanNcIjtcbmltcG9ydCB7IFNlY3Rpb25Sb3cgfSBmcm9tIFwiLi9TZWN0aW9uUm93LmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBEYXRhc2V0Q2F0ZWdvcmllcyBleHRlbmRzIEhUTUxFbGVtZW50XG57XG5cdFxuXHR0ZW1wbGF0ZVxuXHRcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKVxuXHRcdGNvbnN0IHNyb290ID0gdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSlcblx0XHRzcm9vdC5pbm5lckhUTUwgPSBgXG5cdFx0XHRcdDxzdHlsZT5cblx0XHRcdFx0XHQ6aG9zdCB7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC5jYXRlZ29yeSB7XG5cdFx0XHRcdFx0XHRib3JkZXI6IDFweCBzb2xpZCBncmF5O1xuXHRcdFx0XHRcdFx0d2lkdGg6IDIwcmVtO1xuXHRcdFx0XHRcdFx0ZGlzcGxheTogaW5saW5lLWJsb2NrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQuY2F0ZWdvcnkgPiBpbWcge1xuXHRcdFx0XHRcdFx0d2lkdGg6IDEwMCU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC5jYXRlZ29yeSAuY2F0ZWdvcnlfbmFtZSB7XG5cdFx0XHRcdFx0XHRmb250LXdlaWdodDogYm9sZDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdDwvc3R5bGU+XG5cdFx0XHRcdDxpbWcgc3JjPVwia3BpLnBuZ1wiPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY2F0ZWdvcnlcIj5cblx0XHRcdFx0XHQ8aW1nIHNyYz1cImtwaS1waWUtY2hhcnQucG5nXCI+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNhdGVnb3J5X25hbWVcIj5Db21wbGV0ZW5lc3M8L2Rpdj5cblx0XHRcdFx0XHQ8c3Bhbj5ibGEgYmxhIGJsYSBibGE8L3NwYW4+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm5yX3JlY29yZHNcIj4xMjM8L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdGBcblxuXHRcdGN1c3RvbUVsZW1lbnRzLnVwZ3JhZGUoc3Jvb3QpXG5cdFx0XG5cdFx0dGhpcy50ZW1wbGF0ZSA9IGNzX2Nhc3QoSFRNTEVsZW1lbnQsIHNyb290LnF1ZXJ5U2VsZWN0b3IoJy5jYXRlZ29yeScpKVxuXHRcdHRoaXMudGVtcGxhdGUucmVtb3ZlKClcblx0XHRcblx0fVxuXHRcblx0YXN5bmMgcmVmcmVzaChwX3Nlc3Npb25fc3RhcnRfdHM6IHN0cmluZywgcF9kYXRhc2V0X25hbWU6IHN0cmluZykge1xuXHRcdFxuXHRcdGNvbnNvbGUubG9nKHBfc2Vzc2lvbl9zdGFydF90cylcblx0XHRjb25zb2xlLmxvZyhwX2RhdGFzZXRfbmFtZSlcblx0XHRcblx0XHRjb25zdCByZXNwID0gYXdhaXQgQVBJMy5saXN0X19jYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X2NoZWNrX2NhdGVnb3J5X2ZhaWxlZF9yZWNvcnNfdncoe1xuXHRcdFx0c2Vzc2lvbl9zdGFydF90czogcF9zZXNzaW9uX3N0YXJ0X3RzLFxuXHRcdFx0ZGF0YXNldF9uYW1lIDogcF9kYXRhc2V0X25hbWVcblx0XHR9KVxuXHRcdGNvbnNvbGUubG9nKHJlc3ApIFxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcmVzcC5sZW5ndGg7IGkrKylcblx0XHR7XG5cdFx0XHRjb25zdCBjYXQgPSBjc19jYXN0KEhUTUxFbGVtZW50LCB0aGlzLnRlbXBsYXRlLmNsb25lTm9kZSh0cnVlKSlcblx0XHRcdGNzX2Nhc3QoSFRNTEVsZW1lbnQsIGNhdC5xdWVyeVNlbGVjdG9yKCcuY2F0ZWdvcnlfbmFtZScpKS50ZXh0Q29udGVudCA9IHJlc3BbaV0uY2hlY2tfY2F0ZWdvcnlcblx0XHRcdGNzX2Nhc3QoSFRNTEVsZW1lbnQsIGNhdC5xdWVyeVNlbGVjdG9yKCcubnJfcmVjb3JkcycpKS50ZXh0Q29udGVudCA9ICdmYWlsZWQgJyArIHJlc3BbaV0uZmFpbGVkX3JlY29yZHMgKyAnIC8gJ1xuXHRcdFx0KyByZXNwW2ldLnRvdF9yZWNvcmRzXG5cdFx0XHR0aGlzLnNoYWRvd1Jvb3QhLmFwcGVuZENoaWxkKGNhdClcblx0XHRcdFxuXHRcdFx0Y2F0Lm9uY2xpY2sgPSAoKSA9PiB7XG5cdFx0XHRcdGxvY2F0aW9uLmhhc2ggPSAnI3BhZ2U9c3VtbWFyeSZzZXNzaW9uX3N0YXJ0X3RzPScgKyBwX3Nlc3Npb25fc3RhcnRfdHMgKyAnJmRhdGFzZXRfbmFtZT0nICsgcF9kYXRhc2V0X25hbWUgKyAnJmNhdGVnb3J5X25hbWU9JyArIHJlc3BbaV0uY2hlY2tfY2F0ZWdvcnkgXG5cdFx0XHR9IFxuXHRcdFx0XG5cdFx0XHRBUEkzLmxpc3RfX2NhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfY2hlY2tfY2F0ZWdvcnlfY2hlY2tfbmFtZV9mYWlsZWRfcmVjb3JzX3Z3KHtcblx0XHRcdFx0XHRcdHNlc3Npb25fc3RhcnRfdHM6IHBfc2Vzc2lvbl9zdGFydF90cyxcblx0XHRcdFx0XHRcdGRhdGFzZXRfbmFtZSA6IHBfZGF0YXNldF9uYW1lLFxuXHRcdFx0XHRcdFx0Y2hlY2tfY2F0ZWdvcnk6IHJlc3BbaV0uY2hlY2tfY2F0ZWdvcnlcblx0XHRcdFx0XHR9KS50aGVuKChjaGVja3MpID0+IHtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGNoZWNrcylcblx0XHRcdFx0XHRcdGZvciAobGV0IGkyID0gMDsgaTIgPCBjaGVja3MubGVuZ3RoOyBpMisrKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXHRcdFx0XHRcdFx0XHRkaXYudGV4dENvbnRlbnQgPSBjaGVja3NbaTJdLmNoZWNrX25hbWUgLy8gKyAnICcgKyBjaGVja3NbaTJdLmZhaWxlZF9yZWNvcmRzICsgICcgLyAnICsgY2hlY2tzW2kyXS50b3RfcmVjb3JkcyBcblx0XHRcdFx0XHRcdFx0Y2F0LmFwcGVuZENoaWxkKGRpdilcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KVxuXHRcdFx0XG5cdFx0fVxuXHR9XG59XG5cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgnY3MtZGF0YXNldC1jYXRlZ29yaWVzJywgRGF0YXNldENhdGVnb3JpZXMpXG4iXX0=