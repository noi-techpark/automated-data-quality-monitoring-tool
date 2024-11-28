/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */
import { cs_cast } from "./quality.js";
import { API3 } from './api/api3.js';
import { OpenCloseSection } from "./OpenCloseSection.js";
import { SectionRow } from "./SectionRow.js";
import { Loader } from "./Loader.js";
import { DatasetIssueCategory } from "./DatasetIssueCategory.js";
export class DatasetIssuesDetail extends HTMLElement {
    container;
    last_session_start_ts = null;
    last_dataset_name = null;
    last_check_category = null;
    last_failed_records = null;
    last_tot_records = null;
    current_tab = 'issues';
    sroot;
    connected_promise;
    connected_func = s => null;
    connectedCallback() {
        console.log('connected');
        this.connected_func(null);
    }
    constructor() {
        super();
        this.connected_promise = new Promise(s => this.connected_func = s);
        this.sroot = this.attachShadow({ mode: 'open' });
        this.sroot.innerHTML = `
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
					.header {
						display: flex;
					}
					.header .chart {
						width: 50%;
					}
				</style>
				<!-- <img src="kpi-detail.png" style="max-width: 100%"> -->
				<div class="header">
					<div>
						<cs-dataset-issue-category></cs-dataset-issue-category>
					</div>
					<div class="chart">
						<canvas></canvas>
					</div>
					<div><img src="kpi-general-info.png"></div>
				</div>
				<div style="width: calc(100% - 20px)">
					<div style="text-align: right">
						<button class="issues">Issues</button>
						<button class="records">Records</button>
					</div>
					<div class="container"></div>
				</div>
				`;
        customElements.upgrade(this.sroot);
        this.container = cs_cast(HTMLDivElement, this.sroot.querySelector('.container'));
        const issues = cs_cast(HTMLButtonElement, this.sroot.querySelector('.issues'));
        const records = cs_cast(HTMLButtonElement, this.sroot.querySelector('.records'));
        issues.onclick = () => {
            this.current_tab = 'issues';
            if (this.last_session_start_ts != null && this.last_dataset_name != null && this.last_check_category != null
                && this.last_failed_records != null && this.last_tot_records != null)
                this.refresh(this.last_session_start_ts, this.last_dataset_name, this.last_check_category, this.last_failed_records, this.last_tot_records);
        };
        records.onclick = () => {
            this.current_tab = 'records';
            if (this.last_session_start_ts != null && this.last_dataset_name != null && this.last_check_category != null
                && this.last_failed_records != null && this.last_tot_records != null)
                this.refresh(this.last_session_start_ts, this.last_dataset_name, this.last_check_category, this.last_failed_records, this.last_tot_records);
        };
        const canvas = cs_cast(HTMLCanvasElement, this.sroot.querySelector('canvas'));
        (async () => {
            await this.connected_promise;
            new Chart(canvas, {
                type: 'line',
                data: {
                    labels: ['oct', 'nov', 'dic'],
                    datasets: [{
                            label: 'good trend',
                            data: [1, 3, 2],
                            fill: true,
                            backgroundColor: '#8f8'
                        },
                        {
                            label: 'fail trend',
                            data: [3, 1, 2],
                            fill: true,
                            backgroundColor: '#f88'
                        }]
                },
                options: {
                    scales: {
                        y: {
                            stacked: true
                        }
                    }
                }
            });
        })();
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
    async refresh(p_session_start_ts, p_dataset_name, p_category_name, p_failed_records, p_tot_records) {
        this.last_session_start_ts = p_session_start_ts;
        this.last_dataset_name = p_dataset_name;
        this.last_check_category = p_category_name;
        this.last_failed_records = p_failed_records;
        this.last_tot_records = p_tot_records;
        console.log(p_session_start_ts);
        console.log(p_dataset_name);
        console.log(p_category_name);
        const category = cs_cast(DatasetIssueCategory, this.sroot.querySelector('cs-dataset-issue-category'));
        category.refresh({
            dataset_name: p_dataset_name,
            session_start_ts: p_session_start_ts,
            check_category: p_category_name,
            failed_records: p_failed_records,
            tot_records: p_tot_records
        });
        this.container.textContent = '';
        if (this.current_tab === 'issues') {
            const loader = new Loader();
            this.container.appendChild(loader);
            const json = await API3.list__catchsolve_noiodh__test_dataset_check_category_check_name_record_record_failed_vw({
                session_start_ts: p_session_start_ts,
                dataset_name: p_dataset_name,
                check_category: p_category_name
            });
            loader.remove();
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
            const loader = new Loader();
            this.container.appendChild(loader);
            const json = await API3.list__catchsolve_noiodh__test_dataset_check_category_record_jsonpath_failed_vw({
                session_start_ts: p_session_start_ts,
                dataset_name: p_dataset_name,
                check_category: p_category_name
            });
            loader.remove();
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
        }
    }
}
customElements.define('cs-dataset-issues-detail', DatasetIssuesDetail);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YXNldElzc3Vlc0RldGFpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3R5cGVzY3JpcHQvRGF0YXNldElzc3Vlc0RldGFpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxPQUFPLEVBQUUsT0FBTyxFQUFZLE1BQU0sY0FBYyxDQUFDO0FBQ2pELE9BQU8sRUFBQyxJQUFJLEVBQTJELE1BQU0sZUFBZSxDQUFDO0FBQzdGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3pELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ3JDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBR2pFLE1BQU0sT0FBTyxtQkFBb0IsU0FBUSxXQUFXO0lBR25ELFNBQVMsQ0FBQTtJQUVULHFCQUFxQixHQUFnQixJQUFJLENBQUE7SUFDekMsaUJBQWlCLEdBQWdCLElBQUksQ0FBQTtJQUNyQyxtQkFBbUIsR0FBZ0IsSUFBSSxDQUFBO0lBQ3ZDLG1CQUFtQixHQUFnQixJQUFJLENBQUE7SUFDdkMsZ0JBQWdCLEdBQWdCLElBQUksQ0FBQTtJQUVwQyxXQUFXLEdBQXlCLFFBQVEsQ0FBQTtJQUU1QyxLQUFLLENBQUE7SUFFTCxpQkFBaUIsQ0FBQTtJQUNqQixjQUFjLEdBQXNCLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFBO0lBRTdDLGlCQUFpQjtRQUVoQixPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBQ3hCLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDMUIsQ0FBQztJQUVEO1FBQ0MsS0FBSyxFQUFFLENBQUE7UUFDUCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJ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LENBQUMsRUFBRSxDQUFDLENBQUMsZUFBZTtpQ0FDaEQsQ0FBQyxDQUFDO2dDQUNSLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUNyQyxDQUFDO29DQUNBLE1BQU0sVUFBVSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7b0NBQ3BDLFdBQVcsQ0FBQyx1QkFBdUIsQ0FBQyxVQUFVLENBQUMsQ0FBQTtvQ0FDL0MsVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUE7Z0NBQ3hDLENBQUM7NEJBRUYsQ0FBQyxDQUFBO3dCQUNGLENBQUM7b0JBQ0YsQ0FBQyxDQUFBO2dCQUNGLENBQUM7WUFDRixDQUFDO1FBQ0YsQ0FBQztJQUNGLENBQUM7Q0FDRDtBQUVELGNBQWMsQ0FBQyxNQUFNLENBQUMsMEJBQTBCLEVBQUUsbUJBQW1CLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAoQykgMjAyNCBDYXRjaCBTb2x2ZSBkaSBEYXZpZGUgTW9udGVzaW5cbiAqIExpY2Vuc2U6IEFHUExcbiAqL1xuXG5pbXBvcnQgeyBjc19jYXN0LCB0aHJvd05QRSB9IGZyb20gXCIuL3F1YWxpdHkuanNcIjtcbmltcG9ydCB7QVBJMywgY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9yZWNvcmRfY2hlY2tfZmFpbGVkX19yb3d9IGZyb20gJy4vYXBpL2FwaTMuanMnO1xuaW1wb3J0IHsgT3BlbkNsb3NlU2VjdGlvbiB9IGZyb20gXCIuL09wZW5DbG9zZVNlY3Rpb24uanNcIjtcbmltcG9ydCB7IFNlY3Rpb25Sb3cgfSBmcm9tIFwiLi9TZWN0aW9uUm93LmpzXCI7XG5pbXBvcnQgeyBMb2FkZXIgfSBmcm9tIFwiLi9Mb2FkZXIuanNcIjtcbmltcG9ydCB7IERhdGFzZXRJc3N1ZUNhdGVnb3J5IH0gZnJvbSBcIi4vRGF0YXNldElzc3VlQ2F0ZWdvcnkuanNcIjtcbmltcG9ydCBDaGFydCA9IHJlcXVpcmUoXCJjaGFydC5qc1wiKTtcblxuZXhwb3J0IGNsYXNzIERhdGFzZXRJc3N1ZXNEZXRhaWwgZXh0ZW5kcyBIVE1MRWxlbWVudFxue1xuXHRcblx0Y29udGFpbmVyIFxuXHRcblx0bGFzdF9zZXNzaW9uX3N0YXJ0X3RzOiBzdHJpbmd8bnVsbCA9IG51bGxcblx0bGFzdF9kYXRhc2V0X25hbWU6IHN0cmluZ3xudWxsID0gbnVsbFxuXHRsYXN0X2NoZWNrX2NhdGVnb3J5OiBzdHJpbmd8bnVsbCA9IG51bGxcblx0bGFzdF9mYWlsZWRfcmVjb3JkczogbnVtYmVyfG51bGwgPSBudWxsXG5cdGxhc3RfdG90X3JlY29yZHM6IG51bWJlcnxudWxsID0gbnVsbFxuXHRcblx0Y3VycmVudF90YWI6ICdpc3N1ZXMnIHwgJ3JlY29yZHMnID0gJ2lzc3Vlcydcblx0XG5cdHNyb290XG5cdFxuXHRjb25uZWN0ZWRfcHJvbWlzZVxuXHRjb25uZWN0ZWRfZnVuYzogKHM6IG51bGwpID0+IHZvaWQgPSBzID0+IG51bGxcblxuXHRjb25uZWN0ZWRDYWxsYmFjaygpXG5cdHtcblx0XHRjb25zb2xlLmxvZygnY29ubmVjdGVkJylcblx0XHR0aGlzLmNvbm5lY3RlZF9mdW5jKG51bGwpXG5cdH1cblx0XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKClcblx0XHR0aGlzLmNvbm5lY3RlZF9wcm9taXNlID0gbmV3IFByb21pc2UocyA9PiB0aGlzLmNvbm5lY3RlZF9mdW5jID0gcylcblx0XHR0aGlzLnNyb290ID0gdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSlcblx0XHR0aGlzLnNyb290LmlubmVySFRNTCA9IGBcblx0XHRcdFx0PHN0eWxlPlxuXHRcdFx0XHRcdDpob3N0IHtcblx0XHRcdFx0XHRcdHBhZGRpbmc6IDAuNXJlbTtcblx0XHRcdFx0XHRcdGRpc3BsYXk6IGJsb2NrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQuY29udGFpbmVyIHtcblx0XHRcdFx0XHRcdGJvcmRlcjogMXB4IHNvbGlkICNjY2M7XG5cdFx0XHRcdFx0XHRib3JkZXItcmFkaXVzOiAwLjNyZW07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdC5jb250YWluZXIgPiAqIHtcblx0XHRcdFx0XHRcdGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjY2NjO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQuaGVhZGVyIHtcblx0XHRcdFx0XHRcdGRpc3BsYXk6IGZsZXg7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC5oZWFkZXIgLmNoYXJ0IHtcblx0XHRcdFx0XHRcdHdpZHRoOiA1MCU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQ8L3N0eWxlPlxuXHRcdFx0XHQ8IS0tIDxpbWcgc3JjPVwia3BpLWRldGFpbC5wbmdcIiBzdHlsZT1cIm1heC13aWR0aDogMTAwJVwiPiAtLT5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImhlYWRlclwiPlxuXHRcdFx0XHRcdDxkaXY+XG5cdFx0XHRcdFx0XHQ8Y3MtZGF0YXNldC1pc3N1ZS1jYXRlZ29yeT48L2NzLWRhdGFzZXQtaXNzdWUtY2F0ZWdvcnk+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNoYXJ0XCI+XG5cdFx0XHRcdFx0XHQ8Y2FudmFzPjwvY2FudmFzPlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxkaXY+PGltZyBzcmM9XCJrcGktZ2VuZXJhbC1pbmZvLnBuZ1wiPjwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PGRpdiBzdHlsZT1cIndpZHRoOiBjYWxjKDEwMCUgLSAyMHB4KVwiPlxuXHRcdFx0XHRcdDxkaXYgc3R5bGU9XCJ0ZXh0LWFsaWduOiByaWdodFwiPlxuXHRcdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cImlzc3Vlc1wiPklzc3VlczwvYnV0dG9uPlxuXHRcdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cInJlY29yZHNcIj5SZWNvcmRzPC9idXR0b24+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPjwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0YFxuXG5cdFx0Y3VzdG9tRWxlbWVudHMudXBncmFkZSh0aGlzLnNyb290KVxuXG5cdFx0dGhpcy5jb250YWluZXIgPSBjc19jYXN0KEhUTUxEaXZFbGVtZW50LCB0aGlzLnNyb290LnF1ZXJ5U2VsZWN0b3IoJy5jb250YWluZXInKSlcblx0XHRcblx0XHRjb25zdCBpc3N1ZXMgPSBjc19jYXN0KEhUTUxCdXR0b25FbGVtZW50LCB0aGlzLnNyb290LnF1ZXJ5U2VsZWN0b3IoJy5pc3N1ZXMnKSlcblx0XHRjb25zdCByZWNvcmRzID0gY3NfY2FzdChIVE1MQnV0dG9uRWxlbWVudCwgdGhpcy5zcm9vdC5xdWVyeVNlbGVjdG9yKCcucmVjb3JkcycpKVxuXHRcdFxuXHRcdGlzc3Vlcy5vbmNsaWNrID0gKCkgPT4ge1xuXHRcdFx0dGhpcy5jdXJyZW50X3RhYiA9ICdpc3N1ZXMnXG5cdFx0XHRpZiAodGhpcy5sYXN0X3Nlc3Npb25fc3RhcnRfdHMgIT0gbnVsbCAmJiB0aGlzLmxhc3RfZGF0YXNldF9uYW1lICE9IG51bGwgJiYgdGhpcy5sYXN0X2NoZWNrX2NhdGVnb3J5ICE9IG51bGxcblx0XHRcdFx0JiYgdGhpcy5sYXN0X2ZhaWxlZF9yZWNvcmRzICE9IG51bGwgJiYgdGhpcy5sYXN0X3RvdF9yZWNvcmRzICE9IG51bGwpXG5cdFx0XHRcdHRoaXMucmVmcmVzaCh0aGlzLmxhc3Rfc2Vzc2lvbl9zdGFydF90cywgdGhpcy5sYXN0X2RhdGFzZXRfbmFtZSwgdGhpcy5sYXN0X2NoZWNrX2NhdGVnb3J5LCB0aGlzLmxhc3RfZmFpbGVkX3JlY29yZHMsIHRoaXMubGFzdF90b3RfcmVjb3Jkcylcblx0XHR9XG5cdFx0XG5cdFx0cmVjb3Jkcy5vbmNsaWNrID0gKCkgPT4ge1xuXHRcdFx0dGhpcy5jdXJyZW50X3RhYiA9ICdyZWNvcmRzJ1xuXHRcdFx0aWYgKHRoaXMubGFzdF9zZXNzaW9uX3N0YXJ0X3RzICE9IG51bGwgJiYgdGhpcy5sYXN0X2RhdGFzZXRfbmFtZSAhPSBudWxsICYmIHRoaXMubGFzdF9jaGVja19jYXRlZ29yeSAhPSBudWxsXG5cdFx0XHRcdCYmIHRoaXMubGFzdF9mYWlsZWRfcmVjb3JkcyAhPSBudWxsICYmIHRoaXMubGFzdF90b3RfcmVjb3JkcyAhPSBudWxsKVxuXHRcdFx0XHR0aGlzLnJlZnJlc2godGhpcy5sYXN0X3Nlc3Npb25fc3RhcnRfdHMsIHRoaXMubGFzdF9kYXRhc2V0X25hbWUsIHRoaXMubGFzdF9jaGVja19jYXRlZ29yeSwgdGhpcy5sYXN0X2ZhaWxlZF9yZWNvcmRzLCB0aGlzLmxhc3RfdG90X3JlY29yZHMpXG5cdFx0fVxuXHRcdFxuXHRcdGNvbnN0IGNhbnZhcyA9IGNzX2Nhc3QoSFRNTENhbnZhc0VsZW1lbnQsIHRoaXMuc3Jvb3QucXVlcnlTZWxlY3RvcignY2FudmFzJykpO1xuXHRcdFxuXHRcdChhc3luYyAoKSA9PiB7XG5cdFx0XHRhd2FpdCB0aGlzLmNvbm5lY3RlZF9wcm9taXNlXG5cdFx0XHRuZXcgQ2hhcnQoY2FudmFzLCB7XG5cdFx0XHRcdHR5cGU6ICdsaW5lJyxcblx0XHRcdFx0ZGF0YToge1xuXHRcdFx0XHRcdGxhYmVsczogWydvY3QnLCAnbm92JywgJ2RpYyddLFxuXHRcdFx0XHRcdGRhdGFzZXRzOiBbe1xuXHRcdFx0XHRcdFx0bGFiZWw6ICdnb29kIHRyZW5kJyxcblx0XHRcdFx0XHRcdGRhdGE6IFsxLDMsMl0sXG5cdFx0XHRcdFx0XHRmaWxsOiB0cnVlLFxuXHRcdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiAnIzhmOCdcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGxhYmVsOiAnZmFpbCB0cmVuZCcsXG5cdFx0XHRcdFx0XHRkYXRhOiBbMywxLDJdLFxuXHRcdFx0XHRcdFx0ZmlsbDogdHJ1ZSxcblx0XHRcdFx0XHRcdGJhY2tncm91bmRDb2xvcjogJyNmODgnXG5cdFx0XHRcdFx0fV1cblx0XHRcdFx0fSxcblx0XHRcdFx0b3B0aW9uczoge1xuXHRcdFx0XHRcdHNjYWxlczoge1xuXHRcdFx0XHRcdFx0eToge1xuXHRcdFx0XHRcdFx0XHRzdGFja2VkOiB0cnVlXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9KSgpO1xuXG5cdH1cblx0XG5cdGV4dHJhY3RIdW1hblJlYWRhYmxlTmFtZShyZWNvcmRfanNvbnBhdGg6IHN0cmluZywganNvbjogc3RyaW5nKTogc3RyaW5nXG5cdHtcblx0XHRsZXQgcmV0ID0gJyc7XG5cdFx0Zm9yIChsZXQgZm4gb2YgWydtdmFsaWR0aW1lJywgJ212YWx1ZScsICdBY2NvRGV0YWlsLmRlLk5hbWUnLCAnRGV0YWlsLmRlLlRpdGxlJ10pXG5cdFx0e1xuXHRcdFx0Y29uc3QgZm5fcGFydHMgPSBmbi5zcGxpdCgnLicpXG5cdFx0XHRsZXQgdmFsID0gSlNPTi5wYXJzZShqc29uKVxuXHRcdFx0Zm9yIChsZXQgcCBvZiBmbl9wYXJ0cylcblx0XHRcdHtcblx0XHRcdFx0dmFsID0gdmFsW3BdXG5cdFx0XHRcdGlmICh2YWwgPT09IHVuZGVmaW5lZClcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdC8vIGNvbnN0IHZhbCA9IHN0YXJ0W2ZuXSBcblx0XHRcdGlmICh2YWwgIT09IHVuZGVmaW5lZClcblx0XHRcdFx0cmV0ICs9IChyZXQgPT09ICcnID8gJycgOiAnLCAnKSArIGZuICsgJz0nICsgSlNPTi5zdHJpbmdpZnkodmFsKVxuXHRcdH1cblx0XHRpZiAocmV0ID09ICcnKVxuXHRcdFx0cmV0ID0gcmVjb3JkX2pzb25wYXRoXG5cdFx0cmV0dXJuIHJldDtcblx0fVxuXHRcblx0Z3JvdXBSZWNvcmRzKGxpc3Q6IHtyZWNvcmRfanNvbjogc3RyaW5nfVtdKToge1trOnN0cmluZ106IGFueVtdfVxuXHR7XG5cdFx0Y29uc3QgZ3JvdXBCeToge1trOnN0cmluZ106IGFueVtdfSA9IHt9XG5cdFx0Zm9yIChsZXQgayA9IDA7IGsgPCBsaXN0Lmxlbmd0aDsgaysrKVxuXHRcdHtcblx0XHRcdGNvbnN0IGpzb24gPSBKU09OLnBhcnNlKGxpc3Rba10ucmVjb3JkX2pzb24pO1xuXHRcdFx0bGV0IHNuYW1lID0ganNvblsnc25hbWUnXTtcblx0XHRcdGlmICh0eXBlb2Ygc25hbWUgIT09ICdzdHJpbmcnKVxuXHRcdFx0XHRzbmFtZSA9ICcnXG5cdFx0XHRsZXQgcHJldl9hcnIgPSBncm91cEJ5W3NuYW1lXVxuXHRcdFx0cHJldl9hcnIgPSBwcmV2X2FyciA9PT0gdW5kZWZpbmVkID8gW10gOiBwcmV2X2FyclxuXHRcdFx0cHJldl9hcnIucHVzaChsaXN0W2tdKVxuXHRcdFx0Z3JvdXBCeVtzbmFtZV0gPSBwcmV2X2FyclxuXHRcdH1cblx0XHRyZXR1cm4gZ3JvdXBCeTsgXG5cdH1cblx0XG5cdGFzeW5jIHJlZnJlc2gocF9zZXNzaW9uX3N0YXJ0X3RzOiBzdHJpbmcsIHBfZGF0YXNldF9uYW1lOiBzdHJpbmcsIHBfY2F0ZWdvcnlfbmFtZTogc3RyaW5nLCBwX2ZhaWxlZF9yZWNvcmRzOiBudW1iZXIsIHBfdG90X3JlY29yZHM6IG51bWJlcikge1xuXHRcdFxuXHRcdHRoaXMubGFzdF9zZXNzaW9uX3N0YXJ0X3RzID0gcF9zZXNzaW9uX3N0YXJ0X3RzXG5cdFx0dGhpcy5sYXN0X2RhdGFzZXRfbmFtZSA9IHBfZGF0YXNldF9uYW1lXG5cdFx0dGhpcy5sYXN0X2NoZWNrX2NhdGVnb3J5ID0gcF9jYXRlZ29yeV9uYW1lXG5cdFx0dGhpcy5sYXN0X2ZhaWxlZF9yZWNvcmRzID0gcF9mYWlsZWRfcmVjb3Jkc1xuXHRcdHRoaXMubGFzdF90b3RfcmVjb3JkcyA9IHBfdG90X3JlY29yZHNcblx0XHRcblx0XHRjb25zb2xlLmxvZyhwX3Nlc3Npb25fc3RhcnRfdHMpXG5cdFx0Y29uc29sZS5sb2cocF9kYXRhc2V0X25hbWUpXG5cdFx0Y29uc29sZS5sb2cocF9jYXRlZ29yeV9uYW1lKVxuXHRcdFxuXHRcdGNvbnN0IGNhdGVnb3J5ID0gY3NfY2FzdChEYXRhc2V0SXNzdWVDYXRlZ29yeSwgdGhpcy5zcm9vdC5xdWVyeVNlbGVjdG9yKCdjcy1kYXRhc2V0LWlzc3VlLWNhdGVnb3J5JykpXG5cdFx0Y2F0ZWdvcnkucmVmcmVzaChcblx0XHR7XG5cdFx0XHRkYXRhc2V0X25hbWU6IHBfZGF0YXNldF9uYW1lLFxuXHRcdFx0c2Vzc2lvbl9zdGFydF90czogcF9zZXNzaW9uX3N0YXJ0X3RzLFxuXHRcdFx0Y2hlY2tfY2F0ZWdvcnk6IHBfY2F0ZWdvcnlfbmFtZSxcblx0XHRcdGZhaWxlZF9yZWNvcmRzOiBwX2ZhaWxlZF9yZWNvcmRzLFxuXHRcdFx0dG90X3JlY29yZHM6IHBfdG90X3JlY29yZHNcblx0XHR9KVxuXHRcdFxuXHRcdHRoaXMuY29udGFpbmVyLnRleHRDb250ZW50ID0gJydcblx0XHRcblx0XHRpZiAodGhpcy5jdXJyZW50X3RhYiA9PT0gJ2lzc3VlcycpXG5cdFx0e1xuXHRcdFx0Y29uc3QgbG9hZGVyID0gbmV3IExvYWRlcigpO1xuXHRcdFx0dGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQobG9hZGVyKVxuXHRcdFxuXHRcdFx0Y29uc3QganNvbiA9IGF3YWl0IEFQSTMubGlzdF9fY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9jaGVja19jYXRlZ29yeV9jaGVja19uYW1lX3JlY29yZF9yZWNvcmRfZmFpbGVkX3Z3KHtcblx0XHRcdFx0c2Vzc2lvbl9zdGFydF90czogcF9zZXNzaW9uX3N0YXJ0X3RzLFxuXHRcdFx0XHRkYXRhc2V0X25hbWU6IHBfZGF0YXNldF9uYW1lLFxuXHRcdFx0XHRjaGVja19jYXRlZ29yeTogcF9jYXRlZ29yeV9uYW1lXG5cdFx0XHR9KVxuXG5cdFx0XHRsb2FkZXIucmVtb3ZlKCk7XG5cdFxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBqc29uLmxlbmd0aDsgaSsrKVxuXHRcdFx0e1xuXHRcdFx0XHRjb25zdCBpc3N1ZSA9IGpzb25baV1cblx0XHRcdFx0Ly8gY29uc29sZS5sb2coaXNzdWUpXG5cdFx0XHRcdGNvbnN0IHNlY3Rpb24gPSBuZXcgT3BlbkNsb3NlU2VjdGlvbigpXG5cdFx0XHRcdHNlY3Rpb24ucmVmcmVzaChpc3N1ZS5jaGVja19uYW1lLCAnJyArIGlzc3VlLm5yX3JlY29yZHMgKyAnIHJlY29yZHMnKVxuXHRcdFx0XHR0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChzZWN0aW9uKVxuXHRcdFx0XHRcblx0XHRcdFx0c2VjdGlvbi5vbm9wZW4gPSBhc3luYyAoKSA9PiB7XG5cdFx0XHRcdFx0Ly9jb25zb2xlLmxvZygnc2V6aW9uZSBhcGVydGEsIHJpY2FyaWNvIScpXG5cdFx0XHRcdFx0Y29uc3QganNvbjIgPSBhd2FpdCBBUEkzLmxpc3RfX2NhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfcmVjb3JkX2NoZWNrX2ZhaWxlZCh7XG5cdFx0XHRcdFx0XHRcdFx0c2Vzc2lvbl9zdGFydF90czogcF9zZXNzaW9uX3N0YXJ0X3RzLFxuXHRcdFx0XHRcdFx0XHRcdGRhdGFzZXRfbmFtZTogcF9kYXRhc2V0X25hbWUsXG5cdFx0XHRcdFx0XHRcdFx0Y2hlY2tfY2F0ZWdvcnk6IHBfY2F0ZWdvcnlfbmFtZSxcblx0XHRcdFx0XHRcdFx0XHRjaGVja19uYW1lOiBpc3N1ZS5jaGVja19uYW1lXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0Y29uc3QgZ3JvdXBCeSA9IHRoaXMuZ3JvdXBSZWNvcmRzKGpzb24yKVxuXHRcdFx0XHRcdGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhncm91cEJ5KVxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGtleXMpXG5cdFx0XHRcdFx0aWYgKGtleXMubGVuZ3RoID09IDEgJiYga2V5c1swXSA9PSAnJylcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRjb25zdCBsaXN0ID0gZ3JvdXBCeVtrZXlzWzBdXVxuXHRcdFx0XHRcdFx0Zm9yIChsZXQgazIgPSAwOyBrMiA8IGxpc3QubGVuZ3RoOyBrMisrKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRjb25zdCBzZWN0aW9uUm93MiA9IG5ldyBTZWN0aW9uUm93KCk7XG5cdFx0XHRcdFx0XHRcdHNlY3Rpb24uYWRkRWxlbWVudFRvQ29udGVudEFyZWEoc2VjdGlvblJvdzIpXG5cdFx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cyLnJlZnJlc2godGhpcy5leHRyYWN0SHVtYW5SZWFkYWJsZU5hbWUobGlzdFtrMl0ucmVjb3JkX2pzb25wYXRoLCBsaXN0W2syXS5yZWNvcmRfanNvbikpXG5cdFx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cyLm9uY2xpY2sgPSAoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0YWxlcnQobGlzdFtrMl0ucmVjb3JkX2pzb24pXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGZvciAobGV0IGsgPSAwOyBrIDwga2V5cy5sZW5ndGg7IGsrKylcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y29uc3Qgc2VjdGlvblJvdyA9IG5ldyBPcGVuQ2xvc2VTZWN0aW9uKCk7XG5cdFx0XHRcdFx0XHRcdHNlY3Rpb24uYWRkRWxlbWVudFRvQ29udGVudEFyZWEoc2VjdGlvblJvdylcblx0XHRcdFx0XHRcdFx0c2VjdGlvblJvdy5yZWZyZXNoKGtleXNba10sICcnICsgZ3JvdXBCeVtrZXlzW2tdXS5sZW5ndGggKyAnIHJlY29yZHMnKVxuXHRcdFx0XHRcdFx0XHRzZWN0aW9uUm93Lm9uY2xpY2sgPSAoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0Y29uc3QgbGlzdCA9IGdyb3VwQnlba2V5c1trXV1cblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhsaXN0KVxuXHRcdFx0XHRcdFx0XHRcdGZvciAobGV0IGsyID0gMDsgazIgPCBsaXN0Lmxlbmd0aDsgazIrKylcblx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBzZWN0aW9uUm93MiA9IG5ldyBTZWN0aW9uUm93KCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRzZWN0aW9uUm93LmFkZEVsZW1lbnRUb0NvbnRlbnRBcmVhKHNlY3Rpb25Sb3cyKVxuXHRcdFx0XHRcdFx0XHRcdFx0c2VjdGlvblJvdzIucmVmcmVzaCh0aGlzLmV4dHJhY3RIdW1hblJlYWRhYmxlTmFtZShsaXN0W2syXS5yZWNvcmRfanNvbnBhdGgsIGxpc3RbazJdLnJlY29yZF9qc29uKSlcblx0XHRcdFx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cyLm9uY2xpY2sgPSAoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFsZXJ0KGxpc3RbazJdLnJlY29yZF9qc29uKVxuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0XHRcdFxuXHRcdH1cblx0XHRcblx0XHRcblx0XHRpZiAodGhpcy5jdXJyZW50X3RhYiA9PT0gJ3JlY29yZHMnKVxuXHRcdHtcblx0XHRcdFxuXHRcdFx0Y29uc3QgbG9hZGVyID0gbmV3IExvYWRlcigpO1xuXHRcdFx0dGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQobG9hZGVyKVxuXG5cdFx0XHRjb25zdCBqc29uID0gYXdhaXQgQVBJMy5saXN0X19jYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X2NoZWNrX2NhdGVnb3J5X3JlY29yZF9qc29ucGF0aF9mYWlsZWRfdncoe1xuXHRcdFx0XHRzZXNzaW9uX3N0YXJ0X3RzOiBwX3Nlc3Npb25fc3RhcnRfdHMsXG5cdFx0XHRcdGRhdGFzZXRfbmFtZTogcF9kYXRhc2V0X25hbWUsXG5cdFx0XHRcdGNoZWNrX2NhdGVnb3J5OiBwX2NhdGVnb3J5X25hbWVcblx0XHRcdH0pO1xuXHRcdFx0XG5cdFx0XHRsb2FkZXIucmVtb3ZlKCk7XG5cblx0XHRcdGNvbnN0IGdyb3VwQnkgPSB0aGlzLmdyb3VwUmVjb3Jkcyhqc29uKVxuXHRcdFx0Y29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGdyb3VwQnkpXG5cdFx0XHRjb25zb2xlLmxvZyhrZXlzKVxuXHRcdFx0aWYgKGtleXMubGVuZ3RoID09IDEgJiYga2V5c1swXSA9PSAnJylcblx0XHRcdHtcblx0XHRcdFx0Y29uc3QgbGlzdCA9IGdyb3VwQnlba2V5c1swXV1cblx0XHRcdFx0Zm9yIChsZXQgazIgPSAwOyBrMiA8IGxpc3QubGVuZ3RoOyBrMisrKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Y29uc3Qgc2VjdGlvblJvdzIgPSBuZXcgT3BlbkNsb3NlU2VjdGlvbigpO1xuXHRcdFx0XHRcdHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHNlY3Rpb25Sb3cyKVxuXHRcdFx0XHRcdHNlY3Rpb25Sb3cyLnJlZnJlc2godGhpcy5leHRyYWN0SHVtYW5SZWFkYWJsZU5hbWUobGlzdFtrMl0ucmVjb3JkX2pzb25wYXRoLCBsaXN0W2syXS5yZWNvcmRfanNvbiksICcnICsgbGlzdFtrMl0ubnJfY2hlY2tfbmFtZXMgKyAnIGNoZWNrIGZhaWxlZCcpXG5cdFx0XHRcdFx0c2VjdGlvblJvdzIub25jbGljayA9IGFzeW5jICgpID0+IHtcblx0XHRcdFx0XHRcdGNvbnN0IGpzb24yID0gYXdhaXQgQVBJMy5saXN0X19jYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X3JlY29yZF9jaGVja19mYWlsZWQoe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzZXNzaW9uX3N0YXJ0X3RzOiBwX3Nlc3Npb25fc3RhcnRfdHMsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGFzZXRfbmFtZTogcF9kYXRhc2V0X25hbWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNoZWNrX2NhdGVnb3J5OiBwX2NhdGVnb3J5X25hbWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlY29yZF9qc29ucGF0aDogbGlzdFtrMl0ucmVjb3JkX2pzb25wYXRoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdGZvciAobGV0IGsgPSAwOyBrIDwganNvbjIubGVuZ3RoOyBrKyspXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IHNlY3Rpb25Sb3cgPSBuZXcgU2VjdGlvblJvdygpO1xuXHRcdFx0XHRcdFx0XHRzZWN0aW9uUm93Mi5hZGRFbGVtZW50VG9Db250ZW50QXJlYShzZWN0aW9uUm93KVxuXHRcdFx0XHRcdFx0XHRzZWN0aW9uUm93LnJlZnJlc2goanNvbjJba10uY2hlY2tfbmFtZSlcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2Vcblx0XHRcdHtcblx0XHRcdFx0Zm9yIChsZXQgayA9IDA7IGsgPCBrZXlzLmxlbmd0aDsgaysrKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Y29uc3Qgc2VjdGlvblJvdyA9IG5ldyBPcGVuQ2xvc2VTZWN0aW9uKCk7XG5cdFx0XHRcdFx0dGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoc2VjdGlvblJvdylcblx0XHRcdFx0XHRzZWN0aW9uUm93LnJlZnJlc2goa2V5c1trXSwgJycgKyBncm91cEJ5W2tleXNba11dLmxlbmd0aCArICcgcmVjb3JkcycpXG5cdFx0XHRcdFx0c2VjdGlvblJvdy5vbmNsaWNrID0gKCkgPT4ge1xuXHRcdFx0XHRcdFx0Y29uc3QgbGlzdCA9IGdyb3VwQnlba2V5c1trXV1cblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGxpc3QpXG5cdFx0XHRcdFx0XHRmb3IgKGxldCBrMiA9IDA7IGsyIDwgbGlzdC5sZW5ndGg7IGsyKyspXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IHNlY3Rpb25Sb3cyID0gbmV3IE9wZW5DbG9zZVNlY3Rpb24oKTtcblx0XHRcdFx0XHRcdFx0c2VjdGlvblJvdy5hZGRFbGVtZW50VG9Db250ZW50QXJlYShzZWN0aW9uUm93Milcblx0XHRcdFx0XHRcdFx0c2VjdGlvblJvdzIucmVmcmVzaCh0aGlzLmV4dHJhY3RIdW1hblJlYWRhYmxlTmFtZShsaXN0W2syXS5yZWNvcmRfanNvbnBhdGgsIGxpc3RbazJdLnJlY29yZF9qc29uKSwgbGlzdFtrMl0ubnJfY2hlY2tfbmFtZXMpXG5cdFx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cyLm9uY2xpY2sgPSBhc3luYyAoZSkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKClcblx0XHRcdFx0XHRcdFx0XHRjb25zdCBqc29uMiA9IGF3YWl0IEFQSTMubGlzdF9fY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9yZWNvcmRfY2hlY2tfZmFpbGVkKHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHNlc3Npb25fc3RhcnRfdHM6IHBfc2Vzc2lvbl9zdGFydF90cyxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGFzZXRfbmFtZTogcF9kYXRhc2V0X25hbWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjaGVja19jYXRlZ29yeTogcF9jYXRlZ29yeV9uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVjb3JkX2pzb25wYXRoOiBsaXN0W2syXS5yZWNvcmRfanNvbnBhdGhcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgayA9IDA7IGsgPCBqc29uMi5sZW5ndGg7IGsrKylcblx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBzZWN0aW9uUm93ID0gbmV3IFNlY3Rpb25Sb3coKTtcblx0XHRcdFx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cyLmFkZEVsZW1lbnRUb0NvbnRlbnRBcmVhKHNlY3Rpb25Sb3cpXG5cdFx0XHRcdFx0XHRcdFx0XHRzZWN0aW9uUm93LnJlZnJlc2goanNvbjJba10uY2hlY2tfbmFtZSlcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cblxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCdjcy1kYXRhc2V0LWlzc3Vlcy1kZXRhaWwnLCBEYXRhc2V0SXNzdWVzRGV0YWlsKVxuIl19