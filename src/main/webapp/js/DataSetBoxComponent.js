/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */
import { cs_cast } from "./quality.js";
import { LabelAndData } from "./LabelAndData.js";
export class DataSetBoxComponent extends HTMLElement {
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
customElements.define('cs-dataset-box', DataSetBoxComponent);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YVNldEJveENvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3R5cGVzY3JpcHQvRGF0YVNldEJveENvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxPQUFPLEVBQUUsT0FBTyxFQUFZLE1BQU0sY0FBYyxDQUFDO0FBRWpELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQTtBQUdoRCxNQUFNLE9BQU8sbUJBQW9CLFNBQVEsV0FBVztJQUVuRCxNQUFNLENBQUE7SUFDTixHQUFHLENBQUE7SUFDSCxTQUFTLENBQUE7SUFDVCxTQUFTLENBQUE7SUFDVCxVQUFVLENBQUE7SUFDVixVQUFVLENBQUE7SUFFVjtRQUVDLEtBQUssRUFBRSxDQUFBO1FBQ1AsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFBO1FBQy9DLEtBQUssQ0FBQyxTQUFTLEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0RqQixDQUFBO1FBRUQsY0FBYyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUU3QixJQUFJLENBQUMsU0FBUyxHQUFJLE9BQU8sQ0FBQyxZQUFZLEVBQU8sS0FBSyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFBO1FBQy9FLElBQUksQ0FBQyxTQUFTLEdBQUksT0FBTyxDQUFDLFlBQVksRUFBTyxLQUFLLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUE7UUFDL0UsSUFBSSxDQUFDLFVBQVUsR0FBSSxPQUFPLENBQUMsWUFBWSxFQUFNLEtBQUssQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQTtRQUMvRSxJQUFJLENBQUMsTUFBTSxHQUFPLE9BQU8sQ0FBQyxjQUFjLEVBQUssS0FBSyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFBO1FBQzNFLElBQUksQ0FBQyxHQUFHLEdBQVUsT0FBTyxDQUFDLGdCQUFnQixFQUFHLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtRQUN6RSxJQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxlQUFlLEVBQU8sS0FBSyxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUE7UUFFekYsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUVoQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQTtRQUN2QyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQTtRQUN4QyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQTtRQUV2QyxzQ0FBc0M7UUFDdEMsaUNBQWlDO0lBRWxDLENBQUM7SUFHRCxPQUFPLENBQUMsT0FBdUQ7UUFFOUQsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFBO1FBQ3hDLE1BQU0sSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBRTlCLE1BQU0sVUFBVSxHQUFHLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUU7WUFDbkQsSUFBSSxFQUFFLFNBQVM7WUFDZixLQUFLLEVBQUUsU0FBUztZQUNoQixHQUFHLEVBQUUsU0FBUztZQUNkLElBQUksRUFBRSxTQUFTO1lBQ2YsTUFBTSxFQUFFLFNBQVM7WUFDakIsUUFBUSxFQUFFLGFBQWE7U0FDdkIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUVmLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUE7UUFDOUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRSxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQTtRQUNuRCxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUM3QixJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFBO1FBQ3BELE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxjQUFjLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxjQUFjLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQTtRQUN6RyxJQUFJLGFBQWEsR0FBRyxHQUFHO1lBQ3RCLElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFBO2FBQ25DLElBQUksYUFBYSxHQUFHLEdBQUc7WUFDM0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUE7O1lBRXZDLElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ3hDLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQTtRQUN4QyxJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRTtZQUNuQixRQUFRLENBQUMsSUFBSSxHQUFHLDBCQUEwQixHQUFHLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxZQUFZO2tCQUM5RSxvQkFBb0IsR0FBRyxPQUFPLENBQUMsZ0JBQWdCO2tCQUMvQyxrQkFBa0IsR0FBRyxPQUFPLENBQUMsY0FBYztrQkFDM0Msa0JBQWtCLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQTtRQUNsRCxDQUFDLENBQUE7SUFDRixDQUFDO0NBQ0Q7QUFHRCxjQUFjLENBQUMsTUFBTSxDQUFDLGdCQUFnQixFQUFFLG1CQUFtQixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogKEMpIDIwMjQgQ2F0Y2ggU29sdmUgZGkgRGF2aWRlIE1vbnRlc2luXG4gKiBMaWNlbnNlOiBBR1BMXG4gKi9cblxuaW1wb3J0IHsgY3NfY2FzdCwgdGhyb3dOUEUgfSBmcm9tIFwiLi9xdWFsaXR5LmpzXCI7XG5cbmltcG9ydCB7IExhYmVsQW5kRGF0YSB9IGZyb20gXCIuL0xhYmVsQW5kRGF0YS5qc1wiXG5pbXBvcnQgeyBjYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X21heF90c192d19fcm93IH0gZnJvbSBcIi4vYXBpL2FwaTMuanNcIjtcblxuZXhwb3J0IGNsYXNzIERhdGFTZXRCb3hDb21wb25lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudFxue1xuXHRkdGl0bGVcblx0aW1nXG5cdGNoZWNrcmVjc1xuXHRjaGVja2F0dHJcblx0ZmFpbGVkcmVjc1xuXHRsYXN0dXBkYXRlXG5cdFxuXHRjb25zdHJ1Y3RvcigpXG5cdHtcblx0XHRzdXBlcigpXG5cdFx0Y29uc3Qgc3Jvb3QgPSB0aGlzLmF0dGFjaFNoYWRvdyh7bW9kZTogJ29wZW4nfSlcblx0XHRzcm9vdC5pbm5lckhUTUwgPSBgXG5cdFx0XHQ8c3R5bGU+XG5cdFx0XHRcdDpob3N0IHtcblx0XHRcdFx0XHRib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xuXHRcdFx0XHRcdG1hcmdpbjogMC41cmVtO1xuXHRcdFx0XHRcdGJvcmRlci1yYWRpdXM6IDRweDtcblx0XHRcdFx0XHRjdXJzb3I6IHBvaW50ZXI7XG5cdFx0XHRcdFx0d2lkdGg6IDEzcmVtO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC50aXRsZSB7XG5cdFx0XHRcdFx0Zm9udC13ZWlnaHQ6IGJvbGQ7XG5cdFx0XHRcdFx0bWFyZ2luLXRvcDogLjdyZW07XG5cdFx0XHRcdFx0bWFyZ2luLWJvdHRvbTogMXJlbTtcblx0XHRcdFx0XHR0ZXh0LWFsaWduOiBjZW50ZXI7XG5cdFx0XHRcdFx0b3ZlcmZsb3c6IGhpZGRlbjtcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0Lypcblx0XHRcdFx0Omhvc3QoOmhvdmVyKSAudGl0bGUge1xuXHRcdFx0XHRcdHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xuXHRcdFx0XHR9XG5cdFx0XHRcdCAqL1xuXHRcdFx0XHRcblx0XHRcdFx0LnRzIHtcblx0XHRcdFx0XHRmb250LXNpemU6IDAuN3JlbVxuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0XHQudmlld19kYXNoYm9hcmQge1xuXHRcdFx0XHRcdGJhY2tncm91bmQtY29sb3I6IHZhcigtLWRhcmstYmFja2dyb3VuZCk7XG5cdFx0XHRcdFx0Y29sb3I6ICNkZGQ7XG5cdFx0XHRcdFx0dGV4dC1hbGlnbjogY2VudGVyO1xuXHRcdFx0XHRcdHBhZGRpbmc6IDAuNnJlbTtcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0LndyYXBwZXIge1xuXHRcdFx0XHRcdHBhZGRpbmc6IDFyZW07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQubGFzdHVwZGF0ZSB7XG5cdFx0XHRcdFx0bWFyZ2luLXRvcDogMC40cmVtO1xuXHRcdFx0XHRcdGZvbnQtc2l6ZTogMC43cmVtO1xuXHRcdFx0XHR9XG5cdFxuXHRcdFx0PC9zdHlsZT5cblx0XHRcdDxpbWcgY2xhc3M9XCJpbWdcIj5cblx0XHRcdDxkaXYgY2xhc3M9XCJ3cmFwcGVyXCI+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJ0aXRsZVwiPlhYWDwvZGl2PlxuXHRcdFx0XHQ8Y3MtbGFiZWwtYW5kLWRhdGEgY2xhc3M9XCJjaGVja3RyZWNcIj5jaGVja2VkIHJlY29yZHM8L2NzLWxhYmVsLWFuZC1kYXRhPlxuXHRcdFx0XHQ8Y3MtbGFiZWwtYW5kLWRhdGEgY2xhc3M9XCJjaGVja2F0dHJcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIj5jaGVja2VkIGF0dHJpYnV0ZXM8L2NzLWxhYmVsLWFuZC1kYXRhPlxuXHRcdFx0XHQ8Y3MtbGFiZWwtYW5kLWRhdGEgY2xhc3M9XCJ0b3Rpc3N1ZXNcIiB4c3R5bGU9XCJkaXNwbGF5OiBub25lXCI+dG90YWwgaXNzdWVzPC9jcy1sYWJlbC1hbmQtZGF0YT5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImxhc3R1cGRhdGVcIj5cblx0XHRcdFx0XHQ8c3BhbiBjbGFzcz1cImRhdGFcIj48L3NwYW4+XG5cdFx0XHRcdFx0PHNwYW4+PC9zcGFuPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdFx0PGRpdiBjbGFzcz1cInZpZXdfZGFzaGJvYXJkXCI+VmlldyBkYXNoYm9hcmQ8L2Rpdj5cblx0XHRgXG5cblx0XHRjdXN0b21FbGVtZW50cy51cGdyYWRlKHNyb290KVxuXG5cdFx0dGhpcy5jaGVja3JlY3MgID0gY3NfY2FzdChMYWJlbEFuZERhdGEsICAgICAgc3Jvb3QucXVlcnlTZWxlY3RvcignLmNoZWNrdHJlYycpKVxuXHRcdHRoaXMuY2hlY2thdHRyICA9IGNzX2Nhc3QoTGFiZWxBbmREYXRhLCAgICAgIHNyb290LnF1ZXJ5U2VsZWN0b3IoJy5jaGVja2F0dHInKSlcblx0XHR0aGlzLmZhaWxlZHJlY3MgID0gY3NfY2FzdChMYWJlbEFuZERhdGEsICAgICBzcm9vdC5xdWVyeVNlbGVjdG9yKCcudG90aXNzdWVzJykpXG5cdFx0dGhpcy5kdGl0bGUgICAgID0gY3NfY2FzdChIVE1MRGl2RWxlbWVudCwgICAgc3Jvb3QucXVlcnlTZWxlY3RvcignLnRpdGxlJykpXG5cdFx0dGhpcy5pbWcgICAgICAgID0gY3NfY2FzdChIVE1MSW1hZ2VFbGVtZW50LCAgc3Jvb3QucXVlcnlTZWxlY3RvcignLmltZycpKVxuXHRcdHRoaXMubGFzdHVwZGF0ZSA9IGNzX2Nhc3QoSFRNTFNwYW5FbGVtZW50LCAgICAgIHNyb290LnF1ZXJ5U2VsZWN0b3IoJy5sYXN0dXBkYXRlIC5kYXRhJykpXG5cdFx0XHRcdFxuXHRcdHRoaXMuaW1nLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cdFx0XG5cdFx0dGhpcy5jaGVja3JlY3Muc2V0TGFiZWwoJ2NoZWNrZWQgcmVjcycpXG5cdFx0dGhpcy5jaGVja2F0dHIuc2V0TGFiZWwoJ2NoZWNrZWQgYXR0cnMnKVxuXHRcdHRoaXMuZmFpbGVkcmVjcy5zZXRMYWJlbCgnZmFpbGVkIHJlY3MnKVxuXHRcdFxuXHRcdC8vIHRoaXMuZmFpbGVkcmVjcy5zZXRTZXZlcml0eShcImZhaWxcIilcblx0XHQvLyB0aGlzLmZhaWxlZHJlY3Muc2V0RGF0YSgnMTIzJylcblxuXHR9XG5cblx0XG5cdHJlZnJlc2goZGF0YXNldDogY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9tYXhfdHNfdndfX3Jvdylcblx0e1xuXHRcdGNvbnN0IGRhdGVzdHIgPSBkYXRhc2V0LnNlc3Npb25fc3RhcnRfdHNcblx0XHRjb25zdCBkYXRlID0gbmV3IERhdGUoZGF0ZXN0cilcblx0XHRcblx0XHRjb25zdCBkYXRlZm9ybWF0ID0gbmV3IEludGwuRGF0ZVRpbWVGb3JtYXQoJ2l0LUlUJywge1xuXHRcdFx0eWVhcjogJ251bWVyaWMnLFxuXHRcdFx0bW9udGg6ICcyLWRpZ2l0Jyxcblx0XHRcdGRheTogJzItZGlnaXQnLFxuXHRcdFx0aG91cjogJzItZGlnaXQnLFxuXHRcdFx0bWludXRlOiBcIjItZGlnaXRcIixcblx0XHRcdHRpbWVab25lOiAnRXVyb3BlL1JvbWUnXG5cdFx0fSkuZm9ybWF0KGRhdGUpXG5cdFx0XG5cdFx0dGhpcy5kdGl0bGUudGV4dENvbnRlbnQgPSBkYXRhc2V0LmRhdGFzZXRfbmFtZVxuXHRcdHRoaXMuY2hlY2tyZWNzLnNldERhdGEoJycgKyBkYXRhc2V0LnRlc3RlZF9yZWNvcmRzKVxuXHRcdHRoaXMuY2hlY2thdHRyLnNldERhdGEoJzEyMycpXG5cdFx0dGhpcy5mYWlsZWRyZWNzLnNldERhdGEoJycgKyBkYXRhc2V0LmZhaWxlZF9yZWNvcmRzKVxuXHRcdGNvbnN0IHF1YWxpdHlfcmF0aW8gPSBkYXRhc2V0LnRlc3RlZF9yZWNvcmRzID09IDAgPyAxMDAgOiBkYXRhc2V0LmZhaWxlZF9yZWNvcmRzIC8gZGF0YXNldC50ZXN0ZWRfcmVjb3Jkc1xuXHRcdGlmIChxdWFsaXR5X3JhdGlvIDwgMC4xKVxuXHRcdFx0dGhpcy5mYWlsZWRyZWNzLnNldFF1YWxpdHlMZXZlbChcImdvb2RcIilcblx0XHRlbHNlIGlmIChxdWFsaXR5X3JhdGlvIDwgMC4zKVxuXHRcdFx0dGhpcy5mYWlsZWRyZWNzLnNldFF1YWxpdHlMZXZlbChcIndhcm5cIilcblx0XHRlbHNlXG5cdFx0XHR0aGlzLmZhaWxlZHJlY3Muc2V0UXVhbGl0eUxldmVsKFwiZmFpbFwiKVxuXHRcdHRoaXMubGFzdHVwZGF0ZS50ZXh0Q29udGVudCA9IGRhdGVmb3JtYXRcblx0XHR0aGlzLm9uY2xpY2sgPSAoKSA9PiB7XG5cdFx0XHRsb2NhdGlvbi5oYXNoID0gJyNwYWdlPWRhdGFzZXQtY2F0ZWdvcmllcycgKyAnJmRhdGFzZXRfbmFtZT0nICsgZGF0YXNldC5kYXRhc2V0X25hbWUgXG5cdFx0XHRcdFx0XHRcdCsgXCImc2Vzc2lvbl9zdGFydF90cz1cIiArIGRhdGFzZXQuc2Vzc2lvbl9zdGFydF90c1xuXHRcdFx0XHRcdFx0XHQrIFwiJmZhaWxlZF9yZWNvcmRzPVwiICsgZGF0YXNldC5mYWlsZWRfcmVjb3Jkc1xuXHRcdFx0XHRcdFx0XHQrIFwiJnRlc3RlZF9yZWNvcmRzPVwiICsgZGF0YXNldC50ZXN0ZWRfcmVjb3Jkc1xuXHRcdH1cblx0fVxufVxuXG5cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgnY3MtZGF0YXNldC1ib3gnLCBEYXRhU2V0Qm94Q29tcG9uZW50KVxuIl19