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
			}
			span.data {
				font-weight: bold;
				padding: 0.2rem;
				border-radius: 0.3rem;
			}
			span.data.fail {
				background-color: #fcc;
				color: #833;
			}
		</style>
		<span class="label">label</span>
		<span class="data">.</span>
		`;
        this.label = cs_cast(HTMLSpanElement, sroot.querySelector('.label'));
        this.data = cs_cast(HTMLSpanElement, sroot.querySelector('.data'));
    }
    setLabel(s) {
        this.label.textContent = s;
    }
    setData(s) {
        this.data.textContent = s;
    }
    setSeverity(severity) {
        this.data.classList.add(severity);
    }
}
customElements.define('cs-label-and-data', LabelAndData);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGFiZWxBbmREYXRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdHlwZXNjcmlwdC9MYWJlbEFuZERhdGEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHO0FBRUgsT0FBTyxFQUFFLE9BQU8sRUFBWSxNQUFNLGNBQWMsQ0FBQztBQUVqRCxNQUFNLE9BQU8sWUFBYSxTQUFRLFdBQVc7SUFFNUMsS0FBSyxDQUFBO0lBQ0wsSUFBSSxDQUFBO0lBRUo7UUFFQyxLQUFLLEVBQUUsQ0FBQztRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQztRQUNoRCxLQUFLLENBQUMsU0FBUyxHQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBNEJqQixDQUFBO1FBRUQsSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsZUFBZSxFQUFFLEtBQUssQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQTtRQUNwRSxJQUFJLENBQUMsSUFBSSxHQUFJLE9BQU8sQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO0lBRXBFLENBQUM7SUFFRCxRQUFRLENBQUMsQ0FBUztRQUVqQixJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUE7SUFDM0IsQ0FBQztJQUVELE9BQU8sQ0FBQyxDQUFTO1FBRWhCLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQTtJQUMxQixDQUFDO0lBRUQsV0FBVyxDQUFDLFFBQWtDO1FBRTdDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQTtJQUNsQyxDQUFDO0NBRUQ7QUFFRCxjQUFjLENBQUMsTUFBTSxDQUFDLG1CQUFtQixFQUFFLFlBQVksQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIChDKSAyMDI0IENhdGNoIFNvbHZlIGRpIERhdmlkZSBNb250ZXNpblxuICogTGljZW5zZTogQUdQTFxuICovXG5cbmltcG9ydCB7IGNzX2Nhc3QsIHRocm93TlBFIH0gZnJvbSBcIi4vcXVhbGl0eS5qc1wiO1xuXG5leHBvcnQgY2xhc3MgTGFiZWxBbmREYXRhIGV4dGVuZHMgSFRNTEVsZW1lbnRcbntcblx0bGFiZWxcblx0ZGF0YSBcblx0XG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXHRcdHN1cGVyKCk7XG5cdFx0Y29uc3Qgc3Jvb3QgPSB0aGlzLmF0dGFjaFNoYWRvdyh7bW9kZTogJ29wZW4nfSk7XG5cdFx0c3Jvb3QuaW5uZXJIVE1MID0gYFxuXHRcdDxzdHlsZT5cblx0XHRcdDpob3N0IHtcblx0XHRcdFx0ZGlzcGxheTogZmxleDtcblx0XHRcdFx0Ym9yZGVyLXRvcDogMXB4IHNvbGlkICNjY2M7XG5cdFx0XHRcdHBhZGRpbmctdG9wOiAwLjNyZW07XG5cdFx0XHRcdHBhZGRpbmctYm90dG9tOiAwLjNyZW07XG5cdFx0XHRcdGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cdFx0XHR9XG5cdFx0XHRzcGFuIHtcblx0XHRcdFx0Zm9udC1zaXplOiAwLjdyZW07XG5cdFx0XHR9XG5cdFx0XHRzcGFuLmxhYmVsIHtcblx0XHRcdFx0ZmxleC1ncm93OiAxO1xuXHRcdFx0XHRtYXJnaW4tcmlnaHQ6IDAuM3JlbTtcblx0XHRcdH1cblx0XHRcdHNwYW4uZGF0YSB7XG5cdFx0XHRcdGZvbnQtd2VpZ2h0OiBib2xkO1xuXHRcdFx0XHRwYWRkaW5nOiAwLjJyZW07XG5cdFx0XHRcdGJvcmRlci1yYWRpdXM6IDAuM3JlbTtcblx0XHRcdH1cblx0XHRcdHNwYW4uZGF0YS5mYWlsIHtcblx0XHRcdFx0YmFja2dyb3VuZC1jb2xvcjogI2ZjYztcblx0XHRcdFx0Y29sb3I6ICM4MzM7XG5cdFx0XHR9XG5cdFx0PC9zdHlsZT5cblx0XHQ8c3BhbiBjbGFzcz1cImxhYmVsXCI+bGFiZWw8L3NwYW4+XG5cdFx0PHNwYW4gY2xhc3M9XCJkYXRhXCI+Ljwvc3Bhbj5cblx0XHRgXG5cdFx0XG5cdFx0dGhpcy5sYWJlbCA9IGNzX2Nhc3QoSFRNTFNwYW5FbGVtZW50LCBzcm9vdC5xdWVyeVNlbGVjdG9yKCcubGFiZWwnKSlcblx0XHR0aGlzLmRhdGEgID0gY3NfY2FzdChIVE1MU3BhbkVsZW1lbnQsIHNyb290LnF1ZXJ5U2VsZWN0b3IoJy5kYXRhJykpXG5cdFx0XG5cdH1cblx0XG5cdHNldExhYmVsKHM6IHN0cmluZylcblx0e1xuXHRcdHRoaXMubGFiZWwudGV4dENvbnRlbnQgPSBzXG5cdH1cblxuXHRzZXREYXRhKHM6IHN0cmluZylcblx0e1xuXHRcdHRoaXMuZGF0YS50ZXh0Q29udGVudCA9IHNcblx0fVxuXHRcblx0c2V0U2V2ZXJpdHkoc2V2ZXJpdHk6IFwiaW5mb1wiIHwgXCJ3YXJuXCIgfCBcImZhaWxcIilcblx0e1xuXHRcdHRoaXMuZGF0YS5jbGFzc0xpc3QuYWRkKHNldmVyaXR5KVxuXHR9XG5cdFxufVxuXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ2NzLWxhYmVsLWFuZC1kYXRhJywgTGFiZWxBbmREYXRhKVxuIl19