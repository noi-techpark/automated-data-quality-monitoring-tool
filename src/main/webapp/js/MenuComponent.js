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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWVudUNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3R5cGVzY3JpcHQvTWVudUNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw4REFBOEQ7QUFDOUQsRUFBRTtBQUNGLDZDQUE2QztBQUc3QyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ3JDLE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDbkMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUV2Qzs7Ozs7OztHQU9HO0FBRUgsTUFBTSxPQUFPLGFBQWMsU0FBUSxXQUFXO0lBRTdDLEtBQUssQ0FBQTtJQUNMLFFBQVEsQ0FBQTtJQUVSLGNBQWMsR0FBOEIsRUFBRSxDQUFBO0lBRTlDLGlCQUFpQixDQUFBO0lBRWpCO1FBRUMsS0FBSyxFQUFFLENBQUE7UUFDUCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQTtRQUNoRCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F1QnRCLENBQUM7UUFDRixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztRQUMvRSxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUE7UUFDekUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUE7UUFDL0IsS0FBSyxDQUFDLE9BQU8sR0FBRyxHQUFHLEVBQUUsR0FBRyxRQUFRLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQSxDQUFBLENBQUMsQ0FBQTtRQUUzQyxJQUFJLGFBQWdDLENBQUE7UUFDcEMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxDQUFBO1FBQzVELE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQywrQ0FBK0MsQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUM3RSxNQUFNLE1BQU0sR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFDO1FBQzVCLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQzlCLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFO1lBQ2hDLEtBQUssSUFBSSxPQUFPLElBQUksSUFBSSxFQUN4QixDQUFDO2dCQUNBLE1BQU0sYUFBYSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3BELGFBQWEsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQ25ELElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxHQUFHLGFBQWEsQ0FBQTtnQkFDekQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ3pDLGFBQWEsQ0FBQyxPQUFPLEdBQUcsR0FBRyxFQUFFO29CQUM1QixRQUFRLENBQUMsSUFBSSxHQUFHLDBCQUEwQjt3QkFDMUIsZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLFlBQVk7d0JBQ25ELG9CQUFvQixHQUFHLE9BQU8sQ0FBQyxnQkFBZ0I7MEJBQzdDLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxjQUFjOzBCQUMzQyxrQkFBa0IsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFBO2dCQUVsRCxDQUFDLENBQUE7WUFDRixDQUFDO1lBQ0QsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2hCLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNwQixDQUFDLENBQUMsQ0FBQTtJQUVILENBQUM7SUFFRCxLQUFLLENBQUMsT0FBTztJQUViLENBQUM7SUFFRCxLQUFLLENBQUMsVUFBVSxDQUFDLElBQVk7UUFFNUIsTUFBTSxJQUFJLENBQUMsaUJBQWlCLENBQUE7UUFDNUIsS0FBSyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUNqQyxDQUFDO1lBQ0EsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUNuQyxJQUFJLElBQUksSUFBSSxDQUFDO2dCQUNaLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFBOztnQkFFOUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUE7UUFDbkMsQ0FBQztJQUNGLENBQUM7Q0FDRDtBQUVELGNBQWMsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLEVBQUUsYUFBYSxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTUERYLUZpbGVDb3B5cmlnaHRUZXh0OiAyMDI0IENhdGNoIFNvbHZlIGRpIERhdmlkZSBNb250ZXNpblxuLy9cbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vci1sYXRlclxuXG5cbmltcG9ydCB7IExvYWRlciB9IGZyb20gJy4vTG9hZGVyLmpzJztcbmltcG9ydCB7QVBJM30gZnJvbSAnLi9hcGkvYXBpMy5qcyc7XG5pbXBvcnQgeyBjc19jYXN0IH0gZnJvbSAnLi9xdWFsaXR5LmpzJztcblxuLypcblxuLy8gaW4gdGhlIGN1c3RvbSBlbGVtZW50IGNsYXNzOlxudGhpcy5zaGFkb3dSb290LmFkb3B0ZWRTdHlsZVNoZWV0cyA9IFsuLi5kb2N1bWVudC5hZG9wdGVkU3R5bGVTaGVldHMsIG15Q3VzdG9tU2hlZXRdO1xuXG5odHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yODY2NDIwNy9pbXBvcnRpbmctc3R5bGVzLWludG8tYS13ZWItY29tcG9uZW50XG5cbiAqL1xuXG5leHBvcnQgY2xhc3MgTWVudUNvbXBvbmVudCBleHRlbmRzIEhUTUxFbGVtZW50XG57XG5cdHNyb290XG5cdHN1Ym1lbnVzXG5cdFxuXHRtZW51aXRlbUJ5TmFtZToge1trOnN0cmluZ106IEhUTUxFbGVtZW50fSA9IHt9XG5cdFxuXHRtZW51cmVhZHlfcHJvbWlzZVxuXHRcblx0Y29uc3RydWN0b3IoKVxuXHR7XG5cdFx0c3VwZXIoKVxuXHRcdHRoaXMuc3Jvb3QgPSB0aGlzLmF0dGFjaFNoYWRvdyh7IG1vZGU6ICdvcGVuJyB9KVxuXHRcdHRoaXMuc3Jvb3QuaW5uZXJIVE1MID0gYFxuXHRcdFx0PHN0eWxlPlxuXG5cdFx0XHRcdC50aXRsZSB7XG5cdFx0XHRcdFx0cGFkZGluZzogMC40cmVtO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZGl2LnN1Ym1lbnVzIHtcblx0XHRcdFx0XHRwYWRkaW5nLWxlZnQ6IDFyZW07XG5cdFx0XHRcdFx0b3ZlcmZsb3c6IGhpZGRlbjtcblx0XHRcdFx0fVxuXHRcdFx0XHRkaXYuc3VibWVudXMgPiAqIHtcblx0XHRcdFx0XHRtYXJnaW46ICAwLjRyZW07XG5cdFx0XHRcdFx0cGFkZGluZzogMC4ycmVtO1xuXHRcdFx0XHRcdGN1cnNvcjogcG9pbnRlcjtcblx0XHRcdFx0fVxuXHRcdFx0XHQuc2VsZWN0ZWQge1xuXHRcdFx0XHRcdGJhY2tncm91bmQ6ICM2NjY7XG5cdFx0XHRcdFx0Y29sb3I6IHdoaXRlO1xuXHRcdFx0XHR9XG5cdFx0XHQ8L3N0eWxlPlxuXHRcdFx0PGRpdiBjbGFzcz1cInRpdGxlXCI+4payIHN0YW5kYXJkIGRhc2hib2FyZHM8L2Rpdj5cblx0XHRcdDxkaXYgY2xhc3M9XCJzdWJtZW51c1wiPjwvZGl2PlxuXHRcdGA7XG5cdFx0dGhpcy5zdWJtZW51cyA9IGNzX2Nhc3QoSFRNTEVsZW1lbnQsIHRoaXMuc3Jvb3QucXVlcnlTZWxlY3RvcignZGl2LnN1Ym1lbnVzJykpO1xuXHRcdGNvbnN0IHRpdGxlID0gY3NfY2FzdChIVE1MRWxlbWVudCwgdGhpcy5zcm9vdC5xdWVyeVNlbGVjdG9yKCdkaXYudGl0bGUnKSlcblx0XHR0aGlzLm1lbnVpdGVtQnlOYW1lWycnXSA9IHRpdGxlXG5cdFx0dGl0bGUub25jbGljayA9ICgpID0+IHsgbG9jYXRpb24uaGFzaCA9ICcnfVxuXG5cdFx0bGV0IG1lbnVyZWFkeV9mdW46ICh4OiBudWxsKSA9PiB2b2lkXG5cdFx0dGhpcy5tZW51cmVhZHlfcHJvbWlzZSA9IG5ldyBQcm9taXNlKHMgPT4gbWVudXJlYWR5X2Z1biA9IHMpXG5cdFx0Y29uc3QganNvbl9wcm9taXNlID0gQVBJMy5saXN0X19jYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X21heF90c192dyh7fSlcblx0XHRjb25zdCBsb2FkZXIgPSBuZXcgTG9hZGVyKCk7XG5cdFx0dGhpcy5zcm9vdC5hcHBlbmRDaGlsZChsb2FkZXIpXG5cdFx0anNvbl9wcm9taXNlLnRoZW4oYXN5bmMgKGpzb24pID0+IHtcblx0XHRcdGZvciAobGV0IGRhdGFzZXQgb2YganNvbilcblx0XHRcdHtcblx0XHRcdFx0Y29uc3QgbWVudTFfc3VibWVudSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0XHRtZW51MV9zdWJtZW51LnRleHRDb250ZW50ID0gKGRhdGFzZXQuZGF0YXNldF9uYW1lKTtcblx0XHRcdFx0dGhpcy5tZW51aXRlbUJ5TmFtZVtkYXRhc2V0LmRhdGFzZXRfbmFtZV0gPSBtZW51MV9zdWJtZW51XG5cdFx0XHRcdHRoaXMuc3VibWVudXMuYXBwZW5kQ2hpbGQobWVudTFfc3VibWVudSk7XG5cdFx0XHRcdG1lbnUxX3N1Ym1lbnUub25jbGljayA9ICgpID0+IHtcblx0XHRcdFx0XHRsb2NhdGlvbi5oYXNoID0gJyNwYWdlPWRhdGFzZXQtY2F0ZWdvcmllcycgK1xuXHRcdFx0XHRcdCAgICAgICAgICAgICAgICAnJmRhdGFzZXRfbmFtZT0nICsgZGF0YXNldC5kYXRhc2V0X25hbWUgKyBcblx0XHRcdFx0XHRcdFx0XHRcdCcmc2Vzc2lvbl9zdGFydF90cz0nICsgZGF0YXNldC5zZXNzaW9uX3N0YXJ0X3RzIFxuXHRcdFx0XHRcdFx0XHRcdFx0KyBcIiZmYWlsZWRfcmVjb3Jkcz1cIiArIGRhdGFzZXQuZmFpbGVkX3JlY29yZHNcblx0XHRcdFx0XHRcdFx0XHRcdCsgXCImdGVzdGVkX3JlY29yZHM9XCIgKyBkYXRhc2V0LnRlc3RlZF9yZWNvcmRzXG5cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0bG9hZGVyLnJlbW92ZSgpO1xuXHRcdFx0bWVudXJlYWR5X2Z1bihudWxsKVxuXHRcdH0pXG5cblx0fVxuXHRcblx0YXN5bmMgcmVmcmVzaCgpXG5cdHtcblx0fVxuXHRcblx0YXN5bmMgc2VsZWN0SXRlbShuYW1lOiBzdHJpbmcpXG5cdHtcblx0XHRhd2FpdCB0aGlzLm1lbnVyZWFkeV9wcm9taXNlXG5cdFx0Zm9yIChsZXQgayBpbiB0aGlzLm1lbnVpdGVtQnlOYW1lKVxuXHRcdHtcblx0XHRcdGNvbnN0IGl0ZW0gPSB0aGlzLm1lbnVpdGVtQnlOYW1lW2tdXG5cdFx0XHRpZiAobmFtZSA9PSBrKVxuXHRcdFx0XHRpdGVtLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJylcblx0XHRcdGVsc2Vcblx0XHRcdFx0aXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpXG5cdFx0fVxuXHR9XG59XG5cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgnY3MtbWVudS1lbGVtZW50JywgTWVudUNvbXBvbmVudClcbiJdfQ==