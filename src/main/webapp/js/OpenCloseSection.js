// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later
import { cs_cast } from "./quality.js";
export class OpenCloseSection extends HTMLElement {
    content;
    open = true;
    openclose;
    label;
    actions;
    onopen = () => { };
    constructor() {
        super();
        const sroot = this.attachShadow({ mode: 'open' });
        sroot.innerHTML = `
				<style>
					:host {
						display: block;
					}
					.header {
						display: flex;
						align-items: center;
					}
					.label {
						flex-grow: 1;
						cursor: pointer;
						padding: 0.4rem;
						user-select: none;
					}
					.openclose {
						cursor: pointer;
						padding: 0.4rem;
						user-select: none;
					}
					.content {
						overflow: hidden;
						transition: transform 1s;
						transform-origin: top;
					}
					
					/*
					span.label::before {
					  content: "";
					  display: inline-block;
					  width: 8px;
					  height: 8px;
					  background-color: red;
					  border-radius: 50%;
					  margin-right: 5px;
					}
					 */
					
					.nextpagebutton {
															margin: auto;
															display: block;
															background-color: black;
															color: white;
														}
														
					
				</style>
				<div class="header">
				<span class="label">title</span>
				<span class="actions">actions</span>
				<span class="openclose"></span>
				</div>
				<div class="content"></div>
				`;
        customElements.upgrade(sroot);
        this.label = cs_cast(HTMLSpanElement, sroot.querySelector('.label'));
        this.actions = cs_cast(HTMLSpanElement, sroot.querySelector('.actions'));
        this.content = cs_cast(HTMLDivElement, sroot.querySelector('.content'));
        this.openclose = cs_cast(HTMLSpanElement, sroot.querySelector('.openclose'));
        this.openclose.onclick = () => {
            this.toggle();
        };
        this.label.onclick = this.openclose.onclick;
        this.toggle();
    }
    toggle() {
        this.open = !this.open;
        this.content.style.height = !this.open ? '0rem' : 'auto';
        this.openclose.textContent = !this.open ? '▼' : '▲';
        if (this.open) {
            this.content.textContent = ''; // svuola la sezione
            this.onopen();
        }
    }
    async refresh(label, actions) {
        this.label.textContent = label;
        this.actions.textContent = actions;
    }
    addElementToContentArea(e) {
        this.content.appendChild(e);
    }
}
customElements.define('cs-open-close-section', OpenCloseSection);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT3BlbkNsb3NlU2VjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3R5cGVzY3JpcHQvT3BlbkNsb3NlU2VjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw4REFBOEQ7QUFDOUQsRUFBRTtBQUNGLDZDQUE2QztBQUc3QyxPQUFPLEVBQUUsT0FBTyxFQUFZLE1BQU0sY0FBYyxDQUFDO0FBRWpELE1BQU0sT0FBTyxnQkFBaUIsU0FBUSxXQUFXO0lBR2hELE9BQU8sQ0FBQTtJQUNQLElBQUksR0FBRyxJQUFJLENBQUE7SUFDWCxTQUFTLENBQUE7SUFDVCxLQUFLLENBQUE7SUFDTCxPQUFPLENBQUE7SUFFUCxNQUFNLEdBQUcsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFBO0lBRWpCO1FBQ0MsS0FBSyxFQUFFLENBQUE7UUFDUCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUE7UUFDakQsS0FBSyxDQUFDLFNBQVMsR0FBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7S0FxRGYsQ0FBQTtRQUVILGNBQWMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDN0IsSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsZUFBZSxFQUFFLEtBQUssQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQTtRQUNwRSxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFBO1FBQ3hFLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLGNBQWMsRUFBRSxLQUFLLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUE7UUFDdkUsSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsZUFBZSxFQUFFLEtBQUssQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQTtRQUM1RSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxHQUFHLEVBQUU7WUFDN0IsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2YsQ0FBQyxDQUFBO1FBQ0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUE7UUFDM0MsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ2YsQ0FBQztJQUVELE1BQU07UUFFTCxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQTtRQUN0QixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQTtRQUM1RCxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFBO1FBQ3RELElBQUksSUFBSSxDQUFDLElBQUksRUFDYixDQUFDO1lBQ0EsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFBLENBQUMsb0JBQW9CO1lBQ2xELElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQTtRQUNkLENBQUM7SUFDRixDQUFDO0lBRUQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFhLEVBQUUsT0FBZTtRQUMzQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUE7UUFDOUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFBO0lBQ25DLENBQUM7SUFFRCx1QkFBdUIsQ0FBQyxDQUFjO1FBRXJDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQzVCLENBQUM7Q0FDRDtBQUVELGNBQWMsQ0FBQyxNQUFNLENBQUMsdUJBQXVCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIFNQRFgtRmlsZUNvcHlyaWdodFRleHQ6IDIwMjQgQ2F0Y2ggU29sdmUgZGkgRGF2aWRlIE1vbnRlc2luXG4vL1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9yLWxhdGVyXG5cblxuaW1wb3J0IHsgY3NfY2FzdCwgdGhyb3dOUEUgfSBmcm9tIFwiLi9xdWFsaXR5LmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBPcGVuQ2xvc2VTZWN0aW9uIGV4dGVuZHMgSFRNTEVsZW1lbnRcbntcblx0XG5cdGNvbnRlbnRcblx0b3BlbiA9IHRydWUgXG5cdG9wZW5jbG9zZVxuXHRsYWJlbFxuXHRhY3Rpb25zXG5cdFxuXHRvbm9wZW4gPSAoKSA9PiB7fVxuXHRcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKVxuXHRcdGNvbnN0IHNyb290ID0gdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSlcblx0XHRzcm9vdC5pbm5lckhUTUwgPSBgXG5cdFx0XHRcdDxzdHlsZT5cblx0XHRcdFx0XHQ6aG9zdCB7XG5cdFx0XHRcdFx0XHRkaXNwbGF5OiBibG9jaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0LmhlYWRlciB7XG5cdFx0XHRcdFx0XHRkaXNwbGF5OiBmbGV4O1xuXHRcdFx0XHRcdFx0YWxpZ24taXRlbXM6IGNlbnRlcjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0LmxhYmVsIHtcblx0XHRcdFx0XHRcdGZsZXgtZ3JvdzogMTtcblx0XHRcdFx0XHRcdGN1cnNvcjogcG9pbnRlcjtcblx0XHRcdFx0XHRcdHBhZGRpbmc6IDAuNHJlbTtcblx0XHRcdFx0XHRcdHVzZXItc2VsZWN0OiBub25lO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQub3BlbmNsb3NlIHtcblx0XHRcdFx0XHRcdGN1cnNvcjogcG9pbnRlcjtcblx0XHRcdFx0XHRcdHBhZGRpbmc6IDAuNHJlbTtcblx0XHRcdFx0XHRcdHVzZXItc2VsZWN0OiBub25lO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQuY29udGVudCB7XG5cdFx0XHRcdFx0XHRvdmVyZmxvdzogaGlkZGVuO1xuXHRcdFx0XHRcdFx0dHJhbnNpdGlvbjogdHJhbnNmb3JtIDFzO1xuXHRcdFx0XHRcdFx0dHJhbnNmb3JtLW9yaWdpbjogdG9wO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcblx0XHRcdFx0XHQvKlxuXHRcdFx0XHRcdHNwYW4ubGFiZWw6OmJlZm9yZSB7XG5cdFx0XHRcdFx0ICBjb250ZW50OiBcIlwiO1xuXHRcdFx0XHRcdCAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuXHRcdFx0XHRcdCAgd2lkdGg6IDhweDtcblx0XHRcdFx0XHQgIGhlaWdodDogOHB4O1xuXHRcdFx0XHRcdCAgYmFja2dyb3VuZC1jb2xvcjogcmVkO1xuXHRcdFx0XHRcdCAgYm9yZGVyLXJhZGl1czogNTAlO1xuXHRcdFx0XHRcdCAgbWFyZ2luLXJpZ2h0OiA1cHg7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdCAqL1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdC5uZXh0cGFnZWJ1dHRvbiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtYXJnaW46IGF1dG87XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkaXNwbGF5OiBibG9jaztcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGJhY2tncm91bmQtY29sb3I6IGJsYWNrO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y29sb3I6IHdoaXRlO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcblx0XHRcdFx0PC9zdHlsZT5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImhlYWRlclwiPlxuXHRcdFx0XHQ8c3BhbiBjbGFzcz1cImxhYmVsXCI+dGl0bGU8L3NwYW4+XG5cdFx0XHRcdDxzcGFuIGNsYXNzPVwiYWN0aW9uc1wiPmFjdGlvbnM8L3NwYW4+XG5cdFx0XHRcdDxzcGFuIGNsYXNzPVwib3BlbmNsb3NlXCI+PC9zcGFuPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbnRlbnRcIj48L2Rpdj5cblx0XHRcdFx0YFxuXG5cdFx0Y3VzdG9tRWxlbWVudHMudXBncmFkZShzcm9vdClcblx0XHR0aGlzLmxhYmVsID0gY3NfY2FzdChIVE1MU3BhbkVsZW1lbnQsIHNyb290LnF1ZXJ5U2VsZWN0b3IoJy5sYWJlbCcpKVxuXHRcdHRoaXMuYWN0aW9ucyA9IGNzX2Nhc3QoSFRNTFNwYW5FbGVtZW50LCBzcm9vdC5xdWVyeVNlbGVjdG9yKCcuYWN0aW9ucycpKVxuXHRcdHRoaXMuY29udGVudCA9IGNzX2Nhc3QoSFRNTERpdkVsZW1lbnQsIHNyb290LnF1ZXJ5U2VsZWN0b3IoJy5jb250ZW50JykpXG5cdFx0dGhpcy5vcGVuY2xvc2UgPSBjc19jYXN0KEhUTUxTcGFuRWxlbWVudCwgc3Jvb3QucXVlcnlTZWxlY3RvcignLm9wZW5jbG9zZScpKVxuXHRcdHRoaXMub3BlbmNsb3NlLm9uY2xpY2sgPSAoKSA9PiB7XG5cdFx0XHR0aGlzLnRvZ2dsZSgpO1xuXHRcdH1cblx0XHR0aGlzLmxhYmVsLm9uY2xpY2sgPSB0aGlzLm9wZW5jbG9zZS5vbmNsaWNrXG5cdFx0dGhpcy50b2dnbGUoKTtcblx0fVxuXHRcblx0dG9nZ2xlKClcblx0e1xuXHRcdHRoaXMub3BlbiA9ICF0aGlzLm9wZW5cblx0XHR0aGlzLmNvbnRlbnQuc3R5bGUuaGVpZ2h0ICAgICA9ICF0aGlzLm9wZW4gPyAnMHJlbScgOiAnYXV0bydcblx0XHR0aGlzLm9wZW5jbG9zZS50ZXh0Q29udGVudCAgICA9ICF0aGlzLm9wZW4gPyAn4pa8JyA6ICfilrInXG5cdFx0aWYgKHRoaXMub3Blbilcblx0XHR7XG5cdFx0XHR0aGlzLmNvbnRlbnQudGV4dENvbnRlbnQgPSAnJyAvLyBzdnVvbGEgbGEgc2V6aW9uZVxuXHRcdFx0dGhpcy5vbm9wZW4oKVxuXHRcdH1cblx0fVxuXHRcblx0YXN5bmMgcmVmcmVzaChsYWJlbDogc3RyaW5nLCBhY3Rpb25zOiBzdHJpbmcpIHtcblx0XHR0aGlzLmxhYmVsLnRleHRDb250ZW50ID0gbGFiZWxcblx0XHR0aGlzLmFjdGlvbnMudGV4dENvbnRlbnQgPSBhY3Rpb25zXG5cdH1cblx0XG5cdGFkZEVsZW1lbnRUb0NvbnRlbnRBcmVhKGU6IEhUTUxFbGVtZW50KVxuXHR7XG5cdFx0dGhpcy5jb250ZW50LmFwcGVuZENoaWxkKGUpXG5cdH1cbn1cblxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCdjcy1vcGVuLWNsb3NlLXNlY3Rpb24nLCBPcGVuQ2xvc2VTZWN0aW9uKVxuIl19