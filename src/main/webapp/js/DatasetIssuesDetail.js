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
                                sectionRow2.refresh(list[k2].record_jsonpath + ' ' + JSON.parse(list[k2].record_json)['mvalue']);
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
        /*
        if (this.current_tab === 'issues')
        {
            const json = await API3.list__catchsolve_noiodh__test_dataset_check_name_count_records_vw({
                        session_start_ts: p_session_start_ts,
                        dataset_name: p_dataset_name
                    });
            //console.log(json)
            
            for (let i = 0; i < json.length; i++)
            {
                const issue = json[i]
                // console.log(issue)
                const section = new OpenCloseSection()
                section.refresh(issue.check_name, '' + issue.nr_records + ' records')
                this.container.appendChild(section)
                section.onopen = async () => {
                    //console.log('sezione aperta, ricarico!')
                    const json2 = await API3.list__catchsolve_noiodh__test_dataset_check_name_fields_record_id_snippet_vw({
                                session_start_ts: p_session_start_ts,
                                dataset_name: p_dataset_name,
                                check_name: issue.check_name
                            });
                    //console.log(json2)
                    for (let k = 0; k < json2.length; k++)
                    {
                        const sectionRow = new SectionRow();
                        section.addElementToContentArea(sectionRow)
                        sectionRow.refresh(json2[k].record_names + ' [' + json2[k].record_id + ']' + ' (' + json2[k].fields + ')')
                        sectionRow.onclick = () => {
                            alert(json2[k].record_failed_json_snippet)
                        }
                    }
                }
            }
        }
        
        if (this.current_tab === 'records')
        {
            const json3 = await API3.list__catchsolve_noiodh__test_dataset_record_count_attributes_vw({
                session_start_ts: p_session_start_ts,
                dataset_name: p_dataset_name
            });
            //console.log(json3)
            for (let i = 0; i < json3.length; i++)
            {
                const issue = json3[i]
                //console.log(issue)
                const section = new OpenCloseSection()
                section.refresh(issue.record_names, '' + issue.count_attributes)
                this.container.appendChild(section)
                section.onopen = async () => {
                    //console.log('sezione aperta, ricarico!')
                    const json2 = await API3.list__catchsolve_noiodh__test_dataset_attribute_name_checks_record_id_snippet_vw({
                                session_start_ts: p_session_start_ts,
                                dataset_name: p_dataset_name,
                                record_id: issue.record_id
                            });
                    //console.log(json2)
                    for (let k = 0; k < json2.length; k++)
                    {
                        const sectionRow = new SectionRow();
                        section.addElementToContentArea(sectionRow)
                        sectionRow.refresh(json2[k].attribute_name + ' (' + json2[k].checks + ')')
                        sectionRow.onclick = () => {
                            alert(json2[k].record_failed_json_snippet)
                        }
                    }
                }
            }
        }
         */
        /*
        const resp = await API.issues_tree({})
        console.log(resp)
        for (let i = 0; i < resp.issues.length; i++)
        {
            const issue = resp.issues[i]
            console.log(issue)
            const section = new OpenCloseSection()
            section.setLabel(issue.issue)
            this.container.appendChild(section)
            for (let r = 0; r < issue.records.length; r++)
            {
                const record = issue.records[r]
                console.log(record)
                
                const sectionRow = new SectionRow();
                section.addElementToContentArea(sectionRow)
                sectionRow.refresh(record.record_id)
                
                for (let f = 0; f < record.fields.length; f++)
                    console.log(record.fields[f])
            }
        }
        */
        // const resp = await API.test_dataset_check_vw({})
        // console.log(resp)
        /*
        
        const resp = await API.readFails({})
        console.log(resp)
    
        const viewtree: {[k:string]:{[k:string]:string[]}} = {};
        
        for (let ai = 0; ai < resp.length; ai++)
        {
            const issue = resp[ai]
            
            const group = viewtree[issue.check_name]??{};
            const subgroup = group[issue.record_description]??[];
            subgroup.push(issue.record_id)
            group[issue.record_description] = subgroup
            viewtree[issue.check_name] = group
        }
        console.log(viewtree)
        const issnames = Object.keys(viewtree)
        console.log(issnames)
        for (let i = 0; i < issnames.length; i++)
        {
            const section = new OpenCloseSection()
            section.refresh(issnames[i], 'X')
            this.container.appendChild(section)
            const group = viewtree[issnames[i]]
            const k2 = Object.keys(group)
            for (let i2 = 0; i2 < k2.length; i2++)
            {
                const list = group[k2[i2]]
                if (list.length === 1)
                {
                    const sectionRow = new SectionRow();
                    section.addElementToContentArea(sectionRow)
                    sectionRow.refresh(list[0])
                }
                else
                {
                    const section2 = new OpenCloseSection()
                    section2.refresh(k2[i2], 'X')
                    section.addElementToContentArea(section2)
                    for (let i3 = 0; i3 < list.length; i3++)
                    {
                        const sectionRow = new SectionRow();
                        section2.addElementToContentArea(sectionRow)
                        sectionRow.refresh(list[i3])
                    }
                }
            }
        }
            
        */
        /*
        const resp = await API.attrnamepath_issues_records_arr({})
        // console.log(resp)
        for (let ai = 0; ai < resp.length; ai++)
        {
            const issue = resp[ai]
            // console.log(issue)
            const section = new OpenCloseSection()
            section.refresh(issue.attrnamepath + ' is ' + issue.issue, '' + issue.records.length + '/' + issue.tot_records + ' records')
            this.container.appendChild(section)
            for (let r = 0; r < issue.records.length; r++)
            {
                const record = issue.records[r]
                // console.log(record)
                
                const sectionRow = new SectionRow();
                section.addElementToContentArea(sectionRow)
                sectionRow.refresh(record)
                
                if (r == 10)
                {
                    const more = new SectionRow();
                    section.addElementToContentArea(sectionRow)
                    sectionRow.refresh('...')
                    break;
                }
            }
        }
        
        
        const resp2 = await API.test_dataset_record_with_counts({});
        resp2.forEach((r) => {
            const section = new OpenCloseSection()
            section.refresh(r.record_id + '/' + r.record_description +  ' fail ' + r.failing_attrs_count + ' attrs', '')
            this.container.appendChild(section)
            
        })
         */
    }
}
customElements.define('cs-dataset-issues-detail', DatasetIssuesDetail);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YXNldElzc3Vlc0RldGFpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3R5cGVzY3JpcHQvRGF0YXNldElzc3Vlc0RldGFpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxPQUFPLEVBQUUsT0FBTyxFQUFZLE1BQU0sY0FBYyxDQUFDO0FBQ2pELE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDbkMsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDekQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRTdDLE1BQU0sT0FBTyxtQkFBb0IsU0FBUSxXQUFXO0lBR25ELFNBQVMsQ0FBQTtJQUVULHFCQUFxQixHQUFnQixJQUFJLENBQUE7SUFFekMsaUJBQWlCLEdBQWdCLElBQUksQ0FBQTtJQUVyQyxtQkFBbUIsR0FBZ0IsSUFBSSxDQUFBO0lBRXZDLFdBQVcsR0FBeUIsUUFBUSxDQUFBO0lBRTVDO1FBQ0MsS0FBSyxFQUFFLENBQUE7UUFDUCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUE7UUFDakQsS0FBSyxDQUFDLFNBQVMsR0FBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7S0F1QmYsQ0FBQTtRQUVILGNBQWMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7UUFFN0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsY0FBYyxFQUFFLEtBQUssQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQTtRQUUzRSxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFBO1FBQ3pFLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRSxLQUFLLENB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Rjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztXQXFDRztJQUNKLENBQUM7Q0FDRDtBQUVELGNBQWMsQ0FBQyxNQUFNLENBQUMsMEJBQTBCLEVBQUUsbUJBQW1CLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAoQykgMjAyNCBDYXRjaCBTb2x2ZSBkaSBEYXZpZGUgTW9udGVzaW5cbiAqIExpY2Vuc2U6IEFHUExcbiAqL1xuXG5pbXBvcnQgeyBjc19jYXN0LCB0aHJvd05QRSB9IGZyb20gXCIuL3F1YWxpdHkuanNcIjtcbmltcG9ydCB7QVBJM30gZnJvbSAnLi9hcGkvYXBpMy5qcyc7XG5pbXBvcnQgeyBPcGVuQ2xvc2VTZWN0aW9uIH0gZnJvbSBcIi4vT3BlbkNsb3NlU2VjdGlvbi5qc1wiO1xuaW1wb3J0IHsgU2VjdGlvblJvdyB9IGZyb20gXCIuL1NlY3Rpb25Sb3cuanNcIjtcblxuZXhwb3J0IGNsYXNzIERhdGFzZXRJc3N1ZXNEZXRhaWwgZXh0ZW5kcyBIVE1MRWxlbWVudFxue1xuXHRcblx0Y29udGFpbmVyIFxuXHRcblx0bGFzdF9zZXNzaW9uX3N0YXJ0X3RzOiBzdHJpbmd8bnVsbCA9IG51bGxcblx0XG5cdGxhc3RfZGF0YXNldF9uYW1lOiBzdHJpbmd8bnVsbCA9IG51bGxcblx0XG5cdGxhc3RfY2hlY2tfY2F0ZWdvcnk6IHN0cmluZ3xudWxsID0gbnVsbFxuXHRcblx0Y3VycmVudF90YWI6ICdpc3N1ZXMnIHwgJ3JlY29yZHMnID0gJ2lzc3Vlcydcblx0XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKClcblx0XHRjb25zdCBzcm9vdCA9IHRoaXMuYXR0YWNoU2hhZG93KHsgbW9kZTogJ29wZW4nIH0pXG5cdFx0c3Jvb3QuaW5uZXJIVE1MID0gYFxuXHRcdFx0XHQ8c3R5bGU+XG5cdFx0XHRcdFx0Omhvc3Qge1xuXHRcdFx0XHRcdFx0cGFkZGluZzogMC41cmVtO1xuXHRcdFx0XHRcdFx0ZGlzcGxheTogYmxvY2s7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC5jb250YWluZXIge1xuXHRcdFx0XHRcdFx0Ym9yZGVyOiAxcHggc29saWQgI2NjYztcblx0XHRcdFx0XHRcdGJvcmRlci1yYWRpdXM6IDAuM3JlbTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0LmNvbnRhaW5lciA+ICoge1xuXHRcdFx0XHRcdFx0Ym9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNjY2M7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQ8L3N0eWxlPlxuXHRcdFx0XHQ8aW1nIHNyYz1cImtwaS1kZXRhaWwucG5nXCIgc3R5bGU9XCJtYXgtd2lkdGg6IDEwMCVcIj5cblx0XHRcdFx0PGRpdiBzdHlsZT1cIndpZHRoOiBjYWxjKDEwMCUgLSAyMTBweClcIj5cblx0XHRcdFx0XHQ8ZGl2IHN0eWxlPVwidGV4dC1hbGlnbjogcmlnaHRcIj5cblx0XHRcdFx0XHRcdDxidXR0b24gY2xhc3M9XCJpc3N1ZXNcIj5Jc3N1ZXM8L2J1dHRvbj5cblx0XHRcdFx0XHRcdDxidXR0b24gY2xhc3M9XCJyZWNvcmRzXCI+UmVjb3JkczwvYnV0dG9uPlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj48L2Rpdj5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdGBcblxuXHRcdGN1c3RvbUVsZW1lbnRzLnVwZ3JhZGUoc3Jvb3QpXG5cblx0XHR0aGlzLmNvbnRhaW5lciA9IGNzX2Nhc3QoSFRNTERpdkVsZW1lbnQsIHNyb290LnF1ZXJ5U2VsZWN0b3IoJy5jb250YWluZXInKSlcblx0XHRcblx0XHRjb25zdCBpc3N1ZXMgPSBjc19jYXN0KEhUTUxCdXR0b25FbGVtZW50LCBzcm9vdC5xdWVyeVNlbGVjdG9yKCcuaXNzdWVzJykpXG5cdFx0Y29uc3QgcmVjb3JkcyA9IGNzX2Nhc3QoSFRNTEJ1dHRvbkVsZW1lbnQsIHNyb290LnF1ZXJ5U2VsZWN0b3IoJy5yZWNvcmRzJykpXG5cdFx0XG5cdFx0aXNzdWVzLm9uY2xpY2sgPSAoKSA9PiB7XG5cdFx0XHR0aGlzLmN1cnJlbnRfdGFiID0gJ2lzc3Vlcydcblx0XHRcdGlmICh0aGlzLmxhc3Rfc2Vzc2lvbl9zdGFydF90cyAhPSBudWxsICYmIHRoaXMubGFzdF9kYXRhc2V0X25hbWUgIT0gbnVsbCAmJiB0aGlzLmxhc3RfY2hlY2tfY2F0ZWdvcnkgIT0gbnVsbClcblx0XHRcdFx0dGhpcy5yZWZyZXNoKHRoaXMubGFzdF9zZXNzaW9uX3N0YXJ0X3RzLCB0aGlzLmxhc3RfZGF0YXNldF9uYW1lLCB0aGlzLmxhc3RfY2hlY2tfY2F0ZWdvcnkpXG5cdFx0fVxuXHRcdFxuXHRcdHJlY29yZHMub25jbGljayA9ICgpID0+IHtcblx0XHRcdHRoaXMuY3VycmVudF90YWIgPSAncmVjb3Jkcydcblx0XHRcdGlmICh0aGlzLmxhc3Rfc2Vzc2lvbl9zdGFydF90cyAhPSBudWxsICYmIHRoaXMubGFzdF9kYXRhc2V0X25hbWUgIT0gbnVsbCAmJiB0aGlzLmxhc3RfY2hlY2tfY2F0ZWdvcnkgIT0gbnVsbClcblx0XHRcdFx0dGhpcy5yZWZyZXNoKHRoaXMubGFzdF9zZXNzaW9uX3N0YXJ0X3RzLCB0aGlzLmxhc3RfZGF0YXNldF9uYW1lLCB0aGlzLmxhc3RfY2hlY2tfY2F0ZWdvcnkpXG5cdFx0fVxuXHRcdFxuXHR9XG5cdFxuXHRhc3luYyByZWZyZXNoKHBfc2Vzc2lvbl9zdGFydF90czogc3RyaW5nLCBwX2RhdGFzZXRfbmFtZTogc3RyaW5nLCBwX2NhdGVnb3J5X25hbWU6IHN0cmluZykge1xuXHRcdFxuXHRcdHRoaXMubGFzdF9zZXNzaW9uX3N0YXJ0X3RzID0gcF9zZXNzaW9uX3N0YXJ0X3RzXG5cdFx0dGhpcy5sYXN0X2RhdGFzZXRfbmFtZSA9IHBfZGF0YXNldF9uYW1lXG5cdFx0dGhpcy5sYXN0X2NoZWNrX2NhdGVnb3J5ID0gcF9jYXRlZ29yeV9uYW1lXG5cdFx0XG5cdFx0Y29uc29sZS5sb2cocF9zZXNzaW9uX3N0YXJ0X3RzKVxuXHRcdGNvbnNvbGUubG9nKHBfZGF0YXNldF9uYW1lKVxuXHRcdGNvbnNvbGUubG9nKHBfY2F0ZWdvcnlfbmFtZSlcblx0XHRcblx0XHR0aGlzLmNvbnRhaW5lci50ZXh0Q29udGVudCA9ICcnXG5cblx0XHRpZiAodGhpcy5jdXJyZW50X3RhYiA9PT0gJ2lzc3VlcycpXG5cdFx0e1xuXHRcdFxuXHRcdFx0Y29uc3QganNvbiA9IGF3YWl0IEFQSTMubGlzdF9fY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9jaGVja19jYXRlZ29yeV9jaGVja19uYW1lX3JlY29yZF9yZWNvcmRfZmFpbGVkX3Z3KHtcblx0XHRcdFx0c2Vzc2lvbl9zdGFydF90czogcF9zZXNzaW9uX3N0YXJ0X3RzLFxuXHRcdFx0XHRkYXRhc2V0X25hbWU6IHBfZGF0YXNldF9uYW1lLFxuXHRcdFx0XHRjaGVja19jYXRlZ29yeTogcF9jYXRlZ29yeV9uYW1lXG5cdFx0XHR9KVxuXHRcdFx0XG5cdFx0XHRjb25zb2xlLmxvZyhqc29uKVxuXHRcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwganNvbi5sZW5ndGg7IGkrKylcblx0XHRcdHtcblx0XHRcdFx0Y29uc3QgaXNzdWUgPSBqc29uW2ldXG5cdFx0XHRcdC8vIGNvbnNvbGUubG9nKGlzc3VlKVxuXHRcdFx0XHRjb25zdCBzZWN0aW9uID0gbmV3IE9wZW5DbG9zZVNlY3Rpb24oKVxuXHRcdFx0XHRzZWN0aW9uLnJlZnJlc2goaXNzdWUuY2hlY2tfbmFtZSwgJycgKyBpc3N1ZS5ucl9yZWNvcmRzICsgJyByZWNvcmRzJylcblx0XHRcdFx0dGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoc2VjdGlvbilcblx0XHRcdFx0XG5cdFx0XHRcdHNlY3Rpb24ub25vcGVuID0gYXN5bmMgKCkgPT4ge1xuXHRcdFx0XHRcdC8vY29uc29sZS5sb2coJ3NlemlvbmUgYXBlcnRhLCByaWNhcmljbyEnKVxuXHRcdFx0XHRcdGNvbnN0IGpzb24yID0gYXdhaXQgQVBJMy5saXN0X19jYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X3JlY29yZF9jaGVja19mYWlsZWQoe1xuXHRcdFx0XHRcdFx0XHRcdHNlc3Npb25fc3RhcnRfdHM6IHBfc2Vzc2lvbl9zdGFydF90cyxcblx0XHRcdFx0XHRcdFx0XHRkYXRhc2V0X25hbWU6IHBfZGF0YXNldF9uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdGNoZWNrX2NhdGVnb3J5OiBwX2NhdGVnb3J5X25hbWUsXG5cdFx0XHRcdFx0XHRcdFx0Y2hlY2tfbmFtZTogaXNzdWUuY2hlY2tfbmFtZVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdGNvbnN0IGdyb3VwQnkgPSB7fVxuXHRcdFx0XHRcdGZvciAobGV0IGsgPSAwOyBrIDwganNvbjIubGVuZ3RoOyBrKyspXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Y29uc3Qgc25hbWUgPSBKU09OLnBhcnNlKGpzb24yW2tdLnJlY29yZF9qc29uKVsnc25hbWUnXTtcblx0XHRcdFx0XHRcdGxldCBwcmV2X2FyciA9IGdyb3VwQnlbc25hbWVdXG5cdFx0XHRcdFx0XHRwcmV2X2FyciA9IHByZXZfYXJyID09PSB1bmRlZmluZWQgPyBbXSA6IHByZXZfYXJyXG5cdFx0XHRcdFx0XHRwcmV2X2Fyci5wdXNoKGpzb24yW2tdKVxuXHRcdFx0XHRcdFx0Z3JvdXBCeVtzbmFtZV0gPSBwcmV2X2FyclxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoZ3JvdXBCeSlcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhrZXlzKVxuXHRcdFx0XHRcdGZvciAobGV0IGsgPSAwOyBrIDwga2V5cy5sZW5ndGg7IGsrKylcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRjb25zdCBzZWN0aW9uUm93ID0gbmV3IE9wZW5DbG9zZVNlY3Rpb24oKTtcblx0XHRcdFx0XHRcdHNlY3Rpb24uYWRkRWxlbWVudFRvQ29udGVudEFyZWEoc2VjdGlvblJvdylcblx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cucmVmcmVzaChrZXlzW2tdLCAnJyArIGdyb3VwQnlba2V5c1trXV0ubGVuZ3RoICsgJyByZWNvcmRzJylcblx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cub25jbGljayA9ICgpID0+IHtcblx0XHRcdFx0XHRcdFx0Y29uc3QgbGlzdCA9IGdyb3VwQnlba2V5c1trXV1cblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2cobGlzdClcblx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgazIgPSAwOyBrMiA8IGxpc3QubGVuZ3RoOyBrMisrKVxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0Y29uc3Qgc2VjdGlvblJvdzIgPSBuZXcgU2VjdGlvblJvdygpO1xuXHRcdFx0XHRcdFx0XHRcdHNlY3Rpb25Sb3cuYWRkRWxlbWVudFRvQ29udGVudEFyZWEoc2VjdGlvblJvdzIpXG5cdFx0XHRcdFx0XHRcdFx0c2VjdGlvblJvdzIucmVmcmVzaChsaXN0W2syXS5yZWNvcmRfanNvbnBhdGggKyAnICcgKyBKU09OLnBhcnNlKGxpc3RbazJdLnJlY29yZF9qc29uKVsnbXZhbHVlJ10pXG5cdFx0XHRcdFx0XHRcdFx0c2VjdGlvblJvdzIub25jbGljayA9ICgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdGFsZXJ0KGxpc3RbazJdLnJlY29yZF9qc29uKVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvKlxuXHRcdFx0XHRcdGZvciAobGV0IGsgPSAwOyBrIDwganNvbjIubGVuZ3RoOyBrKyspXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Y29uc3Qgc2VjdGlvblJvdyA9IG5ldyBTZWN0aW9uUm93KCk7XG5cdFx0XHRcdFx0XHRzZWN0aW9uLmFkZEVsZW1lbnRUb0NvbnRlbnRBcmVhKHNlY3Rpb25Sb3cpXG5cdFx0XHRcdFx0XHRzZWN0aW9uUm93LnJlZnJlc2goanNvbjJba10ucmVjb3JkX2pzb25wYXRoKVxuXHRcdFx0XHRcdFx0c2VjdGlvblJvdy5vbmNsaWNrID0gKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRhbGVydChqc29uMltrXS5yZWNvcmRfanNvbilcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ki9cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0XHRcdFxuXHRcdH1cblx0XHRcblx0XHRcblx0XHRpZiAodGhpcy5jdXJyZW50X3RhYiA9PT0gJ3JlY29yZHMnKVxuXHRcdHtcblx0XHRcdGNvbnN0IGpzb24gPSBhd2FpdCBBUEkzLmxpc3RfX2NhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfY2hlY2tfY2F0ZWdvcnlfcmVjb3JkX2pzb25wYXRoX2ZhaWxlZF92dyh7XG5cdFx0XHRcdHNlc3Npb25fc3RhcnRfdHM6IHBfc2Vzc2lvbl9zdGFydF90cyxcblx0XHRcdFx0ZGF0YXNldF9uYW1lOiBwX2RhdGFzZXRfbmFtZSxcblx0XHRcdFx0Y2hlY2tfY2F0ZWdvcnk6IHBfY2F0ZWdvcnlfbmFtZVxuXHRcdFx0fSk7XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGpzb24ubGVuZ3RoOyBpKyspXG5cdFx0XHR7XG5cdFx0XHRcdGNvbnN0IGlzc3VlID0ganNvbltpXVxuXHRcdFx0XHQvLyBjb25zb2xlLmxvZyhpc3N1ZSlcblx0XHRcdFx0Y29uc3Qgc2VjdGlvbiA9IG5ldyBPcGVuQ2xvc2VTZWN0aW9uKClcblx0XHRcdFx0c2VjdGlvbi5yZWZyZXNoKGlzc3VlLnJlY29yZF9qc29ucGF0aCwgJycgKyBpc3N1ZS5ucl9jaGVja19uYW1lcyArICcgY2hlY2tzJylcblx0XHRcdFx0dGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoc2VjdGlvbilcblx0XHRcdFx0XG5cdFx0XHRcdHNlY3Rpb24ub25vcGVuID0gYXN5bmMgKCkgPT4ge1xuXHRcdFx0XHQvL2NvbnNvbGUubG9nKCdzZXppb25lIGFwZXJ0YSwgcmljYXJpY28hJylcblx0XHRcdFx0XHRjb25zdCBqc29uMiA9IGF3YWl0IEFQSTMubGlzdF9fY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9yZWNvcmRfY2hlY2tfZmFpbGVkKHtcblx0XHRcdFx0XHRcdFx0c2Vzc2lvbl9zdGFydF90czogcF9zZXNzaW9uX3N0YXJ0X3RzLFxuXHRcdFx0XHRcdFx0XHRkYXRhc2V0X25hbWU6IHBfZGF0YXNldF9uYW1lLFxuXHRcdFx0XHRcdFx0XHRjaGVja19jYXRlZ29yeTogcF9jYXRlZ29yeV9uYW1lLFxuXHRcdFx0XHRcdFx0XHRyZWNvcmRfanNvbnBhdGg6IGlzc3VlLnJlY29yZF9qc29ucGF0aFxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdGZvciAobGV0IGsgPSAwOyBrIDwganNvbjIubGVuZ3RoOyBrKyspXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Y29uc3Qgc2VjdGlvblJvdyA9IG5ldyBPcGVuQ2xvc2VTZWN0aW9uKCk7XG5cdFx0XHRcdFx0XHRzZWN0aW9uLmFkZEVsZW1lbnRUb0NvbnRlbnRBcmVhKHNlY3Rpb25Sb3cpXG5cdFx0XHRcdFx0XHRzZWN0aW9uUm93LnJlZnJlc2goanNvbjJba10uY2hlY2tfbmFtZSwgJycpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdC8qXG5cdFx0aWYgKHRoaXMuY3VycmVudF90YWIgPT09ICdpc3N1ZXMnKVxuXHRcdHtcblx0XHRcdGNvbnN0IGpzb24gPSBhd2FpdCBBUEkzLmxpc3RfX2NhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfY2hlY2tfbmFtZV9jb3VudF9yZWNvcmRzX3Z3KHtcblx0XHRcdFx0XHRcdHNlc3Npb25fc3RhcnRfdHM6IHBfc2Vzc2lvbl9zdGFydF90cyxcblx0XHRcdFx0XHRcdGRhdGFzZXRfbmFtZTogcF9kYXRhc2V0X25hbWVcblx0XHRcdFx0XHR9KTtcblx0XHRcdC8vY29uc29sZS5sb2coanNvbilcblx0XHRcdFxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBqc29uLmxlbmd0aDsgaSsrKVxuXHRcdFx0e1xuXHRcdFx0XHRjb25zdCBpc3N1ZSA9IGpzb25baV1cblx0XHRcdFx0Ly8gY29uc29sZS5sb2coaXNzdWUpXG5cdFx0XHRcdGNvbnN0IHNlY3Rpb24gPSBuZXcgT3BlbkNsb3NlU2VjdGlvbigpXG5cdFx0XHRcdHNlY3Rpb24ucmVmcmVzaChpc3N1ZS5jaGVja19uYW1lLCAnJyArIGlzc3VlLm5yX3JlY29yZHMgKyAnIHJlY29yZHMnKVxuXHRcdFx0XHR0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChzZWN0aW9uKVxuXHRcdFx0XHRzZWN0aW9uLm9ub3BlbiA9IGFzeW5jICgpID0+IHtcblx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKCdzZXppb25lIGFwZXJ0YSwgcmljYXJpY28hJylcblx0XHRcdFx0XHRjb25zdCBqc29uMiA9IGF3YWl0IEFQSTMubGlzdF9fY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9jaGVja19uYW1lX2ZpZWxkc19yZWNvcmRfaWRfc25pcHBldF92dyh7XG5cdFx0XHRcdFx0XHRcdFx0c2Vzc2lvbl9zdGFydF90czogcF9zZXNzaW9uX3N0YXJ0X3RzLFxuXHRcdFx0XHRcdFx0XHRcdGRhdGFzZXRfbmFtZTogcF9kYXRhc2V0X25hbWUsXG5cdFx0XHRcdFx0XHRcdFx0Y2hlY2tfbmFtZTogaXNzdWUuY2hlY2tfbmFtZVxuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKGpzb24yKVxuXHRcdFx0XHRcdGZvciAobGV0IGsgPSAwOyBrIDwganNvbjIubGVuZ3RoOyBrKyspXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Y29uc3Qgc2VjdGlvblJvdyA9IG5ldyBTZWN0aW9uUm93KCk7XG5cdFx0XHRcdFx0XHRzZWN0aW9uLmFkZEVsZW1lbnRUb0NvbnRlbnRBcmVhKHNlY3Rpb25Sb3cpXG5cdFx0XHRcdFx0XHRzZWN0aW9uUm93LnJlZnJlc2goanNvbjJba10ucmVjb3JkX25hbWVzICsgJyBbJyArIGpzb24yW2tdLnJlY29yZF9pZCArICddJyArICcgKCcgKyBqc29uMltrXS5maWVsZHMgKyAnKScpXG5cdFx0XHRcdFx0XHRzZWN0aW9uUm93Lm9uY2xpY2sgPSAoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdGFsZXJ0KGpzb24yW2tdLnJlY29yZF9mYWlsZWRfanNvbl9zbmlwcGV0KVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRcblx0XHRpZiAodGhpcy5jdXJyZW50X3RhYiA9PT0gJ3JlY29yZHMnKVxuXHRcdHtcblx0XHRcdGNvbnN0IGpzb24zID0gYXdhaXQgQVBJMy5saXN0X19jYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X3JlY29yZF9jb3VudF9hdHRyaWJ1dGVzX3Z3KHtcblx0XHRcdFx0c2Vzc2lvbl9zdGFydF90czogcF9zZXNzaW9uX3N0YXJ0X3RzLFxuXHRcdFx0XHRkYXRhc2V0X25hbWU6IHBfZGF0YXNldF9uYW1lXG5cdFx0XHR9KTtcblx0XHRcdC8vY29uc29sZS5sb2coanNvbjMpXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGpzb24zLmxlbmd0aDsgaSsrKVxuXHRcdFx0e1xuXHRcdFx0XHRjb25zdCBpc3N1ZSA9IGpzb24zW2ldXG5cdFx0XHRcdC8vY29uc29sZS5sb2coaXNzdWUpXG5cdFx0XHRcdGNvbnN0IHNlY3Rpb24gPSBuZXcgT3BlbkNsb3NlU2VjdGlvbigpXG5cdFx0XHRcdHNlY3Rpb24ucmVmcmVzaChpc3N1ZS5yZWNvcmRfbmFtZXMsICcnICsgaXNzdWUuY291bnRfYXR0cmlidXRlcylcblx0XHRcdFx0dGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoc2VjdGlvbilcblx0XHRcdFx0c2VjdGlvbi5vbm9wZW4gPSBhc3luYyAoKSA9PiB7XG5cdFx0XHRcdFx0Ly9jb25zb2xlLmxvZygnc2V6aW9uZSBhcGVydGEsIHJpY2FyaWNvIScpXG5cdFx0XHRcdFx0Y29uc3QganNvbjIgPSBhd2FpdCBBUEkzLmxpc3RfX2NhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfYXR0cmlidXRlX25hbWVfY2hlY2tzX3JlY29yZF9pZF9zbmlwcGV0X3Z3KHtcblx0XHRcdFx0XHRcdFx0XHRzZXNzaW9uX3N0YXJ0X3RzOiBwX3Nlc3Npb25fc3RhcnRfdHMsXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YXNldF9uYW1lOiBwX2RhdGFzZXRfbmFtZSxcblx0XHRcdFx0XHRcdFx0XHRyZWNvcmRfaWQ6IGlzc3VlLnJlY29yZF9pZFxuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKGpzb24yKVxuXHRcdFx0XHRcdGZvciAobGV0IGsgPSAwOyBrIDwganNvbjIubGVuZ3RoOyBrKyspXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Y29uc3Qgc2VjdGlvblJvdyA9IG5ldyBTZWN0aW9uUm93KCk7XG5cdFx0XHRcdFx0XHRzZWN0aW9uLmFkZEVsZW1lbnRUb0NvbnRlbnRBcmVhKHNlY3Rpb25Sb3cpXG5cdFx0XHRcdFx0XHRzZWN0aW9uUm93LnJlZnJlc2goanNvbjJba10uYXR0cmlidXRlX25hbWUgKyAnICgnICsganNvbjJba10uY2hlY2tzICsgJyknKVxuXHRcdFx0XHRcdFx0c2VjdGlvblJvdy5vbmNsaWNrID0gKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRhbGVydChqc29uMltrXS5yZWNvcmRfZmFpbGVkX2pzb25fc25pcHBldClcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0ICovXG5cblx0XHQvKlxuXHRcdGNvbnN0IHJlc3AgPSBhd2FpdCBBUEkuaXNzdWVzX3RyZWUoe30pXG5cdFx0Y29uc29sZS5sb2cocmVzcClcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHJlc3AuaXNzdWVzLmxlbmd0aDsgaSsrKVxuXHRcdHtcblx0XHRcdGNvbnN0IGlzc3VlID0gcmVzcC5pc3N1ZXNbaV1cblx0XHRcdGNvbnNvbGUubG9nKGlzc3VlKVxuXHRcdFx0Y29uc3Qgc2VjdGlvbiA9IG5ldyBPcGVuQ2xvc2VTZWN0aW9uKClcblx0XHRcdHNlY3Rpb24uc2V0TGFiZWwoaXNzdWUuaXNzdWUpXG5cdFx0XHR0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChzZWN0aW9uKVxuXHRcdFx0Zm9yIChsZXQgciA9IDA7IHIgPCBpc3N1ZS5yZWNvcmRzLmxlbmd0aDsgcisrKVxuXHRcdFx0e1xuXHRcdFx0XHRjb25zdCByZWNvcmQgPSBpc3N1ZS5yZWNvcmRzW3JdXG5cdFx0XHRcdGNvbnNvbGUubG9nKHJlY29yZClcblx0XHRcdFx0XG5cdFx0XHRcdGNvbnN0IHNlY3Rpb25Sb3cgPSBuZXcgU2VjdGlvblJvdygpO1xuXHRcdFx0XHRzZWN0aW9uLmFkZEVsZW1lbnRUb0NvbnRlbnRBcmVhKHNlY3Rpb25Sb3cpXG5cdFx0XHRcdHNlY3Rpb25Sb3cucmVmcmVzaChyZWNvcmQucmVjb3JkX2lkKVxuXHRcdFx0XHRcblx0XHRcdFx0Zm9yIChsZXQgZiA9IDA7IGYgPCByZWNvcmQuZmllbGRzLmxlbmd0aDsgZisrKVxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKHJlY29yZC5maWVsZHNbZl0pXG5cdFx0XHR9XG5cdFx0fVxuXHRcdCovXG5cdFx0XG5cdFx0Ly8gY29uc3QgcmVzcCA9IGF3YWl0IEFQSS50ZXN0X2RhdGFzZXRfY2hlY2tfdncoe30pXG5cdFx0Ly8gY29uc29sZS5sb2cocmVzcClcblx0XHRcblx0XHQvKlxuXHRcdFxuXHRcdGNvbnN0IHJlc3AgPSBhd2FpdCBBUEkucmVhZEZhaWxzKHt9KVxuXHRcdGNvbnNvbGUubG9nKHJlc3ApXG5cdFxuXHRcdGNvbnN0IHZpZXd0cmVlOiB7W2s6c3RyaW5nXTp7W2s6c3RyaW5nXTpzdHJpbmdbXX19ID0ge307XG5cdFx0XG5cdFx0Zm9yIChsZXQgYWkgPSAwOyBhaSA8IHJlc3AubGVuZ3RoOyBhaSsrKVxuXHRcdHtcblx0XHRcdGNvbnN0IGlzc3VlID0gcmVzcFthaV1cblx0XHRcdFxuXHRcdFx0Y29uc3QgZ3JvdXAgPSB2aWV3dHJlZVtpc3N1ZS5jaGVja19uYW1lXT8/e307XG5cdFx0XHRjb25zdCBzdWJncm91cCA9IGdyb3VwW2lzc3VlLnJlY29yZF9kZXNjcmlwdGlvbl0/P1tdO1xuXHRcdFx0c3ViZ3JvdXAucHVzaChpc3N1ZS5yZWNvcmRfaWQpXG5cdFx0XHRncm91cFtpc3N1ZS5yZWNvcmRfZGVzY3JpcHRpb25dID0gc3ViZ3JvdXBcblx0XHRcdHZpZXd0cmVlW2lzc3VlLmNoZWNrX25hbWVdID0gZ3JvdXBcblx0XHR9XG5cdFx0Y29uc29sZS5sb2codmlld3RyZWUpXG5cdFx0Y29uc3QgaXNzbmFtZXMgPSBPYmplY3Qua2V5cyh2aWV3dHJlZSlcblx0XHRjb25zb2xlLmxvZyhpc3NuYW1lcylcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGlzc25hbWVzLmxlbmd0aDsgaSsrKVxuXHRcdHtcblx0XHRcdGNvbnN0IHNlY3Rpb24gPSBuZXcgT3BlbkNsb3NlU2VjdGlvbigpXG5cdFx0XHRzZWN0aW9uLnJlZnJlc2goaXNzbmFtZXNbaV0sICdYJylcblx0XHRcdHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHNlY3Rpb24pXG5cdFx0XHRjb25zdCBncm91cCA9IHZpZXd0cmVlW2lzc25hbWVzW2ldXVxuXHRcdFx0Y29uc3QgazIgPSBPYmplY3Qua2V5cyhncm91cClcblx0XHRcdGZvciAobGV0IGkyID0gMDsgaTIgPCBrMi5sZW5ndGg7IGkyKyspXG5cdFx0XHR7XG5cdFx0XHRcdGNvbnN0IGxpc3QgPSBncm91cFtrMltpMl1dXG5cdFx0XHRcdGlmIChsaXN0Lmxlbmd0aCA9PT0gMSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGNvbnN0IHNlY3Rpb25Sb3cgPSBuZXcgU2VjdGlvblJvdygpO1xuXHRcdFx0XHRcdHNlY3Rpb24uYWRkRWxlbWVudFRvQ29udGVudEFyZWEoc2VjdGlvblJvdylcblx0XHRcdFx0XHRzZWN0aW9uUm93LnJlZnJlc2gobGlzdFswXSlcdFx0XHRcdFx0XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Y29uc3Qgc2VjdGlvbjIgPSBuZXcgT3BlbkNsb3NlU2VjdGlvbigpXG5cdFx0XHRcdFx0c2VjdGlvbjIucmVmcmVzaChrMltpMl0sICdYJylcblx0XHRcdFx0XHRzZWN0aW9uLmFkZEVsZW1lbnRUb0NvbnRlbnRBcmVhKHNlY3Rpb24yKVxuXHRcdFx0XHRcdGZvciAobGV0IGkzID0gMDsgaTMgPCBsaXN0Lmxlbmd0aDsgaTMrKylcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRjb25zdCBzZWN0aW9uUm93ID0gbmV3IFNlY3Rpb25Sb3coKTtcblx0XHRcdFx0XHRcdHNlY3Rpb24yLmFkZEVsZW1lbnRUb0NvbnRlbnRBcmVhKHNlY3Rpb25Sb3cpXG5cdFx0XHRcdFx0XHRzZWN0aW9uUm93LnJlZnJlc2gobGlzdFtpM10pXHRcdFx0XHRcdFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRcdFxuXHRcdCovXHRcblx0XHQvKlxuXHRcdGNvbnN0IHJlc3AgPSBhd2FpdCBBUEkuYXR0cm5hbWVwYXRoX2lzc3Vlc19yZWNvcmRzX2Fycih7fSlcblx0XHQvLyBjb25zb2xlLmxvZyhyZXNwKVxuXHRcdGZvciAobGV0IGFpID0gMDsgYWkgPCByZXNwLmxlbmd0aDsgYWkrKylcblx0XHR7XG5cdFx0XHRjb25zdCBpc3N1ZSA9IHJlc3BbYWldXG5cdFx0XHQvLyBjb25zb2xlLmxvZyhpc3N1ZSlcblx0XHRcdGNvbnN0IHNlY3Rpb24gPSBuZXcgT3BlbkNsb3NlU2VjdGlvbigpXG5cdFx0XHRzZWN0aW9uLnJlZnJlc2goaXNzdWUuYXR0cm5hbWVwYXRoICsgJyBpcyAnICsgaXNzdWUuaXNzdWUsICcnICsgaXNzdWUucmVjb3Jkcy5sZW5ndGggKyAnLycgKyBpc3N1ZS50b3RfcmVjb3JkcyArICcgcmVjb3JkcycpXG5cdFx0XHR0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChzZWN0aW9uKVxuXHRcdFx0Zm9yIChsZXQgciA9IDA7IHIgPCBpc3N1ZS5yZWNvcmRzLmxlbmd0aDsgcisrKVxuXHRcdFx0e1xuXHRcdFx0XHRjb25zdCByZWNvcmQgPSBpc3N1ZS5yZWNvcmRzW3JdXG5cdFx0XHRcdC8vIGNvbnNvbGUubG9nKHJlY29yZClcblx0XHRcdFx0XG5cdFx0XHRcdGNvbnN0IHNlY3Rpb25Sb3cgPSBuZXcgU2VjdGlvblJvdygpO1xuXHRcdFx0XHRzZWN0aW9uLmFkZEVsZW1lbnRUb0NvbnRlbnRBcmVhKHNlY3Rpb25Sb3cpXG5cdFx0XHRcdHNlY3Rpb25Sb3cucmVmcmVzaChyZWNvcmQpXG5cdFx0XHRcdFxuXHRcdFx0XHRpZiAociA9PSAxMClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGNvbnN0IG1vcmUgPSBuZXcgU2VjdGlvblJvdygpO1xuXHRcdFx0XHRcdHNlY3Rpb24uYWRkRWxlbWVudFRvQ29udGVudEFyZWEoc2VjdGlvblJvdylcblx0XHRcdFx0XHRzZWN0aW9uUm93LnJlZnJlc2goJy4uLicpXG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0XG5cdFx0XG5cdFx0Y29uc3QgcmVzcDIgPSBhd2FpdCBBUEkudGVzdF9kYXRhc2V0X3JlY29yZF93aXRoX2NvdW50cyh7fSk7XG5cdFx0cmVzcDIuZm9yRWFjaCgocikgPT4ge1xuXHRcdFx0Y29uc3Qgc2VjdGlvbiA9IG5ldyBPcGVuQ2xvc2VTZWN0aW9uKClcblx0XHRcdHNlY3Rpb24ucmVmcmVzaChyLnJlY29yZF9pZCArICcvJyArIHIucmVjb3JkX2Rlc2NyaXB0aW9uICsgICcgZmFpbCAnICsgci5mYWlsaW5nX2F0dHJzX2NvdW50ICsgJyBhdHRycycsICcnKVxuXHRcdFx0dGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoc2VjdGlvbilcblx0XHRcdFxuXHRcdH0pXG5cdFx0ICovXG5cdH1cbn1cblxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCdjcy1kYXRhc2V0LWlzc3Vlcy1kZXRhaWwnLCBEYXRhc2V0SXNzdWVzRGV0YWlsKVxuIl19