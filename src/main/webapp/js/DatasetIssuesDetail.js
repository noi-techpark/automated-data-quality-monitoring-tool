/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */
import { cs_cast } from "./quality.js";
import { API3 } from './api/api3.js';
import { OpenCloseSection } from "./OpenCloseSection.js";
import { SectionRow } from "./SectionRow.js";
import { Loader } from "./Loader.js";
import { DatasetIssueCategoryComponent } from "./DatasetIssueCategory.js";
import { GeneralInfoAndSettings } from "./GeneralInfoAndSettings.js";
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
    issues;
    records;
    info_and_settings;
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
					
					.actions {
						border: 1px solid black;
						width: 10rem;
						margin-left: auto;
						display: flex;
						border-radius: 0.4rem;
						margin-bottom: 0.5rem;
					}
					
					.actions span.selected {
						color: white;
						background-color: black;
					}
					
					.actions span {
						flex-grow: 50;
						text-align: center;
						cursor: pointer;
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
					<cs-general-info-and-settings></cs-general-info-and-settings>
				</div>
				<div style="width: calc(100% - 20px)">
					<div style="text-align: right" class="actions">
						<span class="issues">Issues</span>
						<span class="records">Records</span>
					</div>
					<div class="container"></div>
				</div>
				`;
        customElements.upgrade(this.sroot);
        this.container = cs_cast(HTMLDivElement, this.sroot.querySelector('.container'));
        this.issues = cs_cast(HTMLSpanElement, this.sroot.querySelector('.issues'));
        this.records = cs_cast(HTMLSpanElement, this.sroot.querySelector('.records'));
        this.issues.onclick = () => {
            this.current_tab = 'issues';
            if (this.last_session_start_ts != null && this.last_dataset_name != null && this.last_check_category != null
                && this.last_failed_records != null && this.last_tot_records != null)
                this.refresh(this.last_session_start_ts, this.last_dataset_name, this.last_check_category, this.last_failed_records, this.last_tot_records);
        };
        this.records.onclick = () => {
            this.current_tab = 'records';
            if (this.last_session_start_ts != null && this.last_dataset_name != null && this.last_check_category != null
                && this.last_failed_records != null && this.last_tot_records != null)
                this.refresh(this.last_session_start_ts, this.last_dataset_name, this.last_check_category, this.last_failed_records, this.last_tot_records);
        };
        this.canvas = cs_cast(HTMLCanvasElement, this.sroot.querySelector('canvas'));
        this.info_and_settings = cs_cast(GeneralInfoAndSettings, this.sroot.querySelector('cs-general-info-and-settings'));
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
        this.info_and_settings.refresh(p_session_start_ts, p_dataset_name, p_failed_records, p_tot_records);
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
            chartjs.data.datasets = [
                {
                    label: 'fail trend',
                    data: failarr,
                    fill: false,
                    backgroundColor: '#222',
                    borderColor: '#222',
                    tension: 0.1
                },
                {
                    label: 'total trend',
                    data: goodarr,
                    fill: false,
                    backgroundColor: '#aaa',
                    borderColor: '#aaa',
                    tension: 0.1
                },
            ];
            chartjs.update();
        })();
        const category = cs_cast(DatasetIssueCategoryComponent, this.sroot.querySelector('cs-dataset-issue-category'));
        category.hideMoreDiv();
        category.refresh({
            dataset_name: p_dataset_name,
            session_start_ts: p_session_start_ts,
            check_category: p_category_name,
            failed_records: p_failed_records,
            tot_records: p_tot_records
        });
        this.container.textContent = '';
        if (this.current_tab === 'issues') {
            this.records.classList.remove('selected');
            this.issues.classList.add('selected');
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
            this.issues.classList.remove('selected');
            this.records.classList.add('selected');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YXNldElzc3Vlc0RldGFpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3R5cGVzY3JpcHQvRGF0YXNldElzc3Vlc0RldGFpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxPQUFPLEVBQUUsT0FBTyxFQUFZLE1BQU0sY0FBYyxDQUFDO0FBQ2pELE9BQU8sRUFBQyxJQUFJLEVBQTJELE1BQU0sZUFBZSxDQUFDO0FBQzdGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3pELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ3JDLE9BQU8sRUFBRSw2QkFBNkIsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBRTFFLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBRXJFLE1BQU0sT0FBTyxtQkFBb0IsU0FBUSxXQUFXO0lBR25ELFNBQVMsQ0FBQTtJQUVULHFCQUFxQixHQUFnQixJQUFJLENBQUE7SUFDekMsaUJBQWlCLEdBQWdCLElBQUksQ0FBQTtJQUNyQyxtQkFBbUIsR0FBZ0IsSUFBSSxDQUFBO0lBQ3ZDLG1CQUFtQixHQUFnQixJQUFJLENBQUE7SUFDdkMsZ0JBQWdCLEdBQWdCLElBQUksQ0FBQTtJQUVwQyxXQUFXLEdBQXlCLFFBQVEsQ0FBQTtJQUU1QyxLQUFLLENBQUE7SUFFTCxNQUFNLENBQUE7SUFFTixvQkFBb0I7SUFDcEIsZ0RBQWdEO0lBRWhELGVBQWUsQ0FBb0I7SUFDbkMsZUFBZSxDQUFnQjtJQUUvQixNQUFNLENBQWtCO0lBQ3hCLE9BQU8sQ0FBa0I7SUFDdEIsaUJBQWlCLENBQXlCO0lBRTdDLGlCQUFpQjtRQUVoQixtRUFBbUU7UUFDbkUsTUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNw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Q29udGVudCI6WyIvKlxuICogKEMpIDIwMjQgQ2F0Y2ggU29sdmUgZGkgRGF2aWRlIE1vbnRlc2luXG4gKiBMaWNlbnNlOiBBR1BMXG4gKi9cblxuaW1wb3J0IHsgY3NfY2FzdCwgdGhyb3dOUEUgfSBmcm9tIFwiLi9xdWFsaXR5LmpzXCI7XG5pbXBvcnQge0FQSTMsIGNhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfcmVjb3JkX2NoZWNrX2ZhaWxlZF9fcm93fSBmcm9tICcuL2FwaS9hcGkzLmpzJztcbmltcG9ydCB7IE9wZW5DbG9zZVNlY3Rpb24gfSBmcm9tIFwiLi9PcGVuQ2xvc2VTZWN0aW9uLmpzXCI7XG5pbXBvcnQgeyBTZWN0aW9uUm93IH0gZnJvbSBcIi4vU2VjdGlvblJvdy5qc1wiO1xuaW1wb3J0IHsgTG9hZGVyIH0gZnJvbSBcIi4vTG9hZGVyLmpzXCI7XG5pbXBvcnQgeyBEYXRhc2V0SXNzdWVDYXRlZ29yeUNvbXBvbmVudCB9IGZyb20gXCIuL0RhdGFzZXRJc3N1ZUNhdGVnb3J5LmpzXCI7XG5pbXBvcnQgQ2hhcnQgPSByZXF1aXJlKFwiY2hhcnQuanNcIik7XG5pbXBvcnQgeyBHZW5lcmFsSW5mb0FuZFNldHRpbmdzIH0gZnJvbSBcIi4vR2VuZXJhbEluZm9BbmRTZXR0aW5ncy5qc1wiO1xuXG5leHBvcnQgY2xhc3MgRGF0YXNldElzc3Vlc0RldGFpbCBleHRlbmRzIEhUTUxFbGVtZW50XG57XG5cdFxuXHRjb250YWluZXIgXG5cdFxuXHRsYXN0X3Nlc3Npb25fc3RhcnRfdHM6IHN0cmluZ3xudWxsID0gbnVsbFxuXHRsYXN0X2RhdGFzZXRfbmFtZTogc3RyaW5nfG51bGwgPSBudWxsXG5cdGxhc3RfY2hlY2tfY2F0ZWdvcnk6IHN0cmluZ3xudWxsID0gbnVsbFxuXHRsYXN0X2ZhaWxlZF9yZWNvcmRzOiBudW1iZXJ8bnVsbCA9IG51bGxcblx0bGFzdF90b3RfcmVjb3JkczogbnVtYmVyfG51bGwgPSBudWxsXG5cdFxuXHRjdXJyZW50X3RhYjogJ2lzc3VlcycgfCAncmVjb3JkcycgPSAnaXNzdWVzJ1xuXHRcblx0c3Jvb3Rcblx0XG5cdGNhbnZhc1xuXHRcblx0Ly8gY29ubmVjdGVkX3Byb21pc2Vcblx0Ly8gY29ubmVjdGVkX2Z1bmM6IChzOiBudWxsKSA9PiB2b2lkID0gcyA9PiBudWxsXG5cdFxuXHRjaGFydGpzX3N1Y2Nlc3M6IChzOiBDaGFydCkgPT4gdm9pZFxuXHRjaGFydGpzX3Byb21pc2U6IFByb21pc2U8Q2hhcnQ+XG5cblx0aXNzdWVzOiBIVE1MU3BhbkVsZW1lbnQ7XG5cdHJlY29yZHM6IEhUTUxTcGFuRWxlbWVudDtcbiAgICBpbmZvX2FuZF9zZXR0aW5nczogR2VuZXJhbEluZm9BbmRTZXR0aW5ncztcblxuXHRjb25uZWN0ZWRDYWxsYmFjaygpXG5cdHtcblx0XHQvLyBjaGFydGpzIG5lZWQgdG8gYmUgY3JlYXRlZCB3aGVuIGVsZW1lbnQgaXMgYXR0YWNoZWQgaW50byB0aGUgZG9tXG5cdFx0Y29uc3QgY2hhcnQgPSBuZXcgQ2hhcnQodGhpcy5jYW52YXMsIHtcblx0XHRcdHR5cGU6ICdsaW5lJyxcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0bGFiZWxzOiBbJy01JywnLTQnLCctMycsICctMicsICctMSddLFxuXHRcdFx0XHRkYXRhc2V0czogW11cblx0XHRcdH0sXG5cdFx0XHRvcHRpb25zOiB7XG5cdFx0XHRcdHNjYWxlczoge1xuXHRcdFx0XHRcdHk6IHtcblx0XHRcdFx0XHRcdHN0YWNrZWQ6IHRydWUsXG5cdFx0XHRcdFx0XHRiZWdpbkF0WmVybzogdHJ1ZVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdH1cblx0XHR9KTtcblx0XHRcblx0XHR0aGlzLmNoYXJ0anNfc3VjY2VzcyhjaGFydClcblx0fVxuXHRcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKVxuXHRcdHRoaXMuY2hhcnRqc19wcm9taXNlID0gbmV3IFByb21pc2UocyA9PiB0aGlzLmNoYXJ0anNfc3VjY2VzcyA9IHMpXG5cdFx0dGhpcy5zcm9vdCA9IHRoaXMuYXR0YWNoU2hhZG93KHsgbW9kZTogJ29wZW4nIH0pXG5cdFx0dGhpcy5zcm9vdC5pbm5lckhUTUwgPSBgXG5cdFx0XHRcdDxzdHlsZT5cblx0XHRcdFx0XHQ6aG9zdCB7XG5cdFx0XHRcdFx0XHRwYWRkaW5nOiAwLjVyZW07XG5cdFx0XHRcdFx0XHRkaXNwbGF5OiBibG9jaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0LmNvbnRhaW5lciB7XG5cdFx0XHRcdFx0XHRib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xuXHRcdFx0XHRcdFx0Ym9yZGVyLXJhZGl1czogMC4zcmVtO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcblx0XHRcdFx0XHQuY29udGFpbmVyID4gKiB7XG5cdFx0XHRcdFx0XHRib3JkZXItYm90dG9tOiAxcHggc29saWQgI2NjYztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0LmhlYWRlciB7XG5cdFx0XHRcdFx0XHRkaXNwbGF5OiBmbGV4O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQuaGVhZGVyIC5jaGFydCB7XG5cdFx0XHRcdFx0XHR3aWR0aDogNTAlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcblx0XHRcdFx0XHQuYWN0aW9ucyB7XG5cdFx0XHRcdFx0XHRib3JkZXI6IDFweCBzb2xpZCBibGFjaztcblx0XHRcdFx0XHRcdHdpZHRoOiAxMHJlbTtcblx0XHRcdFx0XHRcdG1hcmdpbi1sZWZ0OiBhdXRvO1xuXHRcdFx0XHRcdFx0ZGlzcGxheTogZmxleDtcblx0XHRcdFx0XHRcdGJvcmRlci1yYWRpdXM6IDAuNHJlbTtcblx0XHRcdFx0XHRcdG1hcmdpbi1ib3R0b206IDAuNXJlbTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0LmFjdGlvbnMgc3Bhbi5zZWxlY3RlZCB7XG5cdFx0XHRcdFx0XHRjb2xvcjogd2hpdGU7XG5cdFx0XHRcdFx0XHRiYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0LmFjdGlvbnMgc3BhbiB7XG5cdFx0XHRcdFx0XHRmbGV4LWdyb3c6IDUwO1xuXHRcdFx0XHRcdFx0dGV4dC1hbGlnbjogY2VudGVyO1xuXHRcdFx0XHRcdFx0Y3Vyc29yOiBwb2ludGVyO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcblx0XHRcdFx0PC9zdHlsZT5cblx0XHRcdFx0PCEtLSA8aW1nIHNyYz1cImtwaS1kZXRhaWwucG5nXCIgc3R5bGU9XCJtYXgtd2lkdGg6IDEwMCVcIj4gLS0+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJoZWFkZXJcIj5cblx0XHRcdFx0XHQ8ZGl2PlxuXHRcdFx0XHRcdFx0PGNzLWRhdGFzZXQtaXNzdWUtY2F0ZWdvcnk+PC9jcy1kYXRhc2V0LWlzc3VlLWNhdGVnb3J5PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjaGFydFwiPlxuXHRcdFx0XHRcdFx0PGNhbnZhcz48L2NhbnZhcz5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8Y3MtZ2VuZXJhbC1pbmZvLWFuZC1zZXR0aW5ncz48L2NzLWdlbmVyYWwtaW5mby1hbmQtc2V0dGluZ3M+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8ZGl2IHN0eWxlPVwid2lkdGg6IGNhbGMoMTAwJSAtIDIwcHgpXCI+XG5cdFx0XHRcdFx0PGRpdiBzdHlsZT1cInRleHQtYWxpZ246IHJpZ2h0XCIgY2xhc3M9XCJhY3Rpb25zXCI+XG5cdFx0XHRcdFx0XHQ8c3BhbiBjbGFzcz1cImlzc3Vlc1wiPklzc3Vlczwvc3Bhbj5cblx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzPVwicmVjb3Jkc1wiPlJlY29yZHM8L3NwYW4+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPjwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0YFxuXG5cdFx0Y3VzdG9tRWxlbWVudHMudXBncmFkZSh0aGlzLnNyb290KVxuXG5cdFx0dGhpcy5jb250YWluZXIgPSBjc19jYXN0KEhUTUxEaXZFbGVtZW50LCB0aGlzLnNyb290LnF1ZXJ5U2VsZWN0b3IoJy5jb250YWluZXInKSlcblx0XHRcblx0XHR0aGlzLmlzc3VlcyA9IGNzX2Nhc3QoSFRNTFNwYW5FbGVtZW50LCB0aGlzLnNyb290LnF1ZXJ5U2VsZWN0b3IoJy5pc3N1ZXMnKSlcblx0XHR0aGlzLnJlY29yZHMgPSBjc19jYXN0KEhUTUxTcGFuRWxlbWVudCwgdGhpcy5zcm9vdC5xdWVyeVNlbGVjdG9yKCcucmVjb3JkcycpKVxuXHRcdFxuXHRcdHRoaXMuaXNzdWVzLm9uY2xpY2sgPSAoKSA9PiB7XG5cdFx0XHR0aGlzLmN1cnJlbnRfdGFiID0gJ2lzc3Vlcydcblx0XHRcdGlmICh0aGlzLmxhc3Rfc2Vzc2lvbl9zdGFydF90cyAhPSBudWxsICYmIHRoaXMubGFzdF9kYXRhc2V0X25hbWUgIT0gbnVsbCAmJiB0aGlzLmxhc3RfY2hlY2tfY2F0ZWdvcnkgIT0gbnVsbFxuXHRcdFx0XHQmJiB0aGlzLmxhc3RfZmFpbGVkX3JlY29yZHMgIT0gbnVsbCAmJiB0aGlzLmxhc3RfdG90X3JlY29yZHMgIT0gbnVsbClcblx0XHRcdFx0dGhpcy5yZWZyZXNoKHRoaXMubGFzdF9zZXNzaW9uX3N0YXJ0X3RzLCB0aGlzLmxhc3RfZGF0YXNldF9uYW1lLCB0aGlzLmxhc3RfY2hlY2tfY2F0ZWdvcnksIHRoaXMubGFzdF9mYWlsZWRfcmVjb3JkcywgdGhpcy5sYXN0X3RvdF9yZWNvcmRzKVxuXHRcdH1cblx0XHRcblx0XHR0aGlzLnJlY29yZHMub25jbGljayA9ICgpID0+IHtcblx0XHRcdHRoaXMuY3VycmVudF90YWIgPSAncmVjb3Jkcydcblx0XHRcdGlmICh0aGlzLmxhc3Rfc2Vzc2lvbl9zdGFydF90cyAhPSBudWxsICYmIHRoaXMubGFzdF9kYXRhc2V0X25hbWUgIT0gbnVsbCAmJiB0aGlzLmxhc3RfY2hlY2tfY2F0ZWdvcnkgIT0gbnVsbFxuXHRcdFx0XHQmJiB0aGlzLmxhc3RfZmFpbGVkX3JlY29yZHMgIT0gbnVsbCAmJiB0aGlzLmxhc3RfdG90X3JlY29yZHMgIT0gbnVsbClcblx0XHRcdFx0dGhpcy5yZWZyZXNoKHRoaXMubGFzdF9zZXNzaW9uX3N0YXJ0X3RzLCB0aGlzLmxhc3RfZGF0YXNldF9uYW1lLCB0aGlzLmxhc3RfY2hlY2tfY2F0ZWdvcnksIHRoaXMubGFzdF9mYWlsZWRfcmVjb3JkcywgdGhpcy5sYXN0X3RvdF9yZWNvcmRzKVxuXHRcdH1cblx0XHRcblx0XHR0aGlzLmNhbnZhcyA9IGNzX2Nhc3QoSFRNTENhbnZhc0VsZW1lbnQsIHRoaXMuc3Jvb3QucXVlcnlTZWxlY3RvcignY2FudmFzJykpO1xuXHRcdFxuXHRcdHRoaXMuaW5mb19hbmRfc2V0dGluZ3MgPSBjc19jYXN0KEdlbmVyYWxJbmZvQW5kU2V0dGluZ3MsIHRoaXMuc3Jvb3QucXVlcnlTZWxlY3RvcignY3MtZ2VuZXJhbC1pbmZvLWFuZC1zZXR0aW5ncycpKTtcblxuXG5cdH1cblx0XG5cdGV4dHJhY3RIdW1hblJlYWRhYmxlTmFtZShyZWNvcmRfanNvbnBhdGg6IHN0cmluZywganNvbjogc3RyaW5nKTogc3RyaW5nXG5cdHtcblx0XHRsZXQgcmV0ID0gJyc7XG5cdFx0Zm9yIChsZXQgZm4gb2YgWydtdmFsaWR0aW1lJywgJ212YWx1ZScsICdBY2NvRGV0YWlsLmRlLk5hbWUnLCAnRGV0YWlsLmRlLlRpdGxlJ10pXG5cdFx0e1xuXHRcdFx0Y29uc3QgZm5fcGFydHMgPSBmbi5zcGxpdCgnLicpXG5cdFx0XHRsZXQgdmFsID0gSlNPTi5wYXJzZShqc29uKVxuXHRcdFx0Zm9yIChsZXQgcCBvZiBmbl9wYXJ0cylcblx0XHRcdHtcblx0XHRcdFx0dmFsID0gdmFsW3BdXG5cdFx0XHRcdGlmICh2YWwgPT09IHVuZGVmaW5lZClcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdC8vIGNvbnN0IHZhbCA9IHN0YXJ0W2ZuXSBcblx0XHRcdGlmICh2YWwgIT09IHVuZGVmaW5lZClcblx0XHRcdFx0cmV0ICs9IChyZXQgPT09ICcnID8gJycgOiAnLCAnKSArIGZuICsgJz0nICsgSlNPTi5zdHJpbmdpZnkodmFsKVxuXHRcdH1cblx0XHRpZiAocmV0ID09ICcnKVxuXHRcdFx0cmV0ID0gcmVjb3JkX2pzb25wYXRoXG5cdFx0cmV0dXJuIHJldDtcblx0fVxuXHRcblx0Z3JvdXBSZWNvcmRzKGxpc3Q6IHtyZWNvcmRfanNvbjogc3RyaW5nfVtdKToge1trOnN0cmluZ106IGFueVtdfVxuXHR7XG5cdFx0Y29uc3QgZ3JvdXBCeToge1trOnN0cmluZ106IGFueVtdfSA9IHt9XG5cdFx0Zm9yIChsZXQgayA9IDA7IGsgPCBsaXN0Lmxlbmd0aDsgaysrKVxuXHRcdHtcblx0XHRcdGNvbnN0IGpzb24gPSBKU09OLnBhcnNlKGxpc3Rba10ucmVjb3JkX2pzb24pO1xuXHRcdFx0bGV0IHNuYW1lID0ganNvblsnc25hbWUnXTtcblx0XHRcdGlmICh0eXBlb2Ygc25hbWUgIT09ICdzdHJpbmcnKVxuXHRcdFx0XHRzbmFtZSA9ICcnXG5cdFx0XHRsZXQgcHJldl9hcnIgPSBncm91cEJ5W3NuYW1lXVxuXHRcdFx0cHJldl9hcnIgPSBwcmV2X2FyciA9PT0gdW5kZWZpbmVkID8gW10gOiBwcmV2X2FyclxuXHRcdFx0cHJldl9hcnIucHVzaChsaXN0W2tdKVxuXHRcdFx0Z3JvdXBCeVtzbmFtZV0gPSBwcmV2X2FyclxuXHRcdH1cblx0XHRyZXR1cm4gZ3JvdXBCeTsgXG5cdH1cblx0XG5cdGFzeW5jIHJlZnJlc2gocF9zZXNzaW9uX3N0YXJ0X3RzOiBzdHJpbmcsIHBfZGF0YXNldF9uYW1lOiBzdHJpbmcsIHBfY2F0ZWdvcnlfbmFtZTogc3RyaW5nLCBwX2ZhaWxlZF9yZWNvcmRzOiBudW1iZXIsIHBfdG90X3JlY29yZHM6IG51bWJlcikge1xuXHRcdFxuXHRcdHRoaXMubGFzdF9zZXNzaW9uX3N0YXJ0X3RzID0gcF9zZXNzaW9uX3N0YXJ0X3RzXG5cdFx0dGhpcy5sYXN0X2RhdGFzZXRfbmFtZSA9IHBfZGF0YXNldF9uYW1lXG5cdFx0dGhpcy5sYXN0X2NoZWNrX2NhdGVnb3J5ID0gcF9jYXRlZ29yeV9uYW1lXG5cdFx0dGhpcy5sYXN0X2ZhaWxlZF9yZWNvcmRzID0gcF9mYWlsZWRfcmVjb3Jkc1xuXHRcdHRoaXMubGFzdF90b3RfcmVjb3JkcyA9IHBfdG90X3JlY29yZHNcblx0XHRcblx0XHR0aGlzLmluZm9fYW5kX3NldHRpbmdzLnJlZnJlc2gocF9zZXNzaW9uX3N0YXJ0X3RzLCBwX2RhdGFzZXRfbmFtZSwgcF9mYWlsZWRfcmVjb3JkcywgcF90b3RfcmVjb3Jkcylcblx0XHRcblx0XHRjb25zb2xlLmxvZyhwX3Nlc3Npb25fc3RhcnRfdHMpXG5cdFx0Y29uc29sZS5sb2cocF9kYXRhc2V0X25hbWUpXG5cdFx0Y29uc29sZS5sb2cocF9jYXRlZ29yeV9uYW1lKTtcblx0XHRcblx0XHQoYXN5bmMgKCkgPT4ge1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGNvbnN0IGRhdGEgPSBhd2FpdCBBUEkzLmxpc3RfX2NhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfaGlzdG9yeV92dyh7XG5cdFx0XHRcdFx0XHRkYXRhc2V0X25hbWU6IHRoaXMubGFzdF9kYXRhc2V0X25hbWUhLFxuXHRcdFx0XHRcdFx0Y2hlY2tfY2F0ZWdvcnk6IHRoaXMubGFzdF9jaGVja19jYXRlZ29yeSFcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGNvbnN0IGdvb2RhcnIgPSBbXVxuXHRcdFx0XHRcdGNvbnN0IGZhaWxhcnIgPSBbXVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGZvciAobGV0IHggPSAwOyB4IDwgZGF0YS5sZW5ndGg7IHgrKylcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRnb29kYXJyLnB1c2goZGF0YVt4XS50ZXN0ZWRfcmVjb3JkcyAtIGRhdGFbeF0uZmFpbGVkX3JlY3MpXG5cdFx0XHRcdFx0XHRmYWlsYXJyLnB1c2goZGF0YVt4XS5mYWlsZWRfcmVjcylcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coZ29vZGFycilcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhmYWlsYXJyKVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGRhdGEpXG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0Y29uc3QgY2hhcnRqcyA9IGF3YWl0IHRoaXMuY2hhcnRqc19wcm9taXNlXG5cdFx0XHRcdFx0Y2hhcnRqcy5kYXRhLmRhdGFzZXRzID0gW1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsYWJlbDogJ2ZhaWwgdHJlbmQnLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhOiBmYWlsYXJyLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmaWxsOiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiAnIzIyMicsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGJvcmRlckNvbG9yOiAnIzIyMicsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRlbnNpb246IDAuMVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGFiZWw6ICd0b3RhbCB0cmVuZCcsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGE6IGdvb2RhcnIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZpbGw6IGZhbHNlLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6ICcjYWFhJyxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ym9yZGVyQ29sb3I6ICcjYWFhJyxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGVuc2lvbjogMC4xXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9LFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdF1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRjaGFydGpzLnVwZGF0ZSgpXG5cdFx0XHRcdFx0XHRcdFx0XHRcblx0XHR9KSgpO1xuXHRcdFxuXHRcdGNvbnN0IGNhdGVnb3J5ID0gY3NfY2FzdChEYXRhc2V0SXNzdWVDYXRlZ29yeUNvbXBvbmVudCwgdGhpcy5zcm9vdC5xdWVyeVNlbGVjdG9yKCdjcy1kYXRhc2V0LWlzc3VlLWNhdGVnb3J5JykpXG5cdFx0Y2F0ZWdvcnkuaGlkZU1vcmVEaXYoKVxuXHRcdGNhdGVnb3J5LnJlZnJlc2goXG5cdFx0e1xuXHRcdFx0ZGF0YXNldF9uYW1lOiBwX2RhdGFzZXRfbmFtZSxcblx0XHRcdHNlc3Npb25fc3RhcnRfdHM6IHBfc2Vzc2lvbl9zdGFydF90cyxcblx0XHRcdGNoZWNrX2NhdGVnb3J5OiBwX2NhdGVnb3J5X25hbWUsXG5cdFx0XHRmYWlsZWRfcmVjb3JkczogcF9mYWlsZWRfcmVjb3Jkcyxcblx0XHRcdHRvdF9yZWNvcmRzOiBwX3RvdF9yZWNvcmRzXG5cdFx0fSlcblx0XHRcblx0XHR0aGlzLmNvbnRhaW5lci50ZXh0Q29udGVudCA9ICcnXG5cdFx0XG5cdFx0aWYgKHRoaXMuY3VycmVudF90YWIgPT09ICdpc3N1ZXMnKVxuXHRcdHtcblx0XHRcdHRoaXMucmVjb3Jkcy5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpXG5cdFx0XHR0aGlzLmlzc3Vlcy5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpXG5cdFx0XHRcblx0XHRcdGNvbnN0IGxvYWRlciA9IG5ldyBMb2FkZXIoKTtcblx0XHRcdHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKGxvYWRlcilcblx0XHRcblx0XHRcdGNvbnN0IGpzb24gPSBhd2FpdCBBUEkzLmxpc3RfX2NhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfY2hlY2tfY2F0ZWdvcnlfY2hlY2tfbmFtZV9yZWNvcmRfcmVjb3JkX2ZhaWxlZF92dyh7XG5cdFx0XHRcdHNlc3Npb25fc3RhcnRfdHM6IHBfc2Vzc2lvbl9zdGFydF90cyxcblx0XHRcdFx0ZGF0YXNldF9uYW1lOiBwX2RhdGFzZXRfbmFtZSxcblx0XHRcdFx0Y2hlY2tfY2F0ZWdvcnk6IHBfY2F0ZWdvcnlfbmFtZVxuXHRcdFx0fSlcblxuXHRcdFx0bG9hZGVyLnJlbW92ZSgpO1xuXHRcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwganNvbi5sZW5ndGg7IGkrKylcblx0XHRcdHtcblx0XHRcdFx0Y29uc3QgaXNzdWUgPSBqc29uW2ldXG5cdFx0XHRcdC8vIGNvbnNvbGUubG9nKGlzc3VlKVxuXHRcdFx0XHRjb25zdCBzZWN0aW9uID0gbmV3IE9wZW5DbG9zZVNlY3Rpb24oKVxuXHRcdFx0XHRzZWN0aW9uLnJlZnJlc2goaXNzdWUuY2hlY2tfbmFtZSwgJycgKyBpc3N1ZS5ucl9yZWNvcmRzICsgJyByZWNvcmRzJylcblx0XHRcdFx0dGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoc2VjdGlvbilcblx0XHRcdFx0XG5cdFx0XHRcdHNlY3Rpb24ub25vcGVuID0gYXN5bmMgKCkgPT4ge1xuXHRcdFx0XHRcdC8vY29uc29sZS5sb2coJ3NlemlvbmUgYXBlcnRhLCByaWNhcmljbyEnKVxuXHRcdFx0XHRcdGNvbnN0IGpzb24yID0gYXdhaXQgQVBJMy5saXN0X19jYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X3JlY29yZF9jaGVja19mYWlsZWQoe1xuXHRcdFx0XHRcdFx0XHRcdHNlc3Npb25fc3RhcnRfdHM6IHBfc2Vzc2lvbl9zdGFydF90cyxcblx0XHRcdFx0XHRcdFx0XHRkYXRhc2V0X25hbWU6IHBfZGF0YXNldF9uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdGNoZWNrX2NhdGVnb3J5OiBwX2NhdGVnb3J5X25hbWUsXG5cdFx0XHRcdFx0XHRcdFx0Y2hlY2tfbmFtZTogaXNzdWUuY2hlY2tfbmFtZVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdGNvbnN0IGdyb3VwQnkgPSB0aGlzLmdyb3VwUmVjb3Jkcyhqc29uMilcblx0XHRcdFx0XHRjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoZ3JvdXBCeSlcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhrZXlzKVxuXHRcdFx0XHRcdGlmIChrZXlzLmxlbmd0aCA9PSAxICYmIGtleXNbMF0gPT0gJycpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Y29uc3QgbGlzdCA9IGdyb3VwQnlba2V5c1swXV1cblx0XHRcdFx0XHRcdGZvciAobGV0IGsyID0gMDsgazIgPCBsaXN0Lmxlbmd0aDsgazIrKylcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y29uc3Qgc2VjdGlvblJvdzIgPSBuZXcgU2VjdGlvblJvdygpO1xuXHRcdFx0XHRcdFx0XHRzZWN0aW9uLmFkZEVsZW1lbnRUb0NvbnRlbnRBcmVhKHNlY3Rpb25Sb3cyKVxuXHRcdFx0XHRcdFx0XHRzZWN0aW9uUm93Mi5yZWZyZXNoKHRoaXMuZXh0cmFjdEh1bWFuUmVhZGFibGVOYW1lKGxpc3RbazJdLnJlY29yZF9qc29ucGF0aCwgbGlzdFtrMl0ucmVjb3JkX2pzb24pKVxuXHRcdFx0XHRcdFx0XHRzZWN0aW9uUm93Mi5vbmNsaWNrID0gKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdGFsZXJ0KGxpc3RbazJdLnJlY29yZF9qc29uKVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRmb3IgKGxldCBrID0gMDsgayA8IGtleXMubGVuZ3RoOyBrKyspXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IHNlY3Rpb25Sb3cgPSBuZXcgT3BlbkNsb3NlU2VjdGlvbigpO1xuXHRcdFx0XHRcdFx0XHRzZWN0aW9uLmFkZEVsZW1lbnRUb0NvbnRlbnRBcmVhKHNlY3Rpb25Sb3cpXG5cdFx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cucmVmcmVzaChrZXlzW2tdLCAnJyArIGdyb3VwQnlba2V5c1trXV0ubGVuZ3RoICsgJyByZWNvcmRzJylcblx0XHRcdFx0XHRcdFx0c2VjdGlvblJvdy5vbmNsaWNrID0gKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdGNvbnN0IGxpc3QgPSBncm91cEJ5W2tleXNba11dXG5cdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2cobGlzdClcblx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBrMiA9IDA7IGsyIDwgbGlzdC5sZW5ndGg7IGsyKyspXG5cdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0Y29uc3Qgc2VjdGlvblJvdzIgPSBuZXcgU2VjdGlvblJvdygpO1xuXHRcdFx0XHRcdFx0XHRcdFx0c2VjdGlvblJvdy5hZGRFbGVtZW50VG9Db250ZW50QXJlYShzZWN0aW9uUm93Milcblx0XHRcdFx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cyLnJlZnJlc2godGhpcy5leHRyYWN0SHVtYW5SZWFkYWJsZU5hbWUobGlzdFtrMl0ucmVjb3JkX2pzb25wYXRoLCBsaXN0W2syXS5yZWNvcmRfanNvbikpXG5cdFx0XHRcdFx0XHRcdFx0XHRzZWN0aW9uUm93Mi5vbmNsaWNrID0gKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRhbGVydChsaXN0W2syXS5yZWNvcmRfanNvbilcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdFx0XHRcblx0XHR9XG5cdFx0XG5cdFx0XG5cdFx0aWYgKHRoaXMuY3VycmVudF90YWIgPT09ICdyZWNvcmRzJylcblx0XHR7XG5cdFx0XHR0aGlzLmlzc3Vlcy5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpXG5cdFx0XHR0aGlzLnJlY29yZHMuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKVxuXHRcdFx0XG5cdFx0XHRjb25zdCBsb2FkZXIgPSBuZXcgTG9hZGVyKCk7XG5cdFx0XHR0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChsb2FkZXIpXG5cblx0XHRcdGNvbnN0IGpzb24gPSBhd2FpdCBBUEkzLmxpc3RfX2NhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfY2hlY2tfY2F0ZWdvcnlfcmVjb3JkX2pzb25wYXRoX2ZhaWxlZF92dyh7XG5cdFx0XHRcdHNlc3Npb25fc3RhcnRfdHM6IHBfc2Vzc2lvbl9zdGFydF90cyxcblx0XHRcdFx0ZGF0YXNldF9uYW1lOiBwX2RhdGFzZXRfbmFtZSxcblx0XHRcdFx0Y2hlY2tfY2F0ZWdvcnk6IHBfY2F0ZWdvcnlfbmFtZVxuXHRcdFx0fSk7XG5cdFx0XHRcblx0XHRcdGxvYWRlci5yZW1vdmUoKTtcblxuXHRcdFx0Y29uc3QgZ3JvdXBCeSA9IHRoaXMuZ3JvdXBSZWNvcmRzKGpzb24pXG5cdFx0XHRjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoZ3JvdXBCeSlcblx0XHRcdGNvbnNvbGUubG9nKGtleXMpXG5cdFx0XHRpZiAoa2V5cy5sZW5ndGggPT0gMSAmJiBrZXlzWzBdID09ICcnKVxuXHRcdFx0e1xuXHRcdFx0XHRjb25zdCBsaXN0ID0gZ3JvdXBCeVtrZXlzWzBdXVxuXHRcdFx0XHRmb3IgKGxldCBrMiA9IDA7IGsyIDwgbGlzdC5sZW5ndGg7IGsyKyspXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRjb25zdCBzZWN0aW9uUm93MiA9IG5ldyBPcGVuQ2xvc2VTZWN0aW9uKCk7XG5cdFx0XHRcdFx0dGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoc2VjdGlvblJvdzIpXG5cdFx0XHRcdFx0c2VjdGlvblJvdzIucmVmcmVzaCh0aGlzLmV4dHJhY3RIdW1hblJlYWRhYmxlTmFtZShsaXN0W2syXS5yZWNvcmRfanNvbnBhdGgsIGxpc3RbazJdLnJlY29yZF9qc29uKSwgJycgKyBsaXN0W2syXS5ucl9jaGVja19uYW1lcyArICcgY2hlY2sgZmFpbGVkJylcblx0XHRcdFx0XHRzZWN0aW9uUm93Mi5vbmNsaWNrID0gYXN5bmMgKCkgPT4ge1xuXHRcdFx0XHRcdFx0Y29uc3QganNvbjIgPSBhd2FpdCBBUEkzLmxpc3RfX2NhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfcmVjb3JkX2NoZWNrX2ZhaWxlZCh7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHNlc3Npb25fc3RhcnRfdHM6IHBfc2Vzc2lvbl9zdGFydF90cyxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YXNldF9uYW1lOiBwX2RhdGFzZXRfbmFtZSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2hlY2tfY2F0ZWdvcnk6IHBfY2F0ZWdvcnlfbmFtZSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVjb3JkX2pzb25wYXRoOiBsaXN0W2syXS5yZWNvcmRfanNvbnBhdGhcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0Zm9yIChsZXQgayA9IDA7IGsgPCBqc29uMi5sZW5ndGg7IGsrKylcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y29uc3Qgc2VjdGlvblJvdyA9IG5ldyBTZWN0aW9uUm93KCk7XG5cdFx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cyLmFkZEVsZW1lbnRUb0NvbnRlbnRBcmVhKHNlY3Rpb25Sb3cpXG5cdFx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cucmVmcmVzaChqc29uMltrXS5jaGVja19uYW1lKVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZVxuXHRcdFx0e1xuXHRcdFx0XHRmb3IgKGxldCBrID0gMDsgayA8IGtleXMubGVuZ3RoOyBrKyspXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRjb25zdCBzZWN0aW9uUm93ID0gbmV3IE9wZW5DbG9zZVNlY3Rpb24oKTtcblx0XHRcdFx0XHR0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChzZWN0aW9uUm93KVxuXHRcdFx0XHRcdHNlY3Rpb25Sb3cucmVmcmVzaChrZXlzW2tdLCAnJyArIGdyb3VwQnlba2V5c1trXV0ubGVuZ3RoICsgJyByZWNvcmRzJylcblx0XHRcdFx0XHRzZWN0aW9uUm93Lm9uY2xpY2sgPSAoKSA9PiB7XG5cdFx0XHRcdFx0XHRjb25zdCBsaXN0ID0gZ3JvdXBCeVtrZXlzW2tdXVxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2cobGlzdClcblx0XHRcdFx0XHRcdGZvciAobGV0IGsyID0gMDsgazIgPCBsaXN0Lmxlbmd0aDsgazIrKylcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y29uc3Qgc2VjdGlvblJvdzIgPSBuZXcgT3BlbkNsb3NlU2VjdGlvbigpO1xuXHRcdFx0XHRcdFx0XHRzZWN0aW9uUm93LmFkZEVsZW1lbnRUb0NvbnRlbnRBcmVhKHNlY3Rpb25Sb3cyKVxuXHRcdFx0XHRcdFx0XHRzZWN0aW9uUm93Mi5yZWZyZXNoKHRoaXMuZXh0cmFjdEh1bWFuUmVhZGFibGVOYW1lKGxpc3RbazJdLnJlY29yZF9qc29ucGF0aCwgbGlzdFtrMl0ucmVjb3JkX2pzb24pLCBsaXN0W2syXS5ucl9jaGVja19uYW1lcylcblx0XHRcdFx0XHRcdFx0c2VjdGlvblJvdzIub25jbGljayA9IGFzeW5jIChlKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKVxuXHRcdFx0XHRcdFx0XHRcdGNvbnN0IGpzb24yID0gYXdhaXQgQVBJMy5saXN0X19jYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X3JlY29yZF9jaGVja19mYWlsZWQoe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c2Vzc2lvbl9zdGFydF90czogcF9zZXNzaW9uX3N0YXJ0X3RzLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YXNldF9uYW1lOiBwX2RhdGFzZXRfbmFtZSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNoZWNrX2NhdGVnb3J5OiBwX2NhdGVnb3J5X25hbWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZWNvcmRfanNvbnBhdGg6IGxpc3RbazJdLnJlY29yZF9qc29ucGF0aFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBrID0gMDsgayA8IGpzb24yLmxlbmd0aDsgaysrKVxuXHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IHNlY3Rpb25Sb3cgPSBuZXcgU2VjdGlvblJvdygpO1xuXHRcdFx0XHRcdFx0XHRcdFx0c2VjdGlvblJvdzIuYWRkRWxlbWVudFRvQ29udGVudEFyZWEoc2VjdGlvblJvdylcblx0XHRcdFx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cucmVmcmVzaChqc29uMltrXS5jaGVja19uYW1lKVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ2NzLWRhdGFzZXQtaXNzdWVzLWRldGFpbCcsIERhdGFzZXRJc3N1ZXNEZXRhaWwpXG4iXX0=