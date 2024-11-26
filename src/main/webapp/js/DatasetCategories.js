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
					<details>
						<summary>failed check list</summary>
					</details>
				</div>
				`;
        customElements.upgrade(sroot);
        this.content = sroot;
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
            this.shadowRoot.appendChild(cat);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YXNldENhdGVnb3JpZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90eXBlc2NyaXB0L0RhdGFzZXRDYXRlZ29yaWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7R0FHRztBQUdILE9BQU8sRUFBRSxPQUFPLEVBQVksTUFBTSxjQUFjLENBQUM7QUFDakQsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUduQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBRXJDLE1BQU0sT0FBTyxpQkFBa0IsU0FBUSxXQUFXO0lBR2pELFFBQVEsQ0FBQTtJQUVSLE9BQU8sQ0FBQTtJQUVQO1FBQ0MsS0FBSyxFQUFFLENBQUE7UUFDUCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUE7UUFDakQsS0FBSyxDQUFDLFNBQVMsR0FBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7S0EwQmYsQ0FBQTtRQUVILGNBQWMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDN0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUE7UUFFcEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQTtRQUN0RSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFBO0lBRXZCLENBQUM7SUFFRCxLQUFLLENBQUMsT0FBTyxDQUFDLGtCQUEwQixFQUFFLGNBQXNCO1FBRS9ELE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQTtRQUMvQixPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFBO1FBQzNCLE1BQU0sTUFBTSxHQUFHLElBQUksTUFBTSxFQUFFLENBQUE7UUFDM0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDaEMsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMscUVBQXFFLENBQUM7WUFDN0YsZ0JBQWdCLEVBQUUsa0JBQWtCO1lBQ3BDLFlBQVksRUFBRyxjQUFjO1NBQzdCLENBQUMsQ0FBQTtRQUNGLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQTtRQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDakIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQ3BDLENBQUM7WUFDQSxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7WUFDL0QsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQTtZQUMxRSxRQUFRLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUE7WUFDN0MsT0FBTyxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsV0FBVyxHQUFHLFNBQVMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxHQUFHLEtBQUs7a0JBQzdHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUE7WUFDckIsSUFBSSxDQUFDLFVBQVcsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUE7WUFFakMsUUFBUSxDQUFDLE9BQU8sR0FBRyxHQUFHLEVBQUU7Z0JBQ3ZCLFFBQVEsQ0FBQyxJQUFJLEdBQUcsaUNBQWlDLEdBQUcsa0JBQWtCLEdBQUcsZ0JBQWdCLEdBQUcsY0FBYyxHQUFHLGlCQUFpQixHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUE7WUFDeEosQ0FBQyxDQUFBO1lBRUQsTUFBTSxXQUFXLEdBQUksT0FBTyxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUE7WUFFdkUsSUFBSSxDQUFDLGdGQUFnRixDQUFDO2dCQUNuRixnQkFBZ0IsRUFBRSxrQkFBa0I7Z0JBQ3BDLFlBQVksRUFBRyxjQUFjO2dCQUM3QixjQUFjLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWM7YUFDdEMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO2dCQUNsQixPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFBO2dCQUNuQixLQUFLLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUUsRUFDekMsQ0FBQztvQkFDQSxNQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFBO29CQUN6QyxHQUFHLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUEsQ0FBQyx1RUFBdUU7b0JBQy9HLFdBQVcsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUE7Z0JBQzdCLENBQUM7WUFDRixDQUFDLENBQUMsQ0FBQTtRQUVMLENBQUM7SUFDRixDQUFDO0NBQ0Q7QUFFRCxjQUFjLENBQUMsTUFBTSxDQUFDLHVCQUF1QixFQUFFLGlCQUFpQixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogKEMpIDIwMjQgQ2F0Y2ggU29sdmUgZGkgRGF2aWRlIE1vbnRlc2luXG4gKiBMaWNlbnNlOiBBR1BMXG4gKi9cblxuXG5pbXBvcnQgeyBjc19jYXN0LCB0aHJvd05QRSB9IGZyb20gXCIuL3F1YWxpdHkuanNcIjtcbmltcG9ydCB7QVBJM30gZnJvbSAnLi9hcGkvYXBpMy5qcyc7XG5pbXBvcnQgeyBPcGVuQ2xvc2VTZWN0aW9uIH0gZnJvbSBcIi4vT3BlbkNsb3NlU2VjdGlvbi5qc1wiO1xuaW1wb3J0IHsgU2VjdGlvblJvdyB9IGZyb20gXCIuL1NlY3Rpb25Sb3cuanNcIjtcbmltcG9ydCB7IExvYWRlciB9IGZyb20gXCIuL0xvYWRlci5qc1wiO1xuXG5leHBvcnQgY2xhc3MgRGF0YXNldENhdGVnb3JpZXMgZXh0ZW5kcyBIVE1MRWxlbWVudFxue1xuXHRcblx0dGVtcGxhdGVcblx0XG5cdGNvbnRlbnRcblx0XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKClcblx0XHRjb25zdCBzcm9vdCA9IHRoaXMuYXR0YWNoU2hhZG93KHsgbW9kZTogJ29wZW4nIH0pXG5cdFx0c3Jvb3QuaW5uZXJIVE1MID0gYFxuXHRcdFx0XHQ8c3R5bGU+XG5cdFx0XHRcdFx0Omhvc3Qge1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQuY2F0ZWdvcnkge1xuXHRcdFx0XHRcdFx0Ym9yZGVyOiAxcHggc29saWQgZ3JheTtcblx0XHRcdFx0XHRcdHdpZHRoOiAyMHJlbTtcblx0XHRcdFx0XHRcdGRpc3BsYXk6IGlubGluZS1ibG9jaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0LmNhdGVnb3J5ID4gaW1nIHtcblx0XHRcdFx0XHRcdHdpZHRoOiAxMDAlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQuY2F0ZWdvcnkgLmNhdGVnb3J5X25hbWUge1xuXHRcdFx0XHRcdFx0Zm9udC13ZWlnaHQ6IGJvbGQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQ8L3N0eWxlPlxuXHRcdFx0XHQ8aW1nIHNyYz1cImtwaS5wbmdcIj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImNhdGVnb3J5XCI+XG5cdFx0XHRcdFx0PGltZyBzcmM9XCJrcGktcGllLWNoYXJ0LnBuZ1wiPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjYXRlZ29yeV9uYW1lXCI+Q29tcGxldGVuZXNzPC9kaXY+XG5cdFx0XHRcdFx0PHNwYW4+YmxhIGJsYSBibGEgYmxhPC9zcGFuPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJucl9yZWNvcmRzXCI+MTIzPC9kaXY+XG5cdFx0XHRcdFx0PGRldGFpbHM+XG5cdFx0XHRcdFx0XHQ8c3VtbWFyeT5mYWlsZWQgY2hlY2sgbGlzdDwvc3VtbWFyeT5cblx0XHRcdFx0XHQ8L2RldGFpbHM+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRgXG5cblx0XHRjdXN0b21FbGVtZW50cy51cGdyYWRlKHNyb290KVxuXHRcdHRoaXMuY29udGVudCA9IHNyb290XG5cdFx0XG5cdFx0dGhpcy50ZW1wbGF0ZSA9IGNzX2Nhc3QoSFRNTEVsZW1lbnQsIHNyb290LnF1ZXJ5U2VsZWN0b3IoJy5jYXRlZ29yeScpKVxuXHRcdHRoaXMudGVtcGxhdGUucmVtb3ZlKClcblx0XHRcblx0fVxuXHRcblx0YXN5bmMgcmVmcmVzaChwX3Nlc3Npb25fc3RhcnRfdHM6IHN0cmluZywgcF9kYXRhc2V0X25hbWU6IHN0cmluZykge1xuXHRcdFxuXHRcdGNvbnNvbGUubG9nKHBfc2Vzc2lvbl9zdGFydF90cylcblx0XHRjb25zb2xlLmxvZyhwX2RhdGFzZXRfbmFtZSlcblx0XHRjb25zdCBsb2FkZXIgPSBuZXcgTG9hZGVyKClcblx0XHR0aGlzLmNvbnRlbnQuYXBwZW5kQ2hpbGQobG9hZGVyKVxuXHRcdGNvbnN0IHJlc3AgPSBhd2FpdCBBUEkzLmxpc3RfX2NhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfY2hlY2tfY2F0ZWdvcnlfZmFpbGVkX3JlY29yc192dyh7XG5cdFx0XHRzZXNzaW9uX3N0YXJ0X3RzOiBwX3Nlc3Npb25fc3RhcnRfdHMsXG5cdFx0XHRkYXRhc2V0X25hbWUgOiBwX2RhdGFzZXRfbmFtZVxuXHRcdH0pXG5cdFx0bG9hZGVyLnJlbW92ZSgpXG5cdFx0Y29uc29sZS5sb2cocmVzcCkgXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCByZXNwLmxlbmd0aDsgaSsrKVxuXHRcdHtcblx0XHRcdGNvbnN0IGNhdCA9IGNzX2Nhc3QoSFRNTEVsZW1lbnQsIHRoaXMudGVtcGxhdGUuY2xvbmVOb2RlKHRydWUpKVxuXHRcdFx0Y29uc3QgY2F0X25hbWUgPSBjc19jYXN0KEhUTUxFbGVtZW50LCBjYXQucXVlcnlTZWxlY3RvcignLmNhdGVnb3J5X25hbWUnKSlcblx0XHRcdGNhdF9uYW1lLnRleHRDb250ZW50ID0gcmVzcFtpXS5jaGVja19jYXRlZ29yeVxuXHRcdFx0Y3NfY2FzdChIVE1MRWxlbWVudCwgY2F0LnF1ZXJ5U2VsZWN0b3IoJy5ucl9yZWNvcmRzJykpLnRleHRDb250ZW50ID0gJ2ZhaWxlZCAnICsgcmVzcFtpXS5mYWlsZWRfcmVjb3JkcyArICcgLyAnXG5cdFx0XHQrIHJlc3BbaV0udG90X3JlY29yZHNcblx0XHRcdHRoaXMuc2hhZG93Um9vdCEuYXBwZW5kQ2hpbGQoY2F0KVxuXHRcdFx0XG5cdFx0XHRjYXRfbmFtZS5vbmNsaWNrID0gKCkgPT4ge1xuXHRcdFx0XHRsb2NhdGlvbi5oYXNoID0gJyNwYWdlPXN1bW1hcnkmc2Vzc2lvbl9zdGFydF90cz0nICsgcF9zZXNzaW9uX3N0YXJ0X3RzICsgJyZkYXRhc2V0X25hbWU9JyArIHBfZGF0YXNldF9uYW1lICsgJyZjYXRlZ29yeV9uYW1lPScgKyByZXNwW2ldLmNoZWNrX2NhdGVnb3J5IFxuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRjb25zdCBjYXRfZGV0YWlscyA9ICBjc19jYXN0KEhUTUxFbGVtZW50LCBjYXQucXVlcnlTZWxlY3RvcignZGV0YWlscycpKVxuXHRcdFx0XG5cdFx0XHRBUEkzLmxpc3RfX2NhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfY2hlY2tfY2F0ZWdvcnlfY2hlY2tfbmFtZV9mYWlsZWRfcmVjb3JzX3Z3KHtcblx0XHRcdFx0XHRcdHNlc3Npb25fc3RhcnRfdHM6IHBfc2Vzc2lvbl9zdGFydF90cyxcblx0XHRcdFx0XHRcdGRhdGFzZXRfbmFtZSA6IHBfZGF0YXNldF9uYW1lLFxuXHRcdFx0XHRcdFx0Y2hlY2tfY2F0ZWdvcnk6IHJlc3BbaV0uY2hlY2tfY2F0ZWdvcnlcblx0XHRcdFx0XHR9KS50aGVuKChjaGVja3MpID0+IHtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGNoZWNrcylcblx0XHRcdFx0XHRcdGZvciAobGV0IGkyID0gMDsgaTIgPCBjaGVja3MubGVuZ3RoOyBpMisrKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXHRcdFx0XHRcdFx0XHRkaXYudGV4dENvbnRlbnQgPSBjaGVja3NbaTJdLmNoZWNrX25hbWUgLy8gKyAnICcgKyBjaGVja3NbaTJdLmZhaWxlZF9yZWNvcmRzICsgICcgLyAnICsgY2hlY2tzW2kyXS50b3RfcmVjb3JkcyBcblx0XHRcdFx0XHRcdFx0Y2F0X2RldGFpbHMuYXBwZW5kQ2hpbGQoZGl2KVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcblx0XHR9XG5cdH1cbn1cblxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCdjcy1kYXRhc2V0LWNhdGVnb3JpZXMnLCBEYXRhc2V0Q2F0ZWdvcmllcylcbiJdfQ==