// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YXNldENhcmRDb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90eXBlc2NyaXB0L0RhdGFzZXRDYXJkQ29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDhEQUE4RDtBQUM5RCxFQUFFO0FBQ0YsNkNBQTZDO0FBRzdDLE9BQU8sRUFBRSxPQUFPLEVBQVksTUFBTSxjQUFjLENBQUM7QUFFakQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLG1CQUFtQixDQUFBO0FBR2hELE1BQU0sT0FBTyxvQkFBcUIsU0FBUSxXQUFXO0lBRXBELE1BQU0sQ0FBQTtJQUNOLEdBQUcsQ0FBQTtJQUNILFNBQVMsQ0FBQTtJQUNULFNBQVMsQ0FBQTtJQUNULFVBQVUsQ0FBQTtJQUNWLFVBQVUsQ0FBQTtJQUVWO1FBRUMsS0FBSyxFQUFFLENBQUE7UUFDUCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUE7UUFDL0MsS0FBSyxDQUFDLFNBQVMsR0FBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXNFakIsQ0FBQTtRQUVELGNBQWMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7UUFFN0IsSUFBSSxDQUFDLFNBQVMsR0FBSSxPQUFPLENBQUMsWUFBWSxFQUFPLEtBQUssQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQTtRQUMvRSxJQUFJLENBQUMsU0FBUyxHQUFJLE9BQU8sQ0FBQyxZQUFZLEVBQU8sS0FBSyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFBO1FBQy9FLElBQUksQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDLFlBQVksRUFBTSxLQUFLLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUE7UUFDOUUsSUFBSSxD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Q0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsQ0FBQyxDQUFBO0lBQ0YsQ0FBQztDQUNEO0FBR0QsY0FBYyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxvQkFBb0IsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gU1BEWC1GaWxlQ29weXJpZ2h0VGV4dDogMjAyNCBDYXRjaCBTb2x2ZSBkaSBEYXZpZGUgTW9udGVzaW5cbi8vXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb3ItbGF0ZXJcblxuXG5pbXBvcnQgeyBjc19jYXN0LCB0aHJvd05QRSB9IGZyb20gXCIuL3F1YWxpdHkuanNcIjtcblxuaW1wb3J0IHsgTGFiZWxBbmREYXRhIH0gZnJvbSBcIi4vTGFiZWxBbmREYXRhLmpzXCJcbmltcG9ydCB7IGNhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfbWF4X3RzX3Z3X19yb3cgfSBmcm9tIFwiLi9hcGkvYXBpMy5qc1wiO1xuXG5leHBvcnQgY2xhc3MgRGF0YXNldENhcmRDb21wb25lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudFxue1xuXHRkdGl0bGVcblx0aW1nXG5cdGNoZWNrcmVjc1xuXHRjaGVja2F0dHJcblx0ZmFpbGVkcmVjc1xuXHRsYXN0dXBkYXRlXG5cdFxuXHRjb25zdHJ1Y3RvcigpXG5cdHtcblx0XHRzdXBlcigpXG5cdFx0Y29uc3Qgc3Jvb3QgPSB0aGlzLmF0dGFjaFNoYWRvdyh7bW9kZTogJ29wZW4nfSlcblx0XHRzcm9vdC5pbm5lckhUTUwgPSBgXG5cdFx0XHQ8c3R5bGU+XG5cdFx0XHRcdDpob3N0IHtcblx0XHRcdFx0XHRib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xuXHRcdFx0XHRcdG1hcmdpbjogMC41cmVtO1xuXHRcdFx0XHRcdGJvcmRlci1yYWRpdXM6IDRweDtcblx0XHRcdFx0XHRjdXJzb3I6IHBvaW50ZXI7XG5cdFx0XHRcdFx0d2lkdGg6IDEzcmVtO1xuXHRcdFx0XHRcdGJveC1zaGFkb3c6IDRweCA0cHggI2NjYztcblx0XHRcdFx0fVxuXHRcdFx0XHQudGl0bGUge1xuXHRcdFx0XHRcdGZvbnQtd2VpZ2h0OiBib2xkO1xuXHRcdFx0XHRcdG1hcmdpbi10b3A6IC43cmVtO1xuXHRcdFx0XHRcdG1hcmdpbi1ib3R0b206IDAuM3JlbTtcblx0XHRcdFx0XHR0ZXh0LWFsaWduOiBjZW50ZXI7XG5cdFx0XHRcdFx0b3ZlcmZsb3c6IGhpZGRlbjtcblx0XHRcdFx0XHRoZWlnaHQ6IDJyZW07XG5cdFx0XHRcdFx0bGluZS1oZWlnaHQ6IDFyZW07XG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHRcdC8qXG5cdFx0XHRcdDpob3N0KDpob3ZlcikgLnRpdGxlIHtcblx0XHRcdFx0XHR0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcblx0XHRcdFx0fVxuXHRcdFx0XHQgKi9cblx0XHRcdFx0XG5cdFx0XHRcdC50cyB7XG5cdFx0XHRcdFx0Zm9udC1zaXplOiAwLjdyZW1cblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0LnZpZXdfZGFzaGJvYXJkIHtcblx0XHRcdFx0XHQvKiBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1kYXJrLWJhY2tncm91bmQpOyAqL1xuXHRcdFx0XHRcdGJhY2tncm91bmQtY29sb3I6IHJnYig3MSwgMTA1LCA0MSk7XG5cdFx0XHRcdFx0Y29sb3I6ICNkZGQ7XG5cdFx0XHRcdFx0dGV4dC1hbGlnbjogY2VudGVyO1xuXHRcdFx0XHRcdHBhZGRpbmc6IDAuNnJlbTtcblx0XHRcdFx0fVxuXHRcdFx0XHQudmlld19kYXNoYm9hcmQ6aG92ZXIge1xuXHRcdFx0XHRcdGJhY2tncm91bmQtY29sb3I6IHJnYigzNSwgNzUsIDIwKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0LndyYXBwZXIge1xuXHRcdFx0XHRcdHBhZGRpbmc6IDFyZW07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQubGFzdHVwZGF0ZSB7XG5cdFx0XHRcdFx0bWFyZ2luLXRvcDogMC40cmVtO1xuXHRcdFx0XHRcdGZvbnQtc2l6ZTogMC43cmVtO1xuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0XHRpbWcge1xuXHRcdFx0XHRcdGhlaWdodDogMTAwcHg7XG5cdFx0XHRcdFx0d2lkdGg6IDEwMCU7XG5cdFx0XHRcdFx0b2JqZWN0LWZpdDogY29udGFpbjtcblx0XHRcdFx0XHRtYXJnaW4tYm90dG9tOiAwLjVyZW07XG5cdFx0XHRcdH1cblx0XG5cdFx0XHQ8L3N0eWxlPlxuXHRcdFx0PGRpdiBjbGFzcz1cIndyYXBwZXJcIj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cInRpdGxlXCI+WFhYPC9kaXY+XG5cdFx0XHRcdDxpbWcgY2xhc3M9XCJpbWdcIj5cblx0XHRcdFx0PGNzLWxhYmVsLWFuZC1kYXRhIGNsYXNzPVwiY2hlY2t0cmVjXCI+Y2hlY2tlZCByZWNvcmRzPC9jcy1sYWJlbC1hbmQtZGF0YT5cblx0XHRcdFx0PGNzLWxhYmVsLWFuZC1kYXRhIGNsYXNzPVwiY2hlY2thdHRyXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lXCI+Y2hlY2tlZCBhdHRyaWJ1dGVzPC9jcy1sYWJlbC1hbmQtZGF0YT5cblx0XHRcdFx0PGNzLWxhYmVsLWFuZC1kYXRhIGNsYXNzPVwidG90aXNzdWVzXCIgeHN0eWxlPVwiZGlzcGxheTogbm9uZVwiPnRvdGFsIGlzc3VlczwvY3MtbGFiZWwtYW5kLWRhdGE+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJsYXN0dXBkYXRlXCI+XG5cdFx0XHRcdFx08J+VkSA8c3BhbiBjbGFzcz1cImRhdGFcIj48L3NwYW4+XG5cdFx0XHRcdFx0PHNwYW4+PC9zcGFuPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdFx0PGRpdiBjbGFzcz1cInZpZXdfZGFzaGJvYXJkXCI+VmlldyBkYXNoYm9hcmQ8L2Rpdj5cblx0XHRgXG5cblx0XHRjdXN0b21FbGVtZW50cy51cGdyYWRlKHNyb290KVxuXG5cdFx0dGhpcy5jaGVja3JlY3MgID0gY3NfY2FzdChMYWJlbEFuZERhdGEsICAgICAgc3Jvb3QucXVlcnlTZWxlY3RvcignLmNoZWNrdHJlYycpKVxuXHRcdHRoaXMuY2hlY2thdHRyICA9IGNzX2Nhc3QoTGFiZWxBbmREYXRhLCAgICAgIHNyb290LnF1ZXJ5U2VsZWN0b3IoJy5jaGVja2F0dHInKSlcblx0XHR0aGlzLmZhaWxlZHJlY3MgPSBjc19jYXN0KExhYmVsQW5kRGF0YSwgICAgIHNyb290LnF1ZXJ5U2VsZWN0b3IoJy50b3Rpc3N1ZXMnKSlcblx0XHR0aGlzLmR0aXRsZSAgICAgPSBjc19jYXN0KEhUTUxEaXZFbGVtZW50LCAgICBzcm9vdC5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKSlcblx0XHR0aGlzLmltZyAgICAgICAgPSBjc19jYXN0KEhUTUxJbWFnZUVsZW1lbnQsICBzcm9vdC5xdWVyeVNlbGVjdG9yKCcuaW1nJykpXG5cdFx0dGhpcy5sYXN0dXBkYXRlID0gY3NfY2FzdChIVE1MU3BhbkVsZW1lbnQsICAgICAgc3Jvb3QucXVlcnlTZWxlY3RvcignLmxhc3R1cGRhdGUgLmRhdGEnKSlcblx0XHRcdFx0XG5cdFx0Ly8gdGhpcy5pbWcuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblx0XHRcblx0XHR0aGlzLmNoZWNrcmVjcy5zZXRMYWJlbCgnY2hlY2tlZCByZWNzJylcblx0XHR0aGlzLmNoZWNrYXR0ci5zZXRMYWJlbCgnY2hlY2tlZCBhdHRycycpXG5cdFx0dGhpcy5mYWlsZWRyZWNzLnNldExhYmVsKCdxdWFsaXR5LWFzc3VyZWQgcmVjcycpXG5cdFx0XG5cdFx0Ly8gdGhpcy5mYWlsZWRyZWNzLnNldFNldmVyaXR5KFwiZmFpbFwiKVxuXHRcdC8vIHRoaXMuZmFpbGVkcmVjcy5zZXREYXRhKCcxMjMnKVxuXG5cdH1cblxuXHRcblx0cmVmcmVzaChkYXRhc2V0OiBjYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X21heF90c192d19fcm93KVxuXHR7XG5cdFx0Y29uc3QgZGF0ZXN0ciA9IGRhdGFzZXQuc2Vzc2lvbl9zdGFydF90c1xuXHRcdGNvbnN0IGRhdGUgPSBuZXcgRGF0ZShkYXRlc3RyKVxuXHRcdFxuXHRcdGNvbnN0IGRhdGVmb3JtYXQgPSBuZXcgSW50bC5EYXRlVGltZUZvcm1hdCgnaXQtSVQnLCB7XG5cdFx0XHR5ZWFyOiAnbnVtZXJpYycsXG5cdFx0XHRtb250aDogJzItZGlnaXQnLFxuXHRcdFx0ZGF5OiAnMi1kaWdpdCcsXG5cdFx0XHRob3VyOiAnMi1kaWdpdCcsXG5cdFx0XHRtaW51dGU6IFwiMi1kaWdpdFwiLFxuXHRcdFx0dGltZVpvbmU6ICdFdXJvcGUvUm9tZSdcblx0XHR9KS5mb3JtYXQoZGF0ZSlcblx0XHRcblx0XHR0aGlzLmR0aXRsZS50ZXh0Q29udGVudCA9IGRhdGFzZXQuZGF0YXNldF9uYW1lXG5cdFx0dGhpcy5pbWcuc3JjID0gZGF0YXNldC5kYXRhc2V0X2ltZ191cmwubGVuZ3RoID4gMCA/IGRhdGFzZXQuZGF0YXNldF9pbWdfdXJsIDogJ2RhdGFzZXQtcGxhY2Vob2xkZXIucG5nJ1xuXHRcdHRoaXMuY2hlY2tyZWNzLnNldERhdGEoJycgKyBkYXRhc2V0LnRlc3RlZF9yZWNvcmRzKVxuXHRcdHRoaXMuY2hlY2thdHRyLnNldERhdGEoJzEyMycpXG5cdFx0dGhpcy5mYWlsZWRyZWNzLnNldERhdGEoJycgKyAoZGF0YXNldC50ZXN0ZWRfcmVjb3JkcyAtIGRhdGFzZXQuZmFpbGVkX3JlY29yZHMpKVxuXHRcdGNvbnN0IHF1YWxpdHlfcmF0aW8gPSBkYXRhc2V0LnRlc3RlZF9yZWNvcmRzID09IDAgPyAxMDAgOiBkYXRhc2V0LmZhaWxlZF9yZWNvcmRzIC8gZGF0YXNldC50ZXN0ZWRfcmVjb3Jkc1xuXHRcdGlmIChxdWFsaXR5X3JhdGlvIDwgMC4xKVxuXHRcdFx0dGhpcy5mYWlsZWRyZWNzLnNldFF1YWxpdHlMZXZlbChcImdvb2RcIilcblx0XHRlbHNlIGlmIChxdWFsaXR5X3JhdGlvIDwgMC4zKVxuXHRcdFx0dGhpcy5mYWlsZWRyZWNzLnNldFF1YWxpdHlMZXZlbChcIndhcm5cIilcblx0XHRlbHNlXG5cdFx0XHR0aGlzLmZhaWxlZHJlY3Muc2V0UXVhbGl0eUxldmVsKFwiZmFpbFwiKVxuXHRcdHRoaXMubGFzdHVwZGF0ZS50ZXh0Q29udGVudCA9IGRhdGVmb3JtYXRcblx0XHR0aGlzLm9uY2xpY2sgPSAoKSA9PiB7XG5cdFx0XHRsb2NhdGlvbi5oYXNoID0gJyNwYWdlPWRhdGFzZXQtY2F0ZWdvcmllcycgKyAnJmRhdGFzZXRfbmFtZT0nICsgZGF0YXNldC5kYXRhc2V0X25hbWUgXG5cdFx0XHRcdFx0XHRcdCsgXCImc2Vzc2lvbl9zdGFydF90cz1cIiArIGRhdGFzZXQuc2Vzc2lvbl9zdGFydF90c1xuXHRcdFx0XHRcdFx0XHQrIFwiJmZhaWxlZF9yZWNvcmRzPVwiICsgZGF0YXNldC5mYWlsZWRfcmVjb3Jkc1xuXHRcdFx0XHRcdFx0XHQrIFwiJnRlc3RlZF9yZWNvcmRzPVwiICsgZGF0YXNldC50ZXN0ZWRfcmVjb3Jkc1xuXHRcdFx0d2luZG93LnNjcm9sbFRvKDAsMCk7XG5cdFx0fVxuXHR9XG59XG5cblxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCdjcy1kYXRhc2V0LWJveCcsIERhdGFzZXRDYXJkQ29tcG9uZW50KVxuIl19