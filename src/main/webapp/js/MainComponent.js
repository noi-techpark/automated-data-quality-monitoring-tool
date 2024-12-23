/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */
import { MenuElement } from './MenuElement.js';
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
        const menu = new MenuElement();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFpbkNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3R5cGVzY3JpcHQvTWFpbkNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sa0JBQWtCLENBQUE7QUFDNUMsT0FBTyxFQUFDLDJCQUEyQixFQUFDLE1BQU0sa0NBQWtDLENBQUE7QUFHNUUsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sMEJBQTBCLENBQUE7QUFDNUQsT0FBTyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDbkQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFFM0QsTUFBTSxPQUFPLGFBQWMsU0FBUSxXQUFXO0lBRTdDLEtBQUssQ0FBQTtJQUVMLFVBQVUsR0FBcUMsSUFBSSxDQUFDO0lBRXBELGVBQWUsQ0FBQTtJQUVmLElBQUksQ0FBQTtJQUVKO1FBRUMsS0FBSyxFQUFFLENBQUE7UUFDUCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQTtRQUNoRCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRzs7Ozs7Ozs7OztHQVV0QixDQUFBO1FBQ0QsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUUsQ0FBQTtRQUU3RCxJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO1FBQ3hFLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRTtZQUN4QixRQUFRLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQTtRQUNuQixDQUFDLENBQUE7UUFF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YUFBYSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUE7Z0JBQzdELE1BQU0sY0FBYyxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFDekUsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFDbkUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLGNBQWMsRUFBRSxXQUFXLENBQUMsQ0FBQztnQkFDM0YsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQTtZQUM5QixDQUFDO1FBQ0YsQ0FBQyxDQUFBO1FBRUQsTUFBTSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFO1lBQ3pCLFlBQVksRUFBRSxDQUFBO1FBQ2YsQ0FBQyxDQUFBO1FBRUQsWUFBWSxFQUFFLENBQUE7SUFHZixDQUFDO0NBRUQ7QUFFRCxjQUFjLENBQUMsTUFBTSxDQUFDLG1CQUFtQixFQUFFLGFBQWEsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIChDKSAyMDI0IENhdGNoIFNvbHZlIGRpIERhdmlkZSBNb250ZXNpblxuICogTGljZW5zZTogQUdQTFxuICovXG5cbmltcG9ydCB7TWVudUVsZW1lbnR9IGZyb20gJy4vTWVudUVsZW1lbnQuanMnXG5pbXBvcnQge1N0YW5kYXJkRGFzaGJvYXJkc0NvbXBvbmVudH0gZnJvbSAnLi9TdGFuZGFyZERhc2hib2FyZHNDb21wb25lbnQuanMnXG5cblxuaW1wb3J0IHtEYXRhc2V0SXNzdWVzRGV0YWlsfSBmcm9tICcuL0RhdGFzZXRJc3N1ZXNEZXRhaWwuanMnXG5pbXBvcnQgeyBjc19jYXN0LCBjc19ub3RudWxsIH0gZnJvbSAnLi9xdWFsaXR5LmpzJztcbmltcG9ydCB7IERhdGFzZXRDYXRlZ29yaWVzIH0gZnJvbSAnLi9EYXRhc2V0Q2F0ZWdvcmllcy5qcyc7XG5cbmV4cG9ydCBjbGFzcyBNYWluQ29tcG9uZW50IGV4dGVuZHMgSFRNTEVsZW1lbnRcbntcblx0c3Jvb3Rcblx0XG5cdGRhc2hib2FyZHM6IFN0YW5kYXJkRGFzaGJvYXJkc0NvbXBvbmVudHxudWxsID0gbnVsbDtcblx0XG5cdGNoYW5naW5nU2VjdGlvblxuXHRcblx0bG9nb1xuXG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXHRcdHN1cGVyKClcblx0XHR0aGlzLnNyb290ID0gdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSlcblx0XHR0aGlzLnNyb290LmlubmVySFRNTCA9IGBcblx0XHRcdDxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiBocmVmPVwiaW5kZXguY3NzXCI+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwiTWFpbkNvbXBvbmVudFwiPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiaGVhZGVyXCI+XG5cdFx0XHRcdFx0PGltZyBjbGFzcz1cImxvZ29cIiBzcmM9XCJOT0lfT1BFTkRBVEFIVUJfTkVXX0JLX25vc3BhY2UtMDEuc3ZnXCI+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiYm9keVwiPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwcm9qZWN0c1wiPjwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdGBcblx0XHR0aGlzLmNoYW5naW5nU2VjdGlvbiA9IHRoaXMuc3Jvb3QucXVlcnlTZWxlY3RvcignLnByb2plY3RzJykhXG5cdFx0XG5cdFx0dGhpcy5sb2dvID0gY3NfY2FzdChIVE1MSW1hZ2VFbGVtZW50LCB0aGlzLnNyb290LnF1ZXJ5U2VsZWN0b3IoJy5sb2dvJykpXG5cdFx0dGhpcy5sb2dvLm9uY2xpY2sgPSAoKSA9PiB7XG5cdFx0XHRsb2NhdGlvbi5oYXNoID0gJydcblx0XHR9XG5cdFx0XG5cdFx0Y29uc3QgbWVudTogTWVudUVsZW1lbnQgPSBuZXcgTWVudUVsZW1lbnQoKTtcblx0XHRtZW51LnJlZnJlc2goKVxuXHRcdHRoaXMuY2hhbmdpbmdTZWN0aW9uLnBhcmVudEVsZW1lbnQhLnByZXBlbmQobWVudSk7XG5cdFx0XG5cdFx0Ly8gdGhpcy5wcm9qZWN0c0NvbXBvbmVudCA9IG5ldyBQcm9qZWN0c0VsZW1lbnQoKTtcblx0XHQvLyBwcm9qZWN0cy5hcHBlbmRDaGlsZCh0aGlzLnByb2plY3RzQ29tcG9uZW50LmVsZW1lbnQpO1xuXHRcdFxuXHRcdGNvbnN0IG9uaGFzaGNoYW5nZSA9ICgpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKGxvY2F0aW9uLmhhc2gpXG5cdFx0XHRcblx0XHRcdHRoaXMuY2hhbmdpbmdTZWN0aW9uLnRleHRDb250ZW50ID0gJydcblx0XHRcdFxuXHRcdFx0aWYgKGxvY2F0aW9uLmhhc2ggPT0gJycpXG5cdFx0XHR7XG5cdFx0XHRcdGlmICh0aGlzLmRhc2hib2FyZHMgPT0gbnVsbClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHRoaXMuZGFzaGJvYXJkcyA9IG5ldyBTdGFuZGFyZERhc2hib2FyZHNDb21wb25lbnQoKTtcblx0XHRcdFx0XHR0aGlzLmRhc2hib2FyZHMucmVmcmVzaCgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuY2hhbmdpbmdTZWN0aW9uLmFwcGVuZENoaWxkKHRoaXMuZGFzaGJvYXJkcylcblx0XHRcdFx0bWVudS5zZWxlY3RJdGVtKCcnKVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAobG9jYXRpb24uaGFzaC5pbmRleE9mKCcjcGFnZT1kYXRhc2V0LWNhdGVnb3JpZXMmJykgPT0gMClcblx0XHRcdHtcblx0XHRcdFx0dGhpcy5jaGFuZ2luZ1NlY3Rpb24udGV4dENvbnRlbnQgPSAnJ1xuXHRcdFx0XHRjb25zdCBkZXRhaWwgPSBuZXcgRGF0YXNldENhdGVnb3JpZXMoKTtcblx0XHRcdFx0dGhpcy5jaGFuZ2luZ1NlY3Rpb24uYXBwZW5kQ2hpbGQoZGV0YWlsKVxuXHRcdFx0XHRjb25zdCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKGxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKDEpKTtcblx0XHRcdFx0Y29uc3Qgc2Vzc2lvbl9zdGFydF90cyA9IGNzX25vdG51bGwocGFyYW1zLmdldCgnc2Vzc2lvbl9zdGFydF90cycpKVxuXHRcdFx0XHRjb25zdCBkYXRhc2V0X25hbWUgPSBjc19ub3RudWxsKHBhcmFtcy5nZXQoJ2RhdGFzZXRfbmFtZScpKVxuXHRcdFx0XHRjb25zdCBmYWlsZWRfcmVjb3JkcyA9IHBhcnNlSW50KGNzX25vdG51bGwocGFyYW1zLmdldCgnZmFpbGVkX3JlY29yZHMnKSkpXG5cdFx0XHRcdGNvbnN0IHRlc3RlZF9yZWNvcmRzID0gcGFyc2VJbnQoY3Nfbm90bnVsbChwYXJhbXMuZ2V0KCd0ZXN0ZWRfcmVjb3JkcycpKSlcblx0XHRcdFx0ZGV0YWlsLnJlZnJlc2goc2Vzc2lvbl9zdGFydF90cywgZGF0YXNldF9uYW1lLCBmYWlsZWRfcmVjb3JkcywgdGVzdGVkX3JlY29yZHMpO1xuXHRcdFx0XHRtZW51LnNlbGVjdEl0ZW0oZGF0YXNldF9uYW1lKVxuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRpZiAobG9jYXRpb24uaGFzaC5zdGFydHNXaXRoKCcjcGFnZT1zdW1tYXJ5JicpKVxuXHRcdFx0e1xuXHRcdFx0XHR0aGlzLmNoYW5naW5nU2VjdGlvbi50ZXh0Q29udGVudCA9ICcnXG5cdFx0XHRcdGNvbnN0IGRldGFpbCA9IG5ldyBEYXRhc2V0SXNzdWVzRGV0YWlsKCk7XG5cdFx0XHRcdHRoaXMuY2hhbmdpbmdTZWN0aW9uLmFwcGVuZENoaWxkKGRldGFpbClcblx0XHRcdFx0Y29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhsb2NhdGlvbi5oYXNoLnN1YnN0cmluZygxKSk7XG5cdFx0XHRcdGNvbnN0IHNlc3Npb25fc3RhcnRfdHMgPSBjc19ub3RudWxsKHBhcmFtcy5nZXQoJ3Nlc3Npb25fc3RhcnRfdHMnKSlcblx0XHRcdFx0Y29uc3QgZGF0YXNldF9uYW1lID0gY3Nfbm90bnVsbChwYXJhbXMuZ2V0KCdkYXRhc2V0X25hbWUnKSlcblx0XHRcdFx0Y29uc3QgY2F0ZWdvcnlfbmFtZSA9IGNzX25vdG51bGwocGFyYW1zLmdldCgnY2F0ZWdvcnlfbmFtZScpKVxuXHRcdFx0XHRjb25zdCBmYWlsZWRfcmVjb3JkcyA9IHBhcnNlSW50KGNzX25vdG51bGwocGFyYW1zLmdldCgnZmFpbGVkX3JlY29yZHMnKSkpXG5cdFx0XHRcdGNvbnN0IHRvdF9yZWNvcmRzID0gcGFyc2VJbnQoY3Nfbm90bnVsbChwYXJhbXMuZ2V0KCd0b3RfcmVjb3JkcycpKSlcblx0XHRcdFx0ZGV0YWlsLnJlZnJlc2goc2Vzc2lvbl9zdGFydF90cywgZGF0YXNldF9uYW1lLCBjYXRlZ29yeV9uYW1lLCBmYWlsZWRfcmVjb3JkcywgdG90X3JlY29yZHMpO1xuXHRcdFx0XHRtZW51LnNlbGVjdEl0ZW0oZGF0YXNldF9uYW1lKVxuXHRcdFx0fVxuXHRcdH1cblx0XHRcblx0XHR3aW5kb3cub25wb3BzdGF0ZSA9IChlKSA9PiB7XG5cdFx0XHRvbmhhc2hjaGFuZ2UoKVxuXHRcdH1cblxuXHRcdG9uaGFzaGNoYW5nZSgpXG5cblx0XHRcblx0fVxuXHRcbn1cblxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCdjcy1tYWluLWNvbXBvbmVudCcsIE1haW5Db21wb25lbnQpXG4iXX0=