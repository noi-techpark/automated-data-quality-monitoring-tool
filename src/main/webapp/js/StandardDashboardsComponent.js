// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later
import { DatasetCardComponent } from './DatasetCardComponent.js';
import { Loader } from './Loader.js';
import { API3 } from './api/api3.js';
import { cs_cast } from './quality.js';
export class StandardDashboardsComponent extends HTMLElement {
    sroot;
    boxContainer;
    boxes = [];
    titles = [];
    constructor() {
        super();
        this.sroot = this.attachShadow({ mode: 'open' });
        this.sroot.innerHTML = `
			<link rel="stylesheet" href="index.css">
			<div class="ProjectsElement">
				<div class="title" style="padding: 1rem">standard dashboards</div>
				<div class="searchbar">
					<input> 🔍 <span class="clearinput">✕</span>
				</div>
				<div class="container"></div>
			</div>
		`;
        this.boxContainer = cs_cast(HTMLDivElement, this.sroot.querySelector('.container'));
        this.boxContainer.textContent = ("loading ...");
        const refreshlist = () => {
            for (let b = 0; b < this.titles.length; b++)
                if (this.titles[b].toLowerCase().indexOf(input.value.toLowerCase()) >= 0)
                    this.boxes[b].style.display = 'block';
                else
                    this.boxes[b].style.display = 'none';
        };
        const input = this.sroot.querySelector('input');
        input.oninput = refreshlist;
        const clearinput = this.sroot.querySelector('.clearinput');
        clearinput.onclick = () => {
            input.value = '';
            refreshlist();
        };
    }
    async refresh() {
        this.boxes = [];
        this.titles = [];
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
            this.boxes.push(box);
            this.titles.push(dataset.dataset_name);
        }
    }
}
customElements.define('cs-standard-dashboards-element', StandardDashboardsComponent);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RhbmRhcmREYXNoYm9hcmRzQ29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdHlwZXNjcmlwdC9TdGFuZGFyZERhc2hib2FyZHNDb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsOERBQThEO0FBQzlELEVBQUU7QUFDRiw2Q0FBNkM7QUFHN0MsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDakUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUNyQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3JDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFFdkMsTUFBTSxPQUFPLDJCQUE0QixTQUFRLFdBQVc7SUFFM0QsS0FBSyxDQUFBO0lBRUwsWUFBWSxDQUFDO0lBRWIsS0FBSyxHQUEyQixFQUFFLENBQUE7SUFDbEMsTUFBTSxHQUFhLEVBQUUsQ0FBQTtJQUVyQjtRQUVDLEtBQUssRUFBRSxDQUFBO1FBRVAsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUE7UUFDaEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUc7Ozs7Ozs7OztHQVN0QixDQUFBO1FBQ0QsSUFBSSxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUE7UUFFbkYsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUVoRCxNQUFNLFdBQVcsR0FBRyxHQUFHLEVBQUU7WUFDeEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRTtnQkFDMUMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDLElBQUksQ0FBQztvQkFDdkUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQTs7b0JBRXJDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUE7UUFDdkMsQ0FBQyxDQUFBO1FBRUQsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFFLENBQUE7UUFDaEQsS0FBSyxDQUFDLE9BQU8sR0FBRyxXQUFXLENBQUE7UUFFM0IsTUFBTSxVQUFVLEdBQXFCLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBRSxDQUFBO1FBQzdFLFVBQVUsQ0FBQyxPQUFPLEdBQUcsR0FBRyxFQUFFO1lBQ3pCLEtBQUssQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFBO1lBQ2hCLFdBQVcsRUFBRSxDQUFBO1FBQ2QsQ0FBQyxDQUFBO0lBRUYsQ0FBQztJQUdELEtBQUssQ0FBQyxPQUFPO1FBRVosSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUE7UUFDZixJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQTtRQUNoQixJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sTUFBTSxHQUFHLElBQUksTUFBTSxFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDckMsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsK0NBQStDLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDM0UsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDakIsS0FBSyxJQUFJLE9BQU8sSUFBSSxJQUFJLEVBQ3hCLENBQUM7WUFDQSxNQUFNLEdBQUcsR0FBRyxJQUFJLG9CQUFvQixFQUFFLENBQUM7WUFDdkMsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUE7WUFDbEMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUNwQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUNwQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUE7UUFDdkMsQ0FBQztJQUVGLENBQUM7Q0FDRDtBQUVELGNBQWMsQ0FBQyxNQUFNLENBQUMsZ0NBQWdDLEVBQUUsMkJBQTJCLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIFNQRFgtRmlsZUNvcHlyaWdodFRleHQ6IDIwMjQgQ2F0Y2ggU29sdmUgZGkgRGF2aWRlIE1vbnRlc2luXG4vL1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9yLWxhdGVyXG5cblxuaW1wb3J0IHsgRGF0YXNldENhcmRDb21wb25lbnQgfSBmcm9tICcuL0RhdGFzZXRDYXJkQ29tcG9uZW50LmpzJztcbmltcG9ydCB7IExvYWRlciB9IGZyb20gJy4vTG9hZGVyLmpzJztcbmltcG9ydCB7IEFQSTMgfSBmcm9tICcuL2FwaS9hcGkzLmpzJztcbmltcG9ydCB7IGNzX2Nhc3QgfSBmcm9tICcuL3F1YWxpdHkuanMnO1xuXG5leHBvcnQgY2xhc3MgU3RhbmRhcmREYXNoYm9hcmRzQ29tcG9uZW50IGV4dGVuZHMgSFRNTEVsZW1lbnRcbntcblx0c3Jvb3Rcblx0XG5cdGJveENvbnRhaW5lcjtcblx0XG5cdGJveGVzOiBEYXRhc2V0Q2FyZENvbXBvbmVudFtdID0gW11cblx0dGl0bGVzOiBzdHJpbmdbXSA9IFtdXG5cblx0Y29uc3RydWN0b3IoKVxuXHR7XG5cdFx0c3VwZXIoKVxuXHRcdFxuXHRcdHRoaXMuc3Jvb3QgPSB0aGlzLmF0dGFjaFNoYWRvdyh7IG1vZGU6ICdvcGVuJyB9KVxuXHRcdHRoaXMuc3Jvb3QuaW5uZXJIVE1MID0gYFxuXHRcdFx0PGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIGhyZWY9XCJpbmRleC5jc3NcIj5cblx0XHRcdDxkaXYgY2xhc3M9XCJQcm9qZWN0c0VsZW1lbnRcIj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cInRpdGxlXCIgc3R5bGU9XCJwYWRkaW5nOiAxcmVtXCI+c3RhbmRhcmQgZGFzaGJvYXJkczwvZGl2PlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwic2VhcmNoYmFyXCI+XG5cdFx0XHRcdFx0PGlucHV0PiDwn5SNIDxzcGFuIGNsYXNzPVwiY2xlYXJpbnB1dFwiPuKclTwvc3Bhbj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj48L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdGBcblx0XHR0aGlzLmJveENvbnRhaW5lciA9IGNzX2Nhc3QoSFRNTERpdkVsZW1lbnQsIHRoaXMuc3Jvb3QucXVlcnlTZWxlY3RvcignLmNvbnRhaW5lcicpKVxuXG5cdFx0dGhpcy5ib3hDb250YWluZXIudGV4dENvbnRlbnQgPSAoXCJsb2FkaW5nIC4uLlwiKTtcblx0XHRcblx0XHRjb25zdCByZWZyZXNobGlzdCA9ICgpID0+IHtcblx0XHRcdGZvciAobGV0IGIgPSAwOyBiIDwgdGhpcy50aXRsZXMubGVuZ3RoOyBiKyspXG5cdFx0XHRcdGlmICh0aGlzLnRpdGxlc1tiXS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoaW5wdXQudmFsdWUudG9Mb3dlckNhc2UoKSkgPj0gMClcblx0XHRcdFx0XHR0aGlzLmJveGVzW2JdLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHR0aGlzLmJveGVzW2JdLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcblx0XHR9XG5cblx0XHRjb25zdCBpbnB1dCA9IHRoaXMuc3Jvb3QucXVlcnlTZWxlY3RvcignaW5wdXQnKSFcblx0XHRpbnB1dC5vbmlucHV0ID0gcmVmcmVzaGxpc3Rcblx0XHRcblx0XHRjb25zdCBjbGVhcmlucHV0ID0gPEhUTUxTcGFuRWxlbWVudD4gdGhpcy5zcm9vdC5xdWVyeVNlbGVjdG9yKCcuY2xlYXJpbnB1dCcpIVxuXHRcdGNsZWFyaW5wdXQub25jbGljayA9ICgpID0+IHtcblx0XHRcdGlucHV0LnZhbHVlID0gJydcblx0XHRcdHJlZnJlc2hsaXN0KClcblx0XHR9XG5cdFx0XG5cdH1cblx0XG5cblx0YXN5bmMgcmVmcmVzaCgpXG5cdHtcblx0XHR0aGlzLmJveGVzID0gW11cblx0XHR0aGlzLnRpdGxlcyA9IFtdXG5cdFx0dGhpcy5ib3hDb250YWluZXIudGV4dENvbnRlbnQgPSAoJycpO1xuXHRcdGNvbnN0IGxvYWRlciA9IG5ldyBMb2FkZXIoKTtcblx0XHR0aGlzLmJveENvbnRhaW5lci5hcHBlbmRDaGlsZChsb2FkZXIpXG5cdFx0Y29uc3QganNvbiA9IGF3YWl0IEFQSTMubGlzdF9fY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9tYXhfdHNfdncoe30pXG5cdFx0bG9hZGVyLnJlbW92ZSgpO1xuXHRcdGNvbnNvbGUubG9nKGpzb24pXG5cdFx0Zm9yIChsZXQgZGF0YXNldCBvZiBqc29uKVxuXHRcdHtcblx0XHRcdGNvbnN0IGJveCA9IG5ldyBEYXRhc2V0Q2FyZENvbXBvbmVudCgpO1xuXHRcdFx0dGhpcy5ib3hDb250YWluZXIuYXBwZW5kQ2hpbGQoYm94KVxuXHRcdFx0Ym94LnJlZnJlc2goZGF0YXNldClcblx0XHRcdHRoaXMuYm94ZXMucHVzaChib3gpXG5cdFx0XHR0aGlzLnRpdGxlcy5wdXNoKGRhdGFzZXQuZGF0YXNldF9uYW1lKVxuXHRcdH1cblx0XHRcblx0fSBcbn1cblxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCdjcy1zdGFuZGFyZC1kYXNoYm9hcmRzLWVsZW1lbnQnLCBTdGFuZGFyZERhc2hib2FyZHNDb21wb25lbnQpIl19