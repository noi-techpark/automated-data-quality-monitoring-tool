// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later
import { MenuComponent } from './MenuComponent.js';
import { StandardDashboardsComponent } from './StandardDashboardsComponent.js';
import { DatasetIssuesDetail } from './DatasetIssuesDetail.js';
import { cs_cast, cs_notnull } from './quality.js';
import { DatasetIssuesByCategories } from './DatasetIssuesByCategories.js';
import { AuthComponent } from './AuthComponent.js';
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
				.header {
					display: flex;
					align-items: center;
					width: 100%;
					gap: 1rem;
				}
				.header-center {
					flex-grow: 1;
					text-align: center;
				}
			</style>
			<div class="MainComponent">
				<div class="header">
					<img class="logo" src="NOI_OPENDATAHUB_NEW_BK_nospace-01.svg">
					<div class="header-center"></div>
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
        // Sposta AuthComponent a destra della header
        this.sroot.querySelector('.header').appendChild(new AuthComponent());
        const menu = new MenuComponent();
        menu.refresh();
        this.changingSection.parentElement.prepend(menu);
        // this.projectsComponent = new ProjectsElement();
        // projects.appendChild(this.projectsComponent.element);
        const onhashchange = () => {
            console.log('hash');
            console.log(location.hash);
            this.changingSection.textContent = '';
            let cleanedhash = location.hash;
            if (cleanedhash.startsWith('#state='))
                cleanedhash = '';
            if (cleanedhash == '') {
                if (this.dashboards == null) {
                    this.dashboards = new StandardDashboardsComponent();
                    this.dashboards.refresh();
                }
                this.changingSection.appendChild(this.dashboards);
                menu.selectItem('');
            }
            if (cleanedhash.indexOf('#page=dataset-categories&') == 0) {
                this.changingSection.textContent = '';
                const detail = new DatasetIssuesByCategories();
                this.changingSection.appendChild(detail);
                const params = new URLSearchParams(cleanedhash.substring(1));
                const session_start_ts = cs_notnull(params.get('session_start_ts'));
                const dataset_name = cs_notnull(params.get('dataset_name'));
                const failed_records = parseInt(cs_notnull(params.get('failed_records')));
                const tested_records = parseInt(cs_notnull(params.get('tested_records')));
                detail.refresh(session_start_ts, dataset_name, failed_records, tested_records);
                menu.selectItem(dataset_name);
            }
            if (cleanedhash.startsWith('#page=summary&')) {
                this.changingSection.textContent = '';
                const detail = new DatasetIssuesDetail();
                this.changingSection.appendChild(detail);
                const params = new URLSearchParams(cleanedhash.substring(1));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFpbkNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3R5cGVzY3JpcHQvTWFpbkNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw4REFBOEQ7QUFDOUQsRUFBRTtBQUNGLDZDQUE2QztBQUc3QyxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sb0JBQW9CLENBQUE7QUFDaEQsT0FBTyxFQUFDLDJCQUEyQixFQUFDLE1BQU0sa0NBQWtDLENBQUE7QUFHNUUsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sMEJBQTBCLENBQUE7QUFDNUQsT0FBTyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDbkQsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFFM0UsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBRWxELE1BQU0sT0FBTyxhQUFjLFNBQVEsV0FBVztJQUU3QyxLQUFLLENBQUE7SUFFTCxVQUFVLEdBQXFDLElBQUksQ0FBQztJQUVwRCxlQUFlLENBQUE7SUFFZixJQUFJLENBQUE7SUFFSjtRQUVDLEtBQUssRUFBRSxDQUFBO1FBQ1AsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUE7UUFDaEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBMEJ0QixDQUFBO1FBQ0QsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUUsQ0FBQTtRQUU3RCxJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO1FBQ3hFLElBQUksQ0FBQyxJ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dmUgZGkgRGF2aWRlIE1vbnRlc2luXG4vL1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9yLWxhdGVyXG5cblxuaW1wb3J0IHtNZW51Q29tcG9uZW50fSBmcm9tICcuL01lbnVDb21wb25lbnQuanMnXG5pbXBvcnQge1N0YW5kYXJkRGFzaGJvYXJkc0NvbXBvbmVudH0gZnJvbSAnLi9TdGFuZGFyZERhc2hib2FyZHNDb21wb25lbnQuanMnXG5cblxuaW1wb3J0IHtEYXRhc2V0SXNzdWVzRGV0YWlsfSBmcm9tICcuL0RhdGFzZXRJc3N1ZXNEZXRhaWwuanMnXG5pbXBvcnQgeyBjc19jYXN0LCBjc19ub3RudWxsIH0gZnJvbSAnLi9xdWFsaXR5LmpzJztcbmltcG9ydCB7IERhdGFzZXRJc3N1ZXNCeUNhdGVnb3JpZXMgfSBmcm9tICcuL0RhdGFzZXRJc3N1ZXNCeUNhdGVnb3JpZXMuanMnO1xuXG5pbXBvcnQgeyBBdXRoQ29tcG9uZW50IH0gZnJvbSAnLi9BdXRoQ29tcG9uZW50LmpzJ1xuXG5leHBvcnQgY2xhc3MgTWFpbkNvbXBvbmVudCBleHRlbmRzIEhUTUxFbGVtZW50XG57XG5cdHNyb290XG5cdFxuXHRkYXNoYm9hcmRzOiBTdGFuZGFyZERhc2hib2FyZHNDb21wb25lbnR8bnVsbCA9IG51bGw7XG5cdFxuXHRjaGFuZ2luZ1NlY3Rpb25cblx0XG5cdGxvZ29cblxuXHRjb25zdHJ1Y3RvcigpXG5cdHtcblx0XHRzdXBlcigpXG5cdFx0dGhpcy5zcm9vdCA9IHRoaXMuYXR0YWNoU2hhZG93KHsgbW9kZTogJ29wZW4nIH0pXG5cdFx0dGhpcy5zcm9vdC5pbm5lckhUTUwgPSBgXG5cdFx0XHQ8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgaHJlZj1cImluZGV4LmNzc1wiPlxuXHRcdFx0PHN0eWxlPlxuXHRcdFx0XHRjcy1tZW51LWVsZW1lbnQge1xuXHRcdFx0XHRcdHdpZHRoOiAxMnJlbTtcblx0XHRcdFx0fVxuXHRcdFx0XHQuaGVhZGVyIHtcblx0XHRcdFx0XHRkaXNwbGF5OiBmbGV4O1xuXHRcdFx0XHRcdGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cdFx0XHRcdFx0d2lkdGg6IDEwMCU7XG5cdFx0XHRcdFx0Z2FwOiAxcmVtO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC5oZWFkZXItY2VudGVyIHtcblx0XHRcdFx0XHRmbGV4LWdyb3c6IDE7XG5cdFx0XHRcdFx0dGV4dC1hbGlnbjogY2VudGVyO1xuXHRcdFx0XHR9XG5cdFx0XHQ8L3N0eWxlPlxuXHRcdFx0PGRpdiBjbGFzcz1cIk1haW5Db21wb25lbnRcIj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImhlYWRlclwiPlxuXHRcdFx0XHRcdDxpbWcgY2xhc3M9XCJsb2dvXCIgc3JjPVwiTk9JX09QRU5EQVRBSFVCX05FV19CS19ub3NwYWNlLTAxLnN2Z1wiPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJoZWFkZXItY2VudGVyXCI+PC9kaXY+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiYm9keVwiPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwcm9qZWN0c1wiPjwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdGBcblx0XHR0aGlzLmNoYW5naW5nU2VjdGlvbiA9IHRoaXMuc3Jvb3QucXVlcnlTZWxlY3RvcignLnByb2plY3RzJykhXG5cdFx0XG5cdFx0dGhpcy5sb2dvID0gY3NfY2FzdChIVE1MSW1hZ2VFbGVtZW50LCB0aGlzLnNyb290LnF1ZXJ5U2VsZWN0b3IoJy5sb2dvJykpXG5cdFx0dGhpcy5sb2dvLm9uY2xpY2sgPSAoKSA9PiB7XG5cdFx0XHRsb2NhdGlvbi5oYXNoID0gJydcblx0XHR9XG5cdFx0XG5cdFx0Ly8gU3Bvc3RhIEF1dGhDb21wb25lbnQgYSBkZXN0cmEgZGVsbGEgaGVhZGVyXG5cdFx0dGhpcy5zcm9vdC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyJykhLmFwcGVuZENoaWxkKG5ldyBBdXRoQ29tcG9uZW50KCkpXG5cdFx0XG5cdFx0Y29uc3QgbWVudTogTWVudUNvbXBvbmVudCA9IG5ldyBNZW51Q29tcG9uZW50KCk7XG5cdFx0bWVudS5yZWZyZXNoKClcblx0XHR0aGlzLmNoYW5naW5nU2VjdGlvbi5wYXJlbnRFbGVtZW50IS5wcmVwZW5kKG1lbnUpO1xuXHRcdFxuXHRcdC8vIHRoaXMucHJvamVjdHNDb21wb25lbnQgPSBuZXcgUHJvamVjdHNFbGVtZW50KCk7XG5cdFx0Ly8gcHJvamVjdHMuYXBwZW5kQ2hpbGQodGhpcy5wcm9qZWN0c0NvbXBvbmVudC5lbGVtZW50KTtcblx0XHRcblx0XHRjb25zdCBvbmhhc2hjaGFuZ2UgPSAoKSA9PiB7XG5cdFx0XHRcblx0XHRcdGNvbnNvbGUubG9nKCdoYXNoJylcblx0XHRcdGNvbnNvbGUubG9nKGxvY2F0aW9uLmhhc2gpXG5cdFx0XHRcblx0XHRcdHRoaXMuY2hhbmdpbmdTZWN0aW9uLnRleHRDb250ZW50ID0gJydcblx0XHRcdFxuXHRcdFx0bGV0IGNsZWFuZWRoYXNoID0gbG9jYXRpb24uaGFzaFxuXHRcdFx0aWYgKGNsZWFuZWRoYXNoLnN0YXJ0c1dpdGgoJyNzdGF0ZT0nKSlcblx0XHRcdFx0Y2xlYW5lZGhhc2ggPSAnJ1xuXHRcdFx0XG5cdFx0XHRpZiAoY2xlYW5lZGhhc2ggPT0gJycpXG5cdFx0XHR7XG5cdFx0XHRcdGlmICh0aGlzLmRhc2hib2FyZHMgPT0gbnVsbClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHRoaXMuZGFzaGJvYXJkcyA9IG5ldyBTdGFuZGFyZERhc2hib2FyZHNDb21wb25lbnQoKTtcblx0XHRcdFx0XHR0aGlzLmRhc2hib2FyZHMucmVmcmVzaCgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuY2hhbmdpbmdTZWN0aW9uLmFwcGVuZENoaWxkKHRoaXMuZGFzaGJvYXJkcylcblx0XHRcdFx0bWVudS5zZWxlY3RJdGVtKCcnKVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoY2xlYW5lZGhhc2guaW5kZXhPZignI3BhZ2U9ZGF0YXNldC1jYXRlZ29yaWVzJicpID09IDApXG5cdFx0XHR7XG5cdFx0XHRcdHRoaXMuY2hhbmdpbmdTZWN0aW9uLnRleHRDb250ZW50ID0gJydcblx0XHRcdFx0Y29uc3QgZGV0YWlsID0gbmV3IERhdGFzZXRJc3N1ZXNCeUNhdGVnb3JpZXMoKTtcblx0XHRcdFx0dGhpcy5jaGFuZ2luZ1NlY3Rpb24uYXBwZW5kQ2hpbGQoZGV0YWlsKVxuXHRcdFx0XHRjb25zdCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKGNsZWFuZWRoYXNoLnN1YnN0cmluZygxKSk7XG5cdFx0XHRcdGNvbnN0IHNlc3Npb25fc3RhcnRfdHMgPSBjc19ub3RudWxsKHBhcmFtcy5nZXQoJ3Nlc3Npb25fc3RhcnRfdHMnKSlcblx0XHRcdFx0Y29uc3QgZGF0YXNldF9uYW1lID0gY3Nfbm90bnVsbChwYXJhbXMuZ2V0KCdkYXRhc2V0X25hbWUnKSlcblx0XHRcdFx0Y29uc3QgZmFpbGVkX3JlY29yZHMgPSBwYXJzZUludChjc19ub3RudWxsKHBhcmFtcy5nZXQoJ2ZhaWxlZF9yZWNvcmRzJykpKVxuXHRcdFx0XHRjb25zdCB0ZXN0ZWRfcmVjb3JkcyA9IHBhcnNlSW50KGNzX25vdG51bGwocGFyYW1zLmdldCgndGVzdGVkX3JlY29yZHMnKSkpXG5cdFx0XHRcdGRldGFpbC5yZWZyZXNoKHNlc3Npb25fc3RhcnRfdHMsIGRhdGFzZXRfbmFtZSwgZmFpbGVkX3JlY29yZHMsIHRlc3RlZF9yZWNvcmRzKTtcblx0XHRcdFx0bWVudS5zZWxlY3RJdGVtKGRhdGFzZXRfbmFtZSlcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0aWYgKGNsZWFuZWRoYXNoLnN0YXJ0c1dpdGgoJyNwYWdlPXN1bW1hcnkmJykpXG5cdFx0XHR7XG5cdFx0XHRcdHRoaXMuY2hhbmdpbmdTZWN0aW9uLnRleHRDb250ZW50ID0gJydcblx0XHRcdFx0Y29uc3QgZGV0YWlsID0gbmV3IERhdGFzZXRJc3N1ZXNEZXRhaWwoKTtcblx0XHRcdFx0dGhpcy5jaGFuZ2luZ1NlY3Rpb24uYXBwZW5kQ2hpbGQoZGV0YWlsKVxuXHRcdFx0XHRjb25zdCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKGNsZWFuZWRoYXNoLnN1YnN0cmluZygxKSk7XG5cdFx0XHRcdGNvbnN0IHNlc3Npb25fc3RhcnRfdHMgPSBjc19ub3RudWxsKHBhcmFtcy5nZXQoJ3Nlc3Npb25fc3RhcnRfdHMnKSlcblx0XHRcdFx0Y29uc3QgZGF0YXNldF9uYW1lID0gY3Nfbm90bnVsbChwYXJhbXMuZ2V0KCdkYXRhc2V0X25hbWUnKSlcblx0XHRcdFx0Y29uc3QgY2F0ZWdvcnlfbmFtZSA9IGNzX25vdG51bGwocGFyYW1zLmdldCgnY2F0ZWdvcnlfbmFtZScpKVxuXHRcdFx0XHRjb25zdCBmYWlsZWRfcmVjb3JkcyA9IHBhcnNlSW50KGNzX25vdG51bGwocGFyYW1zLmdldCgnZmFpbGVkX3JlY29yZHMnKSkpXG5cdFx0XHRcdGNvbnN0IHRvdF9yZWNvcmRzID0gcGFyc2VJbnQoY3Nfbm90bnVsbChwYXJhbXMuZ2V0KCd0b3RfcmVjb3JkcycpKSlcblx0XHRcdFx0ZGV0YWlsLnJlZnJlc2goc2Vzc2lvbl9zdGFydF90cywgZGF0YXNldF9uYW1lLCBjYXRlZ29yeV9uYW1lLCBmYWlsZWRfcmVjb3JkcywgdG90X3JlY29yZHMpO1xuXHRcdFx0XHRtZW51LnNlbGVjdEl0ZW0oZGF0YXNldF9uYW1lKVxuXHRcdFx0fVxuXHRcdH1cblx0XHRcblx0XHR3aW5kb3cub25wb3BzdGF0ZSA9IChlKSA9PiB7XG5cdFx0XHRvbmhhc2hjaGFuZ2UoKVxuXHRcdH1cblxuXHRcdG9uaGFzaGNoYW5nZSgpXG5cblx0XHRcblx0fVxuXHRcbn1cblxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCdjcy1tYWluLWNvbXBvbmVudCcsIE1haW5Db21wb25lbnQpXG4iXX0=