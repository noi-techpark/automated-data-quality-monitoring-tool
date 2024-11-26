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
    constructor() {
        super();
        this.sroot = this.attachShadow({ mode: 'open' });
        this.sroot.innerHTML = `
			<style>
				div.submenus {
					padding-left: 1rem;
				}
				.selected {
					background: #ccc
				}
			</style>
			<div class="title">standard dashboards</div>
			<div class="submenus"></div>
		`;
        this.submenus = cs_cast(HTMLElement, this.sroot.querySelector('div.submenus'));
        this.menuitemByName[''] = cs_cast(HTMLElement, this.sroot.querySelector('div.title'));
        // customElements.upgrade(sroot)
        /*
        const menu1_submenus = document.createElement('div');
        menu1_submenus.className = ("menu1_submenus");
        sroot.appendChild(menu1_submenus);


        for (let i = 0; i < 10; i++)
        {
            const menu1_submenu = document.createElement('div');
            menu1_submenu.textContent = ("dashboard "+i);
            menu1_submenus.appendChild(menu1_submenu);
        }
         */
    }
    async refresh() {
        const loader = new Loader();
        this.sroot.appendChild(loader);
        const json = await API3.list__catchsolve_noiodh__test_dataset_max_ts_vw({});
        await new Promise((s) => { setTimeout(s, 1000); });
        loader.remove();
        for (let dataset of json) {
            const menu1_submenu = document.createElement('div');
            menu1_submenu.textContent = (dataset.dataset_name);
            this.menuitemByName[dataset.dataset_name] = menu1_submenu;
            this.submenus.appendChild(menu1_submenu);
        }
    }
    selectItem(name) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWVudUVsZW1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90eXBlc2NyaXB0L01lbnVFbGVtZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7R0FHRztBQUVILE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDckMsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNuQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBRXZDOzs7Ozs7O0dBT0c7QUFFSCxNQUFNLE9BQU8sV0FBWSxTQUFRLFdBQVc7SUFFM0MsS0FBSyxDQUFBO0lBQ0wsUUFBUSxDQUFBO0lBRVIsY0FBYyxHQUE4QixFQUFFLENBQUE7SUFFOUM7UUFFQyxLQUFLLEVBQUUsQ0FBQTtRQUNQLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFBO1FBQ2hELElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHOzs7Ozs7Ozs7OztHQVd0QixDQUFDO1FBQ0YsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7UUFDL0UsSUFBSSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUE7UUFFckYsZ0NBQWdDO1FBRWhDOzs7Ozs7Ozs7Ozs7V0FZRztJQUVKLENBQUM7SUFFRCxLQUFLLENBQUMsT0FBTztRQUVaLE1BQU0sTUFBTSxHQUFHLElBQUksTUFBTSxFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0IsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsK0NBQStDLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDM0UsTUFBTSxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUksVUFBVSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQSxDQUFBLENBQUMsQ0FBQyxDQUFBO1FBQ2pELE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNoQixLQUFLLElBQUksT0FBTyxJQUFJLElBQUksRUFDeEIsQ0FBQztZQUNBLE1BQU0sYUFBYSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDcEQsYUFBYSxDQUFDLFdBQVcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNuRCxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxhQUFhLENBQUE7WUFDekQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDMUMsQ0FBQztJQUNGLENBQUM7SUFFRCxVQUFVLENBQUMsSUFBWTtRQUV0QixLQUFLLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQ2pDLENBQUM7WUFDQSxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ25DLElBQUksSUFBSSxJQUFJLENBQUM7Z0JBQ1osSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUE7O2dCQUU5QixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQTtRQUNuQyxDQUFDO0lBQ0YsQ0FBQztDQUNEO0FBRUQsY0FBYyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSxXQUFXLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAoQykgMjAyNCBDYXRjaCBTb2x2ZSBkaSBEYXZpZGUgTW9udGVzaW5cbiAqIExpY2Vuc2U6IEFHUExcbiAqL1xuXG5pbXBvcnQgeyBMb2FkZXIgfSBmcm9tICcuL0xvYWRlci5qcyc7XG5pbXBvcnQge0FQSTN9IGZyb20gJy4vYXBpL2FwaTMuanMnO1xuaW1wb3J0IHsgY3NfY2FzdCB9IGZyb20gJy4vcXVhbGl0eS5qcyc7XG5cbi8qXG5cbi8vIGluIHRoZSBjdXN0b20gZWxlbWVudCBjbGFzczpcbnRoaXMuc2hhZG93Um9vdC5hZG9wdGVkU3R5bGVTaGVldHMgPSBbLi4uZG9jdW1lbnQuYWRvcHRlZFN0eWxlU2hlZXRzLCBteUN1c3RvbVNoZWV0XTtcblxuaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjg2NjQyMDcvaW1wb3J0aW5nLXN0eWxlcy1pbnRvLWEtd2ViLWNvbXBvbmVudFxuXG4gKi9cblxuZXhwb3J0IGNsYXNzIE1lbnVFbGVtZW50IGV4dGVuZHMgSFRNTEVsZW1lbnRcbntcblx0c3Jvb3Rcblx0c3VibWVudXNcblx0XG5cdG1lbnVpdGVtQnlOYW1lOiB7W2s6c3RyaW5nXTogSFRNTEVsZW1lbnR9ID0ge31cblx0XG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXHRcdHN1cGVyKClcblx0XHR0aGlzLnNyb290ID0gdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSlcblx0XHR0aGlzLnNyb290LmlubmVySFRNTCA9IGBcblx0XHRcdDxzdHlsZT5cblx0XHRcdFx0ZGl2LnN1Ym1lbnVzIHtcblx0XHRcdFx0XHRwYWRkaW5nLWxlZnQ6IDFyZW07XG5cdFx0XHRcdH1cblx0XHRcdFx0LnNlbGVjdGVkIHtcblx0XHRcdFx0XHRiYWNrZ3JvdW5kOiAjY2NjXG5cdFx0XHRcdH1cblx0XHRcdDwvc3R5bGU+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwidGl0bGVcIj5zdGFuZGFyZCBkYXNoYm9hcmRzPC9kaXY+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwic3VibWVudXNcIj48L2Rpdj5cblx0XHRgO1xuXHRcdHRoaXMuc3VibWVudXMgPSBjc19jYXN0KEhUTUxFbGVtZW50LCB0aGlzLnNyb290LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi5zdWJtZW51cycpKTtcblx0XHR0aGlzLm1lbnVpdGVtQnlOYW1lWycnXSA9IGNzX2Nhc3QoSFRNTEVsZW1lbnQsIHRoaXMuc3Jvb3QucXVlcnlTZWxlY3RvcignZGl2LnRpdGxlJykpXG5cblx0XHQvLyBjdXN0b21FbGVtZW50cy51cGdyYWRlKHNyb290KVxuXHRcdFxuXHRcdC8qXG5cdFx0Y29uc3QgbWVudTFfc3VibWVudXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRtZW51MV9zdWJtZW51cy5jbGFzc05hbWUgPSAoXCJtZW51MV9zdWJtZW51c1wiKTtcblx0XHRzcm9vdC5hcHBlbmRDaGlsZChtZW51MV9zdWJtZW51cyk7XG5cblxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKylcblx0XHR7XG5cdFx0XHRjb25zdCBtZW51MV9zdWJtZW51ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRtZW51MV9zdWJtZW51LnRleHRDb250ZW50ID0gKFwiZGFzaGJvYXJkIFwiK2kpO1xuXHRcdFx0bWVudTFfc3VibWVudXMuYXBwZW5kQ2hpbGQobWVudTFfc3VibWVudSk7XG5cdFx0fVxuXHRcdCAqL1xuXG5cdH1cblx0XG5cdGFzeW5jIHJlZnJlc2goKVxuXHR7XG5cdFx0Y29uc3QgbG9hZGVyID0gbmV3IExvYWRlcigpO1xuXHRcdHRoaXMuc3Jvb3QuYXBwZW5kQ2hpbGQobG9hZGVyKTtcblx0XHRjb25zdCBqc29uID0gYXdhaXQgQVBJMy5saXN0X19jYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X21heF90c192dyh7fSlcblx0XHRhd2FpdCBuZXcgUHJvbWlzZSgocykgPT4gIHsgc2V0VGltZW91dChzLCAxMDAwKX0pXG5cdFx0bG9hZGVyLnJlbW92ZSgpO1xuXHRcdGZvciAobGV0IGRhdGFzZXQgb2YganNvbilcblx0XHR7XG5cdFx0XHRjb25zdCBtZW51MV9zdWJtZW51ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRtZW51MV9zdWJtZW51LnRleHRDb250ZW50ID0gKGRhdGFzZXQuZGF0YXNldF9uYW1lKTtcblx0XHRcdHRoaXMubWVudWl0ZW1CeU5hbWVbZGF0YXNldC5kYXRhc2V0X25hbWVdID0gbWVudTFfc3VibWVudVxuXHRcdFx0dGhpcy5zdWJtZW51cy5hcHBlbmRDaGlsZChtZW51MV9zdWJtZW51KTtcblx0XHR9XG5cdH1cblx0XG5cdHNlbGVjdEl0ZW0obmFtZTogc3RyaW5nKVxuXHR7XG5cdFx0Zm9yIChsZXQgayBpbiB0aGlzLm1lbnVpdGVtQnlOYW1lKVxuXHRcdHtcblx0XHRcdGNvbnN0IGl0ZW0gPSB0aGlzLm1lbnVpdGVtQnlOYW1lW2tdXG5cdFx0XHRpZiAobmFtZSA9PSBrKVxuXHRcdFx0XHRpdGVtLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJylcblx0XHRcdGVsc2Vcblx0XHRcdFx0aXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpXG5cdFx0fVxuXHR9XG59XG5cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgnY3MtbWVudS1lbGVtZW50JywgTWVudUVsZW1lbnQpXG4iXX0=