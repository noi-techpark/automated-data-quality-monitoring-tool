/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */
import { Component } from './Component.js';
import { MenuElement } from './MenuElement.js';
import { ProjectsElement } from './ProjectsElement.js';
import { DatasetIssuesDetail } from './DatasetIssuesDetail.js';
import { cs_cast, cs_notnull } from './quality.js';
import { DatasetCategories } from './DatasetCategories.js';
export class MainComponent extends Component {
    projectsComponent = null;
    changingSection;
    logo;
    constructor() {
        super();
        this.element.innerHTML = `
			<div class="header">
				<img class="logo" src="NOI_OPENDATAHUB_NEW_BK_nospace-01.svg">
			</div>
			<div class="body">
				<div class="projects"></div>
			</div>
		`;
        this.changingSection = this.element.querySelector('.projects');
        this.logo = cs_cast(HTMLImageElement, this.element.querySelector('.logo'));
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
                if (this.projectsComponent == null) {
                    this.projectsComponent = new ProjectsElement();
                    this.projectsComponent.refresh();
                }
                this.changingSection.appendChild(this.projectsComponent.element);
                menu.selectItem('');
            }
            if (location.hash.indexOf('#page=dataset-categories&') == 0) {
                this.changingSection.textContent = '';
                const detail = new DatasetCategories();
                this.changingSection.appendChild(detail);
                const params = new URLSearchParams(location.hash.substring(1));
                const session_start_ts = cs_notnull(params.get('session_start_ts'));
                const dataset_name = cs_notnull(params.get('dataset_name'));
                detail.refresh(session_start_ts, dataset_name);
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
                detail.refresh(session_start_ts, dataset_name, category_name);
                menu.selectItem(dataset_name);
            }
        };
        window.onpopstate = (e) => {
            onhashchange();
        };
        onhashchange();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFpbkNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3R5cGVzY3JpcHQvTWFpbkNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUE7QUFDeEMsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGtCQUFrQixDQUFBO0FBQzVDLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQTtBQUdwRCxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQTtBQUM1RCxPQUFPLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUNuRCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUUzRCxNQUFNLE9BQU8sYUFBYyxTQUFRLFNBQVM7SUFFM0MsaUJBQWlCLEdBQXlCLElBQUksQ0FBQztJQUUvQyxlQUFlLENBQUE7SUFFZixJQUFJLENBQUE7SUFFSjtRQUVDLEtBQUssRUFBRSxDQUFBO1FBQ1AsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUc7Ozs7Ozs7R0FPeEIsQ0FBQTtRQUNELElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFFLENBQUE7UUFFL0QsSUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQTtRQUMxRSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxHQUFHLEVBQUU7WUFDeEIsUUFBUSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUE7UUFDbkIsQ0FBQyxDQUFBO1FBRUQsTUFBTSxJQUFJLEdBQWdCLElBQUksV0FBVyxFQUFFLENBQUM7UUFDNUMsSUFBSSxDQUFDLE9B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QUN6QixZQUFZLEVBQUUsQ0FBQTtRQUNmLENBQUMsQ0FBQTtRQUVELFlBQVksRUFBRSxDQUFBO0lBR2YsQ0FBQztDQUVEIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIChDKSAyMDI0IENhdGNoIFNvbHZlIGRpIERhdmlkZSBNb250ZXNpblxuICogTGljZW5zZTogQUdQTFxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50fSBmcm9tICcuL0NvbXBvbmVudC5qcydcbmltcG9ydCB7TWVudUVsZW1lbnR9IGZyb20gJy4vTWVudUVsZW1lbnQuanMnXG5pbXBvcnQge1Byb2plY3RzRWxlbWVudH0gZnJvbSAnLi9Qcm9qZWN0c0VsZW1lbnQuanMnXG5cblxuaW1wb3J0IHtEYXRhc2V0SXNzdWVzRGV0YWlsfSBmcm9tICcuL0RhdGFzZXRJc3N1ZXNEZXRhaWwuanMnXG5pbXBvcnQgeyBjc19jYXN0LCBjc19ub3RudWxsIH0gZnJvbSAnLi9xdWFsaXR5LmpzJztcbmltcG9ydCB7IERhdGFzZXRDYXRlZ29yaWVzIH0gZnJvbSAnLi9EYXRhc2V0Q2F0ZWdvcmllcy5qcyc7XG5cbmV4cG9ydCBjbGFzcyBNYWluQ29tcG9uZW50IGV4dGVuZHMgQ29tcG9uZW50XG57XG5cdHByb2plY3RzQ29tcG9uZW50OiBQcm9qZWN0c0VsZW1lbnR8bnVsbCA9IG51bGw7XG5cdFxuXHRjaGFuZ2luZ1NlY3Rpb25cblx0XG5cdGxvZ29cblxuXHRjb25zdHJ1Y3RvcigpXG5cdHtcblx0XHRzdXBlcigpXG5cdFx0dGhpcy5lbGVtZW50LmlubmVySFRNTCA9IGBcblx0XHRcdDxkaXYgY2xhc3M9XCJoZWFkZXJcIj5cblx0XHRcdFx0PGltZyBjbGFzcz1cImxvZ29cIiBzcmM9XCJOT0lfT1BFTkRBVEFIVUJfTkVXX0JLX25vc3BhY2UtMDEuc3ZnXCI+XG5cdFx0XHQ8L2Rpdj5cblx0XHRcdDxkaXYgY2xhc3M9XCJib2R5XCI+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJwcm9qZWN0c1wiPjwvZGl2PlxuXHRcdFx0PC9kaXY+XG5cdFx0YFxuXHRcdHRoaXMuY2hhbmdpbmdTZWN0aW9uID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9qZWN0cycpIVxuXHRcdFxuXHRcdHRoaXMubG9nbyA9IGNzX2Nhc3QoSFRNTEltYWdlRWxlbWVudCwgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sb2dvJykpXG5cdFx0dGhpcy5sb2dvLm9uY2xpY2sgPSAoKSA9PiB7XG5cdFx0XHRsb2NhdGlvbi5oYXNoID0gJydcblx0XHR9XG5cdFx0XG5cdFx0Y29uc3QgbWVudTogTWVudUVsZW1lbnQgPSBuZXcgTWVudUVsZW1lbnQoKTtcblx0XHRtZW51LnJlZnJlc2goKVxuXHRcdHRoaXMuY2hhbmdpbmdTZWN0aW9uLnBhcmVudEVsZW1lbnQhLnByZXBlbmQobWVudSk7XG5cdFx0XG5cdFx0Ly8gdGhpcy5wcm9qZWN0c0NvbXBvbmVudCA9IG5ldyBQcm9qZWN0c0VsZW1lbnQoKTtcblx0XHQvLyBwcm9qZWN0cy5hcHBlbmRDaGlsZCh0aGlzLnByb2plY3RzQ29tcG9uZW50LmVsZW1lbnQpO1xuXHRcdFxuXHRcdGNvbnN0IG9uaGFzaGNoYW5nZSA9ICgpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKGxvY2F0aW9uLmhhc2gpXG5cdFx0XHRcblx0XHRcdHRoaXMuY2hhbmdpbmdTZWN0aW9uLnRleHRDb250ZW50ID0gJydcblx0XHRcdFxuXHRcdFx0aWYgKGxvY2F0aW9uLmhhc2ggPT0gJycpXG5cdFx0XHR7XG5cdFx0XHRcdGlmICh0aGlzLnByb2plY3RzQ29tcG9uZW50ID09IG51bGwpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR0aGlzLnByb2plY3RzQ29tcG9uZW50ID0gbmV3IFByb2plY3RzRWxlbWVudCgpO1xuXHRcdFx0XHRcdHRoaXMucHJvamVjdHNDb21wb25lbnQucmVmcmVzaCgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuY2hhbmdpbmdTZWN0aW9uLmFwcGVuZENoaWxkKHRoaXMucHJvamVjdHNDb21wb25lbnQuZWxlbWVudClcblx0XHRcdFx0bWVudS5zZWxlY3RJdGVtKCcnKVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAobG9jYXRpb24uaGFzaC5pbmRleE9mKCcjcGFnZT1kYXRhc2V0LWNhdGVnb3JpZXMmJykgPT0gMClcblx0XHRcdHtcblx0XHRcdFx0dGhpcy5jaGFuZ2luZ1NlY3Rpb24udGV4dENvbnRlbnQgPSAnJ1xuXHRcdFx0XHRjb25zdCBkZXRhaWwgPSBuZXcgRGF0YXNldENhdGVnb3JpZXMoKTtcblx0XHRcdFx0dGhpcy5jaGFuZ2luZ1NlY3Rpb24uYXBwZW5kQ2hpbGQoZGV0YWlsKVxuXHRcdFx0XHRjb25zdCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKGxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKDEpKTtcblx0XHRcdFx0Y29uc3Qgc2Vzc2lvbl9zdGFydF90cyA9IGNzX25vdG51bGwocGFyYW1zLmdldCgnc2Vzc2lvbl9zdGFydF90cycpKVxuXHRcdFx0XHRjb25zdCBkYXRhc2V0X25hbWUgPSBjc19ub3RudWxsKHBhcmFtcy5nZXQoJ2RhdGFzZXRfbmFtZScpKVxuXHRcdFx0XHRkZXRhaWwucmVmcmVzaChzZXNzaW9uX3N0YXJ0X3RzLCBkYXRhc2V0X25hbWUpO1xuXHRcdFx0XHRtZW51LnNlbGVjdEl0ZW0oZGF0YXNldF9uYW1lKVxuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRpZiAobG9jYXRpb24uaGFzaC5zdGFydHNXaXRoKCcjcGFnZT1zdW1tYXJ5JicpKVxuXHRcdFx0e1xuXHRcdFx0XHR0aGlzLmNoYW5naW5nU2VjdGlvbi50ZXh0Q29udGVudCA9ICcnXG5cdFx0XHRcdGNvbnN0IGRldGFpbCA9IG5ldyBEYXRhc2V0SXNzdWVzRGV0YWlsKCk7XG5cdFx0XHRcdHRoaXMuY2hhbmdpbmdTZWN0aW9uLmFwcGVuZENoaWxkKGRldGFpbClcblx0XHRcdFx0Y29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhsb2NhdGlvbi5oYXNoLnN1YnN0cmluZygxKSk7XG5cdFx0XHRcdGNvbnN0IHNlc3Npb25fc3RhcnRfdHMgPSBjc19ub3RudWxsKHBhcmFtcy5nZXQoJ3Nlc3Npb25fc3RhcnRfdHMnKSlcblx0XHRcdFx0Y29uc3QgZGF0YXNldF9uYW1lID0gY3Nfbm90bnVsbChwYXJhbXMuZ2V0KCdkYXRhc2V0X25hbWUnKSlcblx0XHRcdFx0Y29uc3QgY2F0ZWdvcnlfbmFtZSA9IGNzX25vdG51bGwocGFyYW1zLmdldCgnY2F0ZWdvcnlfbmFtZScpKVxuXHRcdFx0XHRkZXRhaWwucmVmcmVzaChzZXNzaW9uX3N0YXJ0X3RzLCBkYXRhc2V0X25hbWUsIGNhdGVnb3J5X25hbWUpO1xuXHRcdFx0XHRtZW51LnNlbGVjdEl0ZW0oZGF0YXNldF9uYW1lKVxuXHRcdFx0fVxuXHRcdH1cblx0XHRcblx0XHR3aW5kb3cub25wb3BzdGF0ZSA9IChlKSA9PiB7XG5cdFx0XHRvbmhhc2hjaGFuZ2UoKVxuXHRcdH1cblxuXHRcdG9uaGFzaGNoYW5nZSgpXG5cblx0XHRcblx0fVxuXHRcbn1cbiJdfQ==