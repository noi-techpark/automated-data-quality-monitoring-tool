CREATE OR REPLACE VIEW catchsolve_noiodh.test_dataset_check_category_failed_recors_vw AS
 SELECT session_start_ts,
    dataset_name,
    check_category,
    (
        SELECT count(DISTINCT record_jsonpath)
        FROM catchsolve_noiodh.test_dataset_record_check_failed f2
        WHERE f2.session_start_ts = f1.session_start_ts
          AND f2.dataset_name = f1.dataset_name
          AND f2.check_category = f1.check_category
    ) AS failed_records,
    sum(tested_records)::int AS tot_records
   FROM catchsolve_noiodh.test_dataset_check f1
   GROUP BY 1, 2, 3;
