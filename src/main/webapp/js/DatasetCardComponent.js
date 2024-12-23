/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */
import { cs_cast } from "./quality.js";
import { LabelAndData } from "./LabelAndData.js";
export class DatasetCardComponent extends HTMLElement {
    dtitle;
    img;
    checkrecs;
    checkattr;
    failedrecs;
    lastupdate;
    constructor() {
        super();
        const sroot = this.attachShadow({ mode: 'open' });
        sroot.innerHTML = `
			<style>
				:host {
					border: 1px solid #ccc;
					margin: 0.5rem;
					border-radius: 4px;
					cursor: pointer;
					width: 13rem;
				}
				.title {
					font-weight: bold;
					margin-top: .7rem;
					margin-bottom: 1rem;
					text-align: center;
					overflow: hidden;
				}
				
				/*
				:host(:hover) .title {
					text-decoration: underline;
				}
				 */
				
				.ts {
					font-size: 0.7rem
				}
				
				.view_dashboard {
					background-color: var(--dark-background);
					color: #ddd;
					text-align: center;
					padding: 0.6rem;
				}
				
				.wrapper {
					padding: 1rem;
				}

				.lastupdate {
					margin-top: 0.4rem;
					font-size: 0.7rem;
				}
	
			</style>
			<img class="img">
			<div class="wrapper">
				<div class="title">XXX</div>
				<cs-label-and-data class="checktrec">checked records</cs-label-and-data>
				<cs-label-and-data class="checkattr" style="display: none">checked attributes</cs-label-and-data>
				<cs-label-and-data class="totissues" xstyle="display: none">total issues</cs-label-and-data>
				<div class="lastupdate">
					<span class="data"></span>
					<span></span>
				</div>
			</div>
			<div class="view_dashboard">View dashboard</div>
		`;
        customElements.upgrade(sroot);
        this.checkrecs = cs_cast(LabelAndData, sroot.querySelector('.checktrec'));
        this.checkattr = cs_cast(LabelAndData, sroot.querySelector('.checkattr'));
        this.failedrecs = cs_cast(LabelAndData, sroot.querySelector('.totissues'));
        this.dtitle = cs_cast(HTMLDivElement, sroot.querySelector('.title'));
        this.img = cs_cast(HTMLImageElement, sroot.querySelector('.img'));
        this.lastupdate = cs_cast(HTMLSpanElement, sroot.querySelector('.lastupdate .data'));
        this.img.style.display = 'none';
        this.checkrecs.setLabel('checked recs');
        this.checkattr.setLabel('checked attrs');
        this.failedrecs.setLabel('failed recs');
        // this.failedrecs.setSeverity("fail")
        // this.failedrecs.setData('123')
    }
    refresh(dataset) {
        const datestr = dataset.session_start_ts;
        const date = new Date(datestr);
        const dateformat = new Intl.DateTimeFormat('it-IT', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: "2-digit",
            timeZone: 'Europe/Rome'
        }).format(date);
        this.dtitle.textContent = dataset.dataset_name;
        this.checkrecs.setData('' + dataset.tested_records);
        this.checkattr.setData('123');
        this.failedrecs.setData('' + dataset.failed_records);
        const quality_ratio = dataset.tested_records == 0 ? 100 : dataset.failed_records / dataset.tested_records;
        if (quality_ratio < 0.1)
            this.failedrecs.setQualityLevel("good");
        else if (quality_ratio < 0.3)
            this.failedrecs.setQualityLevel("warn");
        else
            this.failedrecs.setQualityLevel("fail");
        this.lastupdate.textContent = dateformat;
        this.onclick = () => {
            location.hash = '#page=dataset-categories' + '&dataset_name=' + dataset.dataset_name
                + "&session_start_ts=" + dataset.session_start_ts
                + "&failed_records=" + dataset.failed_records
                + "&tested_records=" + dataset.tested_records;
        };
    }
}
customElements.define('cs-dataset-box', DatasetCardComponent);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YXNldENhcmRDb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90eXBlc2NyaXB0L0RhdGFzZXRDYXJkQ29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7R0FHRztBQUVILE9BQU8sRUFBRSxPQUFPLEVBQVksTUFBTSxjQUFjLENBQUM7QUFFakQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLG1CQUFtQixDQUFBO0FBR2hELE1BQU0sT0FBTyxvQkFBcUIsU0FBUSxXQUFXO0lBRXBELE1BQU0sQ0FBQTtJQUNOLEdBQUcsQ0FBQTtJQUNILFNBQVMsQ0FBQTtJQUNULFNBQVMsQ0FBQTtJQUNULFVBQVUsQ0FBQTtJQUNWLFVBQVUsQ0FBQTtJQUVWO1FBRUMsS0FBSyxFQUFFLENBQUE7UUFDUCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUE7UUFDL0MsS0FBSyxDQUFDLFNBQVMsR0FBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3RGpCLENBQUE7UUFFRCxjQUFjLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBRTdCLElBQUksQ0FBQyxTQUFTLEdBQUksT0FBTyxDQUFDLFlBQVksRUFBTyxLQUFLLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUE7UUFDL0UsSUFBSSxDQUFDLFNBQVMsR0FBSSxPQUFPLENBQUMsWUFBWSxFQUFPLEtBQUssQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQTtRQUMvRSxJQUFJLENBQUMsVUFBVSxHQUFJLE9BQU8sQ0FBQyxZQUFZLEVBQU0sS0FBSyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFBO1FBQy9FLElBQUksQ0FBQyxNQUFNLEdBQU8sT0FBTyxDQUFDLGNBQWMsRUFBSyxLQUFLLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUE7UUFDM0UsSUFBSSxDQUFDLEdBQUcsR0FBVSxPQUFPLENBQUMsZ0JBQWdCLEVBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO1FBQ3pFLElBQUksQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDLGVBQWUsRUFBTyxLQUFLLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQTtRQUV6RixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBRWhDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFBO1FBQ3ZDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxDQUFBO1FBQ3hDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFBO1FBRXZDLHNDQUFzQztRQUN0QyxpQ0FBaUM7SUFFbEMsQ0FBQztJQUdELE9BQU8sQ0FBQyxPQUF1RDtRQUU5RCxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUE7UUFDeEMsTUFBTSxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7UUFFOUIsTUFBTSxVQUFVLEdBQUcsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRTtZQUNuRCxJQUFJLEVBQUUsU0FBUztZQUNmLEtBQUssRUFBRSxTQUFTO1lBQ2hCLEdBQUcsRUFBRSxTQUFTO1lBQ2QsSUFBSSxFQUFFLFNBQVM7WUFDZixNQUFNLEVBQUUsU0FBUztZQUNqQixRQUFRLEVBQUUsYUFBYTtTQUN2QixDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBRWYsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQTtRQUM5QyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFBO1FBQ25ELElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQzdCLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUUsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUE7UUFDcEQsTUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLGNBQWMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFBO1FBQ3pHLElBQUksYUFBYSxHQUFHLEdBQUc7WUFDdEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUE7YUFDbkMsSUFBSSxhQUFhLEdBQUcsR0FBRztZQUMzQixJQUFJLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQTs7WUFFdkMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDeEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFBO1FBQ3hDLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxFQUFFO1lBQ25CLFFBQVEsQ0FBQyxJQUFJLEdBQUcsMEJBQTBCLEdBQUcsZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLFlBQVk7a0JBQzlFLG9CQUFvQixHQUFHLE9BQU8sQ0FBQyxnQkFBZ0I7a0JBQy9DLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxjQUFjO2tCQUMzQyxrQkFBa0IsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFBO1FBQ2xELENBQUMsQ0FBQTtJQUNGLENBQUM7Q0FDRDtBQUdELGNBQWMsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsb0JBQW9CLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAoQykgMjAyNCBDYXRjaCBTb2x2ZSBkaSBEYXZpZGUgTW9udGVzaW5cbiAqIExpY2Vuc2U6IEFHUExcbiAqL1xuXG5pbXBvcnQgeyBjc19jYXN0LCB0aHJvd05QRSB9IGZyb20gXCIuL3F1YWxpdHkuanNcIjtcblxuaW1wb3J0IHsgTGFiZWxBbmREYXRhIH0gZnJvbSBcIi4vTGFiZWxBbmREYXRhLmpzXCJcbmltcG9ydCB7IGNhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfbWF4X3RzX3Z3X19yb3cgfSBmcm9tIFwiLi9hcGkvYXBpMy5qc1wiO1xuXG5leHBvcnQgY2xhc3MgRGF0YXNldENhcmRDb21wb25lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudFxue1xuXHRkdGl0bGVcblx0aW1nXG5cdGNoZWNrcmVjc1xuXHRjaGVja2F0dHJcblx0ZmFpbGVkcmVjc1xuXHRsYXN0dXBkYXRlXG5cdFxuXHRjb25zdHJ1Y3RvcigpXG5cdHtcblx0XHRzdXBlcigpXG5cdFx0Y29uc3Qgc3Jvb3QgPSB0aGlzLmF0dGFjaFNoYWRvdyh7bW9kZTogJ29wZW4nfSlcblx0XHRzcm9vdC5pbm5lckhUTUwgPSBgXG5cdFx0XHQ8c3R5bGU+XG5cdFx0XHRcdDpob3N0IHtcblx0XHRcdFx0XHRib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xuXHRcdFx0XHRcdG1hcmdpbjogMC41cmVtO1xuXHRcdFx0XHRcdGJvcmRlci1yYWRpdXM6IDRweDtcblx0XHRcdFx0XHRjdXJzb3I6IHBvaW50ZXI7XG5cdFx0XHRcdFx0d2lkdGg6IDEzcmVtO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC50aXRsZSB7XG5cdFx0XHRcdFx0Zm9udC13ZWlnaHQ6IGJvbGQ7XG5cdFx0XHRcdFx0bWFyZ2luLXRvcDogLjdyZW07XG5cdFx0XHRcdFx0bWFyZ2luLWJvdHRvbTogMXJlbTtcblx0XHRcdFx0XHR0ZXh0LWFsaWduOiBjZW50ZXI7XG5cdFx0XHRcdFx0b3ZlcmZsb3c6IGhpZGRlbjtcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0Lypcblx0XHRcdFx0Omhvc3QoOmhvdmVyKSAudGl0bGUge1xuXHRcdFx0XHRcdHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xuXHRcdFx0XHR9XG5cdFx0XHRcdCAqL1xuXHRcdFx0XHRcblx0XHRcdFx0LnRzIHtcblx0XHRcdFx0XHRmb250LXNpemU6IDAuN3JlbVxuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0XHQudmlld19kYXNoYm9hcmQge1xuXHRcdFx0XHRcdGJhY2tncm91bmQtY29sb3I6IHZhcigtLWRhcmstYmFja2dyb3VuZCk7XG5cdFx0XHRcdFx0Y29sb3I6ICNkZGQ7XG5cdFx0XHRcdFx0dGV4dC1hbGlnbjogY2VudGVyO1xuXHRcdFx0XHRcdHBhZGRpbmc6IDAuNnJlbTtcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0LndyYXBwZXIge1xuXHRcdFx0XHRcdHBhZGRpbmc6IDFyZW07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQubGFzdHVwZGF0ZSB7XG5cdFx0XHRcdFx0bWFyZ2luLXRvcDogMC40cmVtO1xuXHRcdFx0XHRcdGZvbnQtc2l6ZTogMC43cmVtO1xuXHRcdFx0XHR9XG5cdFxuXHRcdFx0PC9zdHlsZT5cblx0XHRcdDxpbWcgY2xhc3M9XCJpbWdcIj5cblx0XHRcdDxkaXYgY2xhc3M9XCJ3cmFwcGVyXCI+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJ0aXRsZVwiPlhYWDwvZGl2PlxuXHRcdFx0XHQ8Y3MtbGFiZWwtYW5kLWRhdGEgY2xhc3M9XCJjaGVja3RyZWNcIj5jaGVja2VkIHJlY29yZHM8L2NzLWxhYmVsLWFuZC1kYXRhPlxuXHRcdFx0XHQ8Y3MtbGFiZWwtYW5kLWRhdGEgY2xhc3M9XCJjaGVja2F0dHJcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIj5jaGVja2VkIGF0dHJpYnV0ZXM8L2NzLWxhYmVsLWFuZC1kYXRhPlxuXHRcdFx0XHQ8Y3MtbGFiZWwtYW5kLWRhdGEgY2xhc3M9XCJ0b3Rpc3N1ZXNcIiB4c3R5bGU9XCJkaXNwbGF5OiBub25lXCI+dG90YWwgaXNzdWVzPC9jcy1sYWJlbC1hbmQtZGF0YT5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImxhc3R1cGRhdGVcIj5cblx0XHRcdFx0XHQ8c3BhbiBjbGFzcz1cImRhdGFcIj48L3NwYW4+XG5cdFx0XHRcdFx0PHNwYW4+PC9zcGFuPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdFx0PGRpdiBjbGFzcz1cInZpZXdfZGFzaGJvYXJkXCI+VmlldyBkYXNoYm9hcmQ8L2Rpdj5cblx0XHRgXG5cblx0XHRjdXN0b21FbGVtZW50cy51cGdyYWRlKHNyb290KVxuXG5cdFx0dGhpcy5jaGVja3JlY3MgID0gY3NfY2FzdChMYWJlbEFuZERhdGEsICAgICAgc3Jvb3QucXVlcnlTZWxlY3RvcignLmNoZWNrdHJlYycpKVxuXHRcdHRoaXMuY2hlY2thdHRyICA9IGNzX2Nhc3QoTGFiZWxBbmREYXRhLCAgICAgIHNyb290LnF1ZXJ5U2VsZWN0b3IoJy5jaGVja2F0dHInKSlcblx0XHR0aGlzLmZhaWxlZHJlY3MgID0gY3NfY2FzdChMYWJlbEFuZERhdGEsICAgICBzcm9vdC5xdWVyeVNlbGVjdG9yKCcudG90aXNzdWVzJykpXG5cdFx0dGhpcy5kdGl0bGUgICAgID0gY3NfY2FzdChIVE1MRGl2RWxlbWVudCwgICAgc3Jvb3QucXVlcnlTZWxlY3RvcignLnRpdGxlJykpXG5cdFx0dGhpcy5pbWcgICAgICAgID0gY3NfY2FzdChIVE1MSW1hZ2VFbGVtZW50LCAgc3Jvb3QucXVlcnlTZWxlY3RvcignLmltZycpKVxuXHRcdHRoaXMubGFzdHVwZGF0ZSA9IGNzX2Nhc3QoSFRNTFNwYW5FbGVtZW50LCAgICAgIHNyb290LnF1ZXJ5U2VsZWN0b3IoJy5sYXN0dXBkYXRlIC5kYXRhJykpXG5cdFx0XHRcdFxuXHRcdHRoaXMuaW1nLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cdFx0XG5cdFx0dGhpcy5jaGVja3JlY3Muc2V0TGFiZWwoJ2NoZWNrZWQgcmVjcycpXG5cdFx0dGhpcy5jaGVja2F0dHIuc2V0TGFiZWwoJ2NoZWNrZWQgYXR0cnMnKVxuXHRcdHRoaXMuZmFpbGVkcmVjcy5zZXRMYWJlbCgnZmFpbGVkIHJlY3MnKVxuXHRcdFxuXHRcdC8vIHRoaXMuZmFpbGVkcmVjcy5zZXRTZXZlcml0eShcImZhaWxcIilcblx0XHQvLyB0aGlzLmZhaWxlZHJlY3Muc2V0RGF0YSgnMTIzJylcblxuXHR9XG5cblx0XG5cdHJlZnJlc2goZGF0YXNldDogY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9tYXhfdHNfdndfX3Jvdylcblx0e1xuXHRcdGNvbnN0IGRhdGVzdHIgPSBkYXRhc2V0LnNlc3Npb25fc3RhcnRfdHNcblx0XHRjb25zdCBkYXRlID0gbmV3IERhdGUoZGF0ZXN0cilcblx0XHRcblx0XHRjb25zdCBkYXRlZm9ybWF0ID0gbmV3IEludGwuRGF0ZVRpbWVGb3JtYXQoJ2l0LUlUJywge1xuXHRcdFx0eWVhcjogJ251bWVyaWMnLFxuXHRcdFx0bW9udGg6ICcyLWRpZ2l0Jyxcblx0XHRcdGRheTogJzItZGlnaXQnLFxuXHRcdFx0aG91cjogJzItZGlnaXQnLFxuXHRcdFx0bWludXRlOiBcIjItZGlnaXRcIixcblx0XHRcdHRpbWVab25lOiAnRXVyb3BlL1JvbWUnXG5cdFx0fSkuZm9ybWF0KGRhdGUpXG5cdFx0XG5cdFx0dGhpcy5kdGl0bGUudGV4dENvbnRlbnQgPSBkYXRhc2V0LmRhdGFzZXRfbmFtZVxuXHRcdHRoaXMuY2hlY2tyZWNzLnNldERhdGEoJycgKyBkYXRhc2V0LnRlc3RlZF9yZWNvcmRzKVxuXHRcdHRoaXMuY2hlY2thdHRyLnNldERhdGEoJzEyMycpXG5cdFx0dGhpcy5mYWlsZWRyZWNzLnNldERhdGEoJycgKyBkYXRhc2V0LmZhaWxlZF9yZWNvcmRzKVxuXHRcdGNvbnN0IHF1YWxpdHlfcmF0aW8gPSBkYXRhc2V0LnRlc3RlZF9yZWNvcmRzID09IDAgPyAxMDAgOiBkYXRhc2V0LmZhaWxlZF9yZWNvcmRzIC8gZGF0YXNldC50ZXN0ZWRfcmVjb3Jkc1xuXHRcdGlmIChxdWFsaXR5X3JhdGlvIDwgMC4xKVxuXHRcdFx0dGhpcy5mYWlsZWRyZWNzLnNldFF1YWxpdHlMZXZlbChcImdvb2RcIilcblx0XHRlbHNlIGlmIChxdWFsaXR5X3JhdGlvIDwgMC4zKVxuXHRcdFx0dGhpcy5mYWlsZWRyZWNzLnNldFF1YWxpdHlMZXZlbChcIndhcm5cIilcblx0XHRlbHNlXG5cdFx0XHR0aGlzLmZhaWxlZHJlY3Muc2V0UXVhbGl0eUxldmVsKFwiZmFpbFwiKVxuXHRcdHRoaXMubGFzdHVwZGF0ZS50ZXh0Q29udGVudCA9IGRhdGVmb3JtYXRcblx0XHR0aGlzLm9uY2xpY2sgPSAoKSA9PiB7XG5cdFx0XHRsb2NhdGlvbi5oYXNoID0gJyNwYWdlPWRhdGFzZXQtY2F0ZWdvcmllcycgKyAnJmRhdGFzZXRfbmFtZT0nICsgZGF0YXNldC5kYXRhc2V0X25hbWUgXG5cdFx0XHRcdFx0XHRcdCsgXCImc2Vzc2lvbl9zdGFydF90cz1cIiArIGRhdGFzZXQuc2Vzc2lvbl9zdGFydF90c1xuXHRcdFx0XHRcdFx0XHQrIFwiJmZhaWxlZF9yZWNvcmRzPVwiICsgZGF0YXNldC5mYWlsZWRfcmVjb3Jkc1xuXHRcdFx0XHRcdFx0XHQrIFwiJnRlc3RlZF9yZWNvcmRzPVwiICsgZGF0YXNldC50ZXN0ZWRfcmVjb3Jkc1xuXHRcdH1cblx0fVxufVxuXG5cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgnY3MtZGF0YXNldC1ib3gnLCBEYXRhc2V0Q2FyZENvbXBvbmVudClcbiJdfQ==