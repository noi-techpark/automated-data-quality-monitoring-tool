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
    groupRecords(list) {
        const groupBy = {};
        for (let k = 0; k < list.length; k++) {
            const json = JSON.parse(list[k].record_json);
            let sname = json['sname'];
            if (typeof sname !== 'string')
                sname = '';
            let prev_arr = groupBy[sname];
            prev_arr = prev_arr === undefined ? [] : prev_arr;
            prev_arr.push(list[k]);
            groupBy[sname] = prev_arr;
        }
        return groupBy;
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
                    const groupBy = this.groupRecords(json2);
                    const keys = Object.keys(groupBy);
                    console.log(keys);
                    if (keys.length == 1 && keys[0] == '') {
                        const list = groupBy[keys[0]];
                        for (let k2 = 0; k2 < list.length; k2++) {
                            const sectionRow2 = new SectionRow();
                            section.addElementToContentArea(sectionRow2);
                            sectionRow2.refresh(this.extractHumanReadableName(list[k2].record_jsonpath, list[k2].record_json));
                            sectionRow2.onclick = () => {
                                alert(list[k2].record_json);
                            };
                        }
                    }
                    else {
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
                    }
                };
            }
        }
        if (this.current_tab === 'records') {
            const json = await API3.list__catchsolve_noiodh__test_dataset_check_category_record_jsonpath_failed_vw({
                session_start_ts: p_session_start_ts,
                dataset_name: p_dataset_name,
                check_category: p_category_name
            });
            console.log(json);
            const groupBy = this.groupRecords(json);
            const keys = Object.keys(groupBy);
            console.log(keys);
            if (keys.length == 1 && keys[0] == '') {
                const list = groupBy[keys[0]];
                for (let k2 = 0; k2 < list.length; k2++) {
                    const sectionRow2 = new OpenCloseSection();
                    this.container.appendChild(sectionRow2);
                    sectionRow2.refresh(this.extractHumanReadableName(list[k2].record_jsonpath, list[k2].record_json), '' + list[k2].nr_check_names + ' check failed');
                    sectionRow2.onclick = async () => {
                        const json2 = await API3.list__catchsolve_noiodh__test_dataset_record_check_failed({
                            session_start_ts: p_session_start_ts,
                            dataset_name: p_dataset_name,
                            check_category: p_category_name,
                            record_jsonpath: list[k2].record_jsonpath
                        });
                        for (let k = 0; k < json2.length; k++) {
                            const sectionRow = new SectionRow();
                            sectionRow2.addElementToContentArea(sectionRow);
                            sectionRow.refresh(json2[k].check_name);
                        }
                    };
                }
            }
            else {
                for (let k = 0; k < keys.length; k++) {
                    const sectionRow = new OpenCloseSection();
                    this.container.appendChild(sectionRow);
                    sectionRow.refresh(keys[k], '' + groupBy[keys[k]].length + ' records');
                    sectionRow.onclick = () => {
                        const list = groupBy[keys[k]];
                        console.log(list);
                        for (let k2 = 0; k2 < list.length; k2++) {
                            const sectionRow2 = new OpenCloseSection();
                            sectionRow.addElementToContentArea(sectionRow2);
                            sectionRow2.refresh(this.extractHumanReadableName(list[k2].record_jsonpath, list[k2].record_json), list[k2].nr_check_names);
                            sectionRow2.onclick = async (e) => {
                                e.stopPropagation();
                                const json2 = await API3.list__catchsolve_noiodh__test_dataset_record_check_failed({
                                    session_start_ts: p_session_start_ts,
                                    dataset_name: p_dataset_name,
                                    check_category: p_category_name,
                                    record_jsonpath: list[k2].record_jsonpath
                                });
                                for (let k = 0; k < json2.length; k++) {
                                    const sectionRow = new SectionRow();
                                    sectionRow2.addElementToContentArea(sectionRow);
                                    sectionRow.refresh(json2[k].check_name);
                                }
                            };
                        }
                    };
                }
            }
            /*
            for (let i = 0; i < json.length; i++)
            {
                const issue = json[i]
                // console.log(issue)
                const section = new OpenCloseSection()
                section.refresh(issue.record_jsonpath, '' + issue.nr_check_names + ' checks')
                this.container.appendChild(section)
                
                section.onopen = async () => {
                //console.log('sezione aperta, ricarico!')
                    const json2 = await API3.list__catchsolve_noiodh__test_dataset_record_check_failed({
                            session_start_ts: p_session_start_ts,
                            dataset_name: p_dataset_name,
                            check_category: p_category_name,
                            record_jsonpath: issue.record_jsonpath
                    });
                    for (let k = 0; k < json2.length; k++)
                    {
                        const sectionRow = new OpenCloseSection();
                        section.addElementToContentArea(sectionRow)
                        sectionRow.refresh(json2[k].check_name, '')
                    }
                }
            }
             */
        }
    }
}
customElements.define('cs-dataset-issues-detail', DatasetIssuesDetail);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YXNldElzc3Vlc0RldGFpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3R5cGVzY3JpcHQvRGF0YXNldElzc3Vlc0RldGFpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxPQUFPLEVBQUUsT0FBTyxFQUFZLE1BQU0sY0FBYyxDQUFDO0FBQ2pELE9BQU8sRUFBQyxJQUFJLEVBQTJELE1BQU0sZUFBZSxDQUFDO0FBQzdGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3pELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUU3QyxNQUFNLE9BQU8sbUJBQW9CLFNBQVEsV0FBVztJQUduRCxTQUFTLENBQUE7SUFFVCxxQkFBcUIsR0FBZ0IsSUFBSSxDQUFBO0lBRXpDLGlCQUFpQixHQUFnQixJQUFJLENBQUE7SUFFckMsbUJBQW1CLEdBQWdCLElBQUksQ0FBQTtJQUV2QyxXQUFXLEdBQXlCLFFBQVEsQ0FBQTtJQUU1QztRQUNDLEtBQUssRUFBRSxDQUFBO1FBQ1AsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFBO1FBQ2pELEtBQUssQ0FBQyxTQUFTLEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0tBdUJmLENBQUE7UUFFSCxjQUFjLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBRTdCLElBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLGNBQWMsRUFBRSxLQUFLLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUE7UUFFM0UsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQTtRQUN6RSxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsaUJBQWlCLEVBQUUsS0FBSyxD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QUFDLEVBQUUsRUFDckMsQ0FBQztvQ0FDQSxNQUFNLFVBQVUsR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDO29DQUNwQyxXQUFXLENBQUMsdUJBQXVCLENBQUMsVUFBVSxDQUFDLENBQUE7b0NBQy9DLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFBO2dDQUN4QyxDQUFDOzRCQUVGLENBQUMsQ0FBQTt3QkFDRixDQUFDO29CQUNGLENBQUMsQ0FBQTtnQkFDRixDQUFDO1lBQ0YsQ0FBQztZQUNEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2VBeUJHO1FBQ0osQ0FBQztJQUNGLENBQUM7Q0FDRDtBQUVELGNBQWMsQ0FBQyxNQUFNLENBQUMsMEJBQTBCLEVBQUUsbUJBQW1CLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAoQykgMjAyNCBDYXRjaCBTb2x2ZSBkaSBEYXZpZGUgTW9udGVzaW5cbiAqIExpY2Vuc2U6IEFHUExcbiAqL1xuXG5pbXBvcnQgeyBjc19jYXN0LCB0aHJvd05QRSB9IGZyb20gXCIuL3F1YWxpdHkuanNcIjtcbmltcG9ydCB7QVBJMywgY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9yZWNvcmRfY2hlY2tfZmFpbGVkX19yb3d9IGZyb20gJy4vYXBpL2FwaTMuanMnO1xuaW1wb3J0IHsgT3BlbkNsb3NlU2VjdGlvbiB9IGZyb20gXCIuL09wZW5DbG9zZVNlY3Rpb24uanNcIjtcbmltcG9ydCB7IFNlY3Rpb25Sb3cgfSBmcm9tIFwiLi9TZWN0aW9uUm93LmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBEYXRhc2V0SXNzdWVzRGV0YWlsIGV4dGVuZHMgSFRNTEVsZW1lbnRcbntcblx0XG5cdGNvbnRhaW5lciBcblx0XG5cdGxhc3Rfc2Vzc2lvbl9zdGFydF90czogc3RyaW5nfG51bGwgPSBudWxsXG5cdFxuXHRsYXN0X2RhdGFzZXRfbmFtZTogc3RyaW5nfG51bGwgPSBudWxsXG5cdFxuXHRsYXN0X2NoZWNrX2NhdGVnb3J5OiBzdHJpbmd8bnVsbCA9IG51bGxcblx0XG5cdGN1cnJlbnRfdGFiOiAnaXNzdWVzJyB8ICdyZWNvcmRzJyA9ICdpc3N1ZXMnXG5cdFxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpXG5cdFx0Y29uc3Qgc3Jvb3QgPSB0aGlzLmF0dGFjaFNoYWRvdyh7IG1vZGU6ICdvcGVuJyB9KVxuXHRcdHNyb290LmlubmVySFRNTCA9IGBcblx0XHRcdFx0PHN0eWxlPlxuXHRcdFx0XHRcdDpob3N0IHtcblx0XHRcdFx0XHRcdHBhZGRpbmc6IDAuNXJlbTtcblx0XHRcdFx0XHRcdGRpc3BsYXk6IGJsb2NrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQuY29udGFpbmVyIHtcblx0XHRcdFx0XHRcdGJvcmRlcjogMXB4IHNvbGlkICNjY2M7XG5cdFx0XHRcdFx0XHRib3JkZXItcmFkaXVzOiAwLjNyZW07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdC5jb250YWluZXIgPiAqIHtcblx0XHRcdFx0XHRcdGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjY2NjO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0PC9zdHlsZT5cblx0XHRcdFx0PGltZyBzcmM9XCJrcGktZGV0YWlsLnBuZ1wiIHN0eWxlPVwibWF4LXdpZHRoOiAxMDAlXCI+XG5cdFx0XHRcdDxkaXYgc3R5bGU9XCJ3aWR0aDogY2FsYygxMDAlIC0gMjEwcHgpXCI+XG5cdFx0XHRcdFx0PGRpdiBzdHlsZT1cInRleHQtYWxpZ246IHJpZ2h0XCI+XG5cdFx0XHRcdFx0XHQ8YnV0dG9uIGNsYXNzPVwiaXNzdWVzXCI+SXNzdWVzPC9idXR0b24+XG5cdFx0XHRcdFx0XHQ8YnV0dG9uIGNsYXNzPVwicmVjb3Jkc1wiPlJlY29yZHM8L2J1dHRvbj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+PC9kaXY+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRgXG5cblx0XHRjdXN0b21FbGVtZW50cy51cGdyYWRlKHNyb290KVxuXG5cdFx0dGhpcy5jb250YWluZXIgPSBjc19jYXN0KEhUTUxEaXZFbGVtZW50LCBzcm9vdC5xdWVyeVNlbGVjdG9yKCcuY29udGFpbmVyJykpXG5cdFx0XG5cdFx0Y29uc3QgaXNzdWVzID0gY3NfY2FzdChIVE1MQnV0dG9uRWxlbWVudCwgc3Jvb3QucXVlcnlTZWxlY3RvcignLmlzc3VlcycpKVxuXHRcdGNvbnN0IHJlY29yZHMgPSBjc19jYXN0KEhUTUxCdXR0b25FbGVtZW50LCBzcm9vdC5xdWVyeVNlbGVjdG9yKCcucmVjb3JkcycpKVxuXHRcdFxuXHRcdGlzc3Vlcy5vbmNsaWNrID0gKCkgPT4ge1xuXHRcdFx0dGhpcy5jdXJyZW50X3RhYiA9ICdpc3N1ZXMnXG5cdFx0XHRpZiAodGhpcy5sYXN0X3Nlc3Npb25fc3RhcnRfdHMgIT0gbnVsbCAmJiB0aGlzLmxhc3RfZGF0YXNldF9uYW1lICE9IG51bGwgJiYgdGhpcy5sYXN0X2NoZWNrX2NhdGVnb3J5ICE9IG51bGwpXG5cdFx0XHRcdHRoaXMucmVmcmVzaCh0aGlzLmxhc3Rfc2Vzc2lvbl9zdGFydF90cywgdGhpcy5sYXN0X2RhdGFzZXRfbmFtZSwgdGhpcy5sYXN0X2NoZWNrX2NhdGVnb3J5KVxuXHRcdH1cblx0XHRcblx0XHRyZWNvcmRzLm9uY2xpY2sgPSAoKSA9PiB7XG5cdFx0XHR0aGlzLmN1cnJlbnRfdGFiID0gJ3JlY29yZHMnXG5cdFx0XHRpZiAodGhpcy5sYXN0X3Nlc3Npb25fc3RhcnRfdHMgIT0gbnVsbCAmJiB0aGlzLmxhc3RfZGF0YXNldF9uYW1lICE9IG51bGwgJiYgdGhpcy5sYXN0X2NoZWNrX2NhdGVnb3J5ICE9IG51bGwpXG5cdFx0XHRcdHRoaXMucmVmcmVzaCh0aGlzLmxhc3Rfc2Vzc2lvbl9zdGFydF90cywgdGhpcy5sYXN0X2RhdGFzZXRfbmFtZSwgdGhpcy5sYXN0X2NoZWNrX2NhdGVnb3J5KVxuXHRcdH1cblx0XHRcblx0fVxuXHRcblx0ZXh0cmFjdEh1bWFuUmVhZGFibGVOYW1lKHJlY29yZF9qc29ucGF0aDogc3RyaW5nLCBqc29uOiBzdHJpbmcpOiBzdHJpbmdcblx0e1xuXHRcdGxldCByZXQgPSAnJztcblx0XHRmb3IgKGxldCBmbiBvZiBbJ212YWxpZHRpbWUnLCAnbXZhbHVlJywgJ0FjY29EZXRhaWwuZGUuTmFtZScsICdEZXRhaWwuZGUuVGl0bGUnXSlcblx0XHR7XG5cdFx0XHRjb25zdCBmbl9wYXJ0cyA9IGZuLnNwbGl0KCcuJylcblx0XHRcdGxldCB2YWwgPSBKU09OLnBhcnNlKGpzb24pXG5cdFx0XHRmb3IgKGxldCBwIG9mIGZuX3BhcnRzKVxuXHRcdFx0e1xuXHRcdFx0XHR2YWwgPSB2YWxbcF1cblx0XHRcdFx0aWYgKHZhbCA9PT0gdW5kZWZpbmVkKVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0Ly8gY29uc3QgdmFsID0gc3RhcnRbZm5dIFxuXHRcdFx0aWYgKHZhbCAhPT0gdW5kZWZpbmVkKVxuXHRcdFx0XHRyZXQgKz0gKHJldCA9PT0gJycgPyAnJyA6ICcsICcpICsgZm4gKyAnPScgKyBKU09OLnN0cmluZ2lmeSh2YWwpXG5cdFx0fVxuXHRcdGlmIChyZXQgPT0gJycpXG5cdFx0XHRyZXQgPSByZWNvcmRfanNvbnBhdGhcblx0XHRyZXR1cm4gcmV0O1xuXHR9XG5cdFxuXHRncm91cFJlY29yZHMobGlzdDoge3JlY29yZF9qc29uOiBzdHJpbmd9W10pOiB7W2s6c3RyaW5nXTogYW55W119XG5cdHtcblx0XHRjb25zdCBncm91cEJ5OiB7W2s6c3RyaW5nXTogYW55W119ID0ge31cblx0XHRmb3IgKGxldCBrID0gMDsgayA8IGxpc3QubGVuZ3RoOyBrKyspXG5cdFx0e1xuXHRcdFx0Y29uc3QganNvbiA9IEpTT04ucGFyc2UobGlzdFtrXS5yZWNvcmRfanNvbik7XG5cdFx0XHRsZXQgc25hbWUgPSBqc29uWydzbmFtZSddO1xuXHRcdFx0aWYgKHR5cGVvZiBzbmFtZSAhPT0gJ3N0cmluZycpXG5cdFx0XHRcdHNuYW1lID0gJydcblx0XHRcdGxldCBwcmV2X2FyciA9IGdyb3VwQnlbc25hbWVdXG5cdFx0XHRwcmV2X2FyciA9IHByZXZfYXJyID09PSB1bmRlZmluZWQgPyBbXSA6IHByZXZfYXJyXG5cdFx0XHRwcmV2X2Fyci5wdXNoKGxpc3Rba10pXG5cdFx0XHRncm91cEJ5W3NuYW1lXSA9IHByZXZfYXJyXG5cdFx0fVxuXHRcdHJldHVybiBncm91cEJ5OyBcblx0fVxuXHRcblx0YXN5bmMgcmVmcmVzaChwX3Nlc3Npb25fc3RhcnRfdHM6IHN0cmluZywgcF9kYXRhc2V0X25hbWU6IHN0cmluZywgcF9jYXRlZ29yeV9uYW1lOiBzdHJpbmcpIHtcblx0XHRcblx0XHR0aGlzLmxhc3Rfc2Vzc2lvbl9zdGFydF90cyA9IHBfc2Vzc2lvbl9zdGFydF90c1xuXHRcdHRoaXMubGFzdF9kYXRhc2V0X25hbWUgPSBwX2RhdGFzZXRfbmFtZVxuXHRcdHRoaXMubGFzdF9jaGVja19jYXRlZ29yeSA9IHBfY2F0ZWdvcnlfbmFtZVxuXHRcdFxuXHRcdGNvbnNvbGUubG9nKHBfc2Vzc2lvbl9zdGFydF90cylcblx0XHRjb25zb2xlLmxvZyhwX2RhdGFzZXRfbmFtZSlcblx0XHRjb25zb2xlLmxvZyhwX2NhdGVnb3J5X25hbWUpXG5cdFx0XG5cdFx0dGhpcy5jb250YWluZXIudGV4dENvbnRlbnQgPSAnJ1xuXG5cdFx0aWYgKHRoaXMuY3VycmVudF90YWIgPT09ICdpc3N1ZXMnKVxuXHRcdHtcblx0XHRcblx0XHRcdGNvbnN0IGpzb24gPSBhd2FpdCBBUEkzLmxpc3RfX2NhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfY2hlY2tfY2F0ZWdvcnlfY2hlY2tfbmFtZV9yZWNvcmRfcmVjb3JkX2ZhaWxlZF92dyh7XG5cdFx0XHRcdHNlc3Npb25fc3RhcnRfdHM6IHBfc2Vzc2lvbl9zdGFydF90cyxcblx0XHRcdFx0ZGF0YXNldF9uYW1lOiBwX2RhdGFzZXRfbmFtZSxcblx0XHRcdFx0Y2hlY2tfY2F0ZWdvcnk6IHBfY2F0ZWdvcnlfbmFtZVxuXHRcdFx0fSlcblx0XHRcdFxuXHRcdFx0Y29uc29sZS5sb2coanNvbilcblx0XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGpzb24ubGVuZ3RoOyBpKyspXG5cdFx0XHR7XG5cdFx0XHRcdGNvbnN0IGlzc3VlID0ganNvbltpXVxuXHRcdFx0XHQvLyBjb25zb2xlLmxvZyhpc3N1ZSlcblx0XHRcdFx0Y29uc3Qgc2VjdGlvbiA9IG5ldyBPcGVuQ2xvc2VTZWN0aW9uKClcblx0XHRcdFx0c2VjdGlvbi5yZWZyZXNoKGlzc3VlLmNoZWNrX25hbWUsICcnICsgaXNzdWUubnJfcmVjb3JkcyArICcgcmVjb3JkcycpXG5cdFx0XHRcdHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHNlY3Rpb24pXG5cdFx0XHRcdFxuXHRcdFx0XHRzZWN0aW9uLm9ub3BlbiA9IGFzeW5jICgpID0+IHtcblx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKCdzZXppb25lIGFwZXJ0YSwgcmljYXJpY28hJylcblx0XHRcdFx0XHRjb25zdCBqc29uMiA9IGF3YWl0IEFQSTMubGlzdF9fY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9yZWNvcmRfY2hlY2tfZmFpbGVkKHtcblx0XHRcdFx0XHRcdFx0XHRzZXNzaW9uX3N0YXJ0X3RzOiBwX3Nlc3Npb25fc3RhcnRfdHMsXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YXNldF9uYW1lOiBwX2RhdGFzZXRfbmFtZSxcblx0XHRcdFx0XHRcdFx0XHRjaGVja19jYXRlZ29yeTogcF9jYXRlZ29yeV9uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdGNoZWNrX25hbWU6IGlzc3VlLmNoZWNrX25hbWVcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRjb25zdCBncm91cEJ5ID0gdGhpcy5ncm91cFJlY29yZHMoanNvbjIpXG5cdFx0XHRcdFx0Y29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGdyb3VwQnkpXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coa2V5cylcblx0XHRcdFx0XHRpZiAoa2V5cy5sZW5ndGggPT0gMSAmJiBrZXlzWzBdID09ICcnKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGNvbnN0IGxpc3QgPSBncm91cEJ5W2tleXNbMF1dXG5cdFx0XHRcdFx0XHRmb3IgKGxldCBrMiA9IDA7IGsyIDwgbGlzdC5sZW5ndGg7IGsyKyspXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IHNlY3Rpb25Sb3cyID0gbmV3IFNlY3Rpb25Sb3coKTtcblx0XHRcdFx0XHRcdFx0c2VjdGlvbi5hZGRFbGVtZW50VG9Db250ZW50QXJlYShzZWN0aW9uUm93Milcblx0XHRcdFx0XHRcdFx0c2VjdGlvblJvdzIucmVmcmVzaCh0aGlzLmV4dHJhY3RIdW1hblJlYWRhYmxlTmFtZShsaXN0W2syXS5yZWNvcmRfanNvbnBhdGgsIGxpc3RbazJdLnJlY29yZF9qc29uKSlcblx0XHRcdFx0XHRcdFx0c2VjdGlvblJvdzIub25jbGljayA9ICgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRhbGVydChsaXN0W2syXS5yZWNvcmRfanNvbilcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Zm9yIChsZXQgayA9IDA7IGsgPCBrZXlzLmxlbmd0aDsgaysrKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRjb25zdCBzZWN0aW9uUm93ID0gbmV3IE9wZW5DbG9zZVNlY3Rpb24oKTtcblx0XHRcdFx0XHRcdFx0c2VjdGlvbi5hZGRFbGVtZW50VG9Db250ZW50QXJlYShzZWN0aW9uUm93KVxuXHRcdFx0XHRcdFx0XHRzZWN0aW9uUm93LnJlZnJlc2goa2V5c1trXSwgJycgKyBncm91cEJ5W2tleXNba11dLmxlbmd0aCArICcgcmVjb3JkcycpXG5cdFx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cub25jbGljayA9ICgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRjb25zdCBsaXN0ID0gZ3JvdXBCeVtrZXlzW2tdXVxuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGxpc3QpXG5cdFx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgazIgPSAwOyBrMiA8IGxpc3QubGVuZ3RoOyBrMisrKVxuXHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IHNlY3Rpb25Sb3cyID0gbmV3IFNlY3Rpb25Sb3coKTtcblx0XHRcdFx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cuYWRkRWxlbWVudFRvQ29udGVudEFyZWEoc2VjdGlvblJvdzIpXG5cdFx0XHRcdFx0XHRcdFx0XHRzZWN0aW9uUm93Mi5yZWZyZXNoKHRoaXMuZXh0cmFjdEh1bWFuUmVhZGFibGVOYW1lKGxpc3RbazJdLnJlY29yZF9qc29ucGF0aCwgbGlzdFtrMl0ucmVjb3JkX2pzb24pKVxuXHRcdFx0XHRcdFx0XHRcdFx0c2VjdGlvblJvdzIub25jbGljayA9ICgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0YWxlcnQobGlzdFtrMl0ucmVjb3JkX2pzb24pXG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRcdFx0XG5cdFx0fVxuXHRcdFxuXHRcdFxuXHRcdGlmICh0aGlzLmN1cnJlbnRfdGFiID09PSAncmVjb3JkcycpXG5cdFx0e1xuXHRcdFx0Y29uc3QganNvbiA9IGF3YWl0IEFQSTMubGlzdF9fY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9jaGVja19jYXRlZ29yeV9yZWNvcmRfanNvbnBhdGhfZmFpbGVkX3Z3KHtcblx0XHRcdFx0c2Vzc2lvbl9zdGFydF90czogcF9zZXNzaW9uX3N0YXJ0X3RzLFxuXHRcdFx0XHRkYXRhc2V0X25hbWU6IHBfZGF0YXNldF9uYW1lLFxuXHRcdFx0XHRjaGVja19jYXRlZ29yeTogcF9jYXRlZ29yeV9uYW1lXG5cdFx0XHR9KTtcblx0XHRcdGNvbnNvbGUubG9nKGpzb24pXG5cdFx0XHRjb25zdCBncm91cEJ5ID0gdGhpcy5ncm91cFJlY29yZHMoanNvbilcblx0XHRcdGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhncm91cEJ5KVxuXHRcdFx0Y29uc29sZS5sb2coa2V5cylcblx0XHRcdGlmIChrZXlzLmxlbmd0aCA9PSAxICYmIGtleXNbMF0gPT0gJycpXG5cdFx0XHR7XG5cdFx0XHRcdGNvbnN0IGxpc3QgPSBncm91cEJ5W2tleXNbMF1dXG5cdFx0XHRcdGZvciAobGV0IGsyID0gMDsgazIgPCBsaXN0Lmxlbmd0aDsgazIrKylcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGNvbnN0IHNlY3Rpb25Sb3cyID0gbmV3IE9wZW5DbG9zZVNlY3Rpb24oKTtcblx0XHRcdFx0XHR0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChzZWN0aW9uUm93Milcblx0XHRcdFx0XHRzZWN0aW9uUm93Mi5yZWZyZXNoKHRoaXMuZXh0cmFjdEh1bWFuUmVhZGFibGVOYW1lKGxpc3RbazJdLnJlY29yZF9qc29ucGF0aCwgbGlzdFtrMl0ucmVjb3JkX2pzb24pLCAnJyArIGxpc3RbazJdLm5yX2NoZWNrX25hbWVzICsgJyBjaGVjayBmYWlsZWQnKVxuXHRcdFx0XHRcdHNlY3Rpb25Sb3cyLm9uY2xpY2sgPSBhc3luYyAoKSA9PiB7XG5cdFx0XHRcdFx0XHRjb25zdCBqc29uMiA9IGF3YWl0IEFQSTMubGlzdF9fY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9yZWNvcmRfY2hlY2tfZmFpbGVkKHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c2Vzc2lvbl9zdGFydF90czogcF9zZXNzaW9uX3N0YXJ0X3RzLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhc2V0X25hbWU6IHBfZGF0YXNldF9uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjaGVja19jYXRlZ29yeTogcF9jYXRlZ29yeV9uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZWNvcmRfanNvbnBhdGg6IGxpc3RbazJdLnJlY29yZF9qc29ucGF0aFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0Zm9yIChsZXQgayA9IDA7IGsgPCBqc29uMi5sZW5ndGg7IGsrKylcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y29uc3Qgc2VjdGlvblJvdyA9IG5ldyBTZWN0aW9uUm93KCk7XG5cdFx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cyLmFkZEVsZW1lbnRUb0NvbnRlbnRBcmVhKHNlY3Rpb25Sb3cpXG5cdFx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cucmVmcmVzaChqc29uMltrXS5jaGVja19uYW1lKVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZVxuXHRcdFx0e1xuXHRcdFx0XHRmb3IgKGxldCBrID0gMDsgayA8IGtleXMubGVuZ3RoOyBrKyspXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRjb25zdCBzZWN0aW9uUm93ID0gbmV3IE9wZW5DbG9zZVNlY3Rpb24oKTtcblx0XHRcdFx0XHR0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChzZWN0aW9uUm93KVxuXHRcdFx0XHRcdHNlY3Rpb25Sb3cucmVmcmVzaChrZXlzW2tdLCAnJyArIGdyb3VwQnlba2V5c1trXV0ubGVuZ3RoICsgJyByZWNvcmRzJylcblx0XHRcdFx0XHRzZWN0aW9uUm93Lm9uY2xpY2sgPSAoKSA9PiB7XG5cdFx0XHRcdFx0XHRjb25zdCBsaXN0ID0gZ3JvdXBCeVtrZXlzW2tdXVxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2cobGlzdClcblx0XHRcdFx0XHRcdGZvciAobGV0IGsyID0gMDsgazIgPCBsaXN0Lmxlbmd0aDsgazIrKylcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y29uc3Qgc2VjdGlvblJvdzIgPSBuZXcgT3BlbkNsb3NlU2VjdGlvbigpO1xuXHRcdFx0XHRcdFx0XHRzZWN0aW9uUm93LmFkZEVsZW1lbnRUb0NvbnRlbnRBcmVhKHNlY3Rpb25Sb3cyKVxuXHRcdFx0XHRcdFx0XHRzZWN0aW9uUm93Mi5yZWZyZXNoKHRoaXMuZXh0cmFjdEh1bWFuUmVhZGFibGVOYW1lKGxpc3RbazJdLnJlY29yZF9qc29ucGF0aCwgbGlzdFtrMl0ucmVjb3JkX2pzb24pLCBsaXN0W2syXS5ucl9jaGVja19uYW1lcylcblx0XHRcdFx0XHRcdFx0c2VjdGlvblJvdzIub25jbGljayA9IGFzeW5jIChlKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKVxuXHRcdFx0XHRcdFx0XHRcdGNvbnN0IGpzb24yID0gYXdhaXQgQVBJMy5saXN0X19jYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X3JlY29yZF9jaGVja19mYWlsZWQoe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c2Vzc2lvbl9zdGFydF90czogcF9zZXNzaW9uX3N0YXJ0X3RzLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YXNldF9uYW1lOiBwX2RhdGFzZXRfbmFtZSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNoZWNrX2NhdGVnb3J5OiBwX2NhdGVnb3J5X25hbWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZWNvcmRfanNvbnBhdGg6IGxpc3RbazJdLnJlY29yZF9qc29ucGF0aFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBrID0gMDsgayA8IGpzb24yLmxlbmd0aDsgaysrKVxuXHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IHNlY3Rpb25Sb3cgPSBuZXcgU2VjdGlvblJvdygpO1xuXHRcdFx0XHRcdFx0XHRcdFx0c2VjdGlvblJvdzIuYWRkRWxlbWVudFRvQ29udGVudEFyZWEoc2VjdGlvblJvdylcblx0XHRcdFx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cucmVmcmVzaChqc29uMltrXS5jaGVja19uYW1lKVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0Lypcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwganNvbi5sZW5ndGg7IGkrKylcblx0XHRcdHtcblx0XHRcdFx0Y29uc3QgaXNzdWUgPSBqc29uW2ldXG5cdFx0XHRcdC8vIGNvbnNvbGUubG9nKGlzc3VlKVxuXHRcdFx0XHRjb25zdCBzZWN0aW9uID0gbmV3IE9wZW5DbG9zZVNlY3Rpb24oKVxuXHRcdFx0XHRzZWN0aW9uLnJlZnJlc2goaXNzdWUucmVjb3JkX2pzb25wYXRoLCAnJyArIGlzc3VlLm5yX2NoZWNrX25hbWVzICsgJyBjaGVja3MnKVxuXHRcdFx0XHR0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChzZWN0aW9uKVxuXHRcdFx0XHRcblx0XHRcdFx0c2VjdGlvbi5vbm9wZW4gPSBhc3luYyAoKSA9PiB7XG5cdFx0XHRcdC8vY29uc29sZS5sb2coJ3NlemlvbmUgYXBlcnRhLCByaWNhcmljbyEnKVxuXHRcdFx0XHRcdGNvbnN0IGpzb24yID0gYXdhaXQgQVBJMy5saXN0X19jYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X3JlY29yZF9jaGVja19mYWlsZWQoe1xuXHRcdFx0XHRcdFx0XHRzZXNzaW9uX3N0YXJ0X3RzOiBwX3Nlc3Npb25fc3RhcnRfdHMsXG5cdFx0XHRcdFx0XHRcdGRhdGFzZXRfbmFtZTogcF9kYXRhc2V0X25hbWUsXG5cdFx0XHRcdFx0XHRcdGNoZWNrX2NhdGVnb3J5OiBwX2NhdGVnb3J5X25hbWUsXG5cdFx0XHRcdFx0XHRcdHJlY29yZF9qc29ucGF0aDogaXNzdWUucmVjb3JkX2pzb25wYXRoXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0Zm9yIChsZXQgayA9IDA7IGsgPCBqc29uMi5sZW5ndGg7IGsrKylcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRjb25zdCBzZWN0aW9uUm93ID0gbmV3IE9wZW5DbG9zZVNlY3Rpb24oKTtcblx0XHRcdFx0XHRcdHNlY3Rpb24uYWRkRWxlbWVudFRvQ29udGVudEFyZWEoc2VjdGlvblJvdylcblx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cucmVmcmVzaChqc29uMltrXS5jaGVja19uYW1lLCAnJylcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdCAqL1xuXHRcdH1cblx0fVxufVxuXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ2NzLWRhdGFzZXQtaXNzdWVzLWRldGFpbCcsIERhdGFzZXRJc3N1ZXNEZXRhaWwpXG4iXX0=