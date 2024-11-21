/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */
import { Component } from './Component.js';
import { DataSetBoxComponent } from './DataSetBoxComponent.js';
import { API3 } from './api/api3.js';
import { cs_cast } from './quality.js';
export class ProjectsElement extends Component {
    boxContainer;
    constructor() {
        super();
        this.element.innerHTML = `
			<style>
				
			</style>
			<div class="title">standard dashboards</div>
			<input>
			<!-- <img src="dashitems.png" style="max-width: 100%"> --> 
			<div class="container"></div>
		`;
        this.boxContainer = cs_cast(HTMLDivElement, this.element.querySelector('.container'));
        this.boxContainer.textContent = ("loading ...");
    }
    async refresh() {
        this.boxContainer.textContent = ('');
        const json = await API3.list__catchsolve_noiodh__test_dataset_max_ts_vw({});
        console.log(json);
        for (let dataset of json) {
            const box = new DataSetBoxComponent();
            this.boxContainer.appendChild(box);
            box.refresh(dataset);
        }
        /*
        const resp = await API.get_dataset_list({})
        this.boxContainer.textContent = ('');
        for (let dataset of resp.Items)
        {
            const box = new DataSetBoxComponent();
            this.boxContainer.appendChild(box)
            box.refresh(dataset)
        }
         */
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJvamVjdHNFbGVtZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdHlwZXNjcmlwdC9Qcm9qZWN0c0VsZW1lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHO0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFBO0FBQ3hDLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQy9ELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDckMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUV2QyxNQUFNLE9BQU8sZUFBZ0IsU0FBUSxTQUFTO0lBRTdDLFlBQVksQ0FBQztJQUViO1FBRUMsS0FBSyxFQUFFLENBQUE7UUFFUCxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRzs7Ozs7Ozs7R0FReEIsQ0FBQTtRQUNELElBQUksQ0FBQyxZQUFZLEdBQUcsT0FBTyxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFBO1FBRXJGLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUdELEtBQUssQ0FBQyxPQUFPO1FBRVosSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNyQyxNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQywrQ0FBK0MsQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUMzRSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ2pCLEtBQUssSUFBSSxPQUFPLElBQUksSUFBSSxFQUN4QixDQUFDO1lBQ0EsTUFBTSxHQUFHLEdBQUcsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO1lBQ3RDLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBQ2xDLEdBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDckIsQ0FBQztRQUNEOzs7Ozs7Ozs7V0FTRztJQUNKLENBQUM7Q0FDRCIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAoQykgMjAyNCBDYXRjaCBTb2x2ZSBkaSBEYXZpZGUgTW9udGVzaW5cbiAqIExpY2Vuc2U6IEFHUExcbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudH0gZnJvbSAnLi9Db21wb25lbnQuanMnXG5pbXBvcnQgeyBEYXRhU2V0Qm94Q29tcG9uZW50IH0gZnJvbSAnLi9EYXRhU2V0Qm94Q29tcG9uZW50LmpzJztcbmltcG9ydCB7IEFQSTMgfSBmcm9tICcuL2FwaS9hcGkzLmpzJztcbmltcG9ydCB7IGNzX2Nhc3QgfSBmcm9tICcuL3F1YWxpdHkuanMnO1xuXG5leHBvcnQgY2xhc3MgUHJvamVjdHNFbGVtZW50IGV4dGVuZHMgQ29tcG9uZW50XG57XG5cdGJveENvbnRhaW5lcjtcblxuXHRjb25zdHJ1Y3RvcigpXG5cdHtcblx0XHRzdXBlcigpXG5cdFx0XG5cdFx0dGhpcy5lbGVtZW50LmlubmVySFRNTCA9IGBcblx0XHRcdDxzdHlsZT5cblx0XHRcdFx0XG5cdFx0XHQ8L3N0eWxlPlxuXHRcdFx0PGRpdiBjbGFzcz1cInRpdGxlXCI+c3RhbmRhcmQgZGFzaGJvYXJkczwvZGl2PlxuXHRcdFx0PGlucHV0PlxuXHRcdFx0PCEtLSA8aW1nIHNyYz1cImRhc2hpdGVtcy5wbmdcIiBzdHlsZT1cIm1heC13aWR0aDogMTAwJVwiPiAtLT4gXG5cdFx0XHQ8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+PC9kaXY+XG5cdFx0YFxuXHRcdHRoaXMuYm94Q29udGFpbmVyID0gY3NfY2FzdChIVE1MRGl2RWxlbWVudCwgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250YWluZXInKSlcblxuXHRcdHRoaXMuYm94Q29udGFpbmVyLnRleHRDb250ZW50ID0gKFwibG9hZGluZyAuLi5cIik7XG5cdH1cblx0XG5cblx0YXN5bmMgcmVmcmVzaCgpXG5cdHtcblx0XHR0aGlzLmJveENvbnRhaW5lci50ZXh0Q29udGVudCA9ICgnJyk7XG5cdFx0Y29uc3QganNvbiA9IGF3YWl0IEFQSTMubGlzdF9fY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9tYXhfdHNfdncoe30pXG5cdFx0Y29uc29sZS5sb2coanNvbilcblx0XHRmb3IgKGxldCBkYXRhc2V0IG9mIGpzb24pXG5cdFx0e1xuXHRcdFx0Y29uc3QgYm94ID0gbmV3IERhdGFTZXRCb3hDb21wb25lbnQoKTtcblx0XHRcdHRoaXMuYm94Q29udGFpbmVyLmFwcGVuZENoaWxkKGJveClcblx0XHRcdGJveC5yZWZyZXNoKGRhdGFzZXQpXG5cdFx0fVxuXHRcdC8qXG5cdFx0Y29uc3QgcmVzcCA9IGF3YWl0IEFQSS5nZXRfZGF0YXNldF9saXN0KHt9KVxuXHRcdHRoaXMuYm94Q29udGFpbmVyLnRleHRDb250ZW50ID0gKCcnKTtcblx0XHRmb3IgKGxldCBkYXRhc2V0IG9mIHJlc3AuSXRlbXMpXG5cdFx0e1xuXHRcdFx0Y29uc3QgYm94ID0gbmV3IERhdGFTZXRCb3hDb21wb25lbnQoKTtcblx0XHRcdHRoaXMuYm94Q29udGFpbmVyLmFwcGVuZENoaWxkKGJveClcblx0XHRcdGJveC5yZWZyZXNoKGRhdGFzZXQpXG5cdFx0fVxuXHRcdCAqL1xuXHR9IFxufVxuIl19