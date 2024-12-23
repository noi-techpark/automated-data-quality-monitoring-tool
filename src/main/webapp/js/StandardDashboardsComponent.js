/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */
import { DatasetCardComponent } from './DatasetCardComponent.js';
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
            const box = new DatasetCardComponent();
            this.boxContainer.appendChild(box);
            box.refresh(dataset);
        }
    }
}
customElements.define('cs-standard-dashboards-element', StandardDashboardsComponent);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RhbmRhcmREYXNoYm9hcmRzQ29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdHlwZXNjcmlwdC9TdGFuZGFyZERhc2hib2FyZHNDb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHO0FBRUgsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDakUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUNyQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3JDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFFdkMsTUFBTSxPQUFPLDJCQUE0QixTQUFRLFdBQVc7SUFFM0QsS0FBSyxDQUFBO0lBRUwsWUFBWSxDQUFDO0lBRWI7UUFFQyxLQUFLLEVBQUUsQ0FBQTtRQUVQLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFBO1FBQ2hELElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHOzs7Ozs7OztHQVF0QixDQUFBO1FBQ0QsSUFBSSxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUE7UUFFbkYsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBR0QsS0FBSyxDQUFDLE9BQU87UUFFWixJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sTUFBTSxHQUFHLElBQUksTUFBTSxFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDckMsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsK0NBQStDLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDM0UsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDakIsS0FBSyxJQUFJLE9BQU8sSUFBSSxJQUFJLEVBQ3hCLENBQUM7WUFDQSxNQUFNLEdBQUcsR0FBRyxJQUFJLG9CQUFvQixFQUFFLENBQUM7WUFDdkMsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUE7WUFDbEMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUNyQixDQUFDO0lBRUYsQ0FBQztDQUNEO0FBRUQsY0FBYyxDQUFDLE1BQU0sQ0FBQyxnQ0FBZ0MsRUFBRSwyQkFBMkIsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIChDKSAyMDI0IENhdGNoIFNvbHZlIGRpIERhdmlkZSBNb250ZXNpblxuICogTGljZW5zZTogQUdQTFxuICovXG5cbmltcG9ydCB7IERhdGFzZXRDYXJkQ29tcG9uZW50IH0gZnJvbSAnLi9EYXRhc2V0Q2FyZENvbXBvbmVudC5qcyc7XG5pbXBvcnQgeyBMb2FkZXIgfSBmcm9tICcuL0xvYWRlci5qcyc7XG5pbXBvcnQgeyBBUEkzIH0gZnJvbSAnLi9hcGkvYXBpMy5qcyc7XG5pbXBvcnQgeyBjc19jYXN0IH0gZnJvbSAnLi9xdWFsaXR5LmpzJztcblxuZXhwb3J0IGNsYXNzIFN0YW5kYXJkRGFzaGJvYXJkc0NvbXBvbmVudCBleHRlbmRzIEhUTUxFbGVtZW50XG57XG5cdHNyb290XG5cdFxuXHRib3hDb250YWluZXI7XG5cblx0Y29uc3RydWN0b3IoKVxuXHR7XG5cdFx0c3VwZXIoKVxuXHRcdFxuXHRcdHRoaXMuc3Jvb3QgPSB0aGlzLmF0dGFjaFNoYWRvdyh7IG1vZGU6ICdvcGVuJyB9KVxuXHRcdHRoaXMuc3Jvb3QuaW5uZXJIVE1MID0gYFxuXHRcdFx0PGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIGhyZWY9XCJpbmRleC5jc3NcIj5cblx0XHRcdDxkaXYgY2xhc3M9XCJQcm9qZWN0c0VsZW1lbnRcIj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cInRpdGxlXCIgc3R5bGU9XCJwYWRkaW5nOiAxcmVtXCI+c3RhbmRhcmQgZGFzaGJvYXJkczwvZGl2PlxuXHRcdFx0XHQ8aW5wdXQ+XG5cdFx0XHRcdDwhLS0gPGltZyBzcmM9XCJkYXNoaXRlbXMucG5nXCIgc3R5bGU9XCJtYXgtd2lkdGg6IDEwMCVcIj4gLS0+IFxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cblx0XHRgXG5cdFx0dGhpcy5ib3hDb250YWluZXIgPSBjc19jYXN0KEhUTUxEaXZFbGVtZW50LCB0aGlzLnNyb290LnF1ZXJ5U2VsZWN0b3IoJy5jb250YWluZXInKSlcblxuXHRcdHRoaXMuYm94Q29udGFpbmVyLnRleHRDb250ZW50ID0gKFwibG9hZGluZyAuLi5cIik7XG5cdH1cblx0XG5cblx0YXN5bmMgcmVmcmVzaCgpXG5cdHtcblx0XHR0aGlzLmJveENvbnRhaW5lci50ZXh0Q29udGVudCA9ICgnJyk7XG5cdFx0Y29uc3QgbG9hZGVyID0gbmV3IExvYWRlcigpO1xuXHRcdHRoaXMuYm94Q29udGFpbmVyLmFwcGVuZENoaWxkKGxvYWRlcilcblx0XHRjb25zdCBqc29uID0gYXdhaXQgQVBJMy5saXN0X19jYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X21heF90c192dyh7fSlcblx0XHRsb2FkZXIucmVtb3ZlKCk7XG5cdFx0Y29uc29sZS5sb2coanNvbilcblx0XHRmb3IgKGxldCBkYXRhc2V0IG9mIGpzb24pXG5cdFx0e1xuXHRcdFx0Y29uc3QgYm94ID0gbmV3IERhdGFzZXRDYXJkQ29tcG9uZW50KCk7XG5cdFx0XHR0aGlzLmJveENvbnRhaW5lci5hcHBlbmRDaGlsZChib3gpXG5cdFx0XHRib3gucmVmcmVzaChkYXRhc2V0KVxuXHRcdH1cblx0XHRcblx0fSBcbn1cblxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCdjcy1zdGFuZGFyZC1kYXNoYm9hcmRzLWVsZW1lbnQnLCBTdGFuZGFyZERhc2hib2FyZHNDb21wb25lbnQpIl19