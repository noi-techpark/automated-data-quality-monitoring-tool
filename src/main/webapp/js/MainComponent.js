/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */
import { MenuElement } from './MenuElement.js';
import { ProjectsElement } from './ProjectsElement.js';
import { DatasetIssuesDetail } from './DatasetIssuesDetail.js';
import { cs_cast, cs_notnull } from './quality.js';
import { DatasetCategories } from './DatasetCategories.js';
export class MainComponent extends HTMLElement {
    sroot;
    projectsComponent = null;
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
customElements.define('cs-main-component', MainComponent);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFpbkNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3R5cGVzY3JpcHQvTWFpbkNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sa0JBQWtCLENBQUE7QUFDNUMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHNCQUFzQixDQUFBO0FBR3BELE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLDBCQUEwQixDQUFBO0FBQzVELE9BQU8sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQ25ELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBRTNELE1BQU0sT0FBTyxhQUFjLFNBQVEsV0FBVztJQUU3QyxLQUFLLENBQUE7SUFFTCxpQkFBaUIsR0FBeUIsSUFBSSxDQUFDO0lBRS9DLGVBQWUsQ0FBQTtJQUVmLElBQUksQ0FBQTtJQUVKO1FBRUMsS0FBSyxFQUFFLENBQUE7UUFDUCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQTtRQUNoRCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRzs7Ozs7Ozs7OztHQVV0QixDQUFBO1FBQ0QsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUUsQ0FBQTtRQUU3RCxJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO1FBQ3hFLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRTtZQUN4QixRQUFRLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQTtRQUNuQixDQUFDLENBQUE7UUFF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Q0FBQyxDQUFBO1FBRUQsTUFBTSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFO1lBQ3pCLFlBQVksRUFBRSxDQUFBO1FBQ2YsQ0FBQyxDQUFBO1FBRUQsWUFBWSxFQUFFLENBQUE7SUFHZixDQUFDO0NBRUQ7QUFFRCxjQUFjLENBQUMsTUFBTSxDQUFDLG1CQUFtQixFQUFFLGFBQWEsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIChDKSAyMDI0IENhdGNoIFNvbHZlIGRpIERhdmlkZSBNb250ZXNpblxuICogTGljZW5zZTogQUdQTFxuICovXG5cbmltcG9ydCB7TWVudUVsZW1lbnR9IGZyb20gJy4vTWVudUVsZW1lbnQuanMnXG5pbXBvcnQge1Byb2plY3RzRWxlbWVudH0gZnJvbSAnLi9Qcm9qZWN0c0VsZW1lbnQuanMnXG5cblxuaW1wb3J0IHtEYXRhc2V0SXNzdWVzRGV0YWlsfSBmcm9tICcuL0RhdGFzZXRJc3N1ZXNEZXRhaWwuanMnXG5pbXBvcnQgeyBjc19jYXN0LCBjc19ub3RudWxsIH0gZnJvbSAnLi9xdWFsaXR5LmpzJztcbmltcG9ydCB7IERhdGFzZXRDYXRlZ29yaWVzIH0gZnJvbSAnLi9EYXRhc2V0Q2F0ZWdvcmllcy5qcyc7XG5cbmV4cG9ydCBjbGFzcyBNYWluQ29tcG9uZW50IGV4dGVuZHMgSFRNTEVsZW1lbnRcbntcblx0c3Jvb3Rcblx0XG5cdHByb2plY3RzQ29tcG9uZW50OiBQcm9qZWN0c0VsZW1lbnR8bnVsbCA9IG51bGw7XG5cdFxuXHRjaGFuZ2luZ1NlY3Rpb25cblx0XG5cdGxvZ29cblxuXHRjb25zdHJ1Y3RvcigpXG5cdHtcblx0XHRzdXBlcigpXG5cdFx0dGhpcy5zcm9vdCA9IHRoaXMuYXR0YWNoU2hhZG93KHsgbW9kZTogJ29wZW4nIH0pXG5cdFx0dGhpcy5zcm9vdC5pbm5lckhUTUwgPSBgXG5cdFx0XHQ8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgaHJlZj1cImluZGV4LmNzc1wiPlxuXHRcdFx0PGRpdiBjbGFzcz1cIk1haW5Db21wb25lbnRcIj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImhlYWRlclwiPlxuXHRcdFx0XHRcdDxpbWcgY2xhc3M9XCJsb2dvXCIgc3JjPVwiTk9JX09QRU5EQVRBSFVCX05FV19CS19ub3NwYWNlLTAxLnN2Z1wiPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImJvZHlcIj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicHJvamVjdHNcIj48L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cblx0XHRgXG5cdFx0dGhpcy5jaGFuZ2luZ1NlY3Rpb24gPSB0aGlzLnNyb290LnF1ZXJ5U2VsZWN0b3IoJy5wcm9qZWN0cycpIVxuXHRcdFxuXHRcdHRoaXMubG9nbyA9IGNzX2Nhc3QoSFRNTEltYWdlRWxlbWVudCwgdGhpcy5zcm9vdC5xdWVyeVNlbGVjdG9yKCcubG9nbycpKVxuXHRcdHRoaXMubG9nby5vbmNsaWNrID0gKCkgPT4ge1xuXHRcdFx0bG9jYXRpb24uaGFzaCA9ICcnXG5cdFx0fVxuXHRcdFxuXHRcdGNvbnN0IG1lbnU6IE1lbnVFbGVtZW50ID0gbmV3IE1lbnVFbGVtZW50KCk7XG5cdFx0bWVudS5yZWZyZXNoKClcblx0XHR0aGlzLmNoYW5naW5nU2VjdGlvbi5wYXJlbnRFbGVtZW50IS5wcmVwZW5kKG1lbnUpO1xuXHRcdFxuXHRcdC8vIHRoaXMucHJvamVjdHNDb21wb25lbnQgPSBuZXcgUHJvamVjdHNFbGVtZW50KCk7XG5cdFx0Ly8gcHJvamVjdHMuYXBwZW5kQ2hpbGQodGhpcy5wcm9qZWN0c0NvbXBvbmVudC5lbGVtZW50KTtcblx0XHRcblx0XHRjb25zdCBvbmhhc2hjaGFuZ2UgPSAoKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhsb2NhdGlvbi5oYXNoKVxuXHRcdFx0XG5cdFx0XHR0aGlzLmNoYW5naW5nU2VjdGlvbi50ZXh0Q29udGVudCA9ICcnXG5cdFx0XHRcblx0XHRcdGlmIChsb2NhdGlvbi5oYXNoID09ICcnKVxuXHRcdFx0e1xuXHRcdFx0XHRpZiAodGhpcy5wcm9qZWN0c0NvbXBvbmVudCA9PSBudWxsKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dGhpcy5wcm9qZWN0c0NvbXBvbmVudCA9IG5ldyBQcm9qZWN0c0VsZW1lbnQoKTtcblx0XHRcdFx0XHR0aGlzLnByb2plY3RzQ29tcG9uZW50LnJlZnJlc2goKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLmNoYW5naW5nU2VjdGlvbi5hcHBlbmRDaGlsZCh0aGlzLnByb2plY3RzQ29tcG9uZW50LmVsZW1lbnQpXG5cdFx0XHRcdG1lbnUuc2VsZWN0SXRlbSgnJylcblx0XHRcdH1cblxuXHRcdFx0aWYgKGxvY2F0aW9uLmhhc2guaW5kZXhPZignI3BhZ2U9ZGF0YXNldC1jYXRlZ29yaWVzJicpID09IDApXG5cdFx0XHR7XG5cdFx0XHRcdHRoaXMuY2hhbmdpbmdTZWN0aW9uLnRleHRDb250ZW50ID0gJydcblx0XHRcdFx0Y29uc3QgZGV0YWlsID0gbmV3IERhdGFzZXRDYXRlZ29yaWVzKCk7XG5cdFx0XHRcdHRoaXMuY2hhbmdpbmdTZWN0aW9uLmFwcGVuZENoaWxkKGRldGFpbClcblx0XHRcdFx0Y29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhsb2NhdGlvbi5oYXNoLnN1YnN0cmluZygxKSk7XG5cdFx0XHRcdGNvbnN0IHNlc3Npb25fc3RhcnRfdHMgPSBjc19ub3RudWxsKHBhcmFtcy5nZXQoJ3Nlc3Npb25fc3RhcnRfdHMnKSlcblx0XHRcdFx0Y29uc3QgZGF0YXNldF9uYW1lID0gY3Nfbm90bnVsbChwYXJhbXMuZ2V0KCdkYXRhc2V0X25hbWUnKSlcblx0XHRcdFx0ZGV0YWlsLnJlZnJlc2goc2Vzc2lvbl9zdGFydF90cywgZGF0YXNldF9uYW1lKTtcblx0XHRcdFx0bWVudS5zZWxlY3RJdGVtKGRhdGFzZXRfbmFtZSlcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0aWYgKGxvY2F0aW9uLmhhc2guc3RhcnRzV2l0aCgnI3BhZ2U9c3VtbWFyeSYnKSlcblx0XHRcdHtcblx0XHRcdFx0dGhpcy5jaGFuZ2luZ1NlY3Rpb24udGV4dENvbnRlbnQgPSAnJ1xuXHRcdFx0XHRjb25zdCBkZXRhaWwgPSBuZXcgRGF0YXNldElzc3Vlc0RldGFpbCgpO1xuXHRcdFx0XHR0aGlzLmNoYW5naW5nU2VjdGlvbi5hcHBlbmRDaGlsZChkZXRhaWwpXG5cdFx0XHRcdGNvbnN0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMobG9jYXRpb24uaGFzaC5zdWJzdHJpbmcoMSkpO1xuXHRcdFx0XHRjb25zdCBzZXNzaW9uX3N0YXJ0X3RzID0gY3Nfbm90bnVsbChwYXJhbXMuZ2V0KCdzZXNzaW9uX3N0YXJ0X3RzJykpXG5cdFx0XHRcdGNvbnN0IGRhdGFzZXRfbmFtZSA9IGNzX25vdG51bGwocGFyYW1zLmdldCgnZGF0YXNldF9uYW1lJykpXG5cdFx0XHRcdGNvbnN0IGNhdGVnb3J5X25hbWUgPSBjc19ub3RudWxsKHBhcmFtcy5nZXQoJ2NhdGVnb3J5X25hbWUnKSlcblx0XHRcdFx0ZGV0YWlsLnJlZnJlc2goc2Vzc2lvbl9zdGFydF90cywgZGF0YXNldF9uYW1lLCBjYXRlZ29yeV9uYW1lKTtcblx0XHRcdFx0bWVudS5zZWxlY3RJdGVtKGRhdGFzZXRfbmFtZSlcblx0XHRcdH1cblx0XHR9XG5cdFx0XG5cdFx0d2luZG93Lm9ucG9wc3RhdGUgPSAoZSkgPT4ge1xuXHRcdFx0b25oYXNoY2hhbmdlKClcblx0XHR9XG5cblx0XHRvbmhhc2hjaGFuZ2UoKVxuXG5cdFx0XG5cdH1cblx0XG59XG5cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgnY3MtbWFpbi1jb21wb25lbnQnLCBNYWluQ29tcG9uZW50KVxuIl19