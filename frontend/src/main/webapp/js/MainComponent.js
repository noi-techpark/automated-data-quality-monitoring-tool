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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFpbkNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3R5cGVzY3JpcHQvTWFpbkNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw4REFBOEQ7QUFDOUQsRUFBRTtBQUNGLDZDQUE2QztBQUc3QyxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sb0JBQW9CLENBQUE7QUFDaEQsT0FBTyxFQUFDLDJCQUEyQixFQUFDLE1BQU0sa0NBQWtDLENBQUE7QUFHNUUsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sMEJBQTBCLENBQUE7QUFDNUQsT0FBTyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDbkQsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFFM0UsTUFBTSxPQUFPLGFBQWMsU0FBUSxXQUFXO0lBRTdDLEtBQUssQ0FBQTtJQUVMLFVBQVUsR0FBcUMsSUFBSSxDQUFDO0lBRXBELGVBQWUsQ0FBQTtJQUVmLElBQUksQ0FBQTtJQUVKO1FBRUMsS0FBSyxFQUFFLENBQUE7UUFDUCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQTtRQUNoRCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRzs7Ozs7Ozs7Ozs7Ozs7O0dBZXRCLENBQUE7UUFDRCxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBRSxDQUFBO1FBRTdELElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUE7UUFDeEUsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxFQUFFO1lBQ3hCLFFBQVEsQ0FBQyxJQUFJLEdBQUcs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YyxDQUFDLENBQUMsQ0FBQTtnQkFDM0QsTUFBTSxhQUFhLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQTtnQkFDN0QsTUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFBO2dCQUN6RSxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFBO2dCQUNuRSxNQUFNLENBQUMsT0FBTyxDQUFDLGdCQUFnQixFQUFFLFlBQVksRUFBRSxhQUFhLEVBQUUsY0FBYyxFQUFFLFdBQVcsQ0FBQyxDQUFDO2dCQUMzRixJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFBO1lBQzlCLENBQUM7UUFDRixDQUFDLENBQUE7UUFFRCxNQUFNLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUU7WUFDekIsWUFBWSxFQUFFLENBQUE7UUFDZixDQUFDLENBQUE7UUFFRCxZQUFZLEVBQUUsQ0FBQTtJQUdmLENBQUM7Q0FFRDtBQUVELGNBQWMsQ0FBQyxNQUFNLENBQUMsbUJBQW1CLEVBQUUsYUFBYSxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTUERYLUZpbGVDb3B5cmlnaHRUZXh0OiAyMDI0IENhdGNoIFNvbHZlIGRpIERhdmlkZSBNb250ZXNpblxuLy9cbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vci1sYXRlclxuXG5cbmltcG9ydCB7TWVudUNvbXBvbmVudH0gZnJvbSAnLi9NZW51Q29tcG9uZW50LmpzJ1xuaW1wb3J0IHtTdGFuZGFyZERhc2hib2FyZHNDb21wb25lbnR9IGZyb20gJy4vU3RhbmRhcmREYXNoYm9hcmRzQ29tcG9uZW50LmpzJ1xuXG5cbmltcG9ydCB7RGF0YXNldElzc3Vlc0RldGFpbH0gZnJvbSAnLi9EYXRhc2V0SXNzdWVzRGV0YWlsLmpzJ1xuaW1wb3J0IHsgY3NfY2FzdCwgY3Nfbm90bnVsbCB9IGZyb20gJy4vcXVhbGl0eS5qcyc7XG5pbXBvcnQgeyBEYXRhc2V0SXNzdWVzQnlDYXRlZ29yaWVzIH0gZnJvbSAnLi9EYXRhc2V0SXNzdWVzQnlDYXRlZ29yaWVzLmpzJztcblxuZXhwb3J0IGNsYXNzIE1haW5Db21wb25lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudFxue1xuXHRzcm9vdFxuXHRcblx0ZGFzaGJvYXJkczogU3RhbmRhcmREYXNoYm9hcmRzQ29tcG9uZW50fG51bGwgPSBudWxsO1xuXHRcblx0Y2hhbmdpbmdTZWN0aW9uXG5cdFxuXHRsb2dvXG5cblx0Y29uc3RydWN0b3IoKVxuXHR7XG5cdFx0c3VwZXIoKVxuXHRcdHRoaXMuc3Jvb3QgPSB0aGlzLmF0dGFjaFNoYWRvdyh7IG1vZGU6ICdvcGVuJyB9KVxuXHRcdHRoaXMuc3Jvb3QuaW5uZXJIVE1MID0gYFxuXHRcdFx0PGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIGhyZWY9XCJpbmRleC5jc3NcIj5cblx0XHRcdDxzdHlsZT5cblx0XHRcdFx0Y3MtbWVudS1lbGVtZW50IHtcblx0XHRcdFx0XHR3aWR0aDogMTJyZW07XG5cdFx0XHRcdH1cblx0XHRcdDwvc3R5bGU+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwiTWFpbkNvbXBvbmVudFwiPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiaGVhZGVyXCI+XG5cdFx0XHRcdFx0PGltZyBjbGFzcz1cImxvZ29cIiBzcmM9XCJOT0lfT1BFTkRBVEFIVUJfTkVXX0JLX25vc3BhY2UtMDEuc3ZnXCI+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiYm9keVwiPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwcm9qZWN0c1wiPjwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdGBcblx0XHR0aGlzLmNoYW5naW5nU2VjdGlvbiA9IHRoaXMuc3Jvb3QucXVlcnlTZWxlY3RvcignLnByb2plY3RzJykhXG5cdFx0XG5cdFx0dGhpcy5sb2dvID0gY3NfY2FzdChIVE1MSW1hZ2VFbGVtZW50LCB0aGlzLnNyb290LnF1ZXJ5U2VsZWN0b3IoJy5sb2dvJykpXG5cdFx0dGhpcy5sb2dvLm9uY2xpY2sgPSAoKSA9PiB7XG5cdFx0XHRsb2NhdGlvbi5oYXNoID0gJydcblx0XHR9XG5cdFx0XG5cdFx0Y29uc3QgbWVudTogTWVudUNvbXBvbmVudCA9IG5ldyBNZW51Q29tcG9uZW50KCk7XG5cdFx0bWVudS5yZWZyZXNoKClcblx0XHR0aGlzLmNoYW5naW5nU2VjdGlvbi5wYXJlbnRFbGVtZW50IS5wcmVwZW5kKG1lbnUpO1xuXHRcdFxuXHRcdC8vIHRoaXMucHJvamVjdHNDb21wb25lbnQgPSBuZXcgUHJvamVjdHNFbGVtZW50KCk7XG5cdFx0Ly8gcHJvamVjdHMuYXBwZW5kQ2hpbGQodGhpcy5wcm9qZWN0c0NvbXBvbmVudC5lbGVtZW50KTtcblx0XHRcblx0XHRjb25zdCBvbmhhc2hjaGFuZ2UgPSAoKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhsb2NhdGlvbi5oYXNoKVxuXHRcdFx0XG5cdFx0XHR0aGlzLmNoYW5naW5nU2VjdGlvbi50ZXh0Q29udGVudCA9ICcnXG5cdFx0XHRcblx0XHRcdGlmIChsb2NhdGlvbi5oYXNoID09ICcnKVxuXHRcdFx0e1xuXHRcdFx0XHRpZiAodGhpcy5kYXNoYm9hcmRzID09IG51bGwpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR0aGlzLmRhc2hib2FyZHMgPSBuZXcgU3RhbmRhcmREYXNoYm9hcmRzQ29tcG9uZW50KCk7XG5cdFx0XHRcdFx0dGhpcy5kYXNoYm9hcmRzLnJlZnJlc2goKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLmNoYW5naW5nU2VjdGlvbi5hcHBlbmRDaGlsZCh0aGlzLmRhc2hib2FyZHMpXG5cdFx0XHRcdG1lbnUuc2VsZWN0SXRlbSgnJylcblx0XHRcdH1cblxuXHRcdFx0aWYgKGxvY2F0aW9uLmhhc2guaW5kZXhPZignI3BhZ2U9ZGF0YXNldC1jYXRlZ29yaWVzJicpID09IDApXG5cdFx0XHR7XG5cdFx0XHRcdHRoaXMuY2hhbmdpbmdTZWN0aW9uLnRleHRDb250ZW50ID0gJydcblx0XHRcdFx0Y29uc3QgZGV0YWlsID0gbmV3IERhdGFzZXRJc3N1ZXNCeUNhdGVnb3JpZXMoKTtcblx0XHRcdFx0dGhpcy5jaGFuZ2luZ1NlY3Rpb24uYXBwZW5kQ2hpbGQoZGV0YWlsKVxuXHRcdFx0XHRjb25zdCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKGxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKDEpKTtcblx0XHRcdFx0Y29uc3Qgc2Vzc2lvbl9zdGFydF90cyA9IGNzX25vdG51bGwocGFyYW1zLmdldCgnc2Vzc2lvbl9zdGFydF90cycpKVxuXHRcdFx0XHRjb25zdCBkYXRhc2V0X25hbWUgPSBjc19ub3RudWxsKHBhcmFtcy5nZXQoJ2RhdGFzZXRfbmFtZScpKVxuXHRcdFx0XHRjb25zdCBmYWlsZWRfcmVjb3JkcyA9IHBhcnNlSW50KGNzX25vdG51bGwocGFyYW1zLmdldCgnZmFpbGVkX3JlY29yZHMnKSkpXG5cdFx0XHRcdGNvbnN0IHRlc3RlZF9yZWNvcmRzID0gcGFyc2VJbnQoY3Nfbm90bnVsbChwYXJhbXMuZ2V0KCd0ZXN0ZWRfcmVjb3JkcycpKSlcblx0XHRcdFx0ZGV0YWlsLnJlZnJlc2goc2Vzc2lvbl9zdGFydF90cywgZGF0YXNldF9uYW1lLCBmYWlsZWRfcmVjb3JkcywgdGVzdGVkX3JlY29yZHMpO1xuXHRcdFx0XHRtZW51LnNlbGVjdEl0ZW0oZGF0YXNldF9uYW1lKVxuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRpZiAobG9jYXRpb24uaGFzaC5zdGFydHNXaXRoKCcjcGFnZT1zdW1tYXJ5JicpKVxuXHRcdFx0e1xuXHRcdFx0XHR0aGlzLmNoYW5naW5nU2VjdGlvbi50ZXh0Q29udGVudCA9ICcnXG5cdFx0XHRcdGNvbnN0IGRldGFpbCA9IG5ldyBEYXRhc2V0SXNzdWVzRGV0YWlsKCk7XG5cdFx0XHRcdHRoaXMuY2hhbmdpbmdTZWN0aW9uLmFwcGVuZENoaWxkKGRldGFpbClcblx0XHRcdFx0Y29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhsb2NhdGlvbi5oYXNoLnN1YnN0cmluZygxKSk7XG5cdFx0XHRcdGNvbnN0IHNlc3Npb25fc3RhcnRfdHMgPSBjc19ub3RudWxsKHBhcmFtcy5nZXQoJ3Nlc3Npb25fc3RhcnRfdHMnKSlcblx0XHRcdFx0Y29uc3QgZGF0YXNldF9uYW1lID0gY3Nfbm90bnVsbChwYXJhbXMuZ2V0KCdkYXRhc2V0X25hbWUnKSlcblx0XHRcdFx0Y29uc3QgY2F0ZWdvcnlfbmFtZSA9IGNzX25vdG51bGwocGFyYW1zLmdldCgnY2F0ZWdvcnlfbmFtZScpKVxuXHRcdFx0XHRjb25zdCBmYWlsZWRfcmVjb3JkcyA9IHBhcnNlSW50KGNzX25vdG51bGwocGFyYW1zLmdldCgnZmFpbGVkX3JlY29yZHMnKSkpXG5cdFx0XHRcdGNvbnN0IHRvdF9yZWNvcmRzID0gcGFyc2VJbnQoY3Nfbm90bnVsbChwYXJhbXMuZ2V0KCd0b3RfcmVjb3JkcycpKSlcblx0XHRcdFx0ZGV0YWlsLnJlZnJlc2goc2Vzc2lvbl9zdGFydF90cywgZGF0YXNldF9uYW1lLCBjYXRlZ29yeV9uYW1lLCBmYWlsZWRfcmVjb3JkcywgdG90X3JlY29yZHMpO1xuXHRcdFx0XHRtZW51LnNlbGVjdEl0ZW0oZGF0YXNldF9uYW1lKVxuXHRcdFx0fVxuXHRcdH1cblx0XHRcblx0XHR3aW5kb3cub25wb3BzdGF0ZSA9IChlKSA9PiB7XG5cdFx0XHRvbmhhc2hjaGFuZ2UoKVxuXHRcdH1cblxuXHRcdG9uaGFzaGNoYW5nZSgpXG5cblx0XHRcblx0fVxuXHRcbn1cblxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCdjcy1tYWluLWNvbXBvbmVudCcsIE1haW5Db21wb25lbnQpXG4iXX0=