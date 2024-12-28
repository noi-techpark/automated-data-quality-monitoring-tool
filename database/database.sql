--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

-- Started on 2024-12-28 17:56:57 CET

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
-- TOC entry 6 (class 2615 OID 16435)
-- Name: catchsolve_noiodh; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA catchsolve_noiodh;


SET default_table_access_method = heap;

--
-- TOC entry 216 (class 1259 OID 16436)
-- Name: test_dataset; Type: TABLE; Schema: catchsolve_noiodh; Owner: -
--

CREATE TABLE catchsolve_noiodh.test_dataset (
    id bigint NOT NULL,
    session_start_ts timestamp with time zone NOT NULL,
    dataset_name text NOT NULL,
    tested_records integer NOT NULL
);


--
-- TOC entry 218 (class 1259 OID 16463)
-- Name: test_dataset_check; Type: TABLE; Schema: catchsolve_noiodh; Owner: -
--

CREATE TABLE catchsolve_noiodh.test_dataset_check (
    id bigint NOT NULL,
    session_start_ts timestamp with time zone NOT NULL,
    dataset_name text NOT NULL,
    check_name text NOT NULL
);


--
-- TOC entry 217 (class 1259 OID 16453)
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
    check_category text NOT NULL
);


--
-- TOC entry 223 (class 1259 OID 43432)
-- Name: test_dataset_check_category_check_name_failed_recors_vw; Type: VIEW; Schema: catchsolve_noiodh; Owner: -
--

CREATE VIEW catchsolve_noiodh.test_dataset_check_category_check_name_failed_recors_vw AS
 SELECT session_start_ts,
    dataset_name,
    check_category,
    check_name,
    count(DISTINCT record_json) AS failed_records,
    ( SELECT count(DISTINCT f2.record_jsonpath) AS count
           FROM catchsolve_noiodh.test_dataset_record_check_failed f2
          WHERE ((f1.session_start_ts = f2.session_start_ts) AND (f1.dataset_name = f2.dataset_name))) AS tot_records
   FROM catchsolve_noiodh.test_dataset_record_check_failed f1
  GROUP BY session_start_ts, dataset_name, check_category, check_name;


--
-- TOC entry 225 (class 1259 OID 43441)
-- Name: test_dataset_check_category_check_name_record_record_failed_vw; Type: VIEW; Schema: catchsolve_noiodh; Owner: -
--

CREATE VIEW catchsolve_noiodh.test_dataset_check_category_check_name_record_record_failed_vw AS
 SELECT session_start_ts,
    dataset_name,
    check_category,
    check_name,
    count(*) AS nr_records
   FROM catchsolve_noiodh.test_dataset_record_check_failed f1
  GROUP BY session_start_ts, dataset_name, check_category, check_name
  ORDER BY (count(*)) DESC, session_start_ts, dataset_name, check_category, check_name;


--
-- TOC entry 227 (class 1259 OID 129467)
-- Name: test_dataset_check_category_failed_recors_vw; Type: VIEW; Schema: catchsolve_noiodh; Owner: -
--

CREATE VIEW catchsolve_noiodh.test_dataset_check_category_failed_recors_vw AS
 SELECT session_start_ts,
    dataset_name,
    check_category,
    count(DISTINCT record_json) AS failed_records,
    ( SELECT test_dataset.tested_records
           FROM catchsolve_noiodh.test_dataset
          WHERE ((test_dataset.dataset_name = f1.dataset_name) AND (test_dataset.session_start_ts = f1.session_start_ts))) AS tot_records
   FROM catchsolve_noiodh.test_dataset_record_check_failed f1
  GROUP BY session_start_ts, dataset_name, check_category;


--
-- TOC entry 226 (class 1259 OID 46272)
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
-- TOC entry 219 (class 1259 OID 16468)
-- Name: test_dataset_check_id_seq; Type: SEQUENCE; Schema: catchsolve_noiodh; Owner: -
--

CREATE SEQUENCE catchsolve_noiodh.test_dataset_check_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4349 (class 0 OID 0)
-- Dependencies: 219
-- Name: test_dataset_check_id_seq; Type: SEQUENCE OWNED BY; Schema: catchsolve_noiodh; Owner: -
--

