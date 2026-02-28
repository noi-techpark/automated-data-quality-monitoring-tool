
ALTER TABLE catchsolve_noiodh.test_dataset
ALTER COLUMN owner DROP DEFAULT;


ALTER TABLE catchsolve_noiodh.test_dataset_record_check_failed
ADD COLUMN owner text;

UPDATE catchsolve_noiodh.test_dataset_record_check_failed
SET owner = 'public';

ALTER TABLE catchsolve_noiodh.test_dataset_record_check_failed
ALTER COLUMN owner SET NOT NULL;
