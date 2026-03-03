ALTER TABLE catchsolve_noiodh.test_dataset_check
    DROP CONSTRAINT test_dataset_check_session_start_ts_fkey;

ALTER TABLE catchsolve_noiodh.test_dataset
    DROP CONSTRAINT test_dataset_pkey;

ALTER TABLE catchsolve_noiodh.test_dataset
    DROP CONSTRAINT session_start_ts_dataset_name_unique;
