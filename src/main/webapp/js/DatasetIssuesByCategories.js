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
							
							.content > * {
								margin-top: 1rem;
								margin-left: 1rem;
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
            const category = new DatasetIssueCategoryComponent();
            this.content.appendChild(category);
            category.refresh(resp[i]);
        }
    }
}
customElements.define('cs-dataset-categories', DatasetIssuesByCategories);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YXNldElzc3Vlc0J5Q2F0ZWdvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3R5cGVzY3JpcHQvRGF0YXNldElzc3Vlc0J5Q2F0ZWdvcmllcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFHSCxPQUFPLEVBQUUsT0FBTyxFQUFZLE1BQU0sY0FBYyxDQUFDO0FBQ2pELE9BQU8sRUFBQyxJQUFJLEVBQXVFLE1BQU0sZUFBZSxDQUFDO0FBR3pHLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFFckMsT0FBTyxFQUFFLDZCQUE2QixFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFDbkYsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFFckUsTUFBTSxPQUFPLHlCQUEwQixTQUFRLFdBQVc7SUFHekQsT0FBTyxDQUFBO0lBRVAsaUJBQWlCLENBQUE7SUFDakIsY0FBYyxHQUFzQixDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQTtJQUU3QyxpQkFBaUI7UUFFaEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUN4QixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQzFCLENBQUM7SUFFRCxLQUFLLENBQUE7SUFFTCxpQkFBaUIsQ0FBQTtJQUVqQjtRQUNDLEtBQUssRUFBRSxDQUFBO1FBQ1AsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUMsQ0FBQTtRQUNsRSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQTtRQUNoRCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BMENsQixDQUFDO1FBQ04sY0FBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbkMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDMUUsSUFBSSxDQUFDLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUM7SUFFcEgsQ0FBQztJQUVELEtBQUssQ0FBQyxPQUFPLENBQUMsa0JBQTBCLEVBQUUsY0FBc0IsRUFBRSxnQkFBd0IsRUFBRSxhQUFxQjtRQUVoSCxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLGtCQUFrQixFQUFFLGNBQWMsRUFBRSxnQkFBZ0IsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUVwRyxNQUFNLE1BQU0sR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFBO1FBQzNCLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ2hDLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLHFFQUFxRSxDQUFDO1lBQzdGLGdCQUFnQixFQUFFLGtCQUFrQjtZQUNwQyxZQUFZLEVBQUcsY0FBYztTQUM3QixDQUFDLENBQUE7UUFDRixNQUFNLENBQUMsTUFBTSxFQUFFLENBQUE7UUFDZixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ2pCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUNwQyxDQUFDO1lBQ0EsTUFBTSxRQUFRLEdBQUcsSUFBSSw2QkFBNkIsRUFBRSxDQUFDO1lBQ3JELElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ25DLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFFMUIsQ0FBQztJQUNGLENBQUM7Q0FHRDtBQUVELGNBQWMsQ0FBQyxNQUFNLENBQUMsdUJBQXVCLEVBQUUseUJBQXlCLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAoQykgMjAyNCBDYXRjaCBTb2x2ZSBkaSBEYXZpZGUgTW9udGVzaW5cbiAqIExpY2Vuc2U6IEFHUExcbiAqL1xuXG5cbmltcG9ydCB7IGNzX2Nhc3QsIHRocm93TlBFIH0gZnJvbSBcIi4vcXVhbGl0eS5qc1wiO1xuaW1wb3J0IHtBUEkzLCBjYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X2NoZWNrX2NhdGVnb3J5X2ZhaWxlZF9yZWNvcnNfdndfX3Jvd30gZnJvbSAnLi9hcGkvYXBpMy5qcyc7XG5pbXBvcnQgeyBPcGVuQ2xvc2VTZWN0aW9uIH0gZnJvbSBcIi4vT3BlbkNsb3NlU2VjdGlvbi5qc1wiO1xuaW1wb3J0IHsgU2VjdGlvblJvdyB9IGZyb20gXCIuL1NlY3Rpb25Sb3cuanNcIjtcbmltcG9ydCB7IExvYWRlciB9IGZyb20gXCIuL0xvYWRlci5qc1wiO1xuaW1wb3J0IHsgTGFiZWxBbmREYXRhIH0gZnJvbSBcIi4vTGFiZWxBbmREYXRhLmpzXCI7XG5pbXBvcnQgeyBEYXRhc2V0SXNzdWVDYXRlZ29yeUNvbXBvbmVudCB9IGZyb20gXCIuL0RhdGFzZXRJc3N1ZUNhdGVnb3J5Q29tcG9uZW50LmpzXCI7XG5pbXBvcnQgeyBHZW5lcmFsSW5mb0FuZFNldHRpbmdzIH0gZnJvbSBcIi4vR2VuZXJhbEluZm9BbmRTZXR0aW5ncy5qc1wiO1xuXG5leHBvcnQgY2xhc3MgRGF0YXNldElzc3Vlc0J5Q2F0ZWdvcmllcyBleHRlbmRzIEhUTUxFbGVtZW50XG57XG5cdFxuXHRjb250ZW50XG5cdFxuXHRjb25uZWN0ZWRfcHJvbWlzZVxuXHRjb25uZWN0ZWRfZnVuYzogKHM6IG51bGwpID0+IHZvaWQgPSBzID0+IG51bGxcblx0XG5cdGNvbm5lY3RlZENhbGxiYWNrKClcblx0e1xuXHRcdGNvbnNvbGUubG9nKCdjb25uZWN0ZWQnKVxuXHRcdHRoaXMuY29ubmVjdGVkX2Z1bmMobnVsbClcblx0fVxuXHRcblx0c3Jvb3Rcblx0XG5cdGluZm9fYW5kX3NldHRpbmdzXG5cdFxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpXG5cdFx0dGhpcy5jb25uZWN0ZWRfcHJvbWlzZSA9IG5ldyBQcm9taXNlKHMgPT4gdGhpcy5jb25uZWN0ZWRfZnVuYyA9IHMpXG5cdFx0dGhpcy5zcm9vdCA9IHRoaXMuYXR0YWNoU2hhZG93KHsgbW9kZTogJ29wZW4nIH0pXG5cdFx0dGhpcy5zcm9vdC5pbm5lckhUTUwgPSBgXG5cdFx0XHRcdFx0XHQ8c3R5bGU+XG5cdFx0XHRcdFx0XHRcdDpob3N0IHtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHQuY2F0ZWdvcnkge1xuXHRcdFx0XHRcdFx0XHRcdGJvcmRlcjogMXB4IHNvbGlkIGdyYXk7XG5cdFx0XHRcdFx0XHRcdFx0d2lkdGg6IDEycmVtO1xuXHRcdFx0XHRcdFx0XHRcdGRpc3BsYXk6IGlubGluZS1ibG9jaztcblx0XHRcdFx0XHRcdFx0XHRtYXJnaW46IDFyZW07XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0LmNhdGVnb3J5ID4gaW1nIHtcblx0XHRcdFx0XHRcdFx0XHR3aWR0aDogMTAwJTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHQuY2F0ZWdvcnkgLmNhdGVnb3J5X25hbWUge1xuXHRcdFx0XHRcdFx0XHRcdGZvbnQtd2VpZ2h0OiBib2xkO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdC5mcmFtZSB7XG5cdFx0XHRcdFx0XHRcdFx0ZGlzcGxheTogZmxleFxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdC5mcmFtZSAuY29udGVudCB7XG5cdFx0XHRcdFx0XHRcdFx0ZmxleC1ncm93OiAxMDA7XG5cdFx0XHRcdFx0XHRcdFx0ZGlzcGxheTogZmxleDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHQuY2hhcnRkaXYge1xuXHRcdFx0XHRcdFx0XHRcdHdpZHRoOiAgMTAwcHg7XG5cdFx0XHRcdFx0XHRcdFx0aGVpZ2h0OiAxMDBweDtcblx0XHRcdFx0XHRcdFx0XHRtYXJnaW46IGF1dG87XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0ZGV0YWlscyA+ICo6bnRoLWNoaWxkKGV2ZW4pIHtcblx0XHRcdFx0XHRcdFx0ICBiYWNrZ3JvdW5kLWNvbG9yOiAjY2NjO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHQuY29udGVudCA+ICoge1xuXHRcdFx0XHRcdFx0XHRcdG1hcmdpbi10b3A6IDFyZW07XG5cdFx0XHRcdFx0XHRcdFx0bWFyZ2luLWxlZnQ6IDFyZW07XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdDwvc3R5bGU+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiZnJhbWVcIj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbnRlbnRcIj48L2Rpdj5cblx0XHRcdFx0XHRcdFx0PGNzLWdlbmVyYWwtaW5mby1hbmQtc2V0dGluZ3M+PC9jcy1nZW5lcmFsLWluZm8tYW5kLXNldHRpbmdzPlxuXHRcdFx0XHRcdFx0XHQ8IS0tPGltZyBzcmM9XCJrcGktZ2VuZXJhbC1pbmZvLnBuZ1wiPi0tPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHRgO1xuXHRcdGN1c3RvbUVsZW1lbnRzLnVwZ3JhZGUodGhpcy5zcm9vdCk7XG5cdFx0dGhpcy5jb250ZW50ID0gY3NfY2FzdChIVE1MRWxlbWVudCwgdGhpcy5zcm9vdC5xdWVyeVNlbGVjdG9yKCcuY29udGVudCcpKTtcblx0XHR0aGlzLmluZm9fYW5kX3NldHRpbmdzID0gY3NfY2FzdChHZW5lcmFsSW5mb0FuZFNldHRpbmdzLCB0aGlzLnNyb290LnF1ZXJ5U2VsZWN0b3IoJ2NzLWdlbmVyYWwtaW5mby1hbmQtc2V0dGluZ3MnKSk7XG5cblx0fVxuXHRcblx0YXN5bmMgcmVmcmVzaChwX3Nlc3Npb25fc3RhcnRfdHM6IHN0cmluZywgcF9kYXRhc2V0X25hbWU6IHN0cmluZywgcF9mYWlsZWRfcmVjb3JkczogbnVtYmVyLCBwX3RvdF9yZWNvcmRzOiBudW1iZXIpIHtcblx0XHRcblx0XHR0aGlzLmluZm9fYW5kX3NldHRpbmdzLnJlZnJlc2gocF9zZXNzaW9uX3N0YXJ0X3RzLCBwX2RhdGFzZXRfbmFtZSwgcF9mYWlsZWRfcmVjb3JkcywgcF90b3RfcmVjb3Jkcyk7XG5cdFx0XG5cdFx0Y29uc3QgbG9hZGVyID0gbmV3IExvYWRlcigpXG5cdFx0dGhpcy5jb250ZW50LmFwcGVuZENoaWxkKGxvYWRlcilcblx0XHRjb25zdCByZXNwID0gYXdhaXQgQVBJMy5saXN0X19jYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X2NoZWNrX2NhdGVnb3J5X2ZhaWxlZF9yZWNvcnNfdncoe1xuXHRcdFx0c2Vzc2lvbl9zdGFydF90czogcF9zZXNzaW9uX3N0YXJ0X3RzLFxuXHRcdFx0ZGF0YXNldF9uYW1lIDogcF9kYXRhc2V0X25hbWVcblx0XHR9KVxuXHRcdGxvYWRlci5yZW1vdmUoKVxuXHRcdGNvbnNvbGUubG9nKHJlc3ApIFxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcmVzcC5sZW5ndGg7IGkrKylcblx0XHR7XG5cdFx0XHRjb25zdCBjYXRlZ29yeSA9IG5ldyBEYXRhc2V0SXNzdWVDYXRlZ29yeUNvbXBvbmVudCgpO1xuXHRcdFx0dGhpcy5jb250ZW50LmFwcGVuZENoaWxkKGNhdGVnb3J5KTtcblx0XHRcdGNhdGVnb3J5LnJlZnJlc2gocmVzcFtpXSlcblx0XHRcdFxuXHRcdH1cblx0fVxuXG5cbn1cblxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCdjcy1kYXRhc2V0LWNhdGVnb3JpZXMnLCBEYXRhc2V0SXNzdWVzQnlDYXRlZ29yaWVzKVxuXG4iXX0=