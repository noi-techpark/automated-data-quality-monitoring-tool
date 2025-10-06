// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later
import { cs_cast } from "./quality.js";
import { API3 } from './api/api3.js';
import { OpenCloseSection } from "./OpenCloseSection.js";
import { SectionRow } from "./SectionRow.js";
import { Loader } from "./Loader.js";
import { DatasetIssueCategoryComponent } from "./DatasetIssueCategoryComponent.js";
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
    // info_and_settings: GeneralInfoAndSettings;
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
					
					.nextpagebutton {
															margin: auto;
															display: block;
															background-color: black;
															color: white;
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
					<!--<cs-general-info-and-settings></cs-general-info-and-settings>-->
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
        // this.info_and_settings = cs_cast(GeneralInfoAndSettings, this.sroot.querySelector('cs-general-info-and-settings'));
    }
    extractHumanReadableName(record_jsonpath, json) {
        let ret = '';
        for (let fn of ['sname', 'mvalidtime', 'mvalue', 'AccoDetail.de.Name', 'Detail.de.Title']) {
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
        // this.info_and_settings.refresh(p_session_start_ts, p_dataset_name, p_failed_records, p_tot_records)
        console.log(p_session_start_ts);
        console.log(p_dataset_name);
        console.log(p_category_name);
        (async () => {
            const data = await API3.list__catchsolve_noiodh__test_dataset_history_vw({
                dataset_name: this.last_dataset_name,
                check_category: this.last_check_category
            });
            // const goodarr  = []
            // const failarr  = []
            const labels = [];
            const datasets = [];
            for (let x = 0; x < data.length; x++) {
                const row = data[x];
                labels.push(row.session_start_ts.slice(0, 16).replace('T', ' '));
                const check_stats = JSON.parse(row.check_stats);
                console.log(check_stats);
                for (let c = 0; c < check_stats.length; c++) {
                    const check_stat = check_stats[c];
                    let found = false;
                    for (let d = 0; d < datasets.length; d++) {
                        if (datasets[d].label == check_stat.check_name) {
                            datasets[d].data.push(check_stat.failed_recs);
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        datasets.push({
                            label: check_stat.check_name,
                            data: [check_stat.failed_recs],
                            fill: false,
                            backgroundColor: '#aaa',
                            borderColor: '#aaa',
                            tension: 0.1
                        });
                    }
                }
                /*
                goodarr.push(data[x].tested_records - data[x].failed_recs)
                failarr.push(data[x].failed_recs)
                 */
            }
            const chartjs = await this.chartjs_promise;
            chartjs.data.labels = labels;
            chartjs.data.datasets = datasets;
            /*
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
                                    ]
            */
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
                section.refresh(issue.check_name, 'failed: ' + issue.nr_records + ' records');
                this.container.appendChild(section);
                section.onopen = async () => {
                    const moreButton = document.createElement('button');
                    moreButton.classList.add('nextpagebutton');
                    moreButton.textContent = 'next 100';
                    section.addElementToContentArea(moreButton);
                    let list_offset = 0;
                    const nextFun = async () => {
                        const json2 = await API3.list__catchsolve_noiodh__test_dataset_record_check_failed({
                            session_start_ts: p_session_start_ts,
                            dataset_name: p_dataset_name,
                            check_category: p_category_name,
                            check_name: issue.check_name,
                            limit: 100,
                            offset: list_offset
                        });
                        // const list = groupBy[keys[0]]
                        for (let k2 = 0; k2 < json2.length; k2++) {
                            const sectionRow2 = new SectionRow();
                            // section.addElementToContentArea(sectionRow2)
                            moreButton.parentElement.insertBefore(sectionRow2, moreButton);
                            sectionRow2.refresh(this.extractHumanReadableName(json2[k2].record_jsonpath, json2[k2].record_json));
                            // sectionRow2.refresh(json2[k2].problem_hint)
                            sectionRow2.onclick = () => {
                                alert(json2[k2].record_json);
                            };
                        }
                        list_offset += 100;
                    };
                    moreButton.onclick = nextFun;
                    nextFun();
                    /*
                    //console.log('sezione aperta, ricarico!')
                    const json2 = await API3.list__catchsolve_noiodh__test_dataset_record_check_failed({
                                session_start_ts: p_session_start_ts,
                                dataset_name: p_dataset_name,
                                check_category: p_category_name,
                                check_name: issue.check_name
                    });
                    const groupBy = this.groupRecords(json2)
                    const keys = Object.keys(groupBy)
                    console.log(keys)
                    if (keys.length == 1 && keys[0] == '')
                    {
                        const moreButton = document.createElement('button')
                        moreButton.textContent = 'next 10'
                        section.addElementToContentArea(moreButton)
                        const nextFun = () => {
                            const list = groupBy[keys[0]]
                            for (let k2 = 0; k2 < list.length; k2++)
                            {
                                const sectionRow2 = new SectionRow();
                                section.addElementToContentArea(sectionRow2)
                                // sectionRow2.refresh(this.extractHumanReadableName(list[k2].record_jsonpath, list[k2].record_json))
                                sectionRow2.refresh(list[k2].problem_hint)
                                sectionRow2.onclick = () => {
                                    alert(list[k2].record_json)
                                }
                            }
                            
                        }
                        moreButton.onclick = nextFun
                    }
                    else
                    {
                        for (let k = 0; k < keys.length; k++)
                        {
                            const sectionRow = new OpenCloseSection();
                            section.addElementToContentArea(sectionRow)
                            sectionRow.refresh(keys[k], '' + groupBy[keys[k]].length + ' records')
                            sectionRow.onclick = () => {
                                const list = groupBy[keys[k]]
                                console.log(list)
                                for (let k2 = 0; k2 < list.length; k2++)
                                {
                                    const sectionRow2 = new SectionRow();
                                    sectionRow.addElementToContentArea(sectionRow2)
                                    // sectionRow2.refresh(this.extractHumanReadableName(list[k2].record_jsonpath, list[k2].record_json))
                                    sectionRow2.refresh(list[k2].problem_hint)
                                    sectionRow2.onclick = () => {
                                        alert(list[k2].record_json)
                                    }
                                }
                            }
                        }
                    }
                    */
                };
            }
        }
        if (this.current_tab === 'records') {
            this.issues.classList.remove('selected');
            this.records.classList.add('selected');
            const moreButton = document.createElement('button');
            moreButton.classList.add('nextpagebutton');
            moreButton.textContent = 'next 100';
            this.container.appendChild(moreButton);
            let list_offset = 0;
            const nextFun = async () => {
                const loader = new Loader();
                this.container.appendChild(loader);
                const list = await API3.list__catchsolve_noiodh__test_dataset_check_category_record_jsonpath_failed_vw({
                    session_start_ts: p_session_start_ts,
                    dataset_name: p_dataset_name,
                    check_category: p_category_name,
                    offset: list_offset,
                    limit: 100
                });
                loader.remove();
                for (let k2 = 0; k2 < list.length; k2++) {
                    const sectionRow2 = new OpenCloseSection();
                    // this.container.appendChild(sectionRow2)
                    moreButton.parentElement.insertBefore(sectionRow2, moreButton);
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
                list_offset += 100;
            };
            moreButton.onclick = nextFun;
            nextFun();
            /*
            const groupBy = this.groupRecords(json)
            const keys = Object.keys(groupBy)
            console.log(keys)
            if (keys.length == 1 && keys[0] == '')
            {
                const list = groupBy[keys[0]]
                for (let k2 = 0; k2 < list.length; k2++)
                {
                    const sectionRow2 = new OpenCloseSection();
                    this.container.appendChild(sectionRow2)
                    sectionRow2.refresh(this.extractHumanReadableName(list[k2].record_jsonpath, list[k2].record_json), '' + list[k2].nr_check_names + ' check failed')
                    sectionRow2.onclick = async () => {
                        const json2 = await API3.list__catchsolve_noiodh__test_dataset_record_check_failed({
                                                    session_start_ts: p_session_start_ts,
                                                    dataset_name: p_dataset_name,
                                                    check_category: p_category_name,
                                                    record_jsonpath: list[k2].record_jsonpath
                                            });

                        for (let k = 0; k < json2.length; k++)
                        {
                            const sectionRow = new SectionRow();
                            sectionRow2.addElementToContentArea(sectionRow)
                            sectionRow.refresh("failed: " + json2[k].check_name)
                        }
                    }
                }
            }
            else
            {
                for (let k = 0; k < keys.length; k++)
                {
                    const sectionRow = new OpenCloseSection();
                    this.container.appendChild(sectionRow)
                    sectionRow.refresh(keys[k], '' + groupBy[keys[k]].length + ' records')
                    sectionRow.onclick = () => {
                        const list = groupBy[keys[k]]
                        console.log(list)
                        for (let k2 = 0; k2 < list.length; k2++)
                        {
                            const sectionRow2 = new OpenCloseSection();
                            sectionRow.addElementToContentArea(sectionRow2)
                            sectionRow2.refresh(this.extractHumanReadableName(list[k2].record_jsonpath, list[k2].record_json), list[k2].nr_check_names)
                            sectionRow2.onclick = async (e) => {
                                e.stopPropagation()
                                const json2 = await API3.list__catchsolve_noiodh__test_dataset_record_check_failed({
                                                                                    session_start_ts: p_session_start_ts,
                                                                                    dataset_name: p_dataset_name,
                                                                                    check_category: p_category_name,
                                                                                    record_jsonpath: list[k2].record_jsonpath
                                                    });
                                for (let k = 0; k < json2.length; k++)
                                {
                                    const sectionRow = new SectionRow();
                                    sectionRow2.addElementToContentArea(sectionRow)
                                    sectionRow.refresh(json2[k].check_name)
                                }
                                
                            }
                        }
                    }
                }
            }
             */
        }
    }
}
customElements.define('cs-dataset-issues-detail', DatasetIssuesDetail);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YXNldElzc3Vlc0RldGFpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3R5cGVzY3JpcHQvRGF0YXNldElzc3Vlc0RldGFpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw4REFBOEQ7QUFDOUQsRUFBRTtBQUNGLDZDQUE2QztBQUc3QyxPQUFPLEVBQUUsT0FBTyxFQUFZLE1BQU0sY0FBYyxDQUFDO0FBQ2pELE9BQU8sRUFBQyxJQUFJLEVBQTJELE1BQU0sZUFBZSxDQUFDO0FBQzdGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3pELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ3JDLE9BQU8sRUFBRSw2QkFBNkIsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBR25GLE1BQU0sT0FBTyxtQkFBb0IsU0FBUSxXQUFXO0lBR25ELFNBQVMsQ0FBQTtJQUVULHFCQUFxQixHQUFnQixJQUFJLENBQUE7SUFDekMsaUJBQWlCLEdBQWdCLElBQUksQ0FBQTtJQUNyQyxtQkFBbUIsR0FBZ0IsSUFBSSxDQUFBO0lBQ3ZDLG1CQUFtQixHQUFnQixJQUFJLENBQUE7SUFDdkMsZ0JBQWdCLEdBQWdCLElBQUksQ0FBQTtJQUVwQyxXQUFXLEdBQXlCLFFBQVEsQ0FBQTtJQUU1QyxLQUFLLENBQUE7SUFFTCxNQUFNLENBQUE7SUFFTixvQkFBb0I7SUFDcEIsZ0RBQWdEO0lBRWhELGVBQWUsQ0FBb0I7SUFDbkMsZUFBZSxDQUFnQjtJQUUvQixNQUFNLENBQWtCO0lBQ3hCLE9BQU8sQ0FBa0I7SUFDdEIsNkNBQTZDO0lBRWhELGlCQUFpQjtRQUVoQixtRUFBbUU7UUFDbkUsTUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNwQyxJQUFJLEVBQUUsTUFBTTtZQUNaLElBQUks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QyxPQUFPLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQTt3QkFDckQsQ0FBQztvQkFDRixDQUFDLENBQUE7Z0JBQ0YsQ0FBQztnQkFDRCxXQUFXLElBQUksR0FBRyxDQUFBO1lBQ25CLENBQUMsQ0FBQTtZQUNELFVBQVUsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFBO1lBQzVCLE9BQU8sRUFBRSxDQUFBO1lBR1Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7ZUFnRUc7UUFDSixDQUFDO0lBQ0YsQ0FBQztDQUNEO0FBRUQsY0FBYyxDQUFDLE1BQU0sQ0FBQywwQkFBMEIsRUFBRSxtQkFBbUIsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gU1BEWC1GaWxlQ29weXJpZ2h0VGV4dDogMjAyNCBDYXRjaCBTb2x2ZSBkaSBEYXZpZGUgTW9udGVzaW5cbi8vXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQUdQTC0zLjAtb3ItbGF0ZXJcblxuXG5pbXBvcnQgeyBjc19jYXN0LCB0aHJvd05QRSB9IGZyb20gXCIuL3F1YWxpdHkuanNcIjtcbmltcG9ydCB7QVBJMywgY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9yZWNvcmRfY2hlY2tfZmFpbGVkX19yb3d9IGZyb20gJy4vYXBpL2FwaTMuanMnO1xuaW1wb3J0IHsgT3BlbkNsb3NlU2VjdGlvbiB9IGZyb20gXCIuL09wZW5DbG9zZVNlY3Rpb24uanNcIjtcbmltcG9ydCB7IFNlY3Rpb25Sb3cgfSBmcm9tIFwiLi9TZWN0aW9uUm93LmpzXCI7XG5pbXBvcnQgeyBMb2FkZXIgfSBmcm9tIFwiLi9Mb2FkZXIuanNcIjtcbmltcG9ydCB7IERhdGFzZXRJc3N1ZUNhdGVnb3J5Q29tcG9uZW50IH0gZnJvbSBcIi4vRGF0YXNldElzc3VlQ2F0ZWdvcnlDb21wb25lbnQuanNcIjtcbmltcG9ydCB7IEdlbmVyYWxJbmZvQW5kU2V0dGluZ3MgfSBmcm9tIFwiLi9HZW5lcmFsSW5mb0FuZFNldHRpbmdzLmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBEYXRhc2V0SXNzdWVzRGV0YWlsIGV4dGVuZHMgSFRNTEVsZW1lbnRcbntcblx0XG5cdGNvbnRhaW5lciBcblx0XG5cdGxhc3Rfc2Vzc2lvbl9zdGFydF90czogc3RyaW5nfG51bGwgPSBudWxsXG5cdGxhc3RfZGF0YXNldF9uYW1lOiBzdHJpbmd8bnVsbCA9IG51bGxcblx0bGFzdF9jaGVja19jYXRlZ29yeTogc3RyaW5nfG51bGwgPSBudWxsXG5cdGxhc3RfZmFpbGVkX3JlY29yZHM6IG51bWJlcnxudWxsID0gbnVsbFxuXHRsYXN0X3RvdF9yZWNvcmRzOiBudW1iZXJ8bnVsbCA9IG51bGxcblx0XG5cdGN1cnJlbnRfdGFiOiAnaXNzdWVzJyB8ICdyZWNvcmRzJyA9ICdpc3N1ZXMnXG5cdFxuXHRzcm9vdFxuXHRcblx0Y2FudmFzXG5cdFxuXHQvLyBjb25uZWN0ZWRfcHJvbWlzZVxuXHQvLyBjb25uZWN0ZWRfZnVuYzogKHM6IG51bGwpID0+IHZvaWQgPSBzID0+IG51bGxcblx0XG5cdGNoYXJ0anNfc3VjY2VzczogKHM6IENoYXJ0KSA9PiB2b2lkXG5cdGNoYXJ0anNfcHJvbWlzZTogUHJvbWlzZTxDaGFydD5cblxuXHRpc3N1ZXM6IEhUTUxTcGFuRWxlbWVudDtcblx0cmVjb3JkczogSFRNTFNwYW5FbGVtZW50O1xuICAgIC8vIGluZm9fYW5kX3NldHRpbmdzOiBHZW5lcmFsSW5mb0FuZFNldHRpbmdzO1xuXG5cdGNvbm5lY3RlZENhbGxiYWNrKClcblx0e1xuXHRcdC8vIGNoYXJ0anMgbmVlZCB0byBiZSBjcmVhdGVkIHdoZW4gZWxlbWVudCBpcyBhdHRhY2hlZCBpbnRvIHRoZSBkb21cblx0XHRjb25zdCBjaGFydCA9IG5ldyBDaGFydCh0aGlzLmNhbnZhcywge1xuXHRcdFx0dHlwZTogJ2xpbmUnLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRsYWJlbHM6IFsnLTUnLCctNCcsJy0zJywgJy0yJywgJy0xJ10sXG5cdFx0XHRcdGRhdGFzZXRzOiBbXVxuXHRcdFx0fSxcblx0XHRcdG9wdGlvbnM6IHtcblx0XHRcdFx0c2NhbGVzOiB7XG5cdFx0XHRcdFx0eToge1xuXHRcdFx0XHRcdFx0c3RhY2tlZDogdHJ1ZSxcblx0XHRcdFx0XHRcdGJlZ2luQXRaZXJvOiB0cnVlXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFxuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdFxuXHRcdHRoaXMuY2hhcnRqc19zdWNjZXNzKGNoYXJ0KVxuXHR9XG5cdFxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpXG5cdFx0dGhpcy5jaGFydGpzX3N1Y2Nlc3MgPSAocykgPT4ge30gLy8gZHVtbXkgaW5pdGlhbGl6YXRpb24sIG5leHQgbGluZSB3aWxsIGluaXQgY2hhcnRqc19zdWNjZXNzIGJ1dCBjb21waWxlciBkb24ndCB1bmRlcnN0YW5kIHRoaXMhXG5cdFx0dGhpcy5jaGFydGpzX3Byb21pc2UgPSBuZXcgUHJvbWlzZShzID0+IHRoaXMuY2hhcnRqc19zdWNjZXNzID0gcylcblx0XHR0aGlzLnNyb290ID0gdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSlcblx0XHR0aGlzLnNyb290LmlubmVySFRNTCA9IGBcblx0XHRcdFx0PHN0eWxlPlxuXHRcdFx0XHRcdDpob3N0IHtcblx0XHRcdFx0XHRcdHBhZGRpbmc6IDAuNXJlbTtcblx0XHRcdFx0XHRcdGRpc3BsYXk6IGJsb2NrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQuY29udGFpbmVyIHtcblx0XHRcdFx0XHRcdGJvcmRlcjogMXB4IHNvbGlkICNjY2M7XG5cdFx0XHRcdFx0XHRib3JkZXItcmFkaXVzOiAwLjNyZW07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdC5jb250YWluZXIgPiAqIHtcblx0XHRcdFx0XHRcdGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjY2NjO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQuaGVhZGVyIHtcblx0XHRcdFx0XHRcdGRpc3BsYXk6IGZsZXg7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC5oZWFkZXIgLmNoYXJ0IHtcblx0XHRcdFx0XHRcdHdpZHRoOiA1MCU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdC5hY3Rpb25zIHtcblx0XHRcdFx0XHRcdGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xuXHRcdFx0XHRcdFx0d2lkdGg6IDEwcmVtO1xuXHRcdFx0XHRcdFx0bWFyZ2luLWxlZnQ6IGF1dG87XG5cdFx0XHRcdFx0XHRkaXNwbGF5OiBmbGV4O1xuXHRcdFx0XHRcdFx0Ym9yZGVyLXJhZGl1czogMC40cmVtO1xuXHRcdFx0XHRcdFx0bWFyZ2luLWJvdHRvbTogMC41cmVtO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcblx0XHRcdFx0XHQuYWN0aW9ucyBzcGFuLnNlbGVjdGVkIHtcblx0XHRcdFx0XHRcdGNvbG9yOiB3aGl0ZTtcblx0XHRcdFx0XHRcdGJhY2tncm91bmQtY29sb3I6IGJsYWNrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcblx0XHRcdFx0XHQuYWN0aW9ucyBzcGFuIHtcblx0XHRcdFx0XHRcdGZsZXgtZ3JvdzogNTA7XG5cdFx0XHRcdFx0XHR0ZXh0LWFsaWduOiBjZW50ZXI7XG5cdFx0XHRcdFx0XHRjdXJzb3I6IHBvaW50ZXI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdC5uZXh0cGFnZWJ1dHRvbiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtYXJnaW46IGF1dG87XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkaXNwbGF5OiBibG9jaztcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGJhY2tncm91bmQtY29sb3I6IGJsYWNrO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y29sb3I6IHdoaXRlO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcblxuXHRcdFx0XHRcblx0XHRcdFx0PC9zdHlsZT5cblx0XHRcdFx0PCEtLSA8aW1nIHNyYz1cImtwaS1kZXRhaWwucG5nXCIgc3R5bGU9XCJtYXgtd2lkdGg6IDEwMCVcIj4gLS0+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJoZWFkZXJcIj5cblx0XHRcdFx0XHQ8ZGl2PlxuXHRcdFx0XHRcdFx0PGNzLWRhdGFzZXQtaXNzdWUtY2F0ZWdvcnk+PC9jcy1kYXRhc2V0LWlzc3VlLWNhdGVnb3J5PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjaGFydFwiPlxuXHRcdFx0XHRcdFx0PGNhbnZhcz48L2NhbnZhcz5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8IS0tPGNzLWdlbmVyYWwtaW5mby1hbmQtc2V0dGluZ3M+PC9jcy1nZW5lcmFsLWluZm8tYW5kLXNldHRpbmdzPi0tPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PGRpdiBzdHlsZT1cIndpZHRoOiBjYWxjKDEwMCUgLSAyMHB4KVwiPlxuXHRcdFx0XHRcdDxkaXYgc3R5bGU9XCJ0ZXh0LWFsaWduOiByaWdodFwiIGNsYXNzPVwiYWN0aW9uc1wiPlxuXHRcdFx0XHRcdFx0PHNwYW4gY2xhc3M9XCJpc3N1ZXNcIj5Jc3N1ZXM8L3NwYW4+XG5cdFx0XHRcdFx0XHQ8c3BhbiBjbGFzcz1cInJlY29yZHNcIj5SZWNvcmRzPC9zcGFuPlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj48L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdGBcblxuXHRcdGN1c3RvbUVsZW1lbnRzLnVwZ3JhZGUodGhpcy5zcm9vdClcblxuXHRcdHRoaXMuY29udGFpbmVyID0gY3NfY2FzdChIVE1MRGl2RWxlbWVudCwgdGhpcy5zcm9vdC5xdWVyeVNlbGVjdG9yKCcuY29udGFpbmVyJykpXG5cdFx0XG5cdFx0dGhpcy5pc3N1ZXMgPSBjc19jYXN0KEhUTUxTcGFuRWxlbWVudCwgdGhpcy5zcm9vdC5xdWVyeVNlbGVjdG9yKCcuaXNzdWVzJykpXG5cdFx0dGhpcy5yZWNvcmRzID0gY3NfY2FzdChIVE1MU3BhbkVsZW1lbnQsIHRoaXMuc3Jvb3QucXVlcnlTZWxlY3RvcignLnJlY29yZHMnKSlcblx0XHRcblx0XHR0aGlzLmlzc3Vlcy5vbmNsaWNrID0gKCkgPT4ge1xuXHRcdFx0dGhpcy5jdXJyZW50X3RhYiA9ICdpc3N1ZXMnXG5cdFx0XHRpZiAodGhpcy5sYXN0X3Nlc3Npb25fc3RhcnRfdHMgIT0gbnVsbCAmJiB0aGlzLmxhc3RfZGF0YXNldF9uYW1lICE9IG51bGwgJiYgdGhpcy5sYXN0X2NoZWNrX2NhdGVnb3J5ICE9IG51bGxcblx0XHRcdFx0JiYgdGhpcy5sYXN0X2ZhaWxlZF9yZWNvcmRzICE9IG51bGwgJiYgdGhpcy5sYXN0X3RvdF9yZWNvcmRzICE9IG51bGwpXG5cdFx0XHRcdHRoaXMucmVmcmVzaCh0aGlzLmxhc3Rfc2Vzc2lvbl9zdGFydF90cywgdGhpcy5sYXN0X2RhdGFzZXRfbmFtZSwgdGhpcy5sYXN0X2NoZWNrX2NhdGVnb3J5LCB0aGlzLmxhc3RfZmFpbGVkX3JlY29yZHMsIHRoaXMubGFzdF90b3RfcmVjb3Jkcylcblx0XHR9XG5cdFx0XG5cdFx0dGhpcy5yZWNvcmRzLm9uY2xpY2sgPSAoKSA9PiB7XG5cdFx0XHR0aGlzLmN1cnJlbnRfdGFiID0gJ3JlY29yZHMnXG5cdFx0XHRpZiAodGhpcy5sYXN0X3Nlc3Npb25fc3RhcnRfdHMgIT0gbnVsbCAmJiB0aGlzLmxhc3RfZGF0YXNldF9uYW1lICE9IG51bGwgJiYgdGhpcy5sYXN0X2NoZWNrX2NhdGVnb3J5ICE9IG51bGxcblx0XHRcdFx0JiYgdGhpcy5sYXN0X2ZhaWxlZF9yZWNvcmRzICE9IG51bGwgJiYgdGhpcy5sYXN0X3RvdF9yZWNvcmRzICE9IG51bGwpXG5cdFx0XHRcdHRoaXMucmVmcmVzaCh0aGlzLmxhc3Rfc2Vzc2lvbl9zdGFydF90cywgdGhpcy5sYXN0X2RhdGFzZXRfbmFtZSwgdGhpcy5sYXN0X2NoZWNrX2NhdGVnb3J5LCB0aGlzLmxhc3RfZmFpbGVkX3JlY29yZHMsIHRoaXMubGFzdF90b3RfcmVjb3Jkcylcblx0XHR9XG5cdFx0XG5cdFx0dGhpcy5jYW52YXMgPSBjc19jYXN0KEhUTUxDYW52YXNFbGVtZW50LCB0aGlzLnNyb290LnF1ZXJ5U2VsZWN0b3IoJ2NhbnZhcycpKTtcblx0XHRcblx0XHQvLyB0aGlzLmluZm9fYW5kX3NldHRpbmdzID0gY3NfY2FzdChHZW5lcmFsSW5mb0FuZFNldHRpbmdzLCB0aGlzLnNyb290LnF1ZXJ5U2VsZWN0b3IoJ2NzLWdlbmVyYWwtaW5mby1hbmQtc2V0dGluZ3MnKSk7XG5cblxuXHR9XG5cdFxuXHRleHRyYWN0SHVtYW5SZWFkYWJsZU5hbWUocmVjb3JkX2pzb25wYXRoOiBzdHJpbmcsIGpzb246IHN0cmluZyk6IHN0cmluZ1xuXHR7XG5cdFx0bGV0IHJldCA9ICcnO1xuXHRcdGZvciAobGV0IGZuIG9mIFsnc25hbWUnLCAnbXZhbGlkdGltZScsICdtdmFsdWUnLCAnQWNjb0RldGFpbC5kZS5OYW1lJywgJ0RldGFpbC5kZS5UaXRsZSddKVxuXHRcdHtcblx0XHRcdGNvbnN0IGZuX3BhcnRzID0gZm4uc3BsaXQoJy4nKVxuXHRcdFx0bGV0IHZhbCA9IEpTT04ucGFyc2UoanNvbilcblx0XHRcdGZvciAobGV0IHAgb2YgZm5fcGFydHMpXG5cdFx0XHR7XG5cdFx0XHRcdHZhbCA9IHZhbFtwXVxuXHRcdFx0XHRpZiAodmFsID09PSB1bmRlZmluZWQpXG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHQvLyBjb25zdCB2YWwgPSBzdGFydFtmbl0gXG5cdFx0XHRpZiAodmFsICE9PSB1bmRlZmluZWQpXG5cdFx0XHRcdHJldCArPSAocmV0ID09PSAnJyA/ICcnIDogJywgJykgKyBmbiArICc9JyArIEpTT04uc3RyaW5naWZ5KHZhbClcblx0XHR9XG5cdFx0aWYgKHJldCA9PSAnJylcblx0XHRcdHJldCA9IHJlY29yZF9qc29ucGF0aFxuXHRcdHJldHVybiByZXQ7XG5cdH1cblx0XG5cdGdyb3VwUmVjb3JkcyhsaXN0OiB7cmVjb3JkX2pzb246IHN0cmluZ31bXSk6IHtbazpzdHJpbmddOiBhbnlbXX1cblx0e1xuXHRcdGNvbnN0IGdyb3VwQnk6IHtbazpzdHJpbmddOiBhbnlbXX0gPSB7fVxuXHRcdGZvciAobGV0IGsgPSAwOyBrIDwgbGlzdC5sZW5ndGg7IGsrKylcblx0XHR7XG5cdFx0XHRjb25zdCBqc29uID0gSlNPTi5wYXJzZShsaXN0W2tdLnJlY29yZF9qc29uKTtcblx0XHRcdGxldCBzbmFtZSA9IGpzb25bJ3NuYW1lJ107XG5cdFx0XHRpZiAodHlwZW9mIHNuYW1lICE9PSAnc3RyaW5nJylcblx0XHRcdFx0c25hbWUgPSAnJ1xuXHRcdFx0bGV0IHByZXZfYXJyID0gZ3JvdXBCeVtzbmFtZV1cblx0XHRcdHByZXZfYXJyID0gcHJldl9hcnIgPT09IHVuZGVmaW5lZCA/IFtdIDogcHJldl9hcnJcblx0XHRcdHByZXZfYXJyLnB1c2gobGlzdFtrXSlcblx0XHRcdGdyb3VwQnlbc25hbWVdID0gcHJldl9hcnJcblx0XHR9XG5cdFx0cmV0dXJuIGdyb3VwQnk7IFxuXHR9XG5cdFxuXHRhc3luYyByZWZyZXNoKHBfc2Vzc2lvbl9zdGFydF90czogc3RyaW5nLCBwX2RhdGFzZXRfbmFtZTogc3RyaW5nLCBwX2NhdGVnb3J5X25hbWU6IHN0cmluZywgcF9mYWlsZWRfcmVjb3JkczogbnVtYmVyLCBwX3RvdF9yZWNvcmRzOiBudW1iZXIpIHtcblx0XHRcblx0XHR0aGlzLmxhc3Rfc2Vzc2lvbl9zdGFydF90cyA9IHBfc2Vzc2lvbl9zdGFydF90c1xuXHRcdHRoaXMubGFzdF9kYXRhc2V0X25hbWUgPSBwX2RhdGFzZXRfbmFtZVxuXHRcdHRoaXMubGFzdF9jaGVja19jYXRlZ29yeSA9IHBfY2F0ZWdvcnlfbmFtZVxuXHRcdHRoaXMubGFzdF9mYWlsZWRfcmVjb3JkcyA9IHBfZmFpbGVkX3JlY29yZHNcblx0XHR0aGlzLmxhc3RfdG90X3JlY29yZHMgPSBwX3RvdF9yZWNvcmRzXG5cdFx0XG5cdFx0Ly8gdGhpcy5pbmZvX2FuZF9zZXR0aW5ncy5yZWZyZXNoKHBfc2Vzc2lvbl9zdGFydF90cywgcF9kYXRhc2V0X25hbWUsIHBfZmFpbGVkX3JlY29yZHMsIHBfdG90X3JlY29yZHMpXG5cdFx0XG5cdFx0Y29uc29sZS5sb2cocF9zZXNzaW9uX3N0YXJ0X3RzKVxuXHRcdGNvbnNvbGUubG9nKHBfZGF0YXNldF9uYW1lKVxuXHRcdGNvbnNvbGUubG9nKHBfY2F0ZWdvcnlfbmFtZSk7XG5cdFx0XG5cdFx0KGFzeW5jICgpID0+IHtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRjb25zdCBkYXRhID0gYXdhaXQgQVBJMy5saXN0X19jYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X2hpc3Rvcnlfdncoe1xuXHRcdFx0XHRcdFx0ZGF0YXNldF9uYW1lOiB0aGlzLmxhc3RfZGF0YXNldF9uYW1lISxcblx0XHRcdFx0XHRcdGNoZWNrX2NhdGVnb3J5OiB0aGlzLmxhc3RfY2hlY2tfY2F0ZWdvcnkhXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcblx0XHRcdFx0XHQvLyBjb25zdCBnb29kYXJyICA9IFtdXG5cdFx0XHRcdFx0Ly8gY29uc3QgZmFpbGFyciAgPSBbXVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGNvbnN0IGxhYmVscyAgID0gW11cblx0XHRcdFx0XHRjb25zdCBkYXRhc2V0cyA9IFtdXG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0Zm9yIChsZXQgeCA9IDA7IHggPCBkYXRhLmxlbmd0aDsgeCsrKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGNvbnN0IHJvdyA9IGRhdGFbeF1cblx0XHRcdFx0XHRcdGxhYmVscy5wdXNoKHJvdy5zZXNzaW9uX3N0YXJ0X3RzLnNsaWNlKDAsMTYpLnJlcGxhY2UoJ1QnLCAnICcpKVxuXHRcdFx0XHRcdFx0Y29uc3QgY2hlY2tfc3RhdHMgPSBKU09OLnBhcnNlKHJvdy5jaGVja19zdGF0cyk7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhjaGVja19zdGF0cylcblx0XHRcdFx0XHRcdGZvciAobGV0IGMgPSAwOyBjIDwgY2hlY2tfc3RhdHMubGVuZ3RoOyBjKyspXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IGNoZWNrX3N0YXQgPSBjaGVja19zdGF0c1tjXVxuXHRcdFx0XHRcdFx0XHRsZXQgZm91bmQgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgZCA9IDA7IGQgPCBkYXRhc2V0cy5sZW5ndGg7IGQrKylcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdGlmIChkYXRhc2V0c1tkXS5sYWJlbCA9PSBjaGVja19zdGF0LmNoZWNrX25hbWUpXG5cdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YXNldHNbZF0uZGF0YS5wdXNoKGNoZWNrX3N0YXQuZmFpbGVkX3JlY3MpXG5cdFx0XHRcdFx0XHRcdFx0XHRmb3VuZCA9IHRydWVcblx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZiAoIWZvdW5kKVxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0ZGF0YXNldHMucHVzaCh7XG5cdFx0XHRcdFx0XHRcdFx0XHRsYWJlbDogY2hlY2tfc3RhdC5jaGVja19uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YTogW2NoZWNrX3N0YXQuZmFpbGVkX3JlY3NdLFxuXHRcdFx0XHRcdFx0XHRcdFx0ZmlsbDogZmFsc2UsXG5cdFx0XHRcdFx0XHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6ICcjYWFhJyxcblx0XHRcdFx0XHRcdFx0XHRcdGJvcmRlckNvbG9yOiAnI2FhYScsXG5cdFx0XHRcdFx0XHRcdFx0XHR0ZW5zaW9uOiAwLjFcblx0XHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQvKlxuXHRcdFx0XHRcdFx0Z29vZGFyci5wdXNoKGRhdGFbeF0udGVzdGVkX3JlY29yZHMgLSBkYXRhW3hdLmZhaWxlZF9yZWNzKVxuXHRcdFx0XHRcdFx0ZmFpbGFyci5wdXNoKGRhdGFbeF0uZmFpbGVkX3JlY3MpXG5cdFx0XHRcdFx0XHQgKi9cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0Y29uc3QgY2hhcnRqcyA9IGF3YWl0IHRoaXMuY2hhcnRqc19wcm9taXNlXG5cdFx0XHRcdFx0Y2hhcnRqcy5kYXRhLmxhYmVscyA9IGxhYmVsc1xuXHRcdFx0XHRcdGNoYXJ0anMuZGF0YS5kYXRhc2V0cyA9IGRhdGFzZXRzXG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0Lypcblx0XHRcdFx0XHRjaGFydGpzLmRhdGEuZGF0YXNldHMgPSBbXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxhYmVsOiAnZmFpbCB0cmVuZCcsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGE6IGZhaWxhcnIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZpbGw6IGZhbHNlLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6ICcjMjIyJyxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ym9yZGVyQ29sb3I6ICcjMjIyJyxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGVuc2lvbjogMC4xXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsYWJlbDogJ3RvdGFsIHRyZW5kJyxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YTogZ29vZGFycixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZmlsbDogZmFsc2UsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGJhY2tncm91bmRDb2xvcjogJyNhYWEnLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRib3JkZXJDb2xvcjogJyNhYWEnLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0ZW5zaW9uOiAwLjFcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0sXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XVxuXHRcdFx0XHRcdCovXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0Y2hhcnRqcy51cGRhdGUoKVxuXHRcdFx0XHRcdFx0XHRcdFx0XG5cdFx0fSkoKTtcblx0XHRcblx0XHRjb25zdCBjYXRlZ29yeSA9IGNzX2Nhc3QoRGF0YXNldElzc3VlQ2F0ZWdvcnlDb21wb25lbnQsIHRoaXMuc3Jvb3QucXVlcnlTZWxlY3RvcignY3MtZGF0YXNldC1pc3N1ZS1jYXRlZ29yeScpKVxuXHRcdGNhdGVnb3J5LmhpZGVNb3JlRGl2KClcblx0XHRjYXRlZ29yeS5yZWZyZXNoKFxuXHRcdHtcblx0XHRcdGRhdGFzZXRfbmFtZTogcF9kYXRhc2V0X25hbWUsXG5cdFx0XHRzZXNzaW9uX3N0YXJ0X3RzOiBwX3Nlc3Npb25fc3RhcnRfdHMsXG5cdFx0XHRjaGVja19jYXRlZ29yeTogcF9jYXRlZ29yeV9uYW1lLFxuXHRcdFx0ZmFpbGVkX3JlY29yZHM6IHBfZmFpbGVkX3JlY29yZHMsXG5cdFx0XHR0b3RfcmVjb3JkczogcF90b3RfcmVjb3Jkc1xuXHRcdH0pXG5cdFx0XG5cdFx0dGhpcy5jb250YWluZXIudGV4dENvbnRlbnQgPSAnJ1xuXHRcdFxuXHRcdGlmICh0aGlzLmN1cnJlbnRfdGFiID09PSAnaXNzdWVzJylcblx0XHR7XG5cdFx0XHR0aGlzLnJlY29yZHMuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKVxuXHRcdFx0dGhpcy5pc3N1ZXMuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKVxuXHRcdFx0XG5cdFx0XHRjb25zdCBsb2FkZXIgPSBuZXcgTG9hZGVyKCk7XG5cdFx0XHR0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChsb2FkZXIpXG5cdFx0XG5cdFx0XHRjb25zdCBqc29uID0gYXdhaXQgQVBJMy5saXN0X19jYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X2NoZWNrX2NhdGVnb3J5X2NoZWNrX25hbWVfcmVjb3JkX3JlY29yZF9mYWlsZWRfdncoe1xuXHRcdFx0XHRzZXNzaW9uX3N0YXJ0X3RzOiBwX3Nlc3Npb25fc3RhcnRfdHMsXG5cdFx0XHRcdGRhdGFzZXRfbmFtZTogcF9kYXRhc2V0X25hbWUsXG5cdFx0XHRcdGNoZWNrX2NhdGVnb3J5OiBwX2NhdGVnb3J5X25hbWVcblx0XHRcdH0pXG5cblx0XHRcdGxvYWRlci5yZW1vdmUoKTtcblx0XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGpzb24ubGVuZ3RoOyBpKyspXG5cdFx0XHR7XG5cdFx0XHRcdGNvbnN0IGlzc3VlID0ganNvbltpXVxuXHRcdFx0XHQvLyBjb25zb2xlLmxvZyhpc3N1ZSlcblx0XHRcdFx0Y29uc3Qgc2VjdGlvbiA9IG5ldyBPcGVuQ2xvc2VTZWN0aW9uKClcblx0XHRcdFx0c2VjdGlvbi5yZWZyZXNoKGlzc3VlLmNoZWNrX25hbWUsICdmYWlsZWQ6ICcgKyBpc3N1ZS5ucl9yZWNvcmRzICsgJyByZWNvcmRzJylcblx0XHRcdFx0dGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoc2VjdGlvbilcblx0XHRcdFx0XG5cdFx0XHRcdHNlY3Rpb24ub25vcGVuID0gYXN5bmMgKCkgPT4ge1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGNvbnN0IG1vcmVCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKVxuXHRcdFx0XHRcdG1vcmVCdXR0b24uY2xhc3NMaXN0LmFkZCgnbmV4dHBhZ2VidXR0b24nKVxuXHRcdFx0XHRcdG1vcmVCdXR0b24udGV4dENvbnRlbnQgPSAnbmV4dCAxMDAnXG5cdFx0XHRcdFx0c2VjdGlvbi5hZGRFbGVtZW50VG9Db250ZW50QXJlYShtb3JlQnV0dG9uKVxuXHRcdFx0XHRcdGxldCBsaXN0X29mZnNldCA9IDBcblx0XHRcdFx0XHRjb25zdCBuZXh0RnVuID0gYXN5bmMgKCkgPT4ge1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRjb25zdCBqc29uMiA9IGF3YWl0IEFQSTMubGlzdF9fY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9yZWNvcmRfY2hlY2tfZmFpbGVkKHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzZXNzaW9uX3N0YXJ0X3RzOiBwX3Nlc3Npb25fc3RhcnRfdHMsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YXNldF9uYW1lOiBwX2RhdGFzZXRfbmFtZSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjaGVja19jYXRlZ29yeTogcF9jYXRlZ29yeV9uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNoZWNrX25hbWU6IGlzc3VlLmNoZWNrX25hbWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGltaXQ6IDEwMCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvZmZzZXQ6IGxpc3Rfb2Zmc2V0XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdC8vIGNvbnN0IGxpc3QgPSBncm91cEJ5W2tleXNbMF1dXG5cdFx0XHRcdFx0XHRmb3IgKGxldCBrMiA9IDA7IGsyIDwganNvbjIubGVuZ3RoOyBrMisrKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRjb25zdCBzZWN0aW9uUm93MiA9IG5ldyBTZWN0aW9uUm93KCk7XG5cdFx0XHRcdFx0XHRcdC8vIHNlY3Rpb24uYWRkRWxlbWVudFRvQ29udGVudEFyZWEoc2VjdGlvblJvdzIpXG5cdFx0XHRcdFx0XHRcdG1vcmVCdXR0b24ucGFyZW50RWxlbWVudCEuaW5zZXJ0QmVmb3JlKHNlY3Rpb25Sb3cyLCBtb3JlQnV0dG9uKVxuXHRcdFx0XHRcdFx0XHRzZWN0aW9uUm93Mi5yZWZyZXNoKHRoaXMuZXh0cmFjdEh1bWFuUmVhZGFibGVOYW1lKGpzb24yW2syXS5yZWNvcmRfanNvbnBhdGgsIGpzb24yW2syXS5yZWNvcmRfanNvbikpXG5cdFx0XHRcdFx0XHRcdC8vIHNlY3Rpb25Sb3cyLnJlZnJlc2goanNvbjJbazJdLnByb2JsZW1faGludClcblx0XHRcdFx0XHRcdFx0c2VjdGlvblJvdzIub25jbGljayA9ICgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRhbGVydChqc29uMltrMl0ucmVjb3JkX2pzb24pXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGxpc3Rfb2Zmc2V0ICs9IDEwMFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRtb3JlQnV0dG9uLm9uY2xpY2sgPSBuZXh0RnVuXG5cdFx0XHRcdFx0bmV4dEZ1bigpXG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0Lypcblx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKCdzZXppb25lIGFwZXJ0YSwgcmljYXJpY28hJylcblx0XHRcdFx0XHRjb25zdCBqc29uMiA9IGF3YWl0IEFQSTMubGlzdF9fY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9yZWNvcmRfY2hlY2tfZmFpbGVkKHtcblx0XHRcdFx0XHRcdFx0XHRzZXNzaW9uX3N0YXJ0X3RzOiBwX3Nlc3Npb25fc3RhcnRfdHMsXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YXNldF9uYW1lOiBwX2RhdGFzZXRfbmFtZSxcblx0XHRcdFx0XHRcdFx0XHRjaGVja19jYXRlZ29yeTogcF9jYXRlZ29yeV9uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdGNoZWNrX25hbWU6IGlzc3VlLmNoZWNrX25hbWVcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRjb25zdCBncm91cEJ5ID0gdGhpcy5ncm91cFJlY29yZHMoanNvbjIpXG5cdFx0XHRcdFx0Y29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGdyb3VwQnkpXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coa2V5cylcblx0XHRcdFx0XHRpZiAoa2V5cy5sZW5ndGggPT0gMSAmJiBrZXlzWzBdID09ICcnKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGNvbnN0IG1vcmVCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKVxuXHRcdFx0XHRcdFx0bW9yZUJ1dHRvbi50ZXh0Q29udGVudCA9ICduZXh0IDEwJ1xuXHRcdFx0XHRcdFx0c2VjdGlvbi5hZGRFbGVtZW50VG9Db250ZW50QXJlYShtb3JlQnV0dG9uKVxuXHRcdFx0XHRcdFx0Y29uc3QgbmV4dEZ1biA9ICgpID0+IHtcblx0XHRcdFx0XHRcdFx0Y29uc3QgbGlzdCA9IGdyb3VwQnlba2V5c1swXV1cblx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgazIgPSAwOyBrMiA8IGxpc3QubGVuZ3RoOyBrMisrKVxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0Y29uc3Qgc2VjdGlvblJvdzIgPSBuZXcgU2VjdGlvblJvdygpO1xuXHRcdFx0XHRcdFx0XHRcdHNlY3Rpb24uYWRkRWxlbWVudFRvQ29udGVudEFyZWEoc2VjdGlvblJvdzIpXG5cdFx0XHRcdFx0XHRcdFx0Ly8gc2VjdGlvblJvdzIucmVmcmVzaCh0aGlzLmV4dHJhY3RIdW1hblJlYWRhYmxlTmFtZShsaXN0W2syXS5yZWNvcmRfanNvbnBhdGgsIGxpc3RbazJdLnJlY29yZF9qc29uKSlcblx0XHRcdFx0XHRcdFx0XHRzZWN0aW9uUm93Mi5yZWZyZXNoKGxpc3RbazJdLnByb2JsZW1faGludClcblx0XHRcdFx0XHRcdFx0XHRzZWN0aW9uUm93Mi5vbmNsaWNrID0gKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0YWxlcnQobGlzdFtrMl0ucmVjb3JkX2pzb24pXG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0bW9yZUJ1dHRvbi5vbmNsaWNrID0gbmV4dEZ1blxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Zm9yIChsZXQgayA9IDA7IGsgPCBrZXlzLmxlbmd0aDsgaysrKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRjb25zdCBzZWN0aW9uUm93ID0gbmV3IE9wZW5DbG9zZVNlY3Rpb24oKTtcblx0XHRcdFx0XHRcdFx0c2VjdGlvbi5hZGRFbGVtZW50VG9Db250ZW50QXJlYShzZWN0aW9uUm93KVxuXHRcdFx0XHRcdFx0XHRzZWN0aW9uUm93LnJlZnJlc2goa2V5c1trXSwgJycgKyBncm91cEJ5W2tleXNba11dLmxlbmd0aCArICcgcmVjb3JkcycpXG5cdFx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cub25jbGljayA9ICgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRjb25zdCBsaXN0ID0gZ3JvdXBCeVtrZXlzW2tdXVxuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGxpc3QpXG5cdFx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgazIgPSAwOyBrMiA8IGxpc3QubGVuZ3RoOyBrMisrKVxuXHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IHNlY3Rpb25Sb3cyID0gbmV3IFNlY3Rpb25Sb3coKTtcblx0XHRcdFx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cuYWRkRWxlbWVudFRvQ29udGVudEFyZWEoc2VjdGlvblJvdzIpXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBzZWN0aW9uUm93Mi5yZWZyZXNoKHRoaXMuZXh0cmFjdEh1bWFuUmVhZGFibGVOYW1lKGxpc3RbazJdLnJlY29yZF9qc29ucGF0aCwgbGlzdFtrMl0ucmVjb3JkX2pzb24pKVxuXHRcdFx0XHRcdFx0XHRcdFx0c2VjdGlvblJvdzIucmVmcmVzaChsaXN0W2syXS5wcm9ibGVtX2hpbnQpXG5cdFx0XHRcdFx0XHRcdFx0XHRzZWN0aW9uUm93Mi5vbmNsaWNrID0gKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRhbGVydChsaXN0W2syXS5yZWNvcmRfanNvbilcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ki9cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0XHRcdFxuXHRcdH1cblx0XHRcblx0XHRcblx0XHRpZiAodGhpcy5jdXJyZW50X3RhYiA9PT0gJ3JlY29yZHMnKVxuXHRcdHtcblx0XHRcdHRoaXMuaXNzdWVzLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJylcblx0XHRcdHRoaXMucmVjb3Jkcy5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpXG5cdFx0XHRcblx0XHRcdGNvbnN0IG1vcmVCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKVxuXHRcdFx0bW9yZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCduZXh0cGFnZWJ1dHRvbicpXG5cdFx0XHRtb3JlQnV0dG9uLnRleHRDb250ZW50ID0gJ25leHQgMTAwJ1xuXHRcdFx0dGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQobW9yZUJ1dHRvbilcblx0XHRcdGxldCBsaXN0X29mZnNldCA9IDBcblx0XHRcdGNvbnN0IG5leHRGdW4gPSBhc3luYyAoKSA9PiB7XG5cblx0XHRcdFx0Y29uc3QgbG9hZGVyID0gbmV3IExvYWRlcigpO1xuXHRcdFx0XHR0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChsb2FkZXIpXG5cblx0XHRcdFx0Y29uc3QgbGlzdCA9IGF3YWl0IEFQSTMubGlzdF9fY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9jaGVja19jYXRlZ29yeV9yZWNvcmRfanNvbnBhdGhfZmFpbGVkX3Z3KHtcblx0XHRcdFx0XHRzZXNzaW9uX3N0YXJ0X3RzOiBwX3Nlc3Npb25fc3RhcnRfdHMsXG5cdFx0XHRcdFx0ZGF0YXNldF9uYW1lOiBwX2RhdGFzZXRfbmFtZSxcblx0XHRcdFx0XHRjaGVja19jYXRlZ29yeTogcF9jYXRlZ29yeV9uYW1lLFxuXHRcdFx0XHRcdG9mZnNldDogbGlzdF9vZmZzZXQsXG5cdFx0XHRcdFx0bGltaXQ6IDEwMFxuXHRcdFx0XHR9KTtcblx0XHRcdFx0bG9hZGVyLnJlbW92ZSgpO1xuXHRcdFx0XHRmb3IgKGxldCBrMiA9IDA7IGsyIDwgbGlzdC5sZW5ndGg7IGsyKyspXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRjb25zdCBzZWN0aW9uUm93MiA9IG5ldyBPcGVuQ2xvc2VTZWN0aW9uKCk7XG5cdFx0XHRcdFx0Ly8gdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoc2VjdGlvblJvdzIpXG5cdFx0XHRcdFx0bW9yZUJ1dHRvbi5wYXJlbnRFbGVtZW50IS5pbnNlcnRCZWZvcmUoc2VjdGlvblJvdzIsIG1vcmVCdXR0b24pXG5cdFx0XHRcdFx0c2VjdGlvblJvdzIucmVmcmVzaCh0aGlzLmV4dHJhY3RIdW1hblJlYWRhYmxlTmFtZShsaXN0W2syXS5yZWNvcmRfanNvbnBhdGgsIGxpc3RbazJdLnJlY29yZF9qc29uKSwgJycgKyBsaXN0W2syXS5ucl9jaGVja19uYW1lcyArICcgY2hlY2sgZmFpbGVkJylcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRzZWN0aW9uUm93Mi5vbmNsaWNrID0gYXN5bmMgKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRjb25zdCBqc29uMiA9IGF3YWl0IEFQSTMubGlzdF9fY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9yZWNvcmRfY2hlY2tfZmFpbGVkKHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzZXNzaW9uX3N0YXJ0X3RzOiBwX3Nlc3Npb25fc3RhcnRfdHMsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YXNldF9uYW1lOiBwX2RhdGFzZXRfbmFtZSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjaGVja19jYXRlZ29yeTogcF9jYXRlZ29yeV9uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlY29yZF9qc29ucGF0aDogbGlzdFtrMl0ucmVjb3JkX2pzb25wYXRoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0Zm9yIChsZXQgayA9IDA7IGsgPCBqc29uMi5sZW5ndGg7IGsrKylcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y29uc3Qgc2VjdGlvblJvdyA9IG5ldyBTZWN0aW9uUm93KCk7XG5cdFx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cyLmFkZEVsZW1lbnRUb0NvbnRlbnRBcmVhKHNlY3Rpb25Sb3cpXG5cdFx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cucmVmcmVzaChcImZhaWxlZDogXCIgKyBqc29uMltrXS5jaGVja19uYW1lKVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRsaXN0X29mZnNldCArPSAxMDBcblx0XHRcdH1cblx0XHRcdG1vcmVCdXR0b24ub25jbGljayA9IG5leHRGdW5cblx0XHRcdG5leHRGdW4oKVxuXG5cdFxuXHRcdFx0Lypcblx0XHRcdGNvbnN0IGdyb3VwQnkgPSB0aGlzLmdyb3VwUmVjb3Jkcyhqc29uKVxuXHRcdFx0Y29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGdyb3VwQnkpXG5cdFx0XHRjb25zb2xlLmxvZyhrZXlzKVxuXHRcdFx0aWYgKGtleXMubGVuZ3RoID09IDEgJiYga2V5c1swXSA9PSAnJylcblx0XHRcdHtcblx0XHRcdFx0Y29uc3QgbGlzdCA9IGdyb3VwQnlba2V5c1swXV1cblx0XHRcdFx0Zm9yIChsZXQgazIgPSAwOyBrMiA8IGxpc3QubGVuZ3RoOyBrMisrKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Y29uc3Qgc2VjdGlvblJvdzIgPSBuZXcgT3BlbkNsb3NlU2VjdGlvbigpO1xuXHRcdFx0XHRcdHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHNlY3Rpb25Sb3cyKVxuXHRcdFx0XHRcdHNlY3Rpb25Sb3cyLnJlZnJlc2godGhpcy5leHRyYWN0SHVtYW5SZWFkYWJsZU5hbWUobGlzdFtrMl0ucmVjb3JkX2pzb25wYXRoLCBsaXN0W2syXS5yZWNvcmRfanNvbiksICcnICsgbGlzdFtrMl0ubnJfY2hlY2tfbmFtZXMgKyAnIGNoZWNrIGZhaWxlZCcpXG5cdFx0XHRcdFx0c2VjdGlvblJvdzIub25jbGljayA9IGFzeW5jICgpID0+IHtcblx0XHRcdFx0XHRcdGNvbnN0IGpzb24yID0gYXdhaXQgQVBJMy5saXN0X19jYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X3JlY29yZF9jaGVja19mYWlsZWQoe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzZXNzaW9uX3N0YXJ0X3RzOiBwX3Nlc3Npb25fc3RhcnRfdHMsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGFzZXRfbmFtZTogcF9kYXRhc2V0X25hbWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNoZWNrX2NhdGVnb3J5OiBwX2NhdGVnb3J5X25hbWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlY29yZF9qc29ucGF0aDogbGlzdFtrMl0ucmVjb3JkX2pzb25wYXRoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdGZvciAobGV0IGsgPSAwOyBrIDwganNvbjIubGVuZ3RoOyBrKyspXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IHNlY3Rpb25Sb3cgPSBuZXcgU2VjdGlvblJvdygpO1xuXHRcdFx0XHRcdFx0XHRzZWN0aW9uUm93Mi5hZGRFbGVtZW50VG9Db250ZW50QXJlYShzZWN0aW9uUm93KVxuXHRcdFx0XHRcdFx0XHRzZWN0aW9uUm93LnJlZnJlc2goXCJmYWlsZWQ6IFwiICsganNvbjJba10uY2hlY2tfbmFtZSlcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2Vcblx0XHRcdHtcblx0XHRcdFx0Zm9yIChsZXQgayA9IDA7IGsgPCBrZXlzLmxlbmd0aDsgaysrKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Y29uc3Qgc2VjdGlvblJvdyA9IG5ldyBPcGVuQ2xvc2VTZWN0aW9uKCk7XG5cdFx0XHRcdFx0dGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoc2VjdGlvblJvdylcblx0XHRcdFx0XHRzZWN0aW9uUm93LnJlZnJlc2goa2V5c1trXSwgJycgKyBncm91cEJ5W2tleXNba11dLmxlbmd0aCArICcgcmVjb3JkcycpXG5cdFx0XHRcdFx0c2VjdGlvblJvdy5vbmNsaWNrID0gKCkgPT4ge1xuXHRcdFx0XHRcdFx0Y29uc3QgbGlzdCA9IGdyb3VwQnlba2V5c1trXV1cblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGxpc3QpXG5cdFx0XHRcdFx0XHRmb3IgKGxldCBrMiA9IDA7IGsyIDwgbGlzdC5sZW5ndGg7IGsyKyspXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IHNlY3Rpb25Sb3cyID0gbmV3IE9wZW5DbG9zZVNlY3Rpb24oKTtcblx0XHRcdFx0XHRcdFx0c2VjdGlvblJvdy5hZGRFbGVtZW50VG9Db250ZW50QXJlYShzZWN0aW9uUm93Milcblx0XHRcdFx0XHRcdFx0c2VjdGlvblJvdzIucmVmcmVzaCh0aGlzLmV4dHJhY3RIdW1hblJlYWRhYmxlTmFtZShsaXN0W2syXS5yZWNvcmRfanNvbnBhdGgsIGxpc3RbazJdLnJlY29yZF9qc29uKSwgbGlzdFtrMl0ubnJfY2hlY2tfbmFtZXMpXG5cdFx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cyLm9uY2xpY2sgPSBhc3luYyAoZSkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKClcblx0XHRcdFx0XHRcdFx0XHRjb25zdCBqc29uMiA9IGF3YWl0IEFQSTMubGlzdF9fY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9yZWNvcmRfY2hlY2tfZmFpbGVkKHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHNlc3Npb25fc3RhcnRfdHM6IHBfc2Vzc2lvbl9zdGFydF90cyxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGFzZXRfbmFtZTogcF9kYXRhc2V0X25hbWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjaGVja19jYXRlZ29yeTogcF9jYXRlZ29yeV9uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVjb3JkX2pzb25wYXRoOiBsaXN0W2syXS5yZWNvcmRfanNvbnBhdGhcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgayA9IDA7IGsgPCBqc29uMi5sZW5ndGg7IGsrKylcblx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBzZWN0aW9uUm93ID0gbmV3IFNlY3Rpb25Sb3coKTtcblx0XHRcdFx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cyLmFkZEVsZW1lbnRUb0NvbnRlbnRBcmVhKHNlY3Rpb25Sb3cpXG5cdFx0XHRcdFx0XHRcdFx0XHRzZWN0aW9uUm93LnJlZnJlc2goanNvbjJba10uY2hlY2tfbmFtZSlcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdCAqL1xuXHRcdH1cblx0fVxufVxuXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ2NzLWRhdGFzZXQtaXNzdWVzLWRldGFpbCcsIERhdGFzZXRJc3N1ZXNEZXRhaWwpXG4iXX0=