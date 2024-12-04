/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */
import { cs_cast } from "./quality.js";
export class LabelAndData extends HTMLElement {
    label;
    data;
    constructor() {
        super();
        const sroot = this.attachShadow({ mode: 'open' });
        sroot.innerHTML = `
		<style>
			:host {
				display: flex;
				border-top: 1px solid #ccc;
				padding-top: 0.3rem;
				padding-bottom: 0.3rem;
				align-items: center;
			}
			span {
				font-size: 0.7rem;
			}
			span.label {
				flex-grow: 1;
				margin-right: 0.3rem;
				padding: 0.2rem
			}
			span.data {
				padding: 0.2rem;
				border-radius: 0.3rem;
				margin-right: 0.3rem;
				background-color: var(--dark-background);
				color: #ddd;
				min-width: 2rem;
				text-align: right;
			}
			:host(.fail) span.label {
				background-color: #faa;
				color: #400;
				font-weight: bold;
			}
			:host(.good) span.label {
				background-color: #afa;
				color: #040;
				font-weight: bold;
			}
			:host(.warn) span.label {
				background-color: #ffa;
				color: #440;
				font-weight: bold;
			}
		</style>
		<span class="data">.</span>
		<span class="label"></span>
		`;
        this.label = cs_cast(HTMLSpanElement, sroot.querySelector('.label'));
        this.setLabel(this.getAttribute('label') !== null ? this.getAttribute('label') : 'label');
        this.data = cs_cast(HTMLSpanElement, sroot.querySelector('.data'));
    }
    setLabel(s) {
        this.label.textContent = s;
    }
    setData(s) {
        this.data.textContent = s;
    }
    setQualityLevel(severity) {
        this.classList.add(severity);
    }
}
customElements.define('cs-label-and-data', LabelAndData);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGFiZWxBbmREYXRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdHlwZXNjcmlwdC9MYWJlbEFuZERhdGEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHO0FBRUgsT0FBTyxFQUFFLE9BQU8sRUFBWSxNQUFNLGNBQWMsQ0FBQztBQUVqRCxNQUFNLE9BQU8sWUFBYSxTQUFRLFdBQVc7SUFFNUMsS0FBSyxDQUFBO0lBQ0wsSUFBSSxDQUFBO0lBRUo7UUFFQyxLQUFLLEVBQUUsQ0FBQztRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQztRQUNoRCxLQUFLLENBQUMsU0FBUyxHQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTRDakIsQ0FBQTtRQUVELElBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLGVBQWUsRUFBRSxLQUFLLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUE7UUFDcEUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDMUYsSUFBSSxDQUFDLElBQUksR0FBSSxPQUFPLENBQUMsZUFBZSxFQUFFLEtBQUssQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQTtJQUVwRSxDQUFDO0lBRUQsUUFBUSxDQUFDLENBQVM7UUFFakIsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFBO0lBQzNCLENBQUM7SUFFRCxPQUFPLENBQUMsQ0FBUztRQUVoQixJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUE7SUFDMUIsQ0FBQztJQUVELGVBQWUsQ0FBQyxRQUFrQztRQUVqRCxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQTtJQUM3QixDQUFDO0NBRUQ7QUFFRCxjQUFjLENBQUMsTUFBTSxDQUFDLG1CQUFtQixFQUFFLFlBQVksQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIChDKSAyMDI0IENhdGNoIFNvbHZlIGRpIERhdmlkZSBNb250ZXNpblxuICogTGljZW5zZTogQUdQTFxuICovXG5cbmltcG9ydCB7IGNzX2Nhc3QsIHRocm93TlBFIH0gZnJvbSBcIi4vcXVhbGl0eS5qc1wiO1xuXG5leHBvcnQgY2xhc3MgTGFiZWxBbmREYXRhIGV4dGVuZHMgSFRNTEVsZW1lbnRcbntcblx0bGFiZWxcblx0ZGF0YSBcblx0XG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXHRcdHN1cGVyKCk7XG5cdFx0Y29uc3Qgc3Jvb3QgPSB0aGlzLmF0dGFjaFNoYWRvdyh7bW9kZTogJ29wZW4nfSk7XG5cdFx0c3Jvb3QuaW5uZXJIVE1MID0gYFxuXHRcdDxzdHlsZT5cblx0XHRcdDpob3N0IHtcblx0XHRcdFx0ZGlzcGxheTogZmxleDtcblx0XHRcdFx0Ym9yZGVyLXRvcDogMXB4IHNvbGlkICNjY2M7XG5cdFx0XHRcdHBhZGRpbmctdG9wOiAwLjNyZW07XG5cdFx0XHRcdHBhZGRpbmctYm90dG9tOiAwLjNyZW07XG5cdFx0XHRcdGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cdFx0XHR9XG5cdFx0XHRzcGFuIHtcblx0XHRcdFx0Zm9udC1zaXplOiAwLjdyZW07XG5cdFx0XHR9XG5cdFx0XHRzcGFuLmxhYmVsIHtcblx0XHRcdFx0ZmxleC1ncm93OiAxO1xuXHRcdFx0XHRtYXJnaW4tcmlnaHQ6IDAuM3JlbTtcblx0XHRcdFx0cGFkZGluZzogMC4ycmVtXG5cdFx0XHR9XG5cdFx0XHRzcGFuLmRhdGEge1xuXHRcdFx0XHRwYWRkaW5nOiAwLjJyZW07XG5cdFx0XHRcdGJvcmRlci1yYWRpdXM6IDAuM3JlbTtcblx0XHRcdFx0bWFyZ2luLXJpZ2h0OiAwLjNyZW07XG5cdFx0XHRcdGJhY2tncm91bmQtY29sb3I6IHZhcigtLWRhcmstYmFja2dyb3VuZCk7XG5cdFx0XHRcdGNvbG9yOiAjZGRkO1xuXHRcdFx0XHRtaW4td2lkdGg6IDJyZW07XG5cdFx0XHRcdHRleHQtYWxpZ246IHJpZ2h0O1xuXHRcdFx0fVxuXHRcdFx0Omhvc3QoLmZhaWwpIHNwYW4ubGFiZWwge1xuXHRcdFx0XHRiYWNrZ3JvdW5kLWNvbG9yOiAjZmFhO1xuXHRcdFx0XHRjb2xvcjogIzQwMDtcblx0XHRcdFx0Zm9udC13ZWlnaHQ6IGJvbGQ7XG5cdFx0XHR9XG5cdFx0XHQ6aG9zdCguZ29vZCkgc3Bhbi5sYWJlbCB7XG5cdFx0XHRcdGJhY2tncm91bmQtY29sb3I6ICNhZmE7XG5cdFx0XHRcdGNvbG9yOiAjMDQwO1xuXHRcdFx0XHRmb250LXdlaWdodDogYm9sZDtcblx0XHRcdH1cblx0XHRcdDpob3N0KC53YXJuKSBzcGFuLmxhYmVsIHtcblx0XHRcdFx0YmFja2dyb3VuZC1jb2xvcjogI2ZmYTtcblx0XHRcdFx0Y29sb3I6ICM0NDA7XG5cdFx0XHRcdGZvbnQtd2VpZ2h0OiBib2xkO1xuXHRcdFx0fVxuXHRcdDwvc3R5bGU+XG5cdFx0PHNwYW4gY2xhc3M9XCJkYXRhXCI+Ljwvc3Bhbj5cblx0XHQ8c3BhbiBjbGFzcz1cImxhYmVsXCI+PC9zcGFuPlxuXHRcdGBcblx0XHRcblx0XHR0aGlzLmxhYmVsID0gY3NfY2FzdChIVE1MU3BhbkVsZW1lbnQsIHNyb290LnF1ZXJ5U2VsZWN0b3IoJy5sYWJlbCcpKVxuXHRcdHRoaXMuc2V0TGFiZWwodGhpcy5nZXRBdHRyaWJ1dGUoJ2xhYmVsJykgIT09IG51bGwgPyB0aGlzLmdldEF0dHJpYnV0ZSgnbGFiZWwnKSEgOiAnbGFiZWwnKVxuXHRcdHRoaXMuZGF0YSAgPSBjc19jYXN0KEhUTUxTcGFuRWxlbWVudCwgc3Jvb3QucXVlcnlTZWxlY3RvcignLmRhdGEnKSlcblx0XHRcblx0fVxuXHRcblx0c2V0TGFiZWwoczogc3RyaW5nKVxuXHR7XG5cdFx0dGhpcy5sYWJlbC50ZXh0Q29udGVudCA9IHNcblx0fVxuXG5cdHNldERhdGEoczogc3RyaW5nKVxuXHR7XG5cdFx0dGhpcy5kYXRhLnRleHRDb250ZW50ID0gc1xuXHR9XG5cdFxuXHRzZXRRdWFsaXR5TGV2ZWwoc2V2ZXJpdHk6IFwiZ29vZFwiIHwgXCJ3YXJuXCIgfCBcImZhaWxcIilcblx0e1xuXHRcdHRoaXMuY2xhc3NMaXN0LmFkZChzZXZlcml0eSlcblx0fVxuXHRcbn1cblxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCdjcy1sYWJlbC1hbmQtZGF0YScsIExhYmVsQW5kRGF0YSlcbiJdfQ==