// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later
import { MenuComponent } from './MenuComponent.js';
import { StandardDashboardsComponent } from './StandardDashboardsComponent.js';
import { DatasetIssuesDetail } from './DatasetIssuesDetail.js';
import { cs_cast, cs_notnull } from './quality.js';
import { DatasetIssuesByCategories } from './DatasetIssuesByCategories.js';
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
			<style>
				cs-menu-element {
					width: 12rem;
				}
			</style>
			<div class="MainComponent">
				<div class="header" style="position: relative">
					<img class="logo" src="NOI_OPENDATAHUB_NEW_BK_nospace-01.svg" >

					<a 
						href="https://europa.provincia.bz.it/it/informazione-e-visibilita-fesr"
					>
						<img src="https://databrowser.impact.digital.noi.bz.it/EFRmod.png"
							alt="Autonomous Province of Bolzano"
							style="position: absolute; top: 10px; right: 20px; height: 30px; " 
						>
					</a>
				</div>
				<div class="body" style="margin-top: 20px">
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
                const detail = new DatasetIssuesByCategories();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFpbkNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3R5cGVzY3JpcHQvTWFpbkNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw4REFBOEQ7QUFDOUQsRUFBRTtBQUNGLDZDQUE2QztBQUc3QyxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sb0JBQW9CLENBQUE7QUFDaEQsT0FBTyxFQUFDLDJCQUEyQixFQUFDLE1BQU0sa0NBQWtDLENBQUE7QUFHNUUsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sMEJBQTBCLENBQUE7QUFDNUQsT0FBTyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDbkQsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFFM0UsTUFBTSxPQUFPLGFBQWMsU0FBUSxXQUFXO0lBRTdDLEtBQUssQ0FBQTtJQUVMLFVBQVUsR0FBcUMsSUFBSSxDQUFDO0lBRXBELGVBQWUsQ0FBQTtJQUVmLElBQUksQ0FBQTtJQUVKO1FBRUMsS0FBSyxFQUFFLENBQUE7UUFDUCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQTtRQUNoRCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0J0QixDQUFBO1FBQ0QsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUUsQ0FBQTtRQUU3RCxJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO1FBQ3hFLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRTtZQUN4QixRQUFRLENBQUMs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RyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUE7Z0JBQzNELE1BQU0sYUFBYSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUE7Z0JBQzdELE1BQU0sY0FBYyxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFDekUsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFDbkUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLGNBQWMsRUFBRSxXQUFXLENBQUMsQ0FBQztnQkFDM0YsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQTtZQUM5QixDQUFDO1FBQ0YsQ0FBQyxDQUFBO1FBRUQsTUFBTSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFO1lBQ3pCLFlBQVksRUFBRSxDQUFBO1FBQ2YsQ0FBQyxDQUFBO1FBRUQsWUFBWSxFQUFFLENBQUE7SUFHZixDQUFDO0NBRUQ7QUFFRCxjQUFjLENBQUMsTUFBTSxDQUFDLG1CQUFtQixFQUFFLGFBQWEsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gU1BEWC1GaWxlQ29weXJpZ2h0VGV4dDogMjAyNCBDYXRjaCBTb2x2ZSBkaSBEYXZpZGUgTW9udGVzaW5cbi8vXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb3ItbGF0ZXJcblxuXG5pbXBvcnQge01lbnVDb21wb25lbnR9IGZyb20gJy4vTWVudUNvbXBvbmVudC5qcydcbmltcG9ydCB7U3RhbmRhcmREYXNoYm9hcmRzQ29tcG9uZW50fSBmcm9tICcuL1N0YW5kYXJkRGFzaGJvYXJkc0NvbXBvbmVudC5qcydcblxuXG5pbXBvcnQge0RhdGFzZXRJc3N1ZXNEZXRhaWx9IGZyb20gJy4vRGF0YXNldElzc3Vlc0RldGFpbC5qcydcbmltcG9ydCB7IGNzX2Nhc3QsIGNzX25vdG51bGwgfSBmcm9tICcuL3F1YWxpdHkuanMnO1xuaW1wb3J0IHsgRGF0YXNldElzc3Vlc0J5Q2F0ZWdvcmllcyB9IGZyb20gJy4vRGF0YXNldElzc3Vlc0J5Q2F0ZWdvcmllcy5qcyc7XG5cbmV4cG9ydCBjbGFzcyBNYWluQ29tcG9uZW50IGV4dGVuZHMgSFRNTEVsZW1lbnRcbntcblx0c3Jvb3Rcblx0XG5cdGRhc2hib2FyZHM6IFN0YW5kYXJkRGFzaGJvYXJkc0NvbXBvbmVudHxudWxsID0gbnVsbDtcblx0XG5cdGNoYW5naW5nU2VjdGlvblxuXHRcblx0bG9nb1xuXG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXHRcdHN1cGVyKClcblx0XHR0aGlzLnNyb290ID0gdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSlcblx0XHR0aGlzLnNyb290LmlubmVySFRNTCA9IGBcblx0XHRcdDxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiBocmVmPVwiaW5kZXguY3NzXCI+XG5cdFx0XHQ8c3R5bGU+XG5cdFx0XHRcdGNzLW1lbnUtZWxlbWVudCB7XG5cdFx0XHRcdFx0d2lkdGg6IDEycmVtO1xuXHRcdFx0XHR9XG5cdFx0XHQ8L3N0eWxlPlxuXHRcdFx0PGRpdiBjbGFzcz1cIk1haW5Db21wb25lbnRcIj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImhlYWRlclwiIHN0eWxlPVwicG9zaXRpb246IHJlbGF0aXZlXCI+XG5cdFx0XHRcdFx0PGltZyBjbGFzcz1cImxvZ29cIiBzcmM9XCJOT0lfT1BFTkRBVEFIVUJfTkVXX0JLX25vc3BhY2UtMDEuc3ZnXCIgPlxuXG5cdFx0XHRcdFx0PGEgXG5cdFx0XHRcdFx0XHRocmVmPVwiaHR0cHM6Ly9ldXJvcGEucHJvdmluY2lhLmJ6Lml0L2l0L2luZm9ybWF6aW9uZS1lLXZpc2liaWxpdGEtZmVzclwiXG5cdFx0XHRcdFx0PlxuXHRcdFx0XHRcdFx0PGltZyBzcmM9XCJodHRwczovL2RhdGFicm93c2VyLmltcGFjdC5kaWdpdGFsLm5vaS5iei5pdC9FRlJtb2QucG5nXCJcblx0XHRcdFx0XHRcdFx0YWx0PVwiQXV0b25vbW91cyBQcm92aW5jZSBvZiBCb2x6YW5vXCJcblx0XHRcdFx0XHRcdFx0c3R5bGU9XCJwb3NpdGlvbjogYWJzb2x1dGU7IHRvcDogMTBweDsgcmlnaHQ6IDIwcHg7IGhlaWdodDogMzBweDsgXCIgXG5cdFx0XHRcdFx0XHQ+XG5cdFx0XHRcdFx0PC9hPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImJvZHlcIiBzdHlsZT1cIm1hcmdpbi10b3A6IDIwcHhcIj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicHJvamVjdHNcIj48L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cblx0XHRgXG5cdFx0dGhpcy5jaGFuZ2luZ1NlY3Rpb24gPSB0aGlzLnNyb290LnF1ZXJ5U2VsZWN0b3IoJy5wcm9qZWN0cycpIVxuXHRcdFxuXHRcdHRoaXMubG9nbyA9IGNzX2Nhc3QoSFRNTEltYWdlRWxlbWVudCwgdGhpcy5zcm9vdC5xdWVyeVNlbGVjdG9yKCcubG9nbycpKVxuXHRcdHRoaXMubG9nby5vbmNsaWNrID0gKCkgPT4ge1xuXHRcdFx0bG9jYXRpb24uaGFzaCA9ICcnXG5cdFx0fVxuXHRcdFxuXHRcdGNvbnN0IG1lbnU6IE1lbnVDb21wb25lbnQgPSBuZXcgTWVudUNvbXBvbmVudCgpO1xuXHRcdG1lbnUucmVmcmVzaCgpXG5cdFx0dGhpcy5jaGFuZ2luZ1NlY3Rpb24ucGFyZW50RWxlbWVudCEucHJlcGVuZChtZW51KTtcblx0XHRcblx0XHQvLyB0aGlzLnByb2plY3RzQ29tcG9uZW50ID0gbmV3IFByb2plY3RzRWxlbWVudCgpO1xuXHRcdC8vIHByb2plY3RzLmFwcGVuZENoaWxkKHRoaXMucHJvamVjdHNDb21wb25lbnQuZWxlbWVudCk7XG5cdFx0XG5cdFx0Y29uc3Qgb25oYXNoY2hhbmdlID0gKCkgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2cobG9jYXRpb24uaGFzaClcblx0XHRcdFxuXHRcdFx0dGhpcy5jaGFuZ2luZ1NlY3Rpb24udGV4dENvbnRlbnQgPSAnJ1xuXHRcdFx0XG5cdFx0XHRpZiAobG9jYXRpb24uaGFzaCA9PSAnJylcblx0XHRcdHtcblx0XHRcdFx0aWYgKHRoaXMuZGFzaGJvYXJkcyA9PSBudWxsKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dGhpcy5kYXNoYm9hcmRzID0gbmV3IFN0YW5kYXJkRGFzaGJvYXJkc0NvbXBvbmVudCgpO1xuXHRcdFx0XHRcdHRoaXMuZGFzaGJvYXJkcy5yZWZyZXNoKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5jaGFuZ2luZ1NlY3Rpb24uYXBwZW5kQ2hpbGQodGhpcy5kYXNoYm9hcmRzKVxuXHRcdFx0XHRtZW51LnNlbGVjdEl0ZW0oJycpXG5cdFx0XHR9XG5cblx0XHRcdGlmIChsb2NhdGlvbi5oYXNoLmluZGV4T2YoJyNwYWdlPWRhdGFzZXQtY2F0ZWdvcmllcyYnKSA9PSAwKVxuXHRcdFx0e1xuXHRcdFx0XHR0aGlzLmNoYW5naW5nU2VjdGlvbi50ZXh0Q29udGVudCA9ICcnXG5cdFx0XHRcdGNvbnN0IGRldGFpbCA9IG5ldyBEYXRhc2V0SXNzdWVzQnlDYXRlZ29yaWVzKCk7XG5cdFx0XHRcdHRoaXMuY2hhbmdpbmdTZWN0aW9uLmFwcGVuZENoaWxkKGRldGFpbClcblx0XHRcdFx0Y29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhsb2NhdGlvbi5oYXNoLnN1YnN0cmluZygxKSk7XG5cdFx0XHRcdGNvbnN0IHNlc3Npb25fc3RhcnRfdHMgPSBjc19ub3RudWxsKHBhcmFtcy5nZXQoJ3Nlc3Npb25fc3RhcnRfdHMnKSlcblx0XHRcdFx0Y29uc3QgZGF0YXNldF9uYW1lID0gY3Nfbm90bnVsbChwYXJhbXMuZ2V0KCdkYXRhc2V0X25hbWUnKSlcblx0XHRcdFx0Y29uc3QgZmFpbGVkX3JlY29yZHMgPSBwYXJzZUludChjc19ub3RudWxsKHBhcmFtcy5nZXQoJ2ZhaWxlZF9yZWNvcmRzJykpKVxuXHRcdFx0XHRjb25zdCB0ZXN0ZWRfcmVjb3JkcyA9IHBhcnNlSW50KGNzX25vdG51bGwocGFyYW1zLmdldCgndGVzdGVkX3JlY29yZHMnKSkpXG5cdFx0XHRcdGRldGFpbC5yZWZyZXNoKHNlc3Npb25fc3RhcnRfdHMsIGRhdGFzZXRfbmFtZSwgZmFpbGVkX3JlY29yZHMsIHRlc3RlZF9yZWNvcmRzKTtcblx0XHRcdFx0bWVudS5zZWxlY3RJdGVtKGRhdGFzZXRfbmFtZSlcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0aWYgKGxvY2F0aW9uLmhhc2guc3RhcnRzV2l0aCgnI3BhZ2U9c3VtbWFyeSYnKSlcblx0XHRcdHtcblx0XHRcdFx0dGhpcy5jaGFuZ2luZ1NlY3Rpb24udGV4dENvbnRlbnQgPSAnJ1xuXHRcdFx0XHRjb25zdCBkZXRhaWwgPSBuZXcgRGF0YXNldElzc3Vlc0RldGFpbCgpO1xuXHRcdFx0XHR0aGlzLmNoYW5naW5nU2VjdGlvbi5hcHBlbmRDaGlsZChkZXRhaWwpXG5cdFx0XHRcdGNvbnN0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMobG9jYXRpb24uaGFzaC5zdWJzdHJpbmcoMSkpO1xuXHRcdFx0XHRjb25zdCBzZXNzaW9uX3N0YXJ0X3RzID0gY3Nfbm90bnVsbChwYXJhbXMuZ2V0KCdzZXNzaW9uX3N0YXJ0X3RzJykpXG5cdFx0XHRcdGNvbnN0IGRhdGFzZXRfbmFtZSA9IGNzX25vdG51bGwocGFyYW1zLmdldCgnZGF0YXNldF9uYW1lJykpXG5cdFx0XHRcdGNvbnN0IGNhdGVnb3J5X25hbWUgPSBjc19ub3RudWxsKHBhcmFtcy5nZXQoJ2NhdGVnb3J5X25hbWUnKSlcblx0XHRcdFx0Y29uc3QgZmFpbGVkX3JlY29yZHMgPSBwYXJzZUludChjc19ub3RudWxsKHBhcmFtcy5nZXQoJ2ZhaWxlZF9yZWNvcmRzJykpKVxuXHRcdFx0XHRjb25zdCB0b3RfcmVjb3JkcyA9IHBhcnNlSW50KGNzX25vdG51bGwocGFyYW1zLmdldCgndG90X3JlY29yZHMnKSkpXG5cdFx0XHRcdGRldGFpbC5yZWZyZXNoKHNlc3Npb25fc3RhcnRfdHMsIGRhdGFzZXRfbmFtZSwgY2F0ZWdvcnlfbmFtZSwgZmFpbGVkX3JlY29yZHMsIHRvdF9yZWNvcmRzKTtcblx0XHRcdFx0bWVudS5zZWxlY3RJdGVtKGRhdGFzZXRfbmFtZSlcblx0XHRcdH1cblx0XHR9XG5cdFx0XG5cdFx0d2luZG93Lm9ucG9wc3RhdGUgPSAoZSkgPT4ge1xuXHRcdFx0b25oYXNoY2hhbmdlKClcblx0XHR9XG5cblx0XHRvbmhhc2hjaGFuZ2UoKVxuXG5cdFx0XG5cdH1cblx0XG59XG5cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgnY3MtbWFpbi1jb21wb25lbnQnLCBNYWluQ29tcG9uZW50KVxuIl19