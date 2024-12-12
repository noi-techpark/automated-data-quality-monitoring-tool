/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */
import { Loader } from './Loader.js';
import { API3 } from './api/api3.js';
import { cs_cast } from './quality.js';
/*

// in the custom element class:
this.shadowRoot.adoptedStyleSheets = [...document.adoptedStyleSheets, myCustomSheet];

https://stackoverflow.com/questions/28664207/importing-styles-into-a-web-component

 */
export class MenuElement extends HTMLElement {
    sroot;
    submenus;
    menuitemByName = {};
    menuready_promise;
    constructor() {
        super();
        this.sroot = this.attachShadow({ mode: 'open' });
        this.sroot.innerHTML = `
			<style>

				.title {
					padding: 0.4rem;
				}

				div.submenus {
					padding-left: 1rem;
				}
				div.submenus > * {
					margin:  0.4rem;
					padding: 0.2rem;
					cursor: pointer;
				}
				.selected {
					background: #666;
					color: white;
				}
			</style>
			<div class="title">▲ standard dashboards</div>
			<div class="submenus"></div>
		`;
        this.submenus = cs_cast(HTMLElement, this.sroot.querySelector('div.submenus'));
        const title = cs_cast(HTMLElement, this.sroot.querySelector('div.title'));
        this.menuitemByName[''] = title;
        title.onclick = () => { location.hash = ''; };
        let menuready_fun;
        this.menuready_promise = new Promise(s => menuready_fun = s);
        const json_promise = API3.list__catchsolve_noiodh__test_dataset_max_ts_vw({});
        const loader = new Loader();
        this.sroot.appendChild(loader);
        json_promise.then(async (json) => {
            for (let dataset of json) {
                const menu1_submenu = document.createElement('div');
                menu1_submenu.textContent = (dataset.dataset_name);
                this.menuitemByName[dataset.dataset_name] = menu1_submenu;
                this.submenus.appendChild(menu1_submenu);
                menu1_submenu.onclick = () => {
                    location.hash = '#page=dataset-categories' +
                        '&dataset_name=' + dataset.dataset_name +
                        '&session_start_ts=' + dataset.session_start_ts
                        + "&failed_records=" + dataset.failed_records
                        + "&tested_records=" + dataset.tested_records;
                };
            }
            loader.remove();
            menuready_fun(null);
        });
    }
    async refresh() {
    }
    async selectItem(name) {
        await this.menuready_promise;
        for (let k in this.menuitemByName) {
            const item = this.menuitemByName[k];
            if (name == k)
                item.classList.add('selected');
            else
                item.classList.remove('selected');
        }
    }
}
customElements.define('cs-menu-element', MenuElement);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWVudUVsZW1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90eXBlc2NyaXB0L01lbnVFbGVtZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7R0FHRztBQUVILE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDckMsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNuQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBRXZDOzs7Ozs7O0dBT0c7QUFFSCxNQUFNLE9BQU8sV0FBWSxTQUFRLFdBQVc7SUFFM0MsS0FBSyxDQUFBO0lBQ0wsUUFBUSxDQUFBO0lBRVIsY0FBYyxHQUE4QixFQUFFLENBQUE7SUFFOUMsaUJBQWlCLENBQUE7SUFFakI7UUFFQyxLQUFLLEVBQUUsQ0FBQTtRQUNQLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFBO1FBQ2hELElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBc0J0QixDQUFDO1FBQ0YsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7UUFDL0UsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFBO1FBQ3pFLElBQUksQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFBO1FBQy9CLEtBQUssQ0FBQyxPQUFPLEdBQUcsR0FBRyxFQUFFLEdBQUcsUUFBUSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUEsQ0FBQSxDQUFDLENBQUE7UUFFM0MsSUFBSSxhQUFnQyxDQUFBO1FBQ3BDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsQ0FBQTtRQUM1RCxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsK0NBQStDLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDN0UsTUFBTSxNQUFNLEdBQUcsSUFBSSxNQUFNLEVBQUUsQ0FBQztRQUM1QixJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUM5QixZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUNoQyxLQUFLLElBQUksT0FBTyxJQUFJLElBQUksRUFDeEIsQ0FBQztnQkFDQSxNQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNwRCxhQUFhLENBQUMsV0FBVyxHQUFHLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUNuRCxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxhQUFhLENBQUE7Z0JBQ3pELElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUN6QyxhQUFhLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRTtvQkFDNUIsUUFBUSxDQUFDLElBQUksR0FBRywwQkFBMEI7d0JBQzFCLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxZQUFZO3dCQUNuRCxvQkFBb0IsR0FBRyxPQUFPLENBQUMsZ0JBQWdCOzBCQUM3QyxrQkFBa0IsR0FBRyxPQUFPLENBQUMsY0FBYzswQkFDM0Msa0JBQWtCLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQTtnQkFFbEQsQ0FBQyxDQUFBO1lBQ0YsQ0FBQztZQUNELE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNoQixhQUFhLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDcEIsQ0FBQyxDQUFDLENBQUE7SUFFSCxDQUFDO0lBRUQsS0FBSyxDQUFDLE9BQU87SUFFYixDQUFDO0lBRUQsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFZO1FBRTVCLE1BQU0sSUFBSSxDQUFDLGlCQUFpQixDQUFBO1FBQzVCLEtBQUssSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLGNBQWMsRUFDakMsQ0FBQztZQUNBLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDbkMsSUFBSSxJQUFJLElBQUksQ0FBQztnQkFDWixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQTs7Z0JBRTlCLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFBO1FBQ25DLENBQUM7SUFDRixDQUFDO0NBQ0Q7QUFFRCxjQUFjLENBQUMsTUFBTSxDQUFDLGlCQUFpQixFQUFFLFdBQVcsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIChDKSAyMDI0IENhdGNoIFNvbHZlIGRpIERhdmlkZSBNb250ZXNpblxuICogTGljZW5zZTogQUdQTFxuICovXG5cbmltcG9ydCB7IExvYWRlciB9IGZyb20gJy4vTG9hZGVyLmpzJztcbmltcG9ydCB7QVBJM30gZnJvbSAnLi9hcGkvYXBpMy5qcyc7XG5pbXBvcnQgeyBjc19jYXN0IH0gZnJvbSAnLi9xdWFsaXR5LmpzJztcblxuLypcblxuLy8gaW4gdGhlIGN1c3RvbSBlbGVtZW50IGNsYXNzOlxudGhpcy5zaGFkb3dSb290LmFkb3B0ZWRTdHlsZVNoZWV0cyA9IFsuLi5kb2N1bWVudC5hZG9wdGVkU3R5bGVTaGVldHMsIG15Q3VzdG9tU2hlZXRdO1xuXG5odHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yODY2NDIwNy9pbXBvcnRpbmctc3R5bGVzLWludG8tYS13ZWItY29tcG9uZW50XG5cbiAqL1xuXG5leHBvcnQgY2xhc3MgTWVudUVsZW1lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudFxue1xuXHRzcm9vdFxuXHRzdWJtZW51c1xuXHRcblx0bWVudWl0ZW1CeU5hbWU6IHtbazpzdHJpbmddOiBIVE1MRWxlbWVudH0gPSB7fVxuXHRcblx0bWVudXJlYWR5X3Byb21pc2Vcblx0XG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXHRcdHN1cGVyKClcblx0XHR0aGlzLnNyb290ID0gdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSlcblx0XHR0aGlzLnNyb290LmlubmVySFRNTCA9IGBcblx0XHRcdDxzdHlsZT5cblxuXHRcdFx0XHQudGl0bGUge1xuXHRcdFx0XHRcdHBhZGRpbmc6IDAuNHJlbTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGRpdi5zdWJtZW51cyB7XG5cdFx0XHRcdFx0cGFkZGluZy1sZWZ0OiAxcmVtO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGRpdi5zdWJtZW51cyA+ICoge1xuXHRcdFx0XHRcdG1hcmdpbjogIDAuNHJlbTtcblx0XHRcdFx0XHRwYWRkaW5nOiAwLjJyZW07XG5cdFx0XHRcdFx0Y3Vyc29yOiBwb2ludGVyO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC5zZWxlY3RlZCB7XG5cdFx0XHRcdFx0YmFja2dyb3VuZDogIzY2Njtcblx0XHRcdFx0XHRjb2xvcjogd2hpdGU7XG5cdFx0XHRcdH1cblx0XHRcdDwvc3R5bGU+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwidGl0bGVcIj7ilrIgc3RhbmRhcmQgZGFzaGJvYXJkczwvZGl2PlxuXHRcdFx0PGRpdiBjbGFzcz1cInN1Ym1lbnVzXCI+PC9kaXY+XG5cdFx0YDtcblx0XHR0aGlzLnN1Ym1lbnVzID0gY3NfY2FzdChIVE1MRWxlbWVudCwgdGhpcy5zcm9vdC5xdWVyeVNlbGVjdG9yKCdkaXYuc3VibWVudXMnKSk7XG5cdFx0Y29uc3QgdGl0bGUgPSBjc19jYXN0KEhUTUxFbGVtZW50LCB0aGlzLnNyb290LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi50aXRsZScpKVxuXHRcdHRoaXMubWVudWl0ZW1CeU5hbWVbJyddID0gdGl0bGVcblx0XHR0aXRsZS5vbmNsaWNrID0gKCkgPT4geyBsb2NhdGlvbi5oYXNoID0gJyd9XG5cblx0XHRsZXQgbWVudXJlYWR5X2Z1bjogKHg6IG51bGwpID0+IHZvaWRcblx0XHR0aGlzLm1lbnVyZWFkeV9wcm9taXNlID0gbmV3IFByb21pc2UocyA9PiBtZW51cmVhZHlfZnVuID0gcylcblx0XHRjb25zdCBqc29uX3Byb21pc2UgPSBBUEkzLmxpc3RfX2NhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfbWF4X3RzX3Z3KHt9KVxuXHRcdGNvbnN0IGxvYWRlciA9IG5ldyBMb2FkZXIoKTtcblx0XHR0aGlzLnNyb290LmFwcGVuZENoaWxkKGxvYWRlcilcblx0XHRqc29uX3Byb21pc2UudGhlbihhc3luYyAoanNvbikgPT4ge1xuXHRcdFx0Zm9yIChsZXQgZGF0YXNldCBvZiBqc29uKVxuXHRcdFx0e1xuXHRcdFx0XHRjb25zdCBtZW51MV9zdWJtZW51ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRcdG1lbnUxX3N1Ym1lbnUudGV4dENvbnRlbnQgPSAoZGF0YXNldC5kYXRhc2V0X25hbWUpO1xuXHRcdFx0XHR0aGlzLm1lbnVpdGVtQnlOYW1lW2RhdGFzZXQuZGF0YXNldF9uYW1lXSA9IG1lbnUxX3N1Ym1lbnVcblx0XHRcdFx0dGhpcy5zdWJtZW51cy5hcHBlbmRDaGlsZChtZW51MV9zdWJtZW51KTtcblx0XHRcdFx0bWVudTFfc3VibWVudS5vbmNsaWNrID0gKCkgPT4ge1xuXHRcdFx0XHRcdGxvY2F0aW9uLmhhc2ggPSAnI3BhZ2U9ZGF0YXNldC1jYXRlZ29yaWVzJyArXG5cdFx0XHRcdFx0ICAgICAgICAgICAgICAgICcmZGF0YXNldF9uYW1lPScgKyBkYXRhc2V0LmRhdGFzZXRfbmFtZSArIFxuXHRcdFx0XHRcdFx0XHRcdFx0JyZzZXNzaW9uX3N0YXJ0X3RzPScgKyBkYXRhc2V0LnNlc3Npb25fc3RhcnRfdHMgXG5cdFx0XHRcdFx0XHRcdFx0XHQrIFwiJmZhaWxlZF9yZWNvcmRzPVwiICsgZGF0YXNldC5mYWlsZWRfcmVjb3Jkc1xuXHRcdFx0XHRcdFx0XHRcdFx0KyBcIiZ0ZXN0ZWRfcmVjb3Jkcz1cIiArIGRhdGFzZXQudGVzdGVkX3JlY29yZHNcblxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRsb2FkZXIucmVtb3ZlKCk7XG5cdFx0XHRtZW51cmVhZHlfZnVuKG51bGwpXG5cdFx0fSlcblxuXHR9XG5cdFxuXHRhc3luYyByZWZyZXNoKClcblx0e1xuXHR9XG5cdFxuXHRhc3luYyBzZWxlY3RJdGVtKG5hbWU6IHN0cmluZylcblx0e1xuXHRcdGF3YWl0IHRoaXMubWVudXJlYWR5X3Byb21pc2Vcblx0XHRmb3IgKGxldCBrIGluIHRoaXMubWVudWl0ZW1CeU5hbWUpXG5cdFx0e1xuXHRcdFx0Y29uc3QgaXRlbSA9IHRoaXMubWVudWl0ZW1CeU5hbWVba11cblx0XHRcdGlmIChuYW1lID09IGspXG5cdFx0XHRcdGl0ZW0uY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJylcblx0XHR9XG5cdH1cbn1cblxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCdjcy1tZW51LWVsZW1lbnQnLCBNZW51RWxlbWVudClcbiJdfQ==