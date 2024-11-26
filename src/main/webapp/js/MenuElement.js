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
        this.menuitemByName[''] = cs_cast(HTMLElement, this.sroot.querySelector('div.title'));
        let menuready_fun;
        this.menuready_promise = new Promise(s => menuready_fun = s);
        const json_promise = API3.list__catchsolve_noiodh__test_dataset_max_ts_vw({});
        const loader = new Loader();
        this.sroot.appendChild(loader);
        json_promise.then(async (json) => {
            await new Promise((s) => { setTimeout(s, 1000); });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWVudUVsZW1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90eXBlc2NyaXB0L01lbnVFbGVtZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7R0FHRztBQUVILE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDckMsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNuQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBRXZDOzs7Ozs7O0dBT0c7QUFFSCxNQUFNLE9BQU8sV0FBWSxTQUFRLFdBQVc7SUFFM0MsS0FBSyxDQUFBO0lBQ0wsUUFBUSxDQUFBO0lBRVIsY0FBYyxHQUE4QixFQUFFLENBQUE7SUFFOUMsaUJBQWlCLENBQUE7SUFFakI7UUFFQyxLQUFLLEVBQUUsQ0FBQTtRQUNQLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFBO1FBQ2hELElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHOzs7Ozs7Ozs7Ozs7Ozs7OztHQWlCdEIsQ0FBQztRQUNGLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1FBQy9FLElBQUksQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFBO1FBRXJGLElBQUksYUFBZ0MsQ0FBQTtRQUNwQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDNUQsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLCtDQUErQyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQzdFLE1BQU0sTUFBTSxHQUFHLElBQUksTUFBTSxFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDOUIsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDaEMsTUFBTSxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUksVUFBVSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQSxDQUFBLENBQUMsQ0FBQyxDQUFBO1lBQ2pELEtBQUssSUFBSSxPQUFPLElBQUksSUFBSSxFQUN4QixDQUFDO2dCQUNBLE1BQU0sYUFBYSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3BELGFBQWEsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQ25ELElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxHQUFHLGFBQWEsQ0FBQTtnQkFDekQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ3pDLGFBQWEsQ0FBQyxPQUFPLEdBQUcsR0FBRyxFQUFFO29CQUM1QixRQUFRLENBQUMsSUFBSSxHQUFHLDBCQUEwQixHQUFHLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxZQUFZLEdBQUcsb0JBQW9CLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFBO2dCQUN2SSxDQUFDLENBQUE7WUFDRixDQUFDO1lBQ0QsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2hCLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNwQixDQUFDLENBQUMsQ0FBQTtJQUVILENBQUM7SUFFRCxLQUFLLENBQUMsT0FBTztJQUViLENBQUM7SUFFRCxLQUFLLENBQUMsVUFBVSxDQUFDLElBQVk7UUFFNUIsTUFBTSxJQUFJLENBQUMsaUJBQWlCLENBQUE7UUFDNUIsS0FBSyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUNqQyxDQUFDO1lBQ0EsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUNuQyxJQUFJLElBQUksSUFBSSxDQUFDO2dCQUNaLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFBOztnQkFFOUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUE7UUFDbkMsQ0FBQztJQUNGLENBQUM7Q0FDRDtBQUVELGNBQWMsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLEVBQUUsV0FBVyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogKEMpIDIwMjQgQ2F0Y2ggU29sdmUgZGkgRGF2aWRlIE1vbnRlc2luXG4gKiBMaWNlbnNlOiBBR1BMXG4gKi9cblxuaW1wb3J0IHsgTG9hZGVyIH0gZnJvbSAnLi9Mb2FkZXIuanMnO1xuaW1wb3J0IHtBUEkzfSBmcm9tICcuL2FwaS9hcGkzLmpzJztcbmltcG9ydCB7IGNzX2Nhc3QgfSBmcm9tICcuL3F1YWxpdHkuanMnO1xuXG4vKlxuXG4vLyBpbiB0aGUgY3VzdG9tIGVsZW1lbnQgY2xhc3M6XG50aGlzLnNoYWRvd1Jvb3QuYWRvcHRlZFN0eWxlU2hlZXRzID0gWy4uLmRvY3VtZW50LmFkb3B0ZWRTdHlsZVNoZWV0cywgbXlDdXN0b21TaGVldF07XG5cbmh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzI4NjY0MjA3L2ltcG9ydGluZy1zdHlsZXMtaW50by1hLXdlYi1jb21wb25lbnRcblxuICovXG5cbmV4cG9ydCBjbGFzcyBNZW51RWxlbWVudCBleHRlbmRzIEhUTUxFbGVtZW50XG57XG5cdHNyb290XG5cdHN1Ym1lbnVzXG5cdFxuXHRtZW51aXRlbUJ5TmFtZToge1trOnN0cmluZ106IEhUTUxFbGVtZW50fSA9IHt9XG5cdFxuXHRtZW51cmVhZHlfcHJvbWlzZVxuXHRcblx0Y29uc3RydWN0b3IoKVxuXHR7XG5cdFx0c3VwZXIoKVxuXHRcdHRoaXMuc3Jvb3QgPSB0aGlzLmF0dGFjaFNoYWRvdyh7IG1vZGU6ICdvcGVuJyB9KVxuXHRcdHRoaXMuc3Jvb3QuaW5uZXJIVE1MID0gYFxuXHRcdFx0PHN0eWxlPlxuXHRcdFx0XHRkaXYuc3VibWVudXMge1xuXHRcdFx0XHRcdHBhZGRpbmctbGVmdDogMXJlbTtcblx0XHRcdFx0fVxuXHRcdFx0XHRkaXYuc3VibWVudXMgPiAqIHtcblx0XHRcdFx0XHRtYXJnaW46ICAwLjRyZW07XG5cdFx0XHRcdFx0cGFkZGluZzogMC4ycmVtO1xuXHRcdFx0XHRcdGN1cnNvcjogcG9pbnRlcjtcblx0XHRcdFx0fVxuXHRcdFx0XHQuc2VsZWN0ZWQge1xuXHRcdFx0XHRcdGJhY2tncm91bmQ6ICM2NjY7XG5cdFx0XHRcdFx0Y29sb3I6IHdoaXRlO1xuXHRcdFx0XHR9XG5cdFx0XHQ8L3N0eWxlPlxuXHRcdFx0PGRpdiBjbGFzcz1cInRpdGxlXCI+c3RhbmRhcmQgZGFzaGJvYXJkczwvZGl2PlxuXHRcdFx0PGRpdiBjbGFzcz1cInN1Ym1lbnVzXCI+PC9kaXY+XG5cdFx0YDtcblx0XHR0aGlzLnN1Ym1lbnVzID0gY3NfY2FzdChIVE1MRWxlbWVudCwgdGhpcy5zcm9vdC5xdWVyeVNlbGVjdG9yKCdkaXYuc3VibWVudXMnKSk7XG5cdFx0dGhpcy5tZW51aXRlbUJ5TmFtZVsnJ10gPSBjc19jYXN0KEhUTUxFbGVtZW50LCB0aGlzLnNyb290LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi50aXRsZScpKVxuXG5cdFx0bGV0IG1lbnVyZWFkeV9mdW46ICh4OiBudWxsKSA9PiB2b2lkXG5cdFx0dGhpcy5tZW51cmVhZHlfcHJvbWlzZSA9IG5ldyBQcm9taXNlKHMgPT4gbWVudXJlYWR5X2Z1biA9IHMpXG5cdFx0Y29uc3QganNvbl9wcm9taXNlID0gQVBJMy5saXN0X19jYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X21heF90c192dyh7fSlcblx0XHRjb25zdCBsb2FkZXIgPSBuZXcgTG9hZGVyKCk7XG5cdFx0dGhpcy5zcm9vdC5hcHBlbmRDaGlsZChsb2FkZXIpXG5cdFx0anNvbl9wcm9taXNlLnRoZW4oYXN5bmMgKGpzb24pID0+IHtcblx0XHRcdGF3YWl0IG5ldyBQcm9taXNlKChzKSA9PiAgeyBzZXRUaW1lb3V0KHMsIDEwMDApfSlcblx0XHRcdGZvciAobGV0IGRhdGFzZXQgb2YganNvbilcblx0XHRcdHtcblx0XHRcdFx0Y29uc3QgbWVudTFfc3VibWVudSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0XHRtZW51MV9zdWJtZW51LnRleHRDb250ZW50ID0gKGRhdGFzZXQuZGF0YXNldF9uYW1lKTtcblx0XHRcdFx0dGhpcy5tZW51aXRlbUJ5TmFtZVtkYXRhc2V0LmRhdGFzZXRfbmFtZV0gPSBtZW51MV9zdWJtZW51XG5cdFx0XHRcdHRoaXMuc3VibWVudXMuYXBwZW5kQ2hpbGQobWVudTFfc3VibWVudSk7XG5cdFx0XHRcdG1lbnUxX3N1Ym1lbnUub25jbGljayA9ICgpID0+IHtcblx0XHRcdFx0XHRsb2NhdGlvbi5oYXNoID0gJyNwYWdlPWRhdGFzZXQtY2F0ZWdvcmllcycgKyAnJmRhdGFzZXRfbmFtZT0nICsgZGF0YXNldC5kYXRhc2V0X25hbWUgKyBcIiZzZXNzaW9uX3N0YXJ0X3RzPVwiICsgZGF0YXNldC5zZXNzaW9uX3N0YXJ0X3RzXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGxvYWRlci5yZW1vdmUoKTtcblx0XHRcdG1lbnVyZWFkeV9mdW4obnVsbClcblx0XHR9KVxuXG5cdH1cblx0XG5cdGFzeW5jIHJlZnJlc2goKVxuXHR7XG5cdH1cblx0XG5cdGFzeW5jIHNlbGVjdEl0ZW0obmFtZTogc3RyaW5nKVxuXHR7XG5cdFx0YXdhaXQgdGhpcy5tZW51cmVhZHlfcHJvbWlzZVxuXHRcdGZvciAobGV0IGsgaW4gdGhpcy5tZW51aXRlbUJ5TmFtZSlcblx0XHR7XG5cdFx0XHRjb25zdCBpdGVtID0gdGhpcy5tZW51aXRlbUJ5TmFtZVtrXVxuXHRcdFx0aWYgKG5hbWUgPT0gaylcblx0XHRcdFx0aXRlbS5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKVxuXHRcdH1cblx0fVxufVxuXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ2NzLW1lbnUtZWxlbWVudCcsIE1lbnVFbGVtZW50KVxuIl19