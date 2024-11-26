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
					<details>
						<summary>failed check list</summary>
					</details>
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YXNldENhdGVnb3JpZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90eXBlc2NyaXB0L0RhdGFzZXRDYXRlZ29yaWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7R0FHRztBQUdILE9BQU8sRUFBRSxPQUFPLEVBQVksTUFBTSxjQUFjLENBQUM7QUFDakQsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUluQyxNQUFNLE9BQU8saUJBQWtCLFNBQVEsV0FBVztJQUdqRCxRQUFRLENBQUE7SUFFUjtRQUNDLEtBQUssRUFBRSxDQUFBO1FBQ1AsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFBO1FBQ2pELEtBQUssQ0FBQyxTQUFTLEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0tBMEJmLENBQUE7UUFFSCxjQUFjLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBRTdCLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUE7UUFDdEUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtJQUV2QixDQUFDO0lBRUQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxrQkFBMEIsRUFBRSxjQUFzQjtRQUUvRCxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUE7UUFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQTtRQUUzQixNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxxRUFBcUUsQ0FBQztZQUM3RixnQkFBZ0IsRUFBRSxrQkFBa0I7WUFDcEMsWUFBWSxFQUFHLGNBQWM7U0FDN0IsQ0FBQyxDQUFBO1FBQ0YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNqQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFDcEMsQ0FBQztZQUNBLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtZQUMvRCxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFBO1lBQzFFLFFBQVEsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQTtZQUM3QyxPQUFPLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxXQUFXLEdBQUcsU0FBUyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLEdBQUcsS0FBSztrQkFDN0csSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQTtZQUNyQixJQUFJLENBQUMsVUFBVyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUVqQyxRQUFRLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRTtnQkFDdkIsUUFBUSxDQUFDLElBQUksR0FBRyxpQ0FBaUMsR0FBRyxrQkFBa0IsR0FBRyxnQkFBZ0IsR0FBRyxjQUFjLEdBQUcsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQTtZQUN4SixDQUFDLENBQUE7WUFFRCxNQUFNLFdBQVcsR0FBSSxPQUFPLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQTtZQUV2RSxJQUFJLENBQUMsZ0ZBQWdGLENBQUM7Z0JBQ25GLGdCQUFnQixFQUFFLGtCQUFrQjtnQkFDcEMsWUFBWSxFQUFHLGNBQWM7Z0JBQzdCLGNBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYzthQUN0QyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7Z0JBQ2xCLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUE7Z0JBQ25CLEtBQUssSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLEVBQUUsRUFBRSxFQUN6QyxDQUFDO29CQUNBLE1BQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7b0JBQ3pDLEdBQUcsQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQSxDQUFDLHVFQUF1RTtvQkFDL0csV0FBVyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtnQkFDN0IsQ0FBQztZQUNGLENBQUMsQ0FBQyxDQUFBO1FBRUwsQ0FBQztJQUNGLENBQUM7Q0FDRDtBQUVELGNBQWMsQ0FBQyxNQUFNLENBQUMsdUJBQXVCLEVBQUUsaUJBQWlCLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAoQykgMjAyNCBDYXRjaCBTb2x2ZSBkaSBEYXZpZGUgTW9udGVzaW5cbiAqIExpY2Vuc2U6IEFHUExcbiAqL1xuXG5cbmltcG9ydCB7IGNzX2Nhc3QsIHRocm93TlBFIH0gZnJvbSBcIi4vcXVhbGl0eS5qc1wiO1xuaW1wb3J0IHtBUEkzfSBmcm9tICcuL2FwaS9hcGkzLmpzJztcbmltcG9ydCB7IE9wZW5DbG9zZVNlY3Rpb24gfSBmcm9tIFwiLi9PcGVuQ2xvc2VTZWN0aW9uLmpzXCI7XG5pbXBvcnQgeyBTZWN0aW9uUm93IH0gZnJvbSBcIi4vU2VjdGlvblJvdy5qc1wiO1xuXG5leHBvcnQgY2xhc3MgRGF0YXNldENhdGVnb3JpZXMgZXh0ZW5kcyBIVE1MRWxlbWVudFxue1xuXHRcblx0dGVtcGxhdGVcblx0XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKClcblx0XHRjb25zdCBzcm9vdCA9IHRoaXMuYXR0YWNoU2hhZG93KHsgbW9kZTogJ29wZW4nIH0pXG5cdFx0c3Jvb3QuaW5uZXJIVE1MID0gYFxuXHRcdFx0XHQ8c3R5bGU+XG5cdFx0XHRcdFx0Omhvc3Qge1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQuY2F0ZWdvcnkge1xuXHRcdFx0XHRcdFx0Ym9yZGVyOiAxcHggc29saWQgZ3JheTtcblx0XHRcdFx0XHRcdHdpZHRoOiAyMHJlbTtcblx0XHRcdFx0XHRcdGRpc3BsYXk6IGlubGluZS1ibG9jaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0LmNhdGVnb3J5ID4gaW1nIHtcblx0XHRcdFx0XHRcdHdpZHRoOiAxMDAlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQuY2F0ZWdvcnkgLmNhdGVnb3J5X25hbWUge1xuXHRcdFx0XHRcdFx0Zm9udC13ZWlnaHQ6IGJvbGQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQ8L3N0eWxlPlxuXHRcdFx0XHQ8aW1nIHNyYz1cImtwaS5wbmdcIj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImNhdGVnb3J5XCI+XG5cdFx0XHRcdFx0PGltZyBzcmM9XCJrcGktcGllLWNoYXJ0LnBuZ1wiPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjYXRlZ29yeV9uYW1lXCI+Q29tcGxldGVuZXNzPC9kaXY+XG5cdFx0XHRcdFx0PHNwYW4+YmxhIGJsYSBibGEgYmxhPC9zcGFuPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJucl9yZWNvcmRzXCI+MTIzPC9kaXY+XG5cdFx0XHRcdFx0PGRldGFpbHM+XG5cdFx0XHRcdFx0XHQ8c3VtbWFyeT5mYWlsZWQgY2hlY2sgbGlzdDwvc3VtbWFyeT5cblx0XHRcdFx0XHQ8L2RldGFpbHM+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRgXG5cblx0XHRjdXN0b21FbGVtZW50cy51cGdyYWRlKHNyb290KVxuXHRcdFxuXHRcdHRoaXMudGVtcGxhdGUgPSBjc19jYXN0KEhUTUxFbGVtZW50LCBzcm9vdC5xdWVyeVNlbGVjdG9yKCcuY2F0ZWdvcnknKSlcblx0XHR0aGlzLnRlbXBsYXRlLnJlbW92ZSgpXG5cdFx0XG5cdH1cblx0XG5cdGFzeW5jIHJlZnJlc2gocF9zZXNzaW9uX3N0YXJ0X3RzOiBzdHJpbmcsIHBfZGF0YXNldF9uYW1lOiBzdHJpbmcpIHtcblx0XHRcblx0XHRjb25zb2xlLmxvZyhwX3Nlc3Npb25fc3RhcnRfdHMpXG5cdFx0Y29uc29sZS5sb2cocF9kYXRhc2V0X25hbWUpXG5cdFx0XG5cdFx0Y29uc3QgcmVzcCA9IGF3YWl0IEFQSTMubGlzdF9fY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9jaGVja19jYXRlZ29yeV9mYWlsZWRfcmVjb3JzX3Z3KHtcblx0XHRcdHNlc3Npb25fc3RhcnRfdHM6IHBfc2Vzc2lvbl9zdGFydF90cyxcblx0XHRcdGRhdGFzZXRfbmFtZSA6IHBfZGF0YXNldF9uYW1lXG5cdFx0fSlcblx0XHRjb25zb2xlLmxvZyhyZXNwKSBcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHJlc3AubGVuZ3RoOyBpKyspXG5cdFx0e1xuXHRcdFx0Y29uc3QgY2F0ID0gY3NfY2FzdChIVE1MRWxlbWVudCwgdGhpcy50ZW1wbGF0ZS5jbG9uZU5vZGUodHJ1ZSkpXG5cdFx0XHRjb25zdCBjYXRfbmFtZSA9IGNzX2Nhc3QoSFRNTEVsZW1lbnQsIGNhdC5xdWVyeVNlbGVjdG9yKCcuY2F0ZWdvcnlfbmFtZScpKVxuXHRcdFx0Y2F0X25hbWUudGV4dENvbnRlbnQgPSByZXNwW2ldLmNoZWNrX2NhdGVnb3J5XG5cdFx0XHRjc19jYXN0KEhUTUxFbGVtZW50LCBjYXQucXVlcnlTZWxlY3RvcignLm5yX3JlY29yZHMnKSkudGV4dENvbnRlbnQgPSAnZmFpbGVkICcgKyByZXNwW2ldLmZhaWxlZF9yZWNvcmRzICsgJyAvICdcblx0XHRcdCsgcmVzcFtpXS50b3RfcmVjb3Jkc1xuXHRcdFx0dGhpcy5zaGFkb3dSb290IS5hcHBlbmRDaGlsZChjYXQpXG5cdFx0XHRcblx0XHRcdGNhdF9uYW1lLm9uY2xpY2sgPSAoKSA9PiB7XG5cdFx0XHRcdGxvY2F0aW9uLmhhc2ggPSAnI3BhZ2U9c3VtbWFyeSZzZXNzaW9uX3N0YXJ0X3RzPScgKyBwX3Nlc3Npb25fc3RhcnRfdHMgKyAnJmRhdGFzZXRfbmFtZT0nICsgcF9kYXRhc2V0X25hbWUgKyAnJmNhdGVnb3J5X25hbWU9JyArIHJlc3BbaV0uY2hlY2tfY2F0ZWdvcnkgXG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdGNvbnN0IGNhdF9kZXRhaWxzID0gIGNzX2Nhc3QoSFRNTEVsZW1lbnQsIGNhdC5xdWVyeVNlbGVjdG9yKCdkZXRhaWxzJykpXG5cdFx0XHRcblx0XHRcdEFQSTMubGlzdF9fY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9jaGVja19jYXRlZ29yeV9jaGVja19uYW1lX2ZhaWxlZF9yZWNvcnNfdncoe1xuXHRcdFx0XHRcdFx0c2Vzc2lvbl9zdGFydF90czogcF9zZXNzaW9uX3N0YXJ0X3RzLFxuXHRcdFx0XHRcdFx0ZGF0YXNldF9uYW1lIDogcF9kYXRhc2V0X25hbWUsXG5cdFx0XHRcdFx0XHRjaGVja19jYXRlZ29yeTogcmVzcFtpXS5jaGVja19jYXRlZ29yeVxuXHRcdFx0XHRcdH0pLnRoZW4oKGNoZWNrcykgPT4ge1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coY2hlY2tzKVxuXHRcdFx0XHRcdFx0Zm9yIChsZXQgaTIgPSAwOyBpMiA8IGNoZWNrcy5sZW5ndGg7IGkyKyspXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG5cdFx0XHRcdFx0XHRcdGRpdi50ZXh0Q29udGVudCA9IGNoZWNrc1tpMl0uY2hlY2tfbmFtZSAvLyArICcgJyArIGNoZWNrc1tpMl0uZmFpbGVkX3JlY29yZHMgKyAgJyAvICcgKyBjaGVja3NbaTJdLnRvdF9yZWNvcmRzIFxuXHRcdFx0XHRcdFx0XHRjYXRfZGV0YWlscy5hcHBlbmRDaGlsZChkaXYpXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSlcblx0XHRcdFxuXHRcdH1cblx0fVxufVxuXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ2NzLWRhdGFzZXQtY2F0ZWdvcmllcycsIERhdGFzZXRDYXRlZ29yaWVzKVxuIl19