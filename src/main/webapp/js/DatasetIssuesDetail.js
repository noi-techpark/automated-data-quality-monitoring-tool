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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YXNldElzc3Vlc0RldGFpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3R5cGVzY3JpcHQvRGF0YXNldElzc3Vlc0RldGFpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxPQUFPLEVBQUUsT0FBTyxFQUFZLE1BQU0sY0FBYyxDQUFDO0FBQ2pELE9BQU8sRUFBQyxJQUFJLEVBQTJELE1BQU0sZUFBZSxDQUFDO0FBQzdGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3pELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ3JDLE9BQU8sRUFBRSw2QkFBNkIsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBR25GLE1BQU0sT0FBTyxtQkFBb0IsU0FBUSxXQUFXO0lBR25ELFNBQVMsQ0FBQTtJQUVULHFCQUFxQixHQUFnQixJQUFJLENBQUE7SUFDekMsaUJBQWlCLEdBQWdCLElBQUksQ0FBQTtJQUNyQyxtQkFBbUIsR0FBZ0IsSUFBSSxDQUFBO0lBQ3ZDLG1CQUFtQixHQUFnQixJQUFJLENBQUE7SUFDdkMsZ0JBQWdCLEdBQWdCLElBQUksQ0FBQTtJQUVwQyxXQUFXLEdBQXlCLFFBQVEsQ0FBQTtJQUU1QyxLQUFLLENBQUE7SUFFTCxNQUFNLENBQUE7SUFFTixvQkFBb0I7SUFDcEIsZ0RBQWdEO0lBRWhELGVBQWUsQ0FBb0I7SUFDbkMsZUFBZSxDQUFnQjtJQUUvQixNQUFNLENBQWtCO0lBQ3hCLE9BQU8sQ0FBa0I7SUFDdEIsNkNBQTZDO0lBRWhELGlCQUFpQjtRQUVoQixtRUFBbUU7UUFDbkUsTUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNwQyxJQUFJLEVBQUUsTUFBTTtZQUNaLElBQUksRUFBRTtnQkFDTCxNQUFNLEVBQUUsQ0FB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QUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQTt3QkFDckQsQ0FBQztvQkFDRixDQUFDLENBQUE7Z0JBQ0YsQ0FBQztnQkFDRCxXQUFXLElBQUksR0FBRyxDQUFBO1lBQ25CLENBQUMsQ0FBQTtZQUNELFVBQVUsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFBO1lBQzVCLE9BQU8sRUFBRSxDQUFBO1lBR1Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7ZUFnRUc7UUFDSixDQUFDO0lBQ0YsQ0FBQztDQUNEO0FBRUQsY0FBYyxDQUFDLE1BQU0sQ0FBQywwQkFBMEIsRUFBRSxtQkFBbUIsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIChDKSAyMDI0IENhdGNoIFNvbHZlIGRpIERhdmlkZSBNb250ZXNpblxuICogTGljZW5zZTogQUdQTFxuICovXG5cbmltcG9ydCB7IGNzX2Nhc3QsIHRocm93TlBFIH0gZnJvbSBcIi4vcXVhbGl0eS5qc1wiO1xuaW1wb3J0IHtBUEkzLCBjYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X3JlY29yZF9jaGVja19mYWlsZWRfX3Jvd30gZnJvbSAnLi9hcGkvYXBpMy5qcyc7XG5pbXBvcnQgeyBPcGVuQ2xvc2VTZWN0aW9uIH0gZnJvbSBcIi4vT3BlbkNsb3NlU2VjdGlvbi5qc1wiO1xuaW1wb3J0IHsgU2VjdGlvblJvdyB9IGZyb20gXCIuL1NlY3Rpb25Sb3cuanNcIjtcbmltcG9ydCB7IExvYWRlciB9IGZyb20gXCIuL0xvYWRlci5qc1wiO1xuaW1wb3J0IHsgRGF0YXNldElzc3VlQ2F0ZWdvcnlDb21wb25lbnQgfSBmcm9tIFwiLi9EYXRhc2V0SXNzdWVDYXRlZ29yeUNvbXBvbmVudC5qc1wiO1xuaW1wb3J0IHsgR2VuZXJhbEluZm9BbmRTZXR0aW5ncyB9IGZyb20gXCIuL0dlbmVyYWxJbmZvQW5kU2V0dGluZ3MuanNcIjtcblxuZXhwb3J0IGNsYXNzIERhdGFzZXRJc3N1ZXNEZXRhaWwgZXh0ZW5kcyBIVE1MRWxlbWVudFxue1xuXHRcblx0Y29udGFpbmVyIFxuXHRcblx0bGFzdF9zZXNzaW9uX3N0YXJ0X3RzOiBzdHJpbmd8bnVsbCA9IG51bGxcblx0bGFzdF9kYXRhc2V0X25hbWU6IHN0cmluZ3xudWxsID0gbnVsbFxuXHRsYXN0X2NoZWNrX2NhdGVnb3J5OiBzdHJpbmd8bnVsbCA9IG51bGxcblx0bGFzdF9mYWlsZWRfcmVjb3JkczogbnVtYmVyfG51bGwgPSBudWxsXG5cdGxhc3RfdG90X3JlY29yZHM6IG51bWJlcnxudWxsID0gbnVsbFxuXHRcblx0Y3VycmVudF90YWI6ICdpc3N1ZXMnIHwgJ3JlY29yZHMnID0gJ2lzc3Vlcydcblx0XG5cdHNyb290XG5cdFxuXHRjYW52YXNcblx0XG5cdC8vIGNvbm5lY3RlZF9wcm9taXNlXG5cdC8vIGNvbm5lY3RlZF9mdW5jOiAoczogbnVsbCkgPT4gdm9pZCA9IHMgPT4gbnVsbFxuXHRcblx0Y2hhcnRqc19zdWNjZXNzOiAoczogQ2hhcnQpID0+IHZvaWRcblx0Y2hhcnRqc19wcm9taXNlOiBQcm9taXNlPENoYXJ0PlxuXG5cdGlzc3VlczogSFRNTFNwYW5FbGVtZW50O1xuXHRyZWNvcmRzOiBIVE1MU3BhbkVsZW1lbnQ7XG4gICAgLy8gaW5mb19hbmRfc2V0dGluZ3M6IEdlbmVyYWxJbmZvQW5kU2V0dGluZ3M7XG5cblx0Y29ubmVjdGVkQ2FsbGJhY2soKVxuXHR7XG5cdFx0Ly8gY2hhcnRqcyBuZWVkIHRvIGJlIGNyZWF0ZWQgd2hlbiBlbGVtZW50IGlzIGF0dGFjaGVkIGludG8gdGhlIGRvbVxuXHRcdGNvbnN0IGNoYXJ0ID0gbmV3IENoYXJ0KHRoaXMuY2FudmFzLCB7XG5cdFx0XHR0eXBlOiAnbGluZScsXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdGxhYmVsczogWyctNScsJy00JywnLTMnLCAnLTInLCAnLTEnXSxcblx0XHRcdFx0ZGF0YXNldHM6IFtdXG5cdFx0XHR9LFxuXHRcdFx0b3B0aW9uczoge1xuXHRcdFx0XHRzY2FsZXM6IHtcblx0XHRcdFx0XHR5OiB7XG5cdFx0XHRcdFx0XHRzdGFja2VkOiB0cnVlLFxuXHRcdFx0XHRcdFx0YmVnaW5BdFplcm86IHRydWVcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0XG5cdFx0dGhpcy5jaGFydGpzX3N1Y2Nlc3MoY2hhcnQpXG5cdH1cblx0XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKClcblx0XHR0aGlzLmNoYXJ0anNfc3VjY2VzcyA9IChzKSA9PiB7fSAvLyBkdW1teSBpbml0aWFsaXphdGlvbiwgbmV4dCBsaW5lIHdpbGwgaW5pdCBjaGFydGpzX3N1Y2Nlc3MgYnV0IGNvbXBpbGVyIGRvbid0IHVuZGVyc3RhbmQgdGhpcyFcblx0XHR0aGlzLmNoYXJ0anNfcHJvbWlzZSA9IG5ldyBQcm9taXNlKHMgPT4gdGhpcy5jaGFydGpzX3N1Y2Nlc3MgPSBzKVxuXHRcdHRoaXMuc3Jvb3QgPSB0aGlzLmF0dGFjaFNoYWRvdyh7IG1vZGU6ICdvcGVuJyB9KVxuXHRcdHRoaXMuc3Jvb3QuaW5uZXJIVE1MID0gYFxuXHRcdFx0XHQ8c3R5bGU+XG5cdFx0XHRcdFx0Omhvc3Qge1xuXHRcdFx0XHRcdFx0cGFkZGluZzogMC41cmVtO1xuXHRcdFx0XHRcdFx0ZGlzcGxheTogYmxvY2s7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC5jb250YWluZXIge1xuXHRcdFx0XHRcdFx0Ym9yZGVyOiAxcHggc29saWQgI2NjYztcblx0XHRcdFx0XHRcdGJvcmRlci1yYWRpdXM6IDAuM3JlbTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0LmNvbnRhaW5lciA+ICoge1xuXHRcdFx0XHRcdFx0Ym9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNjY2M7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC5oZWFkZXIge1xuXHRcdFx0XHRcdFx0ZGlzcGxheTogZmxleDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0LmhlYWRlciAuY2hhcnQge1xuXHRcdFx0XHRcdFx0d2lkdGg6IDUwJTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0LmFjdGlvbnMge1xuXHRcdFx0XHRcdFx0Ym9yZGVyOiAxcHggc29saWQgYmxhY2s7XG5cdFx0XHRcdFx0XHR3aWR0aDogMTByZW07XG5cdFx0XHRcdFx0XHRtYXJnaW4tbGVmdDogYXV0bztcblx0XHRcdFx0XHRcdGRpc3BsYXk6IGZsZXg7XG5cdFx0XHRcdFx0XHRib3JkZXItcmFkaXVzOiAwLjRyZW07XG5cdFx0XHRcdFx0XHRtYXJnaW4tYm90dG9tOiAwLjVyZW07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdC5hY3Rpb25zIHNwYW4uc2VsZWN0ZWQge1xuXHRcdFx0XHRcdFx0Y29sb3I6IHdoaXRlO1xuXHRcdFx0XHRcdFx0YmFja2dyb3VuZC1jb2xvcjogYmxhY2s7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdC5hY3Rpb25zIHNwYW4ge1xuXHRcdFx0XHRcdFx0ZmxleC1ncm93OiA1MDtcblx0XHRcdFx0XHRcdHRleHQtYWxpZ246IGNlbnRlcjtcblx0XHRcdFx0XHRcdGN1cnNvcjogcG9pbnRlcjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0Lm5leHRwYWdlYnV0dG9uIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1hcmdpbjogYXV0bztcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRpc3BsYXk6IGJsb2NrO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YmFja2dyb3VuZC1jb2xvcjogYmxhY2s7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjb2xvcjogd2hpdGU7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFxuXG5cdFx0XHRcdFxuXHRcdFx0XHQ8L3N0eWxlPlxuXHRcdFx0XHQ8IS0tIDxpbWcgc3JjPVwia3BpLWRldGFpbC5wbmdcIiBzdHlsZT1cIm1heC13aWR0aDogMTAwJVwiPiAtLT5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImhlYWRlclwiPlxuXHRcdFx0XHRcdDxkaXY+XG5cdFx0XHRcdFx0XHQ8Y3MtZGF0YXNldC1pc3N1ZS1jYXRlZ29yeT48L2NzLWRhdGFzZXQtaXNzdWUtY2F0ZWdvcnk+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNoYXJ0XCI+XG5cdFx0XHRcdFx0XHQ8Y2FudmFzPjwvY2FudmFzPlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwhLS08Y3MtZ2VuZXJhbC1pbmZvLWFuZC1zZXR0aW5ncz48L2NzLWdlbmVyYWwtaW5mby1hbmQtc2V0dGluZ3M+LS0+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8ZGl2IHN0eWxlPVwid2lkdGg6IGNhbGMoMTAwJSAtIDIwcHgpXCI+XG5cdFx0XHRcdFx0PGRpdiBzdHlsZT1cInRleHQtYWxpZ246IHJpZ2h0XCIgY2xhc3M9XCJhY3Rpb25zXCI+XG5cdFx0XHRcdFx0XHQ8c3BhbiBjbGFzcz1cImlzc3Vlc1wiPklzc3Vlczwvc3Bhbj5cblx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzPVwicmVjb3Jkc1wiPlJlY29yZHM8L3NwYW4+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPjwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0YFxuXG5cdFx0Y3VzdG9tRWxlbWVudHMudXBncmFkZSh0aGlzLnNyb290KVxuXG5cdFx0dGhpcy5jb250YWluZXIgPSBjc19jYXN0KEhUTUxEaXZFbGVtZW50LCB0aGlzLnNyb290LnF1ZXJ5U2VsZWN0b3IoJy5jb250YWluZXInKSlcblx0XHRcblx0XHR0aGlzLmlzc3VlcyA9IGNzX2Nhc3QoSFRNTFNwYW5FbGVtZW50LCB0aGlzLnNyb290LnF1ZXJ5U2VsZWN0b3IoJy5pc3N1ZXMnKSlcblx0XHR0aGlzLnJlY29yZHMgPSBjc19jYXN0KEhUTUxTcGFuRWxlbWVudCwgdGhpcy5zcm9vdC5xdWVyeVNlbGVjdG9yKCcucmVjb3JkcycpKVxuXHRcdFxuXHRcdHRoaXMuaXNzdWVzLm9uY2xpY2sgPSAoKSA9PiB7XG5cdFx0XHR0aGlzLmN1cnJlbnRfdGFiID0gJ2lzc3Vlcydcblx0XHRcdGlmICh0aGlzLmxhc3Rfc2Vzc2lvbl9zdGFydF90cyAhPSBudWxsICYmIHRoaXMubGFzdF9kYXRhc2V0X25hbWUgIT0gbnVsbCAmJiB0aGlzLmxhc3RfY2hlY2tfY2F0ZWdvcnkgIT0gbnVsbFxuXHRcdFx0XHQmJiB0aGlzLmxhc3RfZmFpbGVkX3JlY29yZHMgIT0gbnVsbCAmJiB0aGlzLmxhc3RfdG90X3JlY29yZHMgIT0gbnVsbClcblx0XHRcdFx0dGhpcy5yZWZyZXNoKHRoaXMubGFzdF9zZXNzaW9uX3N0YXJ0X3RzLCB0aGlzLmxhc3RfZGF0YXNldF9uYW1lLCB0aGlzLmxhc3RfY2hlY2tfY2F0ZWdvcnksIHRoaXMubGFzdF9mYWlsZWRfcmVjb3JkcywgdGhpcy5sYXN0X3RvdF9yZWNvcmRzKVxuXHRcdH1cblx0XHRcblx0XHR0aGlzLnJlY29yZHMub25jbGljayA9ICgpID0+IHtcblx0XHRcdHRoaXMuY3VycmVudF90YWIgPSAncmVjb3Jkcydcblx0XHRcdGlmICh0aGlzLmxhc3Rfc2Vzc2lvbl9zdGFydF90cyAhPSBudWxsICYmIHRoaXMubGFzdF9kYXRhc2V0X25hbWUgIT0gbnVsbCAmJiB0aGlzLmxhc3RfY2hlY2tfY2F0ZWdvcnkgIT0gbnVsbFxuXHRcdFx0XHQmJiB0aGlzLmxhc3RfZmFpbGVkX3JlY29yZHMgIT0gbnVsbCAmJiB0aGlzLmxhc3RfdG90X3JlY29yZHMgIT0gbnVsbClcblx0XHRcdFx0dGhpcy5yZWZyZXNoKHRoaXMubGFzdF9zZXNzaW9uX3N0YXJ0X3RzLCB0aGlzLmxhc3RfZGF0YXNldF9uYW1lLCB0aGlzLmxhc3RfY2hlY2tfY2F0ZWdvcnksIHRoaXMubGFzdF9mYWlsZWRfcmVjb3JkcywgdGhpcy5sYXN0X3RvdF9yZWNvcmRzKVxuXHRcdH1cblx0XHRcblx0XHR0aGlzLmNhbnZhcyA9IGNzX2Nhc3QoSFRNTENhbnZhc0VsZW1lbnQsIHRoaXMuc3Jvb3QucXVlcnlTZWxlY3RvcignY2FudmFzJykpO1xuXHRcdFxuXHRcdC8vIHRoaXMuaW5mb19hbmRfc2V0dGluZ3MgPSBjc19jYXN0KEdlbmVyYWxJbmZvQW5kU2V0dGluZ3MsIHRoaXMuc3Jvb3QucXVlcnlTZWxlY3RvcignY3MtZ2VuZXJhbC1pbmZvLWFuZC1zZXR0aW5ncycpKTtcblxuXG5cdH1cblx0XG5cdGV4dHJhY3RIdW1hblJlYWRhYmxlTmFtZShyZWNvcmRfanNvbnBhdGg6IHN0cmluZywganNvbjogc3RyaW5nKTogc3RyaW5nXG5cdHtcblx0XHRsZXQgcmV0ID0gJyc7XG5cdFx0Zm9yIChsZXQgZm4gb2YgWydzbmFtZScsICdtdmFsaWR0aW1lJywgJ212YWx1ZScsICdBY2NvRGV0YWlsLmRlLk5hbWUnLCAnRGV0YWlsLmRlLlRpdGxlJ10pXG5cdFx0e1xuXHRcdFx0Y29uc3QgZm5fcGFydHMgPSBmbi5zcGxpdCgnLicpXG5cdFx0XHRsZXQgdmFsID0gSlNPTi5wYXJzZShqc29uKVxuXHRcdFx0Zm9yIChsZXQgcCBvZiBmbl9wYXJ0cylcblx0XHRcdHtcblx0XHRcdFx0dmFsID0gdmFsW3BdXG5cdFx0XHRcdGlmICh2YWwgPT09IHVuZGVmaW5lZClcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdC8vIGNvbnN0IHZhbCA9IHN0YXJ0W2ZuXSBcblx0XHRcdGlmICh2YWwgIT09IHVuZGVmaW5lZClcblx0XHRcdFx0cmV0ICs9IChyZXQgPT09ICcnID8gJycgOiAnLCAnKSArIGZuICsgJz0nICsgSlNPTi5zdHJpbmdpZnkodmFsKVxuXHRcdH1cblx0XHRpZiAocmV0ID09ICcnKVxuXHRcdFx0cmV0ID0gcmVjb3JkX2pzb25wYXRoXG5cdFx0cmV0dXJuIHJldDtcblx0fVxuXHRcblx0Z3JvdXBSZWNvcmRzKGxpc3Q6IHtyZWNvcmRfanNvbjogc3RyaW5nfVtdKToge1trOnN0cmluZ106IGFueVtdfVxuXHR7XG5cdFx0Y29uc3QgZ3JvdXBCeToge1trOnN0cmluZ106IGFueVtdfSA9IHt9XG5cdFx0Zm9yIChsZXQgayA9IDA7IGsgPCBsaXN0Lmxlbmd0aDsgaysrKVxuXHRcdHtcblx0XHRcdGNvbnN0IGpzb24gPSBKU09OLnBhcnNlKGxpc3Rba10ucmVjb3JkX2pzb24pO1xuXHRcdFx0bGV0IHNuYW1lID0ganNvblsnc25hbWUnXTtcblx0XHRcdGlmICh0eXBlb2Ygc25hbWUgIT09ICdzdHJpbmcnKVxuXHRcdFx0XHRzbmFtZSA9ICcnXG5cdFx0XHRsZXQgcHJldl9hcnIgPSBncm91cEJ5W3NuYW1lXVxuXHRcdFx0cHJldl9hcnIgPSBwcmV2X2FyciA9PT0gdW5kZWZpbmVkID8gW10gOiBwcmV2X2FyclxuXHRcdFx0cHJldl9hcnIucHVzaChsaXN0W2tdKVxuXHRcdFx0Z3JvdXBCeVtzbmFtZV0gPSBwcmV2X2FyclxuXHRcdH1cblx0XHRyZXR1cm4gZ3JvdXBCeTsgXG5cdH1cblx0XG5cdGFzeW5jIHJlZnJlc2gocF9zZXNzaW9uX3N0YXJ0X3RzOiBzdHJpbmcsIHBfZGF0YXNldF9uYW1lOiBzdHJpbmcsIHBfY2F0ZWdvcnlfbmFtZTogc3RyaW5nLCBwX2ZhaWxlZF9yZWNvcmRzOiBudW1iZXIsIHBfdG90X3JlY29yZHM6IG51bWJlcikge1xuXHRcdFxuXHRcdHRoaXMubGFzdF9zZXNzaW9uX3N0YXJ0X3RzID0gcF9zZXNzaW9uX3N0YXJ0X3RzXG5cdFx0dGhpcy5sYXN0X2RhdGFzZXRfbmFtZSA9IHBfZGF0YXNldF9uYW1lXG5cdFx0dGhpcy5sYXN0X2NoZWNrX2NhdGVnb3J5ID0gcF9jYXRlZ29yeV9uYW1lXG5cdFx0dGhpcy5sYXN0X2ZhaWxlZF9yZWNvcmRzID0gcF9mYWlsZWRfcmVjb3Jkc1xuXHRcdHRoaXMubGFzdF90b3RfcmVjb3JkcyA9IHBfdG90X3JlY29yZHNcblx0XHRcblx0XHQvLyB0aGlzLmluZm9fYW5kX3NldHRpbmdzLnJlZnJlc2gocF9zZXNzaW9uX3N0YXJ0X3RzLCBwX2RhdGFzZXRfbmFtZSwgcF9mYWlsZWRfcmVjb3JkcywgcF90b3RfcmVjb3Jkcylcblx0XHRcblx0XHRjb25zb2xlLmxvZyhwX3Nlc3Npb25fc3RhcnRfdHMpXG5cdFx0Y29uc29sZS5sb2cocF9kYXRhc2V0X25hbWUpXG5cdFx0Y29uc29sZS5sb2cocF9jYXRlZ29yeV9uYW1lKTtcblx0XHRcblx0XHQoYXN5bmMgKCkgPT4ge1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGNvbnN0IGRhdGEgPSBhd2FpdCBBUEkzLmxpc3RfX2NhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfaGlzdG9yeV92dyh7XG5cdFx0XHRcdFx0XHRkYXRhc2V0X25hbWU6IHRoaXMubGFzdF9kYXRhc2V0X25hbWUhLFxuXHRcdFx0XHRcdFx0Y2hlY2tfY2F0ZWdvcnk6IHRoaXMubGFzdF9jaGVja19jYXRlZ29yeSFcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdC8vIGNvbnN0IGdvb2RhcnIgID0gW11cblx0XHRcdFx0XHQvLyBjb25zdCBmYWlsYXJyICA9IFtdXG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0Y29uc3QgbGFiZWxzICAgPSBbXVxuXHRcdFx0XHRcdGNvbnN0IGRhdGFzZXRzID0gW11cblx0XHRcdFx0XHRcblx0XHRcdFx0XHRmb3IgKGxldCB4ID0gMDsgeCA8IGRhdGEubGVuZ3RoOyB4KyspXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Y29uc3Qgcm93ID0gZGF0YVt4XVxuXHRcdFx0XHRcdFx0bGFiZWxzLnB1c2gocm93LnNlc3Npb25fc3RhcnRfdHMuc2xpY2UoMCwxNikucmVwbGFjZSgnVCcsICcgJykpXG5cdFx0XHRcdFx0XHRjb25zdCBjaGVja19zdGF0cyA9IEpTT04ucGFyc2Uocm93LmNoZWNrX3N0YXRzKTtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGNoZWNrX3N0YXRzKVxuXHRcdFx0XHRcdFx0Zm9yIChsZXQgYyA9IDA7IGMgPCBjaGVja19zdGF0cy5sZW5ndGg7IGMrKylcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y29uc3QgY2hlY2tfc3RhdCA9IGNoZWNrX3N0YXRzW2NdXG5cdFx0XHRcdFx0XHRcdGxldCBmb3VuZCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHRmb3IgKGxldCBkID0gMDsgZCA8IGRhdGFzZXRzLmxlbmd0aDsgZCsrKVxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGRhdGFzZXRzW2RdLmxhYmVsID09IGNoZWNrX3N0YXQuY2hlY2tfbmFtZSlcblx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhc2V0c1tkXS5kYXRhLnB1c2goY2hlY2tfc3RhdC5mYWlsZWRfcmVjcylcblx0XHRcdFx0XHRcdFx0XHRcdGZvdW5kID0gdHJ1ZVxuXHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmICghZm91bmQpXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRkYXRhc2V0cy5wdXNoKHtcblx0XHRcdFx0XHRcdFx0XHRcdGxhYmVsOiBjaGVja19zdGF0LmNoZWNrX25hbWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhOiBbY2hlY2tfc3RhdC5mYWlsZWRfcmVjc10sXG5cdFx0XHRcdFx0XHRcdFx0XHRmaWxsOiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0XHRcdGJhY2tncm91bmRDb2xvcjogJyNhYWEnLFxuXHRcdFx0XHRcdFx0XHRcdFx0Ym9yZGVyQ29sb3I6ICcjYWFhJyxcblx0XHRcdFx0XHRcdFx0XHRcdHRlbnNpb246IDAuMVxuXHRcdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdC8qXG5cdFx0XHRcdFx0XHRnb29kYXJyLnB1c2goZGF0YVt4XS50ZXN0ZWRfcmVjb3JkcyAtIGRhdGFbeF0uZmFpbGVkX3JlY3MpXG5cdFx0XHRcdFx0XHRmYWlsYXJyLnB1c2goZGF0YVt4XS5mYWlsZWRfcmVjcylcblx0XHRcdFx0XHRcdCAqL1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcblx0XHRcdFx0XHRjb25zdCBjaGFydGpzID0gYXdhaXQgdGhpcy5jaGFydGpzX3Byb21pc2Vcblx0XHRcdFx0XHRjaGFydGpzLmRhdGEubGFiZWxzID0gbGFiZWxzXG5cdFx0XHRcdFx0Y2hhcnRqcy5kYXRhLmRhdGFzZXRzID0gZGF0YXNldHNcblx0XHRcdFx0XHRcblx0XHRcdFx0XHQvKlxuXHRcdFx0XHRcdGNoYXJ0anMuZGF0YS5kYXRhc2V0cyA9IFtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGFiZWw6ICdmYWlsIHRyZW5kJyxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YTogZmFpbGFycixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZmlsbDogZmFsc2UsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGJhY2tncm91bmRDb2xvcjogJyMyMjInLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRib3JkZXJDb2xvcjogJyMyMjInLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0ZW5zaW9uOiAwLjFcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxhYmVsOiAndG90YWwgdHJlbmQnLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhOiBnb29kYXJyLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmaWxsOiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiAnI2FhYScsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGJvcmRlckNvbG9yOiAnI2FhYScsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRlbnNpb246IDAuMVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSxcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRdXG5cdFx0XHRcdFx0Ki9cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRjaGFydGpzLnVwZGF0ZSgpXG5cdFx0XHRcdFx0XHRcdFx0XHRcblx0XHR9KSgpO1xuXHRcdFxuXHRcdGNvbnN0IGNhdGVnb3J5ID0gY3NfY2FzdChEYXRhc2V0SXNzdWVDYXRlZ29yeUNvbXBvbmVudCwgdGhpcy5zcm9vdC5xdWVyeVNlbGVjdG9yKCdjcy1kYXRhc2V0LWlzc3VlLWNhdGVnb3J5JykpXG5cdFx0Y2F0ZWdvcnkuaGlkZU1vcmVEaXYoKVxuXHRcdGNhdGVnb3J5LnJlZnJlc2goXG5cdFx0e1xuXHRcdFx0ZGF0YXNldF9uYW1lOiBwX2RhdGFzZXRfbmFtZSxcblx0XHRcdHNlc3Npb25fc3RhcnRfdHM6IHBfc2Vzc2lvbl9zdGFydF90cyxcblx0XHRcdGNoZWNrX2NhdGVnb3J5OiBwX2NhdGVnb3J5X25hbWUsXG5cdFx0XHRmYWlsZWRfcmVjb3JkczogcF9mYWlsZWRfcmVjb3Jkcyxcblx0XHRcdHRvdF9yZWNvcmRzOiBwX3RvdF9yZWNvcmRzXG5cdFx0fSlcblx0XHRcblx0XHR0aGlzLmNvbnRhaW5lci50ZXh0Q29udGVudCA9ICcnXG5cdFx0XG5cdFx0aWYgKHRoaXMuY3VycmVudF90YWIgPT09ICdpc3N1ZXMnKVxuXHRcdHtcblx0XHRcdHRoaXMucmVjb3Jkcy5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpXG5cdFx0XHR0aGlzLmlzc3Vlcy5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpXG5cdFx0XHRcblx0XHRcdGNvbnN0IGxvYWRlciA9IG5ldyBMb2FkZXIoKTtcblx0XHRcdHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKGxvYWRlcilcblx0XHRcblx0XHRcdGNvbnN0IGpzb24gPSBhd2FpdCBBUEkzLmxpc3RfX2NhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfY2hlY2tfY2F0ZWdvcnlfY2hlY2tfbmFtZV9yZWNvcmRfcmVjb3JkX2ZhaWxlZF92dyh7XG5cdFx0XHRcdHNlc3Npb25fc3RhcnRfdHM6IHBfc2Vzc2lvbl9zdGFydF90cyxcblx0XHRcdFx0ZGF0YXNldF9uYW1lOiBwX2RhdGFzZXRfbmFtZSxcblx0XHRcdFx0Y2hlY2tfY2F0ZWdvcnk6IHBfY2F0ZWdvcnlfbmFtZVxuXHRcdFx0fSlcblxuXHRcdFx0bG9hZGVyLnJlbW92ZSgpO1xuXHRcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwganNvbi5sZW5ndGg7IGkrKylcblx0XHRcdHtcblx0XHRcdFx0Y29uc3QgaXNzdWUgPSBqc29uW2ldXG5cdFx0XHRcdC8vIGNvbnNvbGUubG9nKGlzc3VlKVxuXHRcdFx0XHRjb25zdCBzZWN0aW9uID0gbmV3IE9wZW5DbG9zZVNlY3Rpb24oKVxuXHRcdFx0XHRzZWN0aW9uLnJlZnJlc2goaXNzdWUuY2hlY2tfbmFtZSwgJ2ZhaWxlZDogJyArIGlzc3VlLm5yX3JlY29yZHMgKyAnIHJlY29yZHMnKVxuXHRcdFx0XHR0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChzZWN0aW9uKVxuXHRcdFx0XHRcblx0XHRcdFx0c2VjdGlvbi5vbm9wZW4gPSBhc3luYyAoKSA9PiB7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0Y29uc3QgbW9yZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpXG5cdFx0XHRcdFx0bW9yZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCduZXh0cGFnZWJ1dHRvbicpXG5cdFx0XHRcdFx0bW9yZUJ1dHRvbi50ZXh0Q29udGVudCA9ICduZXh0IDEwMCdcblx0XHRcdFx0XHRzZWN0aW9uLmFkZEVsZW1lbnRUb0NvbnRlbnRBcmVhKG1vcmVCdXR0b24pXG5cdFx0XHRcdFx0bGV0IGxpc3Rfb2Zmc2V0ID0gMFxuXHRcdFx0XHRcdGNvbnN0IG5leHRGdW4gPSBhc3luYyAoKSA9PiB7XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdGNvbnN0IGpzb24yID0gYXdhaXQgQVBJMy5saXN0X19jYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X3JlY29yZF9jaGVja19mYWlsZWQoe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHNlc3Npb25fc3RhcnRfdHM6IHBfc2Vzc2lvbl9zdGFydF90cyxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhc2V0X25hbWU6IHBfZGF0YXNldF9uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNoZWNrX2NhdGVnb3J5OiBwX2NhdGVnb3J5X25hbWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2hlY2tfbmFtZTogaXNzdWUuY2hlY2tfbmFtZSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsaW1pdDogMTAwLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9mZnNldDogbGlzdF9vZmZzZXRcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0Ly8gY29uc3QgbGlzdCA9IGdyb3VwQnlba2V5c1swXV1cblx0XHRcdFx0XHRcdGZvciAobGV0IGsyID0gMDsgazIgPCBqc29uMi5sZW5ndGg7IGsyKyspXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IHNlY3Rpb25Sb3cyID0gbmV3IFNlY3Rpb25Sb3coKTtcblx0XHRcdFx0XHRcdFx0Ly8gc2VjdGlvbi5hZGRFbGVtZW50VG9Db250ZW50QXJlYShzZWN0aW9uUm93Milcblx0XHRcdFx0XHRcdFx0bW9yZUJ1dHRvbi5wYXJlbnRFbGVtZW50IS5pbnNlcnRCZWZvcmUoc2VjdGlvblJvdzIsIG1vcmVCdXR0b24pXG5cdFx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cyLnJlZnJlc2godGhpcy5leHRyYWN0SHVtYW5SZWFkYWJsZU5hbWUoanNvbjJbazJdLnJlY29yZF9qc29ucGF0aCwganNvbjJbazJdLnJlY29yZF9qc29uKSlcblx0XHRcdFx0XHRcdFx0Ly8gc2VjdGlvblJvdzIucmVmcmVzaChqc29uMltrMl0ucHJvYmxlbV9oaW50KVxuXHRcdFx0XHRcdFx0XHRzZWN0aW9uUm93Mi5vbmNsaWNrID0gKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdGFsZXJ0KGpzb24yW2syXS5yZWNvcmRfanNvbilcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0bGlzdF9vZmZzZXQgKz0gMTAwXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG1vcmVCdXR0b24ub25jbGljayA9IG5leHRGdW5cblx0XHRcdFx0XHRuZXh0RnVuKClcblx0XHRcdFx0XHRcblx0XHRcdFx0XHQvKlxuXHRcdFx0XHRcdC8vY29uc29sZS5sb2coJ3NlemlvbmUgYXBlcnRhLCByaWNhcmljbyEnKVxuXHRcdFx0XHRcdGNvbnN0IGpzb24yID0gYXdhaXQgQVBJMy5saXN0X19jYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X3JlY29yZF9jaGVja19mYWlsZWQoe1xuXHRcdFx0XHRcdFx0XHRcdHNlc3Npb25fc3RhcnRfdHM6IHBfc2Vzc2lvbl9zdGFydF90cyxcblx0XHRcdFx0XHRcdFx0XHRkYXRhc2V0X25hbWU6IHBfZGF0YXNldF9uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdGNoZWNrX2NhdGVnb3J5OiBwX2NhdGVnb3J5X25hbWUsXG5cdFx0XHRcdFx0XHRcdFx0Y2hlY2tfbmFtZTogaXNzdWUuY2hlY2tfbmFtZVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdGNvbnN0IGdyb3VwQnkgPSB0aGlzLmdyb3VwUmVjb3Jkcyhqc29uMilcblx0XHRcdFx0XHRjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoZ3JvdXBCeSlcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhrZXlzKVxuXHRcdFx0XHRcdGlmIChrZXlzLmxlbmd0aCA9PSAxICYmIGtleXNbMF0gPT0gJycpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Y29uc3QgbW9yZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpXG5cdFx0XHRcdFx0XHRtb3JlQnV0dG9uLnRleHRDb250ZW50ID0gJ25leHQgMTAnXG5cdFx0XHRcdFx0XHRzZWN0aW9uLmFkZEVsZW1lbnRUb0NvbnRlbnRBcmVhKG1vcmVCdXR0b24pXG5cdFx0XHRcdFx0XHRjb25zdCBuZXh0RnVuID0gKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRjb25zdCBsaXN0ID0gZ3JvdXBCeVtrZXlzWzBdXVxuXHRcdFx0XHRcdFx0XHRmb3IgKGxldCBrMiA9IDA7IGsyIDwgbGlzdC5sZW5ndGg7IGsyKyspXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRjb25zdCBzZWN0aW9uUm93MiA9IG5ldyBTZWN0aW9uUm93KCk7XG5cdFx0XHRcdFx0XHRcdFx0c2VjdGlvbi5hZGRFbGVtZW50VG9Db250ZW50QXJlYShzZWN0aW9uUm93Milcblx0XHRcdFx0XHRcdFx0XHQvLyBzZWN0aW9uUm93Mi5yZWZyZXNoKHRoaXMuZXh0cmFjdEh1bWFuUmVhZGFibGVOYW1lKGxpc3RbazJdLnJlY29yZF9qc29ucGF0aCwgbGlzdFtrMl0ucmVjb3JkX2pzb24pKVxuXHRcdFx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cyLnJlZnJlc2gobGlzdFtrMl0ucHJvYmxlbV9oaW50KVxuXHRcdFx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cyLm9uY2xpY2sgPSAoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRhbGVydChsaXN0W2syXS5yZWNvcmRfanNvbilcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRtb3JlQnV0dG9uLm9uY2xpY2sgPSBuZXh0RnVuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRmb3IgKGxldCBrID0gMDsgayA8IGtleXMubGVuZ3RoOyBrKyspXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IHNlY3Rpb25Sb3cgPSBuZXcgT3BlbkNsb3NlU2VjdGlvbigpO1xuXHRcdFx0XHRcdFx0XHRzZWN0aW9uLmFkZEVsZW1lbnRUb0NvbnRlbnRBcmVhKHNlY3Rpb25Sb3cpXG5cdFx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cucmVmcmVzaChrZXlzW2tdLCAnJyArIGdyb3VwQnlba2V5c1trXV0ubGVuZ3RoICsgJyByZWNvcmRzJylcblx0XHRcdFx0XHRcdFx0c2VjdGlvblJvdy5vbmNsaWNrID0gKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdGNvbnN0IGxpc3QgPSBncm91cEJ5W2tleXNba11dXG5cdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2cobGlzdClcblx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBrMiA9IDA7IGsyIDwgbGlzdC5sZW5ndGg7IGsyKyspXG5cdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0Y29uc3Qgc2VjdGlvblJvdzIgPSBuZXcgU2VjdGlvblJvdygpO1xuXHRcdFx0XHRcdFx0XHRcdFx0c2VjdGlvblJvdy5hZGRFbGVtZW50VG9Db250ZW50QXJlYShzZWN0aW9uUm93Milcblx0XHRcdFx0XHRcdFx0XHRcdC8vIHNlY3Rpb25Sb3cyLnJlZnJlc2godGhpcy5leHRyYWN0SHVtYW5SZWFkYWJsZU5hbWUobGlzdFtrMl0ucmVjb3JkX2pzb25wYXRoLCBsaXN0W2syXS5yZWNvcmRfanNvbikpXG5cdFx0XHRcdFx0XHRcdFx0XHRzZWN0aW9uUm93Mi5yZWZyZXNoKGxpc3RbazJdLnByb2JsZW1faGludClcblx0XHRcdFx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cyLm9uY2xpY2sgPSAoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFsZXJ0KGxpc3RbazJdLnJlY29yZF9qc29uKVxuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQqL1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRcdFx0XG5cdFx0fVxuXHRcdFxuXHRcdFxuXHRcdGlmICh0aGlzLmN1cnJlbnRfdGFiID09PSAncmVjb3JkcycpXG5cdFx0e1xuXHRcdFx0dGhpcy5pc3N1ZXMuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKVxuXHRcdFx0dGhpcy5yZWNvcmRzLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJylcblx0XHRcdFxuXHRcdFx0Y29uc3QgbW9yZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpXG5cdFx0XHRtb3JlQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ25leHRwYWdlYnV0dG9uJylcblx0XHRcdG1vcmVCdXR0b24udGV4dENvbnRlbnQgPSAnbmV4dCAxMDAnXG5cdFx0XHR0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChtb3JlQnV0dG9uKVxuXHRcdFx0bGV0IGxpc3Rfb2Zmc2V0ID0gMFxuXHRcdFx0Y29uc3QgbmV4dEZ1biA9IGFzeW5jICgpID0+IHtcblxuXHRcdFx0XHRjb25zdCBsb2FkZXIgPSBuZXcgTG9hZGVyKCk7XG5cdFx0XHRcdHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKGxvYWRlcilcblxuXHRcdFx0XHRjb25zdCBsaXN0ID0gYXdhaXQgQVBJMy5saXN0X19jYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X2NoZWNrX2NhdGVnb3J5X3JlY29yZF9qc29ucGF0aF9mYWlsZWRfdncoe1xuXHRcdFx0XHRcdHNlc3Npb25fc3RhcnRfdHM6IHBfc2Vzc2lvbl9zdGFydF90cyxcblx0XHRcdFx0XHRkYXRhc2V0X25hbWU6IHBfZGF0YXNldF9uYW1lLFxuXHRcdFx0XHRcdGNoZWNrX2NhdGVnb3J5OiBwX2NhdGVnb3J5X25hbWUsXG5cdFx0XHRcdFx0b2Zmc2V0OiBsaXN0X29mZnNldCxcblx0XHRcdFx0XHRsaW1pdDogMTAwXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRsb2FkZXIucmVtb3ZlKCk7XG5cdFx0XHRcdGZvciAobGV0IGsyID0gMDsgazIgPCBsaXN0Lmxlbmd0aDsgazIrKylcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGNvbnN0IHNlY3Rpb25Sb3cyID0gbmV3IE9wZW5DbG9zZVNlY3Rpb24oKTtcblx0XHRcdFx0XHQvLyB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChzZWN0aW9uUm93Milcblx0XHRcdFx0XHRtb3JlQnV0dG9uLnBhcmVudEVsZW1lbnQhLmluc2VydEJlZm9yZShzZWN0aW9uUm93MiwgbW9yZUJ1dHRvbilcblx0XHRcdFx0XHRzZWN0aW9uUm93Mi5yZWZyZXNoKHRoaXMuZXh0cmFjdEh1bWFuUmVhZGFibGVOYW1lKGxpc3RbazJdLnJlY29yZF9qc29ucGF0aCwgbGlzdFtrMl0ucmVjb3JkX2pzb24pLCAnJyArIGxpc3RbazJdLm5yX2NoZWNrX25hbWVzICsgJyBjaGVjayBmYWlsZWQnKVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdHNlY3Rpb25Sb3cyLm9uY2xpY2sgPSBhc3luYyAoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IGpzb24yID0gYXdhaXQgQVBJMy5saXN0X19jYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X3JlY29yZF9jaGVja19mYWlsZWQoe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHNlc3Npb25fc3RhcnRfdHM6IHBfc2Vzc2lvbl9zdGFydF90cyxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhc2V0X25hbWU6IHBfZGF0YXNldF9uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNoZWNrX2NhdGVnb3J5OiBwX2NhdGVnb3J5X25hbWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVjb3JkX2pzb25wYXRoOiBsaXN0W2syXS5yZWNvcmRfanNvbnBhdGhcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRmb3IgKGxldCBrID0gMDsgayA8IGpzb24yLmxlbmd0aDsgaysrKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRjb25zdCBzZWN0aW9uUm93ID0gbmV3IFNlY3Rpb25Sb3coKTtcblx0XHRcdFx0XHRcdFx0c2VjdGlvblJvdzIuYWRkRWxlbWVudFRvQ29udGVudEFyZWEoc2VjdGlvblJvdylcblx0XHRcdFx0XHRcdFx0c2VjdGlvblJvdy5yZWZyZXNoKFwiZmFpbGVkOiBcIiArIGpzb24yW2tdLmNoZWNrX25hbWUpXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGxpc3Rfb2Zmc2V0ICs9IDEwMFxuXHRcdFx0fVxuXHRcdFx0bW9yZUJ1dHRvbi5vbmNsaWNrID0gbmV4dEZ1blxuXHRcdFx0bmV4dEZ1bigpXG5cblx0XG5cdFx0XHQvKlxuXHRcdFx0Y29uc3QgZ3JvdXBCeSA9IHRoaXMuZ3JvdXBSZWNvcmRzKGpzb24pXG5cdFx0XHRjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoZ3JvdXBCeSlcblx0XHRcdGNvbnNvbGUubG9nKGtleXMpXG5cdFx0XHRpZiAoa2V5cy5sZW5ndGggPT0gMSAmJiBrZXlzWzBdID09ICcnKVxuXHRcdFx0e1xuXHRcdFx0XHRjb25zdCBsaXN0ID0gZ3JvdXBCeVtrZXlzWzBdXVxuXHRcdFx0XHRmb3IgKGxldCBrMiA9IDA7IGsyIDwgbGlzdC5sZW5ndGg7IGsyKyspXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRjb25zdCBzZWN0aW9uUm93MiA9IG5ldyBPcGVuQ2xvc2VTZWN0aW9uKCk7XG5cdFx0XHRcdFx0dGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoc2VjdGlvblJvdzIpXG5cdFx0XHRcdFx0c2VjdGlvblJvdzIucmVmcmVzaCh0aGlzLmV4dHJhY3RIdW1hblJlYWRhYmxlTmFtZShsaXN0W2syXS5yZWNvcmRfanNvbnBhdGgsIGxpc3RbazJdLnJlY29yZF9qc29uKSwgJycgKyBsaXN0W2syXS5ucl9jaGVja19uYW1lcyArICcgY2hlY2sgZmFpbGVkJylcblx0XHRcdFx0XHRzZWN0aW9uUm93Mi5vbmNsaWNrID0gYXN5bmMgKCkgPT4ge1xuXHRcdFx0XHRcdFx0Y29uc3QganNvbjIgPSBhd2FpdCBBUEkzLmxpc3RfX2NhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfcmVjb3JkX2NoZWNrX2ZhaWxlZCh7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHNlc3Npb25fc3RhcnRfdHM6IHBfc2Vzc2lvbl9zdGFydF90cyxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YXNldF9uYW1lOiBwX2RhdGFzZXRfbmFtZSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2hlY2tfY2F0ZWdvcnk6IHBfY2F0ZWdvcnlfbmFtZSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVjb3JkX2pzb25wYXRoOiBsaXN0W2syXS5yZWNvcmRfanNvbnBhdGhcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0Zm9yIChsZXQgayA9IDA7IGsgPCBqc29uMi5sZW5ndGg7IGsrKylcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y29uc3Qgc2VjdGlvblJvdyA9IG5ldyBTZWN0aW9uUm93KCk7XG5cdFx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cyLmFkZEVsZW1lbnRUb0NvbnRlbnRBcmVhKHNlY3Rpb25Sb3cpXG5cdFx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cucmVmcmVzaChcImZhaWxlZDogXCIgKyBqc29uMltrXS5jaGVja19uYW1lKVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZVxuXHRcdFx0e1xuXHRcdFx0XHRmb3IgKGxldCBrID0gMDsgayA8IGtleXMubGVuZ3RoOyBrKyspXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRjb25zdCBzZWN0aW9uUm93ID0gbmV3IE9wZW5DbG9zZVNlY3Rpb24oKTtcblx0XHRcdFx0XHR0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChzZWN0aW9uUm93KVxuXHRcdFx0XHRcdHNlY3Rpb25Sb3cucmVmcmVzaChrZXlzW2tdLCAnJyArIGdyb3VwQnlba2V5c1trXV0ubGVuZ3RoICsgJyByZWNvcmRzJylcblx0XHRcdFx0XHRzZWN0aW9uUm93Lm9uY2xpY2sgPSAoKSA9PiB7XG5cdFx0XHRcdFx0XHRjb25zdCBsaXN0ID0gZ3JvdXBCeVtrZXlzW2tdXVxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2cobGlzdClcblx0XHRcdFx0XHRcdGZvciAobGV0IGsyID0gMDsgazIgPCBsaXN0Lmxlbmd0aDsgazIrKylcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y29uc3Qgc2VjdGlvblJvdzIgPSBuZXcgT3BlbkNsb3NlU2VjdGlvbigpO1xuXHRcdFx0XHRcdFx0XHRzZWN0aW9uUm93LmFkZEVsZW1lbnRUb0NvbnRlbnRBcmVhKHNlY3Rpb25Sb3cyKVxuXHRcdFx0XHRcdFx0XHRzZWN0aW9uUm93Mi5yZWZyZXNoKHRoaXMuZXh0cmFjdEh1bWFuUmVhZGFibGVOYW1lKGxpc3RbazJdLnJlY29yZF9qc29ucGF0aCwgbGlzdFtrMl0ucmVjb3JkX2pzb24pLCBsaXN0W2syXS5ucl9jaGVja19uYW1lcylcblx0XHRcdFx0XHRcdFx0c2VjdGlvblJvdzIub25jbGljayA9IGFzeW5jIChlKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKVxuXHRcdFx0XHRcdFx0XHRcdGNvbnN0IGpzb24yID0gYXdhaXQgQVBJMy5saXN0X19jYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X3JlY29yZF9jaGVja19mYWlsZWQoe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c2Vzc2lvbl9zdGFydF90czogcF9zZXNzaW9uX3N0YXJ0X3RzLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YXNldF9uYW1lOiBwX2RhdGFzZXRfbmFtZSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNoZWNrX2NhdGVnb3J5OiBwX2NhdGVnb3J5X25hbWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZWNvcmRfanNvbnBhdGg6IGxpc3RbazJdLnJlY29yZF9qc29ucGF0aFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBrID0gMDsgayA8IGpzb24yLmxlbmd0aDsgaysrKVxuXHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IHNlY3Rpb25Sb3cgPSBuZXcgU2VjdGlvblJvdygpO1xuXHRcdFx0XHRcdFx0XHRcdFx0c2VjdGlvblJvdzIuYWRkRWxlbWVudFRvQ29udGVudEFyZWEoc2VjdGlvblJvdylcblx0XHRcdFx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cucmVmcmVzaChqc29uMltrXS5jaGVja19uYW1lKVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ICovXG5cdFx0fVxuXHR9XG59XG5cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgnY3MtZGF0YXNldC1pc3N1ZXMtZGV0YWlsJywgRGF0YXNldElzc3Vlc0RldGFpbClcbiJdfQ==