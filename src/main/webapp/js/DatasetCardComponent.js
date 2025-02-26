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
					box-shadow: 4px 4px #ccc;
				}
				.title {
					font-weight: bold;
					margin-top: .7rem;
					margin-bottom: 0.3rem;
					text-align: center;
					overflow: hidden;
					height: 2rem;
					line-height: 1rem;
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
					/* background-color: var(--dark-background); */
					background-color: rgb(71, 105, 41);
					color: #ddd;
					text-align: center;
					padding: 0.6rem;
				}
				.view_dashboard:hover {
					background-color: rgb(35, 75, 20);
				}
				
				.wrapper {
					padding: 1rem;
				}

				.lastupdate {
					margin-top: 0.4rem;
					font-size: 0.7rem;
				}
				
				img {
					height: 100px;
					width: 100%;
					object-fit: contain;
					margin-bottom: 0.5rem;
				}
	
			</style>
			<div class="wrapper">
				<div class="title">XXX</div>
				<img class="img">
				<cs-label-and-data class="checktrec">checked records</cs-label-and-data>
				<cs-label-and-data class="checkattr" style="display: none">checked attributes</cs-label-and-data>
				<cs-label-and-data class="totissues" xstyle="display: none">total issues</cs-label-and-data>
				<div class="lastupdate">
					🕑 <span class="data"></span>
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
        // this.img.style.display = 'none';
        this.checkrecs.setLabel('checked recs');
        this.checkattr.setLabel('checked attrs');
        this.failedrecs.setLabel('quality-assured recs');
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
        this.img.src = dataset.dataset_img_url.length > 0 ? dataset.dataset_img_url : 'dataset-placeholder.png';
        this.checkrecs.setData('' + dataset.tested_records);
        this.checkattr.setData('123');
        this.failedrecs.setData('' + (dataset.tested_records - dataset.failed_records));
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
            window.scrollTo(0, 0);
        };
    }
}
customElements.define('cs-dataset-box', DatasetCardComponent);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YXNldENhcmRDb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90eXBlc2NyaXB0L0RhdGFzZXRDYXJkQ29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7R0FHRztBQUVILE9BQU8sRUFBRSxPQUFPLEVBQVksTUFBTSxjQUFjLENBQUM7QUFFakQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLG1CQUFtQixDQUFBO0FBR2hELE1BQU0sT0FBTyxvQkFBcUIsU0FBUSxXQUFXO0lBRXBELE1BQU0sQ0FBQTtJQUNOLEdBQUcsQ0FBQTtJQUNILFNBQVMsQ0FBQTtJQUNULFNBQVMsQ0FBQTtJQUNULFVBQVUsQ0FBQTtJQUNWLFVBQVUsQ0FBQTtJQUVWO1FBRUMsS0FBSyxFQUFFLENBQUE7UUFDUCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUE7UUFDL0MsS0FBSyxDQUFDLFNBQVMsR0FBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXNFakIsQ0FBQTtRQUVELGNBQWMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7UUFFN0IsSUFBSSxDQUFDLFNBQVMsR0FBSSxPQUFPLENBQUMsWUFBWSxFQUFPLEtBQUssQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQTtRQUMvRSxJQUFJLENBQUMsU0FBUyxHQUFJLE9BQU8sQ0FBQyxZQUFZLEVBQU8sS0FBSyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFBO1FBQy9FLElBQUksQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDLFlBQVksRUFBTSxLQUFLLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUE7UUFDOUUsSUFBSSxDQUFDLE1BQU0sR0FBTyxPQUFPLENBQUMs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LENBQUM7UUFDdEIsQ0FBQyxDQUFBO0lBQ0YsQ0FBQztDQUNEO0FBR0QsY0FBYyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxvQkFBb0IsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIChDKSAyMDI0IENhdGNoIFNvbHZlIGRpIERhdmlkZSBNb250ZXNpblxuICogTGljZW5zZTogQUdQTFxuICovXG5cbmltcG9ydCB7IGNzX2Nhc3QsIHRocm93TlBFIH0gZnJvbSBcIi4vcXVhbGl0eS5qc1wiO1xuXG5pbXBvcnQgeyBMYWJlbEFuZERhdGEgfSBmcm9tIFwiLi9MYWJlbEFuZERhdGEuanNcIlxuaW1wb3J0IHsgY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9tYXhfdHNfdndfX3JvdyB9IGZyb20gXCIuL2FwaS9hcGkzLmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBEYXRhc2V0Q2FyZENvbXBvbmVudCBleHRlbmRzIEhUTUxFbGVtZW50XG57XG5cdGR0aXRsZVxuXHRpbWdcblx0Y2hlY2tyZWNzXG5cdGNoZWNrYXR0clxuXHRmYWlsZWRyZWNzXG5cdGxhc3R1cGRhdGVcblx0XG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXHRcdHN1cGVyKClcblx0XHRjb25zdCBzcm9vdCA9IHRoaXMuYXR0YWNoU2hhZG93KHttb2RlOiAnb3Blbid9KVxuXHRcdHNyb290LmlubmVySFRNTCA9IGBcblx0XHRcdDxzdHlsZT5cblx0XHRcdFx0Omhvc3Qge1xuXHRcdFx0XHRcdGJvcmRlcjogMXB4IHNvbGlkICNjY2M7XG5cdFx0XHRcdFx0bWFyZ2luOiAwLjVyZW07XG5cdFx0XHRcdFx0Ym9yZGVyLXJhZGl1czogNHB4O1xuXHRcdFx0XHRcdGN1cnNvcjogcG9pbnRlcjtcblx0XHRcdFx0XHR3aWR0aDogMTNyZW07XG5cdFx0XHRcdFx0Ym94LXNoYWRvdzogNHB4IDRweCAjY2NjO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC50aXRsZSB7XG5cdFx0XHRcdFx0Zm9udC13ZWlnaHQ6IGJvbGQ7XG5cdFx0XHRcdFx0bWFyZ2luLXRvcDogLjdyZW07XG5cdFx0XHRcdFx0bWFyZ2luLWJvdHRvbTogMC4zcmVtO1xuXHRcdFx0XHRcdHRleHQtYWxpZ246IGNlbnRlcjtcblx0XHRcdFx0XHRvdmVyZmxvdzogaGlkZGVuO1xuXHRcdFx0XHRcdGhlaWdodDogMnJlbTtcblx0XHRcdFx0XHRsaW5lLWhlaWdodDogMXJlbTtcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0Lypcblx0XHRcdFx0Omhvc3QoOmhvdmVyKSAudGl0bGUge1xuXHRcdFx0XHRcdHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xuXHRcdFx0XHR9XG5cdFx0XHRcdCAqL1xuXHRcdFx0XHRcblx0XHRcdFx0LnRzIHtcblx0XHRcdFx0XHRmb250LXNpemU6IDAuN3JlbVxuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0XHQudmlld19kYXNoYm9hcmQge1xuXHRcdFx0XHRcdC8qIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWRhcmstYmFja2dyb3VuZCk7ICovXG5cdFx0XHRcdFx0YmFja2dyb3VuZC1jb2xvcjogcmdiKDcxLCAxMDUsIDQxKTtcblx0XHRcdFx0XHRjb2xvcjogI2RkZDtcblx0XHRcdFx0XHR0ZXh0LWFsaWduOiBjZW50ZXI7XG5cdFx0XHRcdFx0cGFkZGluZzogMC42cmVtO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC52aWV3X2Rhc2hib2FyZDpob3ZlciB7XG5cdFx0XHRcdFx0YmFja2dyb3VuZC1jb2xvcjogcmdiKDM1LCA3NSwgMjApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0XHQud3JhcHBlciB7XG5cdFx0XHRcdFx0cGFkZGluZzogMXJlbTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC5sYXN0dXBkYXRlIHtcblx0XHRcdFx0XHRtYXJnaW4tdG9wOiAwLjRyZW07XG5cdFx0XHRcdFx0Zm9udC1zaXplOiAwLjdyZW07XG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHRcdGltZyB7XG5cdFx0XHRcdFx0aGVpZ2h0OiAxMDBweDtcblx0XHRcdFx0XHR3aWR0aDogMTAwJTtcblx0XHRcdFx0XHRvYmplY3QtZml0OiBjb250YWluO1xuXHRcdFx0XHRcdG1hcmdpbi1ib3R0b206IDAuNXJlbTtcblx0XHRcdFx0fVxuXHRcblx0XHRcdDwvc3R5bGU+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwid3JhcHBlclwiPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwidGl0bGVcIj5YWFg8L2Rpdj5cblx0XHRcdFx0PGltZyBjbGFzcz1cImltZ1wiPlxuXHRcdFx0XHQ8Y3MtbGFiZWwtYW5kLWRhdGEgY2xhc3M9XCJjaGVja3RyZWNcIj5jaGVja2VkIHJlY29yZHM8L2NzLWxhYmVsLWFuZC1kYXRhPlxuXHRcdFx0XHQ8Y3MtbGFiZWwtYW5kLWRhdGEgY2xhc3M9XCJjaGVja2F0dHJcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIj5jaGVja2VkIGF0dHJpYnV0ZXM8L2NzLWxhYmVsLWFuZC1kYXRhPlxuXHRcdFx0XHQ8Y3MtbGFiZWwtYW5kLWRhdGEgY2xhc3M9XCJ0b3Rpc3N1ZXNcIiB4c3R5bGU9XCJkaXNwbGF5OiBub25lXCI+dG90YWwgaXNzdWVzPC9jcy1sYWJlbC1hbmQtZGF0YT5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImxhc3R1cGRhdGVcIj5cblx0XHRcdFx0XHTwn5WRIDxzcGFuIGNsYXNzPVwiZGF0YVwiPjwvc3Bhbj5cblx0XHRcdFx0XHQ8c3Bhbj48L3NwYW4+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0PC9kaXY+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwidmlld19kYXNoYm9hcmRcIj5WaWV3IGRhc2hib2FyZDwvZGl2PlxuXHRcdGBcblxuXHRcdGN1c3RvbUVsZW1lbnRzLnVwZ3JhZGUoc3Jvb3QpXG5cblx0XHR0aGlzLmNoZWNrcmVjcyAgPSBjc19jYXN0KExhYmVsQW5kRGF0YSwgICAgICBzcm9vdC5xdWVyeVNlbGVjdG9yKCcuY2hlY2t0cmVjJykpXG5cdFx0dGhpcy5jaGVja2F0dHIgID0gY3NfY2FzdChMYWJlbEFuZERhdGEsICAgICAgc3Jvb3QucXVlcnlTZWxlY3RvcignLmNoZWNrYXR0cicpKVxuXHRcdHRoaXMuZmFpbGVkcmVjcyA9IGNzX2Nhc3QoTGFiZWxBbmREYXRhLCAgICAgc3Jvb3QucXVlcnlTZWxlY3RvcignLnRvdGlzc3VlcycpKVxuXHRcdHRoaXMuZHRpdGxlICAgICA9IGNzX2Nhc3QoSFRNTERpdkVsZW1lbnQsICAgIHNyb290LnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpKVxuXHRcdHRoaXMuaW1nICAgICAgICA9IGNzX2Nhc3QoSFRNTEltYWdlRWxlbWVudCwgIHNyb290LnF1ZXJ5U2VsZWN0b3IoJy5pbWcnKSlcblx0XHR0aGlzLmxhc3R1cGRhdGUgPSBjc19jYXN0KEhUTUxTcGFuRWxlbWVudCwgICAgICBzcm9vdC5xdWVyeVNlbGVjdG9yKCcubGFzdHVwZGF0ZSAuZGF0YScpKVxuXHRcdFx0XHRcblx0XHQvLyB0aGlzLmltZy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXHRcdFxuXHRcdHRoaXMuY2hlY2tyZWNzLnNldExhYmVsKCdjaGVja2VkIHJlY3MnKVxuXHRcdHRoaXMuY2hlY2thdHRyLnNldExhYmVsKCdjaGVja2VkIGF0dHJzJylcblx0XHR0aGlzLmZhaWxlZHJlY3Muc2V0TGFiZWwoJ3F1YWxpdHktYXNzdXJlZCByZWNzJylcblx0XHRcblx0XHQvLyB0aGlzLmZhaWxlZHJlY3Muc2V0U2V2ZXJpdHkoXCJmYWlsXCIpXG5cdFx0Ly8gdGhpcy5mYWlsZWRyZWNzLnNldERhdGEoJzEyMycpXG5cblx0fVxuXG5cdFxuXHRyZWZyZXNoKGRhdGFzZXQ6IGNhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfbWF4X3RzX3Z3X19yb3cpXG5cdHtcblx0XHRjb25zdCBkYXRlc3RyID0gZGF0YXNldC5zZXNzaW9uX3N0YXJ0X3RzXG5cdFx0Y29uc3QgZGF0ZSA9IG5ldyBEYXRlKGRhdGVzdHIpXG5cdFx0XG5cdFx0Y29uc3QgZGF0ZWZvcm1hdCA9IG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KCdpdC1JVCcsIHtcblx0XHRcdHllYXI6ICdudW1lcmljJyxcblx0XHRcdG1vbnRoOiAnMi1kaWdpdCcsXG5cdFx0XHRkYXk6ICcyLWRpZ2l0Jyxcblx0XHRcdGhvdXI6ICcyLWRpZ2l0Jyxcblx0XHRcdG1pbnV0ZTogXCIyLWRpZ2l0XCIsXG5cdFx0XHR0aW1lWm9uZTogJ0V1cm9wZS9Sb21lJ1xuXHRcdH0pLmZvcm1hdChkYXRlKVxuXHRcdFxuXHRcdHRoaXMuZHRpdGxlLnRleHRDb250ZW50ID0gZGF0YXNldC5kYXRhc2V0X25hbWVcblx0XHR0aGlzLmltZy5zcmMgPSBkYXRhc2V0LmRhdGFzZXRfaW1nX3VybC5sZW5ndGggPiAwID8gZGF0YXNldC5kYXRhc2V0X2ltZ191cmwgOiAnZGF0YXNldC1wbGFjZWhvbGRlci5wbmcnXG5cdFx0dGhpcy5jaGVja3JlY3Muc2V0RGF0YSgnJyArIGRhdGFzZXQudGVzdGVkX3JlY29yZHMpXG5cdFx0dGhpcy5jaGVja2F0dHIuc2V0RGF0YSgnMTIzJylcblx0XHR0aGlzLmZhaWxlZHJlY3Muc2V0RGF0YSgnJyArIChkYXRhc2V0LnRlc3RlZF9yZWNvcmRzIC0gZGF0YXNldC5mYWlsZWRfcmVjb3JkcykpXG5cdFx0Y29uc3QgcXVhbGl0eV9yYXRpbyA9IGRhdGFzZXQudGVzdGVkX3JlY29yZHMgPT0gMCA/IDEwMCA6IGRhdGFzZXQuZmFpbGVkX3JlY29yZHMgLyBkYXRhc2V0LnRlc3RlZF9yZWNvcmRzXG5cdFx0aWYgKHF1YWxpdHlfcmF0aW8gPCAwLjEpXG5cdFx0XHR0aGlzLmZhaWxlZHJlY3Muc2V0UXVhbGl0eUxldmVsKFwiZ29vZFwiKVxuXHRcdGVsc2UgaWYgKHF1YWxpdHlfcmF0aW8gPCAwLjMpXG5cdFx0XHR0aGlzLmZhaWxlZHJlY3Muc2V0UXVhbGl0eUxldmVsKFwid2FyblwiKVxuXHRcdGVsc2Vcblx0XHRcdHRoaXMuZmFpbGVkcmVjcy5zZXRRdWFsaXR5TGV2ZWwoXCJmYWlsXCIpXG5cdFx0dGhpcy5sYXN0dXBkYXRlLnRleHRDb250ZW50ID0gZGF0ZWZvcm1hdFxuXHRcdHRoaXMub25jbGljayA9ICgpID0+IHtcblx0XHRcdGxvY2F0aW9uLmhhc2ggPSAnI3BhZ2U9ZGF0YXNldC1jYXRlZ29yaWVzJyArICcmZGF0YXNldF9uYW1lPScgKyBkYXRhc2V0LmRhdGFzZXRfbmFtZSBcblx0XHRcdFx0XHRcdFx0KyBcIiZzZXNzaW9uX3N0YXJ0X3RzPVwiICsgZGF0YXNldC5zZXNzaW9uX3N0YXJ0X3RzXG5cdFx0XHRcdFx0XHRcdCsgXCImZmFpbGVkX3JlY29yZHM9XCIgKyBkYXRhc2V0LmZhaWxlZF9yZWNvcmRzXG5cdFx0XHRcdFx0XHRcdCsgXCImdGVzdGVkX3JlY29yZHM9XCIgKyBkYXRhc2V0LnRlc3RlZF9yZWNvcmRzXG5cdFx0XHR3aW5kb3cuc2Nyb2xsVG8oMCwwKTtcblx0XHR9XG5cdH1cbn1cblxuXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ2NzLWRhdGFzZXQtYm94JywgRGF0YXNldENhcmRDb21wb25lbnQpXG4iXX0=