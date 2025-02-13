/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */
import { cs_cast } from "./quality.js";
import { API3 } from './api/api3.js';
import { Loader } from "./Loader.js";
import { DatasetIssueCategoryComponent } from "./DatasetIssueCategoryComponent.js";
import { GeneralInfoAndSettings } from "./GeneralInfoAndSettings.js";
export class DatasetIssuesByCategories extends HTMLElement {
    content;
    connected_promise;
    connected_func = s => null;
    connectedCallback() {
        console.log('connected');
        this.connected_func(null);
    }
    sroot;
    info_and_settings;
    noissues;
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
								display: flex;
								align-items: start;
							}
							.frame .content {
								flex-grow: 100;
								display: flex;
								align-items: start;
							}
							.chartdiv {
								width:  100px;
								height: 100px;
								margin: auto;
							}
							details > *:nth-child(even) {
							  background-color: #ccc;
							}
							
							.content > * {
								margin-top: 1rem;
								margin-left: 1rem;
							}
							.noissues {
								display: none;
							}
						</style>
						<div class="frame">
							<div class="noissues">sound good, no problems found here!</div>
							<div class="content"></div>
							<cs-general-info-and-settings></cs-general-info-and-settings>
							<!--<img src="kpi-general-info.png">-->
						</div>
						`;
        customElements.upgrade(this.sroot);
        this.content = cs_cast(HTMLElement, this.sroot.querySelector('.content'));
        this.info_and_settings = cs_cast(GeneralInfoAndSettings, this.sroot.querySelector('cs-general-info-and-settings'));
        this.noissues = cs_cast(HTMLDivElement, this.sroot.querySelector('.noissues'));
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
            const category = new DatasetIssueCategoryComponent();
            this.content.appendChild(category);
            category.refresh(resp[i]);
        }
        this.noissues.style.display = resp.length == 0 ? 'block' : 'none';
    }
}
customElements.define('cs-dataset-categories', DatasetIssuesByCategories);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YXNldElzc3Vlc0J5Q2F0ZWdvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3R5cGVzY3JpcHQvRGF0YXNldElzc3Vlc0J5Q2F0ZWdvcmllcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFHSCxPQUFPLEVBQUUsT0FBTyxFQUFZLE1BQU0sY0FBYyxDQUFDO0FBQ2pELE9BQU8sRUFBQyxJQUFJLEVBQXVFLE1BQU0sZUFBZSxDQUFDO0FBR3pHLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFFckMsT0FBTyxFQUFFLDZCQUE2QixFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFDbkYsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFFckUsTUFBTSxPQUFPLHlCQUEwQixTQUFRLFdBQVc7SUFHekQsT0FBTyxDQUFBO0lBRVAsaUJBQWlCLENBQUE7SUFDakIsY0FBYyxHQUFzQixDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQTtJQUU3QyxpQkFBaUI7UUFFaEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUN4QixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQzFCLENBQUM7SUFFRCxLQUFLLENBQUE7SUFFTCxpQkFBaUIsQ0FBQTtJQUVqQixRQUFRLENBQUE7SUFFUjtRQUNDLEtBQUssRUFBRSxDQUFBO1FBQ1AsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUMsQ0FBQTtRQUNsRSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQTtRQUNoRCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BZ0RsQixDQUFDO1FBQ04sY0FBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbkMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDMUUsSUFBSSxDQUFDLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUM7UUFFbkgsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUE7SUFDL0UsQ0FBQztJQUVELEtBQUssQ0FBQyxPQUFPLENBQUMsa0JBQTBCLEVBQUUsY0FBc0IsRUFBRSxnQkFBd0IsRUFBRSxhQUFxQjtRQUVoSCxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLGtCQUFrQixFQUFFLGNBQWMsRUFBRSxnQkFBZ0IsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUVwRyxNQUFNLE1BQU0sR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFBO1FBQzNCLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ2hDLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLHFFQUFxRSxDQUFDO1lBQzdGLGdCQUFnQixFQUFFLGtCQUFrQjtZQUNwQyxZQUFZLEVBQUcsY0FBYztTQUM3QixDQUFDLENBQUE7UUFDRixNQUFNLENBQUMsTUFBTSxFQUFFLENBQUE7UUFDZixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ2pCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUNwQyxDQUFDO1lBQ0EsTUFBTSxRQUFRLEdBQUcsSUFBSSw2QkFBNkIsRUFBRSxDQUFDO1lBQ3JELElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ25DLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDMUIsQ0FBQztRQUNELElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFFbkUsQ0FBQztDQUdEO0FBRUQsY0FBYyxDQUFDLE1BQU0sQ0FBQyx1QkFBdUIsRUFBRSx5QkFBeUIsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIChDKSAyMDI0IENhdGNoIFNvbHZlIGRpIERhdmlkZSBNb250ZXNpblxuICogTGljZW5zZTogQUdQTFxuICovXG5cblxuaW1wb3J0IHsgY3NfY2FzdCwgdGhyb3dOUEUgfSBmcm9tIFwiLi9xdWFsaXR5LmpzXCI7XG5pbXBvcnQge0FQSTMsIGNhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfY2hlY2tfY2F0ZWdvcnlfZmFpbGVkX3JlY29yc192d19fcm93fSBmcm9tICcuL2FwaS9hcGkzLmpzJztcbmltcG9ydCB7IE9wZW5DbG9zZVNlY3Rpb24gfSBmcm9tIFwiLi9PcGVuQ2xvc2VTZWN0aW9uLmpzXCI7XG5pbXBvcnQgeyBTZWN0aW9uUm93IH0gZnJvbSBcIi4vU2VjdGlvblJvdy5qc1wiO1xuaW1wb3J0IHsgTG9hZGVyIH0gZnJvbSBcIi4vTG9hZGVyLmpzXCI7XG5pbXBvcnQgeyBMYWJlbEFuZERhdGEgfSBmcm9tIFwiLi9MYWJlbEFuZERhdGEuanNcIjtcbmltcG9ydCB7IERhdGFzZXRJc3N1ZUNhdGVnb3J5Q29tcG9uZW50IH0gZnJvbSBcIi4vRGF0YXNldElzc3VlQ2F0ZWdvcnlDb21wb25lbnQuanNcIjtcbmltcG9ydCB7IEdlbmVyYWxJbmZvQW5kU2V0dGluZ3MgfSBmcm9tIFwiLi9HZW5lcmFsSW5mb0FuZFNldHRpbmdzLmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBEYXRhc2V0SXNzdWVzQnlDYXRlZ29yaWVzIGV4dGVuZHMgSFRNTEVsZW1lbnRcbntcblx0XG5cdGNvbnRlbnRcblx0XG5cdGNvbm5lY3RlZF9wcm9taXNlXG5cdGNvbm5lY3RlZF9mdW5jOiAoczogbnVsbCkgPT4gdm9pZCA9IHMgPT4gbnVsbFxuXHRcblx0Y29ubmVjdGVkQ2FsbGJhY2soKVxuXHR7XG5cdFx0Y29uc29sZS5sb2coJ2Nvbm5lY3RlZCcpXG5cdFx0dGhpcy5jb25uZWN0ZWRfZnVuYyhudWxsKVxuXHR9XG5cdFxuXHRzcm9vdFxuXHRcblx0aW5mb19hbmRfc2V0dGluZ3Ncblx0XG5cdG5vaXNzdWVzXG5cdFxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpXG5cdFx0dGhpcy5jb25uZWN0ZWRfcHJvbWlzZSA9IG5ldyBQcm9taXNlKHMgPT4gdGhpcy5jb25uZWN0ZWRfZnVuYyA9IHMpXG5cdFx0dGhpcy5zcm9vdCA9IHRoaXMuYXR0YWNoU2hhZG93KHsgbW9kZTogJ29wZW4nIH0pXG5cdFx0dGhpcy5zcm9vdC5pbm5lckhUTUwgPSBgXG5cdFx0XHRcdFx0XHQ8c3R5bGU+XG5cdFx0XHRcdFx0XHRcdDpob3N0IHtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHQuY2F0ZWdvcnkge1xuXHRcdFx0XHRcdFx0XHRcdGJvcmRlcjogMXB4IHNvbGlkIGdyYXk7XG5cdFx0XHRcdFx0XHRcdFx0d2lkdGg6IDEycmVtO1xuXHRcdFx0XHRcdFx0XHRcdGRpc3BsYXk6IGlubGluZS1ibG9jaztcblx0XHRcdFx0XHRcdFx0XHRtYXJnaW46IDFyZW07XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0LmNhdGVnb3J5ID4gaW1nIHtcblx0XHRcdFx0XHRcdFx0XHR3aWR0aDogMTAwJTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHQuY2F0ZWdvcnkgLmNhdGVnb3J5X25hbWUge1xuXHRcdFx0XHRcdFx0XHRcdGZvbnQtd2VpZ2h0OiBib2xkO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdC5mcmFtZSB7XG5cdFx0XHRcdFx0XHRcdFx0ZGlzcGxheTogZmxleDtcblx0XHRcdFx0XHRcdFx0XHRhbGlnbi1pdGVtczogc3RhcnQ7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0LmZyYW1lIC5jb250ZW50IHtcblx0XHRcdFx0XHRcdFx0XHRmbGV4LWdyb3c6IDEwMDtcblx0XHRcdFx0XHRcdFx0XHRkaXNwbGF5OiBmbGV4O1xuXHRcdFx0XHRcdFx0XHRcdGFsaWduLWl0ZW1zOiBzdGFydDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHQuY2hhcnRkaXYge1xuXHRcdFx0XHRcdFx0XHRcdHdpZHRoOiAgMTAwcHg7XG5cdFx0XHRcdFx0XHRcdFx0aGVpZ2h0OiAxMDBweDtcblx0XHRcdFx0XHRcdFx0XHRtYXJnaW46IGF1dG87XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0ZGV0YWlscyA+ICo6bnRoLWNoaWxkKGV2ZW4pIHtcblx0XHRcdFx0XHRcdFx0ICBiYWNrZ3JvdW5kLWNvbG9yOiAjY2NjO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHQuY29udGVudCA+ICoge1xuXHRcdFx0XHRcdFx0XHRcdG1hcmdpbi10b3A6IDFyZW07XG5cdFx0XHRcdFx0XHRcdFx0bWFyZ2luLWxlZnQ6IDFyZW07XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0Lm5vaXNzdWVzIHtcblx0XHRcdFx0XHRcdFx0XHRkaXNwbGF5OiBub25lO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQ8L3N0eWxlPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImZyYW1lXCI+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJub2lzc3Vlc1wiPnNvdW5kIGdvb2QsIG5vIHByb2JsZW1zIGZvdW5kIGhlcmUhPC9kaXY+XG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjb250ZW50XCI+PC9kaXY+XG5cdFx0XHRcdFx0XHRcdDxjcy1nZW5lcmFsLWluZm8tYW5kLXNldHRpbmdzPjwvY3MtZ2VuZXJhbC1pbmZvLWFuZC1zZXR0aW5ncz5cblx0XHRcdFx0XHRcdFx0PCEtLTxpbWcgc3JjPVwia3BpLWdlbmVyYWwtaW5mby5wbmdcIj4tLT5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0YDtcblx0XHRjdXN0b21FbGVtZW50cy51cGdyYWRlKHRoaXMuc3Jvb3QpO1xuXHRcdHRoaXMuY29udGVudCA9IGNzX2Nhc3QoSFRNTEVsZW1lbnQsIHRoaXMuc3Jvb3QucXVlcnlTZWxlY3RvcignLmNvbnRlbnQnKSk7XG5cdFx0dGhpcy5pbmZvX2FuZF9zZXR0aW5ncyA9IGNzX2Nhc3QoR2VuZXJhbEluZm9BbmRTZXR0aW5ncywgdGhpcy5zcm9vdC5xdWVyeVNlbGVjdG9yKCdjcy1nZW5lcmFsLWluZm8tYW5kLXNldHRpbmdzJykpO1xuXG5cdFx0dGhpcy5ub2lzc3VlcyA9IGNzX2Nhc3QoSFRNTERpdkVsZW1lbnQsIHRoaXMuc3Jvb3QucXVlcnlTZWxlY3RvcignLm5vaXNzdWVzJykpXG5cdH1cblx0XG5cdGFzeW5jIHJlZnJlc2gocF9zZXNzaW9uX3N0YXJ0X3RzOiBzdHJpbmcsIHBfZGF0YXNldF9uYW1lOiBzdHJpbmcsIHBfZmFpbGVkX3JlY29yZHM6IG51bWJlciwgcF90b3RfcmVjb3JkczogbnVtYmVyKSB7XG5cdFx0XG5cdFx0dGhpcy5pbmZvX2FuZF9zZXR0aW5ncy5yZWZyZXNoKHBfc2Vzc2lvbl9zdGFydF90cywgcF9kYXRhc2V0X25hbWUsIHBfZmFpbGVkX3JlY29yZHMsIHBfdG90X3JlY29yZHMpO1xuXHRcdFxuXHRcdGNvbnN0IGxvYWRlciA9IG5ldyBMb2FkZXIoKVxuXHRcdHRoaXMuY29udGVudC5hcHBlbmRDaGlsZChsb2FkZXIpXG5cdFx0Y29uc3QgcmVzcCA9IGF3YWl0IEFQSTMubGlzdF9fY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9jaGVja19jYXRlZ29yeV9mYWlsZWRfcmVjb3JzX3Z3KHtcblx0XHRcdHNlc3Npb25fc3RhcnRfdHM6IHBfc2Vzc2lvbl9zdGFydF90cyxcblx0XHRcdGRhdGFzZXRfbmFtZSA6IHBfZGF0YXNldF9uYW1lXG5cdFx0fSlcblx0XHRsb2FkZXIucmVtb3ZlKClcblx0XHRjb25zb2xlLmxvZyhyZXNwKSBcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHJlc3AubGVuZ3RoOyBpKyspXG5cdFx0e1xuXHRcdFx0Y29uc3QgY2F0ZWdvcnkgPSBuZXcgRGF0YXNldElzc3VlQ2F0ZWdvcnlDb21wb25lbnQoKTtcblx0XHRcdHRoaXMuY29udGVudC5hcHBlbmRDaGlsZChjYXRlZ29yeSk7XG5cdFx0XHRjYXRlZ29yeS5yZWZyZXNoKHJlc3BbaV0pXG5cdFx0fVxuXHRcdHRoaXMubm9pc3N1ZXMuc3R5bGUuZGlzcGxheSA9IHJlc3AubGVuZ3RoID09IDAgPyAnYmxvY2snIDogJ25vbmUnO1xuXHRcdFx0XG5cdH1cblxuXG59XG5cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgnY3MtZGF0YXNldC1jYXRlZ29yaWVzJywgRGF0YXNldElzc3Vlc0J5Q2F0ZWdvcmllcylcblxuIl19