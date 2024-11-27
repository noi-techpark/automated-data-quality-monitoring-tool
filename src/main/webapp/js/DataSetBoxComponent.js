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
    totissues;
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
        this.totissues = cs_cast(LabelAndData, sroot.querySelector('.totissues'));
        this.dtitle = cs_cast(HTMLDivElement, sroot.querySelector('.title'));
        this.img = cs_cast(HTMLImageElement, sroot.querySelector('.img'));
        this.lastupdate = cs_cast(LabelAndData, sroot.querySelector('.lastupdate'));
        this.img.style.display = 'none';
        this.checkrecs.setLabel('checked recs');
        this.checkattr.setLabel('checked attrs');
        this.totissues.setLabel('tot issues');
        this.lastupdate.setLabel('last update');
        this.totissues.setSeverity("fail");
        this.totissues.setData('123');
    }
    refresh(dataset) {
        /*
        this.dtitle.textContent=(dataset.Shortname);
        // console.log(dataset)
        if (dataset.ImageGallery != null && dataset.ImageGallery.length > 0)
            this.img.src=(dataset.ImageGallery[0].ImageUrl + "&width=160");
         */
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
        this.totissues.setData('' + dataset.failed_records);
        this.lastupdate.setData(dateformat);
        this.onclick = () => {
            location.hash = '#page=dataset-categories' + '&dataset_name=' + dataset.dataset_name + "&session_start_ts=" + dataset.session_start_ts;
        };
    }
}
customElements.define('cs-dataset-box', DataSetBoxComponent);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YVNldEJveENvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3R5cGVzY3JpcHQvRGF0YVNldEJveENvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxPQUFPLEVBQUUsT0FBTyxFQUFZLE1BQU0sY0FBYyxDQUFDO0FBRWpELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQTtBQUdoRCxNQUFNLE9BQU8sbUJBQW9CLFNBQVEsV0FBVztJQUVuRCxNQUFNLENBQUE7SUFDTixHQUFHLENBQUE7SUFDSCxTQUFTLENBQUE7SUFDVCxTQUFTLENBQUE7SUFDVCxTQUFTLENBQUE7SUFDVCxVQUFVLENBQUE7SUFFVjtRQUVDLEtBQUssRUFBRSxDQUFBO1FBQ1AsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFBO1FBQy9DLEtBQUssQ0FBQyxTQUFTLEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQThCakIsQ0FBQTtRQUVELGNBQWMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7UUFFN0IsSUFBSSxDQUFDLFNBQVMsR0FBSSxPQUFPLENBQUMsWUFBWSxFQUFPLEtBQUssQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQTtRQUMvRSxJQUFJLENBQUMsU0FBUyxHQUFJLE9BQU8sQ0FBQyxZQUFZLEVBQU8sS0FBSyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFBO1FBQy9FLElBQUksQ0FBQyxTQUFTLEdBQUksT0FBTyxDQUFDLFlBQVksRUFBTyxLQUFLLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUE7UUFDL0UsSUFBSSxDQUFDLE1BQU0sR0FBTyxPQUFPLENBQUMsY0FBYyxFQUFLLEtBQUssQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQTtRQUMzRSxJQUFJLENBQUMsR0FBRyxHQUFVLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7UUFDekUsSUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsWUFBWSxFQUFPLEtBQUssQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQTtRQUVoRixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBRWhDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFBO1FBQ3ZDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxDQUFBO1FBQ3hDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFBO1FBQ3JDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFBO1FBRXZDLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ2xDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBRTlCLENBQUM7SUFHRCxPQUFPLENBQUMsT0FBdUQ7UUFFOUQ7Ozs7O1dBS0c7UUFFSCxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUE7UUFDeEMsTUFBTSxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7UUFFOUIsTUFBTSxVQUFVLEdBQUcsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRTtZQUNuRCxJQUFJLEVBQUUsU0FBUztZQUNmLEtBQUssRUFBRSxTQUFTO1lBQ2hCLEdBQUcsRUFBRSxTQUFTO1lBQ2QsSUFBSSxFQUFFLFNBQVM7WUFDZixNQUFNLEVBQUUsU0FBUztZQUNqQixRQUFRLEVBQUUsYUFBYTtTQUN2QixDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBRWYsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQTtRQUM5QyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFBO1FBQ25ELElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQzdCLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUUsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUE7UUFDbkQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUE7UUFDbkMsSUFBSSxDQUFDLE9BQU8sR0FBRyxHQUFHLEVBQUU7WUFDbkIsUUFBUSxDQUFDLElBQUksR0FBRywwQkFBMEIsR0FBRyxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsWUFBWSxHQUFHLG9CQUFvQixHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQTtRQUN2SSxDQUFDLENBQUE7SUFDRixDQUFDO0NBQ0Q7QUFHRCxjQUFjLENBQUMsTUFBTSxDQUFDLGdCQUFnQixFQUFFLG1CQUFtQixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogKEMpIDIwMjQgQ2F0Y2ggU29sdmUgZGkgRGF2aWRlIE1vbnRlc2luXG4gKiBMaWNlbnNlOiBBR1BMXG4gKi9cblxuaW1wb3J0IHsgY3NfY2FzdCwgdGhyb3dOUEUgfSBmcm9tIFwiLi9xdWFsaXR5LmpzXCI7XG5cbmltcG9ydCB7IExhYmVsQW5kRGF0YSB9IGZyb20gXCIuL0xhYmVsQW5kRGF0YS5qc1wiXG5pbXBvcnQgeyBjYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X21heF90c192d19fcm93IH0gZnJvbSBcIi4vYXBpL2FwaTMuanNcIjtcblxuZXhwb3J0IGNsYXNzIERhdGFTZXRCb3hDb21wb25lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudFxue1xuXHRkdGl0bGVcblx0aW1nXG5cdGNoZWNrcmVjc1xuXHRjaGVja2F0dHJcblx0dG90aXNzdWVzXG5cdGxhc3R1cGRhdGVcblx0XG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXHRcdHN1cGVyKClcblx0XHRjb25zdCBzcm9vdCA9IHRoaXMuYXR0YWNoU2hhZG93KHttb2RlOiAnb3Blbid9KVxuXHRcdHNyb290LmlubmVySFRNTCA9IGBcblx0XHRcdDxzdHlsZT5cblx0XHRcdFx0Omhvc3Qge1xuXHRcdFx0XHRcdHBhZGRpbmc6IDAuNXJlbTtcblx0XHRcdFx0XHRib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xuXHRcdFx0XHRcdG1hcmdpbjogMC41cmVtO1xuXHRcdFx0XHRcdGJvcmRlci1yYWRpdXM6IDRweDtcblx0XHRcdFx0XHRjdXJzb3I6IHBvaW50ZXI7XG5cdFx0XHRcdFx0d2lkdGg6IDE0cmVtO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC50aXRsZSB7XG5cdFx0XHRcdFx0Zm9udC13ZWlnaHQ6IGJvbGQ7XG5cdFx0XHRcdFx0bWFyZ2luLWJvdHRvbTogMXJlbTtcblx0XHRcdFx0fVxuXHRcdFx0XHQ6aG9zdCg6aG92ZXIpIC50aXRsZSB7XG5cdFx0XHRcdFx0dGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XG5cdFx0XHRcdH1cblx0XHRcdFx0LnRzIHtcblx0XHRcdFx0XHRmb250LXNpemU6IDAuN3JlbVxuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0XHRcblx0XHRcdFx0XG5cdFx0XHQ8L3N0eWxlPlxuXHRcdFx0PGltZyBjbGFzcz1cImltZ1wiPlxuXHRcdFx0PGRpdiBjbGFzcz1cInRpdGxlXCI+WFhYPC9kaXY+XG5cdFx0XHQ8Y3MtbGFiZWwtYW5kLWRhdGEgY2xhc3M9XCJjaGVja3RyZWNcIj5jaGVja2VkIHJlY29yZHM8L2NzLWxhYmVsLWFuZC1kYXRhPlxuXHRcdFx0PGNzLWxhYmVsLWFuZC1kYXRhIGNsYXNzPVwiY2hlY2thdHRyXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lXCI+Y2hlY2tlZCBhdHRyaWJ1dGVzPC9jcy1sYWJlbC1hbmQtZGF0YT5cblx0XHRcdDxjcy1sYWJlbC1hbmQtZGF0YSBjbGFzcz1cInRvdGlzc3Vlc1wiIHhzdHlsZT1cImRpc3BsYXk6IG5vbmVcIj50b3RhbCBpc3N1ZXM8L2NzLWxhYmVsLWFuZC1kYXRhPlxuXHRcdFx0PGNzLWxhYmVsLWFuZC1kYXRhIGNsYXNzPVwibGFzdHVwZGF0ZVwiPnRvdGFsIGlzc3VlczwvY3MtbGFiZWwtYW5kLWRhdGE+XG5cdFx0YFxuXG5cdFx0Y3VzdG9tRWxlbWVudHMudXBncmFkZShzcm9vdClcblxuXHRcdHRoaXMuY2hlY2tyZWNzICA9IGNzX2Nhc3QoTGFiZWxBbmREYXRhLCAgICAgIHNyb290LnF1ZXJ5U2VsZWN0b3IoJy5jaGVja3RyZWMnKSlcblx0XHR0aGlzLmNoZWNrYXR0ciAgPSBjc19jYXN0KExhYmVsQW5kRGF0YSwgICAgICBzcm9vdC5xdWVyeVNlbGVjdG9yKCcuY2hlY2thdHRyJykpXG5cdFx0dGhpcy50b3Rpc3N1ZXMgID0gY3NfY2FzdChMYWJlbEFuZERhdGEsICAgICAgc3Jvb3QucXVlcnlTZWxlY3RvcignLnRvdGlzc3VlcycpKVxuXHRcdHRoaXMuZHRpdGxlICAgICA9IGNzX2Nhc3QoSFRNTERpdkVsZW1lbnQsICAgIHNyb290LnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpKVxuXHRcdHRoaXMuaW1nICAgICAgICA9IGNzX2Nhc3QoSFRNTEltYWdlRWxlbWVudCwgIHNyb290LnF1ZXJ5U2VsZWN0b3IoJy5pbWcnKSlcblx0XHR0aGlzLmxhc3R1cGRhdGUgPSBjc19jYXN0KExhYmVsQW5kRGF0YSwgICAgICBzcm9vdC5xdWVyeVNlbGVjdG9yKCcubGFzdHVwZGF0ZScpKVxuXHRcdFx0XHRcblx0XHR0aGlzLmltZy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXHRcdFxuXHRcdHRoaXMuY2hlY2tyZWNzLnNldExhYmVsKCdjaGVja2VkIHJlY3MnKVxuXHRcdHRoaXMuY2hlY2thdHRyLnNldExhYmVsKCdjaGVja2VkIGF0dHJzJylcblx0XHR0aGlzLnRvdGlzc3Vlcy5zZXRMYWJlbCgndG90IGlzc3VlcycpXG5cdFx0dGhpcy5sYXN0dXBkYXRlLnNldExhYmVsKCdsYXN0IHVwZGF0ZScpXG5cdFx0XG5cdFx0dGhpcy50b3Rpc3N1ZXMuc2V0U2V2ZXJpdHkoXCJmYWlsXCIpXG5cdFx0dGhpcy50b3Rpc3N1ZXMuc2V0RGF0YSgnMTIzJylcblxuXHR9XG5cblx0XG5cdHJlZnJlc2goZGF0YXNldDogY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9tYXhfdHNfdndfX3Jvdylcblx0e1xuXHRcdC8qXG5cdFx0dGhpcy5kdGl0bGUudGV4dENvbnRlbnQ9KGRhdGFzZXQuU2hvcnRuYW1lKTtcblx0XHQvLyBjb25zb2xlLmxvZyhkYXRhc2V0KVxuXHRcdGlmIChkYXRhc2V0LkltYWdlR2FsbGVyeSAhPSBudWxsICYmIGRhdGFzZXQuSW1hZ2VHYWxsZXJ5Lmxlbmd0aCA+IDApXG5cdFx0XHR0aGlzLmltZy5zcmM9KGRhdGFzZXQuSW1hZ2VHYWxsZXJ5WzBdLkltYWdlVXJsICsgXCImd2lkdGg9MTYwXCIpO1xuXHRcdCAqL1xuXHRcdFxuXHRcdGNvbnN0IGRhdGVzdHIgPSBkYXRhc2V0LnNlc3Npb25fc3RhcnRfdHNcblx0XHRjb25zdCBkYXRlID0gbmV3IERhdGUoZGF0ZXN0cilcblx0XHRcblx0XHRjb25zdCBkYXRlZm9ybWF0ID0gbmV3IEludGwuRGF0ZVRpbWVGb3JtYXQoJ2l0LUlUJywge1xuXHRcdFx0eWVhcjogJ251bWVyaWMnLFxuXHRcdFx0bW9udGg6ICcyLWRpZ2l0Jyxcblx0XHRcdGRheTogJzItZGlnaXQnLFxuXHRcdFx0aG91cjogJzItZGlnaXQnLFxuXHRcdFx0bWludXRlOiBcIjItZGlnaXRcIixcblx0XHRcdHRpbWVab25lOiAnRXVyb3BlL1JvbWUnXG5cdFx0fSkuZm9ybWF0KGRhdGUpXG5cdFx0XG5cdFx0dGhpcy5kdGl0bGUudGV4dENvbnRlbnQgPSBkYXRhc2V0LmRhdGFzZXRfbmFtZVxuXHRcdHRoaXMuY2hlY2tyZWNzLnNldERhdGEoJycgKyBkYXRhc2V0LnRlc3RlZF9yZWNvcmRzKVxuXHRcdHRoaXMuY2hlY2thdHRyLnNldERhdGEoJzEyMycpXG5cdFx0dGhpcy50b3Rpc3N1ZXMuc2V0RGF0YSgnJyArIGRhdGFzZXQuZmFpbGVkX3JlY29yZHMpXG5cdFx0dGhpcy5sYXN0dXBkYXRlLnNldERhdGEoZGF0ZWZvcm1hdClcblx0XHR0aGlzLm9uY2xpY2sgPSAoKSA9PiB7XG5cdFx0XHRsb2NhdGlvbi5oYXNoID0gJyNwYWdlPWRhdGFzZXQtY2F0ZWdvcmllcycgKyAnJmRhdGFzZXRfbmFtZT0nICsgZGF0YXNldC5kYXRhc2V0X25hbWUgKyBcIiZzZXNzaW9uX3N0YXJ0X3RzPVwiICsgZGF0YXNldC5zZXNzaW9uX3N0YXJ0X3RzXG5cdFx0fVxuXHR9XG59XG5cblxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCdjcy1kYXRhc2V0LWJveCcsIERhdGFTZXRCb3hDb21wb25lbnQpXG4iXX0=