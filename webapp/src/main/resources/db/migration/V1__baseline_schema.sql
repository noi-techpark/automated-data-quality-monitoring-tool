--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8
-- Dumped by pg_dump version 16.8 (Debian 16.8-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: catchsolve_noiodh; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA if not exists catchsolve_noiodh;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: rules; Type: TABLE; Schema: catchsolve_noiodh; Owner: -
--

CREATE TABLE catchsolve_noiodh.rules (
    id text DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    datasetname_searchfilter text NOT NULL,
    searchfilter text NOT NULL,
    type text NOT NULL,
    value text NOT NULL,
    createdat timestamp with time zone DEFAULT now() NOT NULL,
    active boolean DEFAULT true NOT NULL,
    category text DEFAULT ''::text NOT NULL
);


--
-- Name: test_dataset; Type: TABLE; Schema: catchsolve_noiodh; Owner: -
--

CREATE TABLE catchsolve_noiodh.test_dataset (
    id bigint NOT NULL,
    session_start_ts timestamp with time zone NOT NULL,
    dataset_name text NOT NULL,
    tested_records integer DEFAULT 0 NOT NULL,
    dataset_img_url text DEFAULT ''::text NOT NULL,
    errors text,
    dataset_dataspace text,
    used_key text
);


--
-- Name: test_dataset_check; Type: TABLE; Schema: catchsolve_noiodh; Owner: -
--

CREATE TABLE catchsolve_noiodh.test_dataset_check (
    id bigint NOT NULL,
    session_start_ts timestamp with time zone NOT NULL,
    dataset_name text NOT NULL,
    check_name text NOT NULL
);


--
-- Name: test_dataset_record_check_failed; Type: TABLE; Schema: catchsolve_noiodh; Owner: -
--

CREATE TABLE catchsolve_noiodh.test_dataset_record_check_failed (
    id bigint NOT NULL,
    session_start_ts timestamp with time zone NOT NULL,
    dataset_name text NOT NULL,
    record_jsonpath text NOT NULL,
    check_name text NOT NULL,
    record_json text NOT NULL,
    impacted_attributes_csv text NOT NULL,
    check_category text NOT NULL,
    problem_hint text NOT NULL,
    used_key text,
    impacted_attribute_value text
);


--
-- Name: test_dataset_check_category_check_name_failed_recors_vw; Type: VIEW; Schema: catchsolve_noiodh; Owner: -
--

CREATE VIEW catchsolve_noiodh.test_dataset_check_category_check_name_failed_recors_vw AS
 SELECT session_start_ts,
    dataset_name,
    check_category,
    check_name,
    count(DISTINCT record_jsonpath) AS failed_records,
    ( SELECT count(DISTINCT f2.record_jsonpath) AS count
           FROM catchsolve_noiodh.test_dataset_record_check_failed f2
          WHERE ((f1.session_start_ts = f2.session_start_ts) AND (f1.dataset_name = f2.dataset_name))) AS tot_records
   FROM catchsolve_noiodh.test_dataset_record_check_failed f1
  GROUP BY session_start_ts, dataset_name, check_category, check_name;


--
-- Name: test_dataset_check_category_check_name_record_record_failed_vw; Type: VIEW; Schema: catchsolve_noiodh; Owner: -
--

CREATE VIEW catchsolve_noiodh.test_dataset_check_category_check_name_record_record_failed_vw AS
 SELECT session_start_ts,
    dataset_name,
    check_category,
    check_name,
    count(DISTINCT record_jsonpath) AS nr_records
   FROM catchsolve_noiodh.test_dataset_record_check_failed f1
  GROUP BY session_start_ts, dataset_name, check_category, check_name
  ORDER BY (count(*)) DESC, session_start_ts, dataset_name, check_category, check_name;


--
-- Name: test_dataset_check_category_failed_recors_vw; Type: VIEW; Schema: catchsolve_noiodh; Owner: -
--

CREATE VIEW catchsolve_noiodh.test_dataset_check_category_failed_recors_vw AS
 SELECT session_start_ts,
    dataset_name,
    check_category,
    count(DISTINCT record_jsonpath) AS failed_records,
    ( SELECT test_dataset.tested_records
           FROM catchsolve_noiodh.test_dataset
          WHERE ((test_dataset.dataset_name = f1.dataset_name) AND (test_dataset.session_start_ts = f1.session_start_ts))) AS tot_records
   FROM catchsolve_noiodh.test_dataset_record_check_failed f1
  GROUP BY session_start_ts, dataset_name, check_category;


--
-- Name: test_dataset_check_category_record_jsonpath_failed_vw; Type: VIEW; Schema: catchsolve_noiodh; Owner: -
--

CREATE VIEW catchsolve_noiodh.test_dataset_check_category_record_jsonpath_failed_vw AS
 SELECT session_start_ts,
    dataset_name,
    check_category,
    record_jsonpath,
    record_json,
    count(*) AS nr_check_names
   FROM catchsolve_noiodh.test_dataset_record_check_failed f1
  GROUP BY session_start_ts, dataset_name, check_category, record_jsonpath, record_json
  ORDER BY (count(*)) DESC, session_start_ts, dataset_name, check_category, record_jsonpath;


--
-- Name: test_dataset_check_id_seq; Type: SEQUENCE; Schema: catchsolve_noiodh; Owner: -
--

CREATE SEQUENCE catchsolve_noiodh.test_dataset_check_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: test_dataset_check_id_seq; Type: SEQUENCE OWNED BY; Schema: catchsolve_noiodh; Owner: -
--

ALTER SEQUENCE catchsolve_noiodh.test_dataset_check_id_seq OWNED BY catchsolve_noiodh.test_dataset_check.id;


--
-- Name: test_dataset_history_vw; Type: VIEW; Schema: catchsolve_noiodh; Owner: -
--

CREATE VIEW catchsolve_noiodh.test_dataset_history_vw AS
 WITH t AS (
         SELECT test_dataset.session_start_ts,
            test_dataset.dataset_name,
            test_dataset.tested_records,
            row_number() OVER (PARTITION BY test_dataset.dataset_name ORDER BY test_dataset.session_start_ts DESC) AS age_per_dataset_name
           FROM catchsolve_noiodh.test_dataset
        ), t2 AS (
         SELECT f.dataset_name,
            f.session_start_ts,
            f.check_category,
            f.check_name,
            count(DISTINCT f.record_jsonpath) AS failed_recs,
            ( SELECT d.tested_records
                   FROM catchsolve_noiodh.test_dataset d
                  WHERE ((d.session_start_ts = f.session_start_ts) AND (d.dataset_name = f.dataset_name))) AS tested_records
           FROM catchsolve_noiodh.test_dataset_record_check_failed f
          WHERE ((f.session_start_ts, f.dataset_name) IN ( SELECT t.session_start_ts,
                    t.dataset_name
                   FROM t
                  WHERE (t.session_start_ts >= (CURRENT_TIMESTAMP - '30 days'::interval))))
          GROUP BY f.dataset_name, f.session_start_ts, f.check_category, f.check_name
          ORDER BY f.dataset_name, f.session_start_ts, f.check_category, f.check_name
        )
 SELECT dataset_name,
    session_start_ts,
    check_category,
    (json_agg(jsonb_build_object('check_name', check_name, 'failed_recs', failed_recs)))::text AS check_stats
   FROM t2
  GROUP BY dataset_name, session_start_ts, check_category;


--
-- Name: test_dataset_id_seq; Type: SEQUENCE; Schema: catchsolve_noiodh; Owner: -
--

CREATE SEQUENCE catchsolve_noiodh.test_dataset_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: test_dataset_id_seq; Type: SEQUENCE OWNED BY; Schema: catchsolve_noiodh; Owner: -
--

ALTER SEQUENCE catchsolve_noiodh.test_dataset_id_seq OWNED BY catchsolve_noiodh.test_dataset.id;


--
-- Name: test_dataset_max_ts_vw; Type: VIEW; Schema: catchsolve_noiodh; Owner: -
--

CREATE VIEW catchsolve_noiodh.test_dataset_max_ts_vw AS
 WITH t AS (
         SELECT test_dataset.used_key,
            test_dataset.dataset_name,
            max(test_dataset.session_start_ts) AS session_start_ts
           FROM catchsolve_noiodh.test_dataset
          GROUP BY test_dataset.used_key, test_dataset.dataset_name
        )
 SELECT used_key,
    dataset_name,
    session_start_ts,
    ( SELECT test_dataset.tested_records
           FROM catchsolve_noiodh.test_dataset
          WHERE ((test_dataset.dataset_name = t.dataset_name) AND (test_dataset.session_start_ts = t.session_start_ts))) AS tested_records,
    ( SELECT test_dataset.dataset_img_url
           FROM catchsolve_noiodh.test_dataset
          WHERE ((test_dataset.dataset_name = t.dataset_name) AND (test_dataset.session_start_ts = t.session_start_ts))) AS dataset_img_url,
    ( SELECT count(DISTINCT test_dataset_record_check_failed.record_jsonpath) AS count
           FROM catchsolve_noiodh.test_dataset_record_check_failed
          WHERE ((test_dataset_record_check_failed.dataset_name = t.dataset_name) AND (test_dataset_record_check_failed.session_start_ts = t.session_start_ts))) AS failed_records
   FROM t;


--
-- Name: test_dataset_record_attribute_check_fail_id_seq; Type: SEQUENCE; Schema: catchsolve_noiodh; Owner: -
--

CREATE SEQUENCE catchsolve_noiodh.test_dataset_record_attribute_check_fail_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: test_dataset_record_attribute_check_fail_id_seq; Type: SEQUENCE OWNED BY; Schema: catchsolve_noiodh; Owner: -
--

ALTER SEQUENCE catchsolve_noiodh.test_dataset_record_attribute_check_fail_id_seq OWNED BY catchsolve_noiodh.test_dataset_record_check_failed.id;


--
-- Name: test_dataset_record_check_failed_impacted_csv_vw; Type: VIEW; Schema: catchsolve_noiodh; Owner: -
--

CREATE VIEW catchsolve_noiodh.test_dataset_record_check_failed_impacted_csv_vw AS
 SELECT session_start_ts,
    dataset_name,
    record_jsonpath,
    check_name,
    max(record_json) AS record_json,
    string_agg(impacted_attributes_csv, ','::text ORDER BY test_dataset_record_check_failed.impacted_attributes_csv) AS impacted_attributes_csv,
    check_category,
    used_key
   FROM catchsolve_noiodh.test_dataset_record_check_failed
  GROUP BY session_start_ts, dataset_name, record_jsonpath, check_name, record_json, check_category, used_key
  ORDER BY session_start_ts DESC, (min(id));


--
-- Name: test_dataset id; Type: DEFAULT; Schema: catchsolve_noiodh; Owner: -
--

ALTER TABLE ONLY catchsolve_noiodh.test_dataset ALTER COLUMN id SET DEFAULT nextval('catchsolve_noiodh.test_dataset_id_seq'::regclass);


--
-- Name: test_dataset_check id; Type: DEFAULT; Schema: catchsolve_noiodh; Owner: -
--

ALTER TABLE ONLY catchsolve_noiodh.test_dataset_check ALTER COLUMN id SET DEFAULT nextval('catchsolve_noiodh.test_dataset_check_id_seq'::regclass);


--
-- Name: test_dataset_record_check_failed id; Type: DEFAULT; Schema: catchsolve_noiodh; Owner: -
--

ALTER TABLE ONLY catchsolve_noiodh.test_dataset_record_check_failed ALTER COLUMN id SET DEFAULT nextval('catchsolve_noiodh.test_dataset_record_attribute_check_fail_id_seq'::regclass);


--
-- Name: rules rules_pkey; Type: CONSTRAINT; Schema: catchsolve_noiodh; Owner: -
--

ALTER TABLE ONLY catchsolve_noiodh.rules
    ADD CONSTRAINT rules_pkey PRIMARY KEY (id);


--
-- Name: test_dataset session_start_ts_dataset_name_unique; Type: CONSTRAINT; Schema: catchsolve_noiodh; Owner: -
--

ALTER TABLE ONLY catchsolve_noiodh.test_dataset
    ADD CONSTRAINT session_start_ts_dataset_name_unique UNIQUE (session_start_ts, dataset_name);


--
-- Name: test_dataset_check test_dataset_check_id_key; Type: CONSTRAINT; Schema: catchsolve_noiodh; Owner: -
--

ALTER TABLE ONLY catchsolve_noiodh.test_dataset_check
    ADD CONSTRAINT test_dataset_check_id_key UNIQUE (id);


--
-- Name: test_dataset_check test_dataset_check_pkey; Type: CONSTRAINT; Schema: catchsolve_noiodh; Owner: -
--

ALTER TABLE ONLY catchsolve_noiodh.test_dataset_check
    ADD CONSTRAINT test_dataset_check_pkey PRIMARY KEY (session_start_ts, dataset_name, check_name);


--
-- Name: test_dataset test_dataset_id_key; Type: CONSTRAINT; Schema: catchsolve_noiodh; Owner: -
--

ALTER TABLE ONLY catchsolve_noiodh.test_dataset
    ADD CONSTRAINT test_dataset_id_key UNIQUE (id);


--
-- Name: test_dataset test_dataset_pkey; Type: CONSTRAINT; Schema: catchsolve_noiodh; Owner: -
--

ALTER TABLE ONLY catchsolve_noiodh.test_dataset
    ADD CONSTRAINT test_dataset_pkey PRIMARY KEY (session_start_ts, dataset_name);


--
-- Name: test_dataset_record_check_failed test_dataset_record_attribute_check_fail_id_key; Type: CONSTRAINT; Schema: catchsolve_noiodh; Owner: -
--

ALTER TABLE ONLY catchsolve_noiodh.test_dataset_record_check_failed
    ADD CONSTRAINT test_dataset_record_attribute_check_fail_id_key UNIQUE (id);


--
-- Name: test_dataset_record_check_fai_session_start_ts_dataset_name_idx; Type: INDEX; Schema: catchsolve_noiodh; Owner: -
--

CREATE INDEX test_dataset_record_check_fai_session_start_ts_dataset_name_idx ON catchsolve_noiodh.test_dataset_record_check_failed USING btree (session_start_ts, dataset_name, check_category, check_name);


--
-- Name: test_dataset_check test_dataset_check_session_start_ts_fkey; Type: FK CONSTRAINT; Schema: catchsolve_noiodh; Owner: -
--

ALTER TABLE ONLY catchsolve_noiodh.test_dataset_check
    ADD CONSTRAINT test_dataset_check_session_start_ts_fkey FOREIGN KEY (session_start_ts, dataset_name) REFERENCES catchsolve_noiodh.test_dataset(session_start_ts, dataset_name);


--
-- PostgreSQL database dump complete
--

