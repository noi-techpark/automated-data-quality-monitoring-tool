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
            location.hash = '#page=dataset-categories' + '&dataset_name=' + dataset.dataset_name + "&session_start_ts=" + dataset.session_start_ts;
        };
    }
}
customElements.define('cs-dataset-box', DataSetBoxComponent);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YVNldEJveENvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3R5cGVzY3JpcHQvRGF0YVNldEJveENvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxPQUFPLEVBQUUsT0FBTyxFQUFZLE1BQU0sY0FBYyxDQUFDO0FBRWpELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQTtBQUdoRCxNQUFNLE9BQU8sbUJBQW9CLFNBQVEsV0FBVztJQUVuRCxNQUFNLENBQUE7SUFDTixHQUFHLENBQUE7SUFDSCxTQUFTLENBQUE7SUFDVCxTQUFTLENBQUE7SUFDVCxVQUFVLENBQUE7SUFDVixVQUFVLENBQUE7SUFFVjtRQUVDLEtBQUssRUFBRSxDQUFBO1FBQ1AsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFBO1FBQy9DLEtBQUssQ0FBQyxTQUFTLEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0RqQixDQUFBO1FBRUQsY0FBYyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUU3QixJQUFJLENBQUMsU0FBUyxHQUFJLE9BQU8sQ0FBQyxZQUFZLEVBQU8sS0FBSyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFBO1FBQy9FLElBQUksQ0FBQyxTQUFTLEdBQUksT0FBTyxDQUFDLFlBQVksRUFBTyxLQUFLLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUE7UUFDL0UsSUFBSSxDQUFDLFVBQVUsR0FBSSxPQUFPLENBQUMsWUFBWSxFQUFNLEtBQUssQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQTtRQUMvRSxJQUFJLENBQUMsTUFBTSxHQUFPLE9BQU8sQ0FBQyxjQUFjLEVBQUssS0FBSyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFBO1FBQzNFLElBQUksQ0FBQyxHQUFHLEdBQVUsT0FBTyxDQUFDLGdCQUFnQixFQUFHLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtRQUN6RSxJQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxlQUFlLEVBQU8sS0FBSyxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUE7UUFFekYsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUVoQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQTtRQUN2QyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQTtRQUN4QyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQTtRQUV2QyxzQ0FBc0M7UUFDdEMsaUNBQWlDO0lBRWxDLENBQUM7SUFHRCxPQUFPLENBQUMsT0FBdUQ7UUFFOUQsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFBO1FBQ3hDLE1BQU0sSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBRTlCLE1BQU0sVUFBVSxHQUFHLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUU7WUFDbkQsSUFBSSxFQUFFLFNBQVM7WUFDZixLQUFLLEVBQUUsU0FBUztZQUNoQixHQUFHLEVBQUUsU0FBUztZQUNkLElBQUksRUFBRSxTQUFTO1lBQ2YsTUFBTSxFQUFFLFNBQVM7WUFDakIsUUFBUSxFQUFFLGFBQWE7U0FDdkIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUVmLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUE7UUFDOUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRSxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQTtRQUNuRCxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUM3QixJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFBO1FBQ3BELE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxjQUFjLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxjQUFjLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQTtRQUN6RyxJQUFJLGFBQWEsR0FBRyxHQUFHO1lBQ3RCLElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFBO2FBQ25DLElBQUksYUFBYSxHQUFHLEdBQUc7WUFDM0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUE7O1lBRXZDLElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ3hDLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQTtRQUN4QyxJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRTtZQUNuQixRQUFRLENBQUMsSUFBSSxHQUFHLDBCQUEwQixHQUFHLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxZQUFZLEdBQUcsb0JBQW9CLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFBO1FBQ3ZJLENBQUMsQ0FBQTtJQUNGLENBQUM7Q0FDRDtBQUdELGNBQWMsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsbUJBQW1CLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAoQykgMjAyNCBDYXRjaCBTb2x2ZSBkaSBEYXZpZGUgTW9udGVzaW5cbiAqIExpY2Vuc2U6IEFHUExcbiAqL1xuXG5pbXBvcnQgeyBjc19jYXN0LCB0aHJvd05QRSB9IGZyb20gXCIuL3F1YWxpdHkuanNcIjtcblxuaW1wb3J0IHsgTGFiZWxBbmREYXRhIH0gZnJvbSBcIi4vTGFiZWxBbmREYXRhLmpzXCJcbmltcG9ydCB7IGNhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfbWF4X3RzX3Z3X19yb3cgfSBmcm9tIFwiLi9hcGkvYXBpMy5qc1wiO1xuXG5leHBvcnQgY2xhc3MgRGF0YVNldEJveENvbXBvbmVudCBleHRlbmRzIEhUTUxFbGVtZW50XG57XG5cdGR0aXRsZVxuXHRpbWdcblx0Y2hlY2tyZWNzXG5cdGNoZWNrYXR0clxuXHRmYWlsZWRyZWNzXG5cdGxhc3R1cGRhdGVcblx0XG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXHRcdHN1cGVyKClcblx0XHRjb25zdCBzcm9vdCA9IHRoaXMuYXR0YWNoU2hhZG93KHttb2RlOiAnb3Blbid9KVxuXHRcdHNyb290LmlubmVySFRNTCA9IGBcblx0XHRcdDxzdHlsZT5cblx0XHRcdFx0Omhvc3Qge1xuXHRcdFx0XHRcdGJvcmRlcjogMXB4IHNvbGlkICNjY2M7XG5cdFx0XHRcdFx0bWFyZ2luOiAwLjVyZW07XG5cdFx0XHRcdFx0Ym9yZGVyLXJhZGl1czogNHB4O1xuXHRcdFx0XHRcdGN1cnNvcjogcG9pbnRlcjtcblx0XHRcdFx0XHR3aWR0aDogMTNyZW07XG5cdFx0XHRcdH1cblx0XHRcdFx0LnRpdGxlIHtcblx0XHRcdFx0XHRmb250LXdlaWdodDogYm9sZDtcblx0XHRcdFx0XHRtYXJnaW4tdG9wOiAuN3JlbTtcblx0XHRcdFx0XHRtYXJnaW4tYm90dG9tOiAxcmVtO1xuXHRcdFx0XHRcdHRleHQtYWxpZ246IGNlbnRlcjtcblx0XHRcdFx0XHRvdmVyZmxvdzogaGlkZGVuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0XHQvKlxuXHRcdFx0XHQ6aG9zdCg6aG92ZXIpIC50aXRsZSB7XG5cdFx0XHRcdFx0dGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XG5cdFx0XHRcdH1cblx0XHRcdFx0ICovXG5cdFx0XHRcdFxuXHRcdFx0XHQudHMge1xuXHRcdFx0XHRcdGZvbnQtc2l6ZTogMC43cmVtXG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHRcdC52aWV3X2Rhc2hib2FyZCB7XG5cdFx0XHRcdFx0YmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZGFyay1iYWNrZ3JvdW5kKTtcblx0XHRcdFx0XHRjb2xvcjogI2RkZDtcblx0XHRcdFx0XHR0ZXh0LWFsaWduOiBjZW50ZXI7XG5cdFx0XHRcdFx0cGFkZGluZzogMC42cmVtO1xuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0XHQud3JhcHBlciB7XG5cdFx0XHRcdFx0cGFkZGluZzogMXJlbTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC5sYXN0dXBkYXRlIHtcblx0XHRcdFx0XHRtYXJnaW4tdG9wOiAwLjRyZW07XG5cdFx0XHRcdFx0Zm9udC1zaXplOiAwLjdyZW07XG5cdFx0XHRcdH1cblx0XG5cdFx0XHQ8L3N0eWxlPlxuXHRcdFx0PGltZyBjbGFzcz1cImltZ1wiPlxuXHRcdFx0PGRpdiBjbGFzcz1cIndyYXBwZXJcIj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cInRpdGxlXCI+WFhYPC9kaXY+XG5cdFx0XHRcdDxjcy1sYWJlbC1hbmQtZGF0YSBjbGFzcz1cImNoZWNrdHJlY1wiPmNoZWNrZWQgcmVjb3JkczwvY3MtbGFiZWwtYW5kLWRhdGE+XG5cdFx0XHRcdDxjcy1sYWJlbC1hbmQtZGF0YSBjbGFzcz1cImNoZWNrYXR0clwiIHN0eWxlPVwiZGlzcGxheTogbm9uZVwiPmNoZWNrZWQgYXR0cmlidXRlczwvY3MtbGFiZWwtYW5kLWRhdGE+XG5cdFx0XHRcdDxjcy1sYWJlbC1hbmQtZGF0YSBjbGFzcz1cInRvdGlzc3Vlc1wiIHhzdHlsZT1cImRpc3BsYXk6IG5vbmVcIj50b3RhbCBpc3N1ZXM8L2NzLWxhYmVsLWFuZC1kYXRhPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwibGFzdHVwZGF0ZVwiPlxuXHRcdFx0XHRcdDxzcGFuIGNsYXNzPVwiZGF0YVwiPjwvc3Bhbj5cblx0XHRcdFx0XHQ8c3Bhbj48L3NwYW4+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0PC9kaXY+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwidmlld19kYXNoYm9hcmRcIj5WaWV3IGRhc2hib2FyZDwvZGl2PlxuXHRcdGBcblxuXHRcdGN1c3RvbUVsZW1lbnRzLnVwZ3JhZGUoc3Jvb3QpXG5cblx0XHR0aGlzLmNoZWNrcmVjcyAgPSBjc19jYXN0KExhYmVsQW5kRGF0YSwgICAgICBzcm9vdC5xdWVyeVNlbGVjdG9yKCcuY2hlY2t0cmVjJykpXG5cdFx0dGhpcy5jaGVja2F0dHIgID0gY3NfY2FzdChMYWJlbEFuZERhdGEsICAgICAgc3Jvb3QucXVlcnlTZWxlY3RvcignLmNoZWNrYXR0cicpKVxuXHRcdHRoaXMuZmFpbGVkcmVjcyAgPSBjc19jYXN0KExhYmVsQW5kRGF0YSwgICAgIHNyb290LnF1ZXJ5U2VsZWN0b3IoJy50b3Rpc3N1ZXMnKSlcblx0XHR0aGlzLmR0aXRsZSAgICAgPSBjc19jYXN0KEhUTUxEaXZFbGVtZW50LCAgICBzcm9vdC5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKSlcblx0XHR0aGlzLmltZyAgICAgICAgPSBjc19jYXN0KEhUTUxJbWFnZUVsZW1lbnQsICBzcm9vdC5xdWVyeVNlbGVjdG9yKCcuaW1nJykpXG5cdFx0dGhpcy5sYXN0dXBkYXRlID0gY3NfY2FzdChIVE1MU3BhbkVsZW1lbnQsICAgICAgc3Jvb3QucXVlcnlTZWxlY3RvcignLmxhc3R1cGRhdGUgLmRhdGEnKSlcblx0XHRcdFx0XG5cdFx0dGhpcy5pbWcuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblx0XHRcblx0XHR0aGlzLmNoZWNrcmVjcy5zZXRMYWJlbCgnY2hlY2tlZCByZWNzJylcblx0XHR0aGlzLmNoZWNrYXR0ci5zZXRMYWJlbCgnY2hlY2tlZCBhdHRycycpXG5cdFx0dGhpcy5mYWlsZWRyZWNzLnNldExhYmVsKCdmYWlsZWQgcmVjcycpXG5cdFx0XG5cdFx0Ly8gdGhpcy5mYWlsZWRyZWNzLnNldFNldmVyaXR5KFwiZmFpbFwiKVxuXHRcdC8vIHRoaXMuZmFpbGVkcmVjcy5zZXREYXRhKCcxMjMnKVxuXG5cdH1cblxuXHRcblx0cmVmcmVzaChkYXRhc2V0OiBjYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X21heF90c192d19fcm93KVxuXHR7XG5cdFx0Y29uc3QgZGF0ZXN0ciA9IGRhdGFzZXQuc2Vzc2lvbl9zdGFydF90c1xuXHRcdGNvbnN0IGRhdGUgPSBuZXcgRGF0ZShkYXRlc3RyKVxuXHRcdFxuXHRcdGNvbnN0IGRhdGVmb3JtYXQgPSBuZXcgSW50bC5EYXRlVGltZUZvcm1hdCgnaXQtSVQnLCB7XG5cdFx0XHR5ZWFyOiAnbnVtZXJpYycsXG5cdFx0XHRtb250aDogJzItZGlnaXQnLFxuXHRcdFx0ZGF5OiAnMi1kaWdpdCcsXG5cdFx0XHRob3VyOiAnMi1kaWdpdCcsXG5cdFx0XHRtaW51dGU6IFwiMi1kaWdpdFwiLFxuXHRcdFx0dGltZVpvbmU6ICdFdXJvcGUvUm9tZSdcblx0XHR9KS5mb3JtYXQoZGF0ZSlcblx0XHRcblx0XHR0aGlzLmR0aXRsZS50ZXh0Q29udGVudCA9IGRhdGFzZXQuZGF0YXNldF9uYW1lXG5cdFx0dGhpcy5jaGVja3JlY3Muc2V0RGF0YSgnJyArIGRhdGFzZXQudGVzdGVkX3JlY29yZHMpXG5cdFx0dGhpcy5jaGVja2F0dHIuc2V0RGF0YSgnMTIzJylcblx0XHR0aGlzLmZhaWxlZHJlY3Muc2V0RGF0YSgnJyArIGRhdGFzZXQuZmFpbGVkX3JlY29yZHMpXG5cdFx0Y29uc3QgcXVhbGl0eV9yYXRpbyA9IGRhdGFzZXQudGVzdGVkX3JlY29yZHMgPT0gMCA/IDEwMCA6IGRhdGFzZXQuZmFpbGVkX3JlY29yZHMgLyBkYXRhc2V0LnRlc3RlZF9yZWNvcmRzXG5cdFx0aWYgKHF1YWxpdHlfcmF0aW8gPCAwLjEpXG5cdFx0XHR0aGlzLmZhaWxlZHJlY3Muc2V0UXVhbGl0eUxldmVsKFwiZ29vZFwiKVxuXHRcdGVsc2UgaWYgKHF1YWxpdHlfcmF0aW8gPCAwLjMpXG5cdFx0XHR0aGlzLmZhaWxlZHJlY3Muc2V0UXVhbGl0eUxldmVsKFwid2FyblwiKVxuXHRcdGVsc2Vcblx0XHRcdHRoaXMuZmFpbGVkcmVjcy5zZXRRdWFsaXR5TGV2ZWwoXCJmYWlsXCIpXG5cdFx0dGhpcy5sYXN0dXBkYXRlLnRleHRDb250ZW50ID0gZGF0ZWZvcm1hdFxuXHRcdHRoaXMub25jbGljayA9ICgpID0+IHtcblx0XHRcdGxvY2F0aW9uLmhhc2ggPSAnI3BhZ2U9ZGF0YXNldC1jYXRlZ29yaWVzJyArICcmZGF0YXNldF9uYW1lPScgKyBkYXRhc2V0LmRhdGFzZXRfbmFtZSArIFwiJnNlc3Npb25fc3RhcnRfdHM9XCIgKyBkYXRhc2V0LnNlc3Npb25fc3RhcnRfdHNcblx0XHR9XG5cdH1cbn1cblxuXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ2NzLWRhdGFzZXQtYm94JywgRGF0YVNldEJveENvbXBvbmVudClcbiJdfQ==