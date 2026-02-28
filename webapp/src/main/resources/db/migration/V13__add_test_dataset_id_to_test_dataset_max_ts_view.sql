drop view catchsolve_noiodh.test_dataset_max_ts_vw;

create or replace VIEW catchsolve_noiodh.test_dataset_max_ts_vw AS
WITH t AS (
         SELECT owner, test_dataset.id as test_dataset_id, test_dataset.used_key,
            test_dataset.dataset_name,
            test_dataset.session_start_ts,
            test_dataset.custom_dashboard_id,
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
    ( SELECT COALESCE((sum(tdc.tested_records))::integer, 0) AS "coalesce"
           FROM catchsolve_noiodh.test_dataset_check tdc
          WHERE ((tdc.dataset_name = t.dataset_name) AND (tdc.session_start_ts = t.session_start_ts))) AS tested_records,
    ( SELECT test_dataset.dataset_img_url
           FROM catchsolve_noiodh.test_dataset
          WHERE ((test_dataset.dataset_name = t.dataset_name) AND (test_dataset.session_start_ts = t.session_start_ts))) AS dataset_img_url,
    ( SELECT count(DISTINCT test_dataset_record_check_failed.record_jsonpath) AS count
           FROM catchsolve_noiodh.test_dataset_record_check_failed
          WHERE ((test_dataset_record_check_failed.dataset_name = t.dataset_name) AND (test_dataset_record_check_failed.session_start_ts = t.session_start_ts))) AS failed_records
   FROM t
 where rn = 1;
