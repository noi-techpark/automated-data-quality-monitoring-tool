/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */
import { cs_cast } from "./quality.js";
import { API3 } from './api/api3.js';
import { OpenCloseSection } from "./OpenCloseSection.js";
import { SectionRow } from "./SectionRow.js";
export class DatasetIssuesDetail extends HTMLElement {
    container;
    last_session_start_ts = null;
    last_dataset_name = null;
    last_check_category = null;
    current_tab = 'issues';
    constructor() {
        super();
        const sroot = this.attachShadow({ mode: 'open' });
        sroot.innerHTML = `
				<style>
					:host {
						padding: 0.5rem;
						display: block;
					}
					.container {
						border: 1px solid #ccc;
						border-radius: 0.3rem;
					}
					
					.container > * {
						border-bottom: 1px solid #ccc;
					}
				</style>
				<img src="kpi-detail.png" style="max-width: 100%">
				<div style="width: calc(100% - 210px)">
					<div style="text-align: right">
						<button class="issues">Issues</button>
						<button class="records">Records</button>
					</div>
					<div class="container"></div>
				</div>
				`;
        customElements.upgrade(sroot);
        this.container = cs_cast(HTMLDivElement, sroot.querySelector('.container'));
        const issues = cs_cast(HTMLButtonElement, sroot.querySelector('.issues'));
        const records = cs_cast(HTMLButtonElement, sroot.querySelector('.records'));
        issues.onclick = () => {
            this.current_tab = 'issues';
            if (this.last_session_start_ts != null && this.last_dataset_name != null && this.last_check_category != null)
                this.refresh(this.last_session_start_ts, this.last_dataset_name, this.last_check_category);
        };
        records.onclick = () => {
            this.current_tab = 'records';
            if (this.last_session_start_ts != null && this.last_dataset_name != null && this.last_check_category != null)
                this.refresh(this.last_session_start_ts, this.last_dataset_name, this.last_check_category);
        };
    }
    extractHumanReadableName(record_jsonpath, json) {
        let ret = '';
        for (let fn of ['mvalidtime', 'mvalue', 'AccoDetail.de.Name', 'Detail.de.Title']) {
            const fn_parts = fn.split('.');
            let val = JSON.parse(json);
            for (let p of fn_parts) {
                val = val[p];
                if (val === undefined)
                    break;
            }
            // const val = start[fn] 
            if (val !== undefined)
                ret += (ret === '' ? '' : ', ') + fn + '=' + JSON.stringify(val);
        }
        if (ret == '')
            ret = record_jsonpath;
        return ret;
    }
    async refresh(p_session_start_ts, p_dataset_name, p_category_name) {
        this.last_session_start_ts = p_session_start_ts;
        this.last_dataset_name = p_dataset_name;
        this.last_check_category = p_category_name;
        console.log(p_session_start_ts);
        console.log(p_dataset_name);
        console.log(p_category_name);
        this.container.textContent = '';
        if (this.current_tab === 'issues') {
            const json = await API3.list__catchsolve_noiodh__test_dataset_check_category_check_name_record_record_failed_vw({
                session_start_ts: p_session_start_ts,
                dataset_name: p_dataset_name,
                check_category: p_category_name
            });
            console.log(json);
            for (let i = 0; i < json.length; i++) {
                const issue = json[i];
                // console.log(issue)
                const section = new OpenCloseSection();
                section.refresh(issue.check_name, '' + issue.nr_records + ' records');
                this.container.appendChild(section);
                section.onopen = async () => {
                    //console.log('sezione aperta, ricarico!')
                    const json2 = await API3.list__catchsolve_noiodh__test_dataset_record_check_failed({
                        session_start_ts: p_session_start_ts,
                        dataset_name: p_dataset_name,
                        check_category: p_category_name,
                        check_name: issue.check_name
                    });
                    const groupBy = {};
                    for (let k = 0; k < json2.length; k++) {
                        const sname = JSON.parse(json2[k].record_json)['sname'];
                        let prev_arr = groupBy[sname];
                        prev_arr = prev_arr === undefined ? [] : prev_arr;
                        prev_arr.push(json2[k]);
                        groupBy[sname] = prev_arr;
                    }
                    const keys = Object.keys(groupBy);
                    console.log(keys);
                    for (let k = 0; k < keys.length; k++) {
                        const sectionRow = new OpenCloseSection();
                        section.addElementToContentArea(sectionRow);
                        sectionRow.refresh(keys[k], '' + groupBy[keys[k]].length + ' records');
                        sectionRow.onclick = () => {
                            const list = groupBy[keys[k]];
                            console.log(list);
                            for (let k2 = 0; k2 < list.length; k2++) {
                                const sectionRow2 = new SectionRow();
                                sectionRow.addElementToContentArea(sectionRow2);
                                sectionRow2.refresh(this.extractHumanReadableName(list[k2].record_jsonpath, list[k2].record_json));
                                sectionRow2.onclick = () => {
                                    alert(list[k2].record_json);
                                };
                            }
                        };
                    }
                    /*
                    for (let k = 0; k < json2.length; k++)
                    {
                        const sectionRow = new SectionRow();
                        section.addElementToContentArea(sectionRow)
                        sectionRow.refresh(json2[k].record_jsonpath)
                        sectionRow.onclick = () => {
                            alert(json2[k].record_json)
                        }
                    }
                    */
                };
            }
        }
        if (this.current_tab === 'records') {
            const json = await API3.list__catchsolve_noiodh__test_dataset_check_category_record_jsonpath_failed_vw({
                session_start_ts: p_session_start_ts,
                dataset_name: p_dataset_name,
                check_category: p_category_name
            });
            for (let i = 0; i < json.length; i++) {
                const issue = json[i];
                // console.log(issue)
                const section = new OpenCloseSection();
                section.refresh(issue.record_jsonpath, '' + issue.nr_check_names + ' checks');
                this.container.appendChild(section);
                section.onopen = async () => {
                    //console.log('sezione aperta, ricarico!')
                    const json2 = await API3.list__catchsolve_noiodh__test_dataset_record_check_failed({
                        session_start_ts: p_session_start_ts,
                        dataset_name: p_dataset_name,
                        check_category: p_category_name,
                        record_jsonpath: issue.record_jsonpath
                    });
                    for (let k = 0; k < json2.length; k++) {
                        const sectionRow = new OpenCloseSection();
                        section.addElementToContentArea(sectionRow);
                        sectionRow.refresh(json2[k].check_name, '');
                    }
                };
            }
        }
    }
}
customElements.define('cs-dataset-issues-detail', DatasetIssuesDetail);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YXNldElzc3Vlc0RldGFpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3R5cGVzY3JpcHQvRGF0YXNldElzc3Vlc0RldGFpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxPQUFPLEVBQUUsT0FBTyxFQUFZLE1BQU0sY0FBYyxDQUFDO0FBQ2pELE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDbkMsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDekQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRTdDLE1BQU0sT0FBTyxtQkFBb0IsU0FBUSxXQUFXO0lBR25ELFNBQVMsQ0FBQTtJQUVULHFCQUFxQixHQUFnQixJQUFJLENBQUE7SUFFekMsaUJBQWlCLEdBQWdCLElBQUksQ0FBQTtJQUVyQyxtQkFBbUIsR0FBZ0IsSUFBSSxDQUFBO0lBRXZDLFdBQVcsR0FBeUIsUUFBUSxDQUFBO0lBRTVDO1FBQ0MsS0FBSyxFQUFFLENBQUE7UUFDUCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUE7UUFDakQsS0FBSyxDQUFDLFNBQVMsR0FBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7S0F1QmYsQ0FBQTtRQUVILGNBQWMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7UUFFN0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsY0FBYyxFQUFFLEtBQUssQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQTtRQUUzRSxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFBO1FBQ3pFLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRSxLQUFLLENB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LENBQUMseURBQXlELENBQUM7d0JBQ2pGLGdCQUFnQixFQUFFLGtCQUFrQjt3QkFDcEMsWUFBWSxFQUFFLGNBQWM7d0JBQzVCLGNBQWMsRUFBRSxlQUFlO3dCQUMvQixlQUFlLEVBQUUsS0FBSyxDQUFDLGVBQWU7cUJBQ3ZDLENBQUMsQ0FBQztvQkFDSCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFDckMsQ0FBQzt3QkFDQSxNQUFNLFVBQVUsR0FBRyxJQUFJLGdCQUFnQixFQUFFLENBQUM7d0JBQzFDLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxVQUFVLENBQUMsQ0FBQTt3QkFDM0MsVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFBO29CQUM1QyxDQUFDO2dCQUNGLENBQUMsQ0FBQTtZQUNGLENBQUM7UUFDRixDQUFDO0lBQ0YsQ0FBQztDQUNEO0FBRUQsY0FBYyxDQUFDLE1BQU0sQ0FBQywwQkFBMEIsRUFBRSxtQkFBbUIsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIChDKSAyMDI0IENhdGNoIFNvbHZlIGRpIERhdmlkZSBNb250ZXNpblxuICogTGljZW5zZTogQUdQTFxuICovXG5cbmltcG9ydCB7IGNzX2Nhc3QsIHRocm93TlBFIH0gZnJvbSBcIi4vcXVhbGl0eS5qc1wiO1xuaW1wb3J0IHtBUEkzfSBmcm9tICcuL2FwaS9hcGkzLmpzJztcbmltcG9ydCB7IE9wZW5DbG9zZVNlY3Rpb24gfSBmcm9tIFwiLi9PcGVuQ2xvc2VTZWN0aW9uLmpzXCI7XG5pbXBvcnQgeyBTZWN0aW9uUm93IH0gZnJvbSBcIi4vU2VjdGlvblJvdy5qc1wiO1xuXG5leHBvcnQgY2xhc3MgRGF0YXNldElzc3Vlc0RldGFpbCBleHRlbmRzIEhUTUxFbGVtZW50XG57XG5cdFxuXHRjb250YWluZXIgXG5cdFxuXHRsYXN0X3Nlc3Npb25fc3RhcnRfdHM6IHN0cmluZ3xudWxsID0gbnVsbFxuXHRcblx0bGFzdF9kYXRhc2V0X25hbWU6IHN0cmluZ3xudWxsID0gbnVsbFxuXHRcblx0bGFzdF9jaGVja19jYXRlZ29yeTogc3RyaW5nfG51bGwgPSBudWxsXG5cdFxuXHRjdXJyZW50X3RhYjogJ2lzc3VlcycgfCAncmVjb3JkcycgPSAnaXNzdWVzJ1xuXHRcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKVxuXHRcdGNvbnN0IHNyb290ID0gdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSlcblx0XHRzcm9vdC5pbm5lckhUTUwgPSBgXG5cdFx0XHRcdDxzdHlsZT5cblx0XHRcdFx0XHQ6aG9zdCB7XG5cdFx0XHRcdFx0XHRwYWRkaW5nOiAwLjVyZW07XG5cdFx0XHRcdFx0XHRkaXNwbGF5OiBibG9jaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0LmNvbnRhaW5lciB7XG5cdFx0XHRcdFx0XHRib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xuXHRcdFx0XHRcdFx0Ym9yZGVyLXJhZGl1czogMC4zcmVtO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcblx0XHRcdFx0XHQuY29udGFpbmVyID4gKiB7XG5cdFx0XHRcdFx0XHRib3JkZXItYm90dG9tOiAxcHggc29saWQgI2NjYztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdDwvc3R5bGU+XG5cdFx0XHRcdDxpbWcgc3JjPVwia3BpLWRldGFpbC5wbmdcIiBzdHlsZT1cIm1heC13aWR0aDogMTAwJVwiPlxuXHRcdFx0XHQ8ZGl2IHN0eWxlPVwid2lkdGg6IGNhbGMoMTAwJSAtIDIxMHB4KVwiPlxuXHRcdFx0XHRcdDxkaXYgc3R5bGU9XCJ0ZXh0LWFsaWduOiByaWdodFwiPlxuXHRcdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cImlzc3Vlc1wiPklzc3VlczwvYnV0dG9uPlxuXHRcdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cInJlY29yZHNcIj5SZWNvcmRzPC9idXR0b24+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPjwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0YFxuXG5cdFx0Y3VzdG9tRWxlbWVudHMudXBncmFkZShzcm9vdClcblxuXHRcdHRoaXMuY29udGFpbmVyID0gY3NfY2FzdChIVE1MRGl2RWxlbWVudCwgc3Jvb3QucXVlcnlTZWxlY3RvcignLmNvbnRhaW5lcicpKVxuXHRcdFxuXHRcdGNvbnN0IGlzc3VlcyA9IGNzX2Nhc3QoSFRNTEJ1dHRvbkVsZW1lbnQsIHNyb290LnF1ZXJ5U2VsZWN0b3IoJy5pc3N1ZXMnKSlcblx0XHRjb25zdCByZWNvcmRzID0gY3NfY2FzdChIVE1MQnV0dG9uRWxlbWVudCwgc3Jvb3QucXVlcnlTZWxlY3RvcignLnJlY29yZHMnKSlcblx0XHRcblx0XHRpc3N1ZXMub25jbGljayA9ICgpID0+IHtcblx0XHRcdHRoaXMuY3VycmVudF90YWIgPSAnaXNzdWVzJ1xuXHRcdFx0aWYgKHRoaXMubGFzdF9zZXNzaW9uX3N0YXJ0X3RzICE9IG51bGwgJiYgdGhpcy5sYXN0X2RhdGFzZXRfbmFtZSAhPSBudWxsICYmIHRoaXMubGFzdF9jaGVja19jYXRlZ29yeSAhPSBudWxsKVxuXHRcdFx0XHR0aGlzLnJlZnJlc2godGhpcy5sYXN0X3Nlc3Npb25fc3RhcnRfdHMsIHRoaXMubGFzdF9kYXRhc2V0X25hbWUsIHRoaXMubGFzdF9jaGVja19jYXRlZ29yeSlcblx0XHR9XG5cdFx0XG5cdFx0cmVjb3Jkcy5vbmNsaWNrID0gKCkgPT4ge1xuXHRcdFx0dGhpcy5jdXJyZW50X3RhYiA9ICdyZWNvcmRzJ1xuXHRcdFx0aWYgKHRoaXMubGFzdF9zZXNzaW9uX3N0YXJ0X3RzICE9IG51bGwgJiYgdGhpcy5sYXN0X2RhdGFzZXRfbmFtZSAhPSBudWxsICYmIHRoaXMubGFzdF9jaGVja19jYXRlZ29yeSAhPSBudWxsKVxuXHRcdFx0XHR0aGlzLnJlZnJlc2godGhpcy5sYXN0X3Nlc3Npb25fc3RhcnRfdHMsIHRoaXMubGFzdF9kYXRhc2V0X25hbWUsIHRoaXMubGFzdF9jaGVja19jYXRlZ29yeSlcblx0XHR9XG5cdFx0XG5cdH1cblx0XG5cdGV4dHJhY3RIdW1hblJlYWRhYmxlTmFtZShyZWNvcmRfanNvbnBhdGg6IHN0cmluZywganNvbjogc3RyaW5nKTogc3RyaW5nXG5cdHtcblx0XHRsZXQgcmV0ID0gJyc7XG5cdFx0Zm9yIChsZXQgZm4gb2YgWydtdmFsaWR0aW1lJywgJ212YWx1ZScsICdBY2NvRGV0YWlsLmRlLk5hbWUnLCAnRGV0YWlsLmRlLlRpdGxlJ10pXG5cdFx0e1xuXHRcdFx0Y29uc3QgZm5fcGFydHMgPSBmbi5zcGxpdCgnLicpXG5cdFx0XHRsZXQgdmFsID0gSlNPTi5wYXJzZShqc29uKVxuXHRcdFx0Zm9yIChsZXQgcCBvZiBmbl9wYXJ0cylcblx0XHRcdHtcblx0XHRcdFx0dmFsID0gdmFsW3BdXG5cdFx0XHRcdGlmICh2YWwgPT09IHVuZGVmaW5lZClcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdC8vIGNvbnN0IHZhbCA9IHN0YXJ0W2ZuXSBcblx0XHRcdGlmICh2YWwgIT09IHVuZGVmaW5lZClcblx0XHRcdFx0cmV0ICs9IChyZXQgPT09ICcnID8gJycgOiAnLCAnKSArIGZuICsgJz0nICsgSlNPTi5zdHJpbmdpZnkodmFsKVxuXHRcdH1cblx0XHRpZiAocmV0ID09ICcnKVxuXHRcdFx0cmV0ID0gcmVjb3JkX2pzb25wYXRoXG5cdFx0cmV0dXJuIHJldDtcblx0fVxuXHRcblx0YXN5bmMgcmVmcmVzaChwX3Nlc3Npb25fc3RhcnRfdHM6IHN0cmluZywgcF9kYXRhc2V0X25hbWU6IHN0cmluZywgcF9jYXRlZ29yeV9uYW1lOiBzdHJpbmcpIHtcblx0XHRcblx0XHR0aGlzLmxhc3Rfc2Vzc2lvbl9zdGFydF90cyA9IHBfc2Vzc2lvbl9zdGFydF90c1xuXHRcdHRoaXMubGFzdF9kYXRhc2V0X25hbWUgPSBwX2RhdGFzZXRfbmFtZVxuXHRcdHRoaXMubGFzdF9jaGVja19jYXRlZ29yeSA9IHBfY2F0ZWdvcnlfbmFtZVxuXHRcdFxuXHRcdGNvbnNvbGUubG9nKHBfc2Vzc2lvbl9zdGFydF90cylcblx0XHRjb25zb2xlLmxvZyhwX2RhdGFzZXRfbmFtZSlcblx0XHRjb25zb2xlLmxvZyhwX2NhdGVnb3J5X25hbWUpXG5cdFx0XG5cdFx0dGhpcy5jb250YWluZXIudGV4dENvbnRlbnQgPSAnJ1xuXG5cdFx0aWYgKHRoaXMuY3VycmVudF90YWIgPT09ICdpc3N1ZXMnKVxuXHRcdHtcblx0XHRcblx0XHRcdGNvbnN0IGpzb24gPSBhd2FpdCBBUEkzLmxpc3RfX2NhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfY2hlY2tfY2F0ZWdvcnlfY2hlY2tfbmFtZV9yZWNvcmRfcmVjb3JkX2ZhaWxlZF92dyh7XG5cdFx0XHRcdHNlc3Npb25fc3RhcnRfdHM6IHBfc2Vzc2lvbl9zdGFydF90cyxcblx0XHRcdFx0ZGF0YXNldF9uYW1lOiBwX2RhdGFzZXRfbmFtZSxcblx0XHRcdFx0Y2hlY2tfY2F0ZWdvcnk6IHBfY2F0ZWdvcnlfbmFtZVxuXHRcdFx0fSlcblx0XHRcdFxuXHRcdFx0Y29uc29sZS5sb2coanNvbilcblx0XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGpzb24ubGVuZ3RoOyBpKyspXG5cdFx0XHR7XG5cdFx0XHRcdGNvbnN0IGlzc3VlID0ganNvbltpXVxuXHRcdFx0XHQvLyBjb25zb2xlLmxvZyhpc3N1ZSlcblx0XHRcdFx0Y29uc3Qgc2VjdGlvbiA9IG5ldyBPcGVuQ2xvc2VTZWN0aW9uKClcblx0XHRcdFx0c2VjdGlvbi5yZWZyZXNoKGlzc3VlLmNoZWNrX25hbWUsICcnICsgaXNzdWUubnJfcmVjb3JkcyArICcgcmVjb3JkcycpXG5cdFx0XHRcdHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHNlY3Rpb24pXG5cdFx0XHRcdFxuXHRcdFx0XHRzZWN0aW9uLm9ub3BlbiA9IGFzeW5jICgpID0+IHtcblx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKCdzZXppb25lIGFwZXJ0YSwgcmljYXJpY28hJylcblx0XHRcdFx0XHRjb25zdCBqc29uMiA9IGF3YWl0IEFQSTMubGlzdF9fY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9yZWNvcmRfY2hlY2tfZmFpbGVkKHtcblx0XHRcdFx0XHRcdFx0XHRzZXNzaW9uX3N0YXJ0X3RzOiBwX3Nlc3Npb25fc3RhcnRfdHMsXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YXNldF9uYW1lOiBwX2RhdGFzZXRfbmFtZSxcblx0XHRcdFx0XHRcdFx0XHRjaGVja19jYXRlZ29yeTogcF9jYXRlZ29yeV9uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdGNoZWNrX25hbWU6IGlzc3VlLmNoZWNrX25hbWVcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRjb25zdCBncm91cEJ5ID0ge31cblx0XHRcdFx0XHRmb3IgKGxldCBrID0gMDsgayA8IGpzb24yLmxlbmd0aDsgaysrKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGNvbnN0IHNuYW1lID0gSlNPTi5wYXJzZShqc29uMltrXS5yZWNvcmRfanNvbilbJ3NuYW1lJ107XG5cdFx0XHRcdFx0XHRsZXQgcHJldl9hcnIgPSBncm91cEJ5W3NuYW1lXVxuXHRcdFx0XHRcdFx0cHJldl9hcnIgPSBwcmV2X2FyciA9PT0gdW5kZWZpbmVkID8gW10gOiBwcmV2X2FyclxuXHRcdFx0XHRcdFx0cHJldl9hcnIucHVzaChqc29uMltrXSlcblx0XHRcdFx0XHRcdGdyb3VwQnlbc25hbWVdID0gcHJldl9hcnJcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGdyb3VwQnkpXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coa2V5cylcblx0XHRcdFx0XHRmb3IgKGxldCBrID0gMDsgayA8IGtleXMubGVuZ3RoOyBrKyspXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Y29uc3Qgc2VjdGlvblJvdyA9IG5ldyBPcGVuQ2xvc2VTZWN0aW9uKCk7XG5cdFx0XHRcdFx0XHRzZWN0aW9uLmFkZEVsZW1lbnRUb0NvbnRlbnRBcmVhKHNlY3Rpb25Sb3cpXG5cdFx0XHRcdFx0XHRzZWN0aW9uUm93LnJlZnJlc2goa2V5c1trXSwgJycgKyBncm91cEJ5W2tleXNba11dLmxlbmd0aCArICcgcmVjb3JkcycpXG5cdFx0XHRcdFx0XHRzZWN0aW9uUm93Lm9uY2xpY2sgPSAoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IGxpc3QgPSBncm91cEJ5W2tleXNba11dXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGxpc3QpXG5cdFx0XHRcdFx0XHRcdGZvciAobGV0IGsyID0gMDsgazIgPCBsaXN0Lmxlbmd0aDsgazIrKylcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdGNvbnN0IHNlY3Rpb25Sb3cyID0gbmV3IFNlY3Rpb25Sb3coKTtcblx0XHRcdFx0XHRcdFx0XHRzZWN0aW9uUm93LmFkZEVsZW1lbnRUb0NvbnRlbnRBcmVhKHNlY3Rpb25Sb3cyKVxuXHRcdFx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cyLnJlZnJlc2godGhpcy5leHRyYWN0SHVtYW5SZWFkYWJsZU5hbWUobGlzdFtrMl0ucmVjb3JkX2pzb25wYXRoLCBsaXN0W2syXS5yZWNvcmRfanNvbikpXG5cdFx0XHRcdFx0XHRcdFx0c2VjdGlvblJvdzIub25jbGljayA9ICgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdGFsZXJ0KGxpc3RbazJdLnJlY29yZF9qc29uKVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvKlxuXHRcdFx0XHRcdGZvciAobGV0IGsgPSAwOyBrIDwganNvbjIubGVuZ3RoOyBrKyspXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Y29uc3Qgc2VjdGlvblJvdyA9IG5ldyBTZWN0aW9uUm93KCk7XG5cdFx0XHRcdFx0XHRzZWN0aW9uLmFkZEVsZW1lbnRUb0NvbnRlbnRBcmVhKHNlY3Rpb25Sb3cpXG5cdFx0XHRcdFx0XHRzZWN0aW9uUm93LnJlZnJlc2goanNvbjJba10ucmVjb3JkX2pzb25wYXRoKVxuXHRcdFx0XHRcdFx0c2VjdGlvblJvdy5vbmNsaWNrID0gKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRhbGVydChqc29uMltrXS5yZWNvcmRfanNvbilcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ki9cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0XHRcdFxuXHRcdH1cblx0XHRcblx0XHRcblx0XHRpZiAodGhpcy5jdXJyZW50X3RhYiA9PT0gJ3JlY29yZHMnKVxuXHRcdHtcblx0XHRcdGNvbnN0IGpzb24gPSBhd2FpdCBBUEkzLmxpc3RfX2NhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfY2hlY2tfY2F0ZWdvcnlfcmVjb3JkX2pzb25wYXRoX2ZhaWxlZF92dyh7XG5cdFx0XHRcdHNlc3Npb25fc3RhcnRfdHM6IHBfc2Vzc2lvbl9zdGFydF90cyxcblx0XHRcdFx0ZGF0YXNldF9uYW1lOiBwX2RhdGFzZXRfbmFtZSxcblx0XHRcdFx0Y2hlY2tfY2F0ZWdvcnk6IHBfY2F0ZWdvcnlfbmFtZVxuXHRcdFx0fSk7XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGpzb24ubGVuZ3RoOyBpKyspXG5cdFx0XHR7XG5cdFx0XHRcdGNvbnN0IGlzc3VlID0ganNvbltpXVxuXHRcdFx0XHQvLyBjb25zb2xlLmxvZyhpc3N1ZSlcblx0XHRcdFx0Y29uc3Qgc2VjdGlvbiA9IG5ldyBPcGVuQ2xvc2VTZWN0aW9uKClcblx0XHRcdFx0c2VjdGlvbi5yZWZyZXNoKGlzc3VlLnJlY29yZF9qc29ucGF0aCwgJycgKyBpc3N1ZS5ucl9jaGVja19uYW1lcyArICcgY2hlY2tzJylcblx0XHRcdFx0dGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoc2VjdGlvbilcblx0XHRcdFx0XG5cdFx0XHRcdHNlY3Rpb24ub25vcGVuID0gYXN5bmMgKCkgPT4ge1xuXHRcdFx0XHQvL2NvbnNvbGUubG9nKCdzZXppb25lIGFwZXJ0YSwgcmljYXJpY28hJylcblx0XHRcdFx0XHRjb25zdCBqc29uMiA9IGF3YWl0IEFQSTMubGlzdF9fY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9yZWNvcmRfY2hlY2tfZmFpbGVkKHtcblx0XHRcdFx0XHRcdFx0c2Vzc2lvbl9zdGFydF90czogcF9zZXNzaW9uX3N0YXJ0X3RzLFxuXHRcdFx0XHRcdFx0XHRkYXRhc2V0X25hbWU6IHBfZGF0YXNldF9uYW1lLFxuXHRcdFx0XHRcdFx0XHRjaGVja19jYXRlZ29yeTogcF9jYXRlZ29yeV9uYW1lLFxuXHRcdFx0XHRcdFx0XHRyZWNvcmRfanNvbnBhdGg6IGlzc3VlLnJlY29yZF9qc29ucGF0aFxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdGZvciAobGV0IGsgPSAwOyBrIDwganNvbjIubGVuZ3RoOyBrKyspXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Y29uc3Qgc2VjdGlvblJvdyA9IG5ldyBPcGVuQ2xvc2VTZWN0aW9uKCk7XG5cdFx0XHRcdFx0XHRzZWN0aW9uLmFkZEVsZW1lbnRUb0NvbnRlbnRBcmVhKHNlY3Rpb25Sb3cpXG5cdFx0XHRcdFx0XHRzZWN0aW9uUm93LnJlZnJlc2goanNvbjJba10uY2hlY2tfbmFtZSwgJycpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG5cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgnY3MtZGF0YXNldC1pc3N1ZXMtZGV0YWlsJywgRGF0YXNldElzc3Vlc0RldGFpbClcbiJdfQ==