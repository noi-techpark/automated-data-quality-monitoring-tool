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
    canvas;
    // connected_promise
    // connected_func: (s: null) => void = s => null
    chartjs_success;
    chartjs_promise;
    connectedCallback() {
        // chartjs need to be created when element is attached into the dom
        const chart = new Chart(this.canvas, {
            type: 'line',
            data: {
                labels: ['-5', '-4', '-3', '-2', '-1'],
                datasets: []
            },
            options: {
                scales: {
                    y: {
                        stacked: true,
                        beginAtZero: true
                    }
                }
            }
        });
        this.chartjs_success(chart);
    }
    constructor() {
        super();
        this.chartjs_promise = new Promise(s => this.chartjs_success = s);
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
        this.canvas = cs_cast(HTMLCanvasElement, this.sroot.querySelector('canvas'));
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
        (async () => {
            const data = await API3.list__catchsolve_noiodh__test_dataset_history_vw({
                dataset_name: this.last_dataset_name,
                check_category: this.last_check_category
            });
            const goodarr = [];
            const failarr = [];
            for (let x = 0; x < data.length; x++) {
                goodarr.push(data[x].tested_records - data[x].failed_recs);
                failarr.push(data[x].failed_recs);
            }
            console.log(goodarr);
            console.log(failarr);
            console.log(data);
            const chartjs = await this.chartjs_promise;
            chartjs.data.datasets = [{
                    label: 'good trend',
                    data: goodarr,
                    fill: true,
                    backgroundColor: '#8f8'
                },
                {
                    label: 'fail trend',
                    data: failarr,
                    fill: true,
                    backgroundColor: '#f88'
                }];
            chartjs.update();
        })();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YXNldElzc3Vlc0RldGFpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3R5cGVzY3JpcHQvRGF0YXNldElzc3Vlc0RldGFpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxPQUFPLEVBQUUsT0FBTyxFQUFZLE1BQU0sY0FBYyxDQUFDO0FBQ2pELE9BQU8sRUFBQyxJQUFJLEVBQTJELE1BQU0sZUFBZSxDQUFDO0FBQzdGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3pELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ3JDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBR2pFLE1BQU0sT0FBTyxtQkFBb0IsU0FBUSxXQUFXO0lBR25ELFNBQVMsQ0FBQTtJQUVULHFCQUFxQixHQUFnQixJQUFJLENBQUE7SUFDekMsaUJBQWlCLEdBQWdCLElBQUksQ0FBQTtJQUNyQyxtQkFBbUIsR0FBZ0IsSUFBSSxDQUFBO0lBQ3ZDLG1CQUFtQixHQUFnQixJQUFJLENBQUE7SUFDdkMsZ0JBQWdCLEdBQWdCLElBQUksQ0FBQTtJQUVwQyxXQUFXLEdBQXlCLFFBQVEsQ0FBQTtJQUU1QyxLQUFLLENBQUE7SUFFTCxNQUFNLENBQUE7SUFFTixvQkFBb0I7SUFDcEIsZ0RBQWdEO0lBRWhELGVBQWUsQ0FBb0I7SUFDbkMsZUFBZSxDQUFnQjtJQUUvQixpQkFBaUI7UUFFaEIsbUVBQW1FO1FBQ25FLE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDcEMsSUFBSSxFQUFFLE1BQU07WUFDWixJQUFJLEVBQUU7Z0JBQ0wsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUks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S0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFBO2dDQUN4QyxDQUFDOzRCQUVGLENBQUMsQ0FBQTt3QkFDRixDQUFDO29CQUNGLENBQUMsQ0FBQTtnQkFDRixDQUFDO1lBQ0YsQ0FBQztRQUNGLENBQUM7SUFDRixDQUFDO0NBQ0Q7QUFFRCxjQUFjLENBQUMsTUFBTSxDQUFDLDBCQUEwQixFQUFFLG1CQUFtQixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogKEMpIDIwMjQgQ2F0Y2ggU29sdmUgZGkgRGF2aWRlIE1vbnRlc2luXG4gKiBMaWNlbnNlOiBBR1BMXG4gKi9cblxuaW1wb3J0IHsgY3NfY2FzdCwgdGhyb3dOUEUgfSBmcm9tIFwiLi9xdWFsaXR5LmpzXCI7XG5pbXBvcnQge0FQSTMsIGNhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfcmVjb3JkX2NoZWNrX2ZhaWxlZF9fcm93fSBmcm9tICcuL2FwaS9hcGkzLmpzJztcbmltcG9ydCB7IE9wZW5DbG9zZVNlY3Rpb24gfSBmcm9tIFwiLi9PcGVuQ2xvc2VTZWN0aW9uLmpzXCI7XG5pbXBvcnQgeyBTZWN0aW9uUm93IH0gZnJvbSBcIi4vU2VjdGlvblJvdy5qc1wiO1xuaW1wb3J0IHsgTG9hZGVyIH0gZnJvbSBcIi4vTG9hZGVyLmpzXCI7XG5pbXBvcnQgeyBEYXRhc2V0SXNzdWVDYXRlZ29yeSB9IGZyb20gXCIuL0RhdGFzZXRJc3N1ZUNhdGVnb3J5LmpzXCI7XG5pbXBvcnQgQ2hhcnQgPSByZXF1aXJlKFwiY2hhcnQuanNcIik7XG5cbmV4cG9ydCBjbGFzcyBEYXRhc2V0SXNzdWVzRGV0YWlsIGV4dGVuZHMgSFRNTEVsZW1lbnRcbntcblx0XG5cdGNvbnRhaW5lciBcblx0XG5cdGxhc3Rfc2Vzc2lvbl9zdGFydF90czogc3RyaW5nfG51bGwgPSBudWxsXG5cdGxhc3RfZGF0YXNldF9uYW1lOiBzdHJpbmd8bnVsbCA9IG51bGxcblx0bGFzdF9jaGVja19jYXRlZ29yeTogc3RyaW5nfG51bGwgPSBudWxsXG5cdGxhc3RfZmFpbGVkX3JlY29yZHM6IG51bWJlcnxudWxsID0gbnVsbFxuXHRsYXN0X3RvdF9yZWNvcmRzOiBudW1iZXJ8bnVsbCA9IG51bGxcblx0XG5cdGN1cnJlbnRfdGFiOiAnaXNzdWVzJyB8ICdyZWNvcmRzJyA9ICdpc3N1ZXMnXG5cdFxuXHRzcm9vdFxuXHRcblx0Y2FudmFzXG5cdFxuXHQvLyBjb25uZWN0ZWRfcHJvbWlzZVxuXHQvLyBjb25uZWN0ZWRfZnVuYzogKHM6IG51bGwpID0+IHZvaWQgPSBzID0+IG51bGxcblx0XG5cdGNoYXJ0anNfc3VjY2VzczogKHM6IENoYXJ0KSA9PiB2b2lkXG5cdGNoYXJ0anNfcHJvbWlzZTogUHJvbWlzZTxDaGFydD5cblxuXHRjb25uZWN0ZWRDYWxsYmFjaygpXG5cdHtcblx0XHQvLyBjaGFydGpzIG5lZWQgdG8gYmUgY3JlYXRlZCB3aGVuIGVsZW1lbnQgaXMgYXR0YWNoZWQgaW50byB0aGUgZG9tXG5cdFx0Y29uc3QgY2hhcnQgPSBuZXcgQ2hhcnQodGhpcy5jYW52YXMsIHtcblx0XHRcdHR5cGU6ICdsaW5lJyxcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0bGFiZWxzOiBbJy01JywnLTQnLCctMycsICctMicsICctMSddLFxuXHRcdFx0XHRkYXRhc2V0czogW11cblx0XHRcdH0sXG5cdFx0XHRvcHRpb25zOiB7XG5cdFx0XHRcdHNjYWxlczoge1xuXHRcdFx0XHRcdHk6IHtcblx0XHRcdFx0XHRcdHN0YWNrZWQ6IHRydWUsXG5cdFx0XHRcdFx0XHRiZWdpbkF0WmVybzogdHJ1ZVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdH1cblx0XHR9KTtcblx0XHRcblx0XHR0aGlzLmNoYXJ0anNfc3VjY2VzcyhjaGFydClcblx0fVxuXHRcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKVxuXHRcdHRoaXMuY2hhcnRqc19wcm9taXNlID0gbmV3IFByb21pc2UocyA9PiB0aGlzLmNoYXJ0anNfc3VjY2VzcyA9IHMpXG5cdFx0dGhpcy5zcm9vdCA9IHRoaXMuYXR0YWNoU2hhZG93KHsgbW9kZTogJ29wZW4nIH0pXG5cdFx0dGhpcy5zcm9vdC5pbm5lckhUTUwgPSBgXG5cdFx0XHRcdDxzdHlsZT5cblx0XHRcdFx0XHQ6aG9zdCB7XG5cdFx0XHRcdFx0XHRwYWRkaW5nOiAwLjVyZW07XG5cdFx0XHRcdFx0XHRkaXNwbGF5OiBibG9jaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0LmNvbnRhaW5lciB7XG5cdFx0XHRcdFx0XHRib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xuXHRcdFx0XHRcdFx0Ym9yZGVyLXJhZGl1czogMC4zcmVtO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcblx0XHRcdFx0XHQuY29udGFpbmVyID4gKiB7XG5cdFx0XHRcdFx0XHRib3JkZXItYm90dG9tOiAxcHggc29saWQgI2NjYztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0LmhlYWRlciB7XG5cdFx0XHRcdFx0XHRkaXNwbGF5OiBmbGV4O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQuaGVhZGVyIC5jaGFydCB7XG5cdFx0XHRcdFx0XHR3aWR0aDogNTAlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0PC9zdHlsZT5cblx0XHRcdFx0PCEtLSA8aW1nIHNyYz1cImtwaS1kZXRhaWwucG5nXCIgc3R5bGU9XCJtYXgtd2lkdGg6IDEwMCVcIj4gLS0+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJoZWFkZXJcIj5cblx0XHRcdFx0XHQ8ZGl2PlxuXHRcdFx0XHRcdFx0PGNzLWRhdGFzZXQtaXNzdWUtY2F0ZWdvcnk+PC9jcy1kYXRhc2V0LWlzc3VlLWNhdGVnb3J5PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjaGFydFwiPlxuXHRcdFx0XHRcdFx0PGNhbnZhcz48L2NhbnZhcz5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8ZGl2PjxpbWcgc3JjPVwia3BpLWdlbmVyYWwtaW5mby5wbmdcIj48L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxkaXYgc3R5bGU9XCJ3aWR0aDogY2FsYygxMDAlIC0gMjBweClcIj5cblx0XHRcdFx0XHQ8ZGl2IHN0eWxlPVwidGV4dC1hbGlnbjogcmlnaHRcIj5cblx0XHRcdFx0XHRcdDxidXR0b24gY2xhc3M9XCJpc3N1ZXNcIj5Jc3N1ZXM8L2J1dHRvbj5cblx0XHRcdFx0XHRcdDxidXR0b24gY2xhc3M9XCJyZWNvcmRzXCI+UmVjb3JkczwvYnV0dG9uPlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj48L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdGBcblxuXHRcdGN1c3RvbUVsZW1lbnRzLnVwZ3JhZGUodGhpcy5zcm9vdClcblxuXHRcdHRoaXMuY29udGFpbmVyID0gY3NfY2FzdChIVE1MRGl2RWxlbWVudCwgdGhpcy5zcm9vdC5xdWVyeVNlbGVjdG9yKCcuY29udGFpbmVyJykpXG5cdFx0XG5cdFx0Y29uc3QgaXNzdWVzID0gY3NfY2FzdChIVE1MQnV0dG9uRWxlbWVudCwgdGhpcy5zcm9vdC5xdWVyeVNlbGVjdG9yKCcuaXNzdWVzJykpXG5cdFx0Y29uc3QgcmVjb3JkcyA9IGNzX2Nhc3QoSFRNTEJ1dHRvbkVsZW1lbnQsIHRoaXMuc3Jvb3QucXVlcnlTZWxlY3RvcignLnJlY29yZHMnKSlcblx0XHRcblx0XHRpc3N1ZXMub25jbGljayA9ICgpID0+IHtcblx0XHRcdHRoaXMuY3VycmVudF90YWIgPSAnaXNzdWVzJ1xuXHRcdFx0aWYgKHRoaXMubGFzdF9zZXNzaW9uX3N0YXJ0X3RzICE9IG51bGwgJiYgdGhpcy5sYXN0X2RhdGFzZXRfbmFtZSAhPSBudWxsICYmIHRoaXMubGFzdF9jaGVja19jYXRlZ29yeSAhPSBudWxsXG5cdFx0XHRcdCYmIHRoaXMubGFzdF9mYWlsZWRfcmVjb3JkcyAhPSBudWxsICYmIHRoaXMubGFzdF90b3RfcmVjb3JkcyAhPSBudWxsKVxuXHRcdFx0XHR0aGlzLnJlZnJlc2godGhpcy5sYXN0X3Nlc3Npb25fc3RhcnRfdHMsIHRoaXMubGFzdF9kYXRhc2V0X25hbWUsIHRoaXMubGFzdF9jaGVja19jYXRlZ29yeSwgdGhpcy5sYXN0X2ZhaWxlZF9yZWNvcmRzLCB0aGlzLmxhc3RfdG90X3JlY29yZHMpXG5cdFx0fVxuXHRcdFxuXHRcdHJlY29yZHMub25jbGljayA9ICgpID0+IHtcblx0XHRcdHRoaXMuY3VycmVudF90YWIgPSAncmVjb3Jkcydcblx0XHRcdGlmICh0aGlzLmxhc3Rfc2Vzc2lvbl9zdGFydF90cyAhPSBudWxsICYmIHRoaXMubGFzdF9kYXRhc2V0X25hbWUgIT0gbnVsbCAmJiB0aGlzLmxhc3RfY2hlY2tfY2F0ZWdvcnkgIT0gbnVsbFxuXHRcdFx0XHQmJiB0aGlzLmxhc3RfZmFpbGVkX3JlY29yZHMgIT0gbnVsbCAmJiB0aGlzLmxhc3RfdG90X3JlY29yZHMgIT0gbnVsbClcblx0XHRcdFx0dGhpcy5yZWZyZXNoKHRoaXMubGFzdF9zZXNzaW9uX3N0YXJ0X3RzLCB0aGlzLmxhc3RfZGF0YXNldF9uYW1lLCB0aGlzLmxhc3RfY2hlY2tfY2F0ZWdvcnksIHRoaXMubGFzdF9mYWlsZWRfcmVjb3JkcywgdGhpcy5sYXN0X3RvdF9yZWNvcmRzKVxuXHRcdH1cblx0XHRcblx0XHR0aGlzLmNhbnZhcyA9IGNzX2Nhc3QoSFRNTENhbnZhc0VsZW1lbnQsIHRoaXMuc3Jvb3QucXVlcnlTZWxlY3RvcignY2FudmFzJykpO1xuXHRcdFxuXHRcdFxuXG5cdH1cblx0XG5cdGV4dHJhY3RIdW1hblJlYWRhYmxlTmFtZShyZWNvcmRfanNvbnBhdGg6IHN0cmluZywganNvbjogc3RyaW5nKTogc3RyaW5nXG5cdHtcblx0XHRsZXQgcmV0ID0gJyc7XG5cdFx0Zm9yIChsZXQgZm4gb2YgWydtdmFsaWR0aW1lJywgJ212YWx1ZScsICdBY2NvRGV0YWlsLmRlLk5hbWUnLCAnRGV0YWlsLmRlLlRpdGxlJ10pXG5cdFx0e1xuXHRcdFx0Y29uc3QgZm5fcGFydHMgPSBmbi5zcGxpdCgnLicpXG5cdFx0XHRsZXQgdmFsID0gSlNPTi5wYXJzZShqc29uKVxuXHRcdFx0Zm9yIChsZXQgcCBvZiBmbl9wYXJ0cylcblx0XHRcdHtcblx0XHRcdFx0dmFsID0gdmFsW3BdXG5cdFx0XHRcdGlmICh2YWwgPT09IHVuZGVmaW5lZClcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdC8vIGNvbnN0IHZhbCA9IHN0YXJ0W2ZuXSBcblx0XHRcdGlmICh2YWwgIT09IHVuZGVmaW5lZClcblx0XHRcdFx0cmV0ICs9IChyZXQgPT09ICcnID8gJycgOiAnLCAnKSArIGZuICsgJz0nICsgSlNPTi5zdHJpbmdpZnkodmFsKVxuXHRcdH1cblx0XHRpZiAocmV0ID09ICcnKVxuXHRcdFx0cmV0ID0gcmVjb3JkX2pzb25wYXRoXG5cdFx0cmV0dXJuIHJldDtcblx0fVxuXHRcblx0Z3JvdXBSZWNvcmRzKGxpc3Q6IHtyZWNvcmRfanNvbjogc3RyaW5nfVtdKToge1trOnN0cmluZ106IGFueVtdfVxuXHR7XG5cdFx0Y29uc3QgZ3JvdXBCeToge1trOnN0cmluZ106IGFueVtdfSA9IHt9XG5cdFx0Zm9yIChsZXQgayA9IDA7IGsgPCBsaXN0Lmxlbmd0aDsgaysrKVxuXHRcdHtcblx0XHRcdGNvbnN0IGpzb24gPSBKU09OLnBhcnNlKGxpc3Rba10ucmVjb3JkX2pzb24pO1xuXHRcdFx0bGV0IHNuYW1lID0ganNvblsnc25hbWUnXTtcblx0XHRcdGlmICh0eXBlb2Ygc25hbWUgIT09ICdzdHJpbmcnKVxuXHRcdFx0XHRzbmFtZSA9ICcnXG5cdFx0XHRsZXQgcHJldl9hcnIgPSBncm91cEJ5W3NuYW1lXVxuXHRcdFx0cHJldl9hcnIgPSBwcmV2X2FyciA9PT0gdW5kZWZpbmVkID8gW10gOiBwcmV2X2FyclxuXHRcdFx0cHJldl9hcnIucHVzaChsaXN0W2tdKVxuXHRcdFx0Z3JvdXBCeVtzbmFtZV0gPSBwcmV2X2FyclxuXHRcdH1cblx0XHRyZXR1cm4gZ3JvdXBCeTsgXG5cdH1cblx0XG5cdGFzeW5jIHJlZnJlc2gocF9zZXNzaW9uX3N0YXJ0X3RzOiBzdHJpbmcsIHBfZGF0YXNldF9uYW1lOiBzdHJpbmcsIHBfY2F0ZWdvcnlfbmFtZTogc3RyaW5nLCBwX2ZhaWxlZF9yZWNvcmRzOiBudW1iZXIsIHBfdG90X3JlY29yZHM6IG51bWJlcikge1xuXHRcdFxuXHRcdHRoaXMubGFzdF9zZXNzaW9uX3N0YXJ0X3RzID0gcF9zZXNzaW9uX3N0YXJ0X3RzXG5cdFx0dGhpcy5sYXN0X2RhdGFzZXRfbmFtZSA9IHBfZGF0YXNldF9uYW1lXG5cdFx0dGhpcy5sYXN0X2NoZWNrX2NhdGVnb3J5ID0gcF9jYXRlZ29yeV9uYW1lXG5cdFx0dGhpcy5sYXN0X2ZhaWxlZF9yZWNvcmRzID0gcF9mYWlsZWRfcmVjb3Jkc1xuXHRcdHRoaXMubGFzdF90b3RfcmVjb3JkcyA9IHBfdG90X3JlY29yZHNcblx0XHRcblx0XHRjb25zb2xlLmxvZyhwX3Nlc3Npb25fc3RhcnRfdHMpXG5cdFx0Y29uc29sZS5sb2cocF9kYXRhc2V0X25hbWUpXG5cdFx0Y29uc29sZS5sb2cocF9jYXRlZ29yeV9uYW1lKTtcblx0XHRcblx0XHQoYXN5bmMgKCkgPT4ge1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGNvbnN0IGRhdGEgPSBhd2FpdCBBUEkzLmxpc3RfX2NhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfaGlzdG9yeV92dyh7XG5cdFx0XHRcdFx0XHRkYXRhc2V0X25hbWU6IHRoaXMubGFzdF9kYXRhc2V0X25hbWUhLFxuXHRcdFx0XHRcdFx0Y2hlY2tfY2F0ZWdvcnk6IHRoaXMubGFzdF9jaGVja19jYXRlZ29yeSFcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGNvbnN0IGdvb2RhcnIgPSBbXVxuXHRcdFx0XHRcdGNvbnN0IGZhaWxhcnIgPSBbXVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGZvciAobGV0IHggPSAwOyB4IDwgZGF0YS5sZW5ndGg7IHgrKylcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRnb29kYXJyLnB1c2goZGF0YVt4XS50ZXN0ZWRfcmVjb3JkcyAtIGRhdGFbeF0uZmFpbGVkX3JlY3MpXG5cdFx0XHRcdFx0XHRmYWlsYXJyLnB1c2goZGF0YVt4XS5mYWlsZWRfcmVjcylcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coZ29vZGFycilcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhmYWlsYXJyKVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGRhdGEpXG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0Y29uc3QgY2hhcnRqcyA9IGF3YWl0IHRoaXMuY2hhcnRqc19wcm9taXNlXG5cdFx0XHRcdFx0Y2hhcnRqcy5kYXRhLmRhdGFzZXRzID0gW3tcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxhYmVsOiAnZ29vZCB0cmVuZCcsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhOiBnb29kYXJyLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZmlsbDogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGJhY2tncm91bmRDb2xvcjogJyM4ZjgnXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSxcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsYWJlbDogJ2ZhaWwgdHJlbmQnLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YTogZmFpbGFycixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZpbGw6IHRydWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6ICcjZjg4J1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1dXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0Y2hhcnRqcy51cGRhdGUoKVxuXHRcdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdH0pKCk7XG5cdFx0XG5cdFx0Y29uc3QgY2F0ZWdvcnkgPSBjc19jYXN0KERhdGFzZXRJc3N1ZUNhdGVnb3J5LCB0aGlzLnNyb290LnF1ZXJ5U2VsZWN0b3IoJ2NzLWRhdGFzZXQtaXNzdWUtY2F0ZWdvcnknKSlcblx0XHRjYXRlZ29yeS5yZWZyZXNoKFxuXHRcdHtcblx0XHRcdGRhdGFzZXRfbmFtZTogcF9kYXRhc2V0X25hbWUsXG5cdFx0XHRzZXNzaW9uX3N0YXJ0X3RzOiBwX3Nlc3Npb25fc3RhcnRfdHMsXG5cdFx0XHRjaGVja19jYXRlZ29yeTogcF9jYXRlZ29yeV9uYW1lLFxuXHRcdFx0ZmFpbGVkX3JlY29yZHM6IHBfZmFpbGVkX3JlY29yZHMsXG5cdFx0XHR0b3RfcmVjb3JkczogcF90b3RfcmVjb3Jkc1xuXHRcdH0pXG5cdFx0XG5cdFx0dGhpcy5jb250YWluZXIudGV4dENvbnRlbnQgPSAnJ1xuXHRcdFxuXHRcdGlmICh0aGlzLmN1cnJlbnRfdGFiID09PSAnaXNzdWVzJylcblx0XHR7XG5cdFx0XHRjb25zdCBsb2FkZXIgPSBuZXcgTG9hZGVyKCk7XG5cdFx0XHR0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChsb2FkZXIpXG5cdFx0XG5cdFx0XHRjb25zdCBqc29uID0gYXdhaXQgQVBJMy5saXN0X19jYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X2NoZWNrX2NhdGVnb3J5X2NoZWNrX25hbWVfcmVjb3JkX3JlY29yZF9mYWlsZWRfdncoe1xuXHRcdFx0XHRzZXNzaW9uX3N0YXJ0X3RzOiBwX3Nlc3Npb25fc3RhcnRfdHMsXG5cdFx0XHRcdGRhdGFzZXRfbmFtZTogcF9kYXRhc2V0X25hbWUsXG5cdFx0XHRcdGNoZWNrX2NhdGVnb3J5OiBwX2NhdGVnb3J5X25hbWVcblx0XHRcdH0pXG5cblx0XHRcdGxvYWRlci5yZW1vdmUoKTtcblx0XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGpzb24ubGVuZ3RoOyBpKyspXG5cdFx0XHR7XG5cdFx0XHRcdGNvbnN0IGlzc3VlID0ganNvbltpXVxuXHRcdFx0XHQvLyBjb25zb2xlLmxvZyhpc3N1ZSlcblx0XHRcdFx0Y29uc3Qgc2VjdGlvbiA9IG5ldyBPcGVuQ2xvc2VTZWN0aW9uKClcblx0XHRcdFx0c2VjdGlvbi5yZWZyZXNoKGlzc3VlLmNoZWNrX25hbWUsICcnICsgaXNzdWUubnJfcmVjb3JkcyArICcgcmVjb3JkcycpXG5cdFx0XHRcdHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHNlY3Rpb24pXG5cdFx0XHRcdFxuXHRcdFx0XHRzZWN0aW9uLm9ub3BlbiA9IGFzeW5jICgpID0+IHtcblx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKCdzZXppb25lIGFwZXJ0YSwgcmljYXJpY28hJylcblx0XHRcdFx0XHRjb25zdCBqc29uMiA9IGF3YWl0IEFQSTMubGlzdF9fY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9yZWNvcmRfY2hlY2tfZmFpbGVkKHtcblx0XHRcdFx0XHRcdFx0XHRzZXNzaW9uX3N0YXJ0X3RzOiBwX3Nlc3Npb25fc3RhcnRfdHMsXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YXNldF9uYW1lOiBwX2RhdGFzZXRfbmFtZSxcblx0XHRcdFx0XHRcdFx0XHRjaGVja19jYXRlZ29yeTogcF9jYXRlZ29yeV9uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdGNoZWNrX25hbWU6IGlzc3VlLmNoZWNrX25hbWVcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRjb25zdCBncm91cEJ5ID0gdGhpcy5ncm91cFJlY29yZHMoanNvbjIpXG5cdFx0XHRcdFx0Y29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGdyb3VwQnkpXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coa2V5cylcblx0XHRcdFx0XHRpZiAoa2V5cy5sZW5ndGggPT0gMSAmJiBrZXlzWzBdID09ICcnKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGNvbnN0IGxpc3QgPSBncm91cEJ5W2tleXNbMF1dXG5cdFx0XHRcdFx0XHRmb3IgKGxldCBrMiA9IDA7IGsyIDwgbGlzdC5sZW5ndGg7IGsyKyspXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IHNlY3Rpb25Sb3cyID0gbmV3IFNlY3Rpb25Sb3coKTtcblx0XHRcdFx0XHRcdFx0c2VjdGlvbi5hZGRFbGVtZW50VG9Db250ZW50QXJlYShzZWN0aW9uUm93Milcblx0XHRcdFx0XHRcdFx0c2VjdGlvblJvdzIucmVmcmVzaCh0aGlzLmV4dHJhY3RIdW1hblJlYWRhYmxlTmFtZShsaXN0W2syXS5yZWNvcmRfanNvbnBhdGgsIGxpc3RbazJdLnJlY29yZF9qc29uKSlcblx0XHRcdFx0XHRcdFx0c2VjdGlvblJvdzIub25jbGljayA9ICgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRhbGVydChsaXN0W2syXS5yZWNvcmRfanNvbilcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Zm9yIChsZXQgayA9IDA7IGsgPCBrZXlzLmxlbmd0aDsgaysrKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRjb25zdCBzZWN0aW9uUm93ID0gbmV3IE9wZW5DbG9zZVNlY3Rpb24oKTtcblx0XHRcdFx0XHRcdFx0c2VjdGlvbi5hZGRFbGVtZW50VG9Db250ZW50QXJlYShzZWN0aW9uUm93KVxuXHRcdFx0XHRcdFx0XHRzZWN0aW9uUm93LnJlZnJlc2goa2V5c1trXSwgJycgKyBncm91cEJ5W2tleXNba11dLmxlbmd0aCArICcgcmVjb3JkcycpXG5cdFx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cub25jbGljayA9ICgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRjb25zdCBsaXN0ID0gZ3JvdXBCeVtrZXlzW2tdXVxuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGxpc3QpXG5cdFx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgazIgPSAwOyBrMiA8IGxpc3QubGVuZ3RoOyBrMisrKVxuXHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IHNlY3Rpb25Sb3cyID0gbmV3IFNlY3Rpb25Sb3coKTtcblx0XHRcdFx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cuYWRkRWxlbWVudFRvQ29udGVudEFyZWEoc2VjdGlvblJvdzIpXG5cdFx0XHRcdFx0XHRcdFx0XHRzZWN0aW9uUm93Mi5yZWZyZXNoKHRoaXMuZXh0cmFjdEh1bWFuUmVhZGFibGVOYW1lKGxpc3RbazJdLnJlY29yZF9qc29ucGF0aCwgbGlzdFtrMl0ucmVjb3JkX2pzb24pKVxuXHRcdFx0XHRcdFx0XHRcdFx0c2VjdGlvblJvdzIub25jbGljayA9ICgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0YWxlcnQobGlzdFtrMl0ucmVjb3JkX2pzb24pXG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRcdFx0XG5cdFx0fVxuXHRcdFxuXHRcdFxuXHRcdGlmICh0aGlzLmN1cnJlbnRfdGFiID09PSAncmVjb3JkcycpXG5cdFx0e1xuXHRcdFx0XG5cdFx0XHRjb25zdCBsb2FkZXIgPSBuZXcgTG9hZGVyKCk7XG5cdFx0XHR0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChsb2FkZXIpXG5cblx0XHRcdGNvbnN0IGpzb24gPSBhd2FpdCBBUEkzLmxpc3RfX2NhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfY2hlY2tfY2F0ZWdvcnlfcmVjb3JkX2pzb25wYXRoX2ZhaWxlZF92dyh7XG5cdFx0XHRcdHNlc3Npb25fc3RhcnRfdHM6IHBfc2Vzc2lvbl9zdGFydF90cyxcblx0XHRcdFx0ZGF0YXNldF9uYW1lOiBwX2RhdGFzZXRfbmFtZSxcblx0XHRcdFx0Y2hlY2tfY2F0ZWdvcnk6IHBfY2F0ZWdvcnlfbmFtZVxuXHRcdFx0fSk7XG5cdFx0XHRcblx0XHRcdGxvYWRlci5yZW1vdmUoKTtcblxuXHRcdFx0Y29uc3QgZ3JvdXBCeSA9IHRoaXMuZ3JvdXBSZWNvcmRzKGpzb24pXG5cdFx0XHRjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoZ3JvdXBCeSlcblx0XHRcdGNvbnNvbGUubG9nKGtleXMpXG5cdFx0XHRpZiAoa2V5cy5sZW5ndGggPT0gMSAmJiBrZXlzWzBdID09ICcnKVxuXHRcdFx0e1xuXHRcdFx0XHRjb25zdCBsaXN0ID0gZ3JvdXBCeVtrZXlzWzBdXVxuXHRcdFx0XHRmb3IgKGxldCBrMiA9IDA7IGsyIDwgbGlzdC5sZW5ndGg7IGsyKyspXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRjb25zdCBzZWN0aW9uUm93MiA9IG5ldyBPcGVuQ2xvc2VTZWN0aW9uKCk7XG5cdFx0XHRcdFx0dGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoc2VjdGlvblJvdzIpXG5cdFx0XHRcdFx0c2VjdGlvblJvdzIucmVmcmVzaCh0aGlzLmV4dHJhY3RIdW1hblJlYWRhYmxlTmFtZShsaXN0W2syXS5yZWNvcmRfanNvbnBhdGgsIGxpc3RbazJdLnJlY29yZF9qc29uKSwgJycgKyBsaXN0W2syXS5ucl9jaGVja19uYW1lcyArICcgY2hlY2sgZmFpbGVkJylcblx0XHRcdFx0XHRzZWN0aW9uUm93Mi5vbmNsaWNrID0gYXN5bmMgKCkgPT4ge1xuXHRcdFx0XHRcdFx0Y29uc3QganNvbjIgPSBhd2FpdCBBUEkzLmxpc3RfX2NhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfcmVjb3JkX2NoZWNrX2ZhaWxlZCh7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHNlc3Npb25fc3RhcnRfdHM6IHBfc2Vzc2lvbl9zdGFydF90cyxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YXNldF9uYW1lOiBwX2RhdGFzZXRfbmFtZSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2hlY2tfY2F0ZWdvcnk6IHBfY2F0ZWdvcnlfbmFtZSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVjb3JkX2pzb25wYXRoOiBsaXN0W2syXS5yZWNvcmRfanNvbnBhdGhcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0Zm9yIChsZXQgayA9IDA7IGsgPCBqc29uMi5sZW5ndGg7IGsrKylcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y29uc3Qgc2VjdGlvblJvdyA9IG5ldyBTZWN0aW9uUm93KCk7XG5cdFx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cyLmFkZEVsZW1lbnRUb0NvbnRlbnRBcmVhKHNlY3Rpb25Sb3cpXG5cdFx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cucmVmcmVzaChqc29uMltrXS5jaGVja19uYW1lKVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZVxuXHRcdFx0e1xuXHRcdFx0XHRmb3IgKGxldCBrID0gMDsgayA8IGtleXMubGVuZ3RoOyBrKyspXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRjb25zdCBzZWN0aW9uUm93ID0gbmV3IE9wZW5DbG9zZVNlY3Rpb24oKTtcblx0XHRcdFx0XHR0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChzZWN0aW9uUm93KVxuXHRcdFx0XHRcdHNlY3Rpb25Sb3cucmVmcmVzaChrZXlzW2tdLCAnJyArIGdyb3VwQnlba2V5c1trXV0ubGVuZ3RoICsgJyByZWNvcmRzJylcblx0XHRcdFx0XHRzZWN0aW9uUm93Lm9uY2xpY2sgPSAoKSA9PiB7XG5cdFx0XHRcdFx0XHRjb25zdCBsaXN0ID0gZ3JvdXBCeVtrZXlzW2tdXVxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2cobGlzdClcblx0XHRcdFx0XHRcdGZvciAobGV0IGsyID0gMDsgazIgPCBsaXN0Lmxlbmd0aDsgazIrKylcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y29uc3Qgc2VjdGlvblJvdzIgPSBuZXcgT3BlbkNsb3NlU2VjdGlvbigpO1xuXHRcdFx0XHRcdFx0XHRzZWN0aW9uUm93LmFkZEVsZW1lbnRUb0NvbnRlbnRBcmVhKHNlY3Rpb25Sb3cyKVxuXHRcdFx0XHRcdFx0XHRzZWN0aW9uUm93Mi5yZWZyZXNoKHRoaXMuZXh0cmFjdEh1bWFuUmVhZGFibGVOYW1lKGxpc3RbazJdLnJlY29yZF9qc29ucGF0aCwgbGlzdFtrMl0ucmVjb3JkX2pzb24pLCBsaXN0W2syXS5ucl9jaGVja19uYW1lcylcblx0XHRcdFx0XHRcdFx0c2VjdGlvblJvdzIub25jbGljayA9IGFzeW5jIChlKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKVxuXHRcdFx0XHRcdFx0XHRcdGNvbnN0IGpzb24yID0gYXdhaXQgQVBJMy5saXN0X19jYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X3JlY29yZF9jaGVja19mYWlsZWQoe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c2Vzc2lvbl9zdGFydF90czogcF9zZXNzaW9uX3N0YXJ0X3RzLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YXNldF9uYW1lOiBwX2RhdGFzZXRfbmFtZSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNoZWNrX2NhdGVnb3J5OiBwX2NhdGVnb3J5X25hbWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZWNvcmRfanNvbnBhdGg6IGxpc3RbazJdLnJlY29yZF9qc29ucGF0aFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBrID0gMDsgayA8IGpzb24yLmxlbmd0aDsgaysrKVxuXHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IHNlY3Rpb25Sb3cgPSBuZXcgU2VjdGlvblJvdygpO1xuXHRcdFx0XHRcdFx0XHRcdFx0c2VjdGlvblJvdzIuYWRkRWxlbWVudFRvQ29udGVudEFyZWEoc2VjdGlvblJvdylcblx0XHRcdFx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cucmVmcmVzaChqc29uMltrXS5jaGVja19uYW1lKVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ2NzLWRhdGFzZXQtaXNzdWVzLWRldGFpbCcsIERhdGFzZXRJc3N1ZXNEZXRhaWwpXG4iXX0=