/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFpbkNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3R5cGVzY3JpcHQvTWFpbkNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sb0JBQW9CLENBQUE7QUFDaEQsT0FBTyxFQUFDLDJCQUEyQixFQUFDLE1BQU0sa0NBQWtDLENBQUE7QUFHNUUsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sMEJBQTBCLENBQUE7QUFDNUQsT0FBTyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDbkQsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFFM0UsTUFBTSxPQUFPLGFBQWMsU0FBUSxXQUFXO0lBRTdDLEtBQUssQ0FBQTtJQUVMLFVBQVUsR0FBcUMsSUFBSSxDQUFDO0lBRXBELGVBQWUsQ0FBQTtJQUVmLElBQUksQ0FBQTtJQUVKO1FBRUMsS0FBSyxFQUFFLENBQUE7UUFDUCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQTtRQUNoRCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRzs7Ozs7Ozs7Ozs7Ozs7O0dBZXRCLENBQUE7UUFDRCxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBRSxDQUFBO1FBRTdELElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUE7UUFDeEUsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxFQUFFO1lBQ3hCLFFBQVEsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFBO1FBQ25CLENBQUMsQ0FB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TUFBTSxhQUFhLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQTtnQkFDN0QsTUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFBO2dCQUN6RSxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFBO2dCQUNuRSxNQUFNLENBQUMsT0FBTyxDQUFDLGdCQUFnQixFQUFFLFlBQVksRUFBRSxhQUFhLEVBQUUsY0FBYyxFQUFFLFdBQVcsQ0FBQyxDQUFDO2dCQUMzRixJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFBO1lBQzlCLENBQUM7UUFDRixDQUFDLENBQUE7UUFFRCxNQUFNLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUU7WUFDekIsWUFBWSxFQUFFLENBQUE7UUFDZixDQUFDLENBQUE7UUFFRCxZQUFZLEVBQUUsQ0FBQTtJQUdmLENBQUM7Q0FFRDtBQUVELGNBQWMsQ0FBQyxNQUFNLENBQUMsbUJBQW1CLEVBQUUsYUFBYSxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogKEMpIDIwMjQgQ2F0Y2ggU29sdmUgZGkgRGF2aWRlIE1vbnRlc2luXG4gKiBMaWNlbnNlOiBBR1BMXG4gKi9cblxuaW1wb3J0IHtNZW51Q29tcG9uZW50fSBmcm9tICcuL01lbnVDb21wb25lbnQuanMnXG5pbXBvcnQge1N0YW5kYXJkRGFzaGJvYXJkc0NvbXBvbmVudH0gZnJvbSAnLi9TdGFuZGFyZERhc2hib2FyZHNDb21wb25lbnQuanMnXG5cblxuaW1wb3J0IHtEYXRhc2V0SXNzdWVzRGV0YWlsfSBmcm9tICcuL0RhdGFzZXRJc3N1ZXNEZXRhaWwuanMnXG5pbXBvcnQgeyBjc19jYXN0LCBjc19ub3RudWxsIH0gZnJvbSAnLi9xdWFsaXR5LmpzJztcbmltcG9ydCB7IERhdGFzZXRJc3N1ZXNCeUNhdGVnb3JpZXMgfSBmcm9tICcuL0RhdGFzZXRJc3N1ZXNCeUNhdGVnb3JpZXMuanMnO1xuXG5leHBvcnQgY2xhc3MgTWFpbkNvbXBvbmVudCBleHRlbmRzIEhUTUxFbGVtZW50XG57XG5cdHNyb290XG5cdFxuXHRkYXNoYm9hcmRzOiBTdGFuZGFyZERhc2hib2FyZHNDb21wb25lbnR8bnVsbCA9IG51bGw7XG5cdFxuXHRjaGFuZ2luZ1NlY3Rpb25cblx0XG5cdGxvZ29cblxuXHRjb25zdHJ1Y3RvcigpXG5cdHtcblx0XHRzdXBlcigpXG5cdFx0dGhpcy5zcm9vdCA9IHRoaXMuYXR0YWNoU2hhZG93KHsgbW9kZTogJ29wZW4nIH0pXG5cdFx0dGhpcy5zcm9vdC5pbm5lckhUTUwgPSBgXG5cdFx0XHQ8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgaHJlZj1cImluZGV4LmNzc1wiPlxuXHRcdFx0PHN0eWxlPlxuXHRcdFx0XHRjcy1tZW51LWVsZW1lbnQge1xuXHRcdFx0XHRcdHdpZHRoOiAxMnJlbTtcblx0XHRcdFx0fVxuXHRcdFx0PC9zdHlsZT5cblx0XHRcdDxkaXYgY2xhc3M9XCJNYWluQ29tcG9uZW50XCI+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJoZWFkZXJcIj5cblx0XHRcdFx0XHQ8aW1nIGNsYXNzPVwibG9nb1wiIHNyYz1cIk5PSV9PUEVOREFUQUhVQl9ORVdfQktfbm9zcGFjZS0wMS5zdmdcIj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJib2R5XCI+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cInByb2plY3RzXCI+PC9kaXY+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0PC9kaXY+XG5cdFx0YFxuXHRcdHRoaXMuY2hhbmdpbmdTZWN0aW9uID0gdGhpcy5zcm9vdC5xdWVyeVNlbGVjdG9yKCcucHJvamVjdHMnKSFcblx0XHRcblx0XHR0aGlzLmxvZ28gPSBjc19jYXN0KEhUTUxJbWFnZUVsZW1lbnQsIHRoaXMuc3Jvb3QucXVlcnlTZWxlY3RvcignLmxvZ28nKSlcblx0XHR0aGlzLmxvZ28ub25jbGljayA9ICgpID0+IHtcblx0XHRcdGxvY2F0aW9uLmhhc2ggPSAnJ1xuXHRcdH1cblx0XHRcblx0XHRjb25zdCBtZW51OiBNZW51Q29tcG9uZW50ID0gbmV3IE1lbnVDb21wb25lbnQoKTtcblx0XHRtZW51LnJlZnJlc2goKVxuXHRcdHRoaXMuY2hhbmdpbmdTZWN0aW9uLnBhcmVudEVsZW1lbnQhLnByZXBlbmQobWVudSk7XG5cdFx0XG5cdFx0Ly8gdGhpcy5wcm9qZWN0c0NvbXBvbmVudCA9IG5ldyBQcm9qZWN0c0VsZW1lbnQoKTtcblx0XHQvLyBwcm9qZWN0cy5hcHBlbmRDaGlsZCh0aGlzLnByb2plY3RzQ29tcG9uZW50LmVsZW1lbnQpO1xuXHRcdFxuXHRcdGNvbnN0IG9uaGFzaGNoYW5nZSA9ICgpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKGxvY2F0aW9uLmhhc2gpXG5cdFx0XHRcblx0XHRcdHRoaXMuY2hhbmdpbmdTZWN0aW9uLnRleHRDb250ZW50ID0gJydcblx0XHRcdFxuXHRcdFx0aWYgKGxvY2F0aW9uLmhhc2ggPT0gJycpXG5cdFx0XHR7XG5cdFx0XHRcdGlmICh0aGlzLmRhc2hib2FyZHMgPT0gbnVsbClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHRoaXMuZGFzaGJvYXJkcyA9IG5ldyBTdGFuZGFyZERhc2hib2FyZHNDb21wb25lbnQoKTtcblx0XHRcdFx0XHR0aGlzLmRhc2hib2FyZHMucmVmcmVzaCgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuY2hhbmdpbmdTZWN0aW9uLmFwcGVuZENoaWxkKHRoaXMuZGFzaGJvYXJkcylcblx0XHRcdFx0bWVudS5zZWxlY3RJdGVtKCcnKVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAobG9jYXRpb24uaGFzaC5pbmRleE9mKCcjcGFnZT1kYXRhc2V0LWNhdGVnb3JpZXMmJykgPT0gMClcblx0XHRcdHtcblx0XHRcdFx0dGhpcy5jaGFuZ2luZ1NlY3Rpb24udGV4dENvbnRlbnQgPSAnJ1xuXHRcdFx0XHRjb25zdCBkZXRhaWwgPSBuZXcgRGF0YXNldElzc3Vlc0J5Q2F0ZWdvcmllcygpO1xuXHRcdFx0XHR0aGlzLmNoYW5naW5nU2VjdGlvbi5hcHBlbmRDaGlsZChkZXRhaWwpXG5cdFx0XHRcdGNvbnN0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMobG9jYXRpb24uaGFzaC5zdWJzdHJpbmcoMSkpO1xuXHRcdFx0XHRjb25zdCBzZXNzaW9uX3N0YXJ0X3RzID0gY3Nfbm90bnVsbChwYXJhbXMuZ2V0KCdzZXNzaW9uX3N0YXJ0X3RzJykpXG5cdFx0XHRcdGNvbnN0IGRhdGFzZXRfbmFtZSA9IGNzX25vdG51bGwocGFyYW1zLmdldCgnZGF0YXNldF9uYW1lJykpXG5cdFx0XHRcdGNvbnN0IGZhaWxlZF9yZWNvcmRzID0gcGFyc2VJbnQoY3Nfbm90bnVsbChwYXJhbXMuZ2V0KCdmYWlsZWRfcmVjb3JkcycpKSlcblx0XHRcdFx0Y29uc3QgdGVzdGVkX3JlY29yZHMgPSBwYXJzZUludChjc19ub3RudWxsKHBhcmFtcy5nZXQoJ3Rlc3RlZF9yZWNvcmRzJykpKVxuXHRcdFx0XHRkZXRhaWwucmVmcmVzaChzZXNzaW9uX3N0YXJ0X3RzLCBkYXRhc2V0X25hbWUsIGZhaWxlZF9yZWNvcmRzLCB0ZXN0ZWRfcmVjb3Jkcyk7XG5cdFx0XHRcdG1lbnUuc2VsZWN0SXRlbShkYXRhc2V0X25hbWUpXG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdGlmIChsb2NhdGlvbi5oYXNoLnN0YXJ0c1dpdGgoJyNwYWdlPXN1bW1hcnkmJykpXG5cdFx0XHR7XG5cdFx0XHRcdHRoaXMuY2hhbmdpbmdTZWN0aW9uLnRleHRDb250ZW50ID0gJydcblx0XHRcdFx0Y29uc3QgZGV0YWlsID0gbmV3IERhdGFzZXRJc3N1ZXNEZXRhaWwoKTtcblx0XHRcdFx0dGhpcy5jaGFuZ2luZ1NlY3Rpb24uYXBwZW5kQ2hpbGQoZGV0YWlsKVxuXHRcdFx0XHRjb25zdCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKGxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKDEpKTtcblx0XHRcdFx0Y29uc3Qgc2Vzc2lvbl9zdGFydF90cyA9IGNzX25vdG51bGwocGFyYW1zLmdldCgnc2Vzc2lvbl9zdGFydF90cycpKVxuXHRcdFx0XHRjb25zdCBkYXRhc2V0X25hbWUgPSBjc19ub3RudWxsKHBhcmFtcy5nZXQoJ2RhdGFzZXRfbmFtZScpKVxuXHRcdFx0XHRjb25zdCBjYXRlZ29yeV9uYW1lID0gY3Nfbm90bnVsbChwYXJhbXMuZ2V0KCdjYXRlZ29yeV9uYW1lJykpXG5cdFx0XHRcdGNvbnN0IGZhaWxlZF9yZWNvcmRzID0gcGFyc2VJbnQoY3Nfbm90bnVsbChwYXJhbXMuZ2V0KCdmYWlsZWRfcmVjb3JkcycpKSlcblx0XHRcdFx0Y29uc3QgdG90X3JlY29yZHMgPSBwYXJzZUludChjc19ub3RudWxsKHBhcmFtcy5nZXQoJ3RvdF9yZWNvcmRzJykpKVxuXHRcdFx0XHRkZXRhaWwucmVmcmVzaChzZXNzaW9uX3N0YXJ0X3RzLCBkYXRhc2V0X25hbWUsIGNhdGVnb3J5X25hbWUsIGZhaWxlZF9yZWNvcmRzLCB0b3RfcmVjb3Jkcyk7XG5cdFx0XHRcdG1lbnUuc2VsZWN0SXRlbShkYXRhc2V0X25hbWUpXG5cdFx0XHR9XG5cdFx0fVxuXHRcdFxuXHRcdHdpbmRvdy5vbnBvcHN0YXRlID0gKGUpID0+IHtcblx0XHRcdG9uaGFzaGNoYW5nZSgpXG5cdFx0fVxuXG5cdFx0b25oYXNoY2hhbmdlKClcblxuXHRcdFxuXHR9XG5cdFxufVxuXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ2NzLW1haW4tY29tcG9uZW50JywgTWFpbkNvbXBvbmVudClcbiJdfQ==