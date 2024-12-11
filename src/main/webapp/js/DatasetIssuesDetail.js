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
    issues;
    records;
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
					<div><img src="kpi-general-info.png"></div>
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
        const category = cs_cast(DatasetIssueCategory, this.sroot.querySelector('cs-dataset-issue-category'));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YXNldElzc3Vlc0RldGFpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3R5cGVzY3JpcHQvRGF0YXNldElzc3Vlc0RldGFpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxPQUFPLEVBQUUsT0FBTyxFQUFZLE1BQU0sY0FBYyxDQUFDO0FBQ2pELE9BQU8sRUFBQyxJQUFJLEVBQTJELE1BQU0sZUFBZSxDQUFDO0FBQzdGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3pELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ3JDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBR2pFLE1BQU0sT0FBTyxtQkFBb0IsU0FBUSxXQUFXO0lBR25ELFNBQVMsQ0FBQTtJQUVULHFCQUFxQixHQUFnQixJQUFJLENBQUE7SUFDekMsaUJBQWlCLEdBQWdCLElBQUksQ0FBQTtJQUNyQyxtQkFBbUIsR0FBZ0IsSUFBSSxDQUFBO0lBQ3ZDLG1CQUFtQixHQUFnQixJQUFJLENBQUE7SUFDdkMsZ0JBQWdCLEdBQWdCLElBQUksQ0FBQTtJQUVwQyxXQUFXLEdBQXlCLFFBQVEsQ0FBQTtJQUU1QyxLQUFLLENBQUE7SUFFTCxNQUFNLENBQUE7SUFFTixvQkFBb0I7SUFDcEIsZ0RBQWdEO0lBRWhELGVBQWUsQ0FBb0I7SUFDbkMsZUFBZSxDQUFnQjtJQUUvQixNQUFNLENBQWtCO0lBQ3hCLE9BQU8sQ0FBa0I7SUFFekIsaUJBQWlCO1FBRWhCLG1FQUFtRTtRQUNuRSxNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ3BDLElBQUksRUFBRSxNQUFNO1lBQ1osSUFBSSxFQUFFO2dCQUNMLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBQyxJ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QUFHLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtnQ0FDakMsQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFBO2dDQUNuQixNQUFNLEtBQUssR0FBRyxNQUFNLElBQUksQ0FBQyx5REFBeUQsQ0FBQztvQ0FDdEUsZ0JBQWdCLEVBQUUsa0JBQWtCO29DQUNwQyxZQUFZLEVBQUUsY0FBYztvQ0FDNUIsY0FBYyxFQUFFLGVBQWU7b0NBQy9CLGVBQWUsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsZUFBZTtpQ0FDaEQsQ0FBQyxDQUFDO2dDQUNSLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUNyQyxDQUFDO29DQUNBLE1BQU0sVUFBVSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7b0NBQ3BDLFdBQVcsQ0FBQyx1QkFBdUIsQ0FBQyxVQUFVLENBQUMsQ0FBQTtvQ0FDL0MsVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUE7Z0NBQ3hDLENBQUM7NEJBRUYsQ0FBQyxDQUFBO3dCQUNGLENBQUM7b0JBQ0YsQ0FBQyxDQUFBO2dCQUNGLENBQUM7WUFDRixDQUFDO1FBQ0YsQ0FBQztJQUNGLENBQUM7Q0FDRDtBQUVELGNBQWMsQ0FBQyxNQUFNLENBQUMsMEJBQTBCLEVBQUUsbUJBQW1CLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAoQykgMjAyNCBDYXRjaCBTb2x2ZSBkaSBEYXZpZGUgTW9udGVzaW5cbiAqIExpY2Vuc2U6IEFHUExcbiAqL1xuXG5pbXBvcnQgeyBjc19jYXN0LCB0aHJvd05QRSB9IGZyb20gXCIuL3F1YWxpdHkuanNcIjtcbmltcG9ydCB7QVBJMywgY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9yZWNvcmRfY2hlY2tfZmFpbGVkX19yb3d9IGZyb20gJy4vYXBpL2FwaTMuanMnO1xuaW1wb3J0IHsgT3BlbkNsb3NlU2VjdGlvbiB9IGZyb20gXCIuL09wZW5DbG9zZVNlY3Rpb24uanNcIjtcbmltcG9ydCB7IFNlY3Rpb25Sb3cgfSBmcm9tIFwiLi9TZWN0aW9uUm93LmpzXCI7XG5pbXBvcnQgeyBMb2FkZXIgfSBmcm9tIFwiLi9Mb2FkZXIuanNcIjtcbmltcG9ydCB7IERhdGFzZXRJc3N1ZUNhdGVnb3J5IH0gZnJvbSBcIi4vRGF0YXNldElzc3VlQ2F0ZWdvcnkuanNcIjtcbmltcG9ydCBDaGFydCA9IHJlcXVpcmUoXCJjaGFydC5qc1wiKTtcblxuZXhwb3J0IGNsYXNzIERhdGFzZXRJc3N1ZXNEZXRhaWwgZXh0ZW5kcyBIVE1MRWxlbWVudFxue1xuXHRcblx0Y29udGFpbmVyIFxuXHRcblx0bGFzdF9zZXNzaW9uX3N0YXJ0X3RzOiBzdHJpbmd8bnVsbCA9IG51bGxcblx0bGFzdF9kYXRhc2V0X25hbWU6IHN0cmluZ3xudWxsID0gbnVsbFxuXHRsYXN0X2NoZWNrX2NhdGVnb3J5OiBzdHJpbmd8bnVsbCA9IG51bGxcblx0bGFzdF9mYWlsZWRfcmVjb3JkczogbnVtYmVyfG51bGwgPSBudWxsXG5cdGxhc3RfdG90X3JlY29yZHM6IG51bWJlcnxudWxsID0gbnVsbFxuXHRcblx0Y3VycmVudF90YWI6ICdpc3N1ZXMnIHwgJ3JlY29yZHMnID0gJ2lzc3Vlcydcblx0XG5cdHNyb290XG5cdFxuXHRjYW52YXNcblx0XG5cdC8vIGNvbm5lY3RlZF9wcm9taXNlXG5cdC8vIGNvbm5lY3RlZF9mdW5jOiAoczogbnVsbCkgPT4gdm9pZCA9IHMgPT4gbnVsbFxuXHRcblx0Y2hhcnRqc19zdWNjZXNzOiAoczogQ2hhcnQpID0+IHZvaWRcblx0Y2hhcnRqc19wcm9taXNlOiBQcm9taXNlPENoYXJ0PlxuXG5cdGlzc3VlczogSFRNTFNwYW5FbGVtZW50O1xuXHRyZWNvcmRzOiBIVE1MU3BhbkVsZW1lbnQ7XG5cblx0Y29ubmVjdGVkQ2FsbGJhY2soKVxuXHR7XG5cdFx0Ly8gY2hhcnRqcyBuZWVkIHRvIGJlIGNyZWF0ZWQgd2hlbiBlbGVtZW50IGlzIGF0dGFjaGVkIGludG8gdGhlIGRvbVxuXHRcdGNvbnN0IGNoYXJ0ID0gbmV3IENoYXJ0KHRoaXMuY2FudmFzLCB7XG5cdFx0XHR0eXBlOiAnbGluZScsXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdGxhYmVsczogWyctNScsJy00JywnLTMnLCAnLTInLCAnLTEnXSxcblx0XHRcdFx0ZGF0YXNldHM6IFtdXG5cdFx0XHR9LFxuXHRcdFx0b3B0aW9uczoge1xuXHRcdFx0XHRzY2FsZXM6IHtcblx0XHRcdFx0XHR5OiB7XG5cdFx0XHRcdFx0XHRzdGFja2VkOiB0cnVlLFxuXHRcdFx0XHRcdFx0YmVnaW5BdFplcm86IHRydWVcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0XG5cdFx0dGhpcy5jaGFydGpzX3N1Y2Nlc3MoY2hhcnQpXG5cdH1cblx0XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKClcblx0XHR0aGlzLmNoYXJ0anNfcHJvbWlzZSA9IG5ldyBQcm9taXNlKHMgPT4gdGhpcy5jaGFydGpzX3N1Y2Nlc3MgPSBzKVxuXHRcdHRoaXMuc3Jvb3QgPSB0aGlzLmF0dGFjaFNoYWRvdyh7IG1vZGU6ICdvcGVuJyB9KVxuXHRcdHRoaXMuc3Jvb3QuaW5uZXJIVE1MID0gYFxuXHRcdFx0XHQ8c3R5bGU+XG5cdFx0XHRcdFx0Omhvc3Qge1xuXHRcdFx0XHRcdFx0cGFkZGluZzogMC41cmVtO1xuXHRcdFx0XHRcdFx0ZGlzcGxheTogYmxvY2s7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC5jb250YWluZXIge1xuXHRcdFx0XHRcdFx0Ym9yZGVyOiAxcHggc29saWQgI2NjYztcblx0XHRcdFx0XHRcdGJvcmRlci1yYWRpdXM6IDAuM3JlbTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0LmNvbnRhaW5lciA+ICoge1xuXHRcdFx0XHRcdFx0Ym9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNjY2M7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC5oZWFkZXIge1xuXHRcdFx0XHRcdFx0ZGlzcGxheTogZmxleDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0LmhlYWRlciAuY2hhcnQge1xuXHRcdFx0XHRcdFx0d2lkdGg6IDUwJTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0LmFjdGlvbnMge1xuXHRcdFx0XHRcdFx0Ym9yZGVyOiAxcHggc29saWQgYmxhY2s7XG5cdFx0XHRcdFx0XHR3aWR0aDogMTByZW07XG5cdFx0XHRcdFx0XHRtYXJnaW4tbGVmdDogYXV0bztcblx0XHRcdFx0XHRcdGRpc3BsYXk6IGZsZXg7XG5cdFx0XHRcdFx0XHRib3JkZXItcmFkaXVzOiAwLjRyZW07XG5cdFx0XHRcdFx0XHRtYXJnaW4tYm90dG9tOiAwLjVyZW07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdC5hY3Rpb25zIHNwYW4uc2VsZWN0ZWQge1xuXHRcdFx0XHRcdFx0Y29sb3I6IHdoaXRlO1xuXHRcdFx0XHRcdFx0YmFja2dyb3VuZC1jb2xvcjogYmxhY2s7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdC5hY3Rpb25zIHNwYW4ge1xuXHRcdFx0XHRcdFx0ZmxleC1ncm93OiA1MDtcblx0XHRcdFx0XHRcdHRleHQtYWxpZ246IGNlbnRlcjtcblx0XHRcdFx0XHRcdGN1cnNvcjogcG9pbnRlcjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XG5cdFx0XHRcdDwvc3R5bGU+XG5cdFx0XHRcdDwhLS0gPGltZyBzcmM9XCJrcGktZGV0YWlsLnBuZ1wiIHN0eWxlPVwibWF4LXdpZHRoOiAxMDAlXCI+IC0tPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiaGVhZGVyXCI+XG5cdFx0XHRcdFx0PGRpdj5cblx0XHRcdFx0XHRcdDxjcy1kYXRhc2V0LWlzc3VlLWNhdGVnb3J5PjwvY3MtZGF0YXNldC1pc3N1ZS1jYXRlZ29yeT5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY2hhcnRcIj5cblx0XHRcdFx0XHRcdDxjYW52YXM+PC9jYW52YXM+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PGRpdj48aW1nIHNyYz1cImtwaS1nZW5lcmFsLWluZm8ucG5nXCI+PC9kaXY+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8ZGl2IHN0eWxlPVwid2lkdGg6IGNhbGMoMTAwJSAtIDIwcHgpXCI+XG5cdFx0XHRcdFx0PGRpdiBzdHlsZT1cInRleHQtYWxpZ246IHJpZ2h0XCIgY2xhc3M9XCJhY3Rpb25zXCI+XG5cdFx0XHRcdFx0XHQ8c3BhbiBjbGFzcz1cImlzc3Vlc1wiPklzc3Vlczwvc3Bhbj5cblx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzPVwicmVjb3Jkc1wiPlJlY29yZHM8L3NwYW4+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPjwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0YFxuXG5cdFx0Y3VzdG9tRWxlbWVudHMudXBncmFkZSh0aGlzLnNyb290KVxuXG5cdFx0dGhpcy5jb250YWluZXIgPSBjc19jYXN0KEhUTUxEaXZFbGVtZW50LCB0aGlzLnNyb290LnF1ZXJ5U2VsZWN0b3IoJy5jb250YWluZXInKSlcblx0XHRcblx0XHR0aGlzLmlzc3VlcyA9IGNzX2Nhc3QoSFRNTFNwYW5FbGVtZW50LCB0aGlzLnNyb290LnF1ZXJ5U2VsZWN0b3IoJy5pc3N1ZXMnKSlcblx0XHR0aGlzLnJlY29yZHMgPSBjc19jYXN0KEhUTUxTcGFuRWxlbWVudCwgdGhpcy5zcm9vdC5xdWVyeVNlbGVjdG9yKCcucmVjb3JkcycpKVxuXHRcdFxuXHRcdHRoaXMuaXNzdWVzLm9uY2xpY2sgPSAoKSA9PiB7XG5cdFx0XHR0aGlzLmN1cnJlbnRfdGFiID0gJ2lzc3Vlcydcblx0XHRcdGlmICh0aGlzLmxhc3Rfc2Vzc2lvbl9zdGFydF90cyAhPSBudWxsICYmIHRoaXMubGFzdF9kYXRhc2V0X25hbWUgIT0gbnVsbCAmJiB0aGlzLmxhc3RfY2hlY2tfY2F0ZWdvcnkgIT0gbnVsbFxuXHRcdFx0XHQmJiB0aGlzLmxhc3RfZmFpbGVkX3JlY29yZHMgIT0gbnVsbCAmJiB0aGlzLmxhc3RfdG90X3JlY29yZHMgIT0gbnVsbClcblx0XHRcdFx0dGhpcy5yZWZyZXNoKHRoaXMubGFzdF9zZXNzaW9uX3N0YXJ0X3RzLCB0aGlzLmxhc3RfZGF0YXNldF9uYW1lLCB0aGlzLmxhc3RfY2hlY2tfY2F0ZWdvcnksIHRoaXMubGFzdF9mYWlsZWRfcmVjb3JkcywgdGhpcy5sYXN0X3RvdF9yZWNvcmRzKVxuXHRcdH1cblx0XHRcblx0XHR0aGlzLnJlY29yZHMub25jbGljayA9ICgpID0+IHtcblx0XHRcdHRoaXMuY3VycmVudF90YWIgPSAncmVjb3Jkcydcblx0XHRcdGlmICh0aGlzLmxhc3Rfc2Vzc2lvbl9zdGFydF90cyAhPSBudWxsICYmIHRoaXMubGFzdF9kYXRhc2V0X25hbWUgIT0gbnVsbCAmJiB0aGlzLmxhc3RfY2hlY2tfY2F0ZWdvcnkgIT0gbnVsbFxuXHRcdFx0XHQmJiB0aGlzLmxhc3RfZmFpbGVkX3JlY29yZHMgIT0gbnVsbCAmJiB0aGlzLmxhc3RfdG90X3JlY29yZHMgIT0gbnVsbClcblx0XHRcdFx0dGhpcy5yZWZyZXNoKHRoaXMubGFzdF9zZXNzaW9uX3N0YXJ0X3RzLCB0aGlzLmxhc3RfZGF0YXNldF9uYW1lLCB0aGlzLmxhc3RfY2hlY2tfY2F0ZWdvcnksIHRoaXMubGFzdF9mYWlsZWRfcmVjb3JkcywgdGhpcy5sYXN0X3RvdF9yZWNvcmRzKVxuXHRcdH1cblx0XHRcblx0XHR0aGlzLmNhbnZhcyA9IGNzX2Nhc3QoSFRNTENhbnZhc0VsZW1lbnQsIHRoaXMuc3Jvb3QucXVlcnlTZWxlY3RvcignY2FudmFzJykpO1xuXHRcdFxuXHRcdFxuXG5cdH1cblx0XG5cdGV4dHJhY3RIdW1hblJlYWRhYmxlTmFtZShyZWNvcmRfanNvbnBhdGg6IHN0cmluZywganNvbjogc3RyaW5nKTogc3RyaW5nXG5cdHtcblx0XHRsZXQgcmV0ID0gJyc7XG5cdFx0Zm9yIChsZXQgZm4gb2YgWydtdmFsaWR0aW1lJywgJ212YWx1ZScsICdBY2NvRGV0YWlsLmRlLk5hbWUnLCAnRGV0YWlsLmRlLlRpdGxlJ10pXG5cdFx0e1xuXHRcdFx0Y29uc3QgZm5fcGFydHMgPSBmbi5zcGxpdCgnLicpXG5cdFx0XHRsZXQgdmFsID0gSlNPTi5wYXJzZShqc29uKVxuXHRcdFx0Zm9yIChsZXQgcCBvZiBmbl9wYXJ0cylcblx0XHRcdHtcblx0XHRcdFx0dmFsID0gdmFsW3BdXG5cdFx0XHRcdGlmICh2YWwgPT09IHVuZGVmaW5lZClcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdC8vIGNvbnN0IHZhbCA9IHN0YXJ0W2ZuXSBcblx0XHRcdGlmICh2YWwgIT09IHVuZGVmaW5lZClcblx0XHRcdFx0cmV0ICs9IChyZXQgPT09ICcnID8gJycgOiAnLCAnKSArIGZuICsgJz0nICsgSlNPTi5zdHJpbmdpZnkodmFsKVxuXHRcdH1cblx0XHRpZiAocmV0ID09ICcnKVxuXHRcdFx0cmV0ID0gcmVjb3JkX2pzb25wYXRoXG5cdFx0cmV0dXJuIHJldDtcblx0fVxuXHRcblx0Z3JvdXBSZWNvcmRzKGxpc3Q6IHtyZWNvcmRfanNvbjogc3RyaW5nfVtdKToge1trOnN0cmluZ106IGFueVtdfVxuXHR7XG5cdFx0Y29uc3QgZ3JvdXBCeToge1trOnN0cmluZ106IGFueVtdfSA9IHt9XG5cdFx0Zm9yIChsZXQgayA9IDA7IGsgPCBsaXN0Lmxlbmd0aDsgaysrKVxuXHRcdHtcblx0XHRcdGNvbnN0IGpzb24gPSBKU09OLnBhcnNlKGxpc3Rba10ucmVjb3JkX2pzb24pO1xuXHRcdFx0bGV0IHNuYW1lID0ganNvblsnc25hbWUnXTtcblx0XHRcdGlmICh0eXBlb2Ygc25hbWUgIT09ICdzdHJpbmcnKVxuXHRcdFx0XHRzbmFtZSA9ICcnXG5cdFx0XHRsZXQgcHJldl9hcnIgPSBncm91cEJ5W3NuYW1lXVxuXHRcdFx0cHJldl9hcnIgPSBwcmV2X2FyciA9PT0gdW5kZWZpbmVkID8gW10gOiBwcmV2X2FyclxuXHRcdFx0cHJldl9hcnIucHVzaChsaXN0W2tdKVxuXHRcdFx0Z3JvdXBCeVtzbmFtZV0gPSBwcmV2X2FyclxuXHRcdH1cblx0XHRyZXR1cm4gZ3JvdXBCeTsgXG5cdH1cblx0XG5cdGFzeW5jIHJlZnJlc2gocF9zZXNzaW9uX3N0YXJ0X3RzOiBzdHJpbmcsIHBfZGF0YXNldF9uYW1lOiBzdHJpbmcsIHBfY2F0ZWdvcnlfbmFtZTogc3RyaW5nLCBwX2ZhaWxlZF9yZWNvcmRzOiBudW1iZXIsIHBfdG90X3JlY29yZHM6IG51bWJlcikge1xuXHRcdFxuXHRcdHRoaXMubGFzdF9zZXNzaW9uX3N0YXJ0X3RzID0gcF9zZXNzaW9uX3N0YXJ0X3RzXG5cdFx0dGhpcy5sYXN0X2RhdGFzZXRfbmFtZSA9IHBfZGF0YXNldF9uYW1lXG5cdFx0dGhpcy5sYXN0X2NoZWNrX2NhdGVnb3J5ID0gcF9jYXRlZ29yeV9uYW1lXG5cdFx0dGhpcy5sYXN0X2ZhaWxlZF9yZWNvcmRzID0gcF9mYWlsZWRfcmVjb3Jkc1xuXHRcdHRoaXMubGFzdF90b3RfcmVjb3JkcyA9IHBfdG90X3JlY29yZHNcblx0XHRcblx0XHRjb25zb2xlLmxvZyhwX3Nlc3Npb25fc3RhcnRfdHMpXG5cdFx0Y29uc29sZS5sb2cocF9kYXRhc2V0X25hbWUpXG5cdFx0Y29uc29sZS5sb2cocF9jYXRlZ29yeV9uYW1lKTtcblx0XHRcblx0XHQoYXN5bmMgKCkgPT4ge1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGNvbnN0IGRhdGEgPSBhd2FpdCBBUEkzLmxpc3RfX2NhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfaGlzdG9yeV92dyh7XG5cdFx0XHRcdFx0XHRkYXRhc2V0X25hbWU6IHRoaXMubGFzdF9kYXRhc2V0X25hbWUhLFxuXHRcdFx0XHRcdFx0Y2hlY2tfY2F0ZWdvcnk6IHRoaXMubGFzdF9jaGVja19jYXRlZ29yeSFcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGNvbnN0IGdvb2RhcnIgPSBbXVxuXHRcdFx0XHRcdGNvbnN0IGZhaWxhcnIgPSBbXVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGZvciAobGV0IHggPSAwOyB4IDwgZGF0YS5sZW5ndGg7IHgrKylcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRnb29kYXJyLnB1c2goZGF0YVt4XS50ZXN0ZWRfcmVjb3JkcyAtIGRhdGFbeF0uZmFpbGVkX3JlY3MpXG5cdFx0XHRcdFx0XHRmYWlsYXJyLnB1c2goZGF0YVt4XS5mYWlsZWRfcmVjcylcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coZ29vZGFycilcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhmYWlsYXJyKVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGRhdGEpXG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0Y29uc3QgY2hhcnRqcyA9IGF3YWl0IHRoaXMuY2hhcnRqc19wcm9taXNlXG5cdFx0XHRcdFx0Y2hhcnRqcy5kYXRhLmRhdGFzZXRzID0gW1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsYWJlbDogJ2ZhaWwgdHJlbmQnLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhOiBmYWlsYXJyLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmaWxsOiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiAnIzIyMicsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGJvcmRlckNvbG9yOiAnIzIyMicsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRlbnNpb246IDAuMVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGFiZWw6ICd0b3RhbCB0cmVuZCcsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGE6IGdvb2RhcnIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZpbGw6IGZhbHNlLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6ICcjYWFhJyxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ym9yZGVyQ29sb3I6ICcjYWFhJyxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGVuc2lvbjogMC4xXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9LFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdF1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRjaGFydGpzLnVwZGF0ZSgpXG5cdFx0XHRcdFx0XHRcdFx0XHRcblx0XHR9KSgpO1xuXHRcdFxuXHRcdGNvbnN0IGNhdGVnb3J5ID0gY3NfY2FzdChEYXRhc2V0SXNzdWVDYXRlZ29yeSwgdGhpcy5zcm9vdC5xdWVyeVNlbGVjdG9yKCdjcy1kYXRhc2V0LWlzc3VlLWNhdGVnb3J5JykpXG5cdFx0Y2F0ZWdvcnkuaGlkZU1vcmVEaXYoKVxuXHRcdGNhdGVnb3J5LnJlZnJlc2goXG5cdFx0e1xuXHRcdFx0ZGF0YXNldF9uYW1lOiBwX2RhdGFzZXRfbmFtZSxcblx0XHRcdHNlc3Npb25fc3RhcnRfdHM6IHBfc2Vzc2lvbl9zdGFydF90cyxcblx0XHRcdGNoZWNrX2NhdGVnb3J5OiBwX2NhdGVnb3J5X25hbWUsXG5cdFx0XHRmYWlsZWRfcmVjb3JkczogcF9mYWlsZWRfcmVjb3Jkcyxcblx0XHRcdHRvdF9yZWNvcmRzOiBwX3RvdF9yZWNvcmRzXG5cdFx0fSlcblx0XHRcblx0XHR0aGlzLmNvbnRhaW5lci50ZXh0Q29udGVudCA9ICcnXG5cdFx0XG5cdFx0aWYgKHRoaXMuY3VycmVudF90YWIgPT09ICdpc3N1ZXMnKVxuXHRcdHtcblx0XHRcdHRoaXMucmVjb3Jkcy5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpXG5cdFx0XHR0aGlzLmlzc3Vlcy5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpXG5cdFx0XHRcblx0XHRcdGNvbnN0IGxvYWRlciA9IG5ldyBMb2FkZXIoKTtcblx0XHRcdHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKGxvYWRlcilcblx0XHRcblx0XHRcdGNvbnN0IGpzb24gPSBhd2FpdCBBUEkzLmxpc3RfX2NhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfY2hlY2tfY2F0ZWdvcnlfY2hlY2tfbmFtZV9yZWNvcmRfcmVjb3JkX2ZhaWxlZF92dyh7XG5cdFx0XHRcdHNlc3Npb25fc3RhcnRfdHM6IHBfc2Vzc2lvbl9zdGFydF90cyxcblx0XHRcdFx0ZGF0YXNldF9uYW1lOiBwX2RhdGFzZXRfbmFtZSxcblx0XHRcdFx0Y2hlY2tfY2F0ZWdvcnk6IHBfY2F0ZWdvcnlfbmFtZVxuXHRcdFx0fSlcblxuXHRcdFx0bG9hZGVyLnJlbW92ZSgpO1xuXHRcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwganNvbi5sZW5ndGg7IGkrKylcblx0XHRcdHtcblx0XHRcdFx0Y29uc3QgaXNzdWUgPSBqc29uW2ldXG5cdFx0XHRcdC8vIGNvbnNvbGUubG9nKGlzc3VlKVxuXHRcdFx0XHRjb25zdCBzZWN0aW9uID0gbmV3IE9wZW5DbG9zZVNlY3Rpb24oKVxuXHRcdFx0XHRzZWN0aW9uLnJlZnJlc2goaXNzdWUuY2hlY2tfbmFtZSwgJycgKyBpc3N1ZS5ucl9yZWNvcmRzICsgJyByZWNvcmRzJylcblx0XHRcdFx0dGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoc2VjdGlvbilcblx0XHRcdFx0XG5cdFx0XHRcdHNlY3Rpb24ub25vcGVuID0gYXN5bmMgKCkgPT4ge1xuXHRcdFx0XHRcdC8vY29uc29sZS5sb2coJ3NlemlvbmUgYXBlcnRhLCByaWNhcmljbyEnKVxuXHRcdFx0XHRcdGNvbnN0IGpzb24yID0gYXdhaXQgQVBJMy5saXN0X19jYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X3JlY29yZF9jaGVja19mYWlsZWQoe1xuXHRcdFx0XHRcdFx0XHRcdHNlc3Npb25fc3RhcnRfdHM6IHBfc2Vzc2lvbl9zdGFydF90cyxcblx0XHRcdFx0XHRcdFx0XHRkYXRhc2V0X25hbWU6IHBfZGF0YXNldF9uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdGNoZWNrX2NhdGVnb3J5OiBwX2NhdGVnb3J5X25hbWUsXG5cdFx0XHRcdFx0XHRcdFx0Y2hlY2tfbmFtZTogaXNzdWUuY2hlY2tfbmFtZVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdGNvbnN0IGdyb3VwQnkgPSB0aGlzLmdyb3VwUmVjb3Jkcyhqc29uMilcblx0XHRcdFx0XHRjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoZ3JvdXBCeSlcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhrZXlzKVxuXHRcdFx0XHRcdGlmIChrZXlzLmxlbmd0aCA9PSAxICYmIGtleXNbMF0gPT0gJycpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Y29uc3QgbGlzdCA9IGdyb3VwQnlba2V5c1swXV1cblx0XHRcdFx0XHRcdGZvciAobGV0IGsyID0gMDsgazIgPCBsaXN0Lmxlbmd0aDsgazIrKylcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y29uc3Qgc2VjdGlvblJvdzIgPSBuZXcgU2VjdGlvblJvdygpO1xuXHRcdFx0XHRcdFx0XHRzZWN0aW9uLmFkZEVsZW1lbnRUb0NvbnRlbnRBcmVhKHNlY3Rpb25Sb3cyKVxuXHRcdFx0XHRcdFx0XHRzZWN0aW9uUm93Mi5yZWZyZXNoKHRoaXMuZXh0cmFjdEh1bWFuUmVhZGFibGVOYW1lKGxpc3RbazJdLnJlY29yZF9qc29ucGF0aCwgbGlzdFtrMl0ucmVjb3JkX2pzb24pKVxuXHRcdFx0XHRcdFx0XHRzZWN0aW9uUm93Mi5vbmNsaWNrID0gKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdGFsZXJ0KGxpc3RbazJdLnJlY29yZF9qc29uKVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRmb3IgKGxldCBrID0gMDsgayA8IGtleXMubGVuZ3RoOyBrKyspXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IHNlY3Rpb25Sb3cgPSBuZXcgT3BlbkNsb3NlU2VjdGlvbigpO1xuXHRcdFx0XHRcdFx0XHRzZWN0aW9uLmFkZEVsZW1lbnRUb0NvbnRlbnRBcmVhKHNlY3Rpb25Sb3cpXG5cdFx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cucmVmcmVzaChrZXlzW2tdLCAnJyArIGdyb3VwQnlba2V5c1trXV0ubGVuZ3RoICsgJyByZWNvcmRzJylcblx0XHRcdFx0XHRcdFx0c2VjdGlvblJvdy5vbmNsaWNrID0gKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdGNvbnN0IGxpc3QgPSBncm91cEJ5W2tleXNba11dXG5cdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2cobGlzdClcblx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBrMiA9IDA7IGsyIDwgbGlzdC5sZW5ndGg7IGsyKyspXG5cdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0Y29uc3Qgc2VjdGlvblJvdzIgPSBuZXcgU2VjdGlvblJvdygpO1xuXHRcdFx0XHRcdFx0XHRcdFx0c2VjdGlvblJvdy5hZGRFbGVtZW50VG9Db250ZW50QXJlYShzZWN0aW9uUm93Milcblx0XHRcdFx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cyLnJlZnJlc2godGhpcy5leHRyYWN0SHVtYW5SZWFkYWJsZU5hbWUobGlzdFtrMl0ucmVjb3JkX2pzb25wYXRoLCBsaXN0W2syXS5yZWNvcmRfanNvbikpXG5cdFx0XHRcdFx0XHRcdFx0XHRzZWN0aW9uUm93Mi5vbmNsaWNrID0gKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRhbGVydChsaXN0W2syXS5yZWNvcmRfanNvbilcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdFx0XHRcblx0XHR9XG5cdFx0XG5cdFx0XG5cdFx0aWYgKHRoaXMuY3VycmVudF90YWIgPT09ICdyZWNvcmRzJylcblx0XHR7XG5cdFx0XHR0aGlzLmlzc3Vlcy5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpXG5cdFx0XHR0aGlzLnJlY29yZHMuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKVxuXHRcdFx0XG5cdFx0XHRjb25zdCBsb2FkZXIgPSBuZXcgTG9hZGVyKCk7XG5cdFx0XHR0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChsb2FkZXIpXG5cblx0XHRcdGNvbnN0IGpzb24gPSBhd2FpdCBBUEkzLmxpc3RfX2NhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfY2hlY2tfY2F0ZWdvcnlfcmVjb3JkX2pzb25wYXRoX2ZhaWxlZF92dyh7XG5cdFx0XHRcdHNlc3Npb25fc3RhcnRfdHM6IHBfc2Vzc2lvbl9zdGFydF90cyxcblx0XHRcdFx0ZGF0YXNldF9uYW1lOiBwX2RhdGFzZXRfbmFtZSxcblx0XHRcdFx0Y2hlY2tfY2F0ZWdvcnk6IHBfY2F0ZWdvcnlfbmFtZVxuXHRcdFx0fSk7XG5cdFx0XHRcblx0XHRcdGxvYWRlci5yZW1vdmUoKTtcblxuXHRcdFx0Y29uc3QgZ3JvdXBCeSA9IHRoaXMuZ3JvdXBSZWNvcmRzKGpzb24pXG5cdFx0XHRjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoZ3JvdXBCeSlcblx0XHRcdGNvbnNvbGUubG9nKGtleXMpXG5cdFx0XHRpZiAoa2V5cy5sZW5ndGggPT0gMSAmJiBrZXlzWzBdID09ICcnKVxuXHRcdFx0e1xuXHRcdFx0XHRjb25zdCBsaXN0ID0gZ3JvdXBCeVtrZXlzWzBdXVxuXHRcdFx0XHRmb3IgKGxldCBrMiA9IDA7IGsyIDwgbGlzdC5sZW5ndGg7IGsyKyspXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRjb25zdCBzZWN0aW9uUm93MiA9IG5ldyBPcGVuQ2xvc2VTZWN0aW9uKCk7XG5cdFx0XHRcdFx0dGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoc2VjdGlvblJvdzIpXG5cdFx0XHRcdFx0c2VjdGlvblJvdzIucmVmcmVzaCh0aGlzLmV4dHJhY3RIdW1hblJlYWRhYmxlTmFtZShsaXN0W2syXS5yZWNvcmRfanNvbnBhdGgsIGxpc3RbazJdLnJlY29yZF9qc29uKSwgJycgKyBsaXN0W2syXS5ucl9jaGVja19uYW1lcyArICcgY2hlY2sgZmFpbGVkJylcblx0XHRcdFx0XHRzZWN0aW9uUm93Mi5vbmNsaWNrID0gYXN5bmMgKCkgPT4ge1xuXHRcdFx0XHRcdFx0Y29uc3QganNvbjIgPSBhd2FpdCBBUEkzLmxpc3RfX2NhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfcmVjb3JkX2NoZWNrX2ZhaWxlZCh7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHNlc3Npb25fc3RhcnRfdHM6IHBfc2Vzc2lvbl9zdGFydF90cyxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YXNldF9uYW1lOiBwX2RhdGFzZXRfbmFtZSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2hlY2tfY2F0ZWdvcnk6IHBfY2F0ZWdvcnlfbmFtZSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVjb3JkX2pzb25wYXRoOiBsaXN0W2syXS5yZWNvcmRfanNvbnBhdGhcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0Zm9yIChsZXQgayA9IDA7IGsgPCBqc29uMi5sZW5ndGg7IGsrKylcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y29uc3Qgc2VjdGlvblJvdyA9IG5ldyBTZWN0aW9uUm93KCk7XG5cdFx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cyLmFkZEVsZW1lbnRUb0NvbnRlbnRBcmVhKHNlY3Rpb25Sb3cpXG5cdFx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cucmVmcmVzaChqc29uMltrXS5jaGVja19uYW1lKVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZVxuXHRcdFx0e1xuXHRcdFx0XHRmb3IgKGxldCBrID0gMDsgayA8IGtleXMubGVuZ3RoOyBrKyspXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRjb25zdCBzZWN0aW9uUm93ID0gbmV3IE9wZW5DbG9zZVNlY3Rpb24oKTtcblx0XHRcdFx0XHR0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChzZWN0aW9uUm93KVxuXHRcdFx0XHRcdHNlY3Rpb25Sb3cucmVmcmVzaChrZXlzW2tdLCAnJyArIGdyb3VwQnlba2V5c1trXV0ubGVuZ3RoICsgJyByZWNvcmRzJylcblx0XHRcdFx0XHRzZWN0aW9uUm93Lm9uY2xpY2sgPSAoKSA9PiB7XG5cdFx0XHRcdFx0XHRjb25zdCBsaXN0ID0gZ3JvdXBCeVtrZXlzW2tdXVxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2cobGlzdClcblx0XHRcdFx0XHRcdGZvciAobGV0IGsyID0gMDsgazIgPCBsaXN0Lmxlbmd0aDsgazIrKylcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y29uc3Qgc2VjdGlvblJvdzIgPSBuZXcgT3BlbkNsb3NlU2VjdGlvbigpO1xuXHRcdFx0XHRcdFx0XHRzZWN0aW9uUm93LmFkZEVsZW1lbnRUb0NvbnRlbnRBcmVhKHNlY3Rpb25Sb3cyKVxuXHRcdFx0XHRcdFx0XHRzZWN0aW9uUm93Mi5yZWZyZXNoKHRoaXMuZXh0cmFjdEh1bWFuUmVhZGFibGVOYW1lKGxpc3RbazJdLnJlY29yZF9qc29ucGF0aCwgbGlzdFtrMl0ucmVjb3JkX2pzb24pLCBsaXN0W2syXS5ucl9jaGVja19uYW1lcylcblx0XHRcdFx0XHRcdFx0c2VjdGlvblJvdzIub25jbGljayA9IGFzeW5jIChlKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKVxuXHRcdFx0XHRcdFx0XHRcdGNvbnN0IGpzb24yID0gYXdhaXQgQVBJMy5saXN0X19jYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X3JlY29yZF9jaGVja19mYWlsZWQoe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c2Vzc2lvbl9zdGFydF90czogcF9zZXNzaW9uX3N0YXJ0X3RzLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YXNldF9uYW1lOiBwX2RhdGFzZXRfbmFtZSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNoZWNrX2NhdGVnb3J5OiBwX2NhdGVnb3J5X25hbWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZWNvcmRfanNvbnBhdGg6IGxpc3RbazJdLnJlY29yZF9qc29ucGF0aFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBrID0gMDsgayA8IGpzb24yLmxlbmd0aDsgaysrKVxuXHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IHNlY3Rpb25Sb3cgPSBuZXcgU2VjdGlvblJvdygpO1xuXHRcdFx0XHRcdFx0XHRcdFx0c2VjdGlvblJvdzIuYWRkRWxlbWVudFRvQ29udGVudEFyZWEoc2VjdGlvblJvdylcblx0XHRcdFx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cucmVmcmVzaChqc29uMltrXS5jaGVja19uYW1lKVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ2NzLWRhdGFzZXQtaXNzdWVzLWRldGFpbCcsIERhdGFzZXRJc3N1ZXNEZXRhaWwpXG4iXX0=