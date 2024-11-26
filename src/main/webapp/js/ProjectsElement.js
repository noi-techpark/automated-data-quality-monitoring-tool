/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */
import { Component } from './Component.js';
import { DataSetBoxComponent } from './DataSetBoxComponent.js';
import { Loader } from './Loader.js';
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
        const loader = new Loader();
        this.boxContainer.appendChild(loader);
        const json = await API3.list__catchsolve_noiodh__test_dataset_max_ts_vw({});
        await new Promise((s) => { setTimeout(s, 1000); });
        loader.remove();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJvamVjdHNFbGVtZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdHlwZXNjcmlwdC9Qcm9qZWN0c0VsZW1lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHO0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFBO0FBQ3hDLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQy9ELE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDckMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNyQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBRXZDLE1BQU0sT0FBTyxlQUFnQixTQUFRLFNBQVM7SUFFN0MsWUFBWSxDQUFDO0lBRWI7UUFFQyxLQUFLLEVBQUUsQ0FBQTtRQUVQLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHOzs7Ozs7OztHQVF4QixDQUFBO1FBQ0QsSUFBSSxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUE7UUFFckYsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBR0QsS0FBSyxDQUFDLE9BQU87UUFFWixJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sTUFBTSxHQUFHLElBQUksTUFBTSxFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDckMsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsK0NBQStDLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDM0UsTUFBTSxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUksVUFBVSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQSxDQUFBLENBQUMsQ0FBQyxDQUFBO1FBQ2pELE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNoQixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ2pCLEtBQUssSUFBSSxPQUFPLElBQUksSUFBSSxFQUN4QixDQUFDO1lBQ0EsTUFBTSxHQUFHLEdBQUcsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO1lBQ3RDLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBQ2xDLEdBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDckIsQ0FBQztRQUNEOzs7Ozs7Ozs7V0FTRztJQUNKLENBQUM7Q0FDRCIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAoQykgMjAyNCBDYXRjaCBTb2x2ZSBkaSBEYXZpZGUgTW9udGVzaW5cbiAqIExpY2Vuc2U6IEFHUExcbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudH0gZnJvbSAnLi9Db21wb25lbnQuanMnXG5pbXBvcnQgeyBEYXRhU2V0Qm94Q29tcG9uZW50IH0gZnJvbSAnLi9EYXRhU2V0Qm94Q29tcG9uZW50LmpzJztcbmltcG9ydCB7IExvYWRlciB9IGZyb20gJy4vTG9hZGVyLmpzJztcbmltcG9ydCB7IEFQSTMgfSBmcm9tICcuL2FwaS9hcGkzLmpzJztcbmltcG9ydCB7IGNzX2Nhc3QgfSBmcm9tICcuL3F1YWxpdHkuanMnO1xuXG5leHBvcnQgY2xhc3MgUHJvamVjdHNFbGVtZW50IGV4dGVuZHMgQ29tcG9uZW50XG57XG5cdGJveENvbnRhaW5lcjtcblxuXHRjb25zdHJ1Y3RvcigpXG5cdHtcblx0XHRzdXBlcigpXG5cdFx0XG5cdFx0dGhpcy5lbGVtZW50LmlubmVySFRNTCA9IGBcblx0XHRcdDxzdHlsZT5cblx0XHRcdFx0XG5cdFx0XHQ8L3N0eWxlPlxuXHRcdFx0PGRpdiBjbGFzcz1cInRpdGxlXCI+c3RhbmRhcmQgZGFzaGJvYXJkczwvZGl2PlxuXHRcdFx0PGlucHV0PlxuXHRcdFx0PCEtLSA8aW1nIHNyYz1cImRhc2hpdGVtcy5wbmdcIiBzdHlsZT1cIm1heC13aWR0aDogMTAwJVwiPiAtLT4gXG5cdFx0XHQ8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+PC9kaXY+XG5cdFx0YFxuXHRcdHRoaXMuYm94Q29udGFpbmVyID0gY3NfY2FzdChIVE1MRGl2RWxlbWVudCwgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250YWluZXInKSlcblxuXHRcdHRoaXMuYm94Q29udGFpbmVyLnRleHRDb250ZW50ID0gKFwibG9hZGluZyAuLi5cIik7XG5cdH1cblx0XG5cblx0YXN5bmMgcmVmcmVzaCgpXG5cdHtcblx0XHR0aGlzLmJveENvbnRhaW5lci50ZXh0Q29udGVudCA9ICgnJyk7XG5cdFx0Y29uc3QgbG9hZGVyID0gbmV3IExvYWRlcigpO1xuXHRcdHRoaXMuYm94Q29udGFpbmVyLmFwcGVuZENoaWxkKGxvYWRlcilcblx0XHRjb25zdCBqc29uID0gYXdhaXQgQVBJMy5saXN0X19jYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X21heF90c192dyh7fSlcblx0XHRhd2FpdCBuZXcgUHJvbWlzZSgocykgPT4gIHsgc2V0VGltZW91dChzLCAxMDAwKX0pXG5cdFx0bG9hZGVyLnJlbW92ZSgpO1xuXHRcdGNvbnNvbGUubG9nKGpzb24pXG5cdFx0Zm9yIChsZXQgZGF0YXNldCBvZiBqc29uKVxuXHRcdHtcblx0XHRcdGNvbnN0IGJveCA9IG5ldyBEYXRhU2V0Qm94Q29tcG9uZW50KCk7XG5cdFx0XHR0aGlzLmJveENvbnRhaW5lci5hcHBlbmRDaGlsZChib3gpXG5cdFx0XHRib3gucmVmcmVzaChkYXRhc2V0KVxuXHRcdH1cblx0XHQvKlxuXHRcdGNvbnN0IHJlc3AgPSBhd2FpdCBBUEkuZ2V0X2RhdGFzZXRfbGlzdCh7fSlcblx0XHR0aGlzLmJveENvbnRhaW5lci50ZXh0Q29udGVudCA9ICgnJyk7XG5cdFx0Zm9yIChsZXQgZGF0YXNldCBvZiByZXNwLkl0ZW1zKVxuXHRcdHtcblx0XHRcdGNvbnN0IGJveCA9IG5ldyBEYXRhU2V0Qm94Q29tcG9uZW50KCk7XG5cdFx0XHR0aGlzLmJveENvbnRhaW5lci5hcHBlbmRDaGlsZChib3gpXG5cdFx0XHRib3gucmVmcmVzaChkYXRhc2V0KVxuXHRcdH1cblx0XHQgKi9cblx0fSBcbn1cbiJdfQ==