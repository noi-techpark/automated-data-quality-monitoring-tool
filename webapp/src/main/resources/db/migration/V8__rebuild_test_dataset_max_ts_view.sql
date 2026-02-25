DROP VIEW IF EXISTS catchsolve_noiodh.test_dataset_max_ts_vw;

CREATE VIEW catchsolve_noiodh.test_dataset_max_ts_vw AS
 WITH t AS (
         SELECT owner, test_dataset.used_key,
            test_dataset.dataset_name,
            max(test_dataset.session_start_ts) AS session_start_ts
           FROM catchsolve_noiodh.test_dataset
          GROUP BY owner, test_dataset.used_key, test_dataset.dataset_name
        )
 SELECT owner, used_key,
    dataset_name,
    session_start_ts,
    ( SELECT COALESCE((sum(tdc.tested_records))::integer, 0) AS "coalesce"
           FROM catchsolve_noiodh.test_dataset_check tdc
          WHERE ((tdc.dataset_name = t.dataset_name) AND (tdc.session_start_ts = t.session_start_ts))) AS tested_records,
    ( SELECT test_dataset.dataset_img_url
           FROM catchsolve_noiodh.test_dataset
          WHERE ((test_dataset.dataset_name = t.dataset_name) AND (test_dataset.session_start_ts = t.session_start_ts))) AS dataset_img_url,
    ( SELECT count(DISTINCT test_dataset_record_check_failed.record_jsonpath) AS count
           FROM catchsolve_noiodh.test_dataset_record_check_failed
          WHERE ((test_dataset_record_check_failed.dataset_name = t.dataset_name) AND (test_dataset_record_check_failed.session_start_ts = t.session_start_ts))) AS failed_records
   FROM t;