ALTER SEQUENCE catchsolve_noiodh.test_dataset_check_id_seq OWNED BY catchsolve_noiodh.test_dataset_check.id;


--
-- TOC entry 228 (class 1259 OID 136949)
-- Name: test_dataset_history_vw; Type: VIEW; Schema: catchsolve_noiodh; Owner: -
--

CREATE VIEW catchsolve_noiodh.test_dataset_history_vw AS
 WITH t AS (
         SELECT test_dataset.session_start_ts,
            test_dataset.dataset_name,
            test_dataset.tested_records,
            row_number() OVER (PARTITION BY test_dataset.dataset_name ORDER BY test_dataset.session_start_ts DESC) AS age_per_dataset_name
           FROM catchsolve_noiodh.test_dataset
        )
 SELECT dataset_name,
    session_start_ts,
    check_category,
    count(DISTINCT record_jsonpath) AS failed_recs,
    ( SELECT d.tested_records
           FROM catchsolve_noiodh.test_dataset d
          WHERE ((d.session_start_ts = f.session_start_ts) AND (d.dataset_name = f.dataset_name))) AS tested_records
   FROM catchsolve_noiodh.test_dataset_record_check_failed f
  WHERE ((session_start_ts, dataset_name) IN ( SELECT t.session_start_ts,
            t.dataset_name
           FROM t
          WHERE (t.age_per_dataset_name <= 5)))
  GROUP BY dataset_name, session_start_ts, check_category
  ORDER BY dataset_name, session_start_ts, check_category;


--
-- TOC entry 220 (class 1259 OID 16478)
-- Name: test_dataset_id_seq; Type: SEQUENCE; Schema: catchsolve_noiodh; Owner: -
--

CREATE SEQUENCE catchsolve_noiodh.test_dataset_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4350 (class 0 OID 0)
-- Dependencies: 220
-- Name: test_dataset_id_seq; Type: SEQUENCE OWNED BY; Schema: catchsolve_noiodh; Owner: -
--

ALTER SEQUENCE catchsolve_noiodh.test_dataset_id_seq OWNED BY catchsolve_noiodh.test_dataset.id;


--
-- TOC entry 222 (class 1259 OID 36779)
-- Name: test_dataset_max_ts_vw; Type: VIEW; Schema: catchsolve_noiodh; Owner: -
--

CREATE VIEW catchsolve_noiodh.test_dataset_max_ts_vw AS
 WITH t AS (
         SELECT test_dataset.dataset_name,
            max(test_dataset.session_start_ts) AS session_start_ts
           FROM catchsolve_noiodh.test_dataset
          GROUP BY test_dataset.dataset_name
        )
 SELECT dataset_name,
    session_start_ts,
    ( SELECT test_dataset.tested_records
           FROM catchsolve_noiodh.test_dataset
          WHERE ((test_dataset.dataset_name = t.dataset_name) AND (test_dataset.session_start_ts = t.session_start_ts))) AS tested_records,
    ( SELECT count(DISTINCT test_dataset_record_check_failed.record_jsonpath) AS count
           FROM catchsolve_noiodh.test_dataset_record_check_failed
          WHERE ((test_dataset_record_check_failed.dataset_name = t.dataset_name) AND (test_dataset_record_check_failed.session_start_ts = t.session_start_ts))) AS failed_records
   FROM t;


--
-- TOC entry 221 (class 1259 OID 16483)
-- Name: test_dataset_record_attribute_check_fail_id_seq; Type: SEQUENCE; Schema: catchsolve_noiodh; Owner: -
--

CREATE SEQUENCE catchsolve_noiodh.test_dataset_record_attribute_check_fail_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4351 (class 0 OID 0)
-- Dependencies: 221
-- Name: test_dataset_record_attribute_check_fail_id_seq; Type: SEQUENCE OWNED BY; Schema: catchsolve_noiodh; Owner: -
--

ALTER SEQUENCE catchsolve_noiodh.test_dataset_record_attribute_check_fail_id_seq OWNED BY catchsolve_noiodh.test_dataset_record_check_failed.id;


