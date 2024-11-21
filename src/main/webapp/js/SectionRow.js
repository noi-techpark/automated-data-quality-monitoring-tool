/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VjdGlvblJvdy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3R5cGVzY3JpcHQvU2VjdGlvblJvdy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxPQUFPLEVBQUUsT0FBTyxFQUFZLE1BQU0sY0FBYyxDQUFDO0FBRWpELE1BQU0sT0FBTyxVQUFXLFNBQVEsV0FBVztJQUUxQyxLQUFLLENBQUE7SUFFTDtRQUNDLEtBQUssRUFBRSxDQUFBO1FBQ1AsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFBO1FBQ2pELEtBQUssQ0FBQyxTQUFTLEdBQUc7Ozs7Ozs7Ozs7S0FVZixDQUFBO1FBRUgsY0FBYyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUM3QixJQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFBO0lBRXJFLENBQUM7SUFHRCxLQUFLLENBQUMsT0FBTyxDQUFDLENBQVM7UUFDdEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO0lBQzVCLENBQUM7Q0FFRDtBQUVELGNBQWMsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsVUFBVSxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogKEMpIDIwMjQgQ2F0Y2ggU29sdmUgZGkgRGF2aWRlIE1vbnRlc2luXG4gKiBMaWNlbnNlOiBBR1BMXG4gKi9cblxuaW1wb3J0IHsgY3NfY2FzdCwgdGhyb3dOUEUgfSBmcm9tIFwiLi9xdWFsaXR5LmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBTZWN0aW9uUm93IGV4dGVuZHMgSFRNTEVsZW1lbnRcbntcblx0bGFiZWxcblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpXG5cdFx0Y29uc3Qgc3Jvb3QgPSB0aGlzLmF0dGFjaFNoYWRvdyh7IG1vZGU6ICdvcGVuJyB9KVxuXHRcdHNyb290LmlubmVySFRNTCA9IGBcblx0XHRcdFx0PHN0eWxlPlxuXHRcdFx0XHRcdDpob3N0IHtcblx0XHRcdFx0XHRcdGRpc3BsYXk6IGJsb2NrO1xuXHRcdFx0XHRcdFx0Ym9yZGVyOiAxcHggc29saWQgI2VlZTtcblx0XHRcdFx0XHRcdHBhZGRpbmc6IDFyZW07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFxuXHRcdFx0XHQ8L3N0eWxlPlxuXHRcdFx0XHQ8c3BhbiBjbGFzcz1cImxhYmVsXCI+dGl0bGU8L3NwYW4+XG5cdFx0XHRcdGBcblxuXHRcdGN1c3RvbUVsZW1lbnRzLnVwZ3JhZGUoc3Jvb3QpXG5cdFx0dGhpcy5sYWJlbCA9IGNzX2Nhc3QoSFRNTFNwYW5FbGVtZW50LCBzcm9vdC5xdWVyeVNlbGVjdG9yKCcubGFiZWwnKSlcblxuXHR9XG5cdFxuXHRcblx0YXN5bmMgcmVmcmVzaChzOiBzdHJpbmcpIHtcblx0XHR0aGlzLmxhYmVsLnRleHRDb250ZW50ID0gcztcblx0fVxuXHRcbn1cblxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCdjcy1zZWN0aW9uLXJvdycsIFNlY3Rpb25Sb3cpXG4iXX0=