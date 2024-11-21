/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */
import { cs_cast } from "./quality.js";
import { LabelAndData } from "./LabelAndData.js";
export class DataSetBoxComponent extends HTMLElement {
    dtitle;
    img;
    checkrecs;
    checkattr;
    totissues;
    lastupdate;
    constructor() {
        super();
        const sroot = this.attachShadow({ mode: 'open' });
        sroot.innerHTML = `
			<style>
				:host {
					padding: 0.5rem;
					border: 1px solid #ccc;
					margin: 0.5rem;
					border-radius: 4px;
					cursor: pointer;
				}
				.title {
					font-weight: bold;
					margin-bottom: 1rem;
				}
				:host(:hover) .title {
					text-decoration: underline;
				}
				.ts {
					font-size: 0.7rem
				}
				
				
				
			</style>
			<img class="img">
			<div class="title">XXX</div>
			<cs-label-and-data class="checktrec">checked records</cs-label-and-data>
			<cs-label-and-data class="checkattr" style="display: none">checked attributes</cs-label-and-data>
			<cs-label-and-data class="totissues" style="display: none">total issues</cs-label-and-data>
			<cs-label-and-data class="lastupdate">total issues</cs-label-and-data>
		`;
        customElements.upgrade(sroot);
        this.checkrecs = cs_cast(LabelAndData, sroot.querySelector('.checktrec'));
        this.checkattr = cs_cast(LabelAndData, sroot.querySelector('.checkattr'));
        this.totissues = cs_cast(LabelAndData, sroot.querySelector('.totissues'));
        this.dtitle = cs_cast(HTMLDivElement, sroot.querySelector('.title'));
        this.img = cs_cast(HTMLImageElement, sroot.querySelector('.img'));
        this.lastupdate = cs_cast(LabelAndData, sroot.querySelector('.lastupdate'));
        this.img.style.display = 'none';
        this.checkrecs.setLabel('checked recs');
        this.checkattr.setLabel('checked attrs');
        this.totissues.setLabel('tot issues');
        this.lastupdate.setLabel('last update');
        this.totissues.setSeverity("fail");
        this.totissues.setData('123');
    }
    refresh(dataset) {
        /*
        this.dtitle.textContent=(dataset.Shortname);
        // console.log(dataset)
        if (dataset.ImageGallery != null && dataset.ImageGallery.length > 0)
            this.img.src=(dataset.ImageGallery[0].ImageUrl + "&width=160");
         */
        const datestr = dataset.session_start_ts;
        const date = new Date(datestr);
        const dateformat = new Intl.DateTimeFormat('it-IT', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: "2-digit",
            timeZone: 'Europe/Rome'
        }).format(date);
        this.dtitle.textContent = dataset.dataset_name;
        this.checkrecs.setData('' + dataset.tested_recors);
        this.checkattr.setData('123');
        this.checkattr.setData('123');
        this.lastupdate.setData(dateformat);
        this.onclick = () => {
            location.hash = '#page=dataset-categories' + '&dataset_name=' + dataset.dataset_name + "&session_start_ts=" + dataset.session_start_ts;
        };
    }
}
customElements.define('cs-dataset-box', DataSetBoxComponent);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YVNldEJveENvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3R5cGVzY3JpcHQvRGF0YVNldEJveENvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxPQUFPLEVBQUUsT0FBTyxFQUFZLE1BQU0sY0FBYyxDQUFDO0FBRWpELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQTtBQUdoRCxNQUFNLE9BQU8sbUJBQW9CLFNBQVEsV0FBVztJQUVuRCxNQUFNLENBQUE7SUFDTixHQUFHLENBQUE7SUFDSCxTQUFTLENBQUE7SUFDVCxTQUFTLENBQUE7SUFDVCxTQUFTLENBQUE7SUFDVCxVQUFVLENBQUE7SUFFVjtRQUVDLEtBQUssRUFBRSxDQUFBO1FBQ1AsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFBO1FBQy9DLEtBQUssQ0FBQyxTQUFTLEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBNkJqQixDQUFBO1FBRUQsY0FBYyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUU3QixJQUFJLENBQUMsU0FBUyxHQUFJLE9BQU8sQ0FBQyxZQUFZLEVBQU8sS0FBSyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFBO1FBQy9FLElBQUksQ0FBQyxTQUFTLEdBQUksT0FBTyxDQUFDLFlBQVksRUFBTyxLQUFLLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUE7UUFDL0UsSUFBSSxDQUFDLFNBQVMsR0FBSSxPQUFPLENBQUMsWUFBWSxFQUFPLEtBQUssQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQTtRQUMvRSxJQUFJLENBQUMsTUFBTSxHQUFPLE9BQU8sQ0FBQyxjQUFjLEVBQUssS0FBSyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFBO1FBQzNFLElBQUksQ0FBQyxHQUFHLEdBQVUsT0FBTyxDQUFDLGdCQUFnQixFQUFHLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtRQUN6RSxJQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxZQUFZLEVBQU8sS0FBSyxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFBO1FBRWhGLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFFaEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUE7UUFDdkMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLENBQUE7UUFDeEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUE7UUFDckMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUE7UUFFdkMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDbEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7SUFFOUIsQ0FBQztJQUdELE9BQU8sQ0FBQyxPQUF1RDtRQUU5RDs7Ozs7V0FLRztRQUVILE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQTtRQUN4QyxNQUFNLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUU5QixNQUFNLFVBQVUsR0FBRyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFO1lBQ25ELElBQUksRUFBRSxTQUFTO1lBQ2YsS0FBSyxFQUFFLFNBQVM7WUFDaEIsR0FBRyxFQUFFLFNBQVM7WUFDZCxJQUFJLEVBQUUsU0FBUztZQUNmLE1BQU0sRUFBRSxTQUFTO1lBQ2pCLFFBQVEsRUFBRSxhQUFhO1NBQ3ZCLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUE7UUFFZixJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFBO1FBQzlDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUUsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUE7UUFDbEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDN0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDN0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUE7UUFDbkMsSUFBSSxDQUFDLE9BQU8sR0FBRyxHQUFHLEVBQUU7WUFDbkIsUUFBUSxDQUFDLElBQUksR0FBRywwQkFBMEIsR0FBRyxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsWUFBWSxHQUFHLG9CQUFvQixHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQTtRQUN2SSxDQUFDLENBQUE7SUFDRixDQUFDO0NBQ0Q7QUFHRCxjQUFjLENBQUMsTUFBTSxDQUFDLGdCQUFnQixFQUFFLG1CQUFtQixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogKEMpIDIwMjQgQ2F0Y2ggU29sdmUgZGkgRGF2aWRlIE1vbnRlc2luXG4gKiBMaWNlbnNlOiBBR1BMXG4gKi9cblxuaW1wb3J0IHsgY3NfY2FzdCwgdGhyb3dOUEUgfSBmcm9tIFwiLi9xdWFsaXR5LmpzXCI7XG5cbmltcG9ydCB7IExhYmVsQW5kRGF0YSB9IGZyb20gXCIuL0xhYmVsQW5kRGF0YS5qc1wiXG5pbXBvcnQgeyBjYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X21heF90c192d19fcm93IH0gZnJvbSBcIi4vYXBpL2FwaTMuanNcIjtcblxuZXhwb3J0IGNsYXNzIERhdGFTZXRCb3hDb21wb25lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudFxue1xuXHRkdGl0bGVcblx0aW1nXG5cdGNoZWNrcmVjc1xuXHRjaGVja2F0dHJcblx0dG90aXNzdWVzXG5cdGxhc3R1cGRhdGVcblx0XG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXHRcdHN1cGVyKClcblx0XHRjb25zdCBzcm9vdCA9IHRoaXMuYXR0YWNoU2hhZG93KHttb2RlOiAnb3Blbid9KVxuXHRcdHNyb290LmlubmVySFRNTCA9IGBcblx0XHRcdDxzdHlsZT5cblx0XHRcdFx0Omhvc3Qge1xuXHRcdFx0XHRcdHBhZGRpbmc6IDAuNXJlbTtcblx0XHRcdFx0XHRib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xuXHRcdFx0XHRcdG1hcmdpbjogMC41cmVtO1xuXHRcdFx0XHRcdGJvcmRlci1yYWRpdXM6IDRweDtcblx0XHRcdFx0XHRjdXJzb3I6IHBvaW50ZXI7XG5cdFx0XHRcdH1cblx0XHRcdFx0LnRpdGxlIHtcblx0XHRcdFx0XHRmb250LXdlaWdodDogYm9sZDtcblx0XHRcdFx0XHRtYXJnaW4tYm90dG9tOiAxcmVtO1xuXHRcdFx0XHR9XG5cdFx0XHRcdDpob3N0KDpob3ZlcikgLnRpdGxlIHtcblx0XHRcdFx0XHR0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcblx0XHRcdFx0fVxuXHRcdFx0XHQudHMge1xuXHRcdFx0XHRcdGZvbnQtc2l6ZTogMC43cmVtXG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHRcdFxuXHRcdFx0XHRcblx0XHRcdDwvc3R5bGU+XG5cdFx0XHQ8aW1nIGNsYXNzPVwiaW1nXCI+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwidGl0bGVcIj5YWFg8L2Rpdj5cblx0XHRcdDxjcy1sYWJlbC1hbmQtZGF0YSBjbGFzcz1cImNoZWNrdHJlY1wiPmNoZWNrZWQgcmVjb3JkczwvY3MtbGFiZWwtYW5kLWRhdGE+XG5cdFx0XHQ8Y3MtbGFiZWwtYW5kLWRhdGEgY2xhc3M9XCJjaGVja2F0dHJcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIj5jaGVja2VkIGF0dHJpYnV0ZXM8L2NzLWxhYmVsLWFuZC1kYXRhPlxuXHRcdFx0PGNzLWxhYmVsLWFuZC1kYXRhIGNsYXNzPVwidG90aXNzdWVzXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lXCI+dG90YWwgaXNzdWVzPC9jcy1sYWJlbC1hbmQtZGF0YT5cblx0XHRcdDxjcy1sYWJlbC1hbmQtZGF0YSBjbGFzcz1cImxhc3R1cGRhdGVcIj50b3RhbCBpc3N1ZXM8L2NzLWxhYmVsLWFuZC1kYXRhPlxuXHRcdGBcblxuXHRcdGN1c3RvbUVsZW1lbnRzLnVwZ3JhZGUoc3Jvb3QpXG5cblx0XHR0aGlzLmNoZWNrcmVjcyAgPSBjc19jYXN0KExhYmVsQW5kRGF0YSwgICAgICBzcm9vdC5xdWVyeVNlbGVjdG9yKCcuY2hlY2t0cmVjJykpXG5cdFx0dGhpcy5jaGVja2F0dHIgID0gY3NfY2FzdChMYWJlbEFuZERhdGEsICAgICAgc3Jvb3QucXVlcnlTZWxlY3RvcignLmNoZWNrYXR0cicpKVxuXHRcdHRoaXMudG90aXNzdWVzICA9IGNzX2Nhc3QoTGFiZWxBbmREYXRhLCAgICAgIHNyb290LnF1ZXJ5U2VsZWN0b3IoJy50b3Rpc3N1ZXMnKSlcblx0XHR0aGlzLmR0aXRsZSAgICAgPSBjc19jYXN0KEhUTUxEaXZFbGVtZW50LCAgICBzcm9vdC5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKSlcblx0XHR0aGlzLmltZyAgICAgICAgPSBjc19jYXN0KEhUTUxJbWFnZUVsZW1lbnQsICBzcm9vdC5xdWVyeVNlbGVjdG9yKCcuaW1nJykpXG5cdFx0dGhpcy5sYXN0dXBkYXRlID0gY3NfY2FzdChMYWJlbEFuZERhdGEsICAgICAgc3Jvb3QucXVlcnlTZWxlY3RvcignLmxhc3R1cGRhdGUnKSlcblx0XHRcdFx0XG5cdFx0dGhpcy5pbWcuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblx0XHRcblx0XHR0aGlzLmNoZWNrcmVjcy5zZXRMYWJlbCgnY2hlY2tlZCByZWNzJylcblx0XHR0aGlzLmNoZWNrYXR0ci5zZXRMYWJlbCgnY2hlY2tlZCBhdHRycycpXG5cdFx0dGhpcy50b3Rpc3N1ZXMuc2V0TGFiZWwoJ3RvdCBpc3N1ZXMnKVxuXHRcdHRoaXMubGFzdHVwZGF0ZS5zZXRMYWJlbCgnbGFzdCB1cGRhdGUnKVxuXHRcdFxuXHRcdHRoaXMudG90aXNzdWVzLnNldFNldmVyaXR5KFwiZmFpbFwiKVxuXHRcdHRoaXMudG90aXNzdWVzLnNldERhdGEoJzEyMycpXG5cblx0fVxuXG5cdFxuXHRyZWZyZXNoKGRhdGFzZXQ6IGNhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfbWF4X3RzX3Z3X19yb3cpXG5cdHtcblx0XHQvKlxuXHRcdHRoaXMuZHRpdGxlLnRleHRDb250ZW50PShkYXRhc2V0LlNob3J0bmFtZSk7XG5cdFx0Ly8gY29uc29sZS5sb2coZGF0YXNldClcblx0XHRpZiAoZGF0YXNldC5JbWFnZUdhbGxlcnkgIT0gbnVsbCAmJiBkYXRhc2V0LkltYWdlR2FsbGVyeS5sZW5ndGggPiAwKVxuXHRcdFx0dGhpcy5pbWcuc3JjPShkYXRhc2V0LkltYWdlR2FsbGVyeVswXS5JbWFnZVVybCArIFwiJndpZHRoPTE2MFwiKTtcblx0XHQgKi9cblx0XHRcblx0XHRjb25zdCBkYXRlc3RyID0gZGF0YXNldC5zZXNzaW9uX3N0YXJ0X3RzXG5cdFx0Y29uc3QgZGF0ZSA9IG5ldyBEYXRlKGRhdGVzdHIpXG5cdFx0XG5cdFx0Y29uc3QgZGF0ZWZvcm1hdCA9IG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KCdpdC1JVCcsIHtcblx0XHRcdHllYXI6ICdudW1lcmljJyxcblx0XHRcdG1vbnRoOiAnMi1kaWdpdCcsXG5cdFx0XHRkYXk6ICcyLWRpZ2l0Jyxcblx0XHRcdGhvdXI6ICcyLWRpZ2l0Jyxcblx0XHRcdG1pbnV0ZTogXCIyLWRpZ2l0XCIsXG5cdFx0XHR0aW1lWm9uZTogJ0V1cm9wZS9Sb21lJ1xuXHRcdH0pLmZvcm1hdChkYXRlKVxuXHRcdFxuXHRcdHRoaXMuZHRpdGxlLnRleHRDb250ZW50ID0gZGF0YXNldC5kYXRhc2V0X25hbWVcblx0XHR0aGlzLmNoZWNrcmVjcy5zZXREYXRhKCcnICsgZGF0YXNldC50ZXN0ZWRfcmVjb3JzKVxuXHRcdHRoaXMuY2hlY2thdHRyLnNldERhdGEoJzEyMycpXG5cdFx0dGhpcy5jaGVja2F0dHIuc2V0RGF0YSgnMTIzJylcblx0XHR0aGlzLmxhc3R1cGRhdGUuc2V0RGF0YShkYXRlZm9ybWF0KVxuXHRcdHRoaXMub25jbGljayA9ICgpID0+IHtcblx0XHRcdGxvY2F0aW9uLmhhc2ggPSAnI3BhZ2U9ZGF0YXNldC1jYXRlZ29yaWVzJyArICcmZGF0YXNldF9uYW1lPScgKyBkYXRhc2V0LmRhdGFzZXRfbmFtZSArIFwiJnNlc3Npb25fc3RhcnRfdHM9XCIgKyBkYXRhc2V0LnNlc3Npb25fc3RhcnRfdHNcblx0XHR9XG5cdH1cbn1cblxuXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ2NzLWRhdGFzZXQtYm94JywgRGF0YVNldEJveENvbXBvbmVudClcbiJdfQ==