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
			<div class="title">standard dashboards</div>
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
                    location.hash = '#page=dataset-categories' + '&dataset_name=' + dataset.dataset_name + "&session_start_ts=" + dataset.session_start_ts;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWVudUVsZW1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90eXBlc2NyaXB0L01lbnVFbGVtZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7R0FHRztBQUVILE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDckMsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNuQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBRXZDOzs7Ozs7O0dBT0c7QUFFSCxNQUFNLE9BQU8sV0FBWSxTQUFRLFdBQVc7SUFFM0MsS0FBSyxDQUFBO0lBQ0wsUUFBUSxDQUFBO0lBRVIsY0FBYyxHQUE4QixFQUFFLENBQUE7SUFFOUMsaUJBQWlCLENBQUE7SUFFakI7UUFFQyxLQUFLLEVBQUUsQ0FBQTtRQUNQLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFBO1FBQ2hELElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHOzs7Ozs7Ozs7Ozs7Ozs7OztHQWlCdEIsQ0FBQztRQUNGLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1FBQy9FLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQTtRQUN6RSxJQUFJLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQTtRQUMvQixLQUFLLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRSxHQUFHLFFBQVEsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFBLENBQUEsQ0FBQyxDQUFBO1FBRTNDLElBQUksYUFBZ0MsQ0FBQTtRQUNwQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDNUQsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLCtDQUErQyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQzdFLE1BQU0sTUFBTSxHQUFHLElBQUksTUFBTSxFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDOUIsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDaEMsS0FBSyxJQUFJLE9BQU8sSUFBSSxJQUFJLEVBQ3hCLENBQUM7Z0JBQ0EsTUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDcEQsYUFBYSxDQUFDLFdBQVcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDbkQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEdBQUcsYUFBYSxDQUFBO2dCQUN6RCxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDekMsYUFBYSxDQUFDLE9BQU8sR0FBRyxHQUFHLEVBQUU7b0JBQzVCLFFBQVEsQ0FBQyxJQUFJLEdBQUcsMEJBQTBCLEdBQUcsZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLFlBQVksR0FBRyxvQkFBb0IsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUE7Z0JBQ3ZJLENBQUMsQ0FBQTtZQUNGLENBQUM7WUFDRCxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDaEIsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ3BCLENBQUMsQ0FBQyxDQUFBO0lBRUgsQ0FBQztJQUVELEtBQUssQ0FBQyxPQUFPO0lBRWIsQ0FBQztJQUVELEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBWTtRQUU1QixNQUFNLElBQUksQ0FBQyxpQkFBaUIsQ0FBQTtRQUM1QixLQUFLLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQ2pDLENBQUM7WUFDQSxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ25DLElBQUksSUFBSSxJQUFJLENBQUM7Z0JBQ1osSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUE7O2dCQUU5QixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQTtRQUNuQyxDQUFDO0lBQ0YsQ0FBQztDQUNEO0FBRUQsY0FBYyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSxXQUFXLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAoQykgMjAyNCBDYXRjaCBTb2x2ZSBkaSBEYXZpZGUgTW9udGVzaW5cbiAqIExpY2Vuc2U6IEFHUExcbiAqL1xuXG5pbXBvcnQgeyBMb2FkZXIgfSBmcm9tICcuL0xvYWRlci5qcyc7XG5pbXBvcnQge0FQSTN9IGZyb20gJy4vYXBpL2FwaTMuanMnO1xuaW1wb3J0IHsgY3NfY2FzdCB9IGZyb20gJy4vcXVhbGl0eS5qcyc7XG5cbi8qXG5cbi8vIGluIHRoZSBjdXN0b20gZWxlbWVudCBjbGFzczpcbnRoaXMuc2hhZG93Um9vdC5hZG9wdGVkU3R5bGVTaGVldHMgPSBbLi4uZG9jdW1lbnQuYWRvcHRlZFN0eWxlU2hlZXRzLCBteUN1c3RvbVNoZWV0XTtcblxuaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjg2NjQyMDcvaW1wb3J0aW5nLXN0eWxlcy1pbnRvLWEtd2ViLWNvbXBvbmVudFxuXG4gKi9cblxuZXhwb3J0IGNsYXNzIE1lbnVFbGVtZW50IGV4dGVuZHMgSFRNTEVsZW1lbnRcbntcblx0c3Jvb3Rcblx0c3VibWVudXNcblx0XG5cdG1lbnVpdGVtQnlOYW1lOiB7W2s6c3RyaW5nXTogSFRNTEVsZW1lbnR9ID0ge31cblx0XG5cdG1lbnVyZWFkeV9wcm9taXNlXG5cdFxuXHRjb25zdHJ1Y3RvcigpXG5cdHtcblx0XHRzdXBlcigpXG5cdFx0dGhpcy5zcm9vdCA9IHRoaXMuYXR0YWNoU2hhZG93KHsgbW9kZTogJ29wZW4nIH0pXG5cdFx0dGhpcy5zcm9vdC5pbm5lckhUTUwgPSBgXG5cdFx0XHQ8c3R5bGU+XG5cdFx0XHRcdGRpdi5zdWJtZW51cyB7XG5cdFx0XHRcdFx0cGFkZGluZy1sZWZ0OiAxcmVtO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGRpdi5zdWJtZW51cyA+ICoge1xuXHRcdFx0XHRcdG1hcmdpbjogIDAuNHJlbTtcblx0XHRcdFx0XHRwYWRkaW5nOiAwLjJyZW07XG5cdFx0XHRcdFx0Y3Vyc29yOiBwb2ludGVyO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC5zZWxlY3RlZCB7XG5cdFx0XHRcdFx0YmFja2dyb3VuZDogIzY2Njtcblx0XHRcdFx0XHRjb2xvcjogd2hpdGU7XG5cdFx0XHRcdH1cblx0XHRcdDwvc3R5bGU+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwidGl0bGVcIj5zdGFuZGFyZCBkYXNoYm9hcmRzPC9kaXY+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwic3VibWVudXNcIj48L2Rpdj5cblx0XHRgO1xuXHRcdHRoaXMuc3VibWVudXMgPSBjc19jYXN0KEhUTUxFbGVtZW50LCB0aGlzLnNyb290LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi5zdWJtZW51cycpKTtcblx0XHRjb25zdCB0aXRsZSA9IGNzX2Nhc3QoSFRNTEVsZW1lbnQsIHRoaXMuc3Jvb3QucXVlcnlTZWxlY3RvcignZGl2LnRpdGxlJykpXG5cdFx0dGhpcy5tZW51aXRlbUJ5TmFtZVsnJ10gPSB0aXRsZVxuXHRcdHRpdGxlLm9uY2xpY2sgPSAoKSA9PiB7IGxvY2F0aW9uLmhhc2ggPSAnJ31cblxuXHRcdGxldCBtZW51cmVhZHlfZnVuOiAoeDogbnVsbCkgPT4gdm9pZFxuXHRcdHRoaXMubWVudXJlYWR5X3Byb21pc2UgPSBuZXcgUHJvbWlzZShzID0+IG1lbnVyZWFkeV9mdW4gPSBzKVxuXHRcdGNvbnN0IGpzb25fcHJvbWlzZSA9IEFQSTMubGlzdF9fY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9tYXhfdHNfdncoe30pXG5cdFx0Y29uc3QgbG9hZGVyID0gbmV3IExvYWRlcigpO1xuXHRcdHRoaXMuc3Jvb3QuYXBwZW5kQ2hpbGQobG9hZGVyKVxuXHRcdGpzb25fcHJvbWlzZS50aGVuKGFzeW5jIChqc29uKSA9PiB7XG5cdFx0XHRmb3IgKGxldCBkYXRhc2V0IG9mIGpzb24pXG5cdFx0XHR7XG5cdFx0XHRcdGNvbnN0IG1lbnUxX3N1Ym1lbnUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdFx0bWVudTFfc3VibWVudS50ZXh0Q29udGVudCA9IChkYXRhc2V0LmRhdGFzZXRfbmFtZSk7XG5cdFx0XHRcdHRoaXMubWVudWl0ZW1CeU5hbWVbZGF0YXNldC5kYXRhc2V0X25hbWVdID0gbWVudTFfc3VibWVudVxuXHRcdFx0XHR0aGlzLnN1Ym1lbnVzLmFwcGVuZENoaWxkKG1lbnUxX3N1Ym1lbnUpO1xuXHRcdFx0XHRtZW51MV9zdWJtZW51Lm9uY2xpY2sgPSAoKSA9PiB7XG5cdFx0XHRcdFx0bG9jYXRpb24uaGFzaCA9ICcjcGFnZT1kYXRhc2V0LWNhdGVnb3JpZXMnICsgJyZkYXRhc2V0X25hbWU9JyArIGRhdGFzZXQuZGF0YXNldF9uYW1lICsgXCImc2Vzc2lvbl9zdGFydF90cz1cIiArIGRhdGFzZXQuc2Vzc2lvbl9zdGFydF90c1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRsb2FkZXIucmVtb3ZlKCk7XG5cdFx0XHRtZW51cmVhZHlfZnVuKG51bGwpXG5cdFx0fSlcblxuXHR9XG5cdFxuXHRhc3luYyByZWZyZXNoKClcblx0e1xuXHR9XG5cdFxuXHRhc3luYyBzZWxlY3RJdGVtKG5hbWU6IHN0cmluZylcblx0e1xuXHRcdGF3YWl0IHRoaXMubWVudXJlYWR5X3Byb21pc2Vcblx0XHRmb3IgKGxldCBrIGluIHRoaXMubWVudWl0ZW1CeU5hbWUpXG5cdFx0e1xuXHRcdFx0Y29uc3QgaXRlbSA9IHRoaXMubWVudWl0ZW1CeU5hbWVba11cblx0XHRcdGlmIChuYW1lID09IGspXG5cdFx0XHRcdGl0ZW0uY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJylcblx0XHR9XG5cdH1cbn1cblxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCdjcy1tZW51LWVsZW1lbnQnLCBNZW51RWxlbWVudClcbiJdfQ==