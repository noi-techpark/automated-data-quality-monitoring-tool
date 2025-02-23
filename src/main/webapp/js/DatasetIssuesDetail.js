/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */
import { cs_cast } from "./quality.js";
import { API3 } from './api/api3.js';
import { OpenCloseSection } from "./OpenCloseSection.js";
import { SectionRow } from "./SectionRow.js";
import { Loader } from "./Loader.js";
import { DatasetIssueCategoryComponent } from "./DatasetIssueCategoryComponent.js";
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
        this.chartjs_success = (s) => { }; // dummy initialization, next line will init chartjs_success but compiler don't understand this!
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
            const labels = [];
            for (let x = 0; x < data.length; x++) {
                goodarr.push(data[x].tested_records - data[x].failed_recs);
                failarr.push(data[x].failed_recs);
                labels.push(data[x].session_start_ts.slice(0, 16).replace('T', ' '));
            }
            console.log(goodarr);
            console.log(failarr);
            console.log(data);
            const chartjs = await this.chartjs_promise;
            chartjs.data.labels = labels;
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
                section.refresh('failed: ' + issue.check_name, '' + issue.nr_records + ' records');
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
                            // sectionRow2.refresh(this.extractHumanReadableName(list[k2].record_jsonpath, list[k2].record_json))
                            sectionRow2.refresh(list[k2].problem_hint);
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
                                    // sectionRow2.refresh(this.extractHumanReadableName(list[k2].record_jsonpath, list[k2].record_json))
                                    sectionRow2.refresh(list[k2].problem_hint);
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
                            sectionRow.refresh("failed: " + json2[k].check_name);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YXNldElzc3Vlc0RldGFpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3R5cGVzY3JpcHQvRGF0YXNldElzc3Vlc0RldGFpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxPQUFPLEVBQUUsT0FBTyxFQUFZLE1BQU0sY0FBYyxDQUFDO0FBQ2pELE9BQU8sRUFBQyxJQUFJLEVBQTJELE1BQU0sZUFBZSxDQUFDO0FBQzdGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3pELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ3JDLE9BQU8sRUFBRSw2QkFBNkIsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBQ25GLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBRXJFLE1BQU0sT0FBTyxtQkFBb0IsU0FBUSxXQUFXO0lBR25ELFNBQVMsQ0FBQTtJQUVULHFCQUFxQixHQUFnQixJQUFJLENBQUE7SUFDekMsaUJBQWlCLEdBQWdCLElBQUksQ0FBQTtJQUNyQyxtQkFBbUIsR0FBZ0IsSUFBSSxDQUFBO0lBQ3ZDLG1CQUFtQixHQUFnQixJQUFJLENBQUE7SUFDdkMsZ0JBQWdCLEdBQWdCLElBQUksQ0FBQTtJQUVwQyxXQUFXLEdBQXlCLFFBQVEsQ0FBQTtJQUU1QyxLQUFLLENBQUE7SUFFTCxNQUFNLENBQUE7SUFFTixvQkFBb0I7SUFDcEIsZ0RBQWdEO0lBRWhELGVBQWUsQ0FBb0I7SUFDbkMsZUFBZSxDQUFnQjtJQUUvQixNQUFNLENBQWtCO0lBQ3hCLE9BQU8sQ0FBa0I7SUFDdEIsaUJBQWlCLENBQXlCO0lBRTdDLGlCQUFpQjtRQUVoQixtRUFBbUU7UUFDbkUsTUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNw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QUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFBO2dDQUN4QyxDQUFDOzRCQUVGLENBQUMsQ0FBQTt3QkFDRixDQUFDO29CQUNGLENBQUMsQ0FBQTtnQkFDRixDQUFDO1lBQ0YsQ0FBQztRQUNGLENBQUM7SUFDRixDQUFDO0NBQ0Q7QUFFRCxjQUFjLENBQUMsTUFBTSxDQUFDLDBCQUEwQixFQUFFLG1CQUFtQixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogKEMpIDIwMjQgQ2F0Y2ggU29sdmUgZGkgRGF2aWRlIE1vbnRlc2luXG4gKiBMaWNlbnNlOiBBR1BMXG4gKi9cblxuaW1wb3J0IHsgY3NfY2FzdCwgdGhyb3dOUEUgfSBmcm9tIFwiLi9xdWFsaXR5LmpzXCI7XG5pbXBvcnQge0FQSTMsIGNhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfcmVjb3JkX2NoZWNrX2ZhaWxlZF9fcm93fSBmcm9tICcuL2FwaS9hcGkzLmpzJztcbmltcG9ydCB7IE9wZW5DbG9zZVNlY3Rpb24gfSBmcm9tIFwiLi9PcGVuQ2xvc2VTZWN0aW9uLmpzXCI7XG5pbXBvcnQgeyBTZWN0aW9uUm93IH0gZnJvbSBcIi4vU2VjdGlvblJvdy5qc1wiO1xuaW1wb3J0IHsgTG9hZGVyIH0gZnJvbSBcIi4vTG9hZGVyLmpzXCI7XG5pbXBvcnQgeyBEYXRhc2V0SXNzdWVDYXRlZ29yeUNvbXBvbmVudCB9IGZyb20gXCIuL0RhdGFzZXRJc3N1ZUNhdGVnb3J5Q29tcG9uZW50LmpzXCI7XG5pbXBvcnQgeyBHZW5lcmFsSW5mb0FuZFNldHRpbmdzIH0gZnJvbSBcIi4vR2VuZXJhbEluZm9BbmRTZXR0aW5ncy5qc1wiO1xuXG5leHBvcnQgY2xhc3MgRGF0YXNldElzc3Vlc0RldGFpbCBleHRlbmRzIEhUTUxFbGVtZW50XG57XG5cdFxuXHRjb250YWluZXIgXG5cdFxuXHRsYXN0X3Nlc3Npb25fc3RhcnRfdHM6IHN0cmluZ3xudWxsID0gbnVsbFxuXHRsYXN0X2RhdGFzZXRfbmFtZTogc3RyaW5nfG51bGwgPSBudWxsXG5cdGxhc3RfY2hlY2tfY2F0ZWdvcnk6IHN0cmluZ3xudWxsID0gbnVsbFxuXHRsYXN0X2ZhaWxlZF9yZWNvcmRzOiBudW1iZXJ8bnVsbCA9IG51bGxcblx0bGFzdF90b3RfcmVjb3JkczogbnVtYmVyfG51bGwgPSBudWxsXG5cdFxuXHRjdXJyZW50X3RhYjogJ2lzc3VlcycgfCAncmVjb3JkcycgPSAnaXNzdWVzJ1xuXHRcblx0c3Jvb3Rcblx0XG5cdGNhbnZhc1xuXHRcblx0Ly8gY29ubmVjdGVkX3Byb21pc2Vcblx0Ly8gY29ubmVjdGVkX2Z1bmM6IChzOiBudWxsKSA9PiB2b2lkID0gcyA9PiBudWxsXG5cdFxuXHRjaGFydGpzX3N1Y2Nlc3M6IChzOiBDaGFydCkgPT4gdm9pZFxuXHRjaGFydGpzX3Byb21pc2U6IFByb21pc2U8Q2hhcnQ+XG5cblx0aXNzdWVzOiBIVE1MU3BhbkVsZW1lbnQ7XG5cdHJlY29yZHM6IEhUTUxTcGFuRWxlbWVudDtcbiAgICBpbmZvX2FuZF9zZXR0aW5nczogR2VuZXJhbEluZm9BbmRTZXR0aW5ncztcblxuXHRjb25uZWN0ZWRDYWxsYmFjaygpXG5cdHtcblx0XHQvLyBjaGFydGpzIG5lZWQgdG8gYmUgY3JlYXRlZCB3aGVuIGVsZW1lbnQgaXMgYXR0YWNoZWQgaW50byB0aGUgZG9tXG5cdFx0Y29uc3QgY2hhcnQgPSBuZXcgQ2hhcnQodGhpcy5jYW52YXMsIHtcblx0XHRcdHR5cGU6ICdsaW5lJyxcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0bGFiZWxzOiBbJy01JywnLTQnLCctMycsICctMicsICctMSddLFxuXHRcdFx0XHRkYXRhc2V0czogW11cblx0XHRcdH0sXG5cdFx0XHRvcHRpb25zOiB7XG5cdFx0XHRcdHNjYWxlczoge1xuXHRcdFx0XHRcdHk6IHtcblx0XHRcdFx0XHRcdHN0YWNrZWQ6IHRydWUsXG5cdFx0XHRcdFx0XHRiZWdpbkF0WmVybzogdHJ1ZVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdH1cblx0XHR9KTtcblx0XHRcblx0XHR0aGlzLmNoYXJ0anNfc3VjY2VzcyhjaGFydClcblx0fVxuXHRcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKVxuXHRcdHRoaXMuY2hhcnRqc19zdWNjZXNzID0gKHMpID0+IHt9IC8vIGR1bW15IGluaXRpYWxpemF0aW9uLCBuZXh0IGxpbmUgd2lsbCBpbml0IGNoYXJ0anNfc3VjY2VzcyBidXQgY29tcGlsZXIgZG9uJ3QgdW5kZXJzdGFuZCB0aGlzIVxuXHRcdHRoaXMuY2hhcnRqc19wcm9taXNlID0gbmV3IFByb21pc2UocyA9PiB0aGlzLmNoYXJ0anNfc3VjY2VzcyA9IHMpXG5cdFx0dGhpcy5zcm9vdCA9IHRoaXMuYXR0YWNoU2hhZG93KHsgbW9kZTogJ29wZW4nIH0pXG5cdFx0dGhpcy5zcm9vdC5pbm5lckhUTUwgPSBgXG5cdFx0XHRcdDxzdHlsZT5cblx0XHRcdFx0XHQ6aG9zdCB7XG5cdFx0XHRcdFx0XHRwYWRkaW5nOiAwLjVyZW07XG5cdFx0XHRcdFx0XHRkaXNwbGF5OiBibG9jaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0LmNvbnRhaW5lciB7XG5cdFx0XHRcdFx0XHRib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xuXHRcdFx0XHRcdFx0Ym9yZGVyLXJhZGl1czogMC4zcmVtO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcblx0XHRcdFx0XHQuY29udGFpbmVyID4gKiB7XG5cdFx0XHRcdFx0XHRib3JkZXItYm90dG9tOiAxcHggc29saWQgI2NjYztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0LmhlYWRlciB7XG5cdFx0XHRcdFx0XHRkaXNwbGF5OiBmbGV4O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQuaGVhZGVyIC5jaGFydCB7XG5cdFx0XHRcdFx0XHR3aWR0aDogNTAlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcblx0XHRcdFx0XHQuYWN0aW9ucyB7XG5cdFx0XHRcdFx0XHRib3JkZXI6IDFweCBzb2xpZCBibGFjaztcblx0XHRcdFx0XHRcdHdpZHRoOiAxMHJlbTtcblx0XHRcdFx0XHRcdG1hcmdpbi1sZWZ0OiBhdXRvO1xuXHRcdFx0XHRcdFx0ZGlzcGxheTogZmxleDtcblx0XHRcdFx0XHRcdGJvcmRlci1yYWRpdXM6IDAuNHJlbTtcblx0XHRcdFx0XHRcdG1hcmdpbi1ib3R0b206IDAuNXJlbTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0LmFjdGlvbnMgc3Bhbi5zZWxlY3RlZCB7XG5cdFx0XHRcdFx0XHRjb2xvcjogd2hpdGU7XG5cdFx0XHRcdFx0XHRiYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0LmFjdGlvbnMgc3BhbiB7XG5cdFx0XHRcdFx0XHRmbGV4LWdyb3c6IDUwO1xuXHRcdFx0XHRcdFx0dGV4dC1hbGlnbjogY2VudGVyO1xuXHRcdFx0XHRcdFx0Y3Vyc29yOiBwb2ludGVyO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcblx0XHRcdFx0PC9zdHlsZT5cblx0XHRcdFx0PCEtLSA8aW1nIHNyYz1cImtwaS1kZXRhaWwucG5nXCIgc3R5bGU9XCJtYXgtd2lkdGg6IDEwMCVcIj4gLS0+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJoZWFkZXJcIj5cblx0XHRcdFx0XHQ8ZGl2PlxuXHRcdFx0XHRcdFx0PGNzLWRhdGFzZXQtaXNzdWUtY2F0ZWdvcnk+PC9jcy1kYXRhc2V0LWlzc3VlLWNhdGVnb3J5PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjaGFydFwiPlxuXHRcdFx0XHRcdFx0PGNhbnZhcz48L2NhbnZhcz5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8Y3MtZ2VuZXJhbC1pbmZvLWFuZC1zZXR0aW5ncz48L2NzLWdlbmVyYWwtaW5mby1hbmQtc2V0dGluZ3M+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8ZGl2IHN0eWxlPVwid2lkdGg6IGNhbGMoMTAwJSAtIDIwcHgpXCI+XG5cdFx0XHRcdFx0PGRpdiBzdHlsZT1cInRleHQtYWxpZ246IHJpZ2h0XCIgY2xhc3M9XCJhY3Rpb25zXCI+XG5cdFx0XHRcdFx0XHQ8c3BhbiBjbGFzcz1cImlzc3Vlc1wiPklzc3Vlczwvc3Bhbj5cblx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzPVwicmVjb3Jkc1wiPlJlY29yZHM8L3NwYW4+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPjwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0YFxuXG5cdFx0Y3VzdG9tRWxlbWVudHMudXBncmFkZSh0aGlzLnNyb290KVxuXG5cdFx0dGhpcy5jb250YWluZXIgPSBjc19jYXN0KEhUTUxEaXZFbGVtZW50LCB0aGlzLnNyb290LnF1ZXJ5U2VsZWN0b3IoJy5jb250YWluZXInKSlcblx0XHRcblx0XHR0aGlzLmlzc3VlcyA9IGNzX2Nhc3QoSFRNTFNwYW5FbGVtZW50LCB0aGlzLnNyb290LnF1ZXJ5U2VsZWN0b3IoJy5pc3N1ZXMnKSlcblx0XHR0aGlzLnJlY29yZHMgPSBjc19jYXN0KEhUTUxTcGFuRWxlbWVudCwgdGhpcy5zcm9vdC5xdWVyeVNlbGVjdG9yKCcucmVjb3JkcycpKVxuXHRcdFxuXHRcdHRoaXMuaXNzdWVzLm9uY2xpY2sgPSAoKSA9PiB7XG5cdFx0XHR0aGlzLmN1cnJlbnRfdGFiID0gJ2lzc3Vlcydcblx0XHRcdGlmICh0aGlzLmxhc3Rfc2Vzc2lvbl9zdGFydF90cyAhPSBudWxsICYmIHRoaXMubGFzdF9kYXRhc2V0X25hbWUgIT0gbnVsbCAmJiB0aGlzLmxhc3RfY2hlY2tfY2F0ZWdvcnkgIT0gbnVsbFxuXHRcdFx0XHQmJiB0aGlzLmxhc3RfZmFpbGVkX3JlY29yZHMgIT0gbnVsbCAmJiB0aGlzLmxhc3RfdG90X3JlY29yZHMgIT0gbnVsbClcblx0XHRcdFx0dGhpcy5yZWZyZXNoKHRoaXMubGFzdF9zZXNzaW9uX3N0YXJ0X3RzLCB0aGlzLmxhc3RfZGF0YXNldF9uYW1lLCB0aGlzLmxhc3RfY2hlY2tfY2F0ZWdvcnksIHRoaXMubGFzdF9mYWlsZWRfcmVjb3JkcywgdGhpcy5sYXN0X3RvdF9yZWNvcmRzKVxuXHRcdH1cblx0XHRcblx0XHR0aGlzLnJlY29yZHMub25jbGljayA9ICgpID0+IHtcblx0XHRcdHRoaXMuY3VycmVudF90YWIgPSAncmVjb3Jkcydcblx0XHRcdGlmICh0aGlzLmxhc3Rfc2Vzc2lvbl9zdGFydF90cyAhPSBudWxsICYmIHRoaXMubGFzdF9kYXRhc2V0X25hbWUgIT0gbnVsbCAmJiB0aGlzLmxhc3RfY2hlY2tfY2F0ZWdvcnkgIT0gbnVsbFxuXHRcdFx0XHQmJiB0aGlzLmxhc3RfZmFpbGVkX3JlY29yZHMgIT0gbnVsbCAmJiB0aGlzLmxhc3RfdG90X3JlY29yZHMgIT0gbnVsbClcblx0XHRcdFx0dGhpcy5yZWZyZXNoKHRoaXMubGFzdF9zZXNzaW9uX3N0YXJ0X3RzLCB0aGlzLmxhc3RfZGF0YXNldF9uYW1lLCB0aGlzLmxhc3RfY2hlY2tfY2F0ZWdvcnksIHRoaXMubGFzdF9mYWlsZWRfcmVjb3JkcywgdGhpcy5sYXN0X3RvdF9yZWNvcmRzKVxuXHRcdH1cblx0XHRcblx0XHR0aGlzLmNhbnZhcyA9IGNzX2Nhc3QoSFRNTENhbnZhc0VsZW1lbnQsIHRoaXMuc3Jvb3QucXVlcnlTZWxlY3RvcignY2FudmFzJykpO1xuXHRcdFxuXHRcdHRoaXMuaW5mb19hbmRfc2V0dGluZ3MgPSBjc19jYXN0KEdlbmVyYWxJbmZvQW5kU2V0dGluZ3MsIHRoaXMuc3Jvb3QucXVlcnlTZWxlY3RvcignY3MtZ2VuZXJhbC1pbmZvLWFuZC1zZXR0aW5ncycpKTtcblxuXG5cdH1cblx0XG5cdGV4dHJhY3RIdW1hblJlYWRhYmxlTmFtZShyZWNvcmRfanNvbnBhdGg6IHN0cmluZywganNvbjogc3RyaW5nKTogc3RyaW5nXG5cdHtcblx0XHRsZXQgcmV0ID0gJyc7XG5cdFx0Zm9yIChsZXQgZm4gb2YgWydtdmFsaWR0aW1lJywgJ212YWx1ZScsICdBY2NvRGV0YWlsLmRlLk5hbWUnLCAnRGV0YWlsLmRlLlRpdGxlJ10pXG5cdFx0e1xuXHRcdFx0Y29uc3QgZm5fcGFydHMgPSBmbi5zcGxpdCgnLicpXG5cdFx0XHRsZXQgdmFsID0gSlNPTi5wYXJzZShqc29uKVxuXHRcdFx0Zm9yIChsZXQgcCBvZiBmbl9wYXJ0cylcblx0XHRcdHtcblx0XHRcdFx0dmFsID0gdmFsW3BdXG5cdFx0XHRcdGlmICh2YWwgPT09IHVuZGVmaW5lZClcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdC8vIGNvbnN0IHZhbCA9IHN0YXJ0W2ZuXSBcblx0XHRcdGlmICh2YWwgIT09IHVuZGVmaW5lZClcblx0XHRcdFx0cmV0ICs9IChyZXQgPT09ICcnID8gJycgOiAnLCAnKSArIGZuICsgJz0nICsgSlNPTi5zdHJpbmdpZnkodmFsKVxuXHRcdH1cblx0XHRpZiAocmV0ID09ICcnKVxuXHRcdFx0cmV0ID0gcmVjb3JkX2pzb25wYXRoXG5cdFx0cmV0dXJuIHJldDtcblx0fVxuXHRcblx0Z3JvdXBSZWNvcmRzKGxpc3Q6IHtyZWNvcmRfanNvbjogc3RyaW5nfVtdKToge1trOnN0cmluZ106IGFueVtdfVxuXHR7XG5cdFx0Y29uc3QgZ3JvdXBCeToge1trOnN0cmluZ106IGFueVtdfSA9IHt9XG5cdFx0Zm9yIChsZXQgayA9IDA7IGsgPCBsaXN0Lmxlbmd0aDsgaysrKVxuXHRcdHtcblx0XHRcdGNvbnN0IGpzb24gPSBKU09OLnBhcnNlKGxpc3Rba10ucmVjb3JkX2pzb24pO1xuXHRcdFx0bGV0IHNuYW1lID0ganNvblsnc25hbWUnXTtcblx0XHRcdGlmICh0eXBlb2Ygc25hbWUgIT09ICdzdHJpbmcnKVxuXHRcdFx0XHRzbmFtZSA9ICcnXG5cdFx0XHRsZXQgcHJldl9hcnIgPSBncm91cEJ5W3NuYW1lXVxuXHRcdFx0cHJldl9hcnIgPSBwcmV2X2FyciA9PT0gdW5kZWZpbmVkID8gW10gOiBwcmV2X2FyclxuXHRcdFx0cHJldl9hcnIucHVzaChsaXN0W2tdKVxuXHRcdFx0Z3JvdXBCeVtzbmFtZV0gPSBwcmV2X2FyclxuXHRcdH1cblx0XHRyZXR1cm4gZ3JvdXBCeTsgXG5cdH1cblx0XG5cdGFzeW5jIHJlZnJlc2gocF9zZXNzaW9uX3N0YXJ0X3RzOiBzdHJpbmcsIHBfZGF0YXNldF9uYW1lOiBzdHJpbmcsIHBfY2F0ZWdvcnlfbmFtZTogc3RyaW5nLCBwX2ZhaWxlZF9yZWNvcmRzOiBudW1iZXIsIHBfdG90X3JlY29yZHM6IG51bWJlcikge1xuXHRcdFxuXHRcdHRoaXMubGFzdF9zZXNzaW9uX3N0YXJ0X3RzID0gcF9zZXNzaW9uX3N0YXJ0X3RzXG5cdFx0dGhpcy5sYXN0X2RhdGFzZXRfbmFtZSA9IHBfZGF0YXNldF9uYW1lXG5cdFx0dGhpcy5sYXN0X2NoZWNrX2NhdGVnb3J5ID0gcF9jYXRlZ29yeV9uYW1lXG5cdFx0dGhpcy5sYXN0X2ZhaWxlZF9yZWNvcmRzID0gcF9mYWlsZWRfcmVjb3Jkc1xuXHRcdHRoaXMubGFzdF90b3RfcmVjb3JkcyA9IHBfdG90X3JlY29yZHNcblx0XHRcblx0XHR0aGlzLmluZm9fYW5kX3NldHRpbmdzLnJlZnJlc2gocF9zZXNzaW9uX3N0YXJ0X3RzLCBwX2RhdGFzZXRfbmFtZSwgcF9mYWlsZWRfcmVjb3JkcywgcF90b3RfcmVjb3Jkcylcblx0XHRcblx0XHRjb25zb2xlLmxvZyhwX3Nlc3Npb25fc3RhcnRfdHMpXG5cdFx0Y29uc29sZS5sb2cocF9kYXRhc2V0X25hbWUpXG5cdFx0Y29uc29sZS5sb2cocF9jYXRlZ29yeV9uYW1lKTtcblx0XHRcblx0XHQoYXN5bmMgKCkgPT4ge1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGNvbnN0IGRhdGEgPSBhd2FpdCBBUEkzLmxpc3RfX2NhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfaGlzdG9yeV92dyh7XG5cdFx0XHRcdFx0XHRkYXRhc2V0X25hbWU6IHRoaXMubGFzdF9kYXRhc2V0X25hbWUhLFxuXHRcdFx0XHRcdFx0Y2hlY2tfY2F0ZWdvcnk6IHRoaXMubGFzdF9jaGVja19jYXRlZ29yeSFcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGNvbnN0IGdvb2RhcnIgPSBbXVxuXHRcdFx0XHRcdGNvbnN0IGZhaWxhcnIgPSBbXVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGNvbnN0IGxhYmVscyAgPSBbXVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGZvciAobGV0IHggPSAwOyB4IDwgZGF0YS5sZW5ndGg7IHgrKylcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRnb29kYXJyLnB1c2goZGF0YVt4XS50ZXN0ZWRfcmVjb3JkcyAtIGRhdGFbeF0uZmFpbGVkX3JlY3MpXG5cdFx0XHRcdFx0XHRmYWlsYXJyLnB1c2goZGF0YVt4XS5mYWlsZWRfcmVjcylcblx0XHRcdFx0XHRcdGxhYmVscy5wdXNoKGRhdGFbeF0uc2Vzc2lvbl9zdGFydF90cy5zbGljZSgwLDE2KS5yZXBsYWNlKCdUJywgJyAnKSlcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coZ29vZGFycilcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhmYWlsYXJyKVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGRhdGEpXG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0Y29uc3QgY2hhcnRqcyA9IGF3YWl0IHRoaXMuY2hhcnRqc19wcm9taXNlXG5cdFx0XHRcdFx0Y2hhcnRqcy5kYXRhLmxhYmVscyA9IGxhYmVsc1xuXHRcdFx0XHRcdGNoYXJ0anMuZGF0YS5kYXRhc2V0cyA9IFtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGFiZWw6ICdmYWlsIHRyZW5kJyxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YTogZmFpbGFycixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZmlsbDogZmFsc2UsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGJhY2tncm91bmRDb2xvcjogJyMyMjInLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRib3JkZXJDb2xvcjogJyMyMjInLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0ZW5zaW9uOiAwLjFcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxhYmVsOiAndG90YWwgdHJlbmQnLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhOiBnb29kYXJyLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmaWxsOiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiAnI2FhYScsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGJvcmRlckNvbG9yOiAnI2FhYScsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRlbnNpb246IDAuMVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSxcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRdXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0Y2hhcnRqcy51cGRhdGUoKVxuXHRcdFx0XHRcdFx0XHRcdFx0XG5cdFx0fSkoKTtcblx0XHRcblx0XHRjb25zdCBjYXRlZ29yeSA9IGNzX2Nhc3QoRGF0YXNldElzc3VlQ2F0ZWdvcnlDb21wb25lbnQsIHRoaXMuc3Jvb3QucXVlcnlTZWxlY3RvcignY3MtZGF0YXNldC1pc3N1ZS1jYXRlZ29yeScpKVxuXHRcdGNhdGVnb3J5LmhpZGVNb3JlRGl2KClcblx0XHRjYXRlZ29yeS5yZWZyZXNoKFxuXHRcdHtcblx0XHRcdGRhdGFzZXRfbmFtZTogcF9kYXRhc2V0X25hbWUsXG5cdFx0XHRzZXNzaW9uX3N0YXJ0X3RzOiBwX3Nlc3Npb25fc3RhcnRfdHMsXG5cdFx0XHRjaGVja19jYXRlZ29yeTogcF9jYXRlZ29yeV9uYW1lLFxuXHRcdFx0ZmFpbGVkX3JlY29yZHM6IHBfZmFpbGVkX3JlY29yZHMsXG5cdFx0XHR0b3RfcmVjb3JkczogcF90b3RfcmVjb3Jkc1xuXHRcdH0pXG5cdFx0XG5cdFx0dGhpcy5jb250YWluZXIudGV4dENvbnRlbnQgPSAnJ1xuXHRcdFxuXHRcdGlmICh0aGlzLmN1cnJlbnRfdGFiID09PSAnaXNzdWVzJylcblx0XHR7XG5cdFx0XHR0aGlzLnJlY29yZHMuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKVxuXHRcdFx0dGhpcy5pc3N1ZXMuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKVxuXHRcdFx0XG5cdFx0XHRjb25zdCBsb2FkZXIgPSBuZXcgTG9hZGVyKCk7XG5cdFx0XHR0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChsb2FkZXIpXG5cdFx0XG5cdFx0XHRjb25zdCBqc29uID0gYXdhaXQgQVBJMy5saXN0X19jYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X2NoZWNrX2NhdGVnb3J5X2NoZWNrX25hbWVfcmVjb3JkX3JlY29yZF9mYWlsZWRfdncoe1xuXHRcdFx0XHRzZXNzaW9uX3N0YXJ0X3RzOiBwX3Nlc3Npb25fc3RhcnRfdHMsXG5cdFx0XHRcdGRhdGFzZXRfbmFtZTogcF9kYXRhc2V0X25hbWUsXG5cdFx0XHRcdGNoZWNrX2NhdGVnb3J5OiBwX2NhdGVnb3J5X25hbWVcblx0XHRcdH0pXG5cblx0XHRcdGxvYWRlci5yZW1vdmUoKTtcblx0XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGpzb24ubGVuZ3RoOyBpKyspXG5cdFx0XHR7XG5cdFx0XHRcdGNvbnN0IGlzc3VlID0ganNvbltpXVxuXHRcdFx0XHQvLyBjb25zb2xlLmxvZyhpc3N1ZSlcblx0XHRcdFx0Y29uc3Qgc2VjdGlvbiA9IG5ldyBPcGVuQ2xvc2VTZWN0aW9uKClcblx0XHRcdFx0c2VjdGlvbi5yZWZyZXNoKCdmYWlsZWQ6ICcgKyBpc3N1ZS5jaGVja19uYW1lLCAnJyArIGlzc3VlLm5yX3JlY29yZHMgKyAnIHJlY29yZHMnKVxuXHRcdFx0XHR0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChzZWN0aW9uKVxuXHRcdFx0XHRcblx0XHRcdFx0c2VjdGlvbi5vbm9wZW4gPSBhc3luYyAoKSA9PiB7XG5cdFx0XHRcdFx0Ly9jb25zb2xlLmxvZygnc2V6aW9uZSBhcGVydGEsIHJpY2FyaWNvIScpXG5cdFx0XHRcdFx0Y29uc3QganNvbjIgPSBhd2FpdCBBUEkzLmxpc3RfX2NhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfcmVjb3JkX2NoZWNrX2ZhaWxlZCh7XG5cdFx0XHRcdFx0XHRcdFx0c2Vzc2lvbl9zdGFydF90czogcF9zZXNzaW9uX3N0YXJ0X3RzLFxuXHRcdFx0XHRcdFx0XHRcdGRhdGFzZXRfbmFtZTogcF9kYXRhc2V0X25hbWUsXG5cdFx0XHRcdFx0XHRcdFx0Y2hlY2tfY2F0ZWdvcnk6IHBfY2F0ZWdvcnlfbmFtZSxcblx0XHRcdFx0XHRcdFx0XHRjaGVja19uYW1lOiBpc3N1ZS5jaGVja19uYW1lXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0Y29uc3QgZ3JvdXBCeSA9IHRoaXMuZ3JvdXBSZWNvcmRzKGpzb24yKVxuXHRcdFx0XHRcdGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhncm91cEJ5KVxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGtleXMpXG5cdFx0XHRcdFx0aWYgKGtleXMubGVuZ3RoID09IDEgJiYga2V5c1swXSA9PSAnJylcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRjb25zdCBsaXN0ID0gZ3JvdXBCeVtrZXlzWzBdXVxuXHRcdFx0XHRcdFx0Zm9yIChsZXQgazIgPSAwOyBrMiA8IGxpc3QubGVuZ3RoOyBrMisrKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRjb25zdCBzZWN0aW9uUm93MiA9IG5ldyBTZWN0aW9uUm93KCk7XG5cdFx0XHRcdFx0XHRcdHNlY3Rpb24uYWRkRWxlbWVudFRvQ29udGVudEFyZWEoc2VjdGlvblJvdzIpXG5cdFx0XHRcdFx0XHRcdC8vIHNlY3Rpb25Sb3cyLnJlZnJlc2godGhpcy5leHRyYWN0SHVtYW5SZWFkYWJsZU5hbWUobGlzdFtrMl0ucmVjb3JkX2pzb25wYXRoLCBsaXN0W2syXS5yZWNvcmRfanNvbikpXG5cdFx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cyLnJlZnJlc2gobGlzdFtrMl0ucHJvYmxlbV9oaW50KVxuXHRcdFx0XHRcdFx0XHRzZWN0aW9uUm93Mi5vbmNsaWNrID0gKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdGFsZXJ0KGxpc3RbazJdLnJlY29yZF9qc29uKVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRmb3IgKGxldCBrID0gMDsgayA8IGtleXMubGVuZ3RoOyBrKyspXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IHNlY3Rpb25Sb3cgPSBuZXcgT3BlbkNsb3NlU2VjdGlvbigpO1xuXHRcdFx0XHRcdFx0XHRzZWN0aW9uLmFkZEVsZW1lbnRUb0NvbnRlbnRBcmVhKHNlY3Rpb25Sb3cpXG5cdFx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cucmVmcmVzaChrZXlzW2tdLCAnJyArIGdyb3VwQnlba2V5c1trXV0ubGVuZ3RoICsgJyByZWNvcmRzJylcblx0XHRcdFx0XHRcdFx0c2VjdGlvblJvdy5vbmNsaWNrID0gKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdGNvbnN0IGxpc3QgPSBncm91cEJ5W2tleXNba11dXG5cdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2cobGlzdClcblx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBrMiA9IDA7IGsyIDwgbGlzdC5sZW5ndGg7IGsyKyspXG5cdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0Y29uc3Qgc2VjdGlvblJvdzIgPSBuZXcgU2VjdGlvblJvdygpO1xuXHRcdFx0XHRcdFx0XHRcdFx0c2VjdGlvblJvdy5hZGRFbGVtZW50VG9Db250ZW50QXJlYShzZWN0aW9uUm93Milcblx0XHRcdFx0XHRcdFx0XHRcdC8vIHNlY3Rpb25Sb3cyLnJlZnJlc2godGhpcy5leHRyYWN0SHVtYW5SZWFkYWJsZU5hbWUobGlzdFtrMl0ucmVjb3JkX2pzb25wYXRoLCBsaXN0W2syXS5yZWNvcmRfanNvbikpXG5cdFx0XHRcdFx0XHRcdFx0XHRzZWN0aW9uUm93Mi5yZWZyZXNoKGxpc3RbazJdLnByb2JsZW1faGludClcblx0XHRcdFx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cyLm9uY2xpY2sgPSAoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFsZXJ0KGxpc3RbazJdLnJlY29yZF9qc29uKVxuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0XHRcdFxuXHRcdH1cblx0XHRcblx0XHRcblx0XHRpZiAodGhpcy5jdXJyZW50X3RhYiA9PT0gJ3JlY29yZHMnKVxuXHRcdHtcblx0XHRcdHRoaXMuaXNzdWVzLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJylcblx0XHRcdHRoaXMucmVjb3Jkcy5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpXG5cdFx0XHRcblx0XHRcdGNvbnN0IGxvYWRlciA9IG5ldyBMb2FkZXIoKTtcblx0XHRcdHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKGxvYWRlcilcblxuXHRcdFx0Y29uc3QganNvbiA9IGF3YWl0IEFQSTMubGlzdF9fY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9jaGVja19jYXRlZ29yeV9yZWNvcmRfanNvbnBhdGhfZmFpbGVkX3Z3KHtcblx0XHRcdFx0c2Vzc2lvbl9zdGFydF90czogcF9zZXNzaW9uX3N0YXJ0X3RzLFxuXHRcdFx0XHRkYXRhc2V0X25hbWU6IHBfZGF0YXNldF9uYW1lLFxuXHRcdFx0XHRjaGVja19jYXRlZ29yeTogcF9jYXRlZ29yeV9uYW1lXG5cdFx0XHR9KTtcblx0XHRcdFxuXHRcdFx0bG9hZGVyLnJlbW92ZSgpO1xuXG5cdFx0XHRjb25zdCBncm91cEJ5ID0gdGhpcy5ncm91cFJlY29yZHMoanNvbilcblx0XHRcdGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhncm91cEJ5KVxuXHRcdFx0Y29uc29sZS5sb2coa2V5cylcblx0XHRcdGlmIChrZXlzLmxlbmd0aCA9PSAxICYmIGtleXNbMF0gPT0gJycpXG5cdFx0XHR7XG5cdFx0XHRcdGNvbnN0IGxpc3QgPSBncm91cEJ5W2tleXNbMF1dXG5cdFx0XHRcdGZvciAobGV0IGsyID0gMDsgazIgPCBsaXN0Lmxlbmd0aDsgazIrKylcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGNvbnN0IHNlY3Rpb25Sb3cyID0gbmV3IE9wZW5DbG9zZVNlY3Rpb24oKTtcblx0XHRcdFx0XHR0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChzZWN0aW9uUm93Milcblx0XHRcdFx0XHRzZWN0aW9uUm93Mi5yZWZyZXNoKHRoaXMuZXh0cmFjdEh1bWFuUmVhZGFibGVOYW1lKGxpc3RbazJdLnJlY29yZF9qc29ucGF0aCwgbGlzdFtrMl0ucmVjb3JkX2pzb24pLCAnJyArIGxpc3RbazJdLm5yX2NoZWNrX25hbWVzICsgJyBjaGVjayBmYWlsZWQnKVxuXHRcdFx0XHRcdHNlY3Rpb25Sb3cyLm9uY2xpY2sgPSBhc3luYyAoKSA9PiB7XG5cdFx0XHRcdFx0XHRjb25zdCBqc29uMiA9IGF3YWl0IEFQSTMubGlzdF9fY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9yZWNvcmRfY2hlY2tfZmFpbGVkKHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c2Vzc2lvbl9zdGFydF90czogcF9zZXNzaW9uX3N0YXJ0X3RzLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhc2V0X25hbWU6IHBfZGF0YXNldF9uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjaGVja19jYXRlZ29yeTogcF9jYXRlZ29yeV9uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZWNvcmRfanNvbnBhdGg6IGxpc3RbazJdLnJlY29yZF9qc29ucGF0aFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRmb3IgKGxldCBrID0gMDsgayA8IGpzb24yLmxlbmd0aDsgaysrKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRjb25zdCBzZWN0aW9uUm93ID0gbmV3IFNlY3Rpb25Sb3coKTtcblx0XHRcdFx0XHRcdFx0c2VjdGlvblJvdzIuYWRkRWxlbWVudFRvQ29udGVudEFyZWEoc2VjdGlvblJvdylcblx0XHRcdFx0XHRcdFx0c2VjdGlvblJvdy5yZWZyZXNoKFwiZmFpbGVkOiBcIiArIGpzb24yW2tdLmNoZWNrX25hbWUpXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlXG5cdFx0XHR7XG5cdFx0XHRcdGZvciAobGV0IGsgPSAwOyBrIDwga2V5cy5sZW5ndGg7IGsrKylcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGNvbnN0IHNlY3Rpb25Sb3cgPSBuZXcgT3BlbkNsb3NlU2VjdGlvbigpO1xuXHRcdFx0XHRcdHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHNlY3Rpb25Sb3cpXG5cdFx0XHRcdFx0c2VjdGlvblJvdy5yZWZyZXNoKGtleXNba10sICcnICsgZ3JvdXBCeVtrZXlzW2tdXS5sZW5ndGggKyAnIHJlY29yZHMnKVxuXHRcdFx0XHRcdHNlY3Rpb25Sb3cub25jbGljayA9ICgpID0+IHtcblx0XHRcdFx0XHRcdGNvbnN0IGxpc3QgPSBncm91cEJ5W2tleXNba11dXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhsaXN0KVxuXHRcdFx0XHRcdFx0Zm9yIChsZXQgazIgPSAwOyBrMiA8IGxpc3QubGVuZ3RoOyBrMisrKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRjb25zdCBzZWN0aW9uUm93MiA9IG5ldyBPcGVuQ2xvc2VTZWN0aW9uKCk7XG5cdFx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cuYWRkRWxlbWVudFRvQ29udGVudEFyZWEoc2VjdGlvblJvdzIpXG5cdFx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cyLnJlZnJlc2godGhpcy5leHRyYWN0SHVtYW5SZWFkYWJsZU5hbWUobGlzdFtrMl0ucmVjb3JkX2pzb25wYXRoLCBsaXN0W2syXS5yZWNvcmRfanNvbiksIGxpc3RbazJdLm5yX2NoZWNrX25hbWVzKVxuXHRcdFx0XHRcdFx0XHRzZWN0aW9uUm93Mi5vbmNsaWNrID0gYXN5bmMgKGUpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpXG5cdFx0XHRcdFx0XHRcdFx0Y29uc3QganNvbjIgPSBhd2FpdCBBUEkzLmxpc3RfX2NhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfcmVjb3JkX2NoZWNrX2ZhaWxlZCh7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzZXNzaW9uX3N0YXJ0X3RzOiBwX3Nlc3Npb25fc3RhcnRfdHMsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhc2V0X25hbWU6IHBfZGF0YXNldF9uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2hlY2tfY2F0ZWdvcnk6IHBfY2F0ZWdvcnlfbmFtZSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlY29yZF9qc29ucGF0aDogbGlzdFtrMl0ucmVjb3JkX2pzb25wYXRoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdGZvciAobGV0IGsgPSAwOyBrIDwganNvbjIubGVuZ3RoOyBrKyspXG5cdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0Y29uc3Qgc2VjdGlvblJvdyA9IG5ldyBTZWN0aW9uUm93KCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRzZWN0aW9uUm93Mi5hZGRFbGVtZW50VG9Db250ZW50QXJlYShzZWN0aW9uUm93KVxuXHRcdFx0XHRcdFx0XHRcdFx0c2VjdGlvblJvdy5yZWZyZXNoKGpzb24yW2tdLmNoZWNrX25hbWUpXG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG5cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgnY3MtZGF0YXNldC1pc3N1ZXMtZGV0YWlsJywgRGF0YXNldElzc3Vlc0RldGFpbClcbiJdfQ==