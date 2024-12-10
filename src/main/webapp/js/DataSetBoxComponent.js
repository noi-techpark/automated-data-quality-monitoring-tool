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
    failedrecs;
    lastupdate;
    constructor() {
        super();
        const sroot = this.attachShadow({ mode: 'open' });
        sroot.innerHTML = `
			<style>
				:host {
					border: 1px solid #ccc;
					margin: 0.5rem;
					border-radius: 4px;
					cursor: pointer;
					width: 13rem;
				}
				.title {
					font-weight: bold;
					margin-top: .7rem;
					margin-bottom: 1rem;
					text-align: center;
					overflow: hidden;
				}
				
				/*
				:host(:hover) .title {
					text-decoration: underline;
				}
				 */
				
				.ts {
					font-size: 0.7rem
				}
				
				.view_dashboard {
					background-color: var(--dark-background);
					color: #ddd;
					text-align: center;
					padding: 0.6rem;
				}
				
				.wrapper {
					padding: 1rem;
				}
				
				
				
			</style>
			<img class="img">
			<div class="wrapper">
				<div class="title">XXX</div>
				<cs-label-and-data class="checktrec">checked records</cs-label-and-data>
				<cs-label-and-data class="checkattr" style="display: none">checked attributes</cs-label-and-data>
				<cs-label-and-data class="totissues" xstyle="display: none">total issues</cs-label-and-data>
				<cs-label-and-data class="lastupdate">total issues</cs-label-and-data>
			</div>
			<div class="view_dashboard">View dashboard</div>
		`;
        customElements.upgrade(sroot);
        this.checkrecs = cs_cast(LabelAndData, sroot.querySelector('.checktrec'));
        this.checkattr = cs_cast(LabelAndData, sroot.querySelector('.checkattr'));
        this.failedrecs = cs_cast(LabelAndData, sroot.querySelector('.totissues'));
        this.dtitle = cs_cast(HTMLDivElement, sroot.querySelector('.title'));
        this.img = cs_cast(HTMLImageElement, sroot.querySelector('.img'));
        this.lastupdate = cs_cast(LabelAndData, sroot.querySelector('.lastupdate'));
        this.img.style.display = 'none';
        this.checkrecs.setLabel('checked recs');
        this.checkattr.setLabel('checked attrs');
        this.failedrecs.setLabel('failed recs');
        this.lastupdate.setLabel('last update');
        // this.failedrecs.setSeverity("fail")
        // this.failedrecs.setData('123')
    }
    refresh(dataset) {
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
        this.checkrecs.setData('' + dataset.tested_records);
        this.checkattr.setData('123');
        this.failedrecs.setData('' + dataset.failed_records);
        const quality_ratio = dataset.tested_records == 0 ? 100 : dataset.failed_records / dataset.tested_records;
        if (quality_ratio < 0.1)
            this.failedrecs.setQualityLevel("good");
        else if (quality_ratio < 0.3)
            this.failedrecs.setQualityLevel("warn");
        else
            this.failedrecs.setQualityLevel("fail");
        this.lastupdate.setData(dateformat);
        this.onclick = () => {
            location.hash = '#page=dataset-categories' + '&dataset_name=' + dataset.dataset_name + "&session_start_ts=" + dataset.session_start_ts;
        };
    }
}
customElements.define('cs-dataset-box', DataSetBoxComponent);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YVNldEJveENvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3R5cGVzY3JpcHQvRGF0YVNldEJveENvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxPQUFPLEVBQUUsT0FBTyxFQUFZLE1BQU0sY0FBYyxDQUFDO0FBRWpELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQTtBQUdoRCxNQUFNLE9BQU8sbUJBQW9CLFNBQVEsV0FBVztJQUVuRCxNQUFNLENBQUE7SUFDTixHQUFHLENBQUE7SUFDSCxTQUFTLENBQUE7SUFDVCxTQUFTLENBQUE7SUFDVCxVQUFVLENBQUE7SUFDVixVQUFVLENBQUE7SUFFVjtRQUVDLEtBQUssRUFBRSxDQUFBO1FBQ1AsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFBO1FBQy9DLEtBQUssQ0FBQyxTQUFTLEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBa0RqQixDQUFBO1FBRUQsY0FBYyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUU3QixJQUFJLENBQUMsU0FBUyxHQUFJLE9BQU8sQ0FBQyxZQUFZLEVBQU8sS0FBSyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFBO1FBQy9FLElBQUksQ0FBQyxTQUFTLEdBQUksT0FBTyxDQUFDLFlBQVksRUFBTyxLQUFLLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUE7UUFDL0UsSUFBSSxDQUFDLFVBQVUsR0FBSSxPQUFPLENBQUMsWUFBWSxFQUFNLEtBQUssQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQTtRQUMvRSxJQUFJLENBQUMsTUFBTSxHQUFPLE9BQU8sQ0FBQyxjQUFjLEVBQUssS0FBSyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFBO1FBQzNFLElBQUksQ0FBQyxHQUFHLEdBQVUsT0FBTyxDQUFDLGdCQUFnQixFQUFHLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtRQUN6RSxJQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxZQUFZLEVBQU8sS0FBSyxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFBO1FBRWhGLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFFaEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUE7UUFDdkMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLENBQUE7UUFDeEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUE7UUFDdkMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUE7UUFFdkMsc0NBQXNDO1FBQ3RDLGlDQUFpQztJQUVsQyxDQUFDO0lBR0QsT0FBTyxDQUFDLE9BQXVEO1FBRTlELE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQTtRQUN4QyxNQUFNLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUU5QixNQUFNLFVBQVUsR0FBRyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFO1lBQ25ELElBQUksRUFBRSxTQUFTO1lBQ2YsS0FBSyxFQUFFLFNBQVM7WUFDaEIsR0FBRyxFQUFFLFNBQVM7WUFDZCxJQUFJLEVBQUUsU0FBUztZQUNmLE1BQU0sRUFBRSxTQUFTO1lBQ2pCLFFBQVEsRUFBRSxhQUFhO1NBQ3ZCLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUE7UUFFZixJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFBO1FBQzlDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUUsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUE7UUFDbkQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDN0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRSxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQTtRQUNwRCxNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsY0FBYyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUE7UUFDekcsSUFBSSxhQUFhLEdBQUcsR0FBRztZQUN0QixJQUFJLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQTthQUNuQyxJQUFJLGFBQWEsR0FBRyxHQUFHO1lBQzNCLElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFBOztZQUV2QyxJQUFJLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUN4QyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQTtRQUNuQyxJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRTtZQUNuQixRQUFRLENBQUMsSUFBSSxHQUFHLDBCQUEwQixHQUFHLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxZQUFZLEdBQUcsb0JBQW9CLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFBO1FBQ3ZJLENBQUMsQ0FBQTtJQUNGLENBQUM7Q0FDRDtBQUdELGNBQWMsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsbUJBQW1CLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAoQykgMjAyNCBDYXRjaCBTb2x2ZSBkaSBEYXZpZGUgTW9udGVzaW5cbiAqIExpY2Vuc2U6IEFHUExcbiAqL1xuXG5pbXBvcnQgeyBjc19jYXN0LCB0aHJvd05QRSB9IGZyb20gXCIuL3F1YWxpdHkuanNcIjtcblxuaW1wb3J0IHsgTGFiZWxBbmREYXRhIH0gZnJvbSBcIi4vTGFiZWxBbmREYXRhLmpzXCJcbmltcG9ydCB7IGNhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfbWF4X3RzX3Z3X19yb3cgfSBmcm9tIFwiLi9hcGkvYXBpMy5qc1wiO1xuXG5leHBvcnQgY2xhc3MgRGF0YVNldEJveENvbXBvbmVudCBleHRlbmRzIEhUTUxFbGVtZW50XG57XG5cdGR0aXRsZVxuXHRpbWdcblx0Y2hlY2tyZWNzXG5cdGNoZWNrYXR0clxuXHRmYWlsZWRyZWNzXG5cdGxhc3R1cGRhdGVcblx0XG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXHRcdHN1cGVyKClcblx0XHRjb25zdCBzcm9vdCA9IHRoaXMuYXR0YWNoU2hhZG93KHttb2RlOiAnb3Blbid9KVxuXHRcdHNyb290LmlubmVySFRNTCA9IGBcblx0XHRcdDxzdHlsZT5cblx0XHRcdFx0Omhvc3Qge1xuXHRcdFx0XHRcdGJvcmRlcjogMXB4IHNvbGlkICNjY2M7XG5cdFx0XHRcdFx0bWFyZ2luOiAwLjVyZW07XG5cdFx0XHRcdFx0Ym9yZGVyLXJhZGl1czogNHB4O1xuXHRcdFx0XHRcdGN1cnNvcjogcG9pbnRlcjtcblx0XHRcdFx0XHR3aWR0aDogMTNyZW07XG5cdFx0XHRcdH1cblx0XHRcdFx0LnRpdGxlIHtcblx0XHRcdFx0XHRmb250LXdlaWdodDogYm9sZDtcblx0XHRcdFx0XHRtYXJnaW4tdG9wOiAuN3JlbTtcblx0XHRcdFx0XHRtYXJnaW4tYm90dG9tOiAxcmVtO1xuXHRcdFx0XHRcdHRleHQtYWxpZ246IGNlbnRlcjtcblx0XHRcdFx0XHRvdmVyZmxvdzogaGlkZGVuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0XHQvKlxuXHRcdFx0XHQ6aG9zdCg6aG92ZXIpIC50aXRsZSB7XG5cdFx0XHRcdFx0dGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XG5cdFx0XHRcdH1cblx0XHRcdFx0ICovXG5cdFx0XHRcdFxuXHRcdFx0XHQudHMge1xuXHRcdFx0XHRcdGZvbnQtc2l6ZTogMC43cmVtXG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHRcdC52aWV3X2Rhc2hib2FyZCB7XG5cdFx0XHRcdFx0YmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZGFyay1iYWNrZ3JvdW5kKTtcblx0XHRcdFx0XHRjb2xvcjogI2RkZDtcblx0XHRcdFx0XHR0ZXh0LWFsaWduOiBjZW50ZXI7XG5cdFx0XHRcdFx0cGFkZGluZzogMC42cmVtO1xuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0XHQud3JhcHBlciB7XG5cdFx0XHRcdFx0cGFkZGluZzogMXJlbTtcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0XG5cdFx0XHRcdFxuXHRcdFx0PC9zdHlsZT5cblx0XHRcdDxpbWcgY2xhc3M9XCJpbWdcIj5cblx0XHRcdDxkaXYgY2xhc3M9XCJ3cmFwcGVyXCI+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJ0aXRsZVwiPlhYWDwvZGl2PlxuXHRcdFx0XHQ8Y3MtbGFiZWwtYW5kLWRhdGEgY2xhc3M9XCJjaGVja3RyZWNcIj5jaGVja2VkIHJlY29yZHM8L2NzLWxhYmVsLWFuZC1kYXRhPlxuXHRcdFx0XHQ8Y3MtbGFiZWwtYW5kLWRhdGEgY2xhc3M9XCJjaGVja2F0dHJcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIj5jaGVja2VkIGF0dHJpYnV0ZXM8L2NzLWxhYmVsLWFuZC1kYXRhPlxuXHRcdFx0XHQ8Y3MtbGFiZWwtYW5kLWRhdGEgY2xhc3M9XCJ0b3Rpc3N1ZXNcIiB4c3R5bGU9XCJkaXNwbGF5OiBub25lXCI+dG90YWwgaXNzdWVzPC9jcy1sYWJlbC1hbmQtZGF0YT5cblx0XHRcdFx0PGNzLWxhYmVsLWFuZC1kYXRhIGNsYXNzPVwibGFzdHVwZGF0ZVwiPnRvdGFsIGlzc3VlczwvY3MtbGFiZWwtYW5kLWRhdGE+XG5cdFx0XHQ8L2Rpdj5cblx0XHRcdDxkaXYgY2xhc3M9XCJ2aWV3X2Rhc2hib2FyZFwiPlZpZXcgZGFzaGJvYXJkPC9kaXY+XG5cdFx0YFxuXG5cdFx0Y3VzdG9tRWxlbWVudHMudXBncmFkZShzcm9vdClcblxuXHRcdHRoaXMuY2hlY2tyZWNzICA9IGNzX2Nhc3QoTGFiZWxBbmREYXRhLCAgICAgIHNyb290LnF1ZXJ5U2VsZWN0b3IoJy5jaGVja3RyZWMnKSlcblx0XHR0aGlzLmNoZWNrYXR0ciAgPSBjc19jYXN0KExhYmVsQW5kRGF0YSwgICAgICBzcm9vdC5xdWVyeVNlbGVjdG9yKCcuY2hlY2thdHRyJykpXG5cdFx0dGhpcy5mYWlsZWRyZWNzICA9IGNzX2Nhc3QoTGFiZWxBbmREYXRhLCAgICAgc3Jvb3QucXVlcnlTZWxlY3RvcignLnRvdGlzc3VlcycpKVxuXHRcdHRoaXMuZHRpdGxlICAgICA9IGNzX2Nhc3QoSFRNTERpdkVsZW1lbnQsICAgIHNyb290LnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpKVxuXHRcdHRoaXMuaW1nICAgICAgICA9IGNzX2Nhc3QoSFRNTEltYWdlRWxlbWVudCwgIHNyb290LnF1ZXJ5U2VsZWN0b3IoJy5pbWcnKSlcblx0XHR0aGlzLmxhc3R1cGRhdGUgPSBjc19jYXN0KExhYmVsQW5kRGF0YSwgICAgICBzcm9vdC5xdWVyeVNlbGVjdG9yKCcubGFzdHVwZGF0ZScpKVxuXHRcdFx0XHRcblx0XHR0aGlzLmltZy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXHRcdFxuXHRcdHRoaXMuY2hlY2tyZWNzLnNldExhYmVsKCdjaGVja2VkIHJlY3MnKVxuXHRcdHRoaXMuY2hlY2thdHRyLnNldExhYmVsKCdjaGVja2VkIGF0dHJzJylcblx0XHR0aGlzLmZhaWxlZHJlY3Muc2V0TGFiZWwoJ2ZhaWxlZCByZWNzJylcblx0XHR0aGlzLmxhc3R1cGRhdGUuc2V0TGFiZWwoJ2xhc3QgdXBkYXRlJylcblx0XHRcblx0XHQvLyB0aGlzLmZhaWxlZHJlY3Muc2V0U2V2ZXJpdHkoXCJmYWlsXCIpXG5cdFx0Ly8gdGhpcy5mYWlsZWRyZWNzLnNldERhdGEoJzEyMycpXG5cblx0fVxuXG5cdFxuXHRyZWZyZXNoKGRhdGFzZXQ6IGNhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfbWF4X3RzX3Z3X19yb3cpXG5cdHtcblx0XHRjb25zdCBkYXRlc3RyID0gZGF0YXNldC5zZXNzaW9uX3N0YXJ0X3RzXG5cdFx0Y29uc3QgZGF0ZSA9IG5ldyBEYXRlKGRhdGVzdHIpXG5cdFx0XG5cdFx0Y29uc3QgZGF0ZWZvcm1hdCA9IG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KCdpdC1JVCcsIHtcblx0XHRcdHllYXI6ICdudW1lcmljJyxcblx0XHRcdG1vbnRoOiAnMi1kaWdpdCcsXG5cdFx0XHRkYXk6ICcyLWRpZ2l0Jyxcblx0XHRcdGhvdXI6ICcyLWRpZ2l0Jyxcblx0XHRcdG1pbnV0ZTogXCIyLWRpZ2l0XCIsXG5cdFx0XHR0aW1lWm9uZTogJ0V1cm9wZS9Sb21lJ1xuXHRcdH0pLmZvcm1hdChkYXRlKVxuXHRcdFxuXHRcdHRoaXMuZHRpdGxlLnRleHRDb250ZW50ID0gZGF0YXNldC5kYXRhc2V0X25hbWVcblx0XHR0aGlzLmNoZWNrcmVjcy5zZXREYXRhKCcnICsgZGF0YXNldC50ZXN0ZWRfcmVjb3Jkcylcblx0XHR0aGlzLmNoZWNrYXR0ci5zZXREYXRhKCcxMjMnKVxuXHRcdHRoaXMuZmFpbGVkcmVjcy5zZXREYXRhKCcnICsgZGF0YXNldC5mYWlsZWRfcmVjb3Jkcylcblx0XHRjb25zdCBxdWFsaXR5X3JhdGlvID0gZGF0YXNldC50ZXN0ZWRfcmVjb3JkcyA9PSAwID8gMTAwIDogZGF0YXNldC5mYWlsZWRfcmVjb3JkcyAvIGRhdGFzZXQudGVzdGVkX3JlY29yZHNcblx0XHRpZiAocXVhbGl0eV9yYXRpbyA8IDAuMSlcblx0XHRcdHRoaXMuZmFpbGVkcmVjcy5zZXRRdWFsaXR5TGV2ZWwoXCJnb29kXCIpXG5cdFx0ZWxzZSBpZiAocXVhbGl0eV9yYXRpbyA8IDAuMylcblx0XHRcdHRoaXMuZmFpbGVkcmVjcy5zZXRRdWFsaXR5TGV2ZWwoXCJ3YXJuXCIpXG5cdFx0ZWxzZVxuXHRcdFx0dGhpcy5mYWlsZWRyZWNzLnNldFF1YWxpdHlMZXZlbChcImZhaWxcIilcblx0XHR0aGlzLmxhc3R1cGRhdGUuc2V0RGF0YShkYXRlZm9ybWF0KVxuXHRcdHRoaXMub25jbGljayA9ICgpID0+IHtcblx0XHRcdGxvY2F0aW9uLmhhc2ggPSAnI3BhZ2U9ZGF0YXNldC1jYXRlZ29yaWVzJyArICcmZGF0YXNldF9uYW1lPScgKyBkYXRhc2V0LmRhdGFzZXRfbmFtZSArIFwiJnNlc3Npb25fc3RhcnRfdHM9XCIgKyBkYXRhc2V0LnNlc3Npb25fc3RhcnRfdHNcblx0XHR9XG5cdH1cbn1cblxuXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ2NzLWRhdGFzZXQtYm94JywgRGF0YVNldEJveENvbXBvbmVudClcbiJdfQ==