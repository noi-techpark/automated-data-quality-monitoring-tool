/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */
export class API3 {
    static async call(action, json) {
        const params = new URLSearchParams();
        params.append('action', action);
        params.append('filter_byexample', JSON.stringify(json));
        // https://www.catch-solve.tech/noi-odh-testing-tool/api?
        // http://localhost:8080/api?
        const resp = await fetch('https://www.catch-solve.tech/noi-odh-testing-tool/api?' + params.toString());
        const respjson = await resp.json();
        return respjson;
    }
    // begin crudl methods
    static async list__catchsolve_noiodh__test_dataset_max_ts_vw(filter) {
        const resp = await API3.call('catchsolve_noiodh.catchsolve_noiodh__test_dataset_max_ts_vw', filter);
        return resp;
    }
    static async list__catchsolve_noiodh__test_dataset_check_category_failed_recors_vw(filter) {
        const resp = await API3.call('catchsolve_noiodh.test_dataset_check_category_failed_recors_vw', filter);
        return resp;
    }
    static async list__catchsolve_noiodh__test_dataset_check_category_check_name_failed_recors_vw(filter) {
        const resp = await API3.call('catchsolve_noiodh.test_dataset_check_category_check_name_failed_recors_vw', filter);
        return resp;
    }
    static async list__catchsolve_noiodh__test_dataset_check_category_check_name_record_record_failed_vw(filter) {
        const resp = await API3.call('catchsolve_noiodh.test_dataset_check_category_check_name_record_record_failed_vw', filter);
        return resp;
    }
    static async list__catchsolve_noiodh__test_dataset_record_check_failed(filter) {
        const resp = await API3.call('catchsolve_noiodh.test_dataset_record_check_failed', filter);
        return resp;
    }
    static async list__catchsolve_noiodh__test_dataset_check_category_record_jsonpath_failed_vw(filter) {
        const resp = await API3.call('catchsolve_noiodh.test_dataset_check_category_record_jsonpath_failed_vw', filter);
        return resp;
    }
}
// end interfaces
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpMy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3R5cGVzY3JpcHQvYXBpL2FwaTMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHO0FBRUgsTUFBTSxPQUFPLElBQUk7SUFFaEIsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBYyxFQUFFLElBQVM7UUFFMUMsTUFBTSxNQUFNLEdBQUcsSUFBSSxlQUFlLEVBQUUsQ0FBQztRQUNyQyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNoQyxNQUFNLENBQUMsTUFBTSxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUV4RCx5REFBeUQ7UUFDekQsNkJBQTZCO1FBQzdCLE1BQU0sSUFBSSxHQUFHLE1BQU0sS0FBSyxDQUFDLHdEQUF3RCxHQUFHLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZHLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ25DLE9BQU8sUUFBUSxDQUFDO0lBQ2pCLENBQUM7SUFFRCxzQkFBc0I7SUFFdEIsTUFBTSxDQUFDLEtBQUssQ0FBQywrQ0FBK0MsQ0FDM0QsTUFBNEQ7UUFHNUQsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLDZEQUE2RCxFQUFFLE1BQU0sQ0FBQyxDQUFBO1FBQ25HLE9BQU8sSUFBSSxDQUFDO0lBQ2IsQ0FBQztJQUVELE1BQU0sQ0FBQyxLQUFLLENBQUMscUVBQXFFLENBQ2pGLE1BQWtGO1FBR2xGLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxnRUFBZ0UsRUFBRSxNQUFNLENBQUMsQ0FBQTtRQUN0RyxPQUFPLElBQUksQ0FBQztJQUNiLENBQUM7SUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDLGdGQUFnRixDQUM1RixNQUE2RjtRQUc3RixNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsMkVBQTJFLEVBQUUsTUFBTSxDQUFDLENBQUE7UUFDakgsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0lBRUQsTUFBTSxDQUFDLEtBQUssQ0FBQyx1RkFBdUYsQ0FDbkcsTUFBb0c7UUFHcEcsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLGtGQUFrRixFQUFFLE1BQU0sQ0FBQyxDQUFBO1FBQ3hILE9BQU8sSUFBSSxDQUFDO0lBQ2IsQ0FBQztJQUVELE1BQU0sQ0FBQyxLQUFLLENBQUMseURBQXlELENBQ3JFLE1BQXNFO1FBR3RFLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxvREFBb0QsRUFBRSxNQUFNLENBQUMsQ0FBQTtRQUMxRixPQUFPLElBQUksQ0FBQztJQUNiLENBQUM7SUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDLDhFQUE4RSxDQUMxRixNQUEyRjtRQUczRixNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMseUVBQXlFLEVBQUUsTUFBTSxDQUFDLENBQUE7UUFDL0csT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0NBR0Q7QUFrSUQsaUJBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIChDKSAyMDI0IENhdGNoIFNvbHZlIGRpIERhdmlkZSBNb250ZXNpblxuICogTGljZW5zZTogQUdQTFxuICovXG5cbmV4cG9ydCBjbGFzcyBBUEkzIHtcblxuXHRzdGF0aWMgYXN5bmMgY2FsbChhY3Rpb246IHN0cmluZywganNvbjogYW55KVxuXHR7XG5cdFx0Y29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcygpO1xuXHRcdHBhcmFtcy5hcHBlbmQoJ2FjdGlvbicsIGFjdGlvbik7XG5cdFx0cGFyYW1zLmFwcGVuZCgnZmlsdGVyX2J5ZXhhbXBsZScsIEpTT04uc3RyaW5naWZ5KGpzb24pKTtcblxuXHRcdC8vIGh0dHBzOi8vd3d3LmNhdGNoLXNvbHZlLnRlY2gvbm9pLW9kaC10ZXN0aW5nLXRvb2wvYXBpP1xuXHRcdC8vIGh0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9hcGk/XG5cdFx0Y29uc3QgcmVzcCA9IGF3YWl0IGZldGNoKCdodHRwczovL3d3dy5jYXRjaC1zb2x2ZS50ZWNoL25vaS1vZGgtdGVzdGluZy10b29sL2FwaT8nICsgcGFyYW1zLnRvU3RyaW5nKCkpO1xuXHRcdGNvbnN0IHJlc3Bqc29uID0gYXdhaXQgcmVzcC5qc29uKCk7XG5cdFx0cmV0dXJuIHJlc3Bqc29uO1xuXHR9XG5cblx0Ly8gYmVnaW4gY3J1ZGwgbWV0aG9kc1xuXG5cdHN0YXRpYyBhc3luYyBsaXN0X19jYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X21heF90c192d1xuXHQoZmlsdGVyOiBjYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X21heF90c192d19fYnlleGFtcGxlKTpcblx0IFByb21pc2U8Y2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9tYXhfdHNfdndfX3Jvd1tdPlxuXHR7XG5cdFx0Y29uc3QgcmVzcCA9IGF3YWl0IEFQSTMuY2FsbCgnY2F0Y2hzb2x2ZV9ub2lvZGguY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9tYXhfdHNfdncnLCBmaWx0ZXIpXG5cdFx0cmV0dXJuIHJlc3A7XG5cdH1cblx0XG5cdHN0YXRpYyBhc3luYyBsaXN0X19jYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X2NoZWNrX2NhdGVnb3J5X2ZhaWxlZF9yZWNvcnNfdndcblx0KGZpbHRlcjogY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9jaGVja19jYXRlZ29yeV9mYWlsZWRfcmVjb3JzX3Z3X19ieWV4YW1wbGUpOlxuXHQgUHJvbWlzZTxjYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X2NoZWNrX2NhdGVnb3J5X2ZhaWxlZF9yZWNvcnNfdndfX3Jvd1tdPlxuXHR7XG5cdFx0Y29uc3QgcmVzcCA9IGF3YWl0IEFQSTMuY2FsbCgnY2F0Y2hzb2x2ZV9ub2lvZGgudGVzdF9kYXRhc2V0X2NoZWNrX2NhdGVnb3J5X2ZhaWxlZF9yZWNvcnNfdncnLCBmaWx0ZXIpXG5cdFx0cmV0dXJuIHJlc3A7XG5cdH1cblx0XG5cdHN0YXRpYyBhc3luYyBsaXN0X19jYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X2NoZWNrX2NhdGVnb3J5X2NoZWNrX25hbWVfZmFpbGVkX3JlY29yc192d1xuXHQoZmlsdGVyOiBjYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X2NoZWNrX2NhdGVnb3J5X2NoZWNrX25hbWVfZmFpbGVkX3JlY29yc192d19fYnlleGFtcGxlKTpcblx0IFByb21pc2U8Y2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9jaGVja19jYXRlZ29yeV9jaGVja19uYW1lX2ZhaWxlZF9yZWNvcnNfdndfX3Jvd1tdPlxuXHR7XG5cdFx0Y29uc3QgcmVzcCA9IGF3YWl0IEFQSTMuY2FsbCgnY2F0Y2hzb2x2ZV9ub2lvZGgudGVzdF9kYXRhc2V0X2NoZWNrX2NhdGVnb3J5X2NoZWNrX25hbWVfZmFpbGVkX3JlY29yc192dycsIGZpbHRlcilcblx0XHRyZXR1cm4gcmVzcDtcblx0fVxuXHRcblx0c3RhdGljIGFzeW5jIGxpc3RfX2NhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfY2hlY2tfY2F0ZWdvcnlfY2hlY2tfbmFtZV9yZWNvcmRfcmVjb3JkX2ZhaWxlZF92d1xuXHQoZmlsdGVyOiBjYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X2NoZWNrX2NhdGVnb3J5X2NoZWNrX25hbWVfcmVjb3JkX3JlY29yZF9mYWlsZWRfdndfX2J5ZXhhbXBsZSk6XG5cdCBQcm9taXNlPGNhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfY2hlY2tfY2F0ZWdvcnlfY2hlY2tfbmFtZV9yZWNvcmRfcmVjb3JkX2ZhaWxlZF92d19fcm93W10+XG5cdHtcblx0XHRjb25zdCByZXNwID0gYXdhaXQgQVBJMy5jYWxsKCdjYXRjaHNvbHZlX25vaW9kaC50ZXN0X2RhdGFzZXRfY2hlY2tfY2F0ZWdvcnlfY2hlY2tfbmFtZV9yZWNvcmRfcmVjb3JkX2ZhaWxlZF92dycsIGZpbHRlcilcblx0XHRyZXR1cm4gcmVzcDtcblx0fVxuXHRcblx0c3RhdGljIGFzeW5jIGxpc3RfX2NhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfcmVjb3JkX2NoZWNrX2ZhaWxlZFxuXHQoZmlsdGVyOiBjYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X3JlY29yZF9jaGVja19mYWlsZWRfX2J5ZXhhbXBsZSk6XG5cdCBQcm9taXNlPGNhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfcmVjb3JkX2NoZWNrX2ZhaWxlZF9fcm93W10+XG5cdHtcblx0XHRjb25zdCByZXNwID0gYXdhaXQgQVBJMy5jYWxsKCdjYXRjaHNvbHZlX25vaW9kaC50ZXN0X2RhdGFzZXRfcmVjb3JkX2NoZWNrX2ZhaWxlZCcsIGZpbHRlcilcblx0XHRyZXR1cm4gcmVzcDtcblx0fVxuXG5cdHN0YXRpYyBhc3luYyBsaXN0X19jYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X2NoZWNrX2NhdGVnb3J5X3JlY29yZF9qc29ucGF0aF9mYWlsZWRfdndcblx0KGZpbHRlcjogY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9jaGVja19jYXRlZ29yeV9yZWNvcmRfanNvbnBhdGhfZmFpbGVkX3Z3X19ieWV4YW1wbGUpOlxuXHQgUHJvbWlzZTxjYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X2NoZWNrX2NhdGVnb3J5X3JlY29yZF9qc29ucGF0aF9mYWlsZWRfdndfX3Jvd1tdPlxuXHR7XG5cdFx0Y29uc3QgcmVzcCA9IGF3YWl0IEFQSTMuY2FsbCgnY2F0Y2hzb2x2ZV9ub2lvZGgudGVzdF9kYXRhc2V0X2NoZWNrX2NhdGVnb3J5X3JlY29yZF9qc29ucGF0aF9mYWlsZWRfdncnLCBmaWx0ZXIpXG5cdFx0cmV0dXJuIHJlc3A7XG5cdH1cblx0XG5cdC8vIGVuZCBjcnVkbCBtZXRob2RzXG59XG5cbi8vIGJlZ2luIGludGVyZmFjZXNcblxuZXhwb3J0IGludGVyZmFjZSBjYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X19yb3cge1xuXHRkYXRhc2V0X25hbWU6IHN0cmluZ1xuXHRpZDogbnVtYmVyXG5cdHNlc3Npb25fc3RhcnRfdHM6IHN0cmluZ1xuXHR0ZXN0ZWRfcmVjb3JzOiBudW1iZXJcbn1cblxuZXhwb3J0IGludGVyZmFjZSBjYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X2NoZWNrX19yb3cge1xuXHRjaGVja19uYW1lOiBzdHJpbmdcblx0ZGF0YXNldF9uYW1lOiBzdHJpbmdcblx0aWQ6IG51bWJlclxuXHRzZXNzaW9uX3N0YXJ0X3RzOiBzdHJpbmdcbn1cblxuZXhwb3J0IGludGVyZmFjZSBjYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X2NoZWNrX2NhdGVnb3J5X2NoZWNrX25hbWVfZmFpbGVkX3JlY29yc192d19fcm93IHtcblx0Y2hlY2tfY2F0ZWdvcnk6IHN0cmluZ1xuXHRjaGVja19uYW1lOiBzdHJpbmdcblx0ZGF0YXNldF9uYW1lOiBzdHJpbmdcblx0ZmFpbGVkX3JlY29yZHM6IG51bWJlclxuXHRzZXNzaW9uX3N0YXJ0X3RzOiBzdHJpbmdcblx0dG90X3JlY29yZHM6IG51bWJlclxufVxuXG5leHBvcnQgaW50ZXJmYWNlIGNhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfY2hlY2tfY2F0ZWdvcnlfY2hlY2tfbmFtZV9yZWNvcmRfcmVjb3JkX2ZhaWxlZF92d19fcm93IHtcblx0Y2hlY2tfY2F0ZWdvcnk6IHN0cmluZ1xuXHRjaGVja19uYW1lOiBzdHJpbmdcblx0ZGF0YXNldF9uYW1lOiBzdHJpbmdcblx0bnJfcmVjb3JkczogbnVtYmVyXG5cdHNlc3Npb25fc3RhcnRfdHM6IHN0cmluZ1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIGNhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfY2hlY2tfY2F0ZWdvcnlfZmFpbGVkX3JlY29yc192d19fcm93IHtcblx0Y2hlY2tfY2F0ZWdvcnk6IHN0cmluZ1xuXHRkYXRhc2V0X25hbWU6IHN0cmluZ1xuXHRmYWlsZWRfcmVjb3JkczogbnVtYmVyXG5cdHNlc3Npb25fc3RhcnRfdHM6IHN0cmluZ1xuXHR0b3RfcmVjb3JkczogbnVtYmVyXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9jaGVja19jYXRlZ29yeV9yZWNvcmRfanNvbnBhdGhfZmFpbGVkX3Z3X19yb3cge1xuXHRjaGVja19jYXRlZ29yeTogc3RyaW5nXG5cdGRhdGFzZXRfbmFtZTogc3RyaW5nXG5cdG5yX2NoZWNrX25hbWVzOiBudW1iZXJcblx0cmVjb3JkX2pzb25wYXRoOiBzdHJpbmdcblx0c2Vzc2lvbl9zdGFydF90czogc3RyaW5nXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9tYXhfdHNfdndfX3JvdyB7XG5cdGRhdGFzZXRfbmFtZTogc3RyaW5nXG5cdHNlc3Npb25fc3RhcnRfdHM6IHN0cmluZ1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIGNhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfcmVjb3JkX2NoZWNrX2ZhaWxlZF9fcm93IHtcblx0Y2hlY2tfY2F0ZWdvcnk6IHN0cmluZ1xuXHRjaGVja19uYW1lOiBzdHJpbmdcblx0ZGF0YXNldF9uYW1lOiBzdHJpbmdcblx0aWQ6IG51bWJlclxuXHRpbXBhY3RlZF9hdHRyaWJ1dGVzX2Nzdjogc3RyaW5nXG5cdHJlY29yZF9qc29uOiBzdHJpbmdcblx0cmVjb3JkX2pzb25wYXRoOiBzdHJpbmdcblx0c2Vzc2lvbl9zdGFydF90czogc3RyaW5nXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9fYnlleGFtcGxlIHtcblx0ZGF0YXNldF9uYW1lPzogc3RyaW5nXG5cdGlkPzogbnVtYmVyXG5cdHNlc3Npb25fc3RhcnRfdHM/OiBzdHJpbmdcblx0dGVzdGVkX3JlY29ycz86IG51bWJlclxufVxuXG5leHBvcnQgaW50ZXJmYWNlIGNhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfY2hlY2tfX2J5ZXhhbXBsZSB7XG5cdGNoZWNrX25hbWU/OiBzdHJpbmdcblx0ZGF0YXNldF9uYW1lPzogc3RyaW5nXG5cdGlkPzogbnVtYmVyXG5cdHNlc3Npb25fc3RhcnRfdHM/OiBzdHJpbmdcbn1cblxuZXhwb3J0IGludGVyZmFjZSBjYXRjaHNvbHZlX25vaW9kaF9fdGVzdF9kYXRhc2V0X2NoZWNrX2NhdGVnb3J5X2NoZWNrX25hbWVfZmFpbGVkX3JlY29yc192d19fYnlleGFtcGxlIHtcblx0Y2hlY2tfY2F0ZWdvcnk/OiBzdHJpbmdcblx0Y2hlY2tfbmFtZT86IHN0cmluZ1xuXHRkYXRhc2V0X25hbWU/OiBzdHJpbmdcblx0ZmFpbGVkX3JlY29yZHM/OiBudW1iZXJcblx0c2Vzc2lvbl9zdGFydF90cz86IHN0cmluZ1xuXHR0b3RfcmVjb3Jkcz86IG51bWJlclxufVxuXG5leHBvcnQgaW50ZXJmYWNlIGNhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfY2hlY2tfY2F0ZWdvcnlfY2hlY2tfbmFtZV9yZWNvcmRfcmVjb3JkX2ZhaWxlZF92d19fYnlleGFtcGxlIHtcblx0Y2hlY2tfY2F0ZWdvcnk/OiBzdHJpbmdcblx0Y2hlY2tfbmFtZT86IHN0cmluZ1xuXHRkYXRhc2V0X25hbWU/OiBzdHJpbmdcblx0bnJfcmVjb3Jkcz86IG51bWJlclxuXHRzZXNzaW9uX3N0YXJ0X3RzPzogc3RyaW5nXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9jaGVja19jYXRlZ29yeV9mYWlsZWRfcmVjb3JzX3Z3X19ieWV4YW1wbGUge1xuXHRjaGVja19jYXRlZ29yeT86IHN0cmluZ1xuXHRkYXRhc2V0X25hbWU/OiBzdHJpbmdcblx0ZmFpbGVkX3JlY29yZHM/OiBudW1iZXJcblx0c2Vzc2lvbl9zdGFydF90cz86IHN0cmluZ1xuXHR0b3RfcmVjb3Jkcz86IG51bWJlclxufVxuXG5leHBvcnQgaW50ZXJmYWNlIGNhdGNoc29sdmVfbm9pb2RoX190ZXN0X2RhdGFzZXRfY2hlY2tfY2F0ZWdvcnlfcmVjb3JkX2pzb25wYXRoX2ZhaWxlZF92d19fYnlleGFtcGxlIHtcblx0Y2hlY2tfY2F0ZWdvcnk/OiBzdHJpbmdcblx0ZGF0YXNldF9uYW1lPzogc3RyaW5nXG5cdG5yX2NoZWNrX25hbWVzPzogbnVtYmVyXG5cdHJlY29yZF9qc29ucGF0aD86IHN0cmluZ1xuXHRzZXNzaW9uX3N0YXJ0X3RzPzogc3RyaW5nXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9tYXhfdHNfdndfX2J5ZXhhbXBsZSB7XG5cdGRhdGFzZXRfbmFtZT86IHN0cmluZ1xuXHRzZXNzaW9uX3N0YXJ0X3RzPzogc3RyaW5nXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgY2F0Y2hzb2x2ZV9ub2lvZGhfX3Rlc3RfZGF0YXNldF9yZWNvcmRfY2hlY2tfZmFpbGVkX19ieWV4YW1wbGUge1xuXHRjaGVja19jYXRlZ29yeT86IHN0cmluZ1xuXHRjaGVja19uYW1lPzogc3RyaW5nXG5cdGRhdGFzZXRfbmFtZT86IHN0cmluZ1xuXHRpZD86IG51bWJlclxuXHRpbXBhY3RlZF9hdHRyaWJ1dGVzX2Nzdj86IHN0cmluZ1xuXHRyZWNvcmRfanNvbj86IHN0cmluZ1xuXHRyZWNvcmRfanNvbnBhdGg/OiBzdHJpbmdcblx0c2Vzc2lvbl9zdGFydF90cz86IHN0cmluZ1xufVxuXG4vLyBlbmQgaW50ZXJmYWNlcyJdfQ==