--
-- TOC entry 4178 (class 2604 OID 16494)
-- Name: test_dataset id; Type: DEFAULT; Schema: catchsolve_noiodh; Owner: -
--

ALTER TABLE ONLY catchsolve_noiodh.test_dataset ALTER COLUMN id SET DEFAULT nextval('catchsolve_noiodh.test_dataset_id_seq'::regclass);


--
-- TOC entry 4180 (class 2604 OID 16496)
-- Name: test_dataset_check id; Type: DEFAULT; Schema: catchsolve_noiodh; Owner: -
--

ALTER TABLE ONLY catchsolve_noiodh.test_dataset_check ALTER COLUMN id SET DEFAULT nextval('catchsolve_noiodh.test_dataset_check_id_seq'::regclass);


--
-- TOC entry 4179 (class 2604 OID 16498)
-- Name: test_dataset_record_check_failed id; Type: DEFAULT; Schema: catchsolve_noiodh; Owner: -
--

ALTER TABLE ONLY catchsolve_noiodh.test_dataset_record_check_failed ALTER COLUMN id SET DEFAULT nextval('catchsolve_noiodh.test_dataset_record_attribute_check_fail_id_seq'::regclass);


--
-- TOC entry 4186 (class 2606 OID 16572)
-- Name: test_dataset_record_check_failed nuk; Type: CONSTRAINT; Schema: catchsolve_noiodh; Owner: -
--

ALTER TABLE ONLY catchsolve_noiodh.test_dataset_record_check_failed
    ADD CONSTRAINT nuk UNIQUE (session_start_ts, dataset_name, record_jsonpath, check_name);


--
-- TOC entry 4190 (class 2606 OID 16517)
-- Name: test_dataset_check test_dataset_check_id_key; Type: CONSTRAINT; Schema: catchsolve_noiodh; Owner: -
--

ALTER TABLE ONLY catchsolve_noiodh.test_dataset_check
    ADD CONSTRAINT test_dataset_check_id_key UNIQUE (id);


--
-- TOC entry 4192 (class 2606 OID 16519)
-- Name: test_dataset_check test_dataset_check_pkey; Type: CONSTRAINT; Schema: catchsolve_noiodh; Owner: -
--

ALTER TABLE ONLY catchsolve_noiodh.test_dataset_check
    ADD CONSTRAINT test_dataset_check_pkey PRIMARY KEY (session_start_ts, dataset_name, check_name);


--
-- TOC entry 4182 (class 2606 OID 16521)
-- Name: test_dataset test_dataset_id_key; Type: CONSTRAINT; Schema: catchsolve_noiodh; Owner: -
--

ALTER TABLE ONLY catchsolve_noiodh.test_dataset
    ADD CONSTRAINT test_dataset_id_key UNIQUE (id);


--
-- TOC entry 4184 (class 2606 OID 16523)
-- Name: test_dataset test_dataset_pkey; Type: CONSTRAINT; Schema: catchsolve_noiodh; Owner: -
--

ALTER TABLE ONLY catchsolve_noiodh.test_dataset
    ADD CONSTRAINT test_dataset_pkey PRIMARY KEY (session_start_ts, dataset_name);


--
-- TOC entry 4188 (class 2606 OID 16525)
-- Name: test_dataset_record_check_failed test_dataset_record_attribute_check_fail_id_key; Type: CONSTRAINT; Schema: catchsolve_noiodh; Owner: -
--

ALTER TABLE ONLY catchsolve_noiodh.test_dataset_record_check_failed
    ADD CONSTRAINT test_dataset_record_attribute_check_fail_id_key UNIQUE (id);


--
-- TOC entry 4193 (class 2606 OID 16539)
-- Name: test_dataset_check test_dataset_check_session_start_ts_fkey; Type: FK CONSTRAINT; Schema: catchsolve_noiodh; Owner: -
--

ALTER TABLE ONLY catchsolve_noiodh.test_dataset_check
    ADD CONSTRAINT test_dataset_check_session_start_ts_fkey FOREIGN KEY (session_start_ts, dataset_name) REFERENCES catchsolve_noiodh.test_dataset(session_start_ts, dataset_name);


-- Completed on 2024-12-28 17:57:35 CET

--
-- PostgreSQL database dump complete
--

