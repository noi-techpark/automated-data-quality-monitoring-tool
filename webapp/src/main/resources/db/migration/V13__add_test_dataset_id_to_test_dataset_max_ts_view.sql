drop view catchsolve_noiodh.test_dataset_max_ts_vw;

create or replace VIEW catchsolve_noiodh.test_dataset_max_ts_vw AS
WITH t AS (
         SELECT owner, test_dataset.id as test_dataset_id, test_dataset.used_key,
            test_dataset.dataset_name,
            test_dataset.session_start_ts,
            test_dataset.custom_dashboard_id,
            test_dataset.tested_records,
            test_dataset.dataset_img_url,
            test_dataset.id ,
             row_number() OVER (
            PARTITION BY owner, used_key, dataset_name, custom_dashboard_id
            ORDER BY session_start_ts DESC
        ) AS rn
           FROM catchsolve_noiodh.test_dataset
        )        
 SELECT owner, used_key,
    dataset_name,
    session_start_ts,
    test_dataset_id,
    custom_dashboard_id,
    tested_records,
    dataset_img_url,
    ( SELECT count(DISTINCT test_dataset_record_check_failed.record_jsonpath) AS count
           FROM catchsolve_noiodh.test_dataset_record_check_failed
          WHERE t.id = test_dataset_record_check_failed.test_dataset_id ) AS failed_records
   FROM t
 where rn = 1;
