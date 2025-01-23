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
        this.img.src = dataset.dataset_img_url.length > 0 ? dataset.dataset_img_url : 'dataset-placeholder.png';
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
            window.scrollTo(0, 0);
        };
    }
}
customElements.define('cs-dataset-box', DatasetCardComponent);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YXNldENhcmRDb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90eXBlc2NyaXB0L0RhdGFzZXRDYXJkQ29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7R0FHRztBQUVILE9BQU8sRUFBRSxPQUFPLEVBQVksTUFBTSxjQUFjLENBQUM7QUFFakQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLG1CQUFtQixDQUFBO0FBR2hELE1BQU0sT0FBTyxvQkFBcUIsU0FBUSxXQUFXO0lBRXBELE1BQU0sQ0FBQTtJQUNOLEdBQUcsQ0FBQTtJQUNILFNBQVMsQ0FBQTtJQUNULFNBQVMsQ0FBQTtJQUNULFVBQVUsQ0FBQTtJQUNWLFVBQVUsQ0FBQTtJQUVWO1FBRUMsS0FBSyxFQUFFLENBQUE7UUFDUCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUE7UUFDL0MsS0FBSyxDQUFDLFNBQVMsR0FBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBa0VqQixDQUFBO1FBRUQsY0FBYyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUU3QixJQUFJLENBQUMsU0FBUyxHQUFJLE9BQU8sQ0FBQyxZQUFZLEVBQU8sS0FBSyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFBO1FBQy9FLElBQUksQ0FBQyxTQUFTLEdBQUksT0FBTyxDQUFDLFlBQVksRUFBTyxLQUFLLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUE7UUFDL0UsSUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsWUFBWSxFQUFNLEtBQUssQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQTtRQUM5RSxJQUFJLENBQUMsTUFBTSxHQUFPLE9BQU8sQ0FBQyxjQUFj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O0FBR0QsY0FBYyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxvQkFBb0IsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIChDKSAyMDI0IENhdGNoIFNvbHZlIGRpIERhdmlkZSBNb250ZXNpblxuICogTGljZW5zZTogQUdQTFxuICovXG5cbmltcG9ydCB7IGNzX2Nhc3QsIHRocm93TlBFIH0gZnJvbSBcIi4vcXVhbGl0eS5qc1wiO1xuXG5pbXBvcnQgeyBMYWJlbEFuZERhdGEgfSBmcm9tIFwiLi9MYWJlbEFuZERhdGEuanNcIlxuaW1wb3J0IHsgY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9tYXhfdHNfdndfX3JvdyB9IGZyb20gXCIuL2FwaS9hcGkzLmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBEYXRhc2V0Q2FyZENvbXBvbmVudCBleHRlbmRzIEhUTUxFbGVtZW50XG57XG5cdGR0aXRsZVxuXHRpbWdcblx0Y2hlY2tyZWNzXG5cdGNoZWNrYXR0clxuXHRmYWlsZWRyZWNzXG5cdGxhc3R1cGRhdGVcblx0XG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXHRcdHN1cGVyKClcblx0XHRjb25zdCBzcm9vdCA9IHRoaXMuYXR0YWNoU2hhZG93KHttb2RlOiAnb3Blbid9KVxuXHRcdHNyb290LmlubmVySFRNTCA9IGBcblx0XHRcdDxzdHlsZT5cblx0XHRcdFx0Omhvc3Qge1xuXHRcdFx0XHRcdGJvcmRlcjogMXB4IHNvbGlkICNjY2M7XG5cdFx0XHRcdFx0bWFyZ2luOiAwLjVyZW07XG5cdFx0XHRcdFx0Ym9yZGVyLXJhZGl1czogNHB4O1xuXHRcdFx0XHRcdGN1cnNvcjogcG9pbnRlcjtcblx0XHRcdFx0XHR3aWR0aDogMTNyZW07XG5cdFx0XHRcdFx0Ym94LXNoYWRvdzogNHB4IDRweCAjY2NjO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC50aXRsZSB7XG5cdFx0XHRcdFx0Zm9udC13ZWlnaHQ6IGJvbGQ7XG5cdFx0XHRcdFx0bWFyZ2luLXRvcDogLjdyZW07XG5cdFx0XHRcdFx0bWFyZ2luLWJvdHRvbTogMC4zcmVtO1xuXHRcdFx0XHRcdHRleHQtYWxpZ246IGNlbnRlcjtcblx0XHRcdFx0XHRvdmVyZmxvdzogaGlkZGVuO1xuXHRcdFx0XHRcdGhlaWdodDogMnJlbTtcblx0XHRcdFx0XHRsaW5lLWhlaWdodDogMXJlbTtcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0Lypcblx0XHRcdFx0Omhvc3QoOmhvdmVyKSAudGl0bGUge1xuXHRcdFx0XHRcdHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xuXHRcdFx0XHR9XG5cdFx0XHRcdCAqL1xuXHRcdFx0XHRcblx0XHRcdFx0LnRzIHtcblx0XHRcdFx0XHRmb250LXNpemU6IDAuN3JlbVxuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0XHQudmlld19kYXNoYm9hcmQge1xuXHRcdFx0XHRcdGJhY2tncm91bmQtY29sb3I6IHZhcigtLWRhcmstYmFja2dyb3VuZCk7XG5cdFx0XHRcdFx0Y29sb3I6ICNkZGQ7XG5cdFx0XHRcdFx0dGV4dC1hbGlnbjogY2VudGVyO1xuXHRcdFx0XHRcdHBhZGRpbmc6IDAuNnJlbTtcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0LndyYXBwZXIge1xuXHRcdFx0XHRcdHBhZGRpbmc6IDFyZW07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQubGFzdHVwZGF0ZSB7XG5cdFx0XHRcdFx0bWFyZ2luLXRvcDogMC40cmVtO1xuXHRcdFx0XHRcdGZvbnQtc2l6ZTogMC43cmVtO1xuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0XHRpbWcge1xuXHRcdFx0XHRcdGhlaWdodDogMTAwcHg7XG5cdFx0XHRcdFx0d2lkdGg6IDEwMCU7XG5cdFx0XHRcdFx0b2JqZWN0LWZpdDogY29udGFpbjtcblx0XHRcdFx0XHRtYXJnaW4tYm90dG9tOiAwLjVyZW07XG5cdFx0XHRcdH1cblx0XG5cdFx0XHQ8L3N0eWxlPlxuXHRcdFx0PGRpdiBjbGFzcz1cIndyYXBwZXJcIj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cInRpdGxlXCI+WFhYPC9kaXY+XG5cdFx0XHRcdDxpbWcgY2xhc3M9XCJpbWdcIj5cblx0XHRcdFx0PGNzLWxhYmVsLWFuZC1kYXRhIGNsYXNzPVwiY2hlY2t0cmVjXCI+Y2hlY2tlZCByZWNvcmRzPC9jcy1sYWJlbC1hbmQtZGF0YT5cblx0XHRcdFx0PGNzLWxhYmVsLWFuZC1kYXRhIGNsYXNzPVwiY2hlY2thdHRyXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lXCI+Y2hlY2tlZCBhdHRyaWJ1dGVzPC9jcy1sYWJlbC1hbmQtZGF0YT5cblx0XHRcdFx0PGNzLWxhYmVsLWFuZC1kYXRhIGNsYXNzPVwidG90aXNzdWVzXCIgeHN0eWxlPVwiZGlzcGxheTogbm9uZVwiPnRvdGFsIGlzc3VlczwvY3MtbGFiZWwtYW5kLWRhdGE+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJsYXN0dXBkYXRlXCI+XG5cdFx0XHRcdFx08J+VkSA8c3BhbiBjbGFzcz1cImRhdGFcIj48L3NwYW4+XG5cdFx0XHRcdFx0PHNwYW4+PC9zcGFuPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdFx0PGRpdiBjbGFzcz1cInZpZXdfZGFzaGJvYXJkXCI+VmlldyBkYXNoYm9hcmQ8L2Rpdj5cblx0XHRgXG5cblx0XHRjdXN0b21FbGVtZW50cy51cGdyYWRlKHNyb290KVxuXG5cdFx0dGhpcy5jaGVja3JlY3MgID0gY3NfY2FzdChMYWJlbEFuZERhdGEsICAgICAgc3Jvb3QucXVlcnlTZWxlY3RvcignLmNoZWNrdHJlYycpKVxuXHRcdHRoaXMuY2hlY2thdHRyICA9IGNzX2Nhc3QoTGFiZWxBbmREYXRhLCAgICAgIHNyb290LnF1ZXJ5U2VsZWN0b3IoJy5jaGVja2F0dHInKSlcblx0XHR0aGlzLmZhaWxlZHJlY3MgPSBjc19jYXN0KExhYmVsQW5kRGF0YSwgICAgIHNyb290LnF1ZXJ5U2VsZWN0b3IoJy50b3Rpc3N1ZXMnKSlcblx0XHR0aGlzLmR0aXRsZSAgICAgPSBjc19jYXN0KEhUTUxEaXZFbGVtZW50LCAgICBzcm9vdC5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKSlcblx0XHR0aGlzLmltZyAgICAgICAgPSBjc19jYXN0KEhUTUxJbWFnZUVsZW1lbnQsICBzcm9vdC5xdWVyeVNlbGVjdG9yKCcuaW1nJykpXG5cdFx0dGhpcy5sYXN0dXBkYXRlID0gY3NfY2FzdChIVE1MU3BhbkVsZW1lbnQsICAgICAgc3Jvb3QucXVlcnlTZWxlY3RvcignLmxhc3R1cGRhdGUgLmRhdGEnKSlcblx0XHRcdFx0XG5cdFx0Ly8gdGhpcy5pbWcuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblx0XHRcblx0XHR0aGlzLmNoZWNrcmVjcy5zZXRMYWJlbCgnY2hlY2tlZCByZWNzJylcblx0XHR0aGlzLmNoZWNrYXR0ci5zZXRMYWJlbCgnY2hlY2tlZCBhdHRycycpXG5cdFx0dGhpcy5mYWlsZWRyZWNzLnNldExhYmVsKCdmYWlsZWQgcmVjcycpXG5cdFx0XG5cdFx0Ly8gdGhpcy5mYWlsZWRyZWNzLnNldFNldmVyaXR5KFwiZmFpbFwiKVxuXHRcdC8vIHRoaXMuZmFpbGVkcmVjcy5zZXREYXRhKCcxMjMnKVxuXG5cdH1cblxuXHRcblx0cmVmcmVzaChkYXRhc2V0OiBjYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X21heF90c192d19fcm93KVxuXHR7XG5cdFx0Y29uc3QgZGF0ZXN0ciA9IGRhdGFzZXQuc2Vzc2lvbl9zdGFydF90c1xuXHRcdGNvbnN0IGRhdGUgPSBuZXcgRGF0ZShkYXRlc3RyKVxuXHRcdFxuXHRcdGNvbnN0IGRhdGVmb3JtYXQgPSBuZXcgSW50bC5EYXRlVGltZUZvcm1hdCgnaXQtSVQnLCB7XG5cdFx0XHR5ZWFyOiAnbnVtZXJpYycsXG5cdFx0XHRtb250aDogJzItZGlnaXQnLFxuXHRcdFx0ZGF5OiAnMi1kaWdpdCcsXG5cdFx0XHRob3VyOiAnMi1kaWdpdCcsXG5cdFx0XHRtaW51dGU6IFwiMi1kaWdpdFwiLFxuXHRcdFx0dGltZVpvbmU6ICdFdXJvcGUvUm9tZSdcblx0XHR9KS5mb3JtYXQoZGF0ZSlcblx0XHRcblx0XHR0aGlzLmR0aXRsZS50ZXh0Q29udGVudCA9IGRhdGFzZXQuZGF0YXNldF9uYW1lXG5cdFx0dGhpcy5pbWcuc3JjID0gZGF0YXNldC5kYXRhc2V0X2ltZ191cmwubGVuZ3RoID4gMCA/IGRhdGFzZXQuZGF0YXNldF9pbWdfdXJsIDogJ2RhdGFzZXQtcGxhY2Vob2xkZXIucG5nJ1xuXHRcdHRoaXMuY2hlY2tyZWNzLnNldERhdGEoJycgKyBkYXRhc2V0LnRlc3RlZF9yZWNvcmRzKVxuXHRcdHRoaXMuY2hlY2thdHRyLnNldERhdGEoJzEyMycpXG5cdFx0dGhpcy5mYWlsZWRyZWNzLnNldERhdGEoJycgKyBkYXRhc2V0LmZhaWxlZF9yZWNvcmRzKVxuXHRcdGNvbnN0IHF1YWxpdHlfcmF0aW8gPSBkYXRhc2V0LnRlc3RlZF9yZWNvcmRzID09IDAgPyAxMDAgOiBkYXRhc2V0LmZhaWxlZF9yZWNvcmRzIC8gZGF0YXNldC50ZXN0ZWRfcmVjb3Jkc1xuXHRcdGlmIChxdWFsaXR5X3JhdGlvIDwgMC4xKVxuXHRcdFx0dGhpcy5mYWlsZWRyZWNzLnNldFF1YWxpdHlMZXZlbChcImdvb2RcIilcblx0XHRlbHNlIGlmIChxdWFsaXR5X3JhdGlvIDwgMC4zKVxuXHRcdFx0dGhpcy5mYWlsZWRyZWNzLnNldFF1YWxpdHlMZXZlbChcIndhcm5cIilcblx0XHRlbHNlXG5cdFx0XHR0aGlzLmZhaWxlZHJlY3Muc2V0UXVhbGl0eUxldmVsKFwiZmFpbFwiKVxuXHRcdHRoaXMubGFzdHVwZGF0ZS50ZXh0Q29udGVudCA9IGRhdGVmb3JtYXRcblx0XHR0aGlzLm9uY2xpY2sgPSAoKSA9PiB7XG5cdFx0XHRsb2NhdGlvbi5oYXNoID0gJyNwYWdlPWRhdGFzZXQtY2F0ZWdvcmllcycgKyAnJmRhdGFzZXRfbmFtZT0nICsgZGF0YXNldC5kYXRhc2V0X25hbWUgXG5cdFx0XHRcdFx0XHRcdCsgXCImc2Vzc2lvbl9zdGFydF90cz1cIiArIGRhdGFzZXQuc2Vzc2lvbl9zdGFydF90c1xuXHRcdFx0XHRcdFx0XHQrIFwiJmZhaWxlZF9yZWNvcmRzPVwiICsgZGF0YXNldC5mYWlsZWRfcmVjb3Jkc1xuXHRcdFx0XHRcdFx0XHQrIFwiJnRlc3RlZF9yZWNvcmRzPVwiICsgZGF0YXNldC50ZXN0ZWRfcmVjb3Jkc1xuXHRcdFx0d2luZG93LnNjcm9sbFRvKDAsMCk7XG5cdFx0fVxuXHR9XG59XG5cblxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCdjcy1kYXRhc2V0LWJveCcsIERhdGFzZXRDYXJkQ29tcG9uZW50KVxuIl19