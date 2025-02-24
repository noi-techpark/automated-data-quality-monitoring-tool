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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YXNldElzc3Vlc0RldGFpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3R5cGVzY3JpcHQvRGF0YXNldElzc3Vlc0RldGFpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxPQUFPLEVBQUUsT0FBTyxFQUFZLE1BQU0sY0FBYyxDQUFDO0FBQ2pELE9BQU8sRUFBQyxJQUFJLEVBQTJELE1BQU0sZUFBZSxDQUFDO0FBQzdGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3pELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ3JDLE9BQU8sRUFBRSw2QkFBNkIsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBR25GLE1BQU0sT0FBTyxtQkFBb0IsU0FBUSxXQUFXO0lBR25ELFNBQVMsQ0FBQTtJQUVULHFCQUFxQixHQUFnQixJQUFJLENBQUE7SUFDekMsaUJBQWlCLEdBQWdCLElBQUksQ0FBQTtJQUNyQyxtQkFBbUIsR0FBZ0IsSUFBSSxDQUFBO0lBQ3ZDLG1CQUFtQixHQUFnQixJQUFJLENBQUE7SUFDdkMsZ0JBQWdCLEdBQWdCLElBQUksQ0FBQTtJQUVwQyxXQUFXLEdBQXlCLFFBQVEsQ0FBQTtJQUU1QyxLQUFLLENBQUE7SUFFTCxNQUFNLENBQUE7SUFFTixvQkFBb0I7SUFDcEIsZ0RBQWdEO0lBRWhELGVBQWUsQ0FBb0I7SUFDbkMsZUFBZSxDQUFnQjtJQUUvQixNQUFNLENBQWtCO0lBQ3hCLE9BQU8sQ0FBa0I7SUFDdEIsNkNBQTZDO0lBRWhELGlCQUFpQjtRQUVoQixtRUFBbUU7UUFDbkUsTUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNwQyxJQUFJLEVBQUUsTUFBTTtZQUNaLElBQUksRUFBRTtnQkFDTCxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUNwQyxRQUFRLEVBQUUsRUFBRTthQUNaO1lBQ0QsT0FBTyxFQUFFO2dCQUNSLE1BQU0sRUFBRTtvQkFDUCxDQUFDLEVBQUU7d0JBQ0YsT0FBTyxFQUFFLElBQUk7d0JBQ2IsV0FBVyxFQUFFLElBQUk7cUJBQ2pCO2lCQUVEO2FBRUQ7U0FDRCxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQzVCLENBQUM7SUFFRDtRQUNDLEtBQUssRUFBRSxDQUFBO1FBQ1AsSUFBSSxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUUsQ0FBQyxDQUFBLENBQUMsZ0dBQWdHO1FBQ2pJLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxDQUFBO1FBQ2pFLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFBO1FBQ2hELElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztLQTJEcEIsQ0FBQTtRQUVILGNBQWMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBRWxDLElBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFBO1FBRWhGLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFBO1FBQzNFLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFBO1FBRTdFLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRTtZQUMxQixJQUFJLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQTtZQUMzQixJQUFJLElBQUksQ0FBQyxxQkFBcUIsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLGlCQUFpQixJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsbUJBQW1CLElBQUksSUFBSTttQkFDeEcsSUFBSSxDQUFDLG1CQUFtQixJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsZ0JBQWdCLElBQUksSUFBSTtnQkFDcEUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMscUJBQXFCLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixFQUFFLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUE7UUFDN0ksQ0FBQyxDQUFBO1FBRUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsR0FBRyxFQUFFO1lBQzNCLElBQUksQ0FBQyxXQUFXLEdBQUcsU0FBUyxDQUFBO1lBQzVCLElBQUksSUFBSSxDQUFDLHFCQUFxQixJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsaUJBQWlCLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxtQkFBbUIsSUFBSSxJQUFJO21CQUN4RyxJQUFJLENBQUMsbUJBQW1CLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxJQUFJO2dCQUNwRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtRQUM3SSxDQUFDLENBQUE7UUFFRCxJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBRTdFLHNIQUFzSDtJQUd2SCxDQUFDO0lBRUQsd0JBQXdCLENBQUMsZUFBdUIsRUFBRSxJQUFZO1FBRTdELElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUNiLEtBQUssSUFBSSxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUUsUUFBUSxFQUFFLG9CQUFvQixFQUFFLGlCQUFpQixDQUFDLEVBQ2hGLENBQUM7WUFDQSxNQUFNLFFBQVEsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBQzlCLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7WUFDMUIsS0FBSyxJQUFJLENBQUMsSUFBSSxRQUFRLEVBQ3RCLENBQUM7Z0JBQ0EsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFDWixJQUFJLEdBQUcsS0FBSyxTQUFTO29CQUNwQixNQUFNO1lBQ1IsQ0FBQztZQUNELHlCQUF5QjtZQUN6QixJQUFJLEdBQUcsS0FBSyxTQUFTO2dCQUNwQixHQUFHLElBQUksQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNsRSxDQUFDO1FBQ0QsSUFBSSxHQUFHLElBQUksRUFBRTtZQUNaLEdBQUcsR0FBRyxlQUFlLENBQUE7UUFDdEIsT0FBTyxHQUFHLENBQUM7SUFDWixDQUFDO0lBRUQsWUFBWSxDQUFDLElBQTZCO1FBRXpDLE1BQU0sT0FBTyxHQUF3QixFQUFFLENBQUE7UUFDdkMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQ3BDLENBQUM7WUFDQSxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUM3QyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDMUIsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRO2dCQUM1QixLQUFLLEdBQUcsRUFBRSxDQUFBO1lBQ1gsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBQzdCLFFBQVEsR0FBRyxRQUFRLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQTtZQUNqRCxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ3RCLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxRQUFRLENBQUE7UUFDMUIsQ0FBQztRQUNELE9BQU8sT0FBTyxDQUFDO0lBQ2hCLENBQUM7SUFFRCxLQUFLLENBQUMsT0FBTyxDQUFDLGtCQUEwQixFQUFFLGNBQXNCLEVBQUUsZUFBdUIsRUFBRSxnQkFBd0IsRUFBRSxhQUFxQjtRQUV6SSxJQUFJLENBQUMscUJBQXFCLEdBQUcsa0JBQWtCLENBQUE7UUFDL0MsSUFBSSxDQUFDLGlCQUFpQixHQUFHLGNBQWMsQ0FBQTtRQUN2QyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsZUFBZSxDQUFBO1FBQzFDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxnQkFBZ0IsQ0FBQTtRQUMzQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsYUFBYSxDQUFBO1FBRXJDLHNHQUFzRztRQUV0RyxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUE7UUFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQTtRQUMzQixPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBRTdCLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFHVCxNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxnREFBZ0QsQ0FBQztnQkFDeEUsWUFBWSxFQUFFLElBQUksQ0FBQyxpQkFBa0I7Z0JBQ3JDLGNBQWMsRUFBRSxJQUFJLENBQUMsbUJBQW9CO2FBQ3pDLENBQUMsQ0FBQTtZQUVGLHNCQUFzQjtZQUN0QixzQkFBc0I7WUFFdEIsTUFBTSxNQUFNLEdBQUssRUFBRSxDQUFBO1lBQ25CLE1BQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQTtZQUVuQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFDcEMsQ0FBQztnQkFDQSxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7Z0JBQ25CLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFBO2dCQUMvRCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDaEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQTtnQkFDeEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQzNDLENBQUM7b0JBQ0EsTUFBTSxVQUFVLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFBO29CQUNqQyxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUM7b0JBQ2xCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUN4QyxDQUFDO3dCQUNBLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxVQUFVLENBQUMsVUFBVSxFQUM5QyxDQUFDOzRCQUNBLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQTs0QkFDN0MsS0FBSyxHQUFHLElBQUksQ0FBQTs0QkFDWixNQUFNO3dCQUNQLENBQUM7b0JBQ0YsQ0FBQztvQkFDRCxJQUFJLENBQUMsS0FBSyxFQUNWLENBQUM7d0JBQ0EsUUFBUSxDQUFDLElBQUksQ0FBQzs0QkFDYixLQUFLLEVBQUUsVUFBVSxDQUFDLFVBQVU7NEJBQzVCLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUM7NEJBQzlCLElBQUksRUFBRSxLQUFLOzRCQUNYLGVBQWUsRUFBRSxNQUFNOzRCQUN2QixXQUFXLEVBQUUsTUFBTTs0QkFDbkIsT0FBTyxFQUFFLEdBQUc7eUJBQ1osQ0FBQyxDQUFBO29CQUNILENBQUM7Z0JBQ0YsQ0FBQztnQkFDRDs7O21CQUdHO1lBQ0osQ0FBQztZQUVELE1BQU0sT0FBTyxHQUFHLE1BQU0sSUFBSSxDQUFDLGVBQWUsQ0FBQTtZQUMxQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7WUFDNUIsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFBO1lBRWhDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O2NBbUJFO1lBRUYsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFBO1FBRW5CLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFFTCxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsNkJBQTZCLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsMkJBQTJCLENBQUMsQ0FBQyxDQUFBO1FBQzlHLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtRQUN0QixRQUFRLENBQUMsT0FBTyxDQUNoQjtZQUNDLFlBQVksRUFBRSxjQUFjO1lBQzVCLGdCQUFnQixFQUFFLGtCQUFrQjtZQUNwQyxjQUFjLEVBQUUsZUFBZTtZQUMvQixjQUFjLEVBQUUsZ0JBQWdCO1lBQ2hDLFdBQVcsRUFBRSxhQUFhO1NBQzFCLENBQUMsQ0FBQTtRQUVGLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQTtRQUUvQixJQUFJLElBQUksQ0FBQyxXQUFXLEtBQUssUUFBUSxFQUNqQyxDQUFDO1lBQ0EsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFBO1lBQ3pDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQTtZQUVyQyxNQUFNLE1BQU0sR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFDO1lBQzVCLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBRWxDLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLHVGQUF1RixDQUFDO2dCQUMvRyxnQkFBZ0IsRUFBRSxrQkFBa0I7Z0JBQ3BDLFlBQVksRUFBRSxjQUFjO2dCQUM1QixjQUFjLEVBQUUsZUFBZTthQUMvQixDQUFDLENBQUE7WUFFRixNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7WUFFaEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQ3BDLENBQUM7Z0JBQ0EsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO2dCQUNyQixxQkFBcUI7Z0JBQ3JCLE1BQU0sT0FBTyxHQUFHLElBQUksZ0JBQWdCLEVBQUUsQ0FBQTtnQkFDdEMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLFVBQVUsRUFBRSxFQUFFLEdBQUcsS0FBSyxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUMsQ0FBQTtnQkFDbEYsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUE7Z0JBRW5DLE9BQU8sQ0FBQyxNQUFNLEdBQUcsS0FBSyxJQUFJLEVBQUU7b0JBQzNCLDBDQUEwQztvQkFDMUMsTUFBTSxLQUFLLEdBQUcsTUFBTSxJQUFJLENBQUMseURBQXlELENBQUM7d0JBQ2hGLGdCQUFnQixFQUFFLGtCQUFrQjt3QkFDcEMsWUFBWSxFQUFFLGNBQWM7d0JBQzVCLGNBQWMsRUFBRSxlQUFlO3dCQUMvQixVQUFVLEVBQUUsS0FBSyxDQUFDLFVBQVU7cUJBQzlCLENBQUMsQ0FBQztvQkFDSCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFBO29CQUN4QyxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO29CQUNqQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO29CQUNqQixJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQ3JDLENBQUM7d0JBQ0EsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO3dCQUM3QixLQUFLLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUUsRUFDdkMsQ0FBQzs0QkFDQSxNQUFNLFdBQVcsR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDOzRCQUNyQyxPQUFPLENBQUMsdUJBQXVCLENBQUMsV0FBVyxDQUFDLENBQUE7NEJBQzVDLHFHQUFxRzs0QkFDckcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUE7NEJBQzFDLFdBQVcsQ0FBQyxPQUFPLEdBQUcsR0FBRyxFQUFFO2dDQUMxQixLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFBOzRCQUM1QixDQUFDLENBQUE7d0JBQ0YsQ0FBQztvQkFDRixDQUFDO3lCQUVELENBQUM7d0JBQ0EsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQ3BDLENBQUM7NEJBQ0EsTUFBTSxVQUFVLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDOzRCQUMxQyxPQUFPLENBQUMsdUJBQXVCLENBQUMsVUFBVSxDQUFDLENBQUE7NEJBQzNDLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQyxDQUFBOzRCQUN0RSxVQUFVLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRTtnQ0FDekIsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO2dDQUM3QixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO2dDQUNqQixLQUFLLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUUsRUFDdkMsQ0FBQztvQ0FDQSxNQUFNLFdBQVcsR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDO29DQUNyQyxVQUFVLENBQUMsdUJBQXVCLENBQUMsV0FBVyxDQUFDLENBQUE7b0NBQy9DLHFHQUFxRztvQ0FDckcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUE7b0NBQzFDLFdBQVcsQ0FBQyxPQUFPLEdBQUcsR0FBRyxFQUFFO3dDQUMxQixLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFBO29DQUM1QixDQUFDLENBQUE7Z0NBQ0YsQ0FBQzs0QkFDRixDQUFDLENBQUE7d0JBQ0YsQ0FBQztvQkFDRixDQUFDO2dCQUNGLENBQUMsQ0FBQTtZQUNGLENBQUM7UUFFRixDQUFDO1FBR0QsSUFBSSxJQUFJLENBQUMsV0FBVyxLQUFLLFNBQVMsRUFDbEMsQ0FBQztZQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQTtZQUN4QyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUE7WUFFdEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxNQUFNLEVBQUUsQ0FBQztZQUM1QixJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUVsQyxNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyw4RUFBOEUsQ0FBQztnQkFDdEcsZ0JBQWdCLEVBQUUsa0JBQWtCO2dCQUNwQyxZQUFZLEVBQUUsY0FBYztnQkFDNUIsY0FBYyxFQUFFLGVBQWU7YUFDL0IsQ0FBQyxDQUFDO1lBRUgsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBRWhCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUE7WUFDdkMsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUNqQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO1lBQ2pCLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFDckMsQ0FBQztnQkFDQSxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7Z0JBQzdCLEtBQUssSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsRUFBRSxFQUN2QyxDQUFDO29CQUNBLE1BQU0sV0FBVyxHQUFHLElBQUksZ0JBQWdCLEVBQUUsQ0FBQztvQkFDM0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUE7b0JBQ3ZDLFdBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsY0FBYyxHQUFHLGVBQWUsQ0FBQyxDQUFBO29CQUNsSixXQUFXLENBQUMsT0FBTyxHQUFHLEtBQUssSUFBSSxFQUFFO3dCQUNoQyxNQUFNLEtBQUssR0FBRyxNQUFNLElBQUksQ0FBQyx5REFBeUQsQ0FBQzs0QkFDNUUsZ0JBQWdCLEVBQUUsa0JBQWtCOzRCQUNwQyxZQUFZLEVBQUUsY0FBYzs0QkFDNUIsY0FBYyxFQUFFLGVBQWU7NEJBQy9CLGVBQWUsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsZUFBZTt5QkFDMUMsQ0FBQyxDQUFDO3dCQUVSLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUNyQyxDQUFDOzRCQUNBLE1BQU0sVUFBVSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7NEJBQ3BDLFdBQVcsQ0FBQyx1QkFBdUIsQ0FBQyxVQUFVLENBQUMsQ0FBQTs0QkFDL0MsVUFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFBO3dCQUNyRCxDQUFDO29CQUNGLENBQUMsQ0FBQTtnQkFDRixDQUFDO1lBQ0YsQ0FBQztpQkFFRCxDQUFDO2dCQUNBLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUNwQyxDQUFDO29CQUNBLE1BQU0sVUFBVSxHQUFHLElBQUksZ0JBQWdCLEVBQUUsQ0FBQztvQkFDMUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUE7b0JBQ3RDLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQyxDQUFBO29CQUN0RSxVQUFVLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRTt3QkFDekIsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO3dCQUM3QixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO3dCQUNqQixLQUFLLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUUsRUFDdkMsQ0FBQzs0QkFDQSxNQUFNLFdBQVcsR0FBRyxJQUFJLGdCQUFnQixFQUFFLENBQUM7NEJBQzNDLFVBQVUsQ0FBQyx1QkFBdUIsQ0FBQyxXQUFXLENBQUMsQ0FBQTs0QkFDL0MsV0FBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFBOzRCQUMzSCxXQUFXLENBQUMsT0FBTyxHQUFHLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtnQ0FDakMsQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFBO2dDQUNuQixNQUFNLEtBQUssR0FBRyxNQUFNLElBQUksQ0FBQyx5REFBeUQsQ0FBQztvQ0FDdEUsZ0JBQWdCLEVBQUUsa0JBQWtCO29DQUNwQyxZQUFZLEVBQUUsY0FBYztvQ0FDNUIsY0FBYyxFQUFFLGVBQWU7b0NBQy9CLGVBQWUsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsZUFBZTtpQ0FDaEQsQ0FBQyxDQUFDO2dDQUNSLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUNyQyxDQUFDO29DQUNBLE1BQU0sVUFBVSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7b0NBQ3BDLFdBQVcsQ0FBQyx1QkFBdUIsQ0FBQyxVQUFVLENBQUMsQ0FBQTtvQ0FDL0MsVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUE7Z0NBQ3hDLENBQUM7NEJBRUYsQ0FBQyxDQUFBO3dCQUNGLENBQUM7b0JBQ0YsQ0FBQyxDQUFBO2dCQUNGLENBQUM7WUFDRixDQUFDO1FBQ0YsQ0FBQztJQUNGLENBQUM7Q0FDRDtBQUVELGNBQWMsQ0FBQyxNQUFNLENBQUMsMEJBQTBCLEVBQUUsbUJBQW1CLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAoQykgMjAyNCBDYXRjaCBTb2x2ZSBkaSBEYXZpZGUgTW9udGVzaW5cbiAqIExpY2Vuc2U6IEFHUExcbiAqL1xuXG5pbXBvcnQgeyBjc19jYXN0LCB0aHJvd05QRSB9IGZyb20gXCIuL3F1YWxpdHkuanNcIjtcbmltcG9ydCB7QVBJMywgY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9yZWNvcmRfY2hlY2tfZmFpbGVkX19yb3d9IGZyb20gJy4vYXBpL2FwaTMuanMnO1xuaW1wb3J0IHsgT3BlbkNsb3NlU2VjdGlvbiB9IGZyb20gXCIuL09wZW5DbG9zZVNlY3Rpb24uanNcIjtcbmltcG9ydCB7IFNlY3Rpb25Sb3cgfSBmcm9tIFwiLi9TZWN0aW9uUm93LmpzXCI7XG5pbXBvcnQgeyBMb2FkZXIgfSBmcm9tIFwiLi9Mb2FkZXIuanNcIjtcbmltcG9ydCB7IERhdGFzZXRJc3N1ZUNhdGVnb3J5Q29tcG9uZW50IH0gZnJvbSBcIi4vRGF0YXNldElzc3VlQ2F0ZWdvcnlDb21wb25lbnQuanNcIjtcbmltcG9ydCB7IEdlbmVyYWxJbmZvQW5kU2V0dGluZ3MgfSBmcm9tIFwiLi9HZW5lcmFsSW5mb0FuZFNldHRpbmdzLmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBEYXRhc2V0SXNzdWVzRGV0YWlsIGV4dGVuZHMgSFRNTEVsZW1lbnRcbntcblx0XG5cdGNvbnRhaW5lciBcblx0XG5cdGxhc3Rfc2Vzc2lvbl9zdGFydF90czogc3RyaW5nfG51bGwgPSBudWxsXG5cdGxhc3RfZGF0YXNldF9uYW1lOiBzdHJpbmd8bnVsbCA9IG51bGxcblx0bGFzdF9jaGVja19jYXRlZ29yeTogc3RyaW5nfG51bGwgPSBudWxsXG5cdGxhc3RfZmFpbGVkX3JlY29yZHM6IG51bWJlcnxudWxsID0gbnVsbFxuXHRsYXN0X3RvdF9yZWNvcmRzOiBudW1iZXJ8bnVsbCA9IG51bGxcblx0XG5cdGN1cnJlbnRfdGFiOiAnaXNzdWVzJyB8ICdyZWNvcmRzJyA9ICdpc3N1ZXMnXG5cdFxuXHRzcm9vdFxuXHRcblx0Y2FudmFzXG5cdFxuXHQvLyBjb25uZWN0ZWRfcHJvbWlzZVxuXHQvLyBjb25uZWN0ZWRfZnVuYzogKHM6IG51bGwpID0+IHZvaWQgPSBzID0+IG51bGxcblx0XG5cdGNoYXJ0anNfc3VjY2VzczogKHM6IENoYXJ0KSA9PiB2b2lkXG5cdGNoYXJ0anNfcHJvbWlzZTogUHJvbWlzZTxDaGFydD5cblxuXHRpc3N1ZXM6IEhUTUxTcGFuRWxlbWVudDtcblx0cmVjb3JkczogSFRNTFNwYW5FbGVtZW50O1xuICAgIC8vIGluZm9fYW5kX3NldHRpbmdzOiBHZW5lcmFsSW5mb0FuZFNldHRpbmdzO1xuXG5cdGNvbm5lY3RlZENhbGxiYWNrKClcblx0e1xuXHRcdC8vIGNoYXJ0anMgbmVlZCB0byBiZSBjcmVhdGVkIHdoZW4gZWxlbWVudCBpcyBhdHRhY2hlZCBpbnRvIHRoZSBkb21cblx0XHRjb25zdCBjaGFydCA9IG5ldyBDaGFydCh0aGlzLmNhbnZhcywge1xuXHRcdFx0dHlwZTogJ2xpbmUnLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRsYWJlbHM6IFsnLTUnLCctNCcsJy0zJywgJy0yJywgJy0xJ10sXG5cdFx0XHRcdGRhdGFzZXRzOiBbXVxuXHRcdFx0fSxcblx0XHRcdG9wdGlvbnM6IHtcblx0XHRcdFx0c2NhbGVzOiB7XG5cdFx0XHRcdFx0eToge1xuXHRcdFx0XHRcdFx0c3RhY2tlZDogdHJ1ZSxcblx0XHRcdFx0XHRcdGJlZ2luQXRaZXJvOiB0cnVlXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFxuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdFxuXHRcdHRoaXMuY2hhcnRqc19zdWNjZXNzKGNoYXJ0KVxuXHR9XG5cdFxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpXG5cdFx0dGhpcy5jaGFydGpzX3N1Y2Nlc3MgPSAocykgPT4ge30gLy8gZHVtbXkgaW5pdGlhbGl6YXRpb24sIG5leHQgbGluZSB3aWxsIGluaXQgY2hhcnRqc19zdWNjZXNzIGJ1dCBjb21waWxlciBkb24ndCB1bmRlcnN0YW5kIHRoaXMhXG5cdFx0dGhpcy5jaGFydGpzX3Byb21pc2UgPSBuZXcgUHJvbWlzZShzID0+IHRoaXMuY2hhcnRqc19zdWNjZXNzID0gcylcblx0XHR0aGlzLnNyb290ID0gdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSlcblx0XHR0aGlzLnNyb290LmlubmVySFRNTCA9IGBcblx0XHRcdFx0PHN0eWxlPlxuXHRcdFx0XHRcdDpob3N0IHtcblx0XHRcdFx0XHRcdHBhZGRpbmc6IDAuNXJlbTtcblx0XHRcdFx0XHRcdGRpc3BsYXk6IGJsb2NrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQuY29udGFpbmVyIHtcblx0XHRcdFx0XHRcdGJvcmRlcjogMXB4IHNvbGlkICNjY2M7XG5cdFx0XHRcdFx0XHRib3JkZXItcmFkaXVzOiAwLjNyZW07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdC5jb250YWluZXIgPiAqIHtcblx0XHRcdFx0XHRcdGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjY2NjO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQuaGVhZGVyIHtcblx0XHRcdFx0XHRcdGRpc3BsYXk6IGZsZXg7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC5oZWFkZXIgLmNoYXJ0IHtcblx0XHRcdFx0XHRcdHdpZHRoOiA1MCU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdC5hY3Rpb25zIHtcblx0XHRcdFx0XHRcdGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xuXHRcdFx0XHRcdFx0d2lkdGg6IDEwcmVtO1xuXHRcdFx0XHRcdFx0bWFyZ2luLWxlZnQ6IGF1dG87XG5cdFx0XHRcdFx0XHRkaXNwbGF5OiBmbGV4O1xuXHRcdFx0XHRcdFx0Ym9yZGVyLXJhZGl1czogMC40cmVtO1xuXHRcdFx0XHRcdFx0bWFyZ2luLWJvdHRvbTogMC41cmVtO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcblx0XHRcdFx0XHQuYWN0aW9ucyBzcGFuLnNlbGVjdGVkIHtcblx0XHRcdFx0XHRcdGNvbG9yOiB3aGl0ZTtcblx0XHRcdFx0XHRcdGJhY2tncm91bmQtY29sb3I6IGJsYWNrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcblx0XHRcdFx0XHQuYWN0aW9ucyBzcGFuIHtcblx0XHRcdFx0XHRcdGZsZXgtZ3JvdzogNTA7XG5cdFx0XHRcdFx0XHR0ZXh0LWFsaWduOiBjZW50ZXI7XG5cdFx0XHRcdFx0XHRjdXJzb3I6IHBvaW50ZXI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFxuXHRcdFx0XHQ8L3N0eWxlPlxuXHRcdFx0XHQ8IS0tIDxpbWcgc3JjPVwia3BpLWRldGFpbC5wbmdcIiBzdHlsZT1cIm1heC13aWR0aDogMTAwJVwiPiAtLT5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImhlYWRlclwiPlxuXHRcdFx0XHRcdDxkaXY+XG5cdFx0XHRcdFx0XHQ8Y3MtZGF0YXNldC1pc3N1ZS1jYXRlZ29yeT48L2NzLWRhdGFzZXQtaXNzdWUtY2F0ZWdvcnk+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNoYXJ0XCI+XG5cdFx0XHRcdFx0XHQ8Y2FudmFzPjwvY2FudmFzPlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwhLS08Y3MtZ2VuZXJhbC1pbmZvLWFuZC1zZXR0aW5ncz48L2NzLWdlbmVyYWwtaW5mby1hbmQtc2V0dGluZ3M+LS0+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8ZGl2IHN0eWxlPVwid2lkdGg6IGNhbGMoMTAwJSAtIDIwcHgpXCI+XG5cdFx0XHRcdFx0PGRpdiBzdHlsZT1cInRleHQtYWxpZ246IHJpZ2h0XCIgY2xhc3M9XCJhY3Rpb25zXCI+XG5cdFx0XHRcdFx0XHQ8c3BhbiBjbGFzcz1cImlzc3Vlc1wiPklzc3Vlczwvc3Bhbj5cblx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzPVwicmVjb3Jkc1wiPlJlY29yZHM8L3NwYW4+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPjwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0YFxuXG5cdFx0Y3VzdG9tRWxlbWVudHMudXBncmFkZSh0aGlzLnNyb290KVxuXG5cdFx0dGhpcy5jb250YWluZXIgPSBjc19jYXN0KEhUTUxEaXZFbGVtZW50LCB0aGlzLnNyb290LnF1ZXJ5U2VsZWN0b3IoJy5jb250YWluZXInKSlcblx0XHRcblx0XHR0aGlzLmlzc3VlcyA9IGNzX2Nhc3QoSFRNTFNwYW5FbGVtZW50LCB0aGlzLnNyb290LnF1ZXJ5U2VsZWN0b3IoJy5pc3N1ZXMnKSlcblx0XHR0aGlzLnJlY29yZHMgPSBjc19jYXN0KEhUTUxTcGFuRWxlbWVudCwgdGhpcy5zcm9vdC5xdWVyeVNlbGVjdG9yKCcucmVjb3JkcycpKVxuXHRcdFxuXHRcdHRoaXMuaXNzdWVzLm9uY2xpY2sgPSAoKSA9PiB7XG5cdFx0XHR0aGlzLmN1cnJlbnRfdGFiID0gJ2lzc3Vlcydcblx0XHRcdGlmICh0aGlzLmxhc3Rfc2Vzc2lvbl9zdGFydF90cyAhPSBudWxsICYmIHRoaXMubGFzdF9kYXRhc2V0X25hbWUgIT0gbnVsbCAmJiB0aGlzLmxhc3RfY2hlY2tfY2F0ZWdvcnkgIT0gbnVsbFxuXHRcdFx0XHQmJiB0aGlzLmxhc3RfZmFpbGVkX3JlY29yZHMgIT0gbnVsbCAmJiB0aGlzLmxhc3RfdG90X3JlY29yZHMgIT0gbnVsbClcblx0XHRcdFx0dGhpcy5yZWZyZXNoKHRoaXMubGFzdF9zZXNzaW9uX3N0YXJ0X3RzLCB0aGlzLmxhc3RfZGF0YXNldF9uYW1lLCB0aGlzLmxhc3RfY2hlY2tfY2F0ZWdvcnksIHRoaXMubGFzdF9mYWlsZWRfcmVjb3JkcywgdGhpcy5sYXN0X3RvdF9yZWNvcmRzKVxuXHRcdH1cblx0XHRcblx0XHR0aGlzLnJlY29yZHMub25jbGljayA9ICgpID0+IHtcblx0XHRcdHRoaXMuY3VycmVudF90YWIgPSAncmVjb3Jkcydcblx0XHRcdGlmICh0aGlzLmxhc3Rfc2Vzc2lvbl9zdGFydF90cyAhPSBudWxsICYmIHRoaXMubGFzdF9kYXRhc2V0X25hbWUgIT0gbnVsbCAmJiB0aGlzLmxhc3RfY2hlY2tfY2F0ZWdvcnkgIT0gbnVsbFxuXHRcdFx0XHQmJiB0aGlzLmxhc3RfZmFpbGVkX3JlY29yZHMgIT0gbnVsbCAmJiB0aGlzLmxhc3RfdG90X3JlY29yZHMgIT0gbnVsbClcblx0XHRcdFx0dGhpcy5yZWZyZXNoKHRoaXMubGFzdF9zZXNzaW9uX3N0YXJ0X3RzLCB0aGlzLmxhc3RfZGF0YXNldF9uYW1lLCB0aGlzLmxhc3RfY2hlY2tfY2F0ZWdvcnksIHRoaXMubGFzdF9mYWlsZWRfcmVjb3JkcywgdGhpcy5sYXN0X3RvdF9yZWNvcmRzKVxuXHRcdH1cblx0XHRcblx0XHR0aGlzLmNhbnZhcyA9IGNzX2Nhc3QoSFRNTENhbnZhc0VsZW1lbnQsIHRoaXMuc3Jvb3QucXVlcnlTZWxlY3RvcignY2FudmFzJykpO1xuXHRcdFxuXHRcdC8vIHRoaXMuaW5mb19hbmRfc2V0dGluZ3MgPSBjc19jYXN0KEdlbmVyYWxJbmZvQW5kU2V0dGluZ3MsIHRoaXMuc3Jvb3QucXVlcnlTZWxlY3RvcignY3MtZ2VuZXJhbC1pbmZvLWFuZC1zZXR0aW5ncycpKTtcblxuXG5cdH1cblx0XG5cdGV4dHJhY3RIdW1hblJlYWRhYmxlTmFtZShyZWNvcmRfanNvbnBhdGg6IHN0cmluZywganNvbjogc3RyaW5nKTogc3RyaW5nXG5cdHtcblx0XHRsZXQgcmV0ID0gJyc7XG5cdFx0Zm9yIChsZXQgZm4gb2YgWydtdmFsaWR0aW1lJywgJ212YWx1ZScsICdBY2NvRGV0YWlsLmRlLk5hbWUnLCAnRGV0YWlsLmRlLlRpdGxlJ10pXG5cdFx0e1xuXHRcdFx0Y29uc3QgZm5fcGFydHMgPSBmbi5zcGxpdCgnLicpXG5cdFx0XHRsZXQgdmFsID0gSlNPTi5wYXJzZShqc29uKVxuXHRcdFx0Zm9yIChsZXQgcCBvZiBmbl9wYXJ0cylcblx0XHRcdHtcblx0XHRcdFx0dmFsID0gdmFsW3BdXG5cdFx0XHRcdGlmICh2YWwgPT09IHVuZGVmaW5lZClcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdC8vIGNvbnN0IHZhbCA9IHN0YXJ0W2ZuXSBcblx0XHRcdGlmICh2YWwgIT09IHVuZGVmaW5lZClcblx0XHRcdFx0cmV0ICs9IChyZXQgPT09ICcnID8gJycgOiAnLCAnKSArIGZuICsgJz0nICsgSlNPTi5zdHJpbmdpZnkodmFsKVxuXHRcdH1cblx0XHRpZiAocmV0ID09ICcnKVxuXHRcdFx0cmV0ID0gcmVjb3JkX2pzb25wYXRoXG5cdFx0cmV0dXJuIHJldDtcblx0fVxuXHRcblx0Z3JvdXBSZWNvcmRzKGxpc3Q6IHtyZWNvcmRfanNvbjogc3RyaW5nfVtdKToge1trOnN0cmluZ106IGFueVtdfVxuXHR7XG5cdFx0Y29uc3QgZ3JvdXBCeToge1trOnN0cmluZ106IGFueVtdfSA9IHt9XG5cdFx0Zm9yIChsZXQgayA9IDA7IGsgPCBsaXN0Lmxlbmd0aDsgaysrKVxuXHRcdHtcblx0XHRcdGNvbnN0IGpzb24gPSBKU09OLnBhcnNlKGxpc3Rba10ucmVjb3JkX2pzb24pO1xuXHRcdFx0bGV0IHNuYW1lID0ganNvblsnc25hbWUnXTtcblx0XHRcdGlmICh0eXBlb2Ygc25hbWUgIT09ICdzdHJpbmcnKVxuXHRcdFx0XHRzbmFtZSA9ICcnXG5cdFx0XHRsZXQgcHJldl9hcnIgPSBncm91cEJ5W3NuYW1lXVxuXHRcdFx0cHJldl9hcnIgPSBwcmV2X2FyciA9PT0gdW5kZWZpbmVkID8gW10gOiBwcmV2X2FyclxuXHRcdFx0cHJldl9hcnIucHVzaChsaXN0W2tdKVxuXHRcdFx0Z3JvdXBCeVtzbmFtZV0gPSBwcmV2X2FyclxuXHRcdH1cblx0XHRyZXR1cm4gZ3JvdXBCeTsgXG5cdH1cblx0XG5cdGFzeW5jIHJlZnJlc2gocF9zZXNzaW9uX3N0YXJ0X3RzOiBzdHJpbmcsIHBfZGF0YXNldF9uYW1lOiBzdHJpbmcsIHBfY2F0ZWdvcnlfbmFtZTogc3RyaW5nLCBwX2ZhaWxlZF9yZWNvcmRzOiBudW1iZXIsIHBfdG90X3JlY29yZHM6IG51bWJlcikge1xuXHRcdFxuXHRcdHRoaXMubGFzdF9zZXNzaW9uX3N0YXJ0X3RzID0gcF9zZXNzaW9uX3N0YXJ0X3RzXG5cdFx0dGhpcy5sYXN0X2RhdGFzZXRfbmFtZSA9IHBfZGF0YXNldF9uYW1lXG5cdFx0dGhpcy5sYXN0X2NoZWNrX2NhdGVnb3J5ID0gcF9jYXRlZ29yeV9uYW1lXG5cdFx0dGhpcy5sYXN0X2ZhaWxlZF9yZWNvcmRzID0gcF9mYWlsZWRfcmVjb3Jkc1xuXHRcdHRoaXMubGFzdF90b3RfcmVjb3JkcyA9IHBfdG90X3JlY29yZHNcblx0XHRcblx0XHQvLyB0aGlzLmluZm9fYW5kX3NldHRpbmdzLnJlZnJlc2gocF9zZXNzaW9uX3N0YXJ0X3RzLCBwX2RhdGFzZXRfbmFtZSwgcF9mYWlsZWRfcmVjb3JkcywgcF90b3RfcmVjb3Jkcylcblx0XHRcblx0XHRjb25zb2xlLmxvZyhwX3Nlc3Npb25fc3RhcnRfdHMpXG5cdFx0Y29uc29sZS5sb2cocF9kYXRhc2V0X25hbWUpXG5cdFx0Y29uc29sZS5sb2cocF9jYXRlZ29yeV9uYW1lKTtcblx0XHRcblx0XHQoYXN5bmMgKCkgPT4ge1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGNvbnN0IGRhdGEgPSBhd2FpdCBBUEkzLmxpc3RfX2NhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfaGlzdG9yeV92dyh7XG5cdFx0XHRcdFx0XHRkYXRhc2V0X25hbWU6IHRoaXMubGFzdF9kYXRhc2V0X25hbWUhLFxuXHRcdFx0XHRcdFx0Y2hlY2tfY2F0ZWdvcnk6IHRoaXMubGFzdF9jaGVja19jYXRlZ29yeSFcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdC8vIGNvbnN0IGdvb2RhcnIgID0gW11cblx0XHRcdFx0XHQvLyBjb25zdCBmYWlsYXJyICA9IFtdXG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0Y29uc3QgbGFiZWxzICAgPSBbXVxuXHRcdFx0XHRcdGNvbnN0IGRhdGFzZXRzID0gW11cblx0XHRcdFx0XHRcblx0XHRcdFx0XHRmb3IgKGxldCB4ID0gMDsgeCA8IGRhdGEubGVuZ3RoOyB4KyspXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Y29uc3Qgcm93ID0gZGF0YVt4XVxuXHRcdFx0XHRcdFx0bGFiZWxzLnB1c2gocm93LnNlc3Npb25fc3RhcnRfdHMuc2xpY2UoMCwxNikucmVwbGFjZSgnVCcsICcgJykpXG5cdFx0XHRcdFx0XHRjb25zdCBjaGVja19zdGF0cyA9IEpTT04ucGFyc2Uocm93LmNoZWNrX3N0YXRzKTtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGNoZWNrX3N0YXRzKVxuXHRcdFx0XHRcdFx0Zm9yIChsZXQgYyA9IDA7IGMgPCBjaGVja19zdGF0cy5sZW5ndGg7IGMrKylcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y29uc3QgY2hlY2tfc3RhdCA9IGNoZWNrX3N0YXRzW2NdXG5cdFx0XHRcdFx0XHRcdGxldCBmb3VuZCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHRmb3IgKGxldCBkID0gMDsgZCA8IGRhdGFzZXRzLmxlbmd0aDsgZCsrKVxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGRhdGFzZXRzW2RdLmxhYmVsID09IGNoZWNrX3N0YXQuY2hlY2tfbmFtZSlcblx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhc2V0c1tkXS5kYXRhLnB1c2goY2hlY2tfc3RhdC5mYWlsZWRfcmVjcylcblx0XHRcdFx0XHRcdFx0XHRcdGZvdW5kID0gdHJ1ZVxuXHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmICghZm91bmQpXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRkYXRhc2V0cy5wdXNoKHtcblx0XHRcdFx0XHRcdFx0XHRcdGxhYmVsOiBjaGVja19zdGF0LmNoZWNrX25hbWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhOiBbY2hlY2tfc3RhdC5mYWlsZWRfcmVjc10sXG5cdFx0XHRcdFx0XHRcdFx0XHRmaWxsOiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0XHRcdGJhY2tncm91bmRDb2xvcjogJyNhYWEnLFxuXHRcdFx0XHRcdFx0XHRcdFx0Ym9yZGVyQ29sb3I6ICcjYWFhJyxcblx0XHRcdFx0XHRcdFx0XHRcdHRlbnNpb246IDAuMVxuXHRcdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdC8qXG5cdFx0XHRcdFx0XHRnb29kYXJyLnB1c2goZGF0YVt4XS50ZXN0ZWRfcmVjb3JkcyAtIGRhdGFbeF0uZmFpbGVkX3JlY3MpXG5cdFx0XHRcdFx0XHRmYWlsYXJyLnB1c2goZGF0YVt4XS5mYWlsZWRfcmVjcylcblx0XHRcdFx0XHRcdCAqL1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcblx0XHRcdFx0XHRjb25zdCBjaGFydGpzID0gYXdhaXQgdGhpcy5jaGFydGpzX3Byb21pc2Vcblx0XHRcdFx0XHRjaGFydGpzLmRhdGEubGFiZWxzID0gbGFiZWxzXG5cdFx0XHRcdFx0Y2hhcnRqcy5kYXRhLmRhdGFzZXRzID0gZGF0YXNldHNcblx0XHRcdFx0XHRcblx0XHRcdFx0XHQvKlxuXHRcdFx0XHRcdGNoYXJ0anMuZGF0YS5kYXRhc2V0cyA9IFtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGFiZWw6ICdmYWlsIHRyZW5kJyxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YTogZmFpbGFycixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZmlsbDogZmFsc2UsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGJhY2tncm91bmRDb2xvcjogJyMyMjInLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRib3JkZXJDb2xvcjogJyMyMjInLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0ZW5zaW9uOiAwLjFcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxhYmVsOiAndG90YWwgdHJlbmQnLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhOiBnb29kYXJyLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmaWxsOiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiAnI2FhYScsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGJvcmRlckNvbG9yOiAnI2FhYScsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRlbnNpb246IDAuMVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSxcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRdXG5cdFx0XHRcdFx0Ki9cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRjaGFydGpzLnVwZGF0ZSgpXG5cdFx0XHRcdFx0XHRcdFx0XHRcblx0XHR9KSgpO1xuXHRcdFxuXHRcdGNvbnN0IGNhdGVnb3J5ID0gY3NfY2FzdChEYXRhc2V0SXNzdWVDYXRlZ29yeUNvbXBvbmVudCwgdGhpcy5zcm9vdC5xdWVyeVNlbGVjdG9yKCdjcy1kYXRhc2V0LWlzc3VlLWNhdGVnb3J5JykpXG5cdFx0Y2F0ZWdvcnkuaGlkZU1vcmVEaXYoKVxuXHRcdGNhdGVnb3J5LnJlZnJlc2goXG5cdFx0e1xuXHRcdFx0ZGF0YXNldF9uYW1lOiBwX2RhdGFzZXRfbmFtZSxcblx0XHRcdHNlc3Npb25fc3RhcnRfdHM6IHBfc2Vzc2lvbl9zdGFydF90cyxcblx0XHRcdGNoZWNrX2NhdGVnb3J5OiBwX2NhdGVnb3J5X25hbWUsXG5cdFx0XHRmYWlsZWRfcmVjb3JkczogcF9mYWlsZWRfcmVjb3Jkcyxcblx0XHRcdHRvdF9yZWNvcmRzOiBwX3RvdF9yZWNvcmRzXG5cdFx0fSlcblx0XHRcblx0XHR0aGlzLmNvbnRhaW5lci50ZXh0Q29udGVudCA9ICcnXG5cdFx0XG5cdFx0aWYgKHRoaXMuY3VycmVudF90YWIgPT09ICdpc3N1ZXMnKVxuXHRcdHtcblx0XHRcdHRoaXMucmVjb3Jkcy5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpXG5cdFx0XHR0aGlzLmlzc3Vlcy5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpXG5cdFx0XHRcblx0XHRcdGNvbnN0IGxvYWRlciA9IG5ldyBMb2FkZXIoKTtcblx0XHRcdHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKGxvYWRlcilcblx0XHRcblx0XHRcdGNvbnN0IGpzb24gPSBhd2FpdCBBUEkzLmxpc3RfX2NhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfY2hlY2tfY2F0ZWdvcnlfY2hlY2tfbmFtZV9yZWNvcmRfcmVjb3JkX2ZhaWxlZF92dyh7XG5cdFx0XHRcdHNlc3Npb25fc3RhcnRfdHM6IHBfc2Vzc2lvbl9zdGFydF90cyxcblx0XHRcdFx0ZGF0YXNldF9uYW1lOiBwX2RhdGFzZXRfbmFtZSxcblx0XHRcdFx0Y2hlY2tfY2F0ZWdvcnk6IHBfY2F0ZWdvcnlfbmFtZVxuXHRcdFx0fSlcblxuXHRcdFx0bG9hZGVyLnJlbW92ZSgpO1xuXHRcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwganNvbi5sZW5ndGg7IGkrKylcblx0XHRcdHtcblx0XHRcdFx0Y29uc3QgaXNzdWUgPSBqc29uW2ldXG5cdFx0XHRcdC8vIGNvbnNvbGUubG9nKGlzc3VlKVxuXHRcdFx0XHRjb25zdCBzZWN0aW9uID0gbmV3IE9wZW5DbG9zZVNlY3Rpb24oKVxuXHRcdFx0XHRzZWN0aW9uLnJlZnJlc2goJ2ZhaWxlZDogJyArIGlzc3VlLmNoZWNrX25hbWUsICcnICsgaXNzdWUubnJfcmVjb3JkcyArICcgcmVjb3JkcycpXG5cdFx0XHRcdHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHNlY3Rpb24pXG5cdFx0XHRcdFxuXHRcdFx0XHRzZWN0aW9uLm9ub3BlbiA9IGFzeW5jICgpID0+IHtcblx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKCdzZXppb25lIGFwZXJ0YSwgcmljYXJpY28hJylcblx0XHRcdFx0XHRjb25zdCBqc29uMiA9IGF3YWl0IEFQSTMubGlzdF9fY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9yZWNvcmRfY2hlY2tfZmFpbGVkKHtcblx0XHRcdFx0XHRcdFx0XHRzZXNzaW9uX3N0YXJ0X3RzOiBwX3Nlc3Npb25fc3RhcnRfdHMsXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YXNldF9uYW1lOiBwX2RhdGFzZXRfbmFtZSxcblx0XHRcdFx0XHRcdFx0XHRjaGVja19jYXRlZ29yeTogcF9jYXRlZ29yeV9uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdGNoZWNrX25hbWU6IGlzc3VlLmNoZWNrX25hbWVcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRjb25zdCBncm91cEJ5ID0gdGhpcy5ncm91cFJlY29yZHMoanNvbjIpXG5cdFx0XHRcdFx0Y29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGdyb3VwQnkpXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coa2V5cylcblx0XHRcdFx0XHRpZiAoa2V5cy5sZW5ndGggPT0gMSAmJiBrZXlzWzBdID09ICcnKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGNvbnN0IGxpc3QgPSBncm91cEJ5W2tleXNbMF1dXG5cdFx0XHRcdFx0XHRmb3IgKGxldCBrMiA9IDA7IGsyIDwgbGlzdC5sZW5ndGg7IGsyKyspXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IHNlY3Rpb25Sb3cyID0gbmV3IFNlY3Rpb25Sb3coKTtcblx0XHRcdFx0XHRcdFx0c2VjdGlvbi5hZGRFbGVtZW50VG9Db250ZW50QXJlYShzZWN0aW9uUm93Milcblx0XHRcdFx0XHRcdFx0Ly8gc2VjdGlvblJvdzIucmVmcmVzaCh0aGlzLmV4dHJhY3RIdW1hblJlYWRhYmxlTmFtZShsaXN0W2syXS5yZWNvcmRfanNvbnBhdGgsIGxpc3RbazJdLnJlY29yZF9qc29uKSlcblx0XHRcdFx0XHRcdFx0c2VjdGlvblJvdzIucmVmcmVzaChsaXN0W2syXS5wcm9ibGVtX2hpbnQpXG5cdFx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cyLm9uY2xpY2sgPSAoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0YWxlcnQobGlzdFtrMl0ucmVjb3JkX2pzb24pXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGZvciAobGV0IGsgPSAwOyBrIDwga2V5cy5sZW5ndGg7IGsrKylcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y29uc3Qgc2VjdGlvblJvdyA9IG5ldyBPcGVuQ2xvc2VTZWN0aW9uKCk7XG5cdFx0XHRcdFx0XHRcdHNlY3Rpb24uYWRkRWxlbWVudFRvQ29udGVudEFyZWEoc2VjdGlvblJvdylcblx0XHRcdFx0XHRcdFx0c2VjdGlvblJvdy5yZWZyZXNoKGtleXNba10sICcnICsgZ3JvdXBCeVtrZXlzW2tdXS5sZW5ndGggKyAnIHJlY29yZHMnKVxuXHRcdFx0XHRcdFx0XHRzZWN0aW9uUm93Lm9uY2xpY2sgPSAoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0Y29uc3QgbGlzdCA9IGdyb3VwQnlba2V5c1trXV1cblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhsaXN0KVxuXHRcdFx0XHRcdFx0XHRcdGZvciAobGV0IGsyID0gMDsgazIgPCBsaXN0Lmxlbmd0aDsgazIrKylcblx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBzZWN0aW9uUm93MiA9IG5ldyBTZWN0aW9uUm93KCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRzZWN0aW9uUm93LmFkZEVsZW1lbnRUb0NvbnRlbnRBcmVhKHNlY3Rpb25Sb3cyKVxuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gc2VjdGlvblJvdzIucmVmcmVzaCh0aGlzLmV4dHJhY3RIdW1hblJlYWRhYmxlTmFtZShsaXN0W2syXS5yZWNvcmRfanNvbnBhdGgsIGxpc3RbazJdLnJlY29yZF9qc29uKSlcblx0XHRcdFx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cyLnJlZnJlc2gobGlzdFtrMl0ucHJvYmxlbV9oaW50KVxuXHRcdFx0XHRcdFx0XHRcdFx0c2VjdGlvblJvdzIub25jbGljayA9ICgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0YWxlcnQobGlzdFtrMl0ucmVjb3JkX2pzb24pXG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRcdFx0XG5cdFx0fVxuXHRcdFxuXHRcdFxuXHRcdGlmICh0aGlzLmN1cnJlbnRfdGFiID09PSAncmVjb3JkcycpXG5cdFx0e1xuXHRcdFx0dGhpcy5pc3N1ZXMuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKVxuXHRcdFx0dGhpcy5yZWNvcmRzLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJylcblx0XHRcdFxuXHRcdFx0Y29uc3QgbG9hZGVyID0gbmV3IExvYWRlcigpO1xuXHRcdFx0dGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQobG9hZGVyKVxuXG5cdFx0XHRjb25zdCBqc29uID0gYXdhaXQgQVBJMy5saXN0X19jYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X2NoZWNrX2NhdGVnb3J5X3JlY29yZF9qc29ucGF0aF9mYWlsZWRfdncoe1xuXHRcdFx0XHRzZXNzaW9uX3N0YXJ0X3RzOiBwX3Nlc3Npb25fc3RhcnRfdHMsXG5cdFx0XHRcdGRhdGFzZXRfbmFtZTogcF9kYXRhc2V0X25hbWUsXG5cdFx0XHRcdGNoZWNrX2NhdGVnb3J5OiBwX2NhdGVnb3J5X25hbWVcblx0XHRcdH0pO1xuXHRcdFx0XG5cdFx0XHRsb2FkZXIucmVtb3ZlKCk7XG5cblx0XHRcdGNvbnN0IGdyb3VwQnkgPSB0aGlzLmdyb3VwUmVjb3Jkcyhqc29uKVxuXHRcdFx0Y29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGdyb3VwQnkpXG5cdFx0XHRjb25zb2xlLmxvZyhrZXlzKVxuXHRcdFx0aWYgKGtleXMubGVuZ3RoID09IDEgJiYga2V5c1swXSA9PSAnJylcblx0XHRcdHtcblx0XHRcdFx0Y29uc3QgbGlzdCA9IGdyb3VwQnlba2V5c1swXV1cblx0XHRcdFx0Zm9yIChsZXQgazIgPSAwOyBrMiA8IGxpc3QubGVuZ3RoOyBrMisrKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Y29uc3Qgc2VjdGlvblJvdzIgPSBuZXcgT3BlbkNsb3NlU2VjdGlvbigpO1xuXHRcdFx0XHRcdHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHNlY3Rpb25Sb3cyKVxuXHRcdFx0XHRcdHNlY3Rpb25Sb3cyLnJlZnJlc2godGhpcy5leHRyYWN0SHVtYW5SZWFkYWJsZU5hbWUobGlzdFtrMl0ucmVjb3JkX2pzb25wYXRoLCBsaXN0W2syXS5yZWNvcmRfanNvbiksICcnICsgbGlzdFtrMl0ubnJfY2hlY2tfbmFtZXMgKyAnIGNoZWNrIGZhaWxlZCcpXG5cdFx0XHRcdFx0c2VjdGlvblJvdzIub25jbGljayA9IGFzeW5jICgpID0+IHtcblx0XHRcdFx0XHRcdGNvbnN0IGpzb24yID0gYXdhaXQgQVBJMy5saXN0X19jYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X3JlY29yZF9jaGVja19mYWlsZWQoe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzZXNzaW9uX3N0YXJ0X3RzOiBwX3Nlc3Npb25fc3RhcnRfdHMsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGFzZXRfbmFtZTogcF9kYXRhc2V0X25hbWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNoZWNrX2NhdGVnb3J5OiBwX2NhdGVnb3J5X25hbWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlY29yZF9qc29ucGF0aDogbGlzdFtrMl0ucmVjb3JkX2pzb25wYXRoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdGZvciAobGV0IGsgPSAwOyBrIDwganNvbjIubGVuZ3RoOyBrKyspXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IHNlY3Rpb25Sb3cgPSBuZXcgU2VjdGlvblJvdygpO1xuXHRcdFx0XHRcdFx0XHRzZWN0aW9uUm93Mi5hZGRFbGVtZW50VG9Db250ZW50QXJlYShzZWN0aW9uUm93KVxuXHRcdFx0XHRcdFx0XHRzZWN0aW9uUm93LnJlZnJlc2goXCJmYWlsZWQ6IFwiICsganNvbjJba10uY2hlY2tfbmFtZSlcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2Vcblx0XHRcdHtcblx0XHRcdFx0Zm9yIChsZXQgayA9IDA7IGsgPCBrZXlzLmxlbmd0aDsgaysrKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Y29uc3Qgc2VjdGlvblJvdyA9IG5ldyBPcGVuQ2xvc2VTZWN0aW9uKCk7XG5cdFx0XHRcdFx0dGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoc2VjdGlvblJvdylcblx0XHRcdFx0XHRzZWN0aW9uUm93LnJlZnJlc2goa2V5c1trXSwgJycgKyBncm91cEJ5W2tleXNba11dLmxlbmd0aCArICcgcmVjb3JkcycpXG5cdFx0XHRcdFx0c2VjdGlvblJvdy5vbmNsaWNrID0gKCkgPT4ge1xuXHRcdFx0XHRcdFx0Y29uc3QgbGlzdCA9IGdyb3VwQnlba2V5c1trXV1cblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGxpc3QpXG5cdFx0XHRcdFx0XHRmb3IgKGxldCBrMiA9IDA7IGsyIDwgbGlzdC5sZW5ndGg7IGsyKyspXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IHNlY3Rpb25Sb3cyID0gbmV3IE9wZW5DbG9zZVNlY3Rpb24oKTtcblx0XHRcdFx0XHRcdFx0c2VjdGlvblJvdy5hZGRFbGVtZW50VG9Db250ZW50QXJlYShzZWN0aW9uUm93Milcblx0XHRcdFx0XHRcdFx0c2VjdGlvblJvdzIucmVmcmVzaCh0aGlzLmV4dHJhY3RIdW1hblJlYWRhYmxlTmFtZShsaXN0W2syXS5yZWNvcmRfanNvbnBhdGgsIGxpc3RbazJdLnJlY29yZF9qc29uKSwgbGlzdFtrMl0ubnJfY2hlY2tfbmFtZXMpXG5cdFx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cyLm9uY2xpY2sgPSBhc3luYyAoZSkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKClcblx0XHRcdFx0XHRcdFx0XHRjb25zdCBqc29uMiA9IGF3YWl0IEFQSTMubGlzdF9fY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9yZWNvcmRfY2hlY2tfZmFpbGVkKHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHNlc3Npb25fc3RhcnRfdHM6IHBfc2Vzc2lvbl9zdGFydF90cyxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGFzZXRfbmFtZTogcF9kYXRhc2V0X25hbWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjaGVja19jYXRlZ29yeTogcF9jYXRlZ29yeV9uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVjb3JkX2pzb25wYXRoOiBsaXN0W2syXS5yZWNvcmRfanNvbnBhdGhcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgayA9IDA7IGsgPCBqc29uMi5sZW5ndGg7IGsrKylcblx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBzZWN0aW9uUm93ID0gbmV3IFNlY3Rpb25Sb3coKTtcblx0XHRcdFx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cyLmFkZEVsZW1lbnRUb0NvbnRlbnRBcmVhKHNlY3Rpb25Sb3cpXG5cdFx0XHRcdFx0XHRcdFx0XHRzZWN0aW9uUm93LnJlZnJlc2goanNvbjJba10uY2hlY2tfbmFtZSlcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cblxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCdjcy1kYXRhc2V0LWlzc3Vlcy1kZXRhaWwnLCBEYXRhc2V0SXNzdWVzRGV0YWlsKVxuIl19