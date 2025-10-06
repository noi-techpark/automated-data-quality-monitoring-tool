// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2VuZXJhbEluZm9BbmRTZXR0aW5ncy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3R5cGVzY3JpcHQvR2VuZXJhbEluZm9BbmRTZXR0aW5ncy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw4REFBOEQ7QUFDOUQsRUFBRTtBQUNGLDZDQUE2QztBQUc3QyxPQUFPLEVBQUUsT0FBTyxFQUFZLE1BQU0sY0FBYyxDQUFDO0FBRWpELE1BQU0sT0FBTyxzQkFBdUIsU0FBUSxXQUFXO0lBRzlDLFlBQVksQ0FBQTtJQUNaLGNBQWMsQ0FBQTtJQUNkLGNBQWMsQ0FBQTtJQUNkLFlBQVksQ0FBQTtJQUVwQjtRQUVDLEtBQUssRUFBRSxDQUFDO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDO1FBQ2hELEtBQUssQ0FBQyxTQUFTLEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBa0RqQixDQUFBO1FBRUQsSUFBSSxDQUFDLFlBQVksR0FBSyxPQUFPLENBQUMsZUFBZSxFQUFFLEtBQUssQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFBO1FBQ3JGLElBQUksQ0FBQyxjQUFjLEdBQUcsT0FBTyxDQUFDLGVBQWUsRUFBRSxLQUFLLENBQUMsYUFBYSxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQTtRQUM1RixJQUFJLENBQUMsY0FBYyxHQUFHLE9BQU8sQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDLGFBQWEsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUE7UUFDNUYsSUFBSSxDQUFDLFlBQVksR0FBSyxPQUFPLENBQUMsZUFBZSxFQUFFLEtBQUssQ0FBQyxhQUFhLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFBO0lBRTNGLENBQUM7SUFFRCxPQUFPLENBQUMsa0JBQTBCLEVBQUUsY0FBc0IsRUFBRSxnQkFBd0IsRUFBRSxhQUFxQjtRQUUxRyxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsR0FBRyxjQUFjLENBQUM7UUFDL0MsSUFBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLEdBQUcsRUFBRSxHQUFHLGdCQUFnQixDQUFDO1FBQ3hELElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxHQUFHLEVBQUUsR0FBRyxhQUFhLENBQUE7UUFFcEQsTUFBTSxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQTtRQUN6QyxNQUFNLFVBQVUsR0FBRyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFO1lBQy9DLElBQUksRUFBRSxTQUFTO1lBQ2YsS0FBSyxFQUFFLFNBQVM7WUFDaEIsR0FBRyxFQUFFLFNBQVM7WUFDZCxJQUFJLEVBQUUsU0FBUztZQUNmLE1BQU0sRUFBRSxTQUFTO1lBQ2pCLFFBQVEsRUFBRSxhQUFhO1NBQ3ZCLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUE7UUFFbkIsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFBO0lBRTNDLENBQUM7Q0FFRDtBQUVELGNBQWMsQ0FBQyxNQUFNLENBQUMsOEJBQThCLEVBQUUsc0JBQXNCLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIFNQRFgtRmlsZUNvcHlyaWdodFRleHQ6IDIwMjQgQ2F0Y2ggU29sdmUgZGkgRGF2aWRlIE1vbnRlc2luXG4vL1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9yLWxhdGVyXG5cblxuaW1wb3J0IHsgY3NfY2FzdCwgdGhyb3dOUEUgfSBmcm9tIFwiLi9xdWFsaXR5LmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBHZW5lcmFsSW5mb0FuZFNldHRpbmdzIGV4dGVuZHMgSFRNTEVsZW1lbnRcbntcblx0XG5cdHByaXZhdGUgZGF0YXNldF9uYW1lXG5cdHByaXZhdGUgdGVzdGVkX3JlY29yZHNcblx0cHJpdmF0ZSBmYWlsZWRfcmVjb3Jkc1xuXHRwcml2YXRlIGxhc3RfY2hlY2tlZFxuXHRcblx0Y29uc3RydWN0b3IoKVxuXHR7XG5cdFx0c3VwZXIoKTtcblx0XHRjb25zdCBzcm9vdCA9IHRoaXMuYXR0YWNoU2hhZG93KHttb2RlOiAnb3Blbid9KTtcblx0XHRzcm9vdC5pbm5lckhUTUwgPSBgXG5cdFx0PHN0eWxlPlxuXHRcdFx0Omhvc3Qge1xuXHRcdFx0XHRib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xuXHRcdFx0XHRtYXJnaW46IDAuNnJlbTtcblx0XHRcdFx0Ym9yZGVyLXJhZGl1czogMC40cmVtO1xuXHRcdFx0XHRwYWRkaW5nOiAwLjRyZW07XG5cdFx0XHR9XG5cdFx0XHQucm93IHtcblx0XHRcdFx0ZGlzcGxheTogZmxleDtcblx0XHRcdFx0bWFyZ2luLWJvdHRvbTogMC42cmVtO1xuXHRcdFx0XHRmb250LXNpemU6IDAuOHJlbTtcblx0XHRcdH1cblx0XHRcblx0XHRcdC5yb3cgLmxhYmVsIHtcblx0XHRcdFx0Zm9udC13ZWlnaHQ6IGJvbGQ7XG5cdFx0XHRcdGRpc3BsYXk6IGlubGluZS1ibG9jaztcblx0XHRcdFx0d2lkdGg6IDhyZW07XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdC5yb3cgLmRhdGEge1xuXHRcdFx0XHR3aWR0aDogOHJlbTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0LnRpdGxlIHtcblx0XHRcdFx0bWFyZ2luLXRvcDogMXJlbTtcblx0XHRcdFx0bWFyZ2luLWJvdHRvbTogMXJlbTtcblx0XHRcdFx0Zm9udC13ZWlnaHQ6IGJvbGQ7XG5cdFx0XHR9XG5cblx0XHQ8L3N0eWxlPlxuXHRcdDxkaXYgY2xhc3M9XCJ0aXRsZVwiPkdlbmVyYWwgSW5mbyAmYW1wOyBTZXR0aW5nPC9kaXY+XG5cdFx0PGRpdj5cblx0XHRcdDxkaXYgY2xhc3M9XCJyb3cgZGF0YXNldFwiPlxuXHRcdFx0XHQ8c3BhbiBjbGFzcz1cImxhYmVsXCI+ZGF0YXNldDwvc3Bhbj5cblx0XHRcdFx0PHNwYW4gY2xhc3M9XCJkYXRhXCI+ZGF0YTwvc3Bhbj5cblx0XHRcdDwvZGl2PlxuXHRcdFx0PGRpdiBjbGFzcz1cInJvdyB0ZXN0ZWRfcmVjb3Jkc1wiPlxuXHRcdFx0XHQ8c3BhbiBjbGFzcz1cImxhYmVsXCI+dGVzdGVkIHJlY29yZHM8L3NwYW4+XG5cdFx0XHRcdDxzcGFuIGNsYXNzPVwiZGF0YVwiPmRhdGE8L3NwYW4+XG5cdFx0XHQ8L2Rpdj5cblx0XHRcdDxkaXYgY2xhc3M9XCJyb3cgZmFpbGVkX3JlY29yZHNcIj5cblx0XHRcdFx0PHNwYW4gY2xhc3M9XCJsYWJlbFwiPmZhaWxlZCByZWNvcmRzPC9zcGFuPlxuXHRcdFx0XHQ8c3BhbiBjbGFzcz1cImRhdGFcIj5kYXRhPC9zcGFuPlxuXHRcdFx0PC9kaXY+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwicm93IGxhc3RfY2hlY2tlZFwiPlxuXHRcdFx0XHQ8c3BhbiBjbGFzcz1cImxhYmVsXCI+bGFzdCBjaGVja2VkPC9zcGFuPlxuXHRcdFx0XHQ8c3BhbiBjbGFzcz1cImRhdGFcIj5kYXRhPC9zcGFuPlxuXHRcdFx0PC9kaXY+XG5cdFx0PC9kaXY+XG5cdFx0YFxuXHRcdFxuXHRcdHRoaXMuZGF0YXNldF9uYW1lICAgPSBjc19jYXN0KEhUTUxTcGFuRWxlbWVudCwgc3Jvb3QucXVlcnlTZWxlY3RvcignLmRhdGFzZXQgLmRhdGEnKSlcblx0XHR0aGlzLnRlc3RlZF9yZWNvcmRzID0gY3NfY2FzdChIVE1MU3BhbkVsZW1lbnQsIHNyb290LnF1ZXJ5U2VsZWN0b3IoJy50ZXN0ZWRfcmVjb3JkcyAuZGF0YScpKVxuXHRcdHRoaXMuZmFpbGVkX3JlY29yZHMgPSBjc19jYXN0KEhUTUxTcGFuRWxlbWVudCwgc3Jvb3QucXVlcnlTZWxlY3RvcignLmZhaWxlZF9yZWNvcmRzIC5kYXRhJykpXG5cdFx0dGhpcy5sYXN0X2NoZWNrZWQgICA9IGNzX2Nhc3QoSFRNTFNwYW5FbGVtZW50LCBzcm9vdC5xdWVyeVNlbGVjdG9yKCcubGFzdF9jaGVja2VkIC5kYXRhJykpXG5cdFx0XG5cdH1cblx0XG5cdHJlZnJlc2gocF9zZXNzaW9uX3N0YXJ0X3RzOiBzdHJpbmcsIHBfZGF0YXNldF9uYW1lOiBzdHJpbmcsIHBfZmFpbGVkX3JlY29yZHM6IG51bWJlciwgcF90b3RfcmVjb3JkczogbnVtYmVyKVxuXHR7XG5cdFx0dGhpcy5kYXRhc2V0X25hbWUudGV4dENvbnRlbnQgPSBwX2RhdGFzZXRfbmFtZTtcblx0XHR0aGlzLmZhaWxlZF9yZWNvcmRzLnRleHRDb250ZW50ID0gJycgKyBwX2ZhaWxlZF9yZWNvcmRzO1xuXHRcdHRoaXMudGVzdGVkX3JlY29yZHMudGV4dENvbnRlbnQgPSAnJyArIHBfdG90X3JlY29yZHNcblx0XHRcblx0XHRjb25zdCBkYXRlID0gbmV3IERhdGUocF9zZXNzaW9uX3N0YXJ0X3RzKVxuXHRcdGNvbnN0IGRhdGVmb3JtYXQgPSBuZXcgSW50bC5EYXRlVGltZUZvcm1hdCgnaXQtSVQnLCB7XG5cdFx0XHRcdFx0XHRcdHllYXI6ICdudW1lcmljJyxcblx0XHRcdFx0XHRcdFx0bW9udGg6ICcyLWRpZ2l0Jyxcblx0XHRcdFx0XHRcdFx0ZGF5OiAnMi1kaWdpdCcsXG5cdFx0XHRcdFx0XHRcdGhvdXI6ICcyLWRpZ2l0Jyxcblx0XHRcdFx0XHRcdFx0bWludXRlOiBcIjItZGlnaXRcIixcblx0XHRcdFx0XHRcdFx0dGltZVpvbmU6ICdFdXJvcGUvUm9tZSdcblx0XHRcdFx0XHRcdH0pLmZvcm1hdChkYXRlKVxuXG5cdFx0dGhpcy5sYXN0X2NoZWNrZWQudGV4dENvbnRlbnQgPSBkYXRlZm9ybWF0XG5cdFx0XG5cdH1cblxufVxuXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ2NzLWdlbmVyYWwtaW5mby1hbmQtc2V0dGluZ3MnLCBHZW5lcmFsSW5mb0FuZFNldHRpbmdzKVxuIl19