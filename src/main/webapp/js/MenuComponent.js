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
export class MenuComponent extends HTMLElement {
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
customElements.define('cs-menu-element', MenuComponent);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWVudUNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3R5cGVzY3JpcHQvTWVudUNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ3JDLE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDbkMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUV2Qzs7Ozs7OztHQU9HO0FBRUgsTUFBTSxPQUFPLGFBQWMsU0FBUSxXQUFXO0lBRTdDLEtBQUssQ0FBQTtJQUNMLFFBQVEsQ0FBQTtJQUVSLGNBQWMsR0FBOEIsRUFBRSxDQUFBO0lBRTlDLGlCQUFpQixDQUFBO0lBRWpCO1FBRUMsS0FBSyxFQUFFLENBQUE7UUFDUCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQTtRQUNoRCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXNCdEIsQ0FBQztRQUNGLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1FBQy9FLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQTtRQUN6RSxJQUFJLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQTtRQUMvQixLQUFLLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRSxHQUFHLFFBQVEsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFBLENBQUEsQ0FBQyxDQUFBO1FBRTNDLElBQUksYUFBZ0MsQ0FBQTtRQUNwQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDNUQsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLCtDQUErQyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQzdFLE1BQU0sTUFBTSxHQUFHLElBQUksTUFBTSxFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDOUIsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDaEMsS0FBSyxJQUFJLE9BQU8sSUFBSSxJQUFJLEVBQ3hCLENBQUM7Z0JBQ0EsTUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDcEQsYUFBYSxDQUFDLFdBQVcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDbkQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEdBQUcsYUFBYSxDQUFBO2dCQUN6RCxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDekMsYUFBYSxDQUFDLE9BQU8sR0FBRyxHQUFHLEVBQUU7b0JBQzVCLFFBQVEsQ0FBQyxJQUFJLEdBQUcsMEJBQTBCO3dCQUMxQixnQkFBZ0IsR0FBRyxPQUFPLENBQUMsWUFBWTt3QkFDbkQsb0JBQW9CLEdBQUcsT0FBTyxDQUFDLGdCQUFnQjswQkFDN0Msa0JBQWtCLEdBQUcsT0FBTyxDQUFDLGNBQWM7MEJBQzNDLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUE7Z0JBRWxELENBQUMsQ0FBQTtZQUNGLENBQUM7WUFDRCxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDaEIsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ3BCLENBQUMsQ0FBQyxDQUFBO0lBRUgsQ0FBQztJQUVELEtBQUssQ0FBQyxPQUFPO0lBRWIsQ0FBQztJQUVELEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBWTtRQUU1QixNQUFNLElBQUksQ0FBQyxpQkFBaUIsQ0FBQTtRQUM1QixLQUFLLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQ2pDLENBQUM7WUFDQSxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ25DLElBQUksSUFBSSxJQUFJLENBQUM7Z0JBQ1osSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUE7O2dCQUU5QixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQTtRQUNuQyxDQUFDO0lBQ0YsQ0FBQztDQUNEO0FBRUQsY0FBYyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSxhQUFhLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAoQykgMjAyNCBDYXRjaCBTb2x2ZSBkaSBEYXZpZGUgTW9udGVzaW5cbiAqIExpY2Vuc2U6IEFHUExcbiAqL1xuXG5pbXBvcnQgeyBMb2FkZXIgfSBmcm9tICcuL0xvYWRlci5qcyc7XG5pbXBvcnQge0FQSTN9IGZyb20gJy4vYXBpL2FwaTMuanMnO1xuaW1wb3J0IHsgY3NfY2FzdCB9IGZyb20gJy4vcXVhbGl0eS5qcyc7XG5cbi8qXG5cbi8vIGluIHRoZSBjdXN0b20gZWxlbWVudCBjbGFzczpcbnRoaXMuc2hhZG93Um9vdC5hZG9wdGVkU3R5bGVTaGVldHMgPSBbLi4uZG9jdW1lbnQuYWRvcHRlZFN0eWxlU2hlZXRzLCBteUN1c3RvbVNoZWV0XTtcblxuaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjg2NjQyMDcvaW1wb3J0aW5nLXN0eWxlcy1pbnRvLWEtd2ViLWNvbXBvbmVudFxuXG4gKi9cblxuZXhwb3J0IGNsYXNzIE1lbnVDb21wb25lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudFxue1xuXHRzcm9vdFxuXHRzdWJtZW51c1xuXHRcblx0bWVudWl0ZW1CeU5hbWU6IHtbazpzdHJpbmddOiBIVE1MRWxlbWVudH0gPSB7fVxuXHRcblx0bWVudXJlYWR5X3Byb21pc2Vcblx0XG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXHRcdHN1cGVyKClcblx0XHR0aGlzLnNyb290ID0gdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSlcblx0XHR0aGlzLnNyb290LmlubmVySFRNTCA9IGBcblx0XHRcdDxzdHlsZT5cblxuXHRcdFx0XHQudGl0bGUge1xuXHRcdFx0XHRcdHBhZGRpbmc6IDAuNHJlbTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGRpdi5zdWJtZW51cyB7XG5cdFx0XHRcdFx0cGFkZGluZy1sZWZ0OiAxcmVtO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGRpdi5zdWJtZW51cyA+ICoge1xuXHRcdFx0XHRcdG1hcmdpbjogIDAuNHJlbTtcblx0XHRcdFx0XHRwYWRkaW5nOiAwLjJyZW07XG5cdFx0XHRcdFx0Y3Vyc29yOiBwb2ludGVyO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC5zZWxlY3RlZCB7XG5cdFx0XHRcdFx0YmFja2dyb3VuZDogIzY2Njtcblx0XHRcdFx0XHRjb2xvcjogd2hpdGU7XG5cdFx0XHRcdH1cblx0XHRcdDwvc3R5bGU+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwidGl0bGVcIj7ilrIgc3RhbmRhcmQgZGFzaGJvYXJkczwvZGl2PlxuXHRcdFx0PGRpdiBjbGFzcz1cInN1Ym1lbnVzXCI+PC9kaXY+XG5cdFx0YDtcblx0XHR0aGlzLnN1Ym1lbnVzID0gY3NfY2FzdChIVE1MRWxlbWVudCwgdGhpcy5zcm9vdC5xdWVyeVNlbGVjdG9yKCdkaXYuc3VibWVudXMnKSk7XG5cdFx0Y29uc3QgdGl0bGUgPSBjc19jYXN0KEhUTUxFbGVtZW50LCB0aGlzLnNyb290LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi50aXRsZScpKVxuXHRcdHRoaXMubWVudWl0ZW1CeU5hbWVbJyddID0gdGl0bGVcblx0XHR0aXRsZS5vbmNsaWNrID0gKCkgPT4geyBsb2NhdGlvbi5oYXNoID0gJyd9XG5cblx0XHRsZXQgbWVudXJlYWR5X2Z1bjogKHg6IG51bGwpID0+IHZvaWRcblx0XHR0aGlzLm1lbnVyZWFkeV9wcm9taXNlID0gbmV3IFByb21pc2UocyA9PiBtZW51cmVhZHlfZnVuID0gcylcblx0XHRjb25zdCBqc29uX3Byb21pc2UgPSBBUEkzLmxpc3RfX2NhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfbWF4X3RzX3Z3KHt9KVxuXHRcdGNvbnN0IGxvYWRlciA9IG5ldyBMb2FkZXIoKTtcblx0XHR0aGlzLnNyb290LmFwcGVuZENoaWxkKGxvYWRlcilcblx0XHRqc29uX3Byb21pc2UudGhlbihhc3luYyAoanNvbikgPT4ge1xuXHRcdFx0Zm9yIChsZXQgZGF0YXNldCBvZiBqc29uKVxuXHRcdFx0e1xuXHRcdFx0XHRjb25zdCBtZW51MV9zdWJtZW51ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRcdG1lbnUxX3N1Ym1lbnUudGV4dENvbnRlbnQgPSAoZGF0YXNldC5kYXRhc2V0X25hbWUpO1xuXHRcdFx0XHR0aGlzLm1lbnVpdGVtQnlOYW1lW2RhdGFzZXQuZGF0YXNldF9uYW1lXSA9IG1lbnUxX3N1Ym1lbnVcblx0XHRcdFx0dGhpcy5zdWJtZW51cy5hcHBlbmRDaGlsZChtZW51MV9zdWJtZW51KTtcblx0XHRcdFx0bWVudTFfc3VibWVudS5vbmNsaWNrID0gKCkgPT4ge1xuXHRcdFx0XHRcdGxvY2F0aW9uLmhhc2ggPSAnI3BhZ2U9ZGF0YXNldC1jYXRlZ29yaWVzJyArXG5cdFx0XHRcdFx0ICAgICAgICAgICAgICAgICcmZGF0YXNldF9uYW1lPScgKyBkYXRhc2V0LmRhdGFzZXRfbmFtZSArIFxuXHRcdFx0XHRcdFx0XHRcdFx0JyZzZXNzaW9uX3N0YXJ0X3RzPScgKyBkYXRhc2V0LnNlc3Npb25fc3RhcnRfdHMgXG5cdFx0XHRcdFx0XHRcdFx0XHQrIFwiJmZhaWxlZF9yZWNvcmRzPVwiICsgZGF0YXNldC5mYWlsZWRfcmVjb3Jkc1xuXHRcdFx0XHRcdFx0XHRcdFx0KyBcIiZ0ZXN0ZWRfcmVjb3Jkcz1cIiArIGRhdGFzZXQudGVzdGVkX3JlY29yZHNcblxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRsb2FkZXIucmVtb3ZlKCk7XG5cdFx0XHRtZW51cmVhZHlfZnVuKG51bGwpXG5cdFx0fSlcblxuXHR9XG5cdFxuXHRhc3luYyByZWZyZXNoKClcblx0e1xuXHR9XG5cdFxuXHRhc3luYyBzZWxlY3RJdGVtKG5hbWU6IHN0cmluZylcblx0e1xuXHRcdGF3YWl0IHRoaXMubWVudXJlYWR5X3Byb21pc2Vcblx0XHRmb3IgKGxldCBrIGluIHRoaXMubWVudWl0ZW1CeU5hbWUpXG5cdFx0e1xuXHRcdFx0Y29uc3QgaXRlbSA9IHRoaXMubWVudWl0ZW1CeU5hbWVba11cblx0XHRcdGlmIChuYW1lID09IGspXG5cdFx0XHRcdGl0ZW0uY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJylcblx0XHR9XG5cdH1cbn1cblxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCdjcy1tZW51LWVsZW1lbnQnLCBNZW51Q29tcG9uZW50KVxuIl19