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
					padding: 0.5rem;
					border: 1px solid #ccc;
					margin: 0.5rem;
					border-radius: 4px;
					cursor: pointer;
					width: 14rem;
				}
				.title {
					font-weight: bold;
					margin-bottom: 1rem;
				}
				:host(:hover) .title {
					text-decoration: underline;
				}
				.ts {
					font-size: 0.7rem
				}
				
				
				
			</style>
			<img class="img">
			<div class="title">XXX</div>
			<cs-label-and-data class="checktrec">checked records</cs-label-and-data>
			<cs-label-and-data class="checkattr" style="display: none">checked attributes</cs-label-and-data>
			<cs-label-and-data class="totissues" xstyle="display: none">total issues</cs-label-and-data>
			<cs-label-and-data class="lastupdate">total issues</cs-label-and-data>
		`;
        customElements.upgrade(sroot);
        this.checkrecs = cs_cast(LabelAndData, sroot.querySelector('.checktrec'));
        this.checkattr = cs_cast(LabelAndData, sroot.querySelector('.checkattr'));
        this.failedrecs = cs_cast(LabelAndData, sroot.querySelector('.totissues'));
        this.dtitle = cs_cast(HTMLDivElement, sroot.querySelector('.title'));
        this.img = cs_cast(HTMLImageElement, sroot.querySelector('.img'));
        this.lastupdate = cs_cast(LabelAndData, sroot.querySelector('.lastupdate'));
        this.img.style.display = 'none';
        this.checkrecs.setLabel('checked recs');
        this.checkattr.setLabel('checked attrs');
        this.failedrecs.setLabel('failed recs');
        this.lastupdate.setLabel('last update');
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
        this.lastupdate.setData(dateformat);
        this.onclick = () => {
            location.hash = '#page=dataset-categories' + '&dataset_name=' + dataset.dataset_name + "&session_start_ts=" + dataset.session_start_ts;
        };
    }
}
customElements.define('cs-dataset-box', DataSetBoxComponent);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YVNldEJveENvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3R5cGVzY3JpcHQvRGF0YVNldEJveENvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxPQUFPLEVBQUUsT0FBTyxFQUFZLE1BQU0sY0FBYyxDQUFDO0FBRWpELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQTtBQUdoRCxNQUFNLE9BQU8sbUJBQW9CLFNBQVEsV0FBVztJQUVuRCxNQUFNLENBQUE7SUFDTixHQUFHLENBQUE7SUFDSCxTQUFTLENBQUE7SUFDVCxTQUFTLENBQUE7SUFDVCxVQUFVLENBQUE7SUFDVixVQUFVLENBQUE7SUFFVjtRQUVDLEtBQUssRUFBRSxDQUFBO1FBQ1AsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFBO1FBQy9DLEtBQUssQ0FBQyxTQUFTLEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQThCakIsQ0FBQTtRQUVELGNBQWMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7UUFFN0IsSUFBSSxDQUFDLFNBQVMsR0FBSSxPQUFPLENBQUMsWUFBWSxFQUFPLEtBQUssQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQTtRQUMvRSxJQUFJLENBQUMsU0FBUyxHQUFJLE9BQU8sQ0FBQyxZQUFZLEVBQU8sS0FBSyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFBO1FBQy9FLElBQUksQ0FBQyxVQUFVLEdBQUksT0FBTyxDQUFDLFlBQVksRUFBTSxLQUFLLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUE7UUFDL0UsSUFBSSxDQUFDLE1BQU0sR0FBTyxPQUFPLENBQUMsY0FBYyxFQUFLLEtBQUssQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQTtRQUMzRSxJQUFJLENBQUMsR0FBRyxHQUFVLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7UUFDekUsSUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsWUFBWSxFQUFPLEtBQUssQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQTtRQUVoRixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBRWhDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFBO1FBQ3ZDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxDQUFBO1FBQ3hDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFBO1FBQ3ZDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFBO1FBRXZDLHNDQUFzQztRQUN0QyxpQ0FBaUM7SUFFbEMsQ0FBQztJQUdELE9BQU8sQ0FBQyxPQUF1RDtRQUU5RCxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUE7UUFDeEMsTUFBTSxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7UUFFOUIsTUFBTSxVQUFVLEdBQUcsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRTtZQUNuRCxJQUFJLEVBQUUsU0FBUztZQUNmLEtBQUssRUFBRSxTQUFTO1lBQ2hCLEdBQUcsRUFBRSxTQUFTO1lBQ2QsSUFBSSxFQUFFLFNBQVM7WUFDZixNQUFNLEVBQUUsU0FBUztZQUNqQixRQUFRLEVBQUUsYUFBYTtTQUN2QixDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBRWYsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQTtRQUM5QyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFBO1FBQ25ELElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQzdCLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUUsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUE7UUFDcEQsTUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLGNBQWMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFBO1FBQ3pHLElBQUksYUFBYSxHQUFHLEdBQUc7WUFDdEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUE7YUFDbkMsSUFBSSxhQUFhLEdBQUcsR0FBRztZQUMzQixJQUFJLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQTs7WUFFdkMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDeEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUE7UUFDbkMsSUFBSSxDQUFDLE9BQU8sR0FBRyxHQUFHLEVBQUU7WUFDbkIsUUFBUSxDQUFDLElBQUksR0FBRywwQkFBMEIsR0FBRyxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsWUFBWSxHQUFHLG9CQUFvQixHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQTtRQUN2SSxDQUFDLENBQUE7SUFDRixDQUFDO0NBQ0Q7QUFHRCxjQUFjLENBQUMsTUFBTSxDQUFDLGdCQUFnQixFQUFFLG1CQUFtQixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogKEMpIDIwMjQgQ2F0Y2ggU29sdmUgZGkgRGF2aWRlIE1vbnRlc2luXG4gKiBMaWNlbnNlOiBBR1BMXG4gKi9cblxuaW1wb3J0IHsgY3NfY2FzdCwgdGhyb3dOUEUgfSBmcm9tIFwiLi9xdWFsaXR5LmpzXCI7XG5cbmltcG9ydCB7IExhYmVsQW5kRGF0YSB9IGZyb20gXCIuL0xhYmVsQW5kRGF0YS5qc1wiXG5pbXBvcnQgeyBjYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X21heF90c192d19fcm93IH0gZnJvbSBcIi4vYXBpL2FwaTMuanNcIjtcblxuZXhwb3J0IGNsYXNzIERhdGFTZXRCb3hDb21wb25lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudFxue1xuXHRkdGl0bGVcblx0aW1nXG5cdGNoZWNrcmVjc1xuXHRjaGVja2F0dHJcblx0ZmFpbGVkcmVjc1xuXHRsYXN0dXBkYXRlXG5cdFxuXHRjb25zdHJ1Y3RvcigpXG5cdHtcblx0XHRzdXBlcigpXG5cdFx0Y29uc3Qgc3Jvb3QgPSB0aGlzLmF0dGFjaFNoYWRvdyh7bW9kZTogJ29wZW4nfSlcblx0XHRzcm9vdC5pbm5lckhUTUwgPSBgXG5cdFx0XHQ8c3R5bGU+XG5cdFx0XHRcdDpob3N0IHtcblx0XHRcdFx0XHRwYWRkaW5nOiAwLjVyZW07XG5cdFx0XHRcdFx0Ym9yZGVyOiAxcHggc29saWQgI2NjYztcblx0XHRcdFx0XHRtYXJnaW46IDAuNXJlbTtcblx0XHRcdFx0XHRib3JkZXItcmFkaXVzOiA0cHg7XG5cdFx0XHRcdFx0Y3Vyc29yOiBwb2ludGVyO1xuXHRcdFx0XHRcdHdpZHRoOiAxNHJlbTtcblx0XHRcdFx0fVxuXHRcdFx0XHQudGl0bGUge1xuXHRcdFx0XHRcdGZvbnQtd2VpZ2h0OiBib2xkO1xuXHRcdFx0XHRcdG1hcmdpbi1ib3R0b206IDFyZW07XG5cdFx0XHRcdH1cblx0XHRcdFx0Omhvc3QoOmhvdmVyKSAudGl0bGUge1xuXHRcdFx0XHRcdHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC50cyB7XG5cdFx0XHRcdFx0Zm9udC1zaXplOiAwLjdyZW1cblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0XG5cdFx0XHRcdFxuXHRcdFx0PC9zdHlsZT5cblx0XHRcdDxpbWcgY2xhc3M9XCJpbWdcIj5cblx0XHRcdDxkaXYgY2xhc3M9XCJ0aXRsZVwiPlhYWDwvZGl2PlxuXHRcdFx0PGNzLWxhYmVsLWFuZC1kYXRhIGNsYXNzPVwiY2hlY2t0cmVjXCI+Y2hlY2tlZCByZWNvcmRzPC9jcy1sYWJlbC1hbmQtZGF0YT5cblx0XHRcdDxjcy1sYWJlbC1hbmQtZGF0YSBjbGFzcz1cImNoZWNrYXR0clwiIHN0eWxlPVwiZGlzcGxheTogbm9uZVwiPmNoZWNrZWQgYXR0cmlidXRlczwvY3MtbGFiZWwtYW5kLWRhdGE+XG5cdFx0XHQ8Y3MtbGFiZWwtYW5kLWRhdGEgY2xhc3M9XCJ0b3Rpc3N1ZXNcIiB4c3R5bGU9XCJkaXNwbGF5OiBub25lXCI+dG90YWwgaXNzdWVzPC9jcy1sYWJlbC1hbmQtZGF0YT5cblx0XHRcdDxjcy1sYWJlbC1hbmQtZGF0YSBjbGFzcz1cImxhc3R1cGRhdGVcIj50b3RhbCBpc3N1ZXM8L2NzLWxhYmVsLWFuZC1kYXRhPlxuXHRcdGBcblxuXHRcdGN1c3RvbUVsZW1lbnRzLnVwZ3JhZGUoc3Jvb3QpXG5cblx0XHR0aGlzLmNoZWNrcmVjcyAgPSBjc19jYXN0KExhYmVsQW5kRGF0YSwgICAgICBzcm9vdC5xdWVyeVNlbGVjdG9yKCcuY2hlY2t0cmVjJykpXG5cdFx0dGhpcy5jaGVja2F0dHIgID0gY3NfY2FzdChMYWJlbEFuZERhdGEsICAgICAgc3Jvb3QucXVlcnlTZWxlY3RvcignLmNoZWNrYXR0cicpKVxuXHRcdHRoaXMuZmFpbGVkcmVjcyAgPSBjc19jYXN0KExhYmVsQW5kRGF0YSwgICAgIHNyb290LnF1ZXJ5U2VsZWN0b3IoJy50b3Rpc3N1ZXMnKSlcblx0XHR0aGlzLmR0aXRsZSAgICAgPSBjc19jYXN0KEhUTUxEaXZFbGVtZW50LCAgICBzcm9vdC5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKSlcblx0XHR0aGlzLmltZyAgICAgICAgPSBjc19jYXN0KEhUTUxJbWFnZUVsZW1lbnQsICBzcm9vdC5xdWVyeVNlbGVjdG9yKCcuaW1nJykpXG5cdFx0dGhpcy5sYXN0dXBkYXRlID0gY3NfY2FzdChMYWJlbEFuZERhdGEsICAgICAgc3Jvb3QucXVlcnlTZWxlY3RvcignLmxhc3R1cGRhdGUnKSlcblx0XHRcdFx0XG5cdFx0dGhpcy5pbWcuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblx0XHRcblx0XHR0aGlzLmNoZWNrcmVjcy5zZXRMYWJlbCgnY2hlY2tlZCByZWNzJylcblx0XHR0aGlzLmNoZWNrYXR0ci5zZXRMYWJlbCgnY2hlY2tlZCBhdHRycycpXG5cdFx0dGhpcy5mYWlsZWRyZWNzLnNldExhYmVsKCdmYWlsZWQgcmVjcycpXG5cdFx0dGhpcy5sYXN0dXBkYXRlLnNldExhYmVsKCdsYXN0IHVwZGF0ZScpXG5cdFx0XG5cdFx0Ly8gdGhpcy5mYWlsZWRyZWNzLnNldFNldmVyaXR5KFwiZmFpbFwiKVxuXHRcdC8vIHRoaXMuZmFpbGVkcmVjcy5zZXREYXRhKCcxMjMnKVxuXG5cdH1cblxuXHRcblx0cmVmcmVzaChkYXRhc2V0OiBjYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X21heF90c192d19fcm93KVxuXHR7XG5cdFx0Y29uc3QgZGF0ZXN0ciA9IGRhdGFzZXQuc2Vzc2lvbl9zdGFydF90c1xuXHRcdGNvbnN0IGRhdGUgPSBuZXcgRGF0ZShkYXRlc3RyKVxuXHRcdFxuXHRcdGNvbnN0IGRhdGVmb3JtYXQgPSBuZXcgSW50bC5EYXRlVGltZUZvcm1hdCgnaXQtSVQnLCB7XG5cdFx0XHR5ZWFyOiAnbnVtZXJpYycsXG5cdFx0XHRtb250aDogJzItZGlnaXQnLFxuXHRcdFx0ZGF5OiAnMi1kaWdpdCcsXG5cdFx0XHRob3VyOiAnMi1kaWdpdCcsXG5cdFx0XHRtaW51dGU6IFwiMi1kaWdpdFwiLFxuXHRcdFx0dGltZVpvbmU6ICdFdXJvcGUvUm9tZSdcblx0XHR9KS5mb3JtYXQoZGF0ZSlcblx0XHRcblx0XHR0aGlzLmR0aXRsZS50ZXh0Q29udGVudCA9IGRhdGFzZXQuZGF0YXNldF9uYW1lXG5cdFx0dGhpcy5jaGVja3JlY3Muc2V0RGF0YSgnJyArIGRhdGFzZXQudGVzdGVkX3JlY29yZHMpXG5cdFx0dGhpcy5jaGVja2F0dHIuc2V0RGF0YSgnMTIzJylcblx0XHR0aGlzLmZhaWxlZHJlY3Muc2V0RGF0YSgnJyArIGRhdGFzZXQuZmFpbGVkX3JlY29yZHMpXG5cdFx0Y29uc3QgcXVhbGl0eV9yYXRpbyA9IGRhdGFzZXQudGVzdGVkX3JlY29yZHMgPT0gMCA/IDEwMCA6IGRhdGFzZXQuZmFpbGVkX3JlY29yZHMgLyBkYXRhc2V0LnRlc3RlZF9yZWNvcmRzXG5cdFx0aWYgKHF1YWxpdHlfcmF0aW8gPCAwLjEpXG5cdFx0XHR0aGlzLmZhaWxlZHJlY3Muc2V0UXVhbGl0eUxldmVsKFwiZ29vZFwiKVxuXHRcdGVsc2UgaWYgKHF1YWxpdHlfcmF0aW8gPCAwLjMpXG5cdFx0XHR0aGlzLmZhaWxlZHJlY3Muc2V0UXVhbGl0eUxldmVsKFwid2FyblwiKVxuXHRcdGVsc2Vcblx0XHRcdHRoaXMuZmFpbGVkcmVjcy5zZXRRdWFsaXR5TGV2ZWwoXCJmYWlsXCIpXG5cdFx0dGhpcy5sYXN0dXBkYXRlLnNldERhdGEoZGF0ZWZvcm1hdClcblx0XHR0aGlzLm9uY2xpY2sgPSAoKSA9PiB7XG5cdFx0XHRsb2NhdGlvbi5oYXNoID0gJyNwYWdlPWRhdGFzZXQtY2F0ZWdvcmllcycgKyAnJmRhdGFzZXRfbmFtZT0nICsgZGF0YXNldC5kYXRhc2V0X25hbWUgKyBcIiZzZXNzaW9uX3N0YXJ0X3RzPVwiICsgZGF0YXNldC5zZXNzaW9uX3N0YXJ0X3RzXG5cdFx0fVxuXHR9XG59XG5cblxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCdjcy1kYXRhc2V0LWJveCcsIERhdGFTZXRCb3hDb21wb25lbnQpXG4iXX0=