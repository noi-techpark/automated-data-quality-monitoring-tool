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
        this.changingSection.parentElement.prepend(menu.element);
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
            }
            if (location.hash.indexOf('#page=dataset-categories&') == 0) {
                this.changingSection.textContent = '';
                const detail = new DatasetCategories();
                this.changingSection.appendChild(detail);
                const params = new URLSearchParams(location.hash.substring(1));
                const session_start_ts = cs_notnull(params.get('session_start_ts'));
                const dataset_name = cs_notnull(params.get('dataset_name'));
                detail.refresh(session_start_ts, dataset_name);
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
            }
        };
        window.onpopstate = (e) => {
            onhashchange();
        };
        onhashchange();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFpbkNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3R5cGVzY3JpcHQvTWFpbkNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUE7QUFDeEMsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGtCQUFrQixDQUFBO0FBQzVDLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQTtBQUdwRCxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQTtBQUM1RCxPQUFPLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUNuRCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUUzRCxNQUFNLE9BQU8sYUFBYyxTQUFRLFNBQVM7SUFFM0MsaUJBQWlCLEdBQXlCLElBQUksQ0FBQztJQUUvQyxlQUFlLENBQUE7SUFFZixJQUFJLENBQUE7SUFFSjtRQUVDLEtBQUssRUFBRSxDQUFBO1FBQ1AsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUc7Ozs7Ozs7R0FPeEIsQ0FBQTtRQUNELElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFFLENBQUE7UUFFL0QsSUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQTtRQUMxRSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxHQUFHLEVBQUU7WUFDeEIsUUFBUSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUE7UUFDbkIsQ0FBQyxDQUFBO1FBRUQsTUFBTSxJQUFJLEdBQWdCLElBQUksV0FBVyxFQUFFLENBQUM7UUFDNUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxhQUFjLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUUxRCxrREFBa0Q7UUFDbEQsd0RBQXdEO1FBRXhELE1BQU0sWUFBWSxHQUFHLEdBQUcsRUFBRTtZQUN6QixPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUUxQixJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUE7WUFFckMsSUFBSSxRQUFRLENBQUMsSUFBSSxJQUFJLEVBQUUsRUFDdkIsQ0FBQztnQkFDQSxJQUFJLElBQUksQ0FBQyxpQkFBaUIsSUFBSSxJQUFJLEVBQ2xDLENBQUM7b0JBQ0EsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksZUFBZSxFQUFFLENBQUM7b0JBQy9DLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDbEMsQ0FBQztnQkFDRCxJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUE7WUFDakUsQ0FBQztZQUVELElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsMkJBQTJCLENBQUMsSUFBSSxDQUFDLEVBQzNELENBQUM7Z0JBQ0EsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFBO2dCQUNyQyxNQUFNLE1BQU0sR0FBRyxJQUFJLGlCQUFpQixFQUFFLENBQUM7Z0JBQ3ZDLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFBO2dCQUN4QyxNQUFNLE1BQU0sR0FBRyxJQUFJLGVBQWUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMvRCxNQUFNLGdCQUFnQixHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQTtnQkFDbkUsTUFBTSxZQUFZLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQTtnQkFDM0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxZQUFZLENBQUMsQ0FBQztZQUNoRCxDQUFDO1lBRUQsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUM5QyxDQUFDO2dCQUNBLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQTtnQkFDckMsTUFBTSxNQUFNLEdBQUcsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO2dCQUN6QyxJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtnQkFDeEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxlQUFlLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDL0QsTUFBTSxnQkFBZ0IsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUE7Z0JBQ25FLE1BQU0sWUFBWSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUE7Z0JBQzNELE1BQU0sYUFBYSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUE7Z0JBQzdELE1BQU0sQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsWUFBWSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBQy9ELENBQUM7UUFDRixDQUFDLENBQUE7UUFFRCxNQUFNLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUU7WUFDekIsWUFBWSxFQUFFLENBQUE7UUFDZixDQUFDLENBQUE7UUFFRCxZQUFZLEVBQUUsQ0FBQTtJQUdmLENBQUM7Q0FFRCIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAoQykgMjAyNCBDYXRjaCBTb2x2ZSBkaSBEYXZpZGUgTW9udGVzaW5cbiAqIExpY2Vuc2U6IEFHUExcbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudH0gZnJvbSAnLi9Db21wb25lbnQuanMnXG5pbXBvcnQge01lbnVFbGVtZW50fSBmcm9tICcuL01lbnVFbGVtZW50LmpzJ1xuaW1wb3J0IHtQcm9qZWN0c0VsZW1lbnR9IGZyb20gJy4vUHJvamVjdHNFbGVtZW50LmpzJ1xuXG5cbmltcG9ydCB7RGF0YXNldElzc3Vlc0RldGFpbH0gZnJvbSAnLi9EYXRhc2V0SXNzdWVzRGV0YWlsLmpzJ1xuaW1wb3J0IHsgY3NfY2FzdCwgY3Nfbm90bnVsbCB9IGZyb20gJy4vcXVhbGl0eS5qcyc7XG5pbXBvcnQgeyBEYXRhc2V0Q2F0ZWdvcmllcyB9IGZyb20gJy4vRGF0YXNldENhdGVnb3JpZXMuanMnO1xuXG5leHBvcnQgY2xhc3MgTWFpbkNvbXBvbmVudCBleHRlbmRzIENvbXBvbmVudFxue1xuXHRwcm9qZWN0c0NvbXBvbmVudDogUHJvamVjdHNFbGVtZW50fG51bGwgPSBudWxsO1xuXHRcblx0Y2hhbmdpbmdTZWN0aW9uXG5cdFxuXHRsb2dvXG5cblx0Y29uc3RydWN0b3IoKVxuXHR7XG5cdFx0c3VwZXIoKVxuXHRcdHRoaXMuZWxlbWVudC5pbm5lckhUTUwgPSBgXG5cdFx0XHQ8ZGl2IGNsYXNzPVwiaGVhZGVyXCI+XG5cdFx0XHRcdDxpbWcgY2xhc3M9XCJsb2dvXCIgc3JjPVwiTk9JX09QRU5EQVRBSFVCX05FV19CS19ub3NwYWNlLTAxLnN2Z1wiPlxuXHRcdFx0PC9kaXY+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwiYm9keVwiPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwicHJvamVjdHNcIj48L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdGBcblx0XHR0aGlzLmNoYW5naW5nU2VjdGlvbiA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcucHJvamVjdHMnKSFcblx0XHRcblx0XHR0aGlzLmxvZ28gPSBjc19jYXN0KEhUTUxJbWFnZUVsZW1lbnQsIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcubG9nbycpKVxuXHRcdHRoaXMubG9nby5vbmNsaWNrID0gKCkgPT4ge1xuXHRcdFx0bG9jYXRpb24uaGFzaCA9ICcnXG5cdFx0fVxuXHRcdFxuXHRcdGNvbnN0IG1lbnU6IE1lbnVFbGVtZW50ID0gbmV3IE1lbnVFbGVtZW50KCk7XG5cdFx0dGhpcy5jaGFuZ2luZ1NlY3Rpb24ucGFyZW50RWxlbWVudCEucHJlcGVuZChtZW51LmVsZW1lbnQpO1xuXHRcdFxuXHRcdC8vIHRoaXMucHJvamVjdHNDb21wb25lbnQgPSBuZXcgUHJvamVjdHNFbGVtZW50KCk7XG5cdFx0Ly8gcHJvamVjdHMuYXBwZW5kQ2hpbGQodGhpcy5wcm9qZWN0c0NvbXBvbmVudC5lbGVtZW50KTtcblx0XHRcblx0XHRjb25zdCBvbmhhc2hjaGFuZ2UgPSAoKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhsb2NhdGlvbi5oYXNoKVxuXHRcdFx0XG5cdFx0XHR0aGlzLmNoYW5naW5nU2VjdGlvbi50ZXh0Q29udGVudCA9ICcnXG5cdFx0XHRcblx0XHRcdGlmIChsb2NhdGlvbi5oYXNoID09ICcnKVxuXHRcdFx0e1xuXHRcdFx0XHRpZiAodGhpcy5wcm9qZWN0c0NvbXBvbmVudCA9PSBudWxsKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dGhpcy5wcm9qZWN0c0NvbXBvbmVudCA9IG5ldyBQcm9qZWN0c0VsZW1lbnQoKTtcblx0XHRcdFx0XHR0aGlzLnByb2plY3RzQ29tcG9uZW50LnJlZnJlc2goKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLmNoYW5naW5nU2VjdGlvbi5hcHBlbmRDaGlsZCh0aGlzLnByb2plY3RzQ29tcG9uZW50LmVsZW1lbnQpXG5cdFx0XHR9XG5cblx0XHRcdGlmIChsb2NhdGlvbi5oYXNoLmluZGV4T2YoJyNwYWdlPWRhdGFzZXQtY2F0ZWdvcmllcyYnKSA9PSAwKVxuXHRcdFx0e1xuXHRcdFx0XHR0aGlzLmNoYW5naW5nU2VjdGlvbi50ZXh0Q29udGVudCA9ICcnXG5cdFx0XHRcdGNvbnN0IGRldGFpbCA9IG5ldyBEYXRhc2V0Q2F0ZWdvcmllcygpO1xuXHRcdFx0XHR0aGlzLmNoYW5naW5nU2VjdGlvbi5hcHBlbmRDaGlsZChkZXRhaWwpXG5cdFx0XHRcdGNvbnN0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMobG9jYXRpb24uaGFzaC5zdWJzdHJpbmcoMSkpO1xuXHRcdFx0XHRjb25zdCBzZXNzaW9uX3N0YXJ0X3RzID0gY3Nfbm90bnVsbChwYXJhbXMuZ2V0KCdzZXNzaW9uX3N0YXJ0X3RzJykpXG5cdFx0XHRcdGNvbnN0IGRhdGFzZXRfbmFtZSA9IGNzX25vdG51bGwocGFyYW1zLmdldCgnZGF0YXNldF9uYW1lJykpXG5cdFx0XHRcdGRldGFpbC5yZWZyZXNoKHNlc3Npb25fc3RhcnRfdHMsIGRhdGFzZXRfbmFtZSk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdGlmIChsb2NhdGlvbi5oYXNoLnN0YXJ0c1dpdGgoJyNwYWdlPXN1bW1hcnkmJykpXG5cdFx0XHR7XG5cdFx0XHRcdHRoaXMuY2hhbmdpbmdTZWN0aW9uLnRleHRDb250ZW50ID0gJydcblx0XHRcdFx0Y29uc3QgZGV0YWlsID0gbmV3IERhdGFzZXRJc3N1ZXNEZXRhaWwoKTtcblx0XHRcdFx0dGhpcy5jaGFuZ2luZ1NlY3Rpb24uYXBwZW5kQ2hpbGQoZGV0YWlsKVxuXHRcdFx0XHRjb25zdCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKGxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKDEpKTtcblx0XHRcdFx0Y29uc3Qgc2Vzc2lvbl9zdGFydF90cyA9IGNzX25vdG51bGwocGFyYW1zLmdldCgnc2Vzc2lvbl9zdGFydF90cycpKVxuXHRcdFx0XHRjb25zdCBkYXRhc2V0X25hbWUgPSBjc19ub3RudWxsKHBhcmFtcy5nZXQoJ2RhdGFzZXRfbmFtZScpKVxuXHRcdFx0XHRjb25zdCBjYXRlZ29yeV9uYW1lID0gY3Nfbm90bnVsbChwYXJhbXMuZ2V0KCdjYXRlZ29yeV9uYW1lJykpXG5cdFx0XHRcdGRldGFpbC5yZWZyZXNoKHNlc3Npb25fc3RhcnRfdHMsIGRhdGFzZXRfbmFtZSwgY2F0ZWdvcnlfbmFtZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdFxuXHRcdHdpbmRvdy5vbnBvcHN0YXRlID0gKGUpID0+IHtcblx0XHRcdG9uaGFzaGNoYW5nZSgpXG5cdFx0fVxuXG5cdFx0b25oYXNoY2hhbmdlKClcblxuXHRcdFxuXHR9XG5cdFxufVxuIl19