/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */

export class API3 {

	static async call(action: string, json: any)
	{
		const params = new URLSearchParams();
		params.append('action', action);
		params.append('filter_byexample', JSON.stringify(json));

		// https://www.catch-solve.tech/noi-odh-testing-tool/api?
		// http://localhost:8080/api?
		const resp = await fetch('https://www.catch-solve.tech/noi-odh-testing-tool/api?' + params.toString());
		const respjson = await resp.json();
		// wait for debug pourpose
		await new Promise((s) =>  { setTimeout(s, 1500)})
		return respjson;
	}

	// begin crudl methods

	static async list__catchsolve_noiodh__test_dataset_max_ts_vw
	(filter: catchsolve_noiodh__test_dataset_max_ts_vw__byexample):
	 Promise<catchsolve_noiodh__test_dataset_max_ts_vw__row[]>
	{
		const resp = await API3.call('catchsolve_noiodh.catchsolve_noiodh__test_dataset_max_ts_vw', filter)
		return resp;
	}
	
	static async list__catchsolve_noiodh__test_dataset_check_category_failed_recors_vw
	(filter: catchsolve_noiodh__test_dataset_check_category_failed_recors_vw__byexample):
	 Promise<catchsolve_noiodh__test_dataset_check_category_failed_recors_vw__row[]>
	{
		const resp = await API3.call('catchsolve_noiodh.test_dataset_check_category_failed_recors_vw', filter)
		return resp;
	}
	
	static async list__catchsolve_noiodh__test_dataset_check_category_check_name_failed_recors_vw
	(filter: catchsolve_noiodh__test_dataset_check_category_check_name_failed_recors_vw__byexample):
	 Promise<catchsolve_noiodh__test_dataset_check_category_check_name_failed_recors_vw__row[]>
	{
		const resp = await API3.call('catchsolve_noiodh.test_dataset_check_category_check_name_failed_recors_vw', filter)
		return resp;
	}
	
	static async list__catchsolve_noiodh__test_dataset_check_category_check_name_record_record_failed_vw
	(filter: catchsolve_noiodh__test_dataset_check_category_check_name_record_record_failed_vw__byexample):
	 Promise<catchsolve_noiodh__test_dataset_check_category_check_name_record_record_failed_vw__row[]>
	{
		const resp = await API3.call('catchsolve_noiodh.test_dataset_check_category_check_name_record_record_failed_vw', filter)
		return resp;
	}
	
	static async list__catchsolve_noiodh__test_dataset_record_check_failed
	(filter: catchsolve_noiodh__test_dataset_record_check_failed__byexample):
	 Promise<catchsolve_noiodh__test_dataset_record_check_failed__row[]>
	{
		const resp = await API3.call('catchsolve_noiodh.test_dataset_record_check_failed', filter)
		return resp;
	}

	static async list__catchsolve_noiodh__test_dataset_check_category_record_jsonpath_failed_vw
	(filter: catchsolve_noiodh__test_dataset_check_category_record_jsonpath_failed_vw__byexample):
	 Promise<catchsolve_noiodh__test_dataset_check_category_record_jsonpath_failed_vw__row[]>
	{
		const resp = await API3.call('catchsolve_noiodh.test_dataset_check_category_record_jsonpath_failed_vw', filter)
		return resp;
	}

	// end crudl methods
}

// begin interfaces

export interface catchsolve_noiodh__test_dataset__row {
	dataset_name: string
	id: number
	session_start_ts: string
	tested_recors: number
}

export interface catchsolve_noiodh__test_dataset_check__row {
	check_name: string
	dataset_name: string
	id: number
	session_start_ts: string
}

export interface catchsolve_noiodh__test_dataset_check_category_check_name_failed_recors_vw__row {
	check_category: string
	check_name: string
	dataset_name: string
	failed_records: number
	session_start_ts: string
	tot_records: number
}

export interface catchsolve_noiodh__test_dataset_check_category_check_name_record_record_failed_vw__row {
	check_category: string
	check_name: string
	dataset_name: string
	nr_records: number
	session_start_ts: string
}

export interface catchsolve_noiodh__test_dataset_check_category_failed_recors_vw__row {
	check_category: string
	dataset_name: string
	failed_records: number
	session_start_ts: string
	tot_records: number
}

export interface catchsolve_noiodh__test_dataset_check_category_record_jsonpath_failed_vw__row {
	check_category: string
	dataset_name: string
	nr_check_names: number
	record_json: string
	record_jsonpath: string
	session_start_ts: string
}

export interface catchsolve_noiodh__test_dataset_max_ts_vw__row {
	dataset_name: string
	session_start_ts: string
}

export interface catchsolve_noiodh__test_dataset_record_check_failed__row {
	check_category: string
	check_name: string
	dataset_name: string
	id: number
	impacted_attributes_csv: string
	record_json: string
	record_jsonpath: string
	session_start_ts: string
}

export interface catchsolve_noiodh__test_dataset__byexample {
	dataset_name?: string
	id?: number
	session_start_ts?: string
	tested_recors?: number
}

export interface catchsolve_noiodh__test_dataset_check__byexample {
	check_name?: string
	dataset_name?: string
	id?: number
	session_start_ts?: string
}

export interface catchsolve_noiodh__test_dataset_check_category_check_name_failed_recors_vw__byexample {
	check_category?: string
	check_name?: string
	dataset_name?: string
	failed_records?: number
	session_start_ts?: string
	tot_records?: number
}

export interface catchsolve_noiodh__test_dataset_check_category_check_name_record_record_failed_vw__byexample {
	check_category?: string
	check_name?: string
	dataset_name?: string
	nr_records?: number
	session_start_ts?: string
}

export interface catchsolve_noiodh__test_dataset_check_category_failed_recors_vw__byexample {
	check_category?: string
	dataset_name?: string
	failed_records?: number
	session_start_ts?: string
	tot_records?: number
}

export interface catchsolve_noiodh__test_dataset_check_category_record_jsonpath_failed_vw__byexample {
	check_category?: string
	dataset_name?: string
	nr_check_names?: number
	record_json?: string
	record_jsonpath?: string
	session_start_ts?: string
}

export interface catchsolve_noiodh__test_dataset_max_ts_vw__byexample {
	dataset_name?: string
	session_start_ts?: string
}

export interface catchsolve_noiodh__test_dataset_record_check_failed__byexample {
	check_category?: string
	check_name?: string
	dataset_name?: string
	id?: number
	impacted_attributes_csv?: string
	record_json?: string
	record_jsonpath?: string
	session_start_ts?: string
}

// end interfaces