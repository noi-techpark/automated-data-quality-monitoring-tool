// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later
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
					overflow: hidden;
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
				.title.close ~ .submenus {
					display: none;
				}
				.openclose {
					cursor: pointer;
				}
				.openclose:before {
					content: "▲"
				}
				.title.close .openclose:before {
					content: "▼"
				}
			</style>
			<div class="title"><span class="openclose"></span> standard dashboards</div>
			<div class="submenus"></div>
		`;
        this.submenus = cs_cast(HTMLElement, this.sroot.querySelector('div.submenus'));
        const title = cs_cast(HTMLElement, this.sroot.querySelector('div.title'));
        this.menuitemByName[''] = title;
        title.onclick = () => { location.hash = ''; };
        const openclose = cs_cast(HTMLElement, this.sroot.querySelector('span.openclose'));
        openclose.onclick = () => { title.classList.toggle('close'); };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWVudUNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3R5cGVzY3JpcHQvTWVudUNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw4REFBOEQ7QUFDOUQsRUFBRTtBQUNGLDZDQUE2QztBQUc3QyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ3JDLE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDbkMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUV2Qzs7Ozs7OztHQU9HO0FBRUgsTUFBTSxPQUFPLGFBQWMsU0FBUSxXQUFXO0lBRTdDLEtBQUssQ0FBQTtJQUNMLFFBQVEsQ0FBQTtJQUVSLGNBQWMsR0FBOEIsRUFBRSxDQUFBO0lBRTlDLGlCQUFpQixDQUFBO0lBRWpCO1FBRUMsS0FBSyxFQUFFLENBQUE7UUFDUCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQTtRQUNoRCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FtQ3RCLENBQUM7UUFDRixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztRQUMvRSxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUE7UUFDekUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUE7UUFFL0IsS0FBSyxDQUFDLE9BQU8sR0FBRyxHQUFHLEVBQUUsR0FBRyxRQUFRLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQSxDQUFBLENBQUMsQ0FBQTtRQUUzQyxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztRQUNuRixTQUFTLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFBLENBQUMsQ0FBQyxDQUFBO1FBRTdELElBQUksYUFBZ0MsQ0FBQTtRQUNwQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDNUQsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLCtDQUErQyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQzdFLE1BQU0sTUFBTSxHQUFHLElBQUksTUFBTSxFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDOUIsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDaEMsS0FBSyxJQUFJLE9BQU8sSUFBSSxJQUFJLEVBQ3hCLENBQUM7Z0JBQ0EsTUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDcEQsYUFBYSxDQUFDLFdBQVcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDbkQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEdBQUcsYUFBYSxDQUFBO2dCQUN6RCxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDekMsYUFBYSxDQUFDLE9BQU8sR0FBRyxHQUFHLEVBQUU7b0JBQzVCLFFBQVEsQ0FBQyxJQUFJLEdBQUcsMEJBQTBCO3dCQUMxQixnQkFBZ0IsR0FBRyxPQUFPLENBQUMsWUFBWTt3QkFDbkQsb0JBQW9CLEdBQUcsT0FBTyxDQUFDLGdCQUFnQjswQkFDN0Msa0JBQWtCLEdBQUcsT0FBTyxDQUFDLGNBQWM7MEJBQzNDLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUE7Z0JBRWxELENBQUMsQ0FBQTtZQUNGLENBQUM7WUFDRCxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDaEIsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ3BCLENBQUMsQ0FBQyxDQUFBO0lBRUgsQ0FBQztJQUVELEtBQUssQ0FBQyxPQUFPO0lBRWIsQ0FBQztJQUVELEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBWTtRQUU1QixNQUFNLElBQUksQ0FBQyxpQkFBaUIsQ0FBQTtRQUM1QixLQUFLLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQ2pDLENBQUM7WUFDQSxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ25DLElBQUksSUFBSSxJQUFJLENBQUM7Z0JBQ1osSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUE7O2dCQUU5QixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQTtRQUNuQyxDQUFDO0lBQ0YsQ0FBQztDQUNEO0FBRUQsY0FBYyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSxhQUFhLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIFNQRFgtRmlsZUNvcHlyaWdodFRleHQ6IDIwMjQgQ2F0Y2ggU29sdmUgZGkgRGF2aWRlIE1vbnRlc2luXG4vL1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9yLWxhdGVyXG5cblxuaW1wb3J0IHsgTG9hZGVyIH0gZnJvbSAnLi9Mb2FkZXIuanMnO1xuaW1wb3J0IHtBUEkzfSBmcm9tICcuL2FwaS9hcGkzLmpzJztcbmltcG9ydCB7IGNzX2Nhc3QgfSBmcm9tICcuL3F1YWxpdHkuanMnO1xuXG4vKlxuXG4vLyBpbiB0aGUgY3VzdG9tIGVsZW1lbnQgY2xhc3M6XG50aGlzLnNoYWRvd1Jvb3QuYWRvcHRlZFN0eWxlU2hlZXRzID0gWy4uLmRvY3VtZW50LmFkb3B0ZWRTdHlsZVNoZWV0cywgbXlDdXN0b21TaGVldF07XG5cbmh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzI4NjY0MjA3L2ltcG9ydGluZy1zdHlsZXMtaW50by1hLXdlYi1jb21wb25lbnRcblxuICovXG5cbmV4cG9ydCBjbGFzcyBNZW51Q29tcG9uZW50IGV4dGVuZHMgSFRNTEVsZW1lbnRcbntcblx0c3Jvb3Rcblx0c3VibWVudXNcblx0XG5cdG1lbnVpdGVtQnlOYW1lOiB7W2s6c3RyaW5nXTogSFRNTEVsZW1lbnR9ID0ge31cblx0XG5cdG1lbnVyZWFkeV9wcm9taXNlXG5cdFxuXHRjb25zdHJ1Y3RvcigpXG5cdHtcblx0XHRzdXBlcigpXG5cdFx0dGhpcy5zcm9vdCA9IHRoaXMuYXR0YWNoU2hhZG93KHsgbW9kZTogJ29wZW4nIH0pXG5cdFx0dGhpcy5zcm9vdC5pbm5lckhUTUwgPSBgXG5cdFx0XHQ8c3R5bGU+XG5cblx0XHRcdFx0LnRpdGxlIHtcblx0XHRcdFx0XHRwYWRkaW5nOiAwLjRyZW07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRkaXYuc3VibWVudXMge1xuXHRcdFx0XHRcdHBhZGRpbmctbGVmdDogMXJlbTtcblx0XHRcdFx0XHRvdmVyZmxvdzogaGlkZGVuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGRpdi5zdWJtZW51cyA+ICoge1xuXHRcdFx0XHRcdG1hcmdpbjogIDAuNHJlbTtcblx0XHRcdFx0XHRwYWRkaW5nOiAwLjJyZW07XG5cdFx0XHRcdFx0Y3Vyc29yOiBwb2ludGVyO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC5zZWxlY3RlZCB7XG5cdFx0XHRcdFx0YmFja2dyb3VuZDogIzY2Njtcblx0XHRcdFx0XHRjb2xvcjogd2hpdGU7XG5cdFx0XHRcdH1cblx0XHRcdFx0LnRpdGxlLmNsb3NlIH4gLnN1Ym1lbnVzIHtcblx0XHRcdFx0XHRkaXNwbGF5OiBub25lO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC5vcGVuY2xvc2Uge1xuXHRcdFx0XHRcdGN1cnNvcjogcG9pbnRlcjtcblx0XHRcdFx0fVxuXHRcdFx0XHQub3BlbmNsb3NlOmJlZm9yZSB7XG5cdFx0XHRcdFx0Y29udGVudDogXCLilrJcIlxuXHRcdFx0XHR9XG5cdFx0XHRcdC50aXRsZS5jbG9zZSAub3BlbmNsb3NlOmJlZm9yZSB7XG5cdFx0XHRcdFx0Y29udGVudDogXCLilrxcIlxuXHRcdFx0XHR9XG5cdFx0XHQ8L3N0eWxlPlxuXHRcdFx0PGRpdiBjbGFzcz1cInRpdGxlXCI+PHNwYW4gY2xhc3M9XCJvcGVuY2xvc2VcIj48L3NwYW4+IHN0YW5kYXJkIGRhc2hib2FyZHM8L2Rpdj5cblx0XHRcdDxkaXYgY2xhc3M9XCJzdWJtZW51c1wiPjwvZGl2PlxuXHRcdGA7XG5cdFx0dGhpcy5zdWJtZW51cyA9IGNzX2Nhc3QoSFRNTEVsZW1lbnQsIHRoaXMuc3Jvb3QucXVlcnlTZWxlY3RvcignZGl2LnN1Ym1lbnVzJykpO1xuXHRcdGNvbnN0IHRpdGxlID0gY3NfY2FzdChIVE1MRWxlbWVudCwgdGhpcy5zcm9vdC5xdWVyeVNlbGVjdG9yKCdkaXYudGl0bGUnKSlcblx0XHR0aGlzLm1lbnVpdGVtQnlOYW1lWycnXSA9IHRpdGxlXG5cdFx0XG5cdFx0dGl0bGUub25jbGljayA9ICgpID0+IHsgbG9jYXRpb24uaGFzaCA9ICcnfVxuXHRcdFxuXHRcdGNvbnN0IG9wZW5jbG9zZSA9IGNzX2Nhc3QoSFRNTEVsZW1lbnQsIHRoaXMuc3Jvb3QucXVlcnlTZWxlY3Rvcignc3Bhbi5vcGVuY2xvc2UnKSk7XG5cdFx0b3BlbmNsb3NlLm9uY2xpY2sgPSAoKSA9PiB7IHRpdGxlLmNsYXNzTGlzdC50b2dnbGUoJ2Nsb3NlJykgfVxuXG5cdFx0bGV0IG1lbnVyZWFkeV9mdW46ICh4OiBudWxsKSA9PiB2b2lkXG5cdFx0dGhpcy5tZW51cmVhZHlfcHJvbWlzZSA9IG5ldyBQcm9taXNlKHMgPT4gbWVudXJlYWR5X2Z1biA9IHMpXG5cdFx0Y29uc3QganNvbl9wcm9taXNlID0gQVBJMy5saXN0X19jYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X21heF90c192dyh7fSlcblx0XHRjb25zdCBsb2FkZXIgPSBuZXcgTG9hZGVyKCk7XG5cdFx0dGhpcy5zcm9vdC5hcHBlbmRDaGlsZChsb2FkZXIpXG5cdFx0anNvbl9wcm9taXNlLnRoZW4oYXN5bmMgKGpzb24pID0+IHtcblx0XHRcdGZvciAobGV0IGRhdGFzZXQgb2YganNvbilcblx0XHRcdHtcblx0XHRcdFx0Y29uc3QgbWVudTFfc3VibWVudSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0XHRtZW51MV9zdWJtZW51LnRleHRDb250ZW50ID0gKGRhdGFzZXQuZGF0YXNldF9uYW1lKTtcblx0XHRcdFx0dGhpcy5tZW51aXRlbUJ5TmFtZVtkYXRhc2V0LmRhdGFzZXRfbmFtZV0gPSBtZW51MV9zdWJtZW51XG5cdFx0XHRcdHRoaXMuc3VibWVudXMuYXBwZW5kQ2hpbGQobWVudTFfc3VibWVudSk7XG5cdFx0XHRcdG1lbnUxX3N1Ym1lbnUub25jbGljayA9ICgpID0+IHtcblx0XHRcdFx0XHRsb2NhdGlvbi5oYXNoID0gJyNwYWdlPWRhdGFzZXQtY2F0ZWdvcmllcycgK1xuXHRcdFx0XHRcdCAgICAgICAgICAgICAgICAnJmRhdGFzZXRfbmFtZT0nICsgZGF0YXNldC5kYXRhc2V0X25hbWUgKyBcblx0XHRcdFx0XHRcdFx0XHRcdCcmc2Vzc2lvbl9zdGFydF90cz0nICsgZGF0YXNldC5zZXNzaW9uX3N0YXJ0X3RzIFxuXHRcdFx0XHRcdFx0XHRcdFx0KyBcIiZmYWlsZWRfcmVjb3Jkcz1cIiArIGRhdGFzZXQuZmFpbGVkX3JlY29yZHNcblx0XHRcdFx0XHRcdFx0XHRcdCsgXCImdGVzdGVkX3JlY29yZHM9XCIgKyBkYXRhc2V0LnRlc3RlZF9yZWNvcmRzXG5cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0bG9hZGVyLnJlbW92ZSgpO1xuXHRcdFx0bWVudXJlYWR5X2Z1bihudWxsKVxuXHRcdH0pXG5cblx0fVxuXHRcblx0YXN5bmMgcmVmcmVzaCgpXG5cdHtcblx0fVxuXHRcblx0YXN5bmMgc2VsZWN0SXRlbShuYW1lOiBzdHJpbmcpXG5cdHtcblx0XHRhd2FpdCB0aGlzLm1lbnVyZWFkeV9wcm9taXNlXG5cdFx0Zm9yIChsZXQgayBpbiB0aGlzLm1lbnVpdGVtQnlOYW1lKVxuXHRcdHtcblx0XHRcdGNvbnN0IGl0ZW0gPSB0aGlzLm1lbnVpdGVtQnlOYW1lW2tdXG5cdFx0XHRpZiAobmFtZSA9PSBrKVxuXHRcdFx0XHRpdGVtLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJylcblx0XHRcdGVsc2Vcblx0XHRcdFx0aXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpXG5cdFx0fVxuXHR9XG59XG5cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgnY3MtbWVudS1lbGVtZW50JywgTWVudUNvbXBvbmVudClcbiJdfQ==