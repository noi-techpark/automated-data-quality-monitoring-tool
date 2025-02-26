// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later
import { cs_cast } from "./quality.js";
export class SectionRow extends HTMLElement {
    label;
    constructor() {
        super();
        const sroot = this.attachShadow({ mode: 'open' });
        sroot.innerHTML = `
				<style>
					:host {
						display: block;
						border: 1px solid #eee;
						padding: 1rem;
					}
					
				</style>
				<span class="label">title</span>
				`;
        customElements.upgrade(sroot);
        this.label = cs_cast(HTMLSpanElement, sroot.querySelector('.label'));
    }
    async refresh(s) {
        this.label.textContent = s;
    }
}
customElements.define('cs-section-row', SectionRow);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VjdGlvblJvdy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3R5cGVzY3JpcHQvU2VjdGlvblJvdy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw4REFBOEQ7QUFDOUQsRUFBRTtBQUNGLDZDQUE2QztBQUc3QyxPQUFPLEVBQUUsT0FBTyxFQUFZLE1BQU0sY0FBYyxDQUFDO0FBRWpELE1BQU0sT0FBTyxVQUFXLFNBQVEsV0FBVztJQUUxQyxLQUFLLENBQUE7SUFFTDtRQUNDLEtBQUssRUFBRSxDQUFBO1FBQ1AsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFBO1FBQ2pELEtBQUssQ0FBQyxTQUFTLEdBQUc7Ozs7Ozs7Ozs7S0FVZixDQUFBO1FBRUgsY0FBYyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUM3QixJQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFBO0lBRXJFLENBQUM7SUFHRCxLQUFLLENBQUMsT0FBTyxDQUFDLENBQVM7UUFDdEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO0lBQzVCLENBQUM7Q0FFRDtBQUVELGNBQWMsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsVUFBVSxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTUERYLUZpbGVDb3B5cmlnaHRUZXh0OiAyMDI0IENhdGNoIFNvbHZlIGRpIERhdmlkZSBNb250ZXNpblxuLy9cbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vci1sYXRlclxuXG5cbmltcG9ydCB7IGNzX2Nhc3QsIHRocm93TlBFIH0gZnJvbSBcIi4vcXVhbGl0eS5qc1wiO1xuXG5leHBvcnQgY2xhc3MgU2VjdGlvblJvdyBleHRlbmRzIEhUTUxFbGVtZW50XG57XG5cdGxhYmVsXG5cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKVxuXHRcdGNvbnN0IHNyb290ID0gdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSlcblx0XHRzcm9vdC5pbm5lckhUTUwgPSBgXG5cdFx0XHRcdDxzdHlsZT5cblx0XHRcdFx0XHQ6aG9zdCB7XG5cdFx0XHRcdFx0XHRkaXNwbGF5OiBibG9jaztcblx0XHRcdFx0XHRcdGJvcmRlcjogMXB4IHNvbGlkICNlZWU7XG5cdFx0XHRcdFx0XHRwYWRkaW5nOiAxcmVtO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcblx0XHRcdFx0PC9zdHlsZT5cblx0XHRcdFx0PHNwYW4gY2xhc3M9XCJsYWJlbFwiPnRpdGxlPC9zcGFuPlxuXHRcdFx0XHRgXG5cblx0XHRjdXN0b21FbGVtZW50cy51cGdyYWRlKHNyb290KVxuXHRcdHRoaXMubGFiZWwgPSBjc19jYXN0KEhUTUxTcGFuRWxlbWVudCwgc3Jvb3QucXVlcnlTZWxlY3RvcignLmxhYmVsJykpXG5cblx0fVxuXHRcblx0XG5cdGFzeW5jIHJlZnJlc2goczogc3RyaW5nKSB7XG5cdFx0dGhpcy5sYWJlbC50ZXh0Q29udGVudCA9IHM7XG5cdH1cblx0XG59XG5cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgnY3Mtc2VjdGlvbi1yb3cnLCBTZWN0aW9uUm93KVxuIl19