/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */
import { DataSetBoxComponent } from './DataSetBoxComponent.js';
import { Loader } from './Loader.js';
import { API3 } from './api/api3.js';
import { cs_cast } from './quality.js';
export class StandardDashboardsComponent extends HTMLElement {
    sroot;
    boxContainer;
    constructor() {
        super();
        this.sroot = this.attachShadow({ mode: 'open' });
        this.sroot.innerHTML = `
			<link rel="stylesheet" href="index.css">
			<div class="ProjectsElement">
				<div class="title" style="padding: 1rem">standard dashboards</div>
				<input>
				<!-- <img src="dashitems.png" style="max-width: 100%"> --> 
				<div class="container"></div>
			</div>
		`;
        this.boxContainer = cs_cast(HTMLDivElement, this.sroot.querySelector('.container'));
        this.boxContainer.textContent = ("loading ...");
    }
    async refresh() {
        this.boxContainer.textContent = ('');
        const loader = new Loader();
        this.boxContainer.appendChild(loader);
        const json = await API3.list__catchsolve_noiodh__test_dataset_max_ts_vw({});
        loader.remove();
        console.log(json);
        for (let dataset of json) {
            const box = new DataSetBoxComponent();
            this.boxContainer.appendChild(box);
            box.refresh(dataset);
        }
    }
}
customElements.define('cs-standard-dashboards-element', StandardDashboardsComponent);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RhbmRhcmREYXNoYm9hcmRzQ29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdHlwZXNjcmlwdC9TdGFuZGFyZERhc2hib2FyZHNDb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHO0FBR0gsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDL0QsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUNyQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3JDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFFdkMsTUFBTSxPQUFPLDJCQUE0QixTQUFRLFdBQVc7SUFFM0QsS0FBSyxDQUFBO0lBRUwsWUFBWSxDQUFDO0lBRWI7UUFFQyxLQUFLLEVBQUUsQ0FBQTtRQUVQLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFBO1FBQ2hELElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHOzs7Ozs7OztHQVF0QixDQUFBO1FBQ0QsSUFBSSxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUE7UUFFbkYsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBR0QsS0FBSyxDQUFDLE9BQU87UUFFWixJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sTUFBTSxHQUFHLElBQUksTUFBTSxFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDckMsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsK0NBQStDLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDM0UsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDakIsS0FBSyxJQUFJLE9BQU8sSUFBSSxJQUFJLEVBQ3hCLENBQUM7WUFDQSxNQUFNLEdBQUcsR0FBRyxJQUFJLG1CQUFtQixFQUFFLENBQUM7WUFDdEMsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUE7WUFDbEMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUNyQixDQUFDO0lBRUYsQ0FBQztDQUNEO0FBRUQsY0FBYyxDQUFDLE1BQU0sQ0FBQyxnQ0FBZ0MsRUFBRSwyQkFBMkIsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIChDKSAyMDI0IENhdGNoIFNvbHZlIGRpIERhdmlkZSBNb250ZXNpblxuICogTGljZW5zZTogQUdQTFxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50fSBmcm9tICcuL0NvbXBvbmVudC5qcydcbmltcG9ydCB7IERhdGFTZXRCb3hDb21wb25lbnQgfSBmcm9tICcuL0RhdGFTZXRCb3hDb21wb25lbnQuanMnO1xuaW1wb3J0IHsgTG9hZGVyIH0gZnJvbSAnLi9Mb2FkZXIuanMnO1xuaW1wb3J0IHsgQVBJMyB9IGZyb20gJy4vYXBpL2FwaTMuanMnO1xuaW1wb3J0IHsgY3NfY2FzdCB9IGZyb20gJy4vcXVhbGl0eS5qcyc7XG5cbmV4cG9ydCBjbGFzcyBTdGFuZGFyZERhc2hib2FyZHNDb21wb25lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudFxue1xuXHRzcm9vdFxuXHRcblx0Ym94Q29udGFpbmVyO1xuXG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXHRcdHN1cGVyKClcblx0XHRcblx0XHR0aGlzLnNyb290ID0gdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSlcblx0XHR0aGlzLnNyb290LmlubmVySFRNTCA9IGBcblx0XHRcdDxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiBocmVmPVwiaW5kZXguY3NzXCI+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwiUHJvamVjdHNFbGVtZW50XCI+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJ0aXRsZVwiIHN0eWxlPVwicGFkZGluZzogMXJlbVwiPnN0YW5kYXJkIGRhc2hib2FyZHM8L2Rpdj5cblx0XHRcdFx0PGlucHV0PlxuXHRcdFx0XHQ8IS0tIDxpbWcgc3JjPVwiZGFzaGl0ZW1zLnBuZ1wiIHN0eWxlPVwibWF4LXdpZHRoOiAxMDAlXCI+IC0tPiBcblx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPjwvZGl2PlxuXHRcdFx0PC9kaXY+XG5cdFx0YFxuXHRcdHRoaXMuYm94Q29udGFpbmVyID0gY3NfY2FzdChIVE1MRGl2RWxlbWVudCwgdGhpcy5zcm9vdC5xdWVyeVNlbGVjdG9yKCcuY29udGFpbmVyJykpXG5cblx0XHR0aGlzLmJveENvbnRhaW5lci50ZXh0Q29udGVudCA9IChcImxvYWRpbmcgLi4uXCIpO1xuXHR9XG5cdFxuXG5cdGFzeW5jIHJlZnJlc2goKVxuXHR7XG5cdFx0dGhpcy5ib3hDb250YWluZXIudGV4dENvbnRlbnQgPSAoJycpO1xuXHRcdGNvbnN0IGxvYWRlciA9IG5ldyBMb2FkZXIoKTtcblx0XHR0aGlzLmJveENvbnRhaW5lci5hcHBlbmRDaGlsZChsb2FkZXIpXG5cdFx0Y29uc3QganNvbiA9IGF3YWl0IEFQSTMubGlzdF9fY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9tYXhfdHNfdncoe30pXG5cdFx0bG9hZGVyLnJlbW92ZSgpO1xuXHRcdGNvbnNvbGUubG9nKGpzb24pXG5cdFx0Zm9yIChsZXQgZGF0YXNldCBvZiBqc29uKVxuXHRcdHtcblx0XHRcdGNvbnN0IGJveCA9IG5ldyBEYXRhU2V0Qm94Q29tcG9uZW50KCk7XG5cdFx0XHR0aGlzLmJveENvbnRhaW5lci5hcHBlbmRDaGlsZChib3gpXG5cdFx0XHRib3gucmVmcmVzaChkYXRhc2V0KVxuXHRcdH1cblx0XHRcblx0fSBcbn1cblxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCdjcy1zdGFuZGFyZC1kYXNoYm9hcmRzLWVsZW1lbnQnLCBTdGFuZGFyZERhc2hib2FyZHNDb21wb25lbnQpIl19