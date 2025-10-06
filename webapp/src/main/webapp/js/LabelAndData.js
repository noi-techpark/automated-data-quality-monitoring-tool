// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGFiZWxBbmREYXRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdHlwZXNjcmlwdC9MYWJlbEFuZERhdGEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsOERBQThEO0FBQzlELEVBQUU7QUFDRiw2Q0FBNkM7QUFHN0MsT0FBTyxFQUFFLE9BQU8sRUFBWSxNQUFNLGNBQWMsQ0FBQztBQUVqRCxNQUFNLE9BQU8sWUFBYSxTQUFRLFdBQVc7SUFFNUMsS0FBSyxDQUFBO0lBQ0wsSUFBSSxDQUFBO0lBRUo7UUFFQyxLQUFLLEVBQUUsQ0FBQztRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQztRQUNoRCxLQUFLLENBQUMsU0FBUyxHQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTRDakIsQ0FBQTtRQUVELElBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLGVBQWUsRUFBRSxLQUFLLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUE7UUFDcEUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDMUYsSUFBSSxDQUFDLElBQUksR0FBSSxPQUFPLENBQUMsZUFBZSxFQUFFLEtBQUssQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQTtJQUVwRSxDQUFDO0lBRUQsUUFBUSxDQUFDLENBQVM7UUFFakIsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFBO0lBQzNCLENBQUM7SUFFRCxPQUFPLENBQUMsQ0FBUztRQUVoQixJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUE7SUFDMUIsQ0FBQztJQUVELGVBQWUsQ0FBQyxRQUFrQztRQUVqRCxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQTtJQUM3QixDQUFDO0NBRUQ7QUFFRCxjQUFjLENBQUMsTUFBTSxDQUFDLG1CQUFtQixFQUFFLFlBQVksQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gU1BEWC1GaWxlQ29weXJpZ2h0VGV4dDogMjAyNCBDYXRjaCBTb2x2ZSBkaSBEYXZpZGUgTW9udGVzaW5cbi8vXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb3ItbGF0ZXJcblxuXG5pbXBvcnQgeyBjc19jYXN0LCB0aHJvd05QRSB9IGZyb20gXCIuL3F1YWxpdHkuanNcIjtcblxuZXhwb3J0IGNsYXNzIExhYmVsQW5kRGF0YSBleHRlbmRzIEhUTUxFbGVtZW50XG57XG5cdGxhYmVsXG5cdGRhdGEgXG5cdFxuXHRjb25zdHJ1Y3RvcigpXG5cdHtcblx0XHRzdXBlcigpO1xuXHRcdGNvbnN0IHNyb290ID0gdGhpcy5hdHRhY2hTaGFkb3coe21vZGU6ICdvcGVuJ30pO1xuXHRcdHNyb290LmlubmVySFRNTCA9IGBcblx0XHQ8c3R5bGU+XG5cdFx0XHQ6aG9zdCB7XG5cdFx0XHRcdGRpc3BsYXk6IGZsZXg7XG5cdFx0XHRcdGJvcmRlci10b3A6IDFweCBzb2xpZCAjY2NjO1xuXHRcdFx0XHRwYWRkaW5nLXRvcDogMC4zcmVtO1xuXHRcdFx0XHRwYWRkaW5nLWJvdHRvbTogMC4zcmVtO1xuXHRcdFx0XHRhbGlnbi1pdGVtczogY2VudGVyO1xuXHRcdFx0fVxuXHRcdFx0c3BhbiB7XG5cdFx0XHRcdGZvbnQtc2l6ZTogMC43cmVtO1xuXHRcdFx0fVxuXHRcdFx0c3Bhbi5sYWJlbCB7XG5cdFx0XHRcdGZsZXgtZ3JvdzogMTtcblx0XHRcdFx0bWFyZ2luLXJpZ2h0OiAwLjNyZW07XG5cdFx0XHRcdHBhZGRpbmc6IDAuMnJlbVxuXHRcdFx0fVxuXHRcdFx0c3Bhbi5kYXRhIHtcblx0XHRcdFx0cGFkZGluZzogMC4ycmVtO1xuXHRcdFx0XHRib3JkZXItcmFkaXVzOiAwLjNyZW07XG5cdFx0XHRcdG1hcmdpbi1yaWdodDogMC4zcmVtO1xuXHRcdFx0XHRiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1kYXJrLWJhY2tncm91bmQpO1xuXHRcdFx0XHRjb2xvcjogI2RkZDtcblx0XHRcdFx0bWluLXdpZHRoOiAycmVtO1xuXHRcdFx0XHR0ZXh0LWFsaWduOiByaWdodDtcblx0XHRcdH1cblx0XHRcdDpob3N0KC5mYWlsKSBzcGFuLmxhYmVsIHtcblx0XHRcdFx0YmFja2dyb3VuZC1jb2xvcjogI2ZhYTtcblx0XHRcdFx0Y29sb3I6ICM0MDA7XG5cdFx0XHRcdGZvbnQtd2VpZ2h0OiBib2xkO1xuXHRcdFx0fVxuXHRcdFx0Omhvc3QoLmdvb2QpIHNwYW4ubGFiZWwge1xuXHRcdFx0XHRiYWNrZ3JvdW5kLWNvbG9yOiAjYWZhO1xuXHRcdFx0XHRjb2xvcjogIzA0MDtcblx0XHRcdFx0Zm9udC13ZWlnaHQ6IGJvbGQ7XG5cdFx0XHR9XG5cdFx0XHQ6aG9zdCgud2Fybikgc3Bhbi5sYWJlbCB7XG5cdFx0XHRcdGJhY2tncm91bmQtY29sb3I6ICNmZmE7XG5cdFx0XHRcdGNvbG9yOiAjNDQwO1xuXHRcdFx0XHRmb250LXdlaWdodDogYm9sZDtcblx0XHRcdH1cblx0XHQ8L3N0eWxlPlxuXHRcdDxzcGFuIGNsYXNzPVwiZGF0YVwiPi48L3NwYW4+XG5cdFx0PHNwYW4gY2xhc3M9XCJsYWJlbFwiPjwvc3Bhbj5cblx0XHRgXG5cdFx0XG5cdFx0dGhpcy5sYWJlbCA9IGNzX2Nhc3QoSFRNTFNwYW5FbGVtZW50LCBzcm9vdC5xdWVyeVNlbGVjdG9yKCcubGFiZWwnKSlcblx0XHR0aGlzLnNldExhYmVsKHRoaXMuZ2V0QXR0cmlidXRlKCdsYWJlbCcpICE9PSBudWxsID8gdGhpcy5nZXRBdHRyaWJ1dGUoJ2xhYmVsJykhIDogJ2xhYmVsJylcblx0XHR0aGlzLmRhdGEgID0gY3NfY2FzdChIVE1MU3BhbkVsZW1lbnQsIHNyb290LnF1ZXJ5U2VsZWN0b3IoJy5kYXRhJykpXG5cdFx0XG5cdH1cblx0XG5cdHNldExhYmVsKHM6IHN0cmluZylcblx0e1xuXHRcdHRoaXMubGFiZWwudGV4dENvbnRlbnQgPSBzXG5cdH1cblxuXHRzZXREYXRhKHM6IHN0cmluZylcblx0e1xuXHRcdHRoaXMuZGF0YS50ZXh0Q29udGVudCA9IHNcblx0fVxuXHRcblx0c2V0UXVhbGl0eUxldmVsKHNldmVyaXR5OiBcImdvb2RcIiB8IFwid2FyblwiIHwgXCJmYWlsXCIpXG5cdHtcblx0XHR0aGlzLmNsYXNzTGlzdC5hZGQoc2V2ZXJpdHkpXG5cdH1cblx0XG59XG5cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgnY3MtbGFiZWwtYW5kLWRhdGEnLCBMYWJlbEFuZERhdGEpXG4iXX0=