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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFpbkNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3R5cGVzY3JpcHQvTWFpbkNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sa0JBQWtCLENBQUE7QUFDNUMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHNCQUFzQixDQUFBO0FBR3BELE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLDBCQUEwQixDQUFBO0FBQzVELE9BQU8sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQ25ELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBRTNELE1BQU0sT0FBTyxhQUFjLFNBQVEsV0FBVztJQUU3QyxLQUFLLENBQUE7SUFFTCxpQkFBaUIsR0FBeUIsSUFBSSxDQUFDO0lBRS9DLGVBQWUsQ0FBQTtJQUVmLElBQUksQ0FBQTtJQUVKO1FBRUMsS0FBSyxFQUFFLENBQUE7UUFDUCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQTtRQUNoRCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRzs7Ozs7Ozs7OztHQVV0QixDQUFBO1FBQ0QsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUUsQ0FBQTtRQUU3RCxJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO1FBQ3hFLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRTtZQUN4QixRQUFRLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQTtRQUNuQixDQUFDLENBQUE7UUFF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UUFFRCxNQUFNLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUU7WUFDekIsWUFBWSxFQUFFLENBQUE7UUFDZixDQUFDLENBQUE7UUFFRCxZQUFZLEVBQUUsQ0FBQTtJQUdmLENBQUM7Q0FFRDtBQUVELGNBQWMsQ0FBQyxNQUFNLENBQUMsbUJBQW1CLEVBQUUsYUFBYSxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogKEMpIDIwMjQgQ2F0Y2ggU29sdmUgZGkgRGF2aWRlIE1vbnRlc2luXG4gKiBMaWNlbnNlOiBBR1BMXG4gKi9cblxuaW1wb3J0IHtNZW51RWxlbWVudH0gZnJvbSAnLi9NZW51RWxlbWVudC5qcydcbmltcG9ydCB7UHJvamVjdHNFbGVtZW50fSBmcm9tICcuL1Byb2plY3RzRWxlbWVudC5qcydcblxuXG5pbXBvcnQge0RhdGFzZXRJc3N1ZXNEZXRhaWx9IGZyb20gJy4vRGF0YXNldElzc3Vlc0RldGFpbC5qcydcbmltcG9ydCB7IGNzX2Nhc3QsIGNzX25vdG51bGwgfSBmcm9tICcuL3F1YWxpdHkuanMnO1xuaW1wb3J0IHsgRGF0YXNldENhdGVnb3JpZXMgfSBmcm9tICcuL0RhdGFzZXRDYXRlZ29yaWVzLmpzJztcblxuZXhwb3J0IGNsYXNzIE1haW5Db21wb25lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudFxue1xuXHRzcm9vdFxuXHRcblx0cHJvamVjdHNDb21wb25lbnQ6IFByb2plY3RzRWxlbWVudHxudWxsID0gbnVsbDtcblx0XG5cdGNoYW5naW5nU2VjdGlvblxuXHRcblx0bG9nb1xuXG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXHRcdHN1cGVyKClcblx0XHR0aGlzLnNyb290ID0gdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSlcblx0XHR0aGlzLnNyb290LmlubmVySFRNTCA9IGBcblx0XHRcdDxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiBocmVmPVwiaW5kZXguY3NzXCI+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwiTWFpbkNvbXBvbmVudFwiPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiaGVhZGVyXCI+XG5cdFx0XHRcdFx0PGltZyBjbGFzcz1cImxvZ29cIiBzcmM9XCJOT0lfT1BFTkRBVEFIVUJfTkVXX0JLX25vc3BhY2UtMDEuc3ZnXCI+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiYm9keVwiPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwcm9qZWN0c1wiPjwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdGBcblx0XHR0aGlzLmNoYW5naW5nU2VjdGlvbiA9IHRoaXMuc3Jvb3QucXVlcnlTZWxlY3RvcignLnByb2plY3RzJykhXG5cdFx0XG5cdFx0dGhpcy5sb2dvID0gY3NfY2FzdChIVE1MSW1hZ2VFbGVtZW50LCB0aGlzLnNyb290LnF1ZXJ5U2VsZWN0b3IoJy5sb2dvJykpXG5cdFx0dGhpcy5sb2dvLm9uY2xpY2sgPSAoKSA9PiB7XG5cdFx0XHRsb2NhdGlvbi5oYXNoID0gJydcblx0XHR9XG5cdFx0XG5cdFx0Y29uc3QgbWVudTogTWVudUVsZW1lbnQgPSBuZXcgTWVudUVsZW1lbnQoKTtcblx0XHRtZW51LnJlZnJlc2goKVxuXHRcdHRoaXMuY2hhbmdpbmdTZWN0aW9uLnBhcmVudEVsZW1lbnQhLnByZXBlbmQobWVudSk7XG5cdFx0XG5cdFx0Ly8gdGhpcy5wcm9qZWN0c0NvbXBvbmVudCA9IG5ldyBQcm9qZWN0c0VsZW1lbnQoKTtcblx0XHQvLyBwcm9qZWN0cy5hcHBlbmRDaGlsZCh0aGlzLnByb2plY3RzQ29tcG9uZW50LmVsZW1lbnQpO1xuXHRcdFxuXHRcdGNvbnN0IG9uaGFzaGNoYW5nZSA9ICgpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKGxvY2F0aW9uLmhhc2gpXG5cdFx0XHRcblx0XHRcdHRoaXMuY2hhbmdpbmdTZWN0aW9uLnRleHRDb250ZW50ID0gJydcblx0XHRcdFxuXHRcdFx0aWYgKGxvY2F0aW9uLmhhc2ggPT0gJycpXG5cdFx0XHR7XG5cdFx0XHRcdGlmICh0aGlzLnByb2plY3RzQ29tcG9uZW50ID09IG51bGwpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR0aGlzLnByb2plY3RzQ29tcG9uZW50ID0gbmV3IFByb2plY3RzRWxlbWVudCgpO1xuXHRcdFx0XHRcdHRoaXMucHJvamVjdHNDb21wb25lbnQucmVmcmVzaCgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuY2hhbmdpbmdTZWN0aW9uLmFwcGVuZENoaWxkKHRoaXMucHJvamVjdHNDb21wb25lbnQpXG5cdFx0XHRcdG1lbnUuc2VsZWN0SXRlbSgnJylcblx0XHRcdH1cblxuXHRcdFx0aWYgKGxvY2F0aW9uLmhhc2guaW5kZXhPZignI3BhZ2U9ZGF0YXNldC1jYXRlZ29yaWVzJicpID09IDApXG5cdFx0XHR7XG5cdFx0XHRcdHRoaXMuY2hhbmdpbmdTZWN0aW9uLnRleHRDb250ZW50ID0gJydcblx0XHRcdFx0Y29uc3QgZGV0YWlsID0gbmV3IERhdGFzZXRDYXRlZ29yaWVzKCk7XG5cdFx0XHRcdHRoaXMuY2hhbmdpbmdTZWN0aW9uLmFwcGVuZENoaWxkKGRldGFpbClcblx0XHRcdFx0Y29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhsb2NhdGlvbi5oYXNoLnN1YnN0cmluZygxKSk7XG5cdFx0XHRcdGNvbnN0IHNlc3Npb25fc3RhcnRfdHMgPSBjc19ub3RudWxsKHBhcmFtcy5nZXQoJ3Nlc3Npb25fc3RhcnRfdHMnKSlcblx0XHRcdFx0Y29uc3QgZGF0YXNldF9uYW1lID0gY3Nfbm90bnVsbChwYXJhbXMuZ2V0KCdkYXRhc2V0X25hbWUnKSlcblx0XHRcdFx0ZGV0YWlsLnJlZnJlc2goc2Vzc2lvbl9zdGFydF90cywgZGF0YXNldF9uYW1lKTtcblx0XHRcdFx0bWVudS5zZWxlY3RJdGVtKGRhdGFzZXRfbmFtZSlcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0aWYgKGxvY2F0aW9uLmhhc2guc3RhcnRzV2l0aCgnI3BhZ2U9c3VtbWFyeSYnKSlcblx0XHRcdHtcblx0XHRcdFx0dGhpcy5jaGFuZ2luZ1NlY3Rpb24udGV4dENvbnRlbnQgPSAnJ1xuXHRcdFx0XHRjb25zdCBkZXRhaWwgPSBuZXcgRGF0YXNldElzc3Vlc0RldGFpbCgpO1xuXHRcdFx0XHR0aGlzLmNoYW5naW5nU2VjdGlvbi5hcHBlbmRDaGlsZChkZXRhaWwpXG5cdFx0XHRcdGNvbnN0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMobG9jYXRpb24uaGFzaC5zdWJzdHJpbmcoMSkpO1xuXHRcdFx0XHRjb25zdCBzZXNzaW9uX3N0YXJ0X3RzID0gY3Nfbm90bnVsbChwYXJhbXMuZ2V0KCdzZXNzaW9uX3N0YXJ0X3RzJykpXG5cdFx0XHRcdGNvbnN0IGRhdGFzZXRfbmFtZSA9IGNzX25vdG51bGwocGFyYW1zLmdldCgnZGF0YXNldF9uYW1lJykpXG5cdFx0XHRcdGNvbnN0IGNhdGVnb3J5X25hbWUgPSBjc19ub3RudWxsKHBhcmFtcy5nZXQoJ2NhdGVnb3J5X25hbWUnKSlcblx0XHRcdFx0ZGV0YWlsLnJlZnJlc2goc2Vzc2lvbl9zdGFydF90cywgZGF0YXNldF9uYW1lLCBjYXRlZ29yeV9uYW1lKTtcblx0XHRcdFx0bWVudS5zZWxlY3RJdGVtKGRhdGFzZXRfbmFtZSlcblx0XHRcdH1cblx0XHR9XG5cdFx0XG5cdFx0d2luZG93Lm9ucG9wc3RhdGUgPSAoZSkgPT4ge1xuXHRcdFx0b25oYXNoY2hhbmdlKClcblx0XHR9XG5cblx0XHRvbmhhc2hjaGFuZ2UoKVxuXG5cdFx0XG5cdH1cblx0XG59XG5cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgnY3MtbWFpbi1jb21wb25lbnQnLCBNYWluQ29tcG9uZW50KVxuIl19