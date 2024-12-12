/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */
import { cs_cast } from "./quality.js";
import { API3 } from './api/api3.js';
import { Loader } from "./Loader.js";
import { DatasetIssueCategory } from "./DatasetIssueCategory.js";
import { GeneralInfoAndSettings } from "./GeneralInfoAndSettings.js";
export class DatasetCategories extends HTMLElement {
    content;
    connected_promise;
    connected_func = s => null;
    connectedCallback() {
        console.log('connected');
        this.connected_func(null);
    }
    sroot;
    info_and_settings;
    constructor() {
        super();
        this.connected_promise = new Promise(s => this.connected_func = s);
        this.sroot = this.attachShadow({ mode: 'open' });
        this.sroot.innerHTML = `
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
							<cs-general-info-and-settings></cs-general-info-and-settings>
							<!--<img src="kpi-general-info.png">-->
						</div>
						`;
        customElements.upgrade(this.sroot);
        this.content = cs_cast(HTMLElement, this.sroot.querySelector('.content'));
        this.info_and_settings = cs_cast(GeneralInfoAndSettings, this.sroot.querySelector('cs-general-info-and-settings'));
    }
    async refresh(p_session_start_ts, p_dataset_name, p_failed_records, p_tot_records) {
        this.info_and_settings.refresh(p_session_start_ts, p_dataset_name, p_failed_records, p_tot_records);
        const loader = new Loader();
        this.content.appendChild(loader);
        const resp = await API3.list__catchsolve_noiodh__test_dataset_check_category_failed_recors_vw({
            session_start_ts: p_session_start_ts,
            dataset_name: p_dataset_name
        });
        loader.remove();
        console.log(resp);
        for (let i = 0; i < resp.length; i++) {
            const category = new DatasetIssueCategory();
            this.content.appendChild(category);
            category.refresh(resp[i]);
        }
    }
}
customElements.define('cs-dataset-categories', DatasetCategories);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YXNldENhdGVnb3JpZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90eXBlc2NyaXB0L0RhdGFzZXRDYXRlZ29yaWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7R0FHRztBQUdILE9BQU8sRUFBRSxPQUFPLEVBQVksTUFBTSxjQUFjLENBQUM7QUFDakQsT0FBTyxFQUFDLElBQUksRUFBdUUsTUFBTSxlQUFlLENBQUM7QUFHekcsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUVyQyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNqRSxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUVyRSxNQUFNLE9BQU8saUJBQWtCLFNBQVEsV0FBVztJQUdqRCxPQUFPLENBQUE7SUFFUCxpQkFBaUIsQ0FBQTtJQUNqQixjQUFjLEdBQXNCLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFBO0lBRTdDLGlCQUFpQjtRQUVoQixPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBQ3hCLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDMUIsQ0FBQztJQUVELEtBQUssQ0FBQTtJQUVMLGlCQUFpQixDQUFBO0lBRWpCO1FBQ0MsS0FBSyxFQUFFLENBQUE7UUFDUCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsY0FBYyxHQUFHLENBQUMsQ0FBQyxDQUFBO1FBQ2xFLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFBO1FBQ2hELElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BcUNsQixDQUFDO1FBQ04sY0FBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbkMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDMUUsSUFBSSxDQUFDLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUM7SUFFcEgsQ0FBQztJQUVELEtBQUssQ0FBQyxPQUFPLENBQUMsa0JBQTBCLEVBQUUsY0FBc0IsRUFBRSxnQkFBd0IsRUFBRSxhQUFxQjtRQUVoSCxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLGtCQUFrQixFQUFFLGNBQWMsRUFBRSxnQkFBZ0IsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUVwRyxNQUFNLE1BQU0sR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFBO1FBQzNCLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ2hDLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLHFFQUFxRSxDQUFDO1lBQzdGLGdCQUFnQixFQUFFLGtCQUFrQjtZQUNwQyxZQUFZLEVBQUcsY0FBYztTQUM3QixDQUFDLENBQUE7UUFDRixNQUFNLENBQUMsTUFBTSxFQUFFLENBQUE7UUFDZixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ2pCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUNwQyxDQUFDO1lBQ0EsTUFBTSxRQUFRLEdBQUcsSUFBSSxvQkFBb0IsRUFBRSxDQUFDO1lBQzVDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ25DLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFFMUIsQ0FBQztJQUNGLENBQUM7Q0FHRDtBQUVELGNBQWMsQ0FBQyxNQUFNLENBQUMsdUJBQXVCLEVBQUUsaUJBQWlCLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAoQykgMjAyNCBDYXRjaCBTb2x2ZSBkaSBEYXZpZGUgTW9udGVzaW5cbiAqIExpY2Vuc2U6IEFHUExcbiAqL1xuXG5cbmltcG9ydCB7IGNzX2Nhc3QsIHRocm93TlBFIH0gZnJvbSBcIi4vcXVhbGl0eS5qc1wiO1xuaW1wb3J0IHtBUEkzLCBjYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X2NoZWNrX2NhdGVnb3J5X2ZhaWxlZF9yZWNvcnNfdndfX3Jvd30gZnJvbSAnLi9hcGkvYXBpMy5qcyc7XG5pbXBvcnQgeyBPcGVuQ2xvc2VTZWN0aW9uIH0gZnJvbSBcIi4vT3BlbkNsb3NlU2VjdGlvbi5qc1wiO1xuaW1wb3J0IHsgU2VjdGlvblJvdyB9IGZyb20gXCIuL1NlY3Rpb25Sb3cuanNcIjtcbmltcG9ydCB7IExvYWRlciB9IGZyb20gXCIuL0xvYWRlci5qc1wiO1xuaW1wb3J0IHsgTGFiZWxBbmREYXRhIH0gZnJvbSBcIi4vTGFiZWxBbmREYXRhLmpzXCI7XG5pbXBvcnQgeyBEYXRhc2V0SXNzdWVDYXRlZ29yeSB9IGZyb20gXCIuL0RhdGFzZXRJc3N1ZUNhdGVnb3J5LmpzXCI7XG5pbXBvcnQgeyBHZW5lcmFsSW5mb0FuZFNldHRpbmdzIH0gZnJvbSBcIi4vR2VuZXJhbEluZm9BbmRTZXR0aW5ncy5qc1wiO1xuXG5leHBvcnQgY2xhc3MgRGF0YXNldENhdGVnb3JpZXMgZXh0ZW5kcyBIVE1MRWxlbWVudFxue1xuXHRcblx0Y29udGVudFxuXHRcblx0Y29ubmVjdGVkX3Byb21pc2Vcblx0Y29ubmVjdGVkX2Z1bmM6IChzOiBudWxsKSA9PiB2b2lkID0gcyA9PiBudWxsXG5cdFxuXHRjb25uZWN0ZWRDYWxsYmFjaygpXG5cdHtcblx0XHRjb25zb2xlLmxvZygnY29ubmVjdGVkJylcblx0XHR0aGlzLmNvbm5lY3RlZF9mdW5jKG51bGwpXG5cdH1cblx0XG5cdHNyb290XG5cdFxuXHRpbmZvX2FuZF9zZXR0aW5nc1xuXHRcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKVxuXHRcdHRoaXMuY29ubmVjdGVkX3Byb21pc2UgPSBuZXcgUHJvbWlzZShzID0+IHRoaXMuY29ubmVjdGVkX2Z1bmMgPSBzKVxuXHRcdHRoaXMuc3Jvb3QgPSB0aGlzLmF0dGFjaFNoYWRvdyh7IG1vZGU6ICdvcGVuJyB9KVxuXHRcdHRoaXMuc3Jvb3QuaW5uZXJIVE1MID0gYFxuXHRcdFx0XHRcdFx0PHN0eWxlPlxuXHRcdFx0XHRcdFx0XHQ6aG9zdCB7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0LmNhdGVnb3J5IHtcblx0XHRcdFx0XHRcdFx0XHRib3JkZXI6IDFweCBzb2xpZCBncmF5O1xuXHRcdFx0XHRcdFx0XHRcdHdpZHRoOiAxMnJlbTtcblx0XHRcdFx0XHRcdFx0XHRkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG5cdFx0XHRcdFx0XHRcdFx0bWFyZ2luOiAxcmVtO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdC5jYXRlZ29yeSA+IGltZyB7XG5cdFx0XHRcdFx0XHRcdFx0d2lkdGg6IDEwMCU7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0LmNhdGVnb3J5IC5jYXRlZ29yeV9uYW1lIHtcblx0XHRcdFx0XHRcdFx0XHRmb250LXdlaWdodDogYm9sZDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHQuZnJhbWUge1xuXHRcdFx0XHRcdFx0XHRcdGRpc3BsYXk6IGZsZXhcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHQuZnJhbWUgLmNvbnRlbnQge1xuXHRcdFx0XHRcdFx0XHRcdGZsZXgtZ3JvdzogMTAwO1xuXHRcdFx0XHRcdFx0XHRcdGRpc3BsYXk6IGZsZXg7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0LmNoYXJ0ZGl2IHtcblx0XHRcdFx0XHRcdFx0XHR3aWR0aDogIDEwMHB4O1xuXHRcdFx0XHRcdFx0XHRcdGhlaWdodDogMTAwcHg7XG5cdFx0XHRcdFx0XHRcdFx0bWFyZ2luOiBhdXRvO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGRldGFpbHMgPiAqOm50aC1jaGlsZChldmVuKSB7XG5cdFx0XHRcdFx0XHRcdCAgYmFja2dyb3VuZC1jb2xvcjogI2NjYztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0PC9zdHlsZT5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJmcmFtZVwiPlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY29udGVudFwiPjwvZGl2PlxuXHRcdFx0XHRcdFx0XHQ8Y3MtZ2VuZXJhbC1pbmZvLWFuZC1zZXR0aW5ncz48L2NzLWdlbmVyYWwtaW5mby1hbmQtc2V0dGluZ3M+XG5cdFx0XHRcdFx0XHRcdDwhLS08aW1nIHNyYz1cImtwaS1nZW5lcmFsLWluZm8ucG5nXCI+LS0+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdGA7XG5cdFx0Y3VzdG9tRWxlbWVudHMudXBncmFkZSh0aGlzLnNyb290KTtcblx0XHR0aGlzLmNvbnRlbnQgPSBjc19jYXN0KEhUTUxFbGVtZW50LCB0aGlzLnNyb290LnF1ZXJ5U2VsZWN0b3IoJy5jb250ZW50JykpO1xuXHRcdHRoaXMuaW5mb19hbmRfc2V0dGluZ3MgPSBjc19jYXN0KEdlbmVyYWxJbmZvQW5kU2V0dGluZ3MsIHRoaXMuc3Jvb3QucXVlcnlTZWxlY3RvcignY3MtZ2VuZXJhbC1pbmZvLWFuZC1zZXR0aW5ncycpKTtcblxuXHR9XG5cdFxuXHRhc3luYyByZWZyZXNoKHBfc2Vzc2lvbl9zdGFydF90czogc3RyaW5nLCBwX2RhdGFzZXRfbmFtZTogc3RyaW5nLCBwX2ZhaWxlZF9yZWNvcmRzOiBudW1iZXIsIHBfdG90X3JlY29yZHM6IG51bWJlcikge1xuXHRcdFxuXHRcdHRoaXMuaW5mb19hbmRfc2V0dGluZ3MucmVmcmVzaChwX3Nlc3Npb25fc3RhcnRfdHMsIHBfZGF0YXNldF9uYW1lLCBwX2ZhaWxlZF9yZWNvcmRzLCBwX3RvdF9yZWNvcmRzKTtcblx0XHRcblx0XHRjb25zdCBsb2FkZXIgPSBuZXcgTG9hZGVyKClcblx0XHR0aGlzLmNvbnRlbnQuYXBwZW5kQ2hpbGQobG9hZGVyKVxuXHRcdGNvbnN0IHJlc3AgPSBhd2FpdCBBUEkzLmxpc3RfX2NhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfY2hlY2tfY2F0ZWdvcnlfZmFpbGVkX3JlY29yc192dyh7XG5cdFx0XHRzZXNzaW9uX3N0YXJ0X3RzOiBwX3Nlc3Npb25fc3RhcnRfdHMsXG5cdFx0XHRkYXRhc2V0X25hbWUgOiBwX2RhdGFzZXRfbmFtZVxuXHRcdH0pXG5cdFx0bG9hZGVyLnJlbW92ZSgpXG5cdFx0Y29uc29sZS5sb2cocmVzcCkgXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCByZXNwLmxlbmd0aDsgaSsrKVxuXHRcdHtcblx0XHRcdGNvbnN0IGNhdGVnb3J5ID0gbmV3IERhdGFzZXRJc3N1ZUNhdGVnb3J5KCk7XG5cdFx0XHR0aGlzLmNvbnRlbnQuYXBwZW5kQ2hpbGQoY2F0ZWdvcnkpO1xuXHRcdFx0Y2F0ZWdvcnkucmVmcmVzaChyZXNwW2ldKVxuXHRcdFx0XG5cdFx0fVxuXHR9XG5cblxufVxuXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ2NzLWRhdGFzZXQtY2F0ZWdvcmllcycsIERhdGFzZXRDYXRlZ29yaWVzKVxuXG4iXX0=