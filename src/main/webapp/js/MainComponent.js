/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */
import { MenuComponent } from './MenuComponent.js';
import { StandardDashboardsComponent } from './StandardDashboardsComponent.js';
import { DatasetIssuesDetail } from './DatasetIssuesDetail.js';
import { cs_cast, cs_notnull } from './quality.js';
import { DatasetCategories } from './DatasetCategories.js';
export class MainComponent extends HTMLElement {
    sroot;
    dashboards = null;
    changingSection;
    logo;
    constructor() {
        super();
        this.sroot = this.attachShadow({ mode: 'open' });
        this.sroot.innerHTML = `
			<link rel="stylesheet" href="index.css">
			<div class="MainComponent">
				<div class="header">
					<img class="logo" src="NOI_OPENDATAHUB_NEW_BK_nospace-01.svg">
				</div>
				<div class="body">
					<div class="projects"></div>
				</div>
			</div>
		`;
        this.changingSection = this.sroot.querySelector('.projects');
        this.logo = cs_cast(HTMLImageElement, this.sroot.querySelector('.logo'));
        this.logo.onclick = () => {
            location.hash = '';
        };
        const menu = new MenuComponent();
        menu.refresh();
        this.changingSection.parentElement.prepend(menu);
        // this.projectsComponent = new ProjectsElement();
        // projects.appendChild(this.projectsComponent.element);
        const onhashchange = () => {
            console.log(location.hash);
            this.changingSection.textContent = '';
            if (location.hash == '') {
                if (this.dashboards == null) {
                    this.dashboards = new StandardDashboardsComponent();
                    this.dashboards.refresh();
                }
                this.changingSection.appendChild(this.dashboards);
                menu.selectItem('');
            }
            if (location.hash.indexOf('#page=dataset-categories&') == 0) {
                this.changingSection.textContent = '';
                const detail = new DatasetCategories();
                this.changingSection.appendChild(detail);
                const params = new URLSearchParams(location.hash.substring(1));
                const session_start_ts = cs_notnull(params.get('session_start_ts'));
                const dataset_name = cs_notnull(params.get('dataset_name'));
                const failed_records = parseInt(cs_notnull(params.get('failed_records')));
                const tested_records = parseInt(cs_notnull(params.get('tested_records')));
                detail.refresh(session_start_ts, dataset_name, failed_records, tested_records);
                menu.selectItem(dataset_name);
            }
            if (location.hash.startsWith('#page=summary&')) {
                this.changingSection.textContent = '';
                const detail = new DatasetIssuesDetail();
                this.changingSection.appendChild(detail);
                const params = new URLSearchParams(location.hash.substring(1));
                const session_start_ts = cs_notnull(params.get('session_start_ts'));
                const dataset_name = cs_notnull(params.get('dataset_name'));
                const category_name = cs_notnull(params.get('category_name'));
                const failed_records = parseInt(cs_notnull(params.get('failed_records')));
                const tot_records = parseInt(cs_notnull(params.get('tot_records')));
                detail.refresh(session_start_ts, dataset_name, category_name, failed_records, tot_records);
                menu.selectItem(dataset_name);
            }
        };
        window.onpopstate = (e) => {
            onhashchange();
        };
        onhashchange();
    }
}
customElements.define('cs-main-component', MainComponent);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFpbkNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3R5cGVzY3JpcHQvTWFpbkNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sb0JBQW9CLENBQUE7QUFDaEQsT0FBTyxFQUFDLDJCQUEyQixFQUFDLE1BQU0sa0NBQWtDLENBQUE7QUFHNUUsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sMEJBQTBCLENBQUE7QUFDNUQsT0FBTyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDbkQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFFM0QsTUFBTSxPQUFPLGFBQWMsU0FBUSxXQUFXO0lBRTdDLEtBQUssQ0FBQTtJQUVMLFVBQVUsR0FBcUMsSUFBSSxDQUFDO0lBRXBELGVBQWUsQ0FBQTtJQUVmLElBQUksQ0FBQTtJQUVKO1FBRUMsS0FBSyxFQUFFLENBQUE7UUFDUCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQTtRQUNoRCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRzs7Ozs7Ozs7OztHQVV0QixDQUFBO1FBQ0QsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUUsQ0FBQTtRQUU3RCxJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO1FBQ3hFLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRTtZQUN4QixRQUFRLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQTtRQUNuQixDQUFDLENBQUE7UUFF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YUFBYSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUE7Z0JBQzdELE1BQU0sY0FBYyxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFDekUsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFDbkUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLGNBQWMsRUFBRSxXQUFXLENBQUMsQ0FBQztnQkFDM0YsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQTtZQUM5QixDQUFDO1FBQ0YsQ0FBQyxDQUFBO1FBRUQsTUFBTSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFO1lBQ3pCLFlBQVksRUFBRSxDQUFBO1FBQ2YsQ0FBQyxDQUFBO1FBRUQsWUFBWSxFQUFFLENBQUE7SUFHZixDQUFDO0NBRUQ7QUFFRCxjQUFjLENBQUMsTUFBTSxDQUFDLG1CQUFtQixFQUFFLGFBQWEsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIChDKSAyMDI0IENhdGNoIFNvbHZlIGRpIERhdmlkZSBNb250ZXNpblxuICogTGljZW5zZTogQUdQTFxuICovXG5cbmltcG9ydCB7TWVudUNvbXBvbmVudH0gZnJvbSAnLi9NZW51Q29tcG9uZW50LmpzJ1xuaW1wb3J0IHtTdGFuZGFyZERhc2hib2FyZHNDb21wb25lbnR9IGZyb20gJy4vU3RhbmRhcmREYXNoYm9hcmRzQ29tcG9uZW50LmpzJ1xuXG5cbmltcG9ydCB7RGF0YXNldElzc3Vlc0RldGFpbH0gZnJvbSAnLi9EYXRhc2V0SXNzdWVzRGV0YWlsLmpzJ1xuaW1wb3J0IHsgY3NfY2FzdCwgY3Nfbm90bnVsbCB9IGZyb20gJy4vcXVhbGl0eS5qcyc7XG5pbXBvcnQgeyBEYXRhc2V0Q2F0ZWdvcmllcyB9IGZyb20gJy4vRGF0YXNldENhdGVnb3JpZXMuanMnO1xuXG5leHBvcnQgY2xhc3MgTWFpbkNvbXBvbmVudCBleHRlbmRzIEhUTUxFbGVtZW50XG57XG5cdHNyb290XG5cdFxuXHRkYXNoYm9hcmRzOiBTdGFuZGFyZERhc2hib2FyZHNDb21wb25lbnR8bnVsbCA9IG51bGw7XG5cdFxuXHRjaGFuZ2luZ1NlY3Rpb25cblx0XG5cdGxvZ29cblxuXHRjb25zdHJ1Y3RvcigpXG5cdHtcblx0XHRzdXBlcigpXG5cdFx0dGhpcy5zcm9vdCA9IHRoaXMuYXR0YWNoU2hhZG93KHsgbW9kZTogJ29wZW4nIH0pXG5cdFx0dGhpcy5zcm9vdC5pbm5lckhUTUwgPSBgXG5cdFx0XHQ8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgaHJlZj1cImluZGV4LmNzc1wiPlxuXHRcdFx0PGRpdiBjbGFzcz1cIk1haW5Db21wb25lbnRcIj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImhlYWRlclwiPlxuXHRcdFx0XHRcdDxpbWcgY2xhc3M9XCJsb2dvXCIgc3JjPVwiTk9JX09QRU5EQVRBSFVCX05FV19CS19ub3NwYWNlLTAxLnN2Z1wiPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImJvZHlcIj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicHJvamVjdHNcIj48L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cblx0XHRgXG5cdFx0dGhpcy5jaGFuZ2luZ1NlY3Rpb24gPSB0aGlzLnNyb290LnF1ZXJ5U2VsZWN0b3IoJy5wcm9qZWN0cycpIVxuXHRcdFxuXHRcdHRoaXMubG9nbyA9IGNzX2Nhc3QoSFRNTEltYWdlRWxlbWVudCwgdGhpcy5zcm9vdC5xdWVyeVNlbGVjdG9yKCcubG9nbycpKVxuXHRcdHRoaXMubG9nby5vbmNsaWNrID0gKCkgPT4ge1xuXHRcdFx0bG9jYXRpb24uaGFzaCA9ICcnXG5cdFx0fVxuXHRcdFxuXHRcdGNvbnN0IG1lbnU6IE1lbnVDb21wb25lbnQgPSBuZXcgTWVudUNvbXBvbmVudCgpO1xuXHRcdG1lbnUucmVmcmVzaCgpXG5cdFx0dGhpcy5jaGFuZ2luZ1NlY3Rpb24ucGFyZW50RWxlbWVudCEucHJlcGVuZChtZW51KTtcblx0XHRcblx0XHQvLyB0aGlzLnByb2plY3RzQ29tcG9uZW50ID0gbmV3IFByb2plY3RzRWxlbWVudCgpO1xuXHRcdC8vIHByb2plY3RzLmFwcGVuZENoaWxkKHRoaXMucHJvamVjdHNDb21wb25lbnQuZWxlbWVudCk7XG5cdFx0XG5cdFx0Y29uc3Qgb25oYXNoY2hhbmdlID0gKCkgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2cobG9jYXRpb24uaGFzaClcblx0XHRcdFxuXHRcdFx0dGhpcy5jaGFuZ2luZ1NlY3Rpb24udGV4dENvbnRlbnQgPSAnJ1xuXHRcdFx0XG5cdFx0XHRpZiAobG9jYXRpb24uaGFzaCA9PSAnJylcblx0XHRcdHtcblx0XHRcdFx0aWYgKHRoaXMuZGFzaGJvYXJkcyA9PSBudWxsKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dGhpcy5kYXNoYm9hcmRzID0gbmV3IFN0YW5kYXJkRGFzaGJvYXJkc0NvbXBvbmVudCgpO1xuXHRcdFx0XHRcdHRoaXMuZGFzaGJvYXJkcy5yZWZyZXNoKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5jaGFuZ2luZ1NlY3Rpb24uYXBwZW5kQ2hpbGQodGhpcy5kYXNoYm9hcmRzKVxuXHRcdFx0XHRtZW51LnNlbGVjdEl0ZW0oJycpXG5cdFx0XHR9XG5cblx0XHRcdGlmIChsb2NhdGlvbi5oYXNoLmluZGV4T2YoJyNwYWdlPWRhdGFzZXQtY2F0ZWdvcmllcyYnKSA9PSAwKVxuXHRcdFx0e1xuXHRcdFx0XHR0aGlzLmNoYW5naW5nU2VjdGlvbi50ZXh0Q29udGVudCA9ICcnXG5cdFx0XHRcdGNvbnN0IGRldGFpbCA9IG5ldyBEYXRhc2V0Q2F0ZWdvcmllcygpO1xuXHRcdFx0XHR0aGlzLmNoYW5naW5nU2VjdGlvbi5hcHBlbmRDaGlsZChkZXRhaWwpXG5cdFx0XHRcdGNvbnN0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMobG9jYXRpb24uaGFzaC5zdWJzdHJpbmcoMSkpO1xuXHRcdFx0XHRjb25zdCBzZXNzaW9uX3N0YXJ0X3RzID0gY3Nfbm90bnVsbChwYXJhbXMuZ2V0KCdzZXNzaW9uX3N0YXJ0X3RzJykpXG5cdFx0XHRcdGNvbnN0IGRhdGFzZXRfbmFtZSA9IGNzX25vdG51bGwocGFyYW1zLmdldCgnZGF0YXNldF9uYW1lJykpXG5cdFx0XHRcdGNvbnN0IGZhaWxlZF9yZWNvcmRzID0gcGFyc2VJbnQoY3Nfbm90bnVsbChwYXJhbXMuZ2V0KCdmYWlsZWRfcmVjb3JkcycpKSlcblx0XHRcdFx0Y29uc3QgdGVzdGVkX3JlY29yZHMgPSBwYXJzZUludChjc19ub3RudWxsKHBhcmFtcy5nZXQoJ3Rlc3RlZF9yZWNvcmRzJykpKVxuXHRcdFx0XHRkZXRhaWwucmVmcmVzaChzZXNzaW9uX3N0YXJ0X3RzLCBkYXRhc2V0X25hbWUsIGZhaWxlZF9yZWNvcmRzLCB0ZXN0ZWRfcmVjb3Jkcyk7XG5cdFx0XHRcdG1lbnUuc2VsZWN0SXRlbShkYXRhc2V0X25hbWUpXG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdGlmIChsb2NhdGlvbi5oYXNoLnN0YXJ0c1dpdGgoJyNwYWdlPXN1bW1hcnkmJykpXG5cdFx0XHR7XG5cdFx0XHRcdHRoaXMuY2hhbmdpbmdTZWN0aW9uLnRleHRDb250ZW50ID0gJydcblx0XHRcdFx0Y29uc3QgZGV0YWlsID0gbmV3IERhdGFzZXRJc3N1ZXNEZXRhaWwoKTtcblx0XHRcdFx0dGhpcy5jaGFuZ2luZ1NlY3Rpb24uYXBwZW5kQ2hpbGQoZGV0YWlsKVxuXHRcdFx0XHRjb25zdCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKGxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKDEpKTtcblx0XHRcdFx0Y29uc3Qgc2Vzc2lvbl9zdGFydF90cyA9IGNzX25vdG51bGwocGFyYW1zLmdldCgnc2Vzc2lvbl9zdGFydF90cycpKVxuXHRcdFx0XHRjb25zdCBkYXRhc2V0X25hbWUgPSBjc19ub3RudWxsKHBhcmFtcy5nZXQoJ2RhdGFzZXRfbmFtZScpKVxuXHRcdFx0XHRjb25zdCBjYXRlZ29yeV9uYW1lID0gY3Nfbm90bnVsbChwYXJhbXMuZ2V0KCdjYXRlZ29yeV9uYW1lJykpXG5cdFx0XHRcdGNvbnN0IGZhaWxlZF9yZWNvcmRzID0gcGFyc2VJbnQoY3Nfbm90bnVsbChwYXJhbXMuZ2V0KCdmYWlsZWRfcmVjb3JkcycpKSlcblx0XHRcdFx0Y29uc3QgdG90X3JlY29yZHMgPSBwYXJzZUludChjc19ub3RudWxsKHBhcmFtcy5nZXQoJ3RvdF9yZWNvcmRzJykpKVxuXHRcdFx0XHRkZXRhaWwucmVmcmVzaChzZXNzaW9uX3N0YXJ0X3RzLCBkYXRhc2V0X25hbWUsIGNhdGVnb3J5X25hbWUsIGZhaWxlZF9yZWNvcmRzLCB0b3RfcmVjb3Jkcyk7XG5cdFx0XHRcdG1lbnUuc2VsZWN0SXRlbShkYXRhc2V0X25hbWUpXG5cdFx0XHR9XG5cdFx0fVxuXHRcdFxuXHRcdHdpbmRvdy5vbnBvcHN0YXRlID0gKGUpID0+IHtcblx0XHRcdG9uaGFzaGNoYW5nZSgpXG5cdFx0fVxuXG5cdFx0b25oYXNoY2hhbmdlKClcblxuXHRcdFxuXHR9XG5cdFxufVxuXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ2NzLW1haW4tY29tcG9uZW50JywgTWFpbkNvbXBvbmVudClcbiJdfQ==