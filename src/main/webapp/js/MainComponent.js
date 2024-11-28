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
                this.changingSection.appendChild(this.projectsComponent);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFpbkNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3R5cGVzY3JpcHQvTWFpbkNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sa0JBQWtCLENBQUE7QUFDNUMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHNCQUFzQixDQUFBO0FBR3BELE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLDBCQUEwQixDQUFBO0FBQzVELE9BQU8sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQ25ELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBRTNELE1BQU0sT0FBTyxhQUFjLFNBQVEsV0FBVztJQUU3QyxLQUFLLENBQUE7SUFFTCxpQkFBaUIsR0FBeUIsSUFBSSxDQUFDO0lBRS9DLGVBQWUsQ0FBQTtJQUVmLElBQUksQ0FBQTtJQUVKO1FBRUMsS0FBSyxFQUFFLENBQUE7UUFDUCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQTtRQUNoRCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRzs7Ozs7Ozs7OztHQVV0QixDQUFBO1FBQ0QsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUUsQ0FBQTtRQUU3RCxJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO1FBQ3hFLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRTtZQUN4QixRQUFRLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQTtRQUNuQixDQUFDLENBQUE7UUFF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QUFNLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFDbkUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLGNBQWMsRUFBRSxXQUFXLENBQUMsQ0FBQztnQkFDM0YsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQTtZQUM5QixDQUFDO1FBQ0YsQ0FBQyxDQUFBO1FBRUQsTUFBTSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFO1lBQ3pCLFlBQVksRUFBRSxDQUFBO1FBQ2YsQ0FBQyxDQUFBO1FBRUQsWUFBWSxFQUFFLENBQUE7SUFHZixDQUFDO0NBRUQ7QUFFRCxjQUFjLENBQUMsTUFBTSxDQUFDLG1CQUFtQixFQUFFLGFBQWEsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIChDKSAyMDI0IENhdGNoIFNvbHZlIGRpIERhdmlkZSBNb250ZXNpblxuICogTGljZW5zZTogQUdQTFxuICovXG5cbmltcG9ydCB7TWVudUVsZW1lbnR9IGZyb20gJy4vTWVudUVsZW1lbnQuanMnXG5pbXBvcnQge1Byb2plY3RzRWxlbWVudH0gZnJvbSAnLi9Qcm9qZWN0c0VsZW1lbnQuanMnXG5cblxuaW1wb3J0IHtEYXRhc2V0SXNzdWVzRGV0YWlsfSBmcm9tICcuL0RhdGFzZXRJc3N1ZXNEZXRhaWwuanMnXG5pbXBvcnQgeyBjc19jYXN0LCBjc19ub3RudWxsIH0gZnJvbSAnLi9xdWFsaXR5LmpzJztcbmltcG9ydCB7IERhdGFzZXRDYXRlZ29yaWVzIH0gZnJvbSAnLi9EYXRhc2V0Q2F0ZWdvcmllcy5qcyc7XG5cbmV4cG9ydCBjbGFzcyBNYWluQ29tcG9uZW50IGV4dGVuZHMgSFRNTEVsZW1lbnRcbntcblx0c3Jvb3Rcblx0XG5cdHByb2plY3RzQ29tcG9uZW50OiBQcm9qZWN0c0VsZW1lbnR8bnVsbCA9IG51bGw7XG5cdFxuXHRjaGFuZ2luZ1NlY3Rpb25cblx0XG5cdGxvZ29cblxuXHRjb25zdHJ1Y3RvcigpXG5cdHtcblx0XHRzdXBlcigpXG5cdFx0dGhpcy5zcm9vdCA9IHRoaXMuYXR0YWNoU2hhZG93KHsgbW9kZTogJ29wZW4nIH0pXG5cdFx0dGhpcy5zcm9vdC5pbm5lckhUTUwgPSBgXG5cdFx0XHQ8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgaHJlZj1cImluZGV4LmNzc1wiPlxuXHRcdFx0PGRpdiBjbGFzcz1cIk1haW5Db21wb25lbnRcIj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImhlYWRlclwiPlxuXHRcdFx0XHRcdDxpbWcgY2xhc3M9XCJsb2dvXCIgc3JjPVwiTk9JX09QRU5EQVRBSFVCX05FV19CS19ub3NwYWNlLTAxLnN2Z1wiPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImJvZHlcIj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicHJvamVjdHNcIj48L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cblx0XHRgXG5cdFx0dGhpcy5jaGFuZ2luZ1NlY3Rpb24gPSB0aGlzLnNyb290LnF1ZXJ5U2VsZWN0b3IoJy5wcm9qZWN0cycpIVxuXHRcdFxuXHRcdHRoaXMubG9nbyA9IGNzX2Nhc3QoSFRNTEltYWdlRWxlbWVudCwgdGhpcy5zcm9vdC5xdWVyeVNlbGVjdG9yKCcubG9nbycpKVxuXHRcdHRoaXMubG9nby5vbmNsaWNrID0gKCkgPT4ge1xuXHRcdFx0bG9jYXRpb24uaGFzaCA9ICcnXG5cdFx0fVxuXHRcdFxuXHRcdGNvbnN0IG1lbnU6IE1lbnVFbGVtZW50ID0gbmV3IE1lbnVFbGVtZW50KCk7XG5cdFx0bWVudS5yZWZyZXNoKClcblx0XHR0aGlzLmNoYW5naW5nU2VjdGlvbi5wYXJlbnRFbGVtZW50IS5wcmVwZW5kKG1lbnUpO1xuXHRcdFxuXHRcdC8vIHRoaXMucHJvamVjdHNDb21wb25lbnQgPSBuZXcgUHJvamVjdHNFbGVtZW50KCk7XG5cdFx0Ly8gcHJvamVjdHMuYXBwZW5kQ2hpbGQodGhpcy5wcm9qZWN0c0NvbXBvbmVudC5lbGVtZW50KTtcblx0XHRcblx0XHRjb25zdCBvbmhhc2hjaGFuZ2UgPSAoKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhsb2NhdGlvbi5oYXNoKVxuXHRcdFx0XG5cdFx0XHR0aGlzLmNoYW5naW5nU2VjdGlvbi50ZXh0Q29udGVudCA9ICcnXG5cdFx0XHRcblx0XHRcdGlmIChsb2NhdGlvbi5oYXNoID09ICcnKVxuXHRcdFx0e1xuXHRcdFx0XHRpZiAodGhpcy5wcm9qZWN0c0NvbXBvbmVudCA9PSBudWxsKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dGhpcy5wcm9qZWN0c0NvbXBvbmVudCA9IG5ldyBQcm9qZWN0c0VsZW1lbnQoKTtcblx0XHRcdFx0XHR0aGlzLnByb2plY3RzQ29tcG9uZW50LnJlZnJlc2goKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLmNoYW5naW5nU2VjdGlvbi5hcHBlbmRDaGlsZCh0aGlzLnByb2plY3RzQ29tcG9uZW50KVxuXHRcdFx0XHRtZW51LnNlbGVjdEl0ZW0oJycpXG5cdFx0XHR9XG5cblx0XHRcdGlmIChsb2NhdGlvbi5oYXNoLmluZGV4T2YoJyNwYWdlPWRhdGFzZXQtY2F0ZWdvcmllcyYnKSA9PSAwKVxuXHRcdFx0e1xuXHRcdFx0XHR0aGlzLmNoYW5naW5nU2VjdGlvbi50ZXh0Q29udGVudCA9ICcnXG5cdFx0XHRcdGNvbnN0IGRldGFpbCA9IG5ldyBEYXRhc2V0Q2F0ZWdvcmllcygpO1xuXHRcdFx0XHR0aGlzLmNoYW5naW5nU2VjdGlvbi5hcHBlbmRDaGlsZChkZXRhaWwpXG5cdFx0XHRcdGNvbnN0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMobG9jYXRpb24uaGFzaC5zdWJzdHJpbmcoMSkpO1xuXHRcdFx0XHRjb25zdCBzZXNzaW9uX3N0YXJ0X3RzID0gY3Nfbm90bnVsbChwYXJhbXMuZ2V0KCdzZXNzaW9uX3N0YXJ0X3RzJykpXG5cdFx0XHRcdGNvbnN0IGRhdGFzZXRfbmFtZSA9IGNzX25vdG51bGwocGFyYW1zLmdldCgnZGF0YXNldF9uYW1lJykpXG5cdFx0XHRcdGRldGFpbC5yZWZyZXNoKHNlc3Npb25fc3RhcnRfdHMsIGRhdGFzZXRfbmFtZSk7XG5cdFx0XHRcdG1lbnUuc2VsZWN0SXRlbShkYXRhc2V0X25hbWUpXG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdGlmIChsb2NhdGlvbi5oYXNoLnN0YXJ0c1dpdGgoJyNwYWdlPXN1bW1hcnkmJykpXG5cdFx0XHR7XG5cdFx0XHRcdHRoaXMuY2hhbmdpbmdTZWN0aW9uLnRleHRDb250ZW50ID0gJydcblx0XHRcdFx0Y29uc3QgZGV0YWlsID0gbmV3IERhdGFzZXRJc3N1ZXNEZXRhaWwoKTtcblx0XHRcdFx0dGhpcy5jaGFuZ2luZ1NlY3Rpb24uYXBwZW5kQ2hpbGQoZGV0YWlsKVxuXHRcdFx0XHRjb25zdCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKGxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKDEpKTtcblx0XHRcdFx0Y29uc3Qgc2Vzc2lvbl9zdGFydF90cyA9IGNzX25vdG51bGwocGFyYW1zLmdldCgnc2Vzc2lvbl9zdGFydF90cycpKVxuXHRcdFx0XHRjb25zdCBkYXRhc2V0X25hbWUgPSBjc19ub3RudWxsKHBhcmFtcy5nZXQoJ2RhdGFzZXRfbmFtZScpKVxuXHRcdFx0XHRjb25zdCBjYXRlZ29yeV9uYW1lID0gY3Nfbm90bnVsbChwYXJhbXMuZ2V0KCdjYXRlZ29yeV9uYW1lJykpXG5cdFx0XHRcdGNvbnN0IGZhaWxlZF9yZWNvcmRzID0gcGFyc2VJbnQoY3Nfbm90bnVsbChwYXJhbXMuZ2V0KCdmYWlsZWRfcmVjb3JkcycpKSlcblx0XHRcdFx0Y29uc3QgdG90X3JlY29yZHMgPSBwYXJzZUludChjc19ub3RudWxsKHBhcmFtcy5nZXQoJ3RvdF9yZWNvcmRzJykpKVxuXHRcdFx0XHRkZXRhaWwucmVmcmVzaChzZXNzaW9uX3N0YXJ0X3RzLCBkYXRhc2V0X25hbWUsIGNhdGVnb3J5X25hbWUsIGZhaWxlZF9yZWNvcmRzLCB0b3RfcmVjb3Jkcyk7XG5cdFx0XHRcdG1lbnUuc2VsZWN0SXRlbShkYXRhc2V0X25hbWUpXG5cdFx0XHR9XG5cdFx0fVxuXHRcdFxuXHRcdHdpbmRvdy5vbnBvcHN0YXRlID0gKGUpID0+IHtcblx0XHRcdG9uaGFzaGNoYW5nZSgpXG5cdFx0fVxuXG5cdFx0b25oYXNoY2hhbmdlKClcblxuXHRcdFxuXHR9XG5cdFxufVxuXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ2NzLW1haW4tY29tcG9uZW50JywgTWFpbkNvbXBvbmVudClcbiJdfQ==