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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT3BlbkNsb3NlU2VjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3R5cGVzY3JpcHQvT3BlbkNsb3NlU2VjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxPQUFPLEVBQUUsT0FBTyxFQUFZLE1BQU0sY0FBYyxDQUFDO0FBRWpELE1BQU0sT0FBTyxnQkFBaUIsU0FBUSxXQUFXO0lBR2hELE9BQU8sQ0FBQTtJQUNQLElBQUksR0FBRyxJQUFJLENBQUE7SUFDWCxTQUFTLENBQUE7SUFDVCxLQUFLLENBQUE7SUFDTCxPQUFPLENBQUE7SUFFUCxNQUFNLEdBQUcsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFBO0lBRWpCO1FBQ0MsS0FBSyxFQUFFLENBQUE7UUFDUCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUE7UUFDakQsS0FBSyxDQUFDLFNBQVMsR0FBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7S0FxRGYsQ0FBQTtRQUVILGNBQWMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDN0IsSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsZUFBZSxFQUFFLEtBQUssQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQTtRQUNwRSxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFBO1FBQ3hFLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLGNBQWMsRUFBRSxLQUFLLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUE7UUFDdkUsSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsZUFBZSxFQUFFLEtBQUssQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQTtRQUM1RSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxHQUFHLEVBQUU7WUFDN0IsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2YsQ0FBQyxDQUFBO1FBQ0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUE7UUFDM0MsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ2YsQ0FBQztJQUVELE1BQU07UUFFTCxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQTtRQUN0QixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQTtRQUM1RCxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFBO1FBQ3RELElBQUksSUFBSSxDQUFDLElBQUksRUFDYixDQUFDO1lBQ0EsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFBLENBQUMsb0JBQW9CO1lBQ2xELElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQTtRQUNkLENBQUM7SUFDRixDQUFDO0lBRUQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFhLEVBQUUsT0FBZTtRQUMzQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUE7UUFDOUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFBO0lBQ25DLENBQUM7SUFFRCx1QkFBdUIsQ0FBQyxDQUFjO1FBRXJDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQzVCLENBQUM7Q0FDRDtBQUVELGNBQWMsQ0FBQyxNQUFNLENBQUMsdUJBQXVCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAoQykgMjAyNCBDYXRjaCBTb2x2ZSBkaSBEYXZpZGUgTW9udGVzaW5cbiAqIExpY2Vuc2U6IEFHUExcbiAqL1xuXG5pbXBvcnQgeyBjc19jYXN0LCB0aHJvd05QRSB9IGZyb20gXCIuL3F1YWxpdHkuanNcIjtcblxuZXhwb3J0IGNsYXNzIE9wZW5DbG9zZVNlY3Rpb24gZXh0ZW5kcyBIVE1MRWxlbWVudFxue1xuXHRcblx0Y29udGVudFxuXHRvcGVuID0gdHJ1ZSBcblx0b3BlbmNsb3NlXG5cdGxhYmVsXG5cdGFjdGlvbnNcblx0XG5cdG9ub3BlbiA9ICgpID0+IHt9XG5cdFxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpXG5cdFx0Y29uc3Qgc3Jvb3QgPSB0aGlzLmF0dGFjaFNoYWRvdyh7IG1vZGU6ICdvcGVuJyB9KVxuXHRcdHNyb290LmlubmVySFRNTCA9IGBcblx0XHRcdFx0PHN0eWxlPlxuXHRcdFx0XHRcdDpob3N0IHtcblx0XHRcdFx0XHRcdGRpc3BsYXk6IGJsb2NrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQuaGVhZGVyIHtcblx0XHRcdFx0XHRcdGRpc3BsYXk6IGZsZXg7XG5cdFx0XHRcdFx0XHRhbGlnbi1pdGVtczogY2VudGVyO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQubGFiZWwge1xuXHRcdFx0XHRcdFx0ZmxleC1ncm93OiAxO1xuXHRcdFx0XHRcdFx0Y3Vyc29yOiBwb2ludGVyO1xuXHRcdFx0XHRcdFx0cGFkZGluZzogMC40cmVtO1xuXHRcdFx0XHRcdFx0dXNlci1zZWxlY3Q6IG5vbmU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC5vcGVuY2xvc2Uge1xuXHRcdFx0XHRcdFx0Y3Vyc29yOiBwb2ludGVyO1xuXHRcdFx0XHRcdFx0cGFkZGluZzogMC40cmVtO1xuXHRcdFx0XHRcdFx0dXNlci1zZWxlY3Q6IG5vbmU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC5jb250ZW50IHtcblx0XHRcdFx0XHRcdG92ZXJmbG93OiBoaWRkZW47XG5cdFx0XHRcdFx0XHR0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMXM7XG5cdFx0XHRcdFx0XHR0cmFuc2Zvcm0tb3JpZ2luOiB0b3A7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdC8qXG5cdFx0XHRcdFx0c3Bhbi5sYWJlbDo6YmVmb3JlIHtcblx0XHRcdFx0XHQgIGNvbnRlbnQ6IFwiXCI7XG5cdFx0XHRcdFx0ICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG5cdFx0XHRcdFx0ICB3aWR0aDogOHB4O1xuXHRcdFx0XHRcdCAgaGVpZ2h0OiA4cHg7XG5cdFx0XHRcdFx0ICBiYWNrZ3JvdW5kLWNvbG9yOiByZWQ7XG5cdFx0XHRcdFx0ICBib3JkZXItcmFkaXVzOiA1MCU7XG5cdFx0XHRcdFx0ICBtYXJnaW4tcmlnaHQ6IDVweDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ICovXG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0Lm5leHRwYWdlYnV0dG9uIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1hcmdpbjogYXV0bztcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRpc3BsYXk6IGJsb2NrO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YmFja2dyb3VuZC1jb2xvcjogYmxhY2s7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjb2xvcjogd2hpdGU7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFxuXHRcdFx0XHQ8L3N0eWxlPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiaGVhZGVyXCI+XG5cdFx0XHRcdDxzcGFuIGNsYXNzPVwibGFiZWxcIj50aXRsZTwvc3Bhbj5cblx0XHRcdFx0PHNwYW4gY2xhc3M9XCJhY3Rpb25zXCI+YWN0aW9uczwvc3Bhbj5cblx0XHRcdFx0PHNwYW4gY2xhc3M9XCJvcGVuY2xvc2VcIj48L3NwYW4+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY29udGVudFwiPjwvZGl2PlxuXHRcdFx0XHRgXG5cblx0XHRjdXN0b21FbGVtZW50cy51cGdyYWRlKHNyb290KVxuXHRcdHRoaXMubGFiZWwgPSBjc19jYXN0KEhUTUxTcGFuRWxlbWVudCwgc3Jvb3QucXVlcnlTZWxlY3RvcignLmxhYmVsJykpXG5cdFx0dGhpcy5hY3Rpb25zID0gY3NfY2FzdChIVE1MU3BhbkVsZW1lbnQsIHNyb290LnF1ZXJ5U2VsZWN0b3IoJy5hY3Rpb25zJykpXG5cdFx0dGhpcy5jb250ZW50ID0gY3NfY2FzdChIVE1MRGl2RWxlbWVudCwgc3Jvb3QucXVlcnlTZWxlY3RvcignLmNvbnRlbnQnKSlcblx0XHR0aGlzLm9wZW5jbG9zZSA9IGNzX2Nhc3QoSFRNTFNwYW5FbGVtZW50LCBzcm9vdC5xdWVyeVNlbGVjdG9yKCcub3BlbmNsb3NlJykpXG5cdFx0dGhpcy5vcGVuY2xvc2Uub25jbGljayA9ICgpID0+IHtcblx0XHRcdHRoaXMudG9nZ2xlKCk7XG5cdFx0fVxuXHRcdHRoaXMubGFiZWwub25jbGljayA9IHRoaXMub3BlbmNsb3NlLm9uY2xpY2tcblx0XHR0aGlzLnRvZ2dsZSgpO1xuXHR9XG5cdFxuXHR0b2dnbGUoKVxuXHR7XG5cdFx0dGhpcy5vcGVuID0gIXRoaXMub3BlblxuXHRcdHRoaXMuY29udGVudC5zdHlsZS5oZWlnaHQgICAgID0gIXRoaXMub3BlbiA/ICcwcmVtJyA6ICdhdXRvJ1xuXHRcdHRoaXMub3BlbmNsb3NlLnRleHRDb250ZW50ICAgID0gIXRoaXMub3BlbiA/ICfilrwnIDogJ+KWsidcblx0XHRpZiAodGhpcy5vcGVuKVxuXHRcdHtcblx0XHRcdHRoaXMuY29udGVudC50ZXh0Q29udGVudCA9ICcnIC8vIHN2dW9sYSBsYSBzZXppb25lXG5cdFx0XHR0aGlzLm9ub3BlbigpXG5cdFx0fVxuXHR9XG5cdFxuXHRhc3luYyByZWZyZXNoKGxhYmVsOiBzdHJpbmcsIGFjdGlvbnM6IHN0cmluZykge1xuXHRcdHRoaXMubGFiZWwudGV4dENvbnRlbnQgPSBsYWJlbFxuXHRcdHRoaXMuYWN0aW9ucy50ZXh0Q29udGVudCA9IGFjdGlvbnNcblx0fVxuXHRcblx0YWRkRWxlbWVudFRvQ29udGVudEFyZWEoZTogSFRNTEVsZW1lbnQpXG5cdHtcblx0XHR0aGlzLmNvbnRlbnQuYXBwZW5kQ2hpbGQoZSlcblx0fVxufVxuXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ2NzLW9wZW4tY2xvc2Utc2VjdGlvbicsIE9wZW5DbG9zZVNlY3Rpb24pXG4iXX0=