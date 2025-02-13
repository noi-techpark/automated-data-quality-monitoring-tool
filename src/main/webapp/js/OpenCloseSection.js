/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */
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
					
					span.label::before {
					  content: "";
					  display: inline-block;
					  width: 8px;
					  height: 8px;
					  background-color: red;
					  border-radius: 50%;
					  margin-right: 5px;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT3BlbkNsb3NlU2VjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3R5cGVzY3JpcHQvT3BlbkNsb3NlU2VjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxPQUFPLEVBQUUsT0FBTyxFQUFZLE1BQU0sY0FBYyxDQUFDO0FBRWpELE1BQU0sT0FBTyxnQkFBaUIsU0FBUSxXQUFXO0lBR2hELE9BQU8sQ0FBQTtJQUNQLElBQUksR0FBRyxJQUFJLENBQUE7SUFDWCxTQUFTLENBQUE7SUFDVCxLQUFLLENBQUE7SUFDTCxPQUFPLENBQUE7SUFFUCxNQUFNLEdBQUcsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFBO0lBRWpCO1FBQ0MsS0FBSyxFQUFFLENBQUE7UUFDUCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUE7UUFDakQsS0FBSyxDQUFDLFNBQVMsR0FBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztLQTJDZixDQUFBO1FBRUgsY0FBYyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUM3QixJQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFBO1FBQ3BFLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLGVBQWUsRUFBRSxLQUFLLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUE7UUFDeEUsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsY0FBYyxFQUFFLEtBQUssQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQTtRQUN2RSxJQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFBO1FBQzVFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRTtZQUM3QixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDZixDQUFDLENBQUE7UUFDRCxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQTtRQUMzQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDZixDQUFDO0lBRUQsTUFBTTtRQUVMLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFBO1FBQ3RCLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFBO1FBQzVELElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUE7UUFDdEQsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUNiLENBQUM7WUFDQSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUEsQ0FBQyxvQkFBb0I7WUFDbEQsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFBO1FBQ2QsQ0FBQztJQUNGLENBQUM7SUFFRCxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQWEsRUFBRSxPQUFlO1FBQzNDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQTtRQUM5QixJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUE7SUFDbkMsQ0FBQztJQUVELHVCQUF1QixDQUFDLENBQWM7UUFFckMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDNUIsQ0FBQztDQUNEO0FBRUQsY0FBYyxDQUFDLE1BQU0sQ0FBQyx1QkFBdUIsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIChDKSAyMDI0IENhdGNoIFNvbHZlIGRpIERhdmlkZSBNb250ZXNpblxuICogTGljZW5zZTogQUdQTFxuICovXG5cbmltcG9ydCB7IGNzX2Nhc3QsIHRocm93TlBFIH0gZnJvbSBcIi4vcXVhbGl0eS5qc1wiO1xuXG5leHBvcnQgY2xhc3MgT3BlbkNsb3NlU2VjdGlvbiBleHRlbmRzIEhUTUxFbGVtZW50XG57XG5cdFxuXHRjb250ZW50XG5cdG9wZW4gPSB0cnVlIFxuXHRvcGVuY2xvc2Vcblx0bGFiZWxcblx0YWN0aW9uc1xuXHRcblx0b25vcGVuID0gKCkgPT4ge31cblx0XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKClcblx0XHRjb25zdCBzcm9vdCA9IHRoaXMuYXR0YWNoU2hhZG93KHsgbW9kZTogJ29wZW4nIH0pXG5cdFx0c3Jvb3QuaW5uZXJIVE1MID0gYFxuXHRcdFx0XHQ8c3R5bGU+XG5cdFx0XHRcdFx0Omhvc3Qge1xuXHRcdFx0XHRcdFx0ZGlzcGxheTogYmxvY2s7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC5oZWFkZXIge1xuXHRcdFx0XHRcdFx0ZGlzcGxheTogZmxleDtcblx0XHRcdFx0XHRcdGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC5sYWJlbCB7XG5cdFx0XHRcdFx0XHRmbGV4LWdyb3c6IDE7XG5cdFx0XHRcdFx0XHRjdXJzb3I6IHBvaW50ZXI7XG5cdFx0XHRcdFx0XHRwYWRkaW5nOiAwLjRyZW07XG5cdFx0XHRcdFx0XHR1c2VyLXNlbGVjdDogbm9uZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Lm9wZW5jbG9zZSB7XG5cdFx0XHRcdFx0XHRjdXJzb3I6IHBvaW50ZXI7XG5cdFx0XHRcdFx0XHRwYWRkaW5nOiAwLjRyZW07XG5cdFx0XHRcdFx0XHR1c2VyLXNlbGVjdDogbm9uZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0LmNvbnRlbnQge1xuXHRcdFx0XHRcdFx0b3ZlcmZsb3c6IGhpZGRlbjtcblx0XHRcdFx0XHRcdHRyYW5zaXRpb246IHRyYW5zZm9ybSAxcztcblx0XHRcdFx0XHRcdHRyYW5zZm9ybS1vcmlnaW46IHRvcDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0c3Bhbi5sYWJlbDo6YmVmb3JlIHtcblx0XHRcdFx0XHQgIGNvbnRlbnQ6IFwiXCI7XG5cdFx0XHRcdFx0ICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG5cdFx0XHRcdFx0ICB3aWR0aDogOHB4O1xuXHRcdFx0XHRcdCAgaGVpZ2h0OiA4cHg7XG5cdFx0XHRcdFx0ICBiYWNrZ3JvdW5kLWNvbG9yOiByZWQ7XG5cdFx0XHRcdFx0ICBib3JkZXItcmFkaXVzOiA1MCU7XG5cdFx0XHRcdFx0ICBtYXJnaW4tcmlnaHQ6IDVweDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XG5cdFx0XHRcdDwvc3R5bGU+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJoZWFkZXJcIj5cblx0XHRcdFx0PHNwYW4gY2xhc3M9XCJsYWJlbFwiPnRpdGxlPC9zcGFuPlxuXHRcdFx0XHQ8c3BhbiBjbGFzcz1cImFjdGlvbnNcIj5hY3Rpb25zPC9zcGFuPlxuXHRcdFx0XHQ8c3BhbiBjbGFzcz1cIm9wZW5jbG9zZVwiPjwvc3Bhbj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJjb250ZW50XCI+PC9kaXY+XG5cdFx0XHRcdGBcblxuXHRcdGN1c3RvbUVsZW1lbnRzLnVwZ3JhZGUoc3Jvb3QpXG5cdFx0dGhpcy5sYWJlbCA9IGNzX2Nhc3QoSFRNTFNwYW5FbGVtZW50LCBzcm9vdC5xdWVyeVNlbGVjdG9yKCcubGFiZWwnKSlcblx0XHR0aGlzLmFjdGlvbnMgPSBjc19jYXN0KEhUTUxTcGFuRWxlbWVudCwgc3Jvb3QucXVlcnlTZWxlY3RvcignLmFjdGlvbnMnKSlcblx0XHR0aGlzLmNvbnRlbnQgPSBjc19jYXN0KEhUTUxEaXZFbGVtZW50LCBzcm9vdC5xdWVyeVNlbGVjdG9yKCcuY29udGVudCcpKVxuXHRcdHRoaXMub3BlbmNsb3NlID0gY3NfY2FzdChIVE1MU3BhbkVsZW1lbnQsIHNyb290LnF1ZXJ5U2VsZWN0b3IoJy5vcGVuY2xvc2UnKSlcblx0XHR0aGlzLm9wZW5jbG9zZS5vbmNsaWNrID0gKCkgPT4ge1xuXHRcdFx0dGhpcy50b2dnbGUoKTtcblx0XHR9XG5cdFx0dGhpcy5sYWJlbC5vbmNsaWNrID0gdGhpcy5vcGVuY2xvc2Uub25jbGlja1xuXHRcdHRoaXMudG9nZ2xlKCk7XG5cdH1cblx0XG5cdHRvZ2dsZSgpXG5cdHtcblx0XHR0aGlzLm9wZW4gPSAhdGhpcy5vcGVuXG5cdFx0dGhpcy5jb250ZW50LnN0eWxlLmhlaWdodCAgICAgPSAhdGhpcy5vcGVuID8gJzByZW0nIDogJ2F1dG8nXG5cdFx0dGhpcy5vcGVuY2xvc2UudGV4dENvbnRlbnQgICAgPSAhdGhpcy5vcGVuID8gJ+KWvCcgOiAn4payJ1xuXHRcdGlmICh0aGlzLm9wZW4pXG5cdFx0e1xuXHRcdFx0dGhpcy5jb250ZW50LnRleHRDb250ZW50ID0gJycgLy8gc3Z1b2xhIGxhIHNlemlvbmVcblx0XHRcdHRoaXMub25vcGVuKClcblx0XHR9XG5cdH1cblx0XG5cdGFzeW5jIHJlZnJlc2gobGFiZWw6IHN0cmluZywgYWN0aW9uczogc3RyaW5nKSB7XG5cdFx0dGhpcy5sYWJlbC50ZXh0Q29udGVudCA9IGxhYmVsXG5cdFx0dGhpcy5hY3Rpb25zLnRleHRDb250ZW50ID0gYWN0aW9uc1xuXHR9XG5cdFxuXHRhZGRFbGVtZW50VG9Db250ZW50QXJlYShlOiBIVE1MRWxlbWVudClcblx0e1xuXHRcdHRoaXMuY29udGVudC5hcHBlbmRDaGlsZChlKVxuXHR9XG59XG5cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgnY3Mtb3Blbi1jbG9zZS1zZWN0aW9uJywgT3BlbkNsb3NlU2VjdGlvbilcbiJdfQ==