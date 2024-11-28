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
			span.data.good {
				background-color: #cfc;
				color: #383;
			}
			span.data.warn {
				background-color: #ffc;
				color: #883;
			}
		</style>
		<span class="label"></span>
		<span class="data">.</span>
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
        this.data.classList.add(severity);
    }
}
customElements.define('cs-label-and-data', LabelAndData);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGFiZWxBbmREYXRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdHlwZXNjcmlwdC9MYWJlbEFuZERhdGEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHO0FBRUgsT0FBTyxFQUFFLE9BQU8sRUFBWSxNQUFNLGNBQWMsQ0FBQztBQUVqRCxNQUFNLE9BQU8sWUFBYSxTQUFRLFdBQVc7SUFFNUMsS0FBSyxDQUFBO0lBQ0wsSUFBSSxDQUFBO0lBRUo7UUFFQyxLQUFLLEVBQUUsQ0FBQztRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQztRQUNoRCxLQUFLLENBQUMsU0FBUyxHQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FvQ2pCLENBQUE7UUFFRCxJQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFBO1FBQ3BFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQzFGLElBQUksQ0FBQyxJQUFJLEdBQUksT0FBTyxDQUFDLGVBQWUsRUFBRSxLQUFLLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUE7SUFFcEUsQ0FBQztJQUVELFFBQVEsQ0FBQyxDQUFTO1FBRWpCLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQTtJQUMzQixDQUFDO0lBRUQsT0FBTyxDQUFDLENBQVM7UUFFaEIsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFBO0lBQzFCLENBQUM7SUFFRCxlQUFlLENBQUMsUUFBa0M7UUFFakQsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0lBQ2xDLENBQUM7Q0FFRDtBQUVELGNBQWMsQ0FBQyxNQUFNLENBQUMsbUJBQW1CLEVBQUUsWUFBWSxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogKEMpIDIwMjQgQ2F0Y2ggU29sdmUgZGkgRGF2aWRlIE1vbnRlc2luXG4gKiBMaWNlbnNlOiBBR1BMXG4gKi9cblxuaW1wb3J0IHsgY3NfY2FzdCwgdGhyb3dOUEUgfSBmcm9tIFwiLi9xdWFsaXR5LmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBMYWJlbEFuZERhdGEgZXh0ZW5kcyBIVE1MRWxlbWVudFxue1xuXHRsYWJlbFxuXHRkYXRhIFxuXHRcblx0Y29uc3RydWN0b3IoKVxuXHR7XG5cdFx0c3VwZXIoKTtcblx0XHRjb25zdCBzcm9vdCA9IHRoaXMuYXR0YWNoU2hhZG93KHttb2RlOiAnb3Blbid9KTtcblx0XHRzcm9vdC5pbm5lckhUTUwgPSBgXG5cdFx0PHN0eWxlPlxuXHRcdFx0Omhvc3Qge1xuXHRcdFx0XHRkaXNwbGF5OiBmbGV4O1xuXHRcdFx0XHRib3JkZXItdG9wOiAxcHggc29saWQgI2NjYztcblx0XHRcdFx0cGFkZGluZy10b3A6IDAuM3JlbTtcblx0XHRcdFx0cGFkZGluZy1ib3R0b206IDAuM3JlbTtcblx0XHRcdFx0YWxpZ24taXRlbXM6IGNlbnRlcjtcblx0XHRcdH1cblx0XHRcdHNwYW4ge1xuXHRcdFx0XHRmb250LXNpemU6IDAuN3JlbTtcblx0XHRcdH1cblx0XHRcdHNwYW4ubGFiZWwge1xuXHRcdFx0XHRmbGV4LWdyb3c6IDE7XG5cdFx0XHRcdG1hcmdpbi1yaWdodDogMC4zcmVtO1xuXHRcdFx0fVxuXHRcdFx0c3Bhbi5kYXRhIHtcblx0XHRcdFx0Zm9udC13ZWlnaHQ6IGJvbGQ7XG5cdFx0XHRcdHBhZGRpbmc6IDAuMnJlbTtcblx0XHRcdFx0Ym9yZGVyLXJhZGl1czogMC4zcmVtO1xuXHRcdFx0fVxuXHRcdFx0c3Bhbi5kYXRhLmZhaWwge1xuXHRcdFx0XHRiYWNrZ3JvdW5kLWNvbG9yOiAjZmNjO1xuXHRcdFx0XHRjb2xvcjogIzgzMztcblx0XHRcdH1cblx0XHRcdHNwYW4uZGF0YS5nb29kIHtcblx0XHRcdFx0YmFja2dyb3VuZC1jb2xvcjogI2NmYztcblx0XHRcdFx0Y29sb3I6ICMzODM7XG5cdFx0XHR9XG5cdFx0XHRzcGFuLmRhdGEud2FybiB7XG5cdFx0XHRcdGJhY2tncm91bmQtY29sb3I6ICNmZmM7XG5cdFx0XHRcdGNvbG9yOiAjODgzO1xuXHRcdFx0fVxuXHRcdDwvc3R5bGU+XG5cdFx0PHNwYW4gY2xhc3M9XCJsYWJlbFwiPjwvc3Bhbj5cblx0XHQ8c3BhbiBjbGFzcz1cImRhdGFcIj4uPC9zcGFuPlxuXHRcdGBcblx0XHRcblx0XHR0aGlzLmxhYmVsID0gY3NfY2FzdChIVE1MU3BhbkVsZW1lbnQsIHNyb290LnF1ZXJ5U2VsZWN0b3IoJy5sYWJlbCcpKVxuXHRcdHRoaXMuc2V0TGFiZWwodGhpcy5nZXRBdHRyaWJ1dGUoJ2xhYmVsJykgIT09IG51bGwgPyB0aGlzLmdldEF0dHJpYnV0ZSgnbGFiZWwnKSEgOiAnbGFiZWwnKVxuXHRcdHRoaXMuZGF0YSAgPSBjc19jYXN0KEhUTUxTcGFuRWxlbWVudCwgc3Jvb3QucXVlcnlTZWxlY3RvcignLmRhdGEnKSlcblx0XHRcblx0fVxuXHRcblx0c2V0TGFiZWwoczogc3RyaW5nKVxuXHR7XG5cdFx0dGhpcy5sYWJlbC50ZXh0Q29udGVudCA9IHNcblx0fVxuXG5cdHNldERhdGEoczogc3RyaW5nKVxuXHR7XG5cdFx0dGhpcy5kYXRhLnRleHRDb250ZW50ID0gc1xuXHR9XG5cdFxuXHRzZXRRdWFsaXR5TGV2ZWwoc2V2ZXJpdHk6IFwiZ29vZFwiIHwgXCJ3YXJuXCIgfCBcImZhaWxcIilcblx0e1xuXHRcdHRoaXMuZGF0YS5jbGFzc0xpc3QuYWRkKHNldmVyaXR5KVxuXHR9XG5cdFxufVxuXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ2NzLWxhYmVsLWFuZC1kYXRhJywgTGFiZWxBbmREYXRhKVxuIl19