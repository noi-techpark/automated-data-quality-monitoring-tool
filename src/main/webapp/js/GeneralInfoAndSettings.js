/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */
import { cs_cast } from "./quality.js";
export class GeneralInfoAndSettings extends HTMLElement {
    dataset_name;
    tested_records;
    failed_records;
    last_checked;
    constructor() {
        super();
        const sroot = this.attachShadow({ mode: 'open' });
        sroot.innerHTML = `
		<style>
			:host {
				border: 1px solid #ccc;
				margin: 0.6rem;
				border-radius: 0.4rem;
				padding: 0.4rem;
			}
			.row {
				display: flex;
				margin-bottom: 0.6rem;
				font-size: 0.8rem;
			}
		
			.row .label {
				font-weight: bold;
				display: inline-block;
				width: 8rem;
			}
			
			.row .data {
				width: 8rem;
			}
			
			.title {
				margin-top: 1rem;
				margin-bottom: 1rem;
				font-weight: bold;
			}

		</style>
		<div class="title">General Info &amp; Setting</div>
		<div>
			<div class="row dataset">
				<span class="label">dataset</span>
				<span class="data">data</span>
			</div>
			<div class="row tested_records">
				<span class="label">tested records</span>
				<span class="data">data</span>
			</div>
			<div class="row failed_records">
				<span class="label">failed records</span>
				<span class="data">data</span>
			</div>
			<div class="row last_checked">
				<span class="label">last checked</span>
				<span class="data">data</span>
			</div>
		</div>
		`;
        this.dataset_name = cs_cast(HTMLSpanElement, sroot.querySelector('.dataset .data'));
        this.tested_records = cs_cast(HTMLSpanElement, sroot.querySelector('.tested_records .data'));
        this.failed_records = cs_cast(HTMLSpanElement, sroot.querySelector('.failed_records .data'));
        this.last_checked = cs_cast(HTMLSpanElement, sroot.querySelector('.last_checked .data'));
    }
    refresh(p_session_start_ts, p_dataset_name, p_failed_records, p_tot_records) {
        this.dataset_name.textContent = p_dataset_name;
        this.failed_records.textContent = '' + p_failed_records;
        this.tested_records.textContent = '' + p_tot_records;
        const date = new Date(p_session_start_ts);
        const dateformat = new Intl.DateTimeFormat('it-IT', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: "2-digit",
            timeZone: 'Europe/Rome'
        }).format(date);
        this.last_checked.textContent = dateformat;
    }
}
customElements.define('cs-general-info-and-settings', GeneralInfoAndSettings);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2VuZXJhbEluZm9BbmRTZXR0aW5ncy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3R5cGVzY3JpcHQvR2VuZXJhbEluZm9BbmRTZXR0aW5ncy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxPQUFPLEVBQUUsT0FBTyxFQUFZLE1BQU0sY0FBYyxDQUFDO0FBRWpELE1BQU0sT0FBTyxzQkFBdUIsU0FBUSxXQUFXO0lBRzlDLFlBQVksQ0FBQTtJQUNaLGNBQWMsQ0FBQTtJQUNkLGNBQWMsQ0FBQTtJQUNkLFlBQVksQ0FBQTtJQUVwQjtRQUVDLEtBQUssRUFBRSxDQUFDO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDO1FBQ2hELEtBQUssQ0FBQyxTQUFTLEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBa0RqQixDQUFBO1FBRUQsSUFBSSxDQUFDLFlBQVksR0FBSyxPQUFPLENBQUMsZUFBZSxFQUFFLEtBQUssQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFBO1FBQ3JGLElBQUksQ0FBQyxjQUFjLEdBQUcsT0FBTyxDQUFDLGVBQWUsRUFBRSxLQUFLLENBQUMsYUFBYSxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQTtRQUM1RixJQUFJLENBQUMsY0FBYyxHQUFHLE9BQU8sQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDLGFBQWEsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUE7UUFDNUYsSUFBSSxDQUFDLFlBQVksR0FBSyxPQUFPLENBQUMsZUFBZSxFQUFFLEtBQUssQ0FBQyxhQUFhLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFBO0lBRTNGLENBQUM7SUFFRCxPQUFPLENBQUMsa0JBQTBCLEVBQUUsY0FBc0IsRUFBRSxnQkFBd0IsRUFBRSxhQUFxQjtRQUUxRyxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsR0FBRyxjQUFjLENBQUM7UUFDL0MsSUFBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLEdBQUcsRUFBRSxHQUFHLGdCQUFnQixDQUFDO1FBQ3hELElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxHQUFHLEVBQUUsR0FBRyxhQUFhLENBQUE7UUFFcEQsTUFBTSxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQTtRQUN6QyxNQUFNLFVBQVUsR0FBRyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFO1lBQy9DLElBQUksRUFBRSxTQUFTO1lBQ2YsS0FBSyxFQUFFLFNBQVM7WUFDaEIsR0FBRyxFQUFFLFNBQVM7WUFDZCxJQUFJLEVBQUUsU0FBUztZQUNmLE1BQU0sRUFBRSxTQUFTO1lBQ2pCLFFBQVEsRUFBRSxhQUFhO1NBQ3ZCLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUE7UUFFbkIsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFBO0lBRTNDLENBQUM7Q0FFRDtBQUVELGNBQWMsQ0FBQyxNQUFNLENBQUMsOEJBQThCLEVBQUUsc0JBQXNCLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAoQykgMjAyNCBDYXRjaCBTb2x2ZSBkaSBEYXZpZGUgTW9udGVzaW5cbiAqIExpY2Vuc2U6IEFHUExcbiAqL1xuXG5pbXBvcnQgeyBjc19jYXN0LCB0aHJvd05QRSB9IGZyb20gXCIuL3F1YWxpdHkuanNcIjtcblxuZXhwb3J0IGNsYXNzIEdlbmVyYWxJbmZvQW5kU2V0dGluZ3MgZXh0ZW5kcyBIVE1MRWxlbWVudFxue1xuXHRcblx0cHJpdmF0ZSBkYXRhc2V0X25hbWVcblx0cHJpdmF0ZSB0ZXN0ZWRfcmVjb3Jkc1xuXHRwcml2YXRlIGZhaWxlZF9yZWNvcmRzXG5cdHByaXZhdGUgbGFzdF9jaGVja2VkXG5cdFxuXHRjb25zdHJ1Y3RvcigpXG5cdHtcblx0XHRzdXBlcigpO1xuXHRcdGNvbnN0IHNyb290ID0gdGhpcy5hdHRhY2hTaGFkb3coe21vZGU6ICdvcGVuJ30pO1xuXHRcdHNyb290LmlubmVySFRNTCA9IGBcblx0XHQ8c3R5bGU+XG5cdFx0XHQ6aG9zdCB7XG5cdFx0XHRcdGJvcmRlcjogMXB4IHNvbGlkICNjY2M7XG5cdFx0XHRcdG1hcmdpbjogMC42cmVtO1xuXHRcdFx0XHRib3JkZXItcmFkaXVzOiAwLjRyZW07XG5cdFx0XHRcdHBhZGRpbmc6IDAuNHJlbTtcblx0XHRcdH1cblx0XHRcdC5yb3cge1xuXHRcdFx0XHRkaXNwbGF5OiBmbGV4O1xuXHRcdFx0XHRtYXJnaW4tYm90dG9tOiAwLjZyZW07XG5cdFx0XHRcdGZvbnQtc2l6ZTogMC44cmVtO1xuXHRcdFx0fVxuXHRcdFxuXHRcdFx0LnJvdyAubGFiZWwge1xuXHRcdFx0XHRmb250LXdlaWdodDogYm9sZDtcblx0XHRcdFx0ZGlzcGxheTogaW5saW5lLWJsb2NrO1xuXHRcdFx0XHR3aWR0aDogOHJlbTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0LnJvdyAuZGF0YSB7XG5cdFx0XHRcdHdpZHRoOiA4cmVtO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHQudGl0bGUge1xuXHRcdFx0XHRtYXJnaW4tdG9wOiAxcmVtO1xuXHRcdFx0XHRtYXJnaW4tYm90dG9tOiAxcmVtO1xuXHRcdFx0XHRmb250LXdlaWdodDogYm9sZDtcblx0XHRcdH1cblxuXHRcdDwvc3R5bGU+XG5cdFx0PGRpdiBjbGFzcz1cInRpdGxlXCI+R2VuZXJhbCBJbmZvICZhbXA7IFNldHRpbmc8L2Rpdj5cblx0XHQ8ZGl2PlxuXHRcdFx0PGRpdiBjbGFzcz1cInJvdyBkYXRhc2V0XCI+XG5cdFx0XHRcdDxzcGFuIGNsYXNzPVwibGFiZWxcIj5kYXRhc2V0PC9zcGFuPlxuXHRcdFx0XHQ8c3BhbiBjbGFzcz1cImRhdGFcIj5kYXRhPC9zcGFuPlxuXHRcdFx0PC9kaXY+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwicm93IHRlc3RlZF9yZWNvcmRzXCI+XG5cdFx0XHRcdDxzcGFuIGNsYXNzPVwibGFiZWxcIj50ZXN0ZWQgcmVjb3Jkczwvc3Bhbj5cblx0XHRcdFx0PHNwYW4gY2xhc3M9XCJkYXRhXCI+ZGF0YTwvc3Bhbj5cblx0XHRcdDwvZGl2PlxuXHRcdFx0PGRpdiBjbGFzcz1cInJvdyBmYWlsZWRfcmVjb3Jkc1wiPlxuXHRcdFx0XHQ8c3BhbiBjbGFzcz1cImxhYmVsXCI+ZmFpbGVkIHJlY29yZHM8L3NwYW4+XG5cdFx0XHRcdDxzcGFuIGNsYXNzPVwiZGF0YVwiPmRhdGE8L3NwYW4+XG5cdFx0XHQ8L2Rpdj5cblx0XHRcdDxkaXYgY2xhc3M9XCJyb3cgbGFzdF9jaGVja2VkXCI+XG5cdFx0XHRcdDxzcGFuIGNsYXNzPVwibGFiZWxcIj5sYXN0IGNoZWNrZWQ8L3NwYW4+XG5cdFx0XHRcdDxzcGFuIGNsYXNzPVwiZGF0YVwiPmRhdGE8L3NwYW4+XG5cdFx0XHQ8L2Rpdj5cblx0XHQ8L2Rpdj5cblx0XHRgXG5cdFx0XG5cdFx0dGhpcy5kYXRhc2V0X25hbWUgICA9IGNzX2Nhc3QoSFRNTFNwYW5FbGVtZW50LCBzcm9vdC5xdWVyeVNlbGVjdG9yKCcuZGF0YXNldCAuZGF0YScpKVxuXHRcdHRoaXMudGVzdGVkX3JlY29yZHMgPSBjc19jYXN0KEhUTUxTcGFuRWxlbWVudCwgc3Jvb3QucXVlcnlTZWxlY3RvcignLnRlc3RlZF9yZWNvcmRzIC5kYXRhJykpXG5cdFx0dGhpcy5mYWlsZWRfcmVjb3JkcyA9IGNzX2Nhc3QoSFRNTFNwYW5FbGVtZW50LCBzcm9vdC5xdWVyeVNlbGVjdG9yKCcuZmFpbGVkX3JlY29yZHMgLmRhdGEnKSlcblx0XHR0aGlzLmxhc3RfY2hlY2tlZCAgID0gY3NfY2FzdChIVE1MU3BhbkVsZW1lbnQsIHNyb290LnF1ZXJ5U2VsZWN0b3IoJy5sYXN0X2NoZWNrZWQgLmRhdGEnKSlcblx0XHRcblx0fVxuXHRcblx0cmVmcmVzaChwX3Nlc3Npb25fc3RhcnRfdHM6IHN0cmluZywgcF9kYXRhc2V0X25hbWU6IHN0cmluZywgcF9mYWlsZWRfcmVjb3JkczogbnVtYmVyLCBwX3RvdF9yZWNvcmRzOiBudW1iZXIpXG5cdHtcblx0XHR0aGlzLmRhdGFzZXRfbmFtZS50ZXh0Q29udGVudCA9IHBfZGF0YXNldF9uYW1lO1xuXHRcdHRoaXMuZmFpbGVkX3JlY29yZHMudGV4dENvbnRlbnQgPSAnJyArIHBfZmFpbGVkX3JlY29yZHM7XG5cdFx0dGhpcy50ZXN0ZWRfcmVjb3Jkcy50ZXh0Q29udGVudCA9ICcnICsgcF90b3RfcmVjb3Jkc1xuXHRcdFxuXHRcdGNvbnN0IGRhdGUgPSBuZXcgRGF0ZShwX3Nlc3Npb25fc3RhcnRfdHMpXG5cdFx0Y29uc3QgZGF0ZWZvcm1hdCA9IG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KCdpdC1JVCcsIHtcblx0XHRcdFx0XHRcdFx0eWVhcjogJ251bWVyaWMnLFxuXHRcdFx0XHRcdFx0XHRtb250aDogJzItZGlnaXQnLFxuXHRcdFx0XHRcdFx0XHRkYXk6ICcyLWRpZ2l0Jyxcblx0XHRcdFx0XHRcdFx0aG91cjogJzItZGlnaXQnLFxuXHRcdFx0XHRcdFx0XHRtaW51dGU6IFwiMi1kaWdpdFwiLFxuXHRcdFx0XHRcdFx0XHR0aW1lWm9uZTogJ0V1cm9wZS9Sb21lJ1xuXHRcdFx0XHRcdFx0fSkuZm9ybWF0KGRhdGUpXG5cblx0XHR0aGlzLmxhc3RfY2hlY2tlZC50ZXh0Q29udGVudCA9IGRhdGVmb3JtYXRcblx0XHRcblx0fVxuXG59XG5cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgnY3MtZ2VuZXJhbC1pbmZvLWFuZC1zZXR0aW5ncycsIEdlbmVyYWxJbmZvQW5kU2V0dGluZ3MpXG4iXX0=