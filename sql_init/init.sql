--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-06-23 16:52:21

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 6 (class 2615 OID 33243)
-- Name: hp; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA hp;


ALTER SCHEMA hp OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 218 (class 1259 OID 33244)
-- Name: add_customers; Type: TABLE; Schema: hp; Owner: postgres
--

CREATE TABLE hp.add_customers (
    ac_id integer NOT NULL,
    ac_first_name character varying(100) NOT NULL,
    ac_last_name character varying(100),
    ac_phone_number character varying(10),
    ac_email_id character varying(50),
    ac_address character varying(500),
    ac_created_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    ac_updated_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    ac_action character varying(50),
    ac_is_active boolean,
    ac_cnic character varying(50),
    ac_email character varying(255),
    ac_status character varying(50)
);
ALTER TABLE hp.add_customers OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 33251)
-- Name: add_customers_ac_id_seq; Type: SEQUENCE; Schema: hp; Owner: postgres
--

CREATE SEQUENCE hp.add_customers_ac_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE hp.add_customers_ac_id_seq OWNER TO postgres;

--
-- TOC entry 4953 (class 0 OID 0)
-- Dependencies: 219
-- Name: add_customers_ac_id_seq; Type: SEQUENCE OWNED BY; Schema: hp; Owner: postgres
--

ALTER SEQUENCE hp.add_customers_ac_id_seq OWNED BY hp.add_customers.ac_id;

--
-- TOC entry 220 (class 1259 OID 33252)
-- Name: add_new_project; Type: TABLE; Schema: hp; Owner: postgres
--

CREATE TABLE hp.add_new_project (
    anp_project_id integer NOT NULL,
    anp_project_name character varying(255) NOT NULL,
    anp_pin_code character varying(10),
    anp_latitude numeric(10,6),
    anp_longitude numeric(10,6),
    anp_project_type character varying(100),
    anp_land_area_sqft numeric(10,2),
    anp_construction_area_sqft numeric(10,2),
    anp_num_floors integer,
    anp_num_rooms integer,
    anp_num_kitchens integer,
    anp_bim_file_path character varying(500),
    anp_floor_plan_file_path character varying(500),
    anp_customer_phone character varying(15),
    anp_customer_verified boolean DEFAULT false,
    anp_supervisor_verified boolean DEFAULT false,
    anp_design_file_path character varying(500),
    anp_start_date date,
    anp_end_date date,
    anp_created_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    anp_updated_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    anp_is_active boolean
);
ALTER TABLE hp.add_new_project OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 33261)
-- Name: add_new_project_anp_project_id_seq; Type: SEQUENCE; Schema: hp; Owner: postgres
--

CREATE SEQUENCE hp.add_new_project_anp_project_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE hp.add_new_project_anp_project_id_seq OWNER TO postgres;

--
-- TOC entry 4954 (class 0 OID 0)
-- Dependencies: 221
-- Name: add_new_project_anp_project_id_seq; Type: SEQUENCE OWNED BY; Schema: hp; Owner: postgres
--

ALTER SEQUENCE hp.add_new_project_anp_project_id_seq OWNED BY hp.add_new_project.anp_project_id;

--
-- TOC entry 222 (class 1259 OID 33262)
-- Name: add_supervisors; Type: TABLE; Schema: hp; Owner: postgres
--

CREATE TABLE hp.add_supervisors (
    as_id integer NOT NULL,
    as_first_name character varying(100) NOT NULL,
    as_last_name character varying(100) NOT NULL,
    as_phone_number character varying(10),
    as_email_id character varying(100),
    as_location character varying(100),
    as_pin_code integer,
    as_secondary_number character varying(10),
    as_created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    as_updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    as_action character varying(50),
    as_is_active boolean,
    as_status character varying(50),
    as_email character varying(255)
);
ALTER TABLE hp.add_supervisors OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 33269)
-- Name: add_supervisors_as_id_seq; Type: SEQUENCE; Schema: hp; Owner: postgres
--

CREATE SEQUENCE hp.add_supervisors_as_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE hp.add_supervisors_as_id_seq OWNER TO postgres;

--
-- TOC entry 4955 (class 0 OID 0)
-- Dependencies: 223
-- Name: add_supervisors_as_id_seq; Type: SEQUENCE OWNED BY; Schema: hp; Owner: postgres
--

ALTER SEQUENCE hp.add_supervisors_as_id_seq OWNED BY hp.add_supervisors.as_id;

--
-- TOC entry 224 (class 1259 OID 33270)
-- Name: admin_users; Type: TABLE; Schema: hp; Owner: postgres
--

CREATE TABLE hp.admin_users (
    au_admin_id integer NOT NULL,
    au_username character varying(100) NOT NULL,
    au_password_hash character varying(255) NOT NULL,
    au_email character varying(255),
    au_phone character varying(15),
    au_is_active boolean DEFAULT true,
    au_created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    au_updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    au_last_login timestamp without time zone
);
ALTER TABLE hp.admin_users OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 33278)
-- Name: admin_users_au_admin_id_seq; Type: SEQUENCE; Schema: hp; Owner: postgres
--

CREATE SEQUENCE hp.admin_users_au_admin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE hp.admin_users_au_admin_id_seq OWNER TO postgres;

--
-- TOC entry 4956 (class 0 OID 0)
-- Dependencies: 225
-- Name: admin_users_au_admin_id_seq; Type: SEQUENCE OWNED BY; Schema: hp; Owner: postgres
--

ALTER SEQUENCE hp.admin_users_au_admin_id_seq OWNED BY hp.admin_users.au_admin_id;

--
-- TOC entry 226 (class 1259 OID 33279)
-- Name: documents; Type: TABLE; Schema: hp; Owner: postgres
--

CREATE TABLE hp.documents (
    doc_id integer NOT NULL,
    doc_name character varying(255) NOT NULL,
    doc_category character varying(100) NOT NULL,
    doc_type character varying(255),
    doc_size character varying(50),
    doc_upload_date date DEFAULT CURRENT_DATE,
    doc_status character varying(50) DEFAULT 'Unverified'::character varying,
    doc_icon character varying(100),
    doc_color character varying(50),
    doc_file_path character varying(1000) NOT NULL,
    doc_file_url character varying(1000) NOT NULL,
    doc_project_id integer,
    project_id integer
);
ALTER TABLE hp.documents OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 33286)
-- Name: documents_doc_id_seq; Type: SEQUENCE; Schema: hp; Owner: postgres
--

CREATE SEQUENCE hp.documents_doc_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE hp.documents_doc_id_seq OWNER TO postgres;

--
-- TOC entry 4957 (class 0 OID 0)
-- Dependencies: 227
-- Name: documents_doc_id_seq; Type: SEQUENCE OWNED BY; Schema: hp; Owner: postgres
--

ALTER SEQUENCE hp.documents_doc_id_seq OWNED BY hp.documents.doc_id;

--
-- TOC entry 239 (class 1259 OID 33402)
-- Name: manage_architects; Type: TABLE; Schema: hp; Owner: postgres
--

CREATE TABLE hp.manage_architects (
    ar_id integer NOT NULL,
    ar_first_name character varying(100) NOT NULL,
    ar_last_name character varying(100) NOT NULL,
    ar_phone_number character varying(10) NOT NULL,
    ar_location character varying(255),
    ar_created_at timestamp without time zone DEFAULT now(),
    ar_updated_at timestamp without time zone DEFAULT now(),
    ar_status character varying(50) DEFAULT 'active'::character varying,
    ar_is_active boolean DEFAULT true
);
ALTER TABLE hp.manage_architects OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 33401)
-- Name: manage_architects_ar_id_seq; Type: SEQUENCE; Schema: hp; Owner: postgres
--

CREATE SEQUENCE hp.manage_architects_ar_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE hp.manage_architects_ar_id_seq OWNER TO postgres;

--
-- TOC entry 4958 (class 0 OID 0)
-- Dependencies: 238
-- Name: manage_architects_ar_id_seq; Type: SEQUENCE OWNED BY; Schema: hp; Owner: postgres
--

ALTER SEQUENCE hp.manage_architects_ar_id_seq OWNED BY hp.manage_architects.ar_id;

--
-- TOC entry 228 (class 1259 OID 33287)
-- Name: project_grid; Type: TABLE; Schema: hp; Owner: postgres
--

CREATE TABLE hp.project_grid (
    pg_project_id integer NOT NULL,
    pg_last_updated timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    pg_project_name character varying(255) NOT NULL,
    pg_supervisor_name character varying(255),
    pg_steps_completed integer DEFAULT 0,
    pg_work_completed_percent numeric(5,2) DEFAULT 0,
    pg_payment_due_percent numeric(5,2) DEFAULT 0,
    pg_project_cost numeric(20,2),
    pg_created_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    pg_updated_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    pg_is_active boolean,
    pg_status character varying(50) DEFAULT 'In Progress'::character varying,
    pg_customer_phone character varying(20),
    pg_supervisor_id integer,
    pg_pin_code character varying(20),
    pg_latitude double precision,
    pg_longitude double precision,
    pg_project_type character varying(50),
    pg_land_area numeric(15,3),
    pg_construction_area numeric(15,3),
    pg_num_floors bigint,
    pg_num_rooms integer,
    pg_num_kitchens integer,
    pg_start_date date,
    pg_end_date date,
    pg_bim_file_path character varying(255),
    pg_floor_plan_file_path character varying(255),
    pg_design_file_path character varying(255),
    pg_description text,
    pg_supervisor2_id integer,
    pg_supervisor3_id integer
);
ALTER TABLE hp.project_grid OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 33299)
-- Name: project_grid_pg_project_id_seq; Type: SEQUENCE; Schema: hp; Owner: postgres
--

CREATE SEQUENCE hp.project_grid_pg_project_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE hp.project_grid_pg_project_id_seq OWNER TO postgres;

--
-- TOC entry 4959 (class 0 OID 0)
-- Dependencies: 229
-- Name: project_grid_pg_project_id_seq; Type: SEQUENCE OWNED BY; Schema: hp; Owner: postgres
--

ALTER SEQUENCE hp.project_grid_pg_project_id_seq OWNED BY hp.project_grid.pg_project_id;

--
-- TOC entry 230 (class 1259 OID 33300)
-- Name: project_milestones; Type: TABLE; Schema: hp; Owner: postgres
--

CREATE TABLE hp.project_milestones (
    pm_milestone_id integer NOT NULL,
    pm_project_id integer,
    pm_milestone_name character varying(255),
    pm_target_date date,
    pm_created_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    pm_updated_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    pm_is_active boolean
);
ALTER TABLE hp.project_milestones OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 33305)
-- Name: project_milestones_pm_milestone_id_seq; Type: SEQUENCE; Schema: hp; Owner: postgres
--

CREATE SEQUENCE hp.project_milestones_pm_milestone_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE hp.project_milestones_pm_milestone_id_seq OWNER TO postgres;

--
-- TOC entry 4960 (class 0 OID 0)
-- Dependencies: 231
-- Name: project_milestones_pm_milestone_id_seq; Type: SEQUENCE OWNED BY; Schema: hp; Owner: postgres
--

ALTER SEQUENCE hp.project_milestones_pm_milestone_id_seq OWNED BY hp.project_milestones.pm_milestone_id;

--
-- TOC entry 232 (class 1259 OID 33306)
-- Name: project_supervisors; Type: TABLE; Schema: hp; Owner: postgres
--

CREATE TABLE hp.project_supervisors (
    ps_id integer NOT NULL,
    ps_project_id integer,
    ps_supervisor_id integer,
    ps_otp_verified boolean DEFAULT false,
    ps_created_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    ps_updated_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    ps_is_active boolean
);
ALTER TABLE hp.project_supervisors OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 33312)
-- Name: project_supervisors_ps_id_seq; Type: SEQUENCE; Schema: hp; Owner: postgres
--

CREATE SEQUENCE hp.project_supervisors_ps_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE hp.project_supervisors_ps_id_seq OWNER TO postgres;

--
-- TOC entry 4961 (class 0 OID 0)
-- Dependencies: 233
-- Name: project_supervisors_ps_id_seq; Type: SEQUENCE OWNED BY; Schema: hp; Owner: postgres
--

ALTER SEQUENCE hp.project_supervisors_ps_id_seq OWNED BY hp.project_supervisors.ps_id;

--
-- TOC entry 234 (class 1259 OID 33313)
-- Name: site_manage; Type: TABLE; Schema: hp; Owner: postgres
--

CREATE TABLE hp.site_manage (
    sm_id integer NOT NULL,
    sm_project_name character varying(100) NOT NULL,
    sm_address character varying(500),
    sm_start timestamp without time zone,
    sm_start_location character varying(200),
    sm_last_visit timestamp without time zone,
    sm_visit_person_name character varying(200),
    sm_visit_location character varying(200),
    sm_last_update character varying(200),
    sm_created_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    sm_updated_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    sm_action character varying(50),
    sm_is_active boolean
);
ALTER TABLE hp.site_manage OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 33320)
-- Name: site_manage_sm_id_seq; Type: SEQUENCE; Schema: hp; Owner: postgres
--

CREATE SEQUENCE hp.site_manage_sm_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE hp.site_manage_sm_id_seq OWNER TO postgres;

--
-- TOC entry 4962 (class 0 OID 0)
-- Dependencies: 235
-- Name: site_manage_sm_id_seq; Type: SEQUENCE OWNED BY; Schema: hp; Owner: postgres
--

ALTER SEQUENCE hp.site_manage_sm_id_seq OWNED BY hp.site_manage.sm_id;

--
-- TOC entry 236 (class 1259 OID 33321)
-- Name: tabular_format; Type: TABLE; Schema: hp; Owner: postgres
--

CREATE TABLE hp.tabular_format (
    tf_id integer NOT NULL,
    tf_cust_name character varying(100) NOT NULL,
    tf_phone_number character varying(10),
    tf_project_name character varying(100),
    tf_supervisor character varying(100),
    tf_project_cost integer,
    tf_payment_due integer,
    tf_payment_collected character varying(100),
    tf_pay_receive_date timestamp without time zone,
    tf_created_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tf_updated_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tf_action character varying(50),
    tf_is_active boolean
);
ALTER TABLE hp.tabular_format OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 33326)
-- Name: tabular_format_tf_id_seq; Type: SEQUENCE; Schema: hp; Owner: postgres
--

CREATE SEQUENCE hp.tabular_format_tf_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE hp.tabular_format_tf_id_seq OWNER TO postgres;

--
-- TOC entry 4963 (class 0 OID 0)
-- Dependencies: 237
-- Name: tabular_format_tf_id_seq; Type: SEQUENCE OWNED BY; Schema: hp; Owner: postgres
--

ALTER SEQUENCE hp.tabular_format_tf_id_seq OWNED BY hp.tabular_format.tf_id;

--
-- TOC entry 4692 (class 2604 OID 33327)
-- Name: add_customers ac_id; Type: DEFAULT; Schema: hp; Owner: postgres
--

ALTER TABLE ONLY hp.add_customers ALTER COLUMN ac_id SET DEFAULT nextval('hp.add_customers_ac_id_seq'::regclass);

--
-- TOC entry 4695 (class 2604 OID 33328)
-- Name: add_new_project anp_project_id; Type: DEFAULT; Schema: hp; Owner: postgres
--

ALTER TABLE ONLY hp.add_new_project ALTER COLUMN anp_project_id SET DEFAULT nextval('hp.add_new_project_anp_project_id_seq'::regclass);

--
-- TOC entry 4700 (class 2604 OID 33329)
-- Name: add_supervisors as_id; Type: DEFAULT; Schema: hp; Owner: postgres
--

ALTER TABLE ONLY hp.add_supervisors ALTER COLUMN as_id SET DEFAULT nextval('hp.add_supervisors_as_id_seq'::regclass);

--
-- TOC entry 4703 (class 2604 OID 33330)
-- Name: admin_users au_admin_id; Type: DEFAULT; Schema: hp; Owner: postgres
--

ALTER TABLE ONLY hp.admin_users ALTER COLUMN au_admin_id SET DEFAULT nextval('hp.admin_users_au_admin_id_seq'::regclass);

--
-- TOC entry 4707 (class 2604 OID 33331)
-- Name: documents doc_id; Type: DEFAULT; Schema: hp; Owner: postgres
--

ALTER TABLE ONLY hp.documents ALTER COLUMN doc_id SET DEFAULT nextval('hp.documents_doc_id_seq'::regclass);

--
-- TOC entry 4731 (class 2604 OID 33405)
-- Name: manage_architects ar_id; Type: DEFAULT; Schema: hp; Owner: postgres
--

ALTER TABLE ONLY hp.manage_architects ALTER COLUMN ar_id SET DEFAULT nextval('hp.manage_architects_ar_id_seq'::regclass);

--
-- TOC entry 4710 (class 2604 OID 33332)
-- Name: project_grid pg_project_id; Type: DEFAULT; Schema: hp; Owner: postgres
--

ALTER TABLE ONLY hp.project_grid ALTER COLUMN pg_project_id SET DEFAULT nextval('hp.project_grid_pg_project_id_seq'::regclass);

--
-- TOC entry 4718 (class 2604 OID 33333)
-- Name: project_milestones pm_milestone_id; Type: DEFAULT; Schema: hp; Owner: postgres
--

ALTER TABLE ONLY hp.project_milestones ALTER COLUMN pm_milestone_id SET DEFAULT nextval('hp.project_milestones_pm_milestone_id_seq'::regclass);

--
-- TOC entry 4721 (class 2604 OID 33334)
-- Name: project_supervisors ps_id; Type: DEFAULT; Schema: hp; Owner: postgres
--

ALTER TABLE ONLY hp.project_supervisors ALTER COLUMN ps_id SET DEFAULT nextval('hp.project_supervisors_ps_id_seq'::regclass);

--
-- TOC entry 4725 (class 2604 OID 33335)
-- Name: site_manage sm_id; Type: DEFAULT; Schema: hp; Owner: postgres
--

ALTER TABLE ONLY hp.site_manage ALTER COLUMN sm_id SET DEFAULT nextval('hp.site_manage_sm_id_seq'::regclass);

--
-- TOC entry 4728 (class 2604 OID 33336)
-- Name: tabular_format tf_id; Type: DEFAULT; Schema: hp; Owner: postgres
--

ALTER TABLE ONLY hp.tabular_format ALTER COLUMN tf_id SET DEFAULT nextval('hp.tabular_format_tf_id_seq'::regclass);

--
-- TOC entry 4926 (class 0 OID 33244)
-- Dependencies: 218
-- Data for Name: add_customers; Type: TABLE DATA; Schema: hp; Owner: postgres
--

COPY hp.add_customers (ac_id, ac_first_name, ac_last_name, ac_phone_number, ac_email_id, ac_address, ac_created_date, ac_updated_date, ac_action, ac_is_active, ac_cnic, ac_email, ac_status) FROM stdin;
3	John	Doe	9876553210	john.doe@example.com	123 Main St, Anytown	2025-06-20 13:31:21.732684	2025-06-20 13:31:21.732684	Created	t	12345-6789012-3	john.doe@example.com	Active
4	Jane	Smith	9876543211	jane.smith@example.com	456 Oak Ave, Somewhere	2025-06-20 13:31:21.732684	2025-06-20 13:31:21.732684	Created	f	23456-7890123-4	jane.smith@example.com	Inactive
5	Peter	Jones	9876543212	peter.jones@example.com	789 Pine Rd, Nowhere	2025-06-20 13:31:21.732684	2025-06-20 13:31:21.732684	Created	t	34567-8901234-5	peter.jones@example.com	Active
6	Alice	Williams	9876543213	alice.w@example.com	101 Elm Blvd, Big City	2025-06-20 13:31:21.732684	2025-06-20 13:31:21.732684	Created	f	45678-9012345-6	alice.w@example.com	Pending
7	Bob	Brown	9876543214	bob.b@example.com	202 Maple Dr, Small Town	2025-06-20 13:31:21.732684	2025-06-20 13:31:21.732684	Created	t	56789-0123456-7	bob.b@example.com	Active
8	Charlie	Davis	9876543215	charlie.d@example.com	303 Birch Ln, Green Valley	2025-06-20 13:31:21.732684	2025-06-20 13:31:21.732684	Created	f	67890-1234567-8	charlie.d@example.com	Inactive
9	Diana	Miller	9876543216	diana.m@example.com	404 Cedar Ct, Lakeside	2025-06-20 13:31:21.732684	2025-06-20 13:31:21.732684	Created	t	78901-2345678-9	diana.m@example.com	Pending
10	Eve	Wilson	9876543217	eve.w@example.com	505 Poplar Pl, Hilltop	2025-06-20 13:31:21.732684	2025-06-20 13:31:21.732684	Created	f	89012-3456789-0	eve.w@example.com	Active
11	Frank	Moore	9876543218	frank.m@example.com	606 Willow Way, Riverbank	2025-06-20 13:31:21.732684	2025-06-20 13:31:21.732684	Created	t	90123-4567890-1	frank.m@example.com	Inactive
12	Grace	Taylor	9876543219	grace.t@example.com	707 Oakwood Rd, Forest	2025-06-20 13:31:21.732684	2025-06-20 13:31:21.732684	Created	f	01234-5678901-2	grace.t@example.com	Pending
1	tested	patil	9876543210	\N	123 Test St	2025-06-17 11:38:37.890977	2025-06-20 18:10:50.205235	\N	t	12345-6789012-3	\N	Active
\.
--
-- TOC entry 4928 (class 0 OID 33252)
-- Dependencies: 220
-- Data for Name: add_new_project; Type: TABLE DATA; Schema: hp; Owner: postgres
--

COPY hp.add_new_project (anp_project_id, anp_project_name, anp_pin_code, anp_latitude, anp_longitude, anp_project_type, anp_land_area_sqft, anp_construction_area_sqft, anp_num_floors, anp_num_rooms, anp_num_kitchens, anp_bim_file_path, anp_floor_plan_file_path, anp_customer_phone, anp_customer_verified, anp_supervisor_verified, anp_design_file_path, anp_start_date, anp_end_date, anp_created_date, anp_updated_date, anp_is_active) FROM stdin;
1	New	600127	\N	\N	Bungalow	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	2025-06-03	2025-06-20	2025-06-10 12:31:17.16518	2025-06-10 12:31:17.16518	t
2	anveshan	600127	\N	\N	Bungalow	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	2025-06-03	2025-06-20	2025-06-10 12:33:43.772652	2025-06-10 12:33:43.772652	t
3	anveshan	600127	\N	\N	Bungalow	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	2025-06-03	2025-06-20	2025-06-10 12:34:17.241828	2025-06-10 12:34:17.241828	t
4		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	2025-06-10 12:50:17.607552	2025-06-10 12:50:17.607552	t
5		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	2025-06-10 12:50:34.735318	2025-06-10 12:50:34.735318	t
6		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	2025-06-10 12:51:44.912058	2025-06-10 12:51:44.912058	t
7		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	2025-06-10 12:52:00.542173	2025-06-10 12:52:00.542173	t
8		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	2025-06-10 12:52:02.121099	2025-06-10 12:52:02.121099	t
9		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	2025-06-10 12:52:02.32213	2025-06-10 12:52:02.32213	t
10		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	2025-06-10 12:52:02.569509	2025-06-10 12:52:02.569509	t
11		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	2025-06-10 13:00:06.301961	2025-06-10 13:00:06.301961	t
12		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	2025-06-10 13:16:06.539628	2025-06-10 13:16:06.539628	t
13	yp	600127	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	2025-06-10 13:21:59.170951	2025-06-10 13:21:59.170951	t
14	as	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	2025-06-10 13:24:17.644864	2025-06-10 13:24:17.644864	t
15	lkkkl	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	2025-06-10 13:26:53.352452	2025-06-10 13:26:53.352452	t
16	aaa	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	2025-06-10 13:28:23.745954	2025-06-10 13:28:23.745954	t
17	bb	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	2025-06-10 13:29:41.849867	2025-06-10 13:29:41.849867	t
18	yp	600127	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	2025-06-25	2025-06-28	2025-06-10 14:35:43.854619	2025-06-10 14:35:43.854619	t
\.
--
-- TOC entry 4930 (class 0 OID 33262)
-- Dependencies: 222
-- Data for Name: add_supervisors; Type: TABLE DATA; Schema: hp; Owner: postgres
--

COPY hp.add_supervisors (as_id, as_first_name, as_last_name, as_phone_number, as_email_id, as_location, as_pin_code, as_secondary_number, as_created_at, as_updated_at, as_action, as_is_active, as_status, as_email) FROM stdin;
2	Jane	p	9123456789	jane.smith@example.com	N/A	411001	9123456790	2025-06-04 13:11:14.515485	2025-06-19 18:55:11.857052	Active	t	Active	\N
3	Robe	lgbj	9988776655	robert.brown@example.com	N/A	110001	9988776656	2025-06-04 13:11:14.515485	2025-06-20 12:40:56.504438	Suspended	t	Pending	\N
7	Da	Miller	9845612398	david.miller@example.com	Kolkata	700001	9845612399	2025-06-20 13:31:21.732684	2025-06-20 13:31:21.732684	Created	t	Active	david.miller@example.com
8	Emily	Wilson	9876543217	emily.w@example.com	Mumbai	400001	9876543218	2025-06-20 13:31:21.732684	2025-06-20 13:31:21.732684	Created	f	Inactive	emily.w@example.com
9	Olivia	Moore	9876543219	olivia.m@example.com	Delhi	110001	9876543220	2025-06-20 13:31:21.732684	2025-06-20 13:31:21.732684	Created	t	Pending	olivia.m@example.com
10	William	Taylor	9876543221	william.t@example.com	Bangalore	560001	9876543222	2025-06-20 13:31:21.732684	2025-06-20 13:31:21.732684	Created	f	Active	william.t@example.com
11	Sophia	Anderson	9876543223	sophia.a@example.com	Chennai	600001	9876543224	2025-06-20 13:31:21.732684	2025-06-20 13:31:21.732684	Created	t	Inactive	sophia.a@example.com
12	James	Thomas	9876543225	james.t@example.com	Hyderabad	500001	9876543226	2025-06-20 13:31:21.732684	2025-06-20 13:31:21.732684	Created	f	Pending	james.t@example.com
13	Isabella	Jackson	9876543227	isabella.j@example.com	Pune	411001	9876543228	2025-06-20 13:31:21.732684	2025-06-20 13:31:21.732684	Created	t	Active	isabella.j@example.com
14	Liam	White	9876543229	liam.w@example.com	Ahmedabad	380001	9876543230	2025-06-20 13:31:21.732684	2025-06-20 13:31:21.732684	Created	f	Inactive	liam.w@example.com
15	Charlotte	Harris	9876543231	charlotte.h@example.com	Jaipur	302001	9876543232	2025-06-20 13:31:21.732684	2025-06-20 13:31:21.732684	Created	t	Pending	charlotte.h@example.com
1	sagar	patil	9876543210	\N	Pune	411001	\N	2025-06-17 11:38:37.890977	2025-06-20 18:10:50.205235	\N	t	Active	\N
\.
--
-- TOC entry 4932 (class 0 OID 33270)
-- Dependencies: 224
-- Data for Name: admin_users; Type: TABLE DATA; Schema: hp; Owner: postgres
--

COPY hp.admin_users (au_admin_id, au_username, au_password_hash, au_email, au_phone, au_is_active, au_created_at, au_updated_at, au_last_login) FROM stdin;
1	admin	$2a$10$wE9K9T.P0Q4u5M.mJ7k.bO/M9J7Y7/k/P0Q4u5M.mJ7k.bO	admin@example.com	1234567890	t	2025-06-20 13:31:21.732684	2025-06-20 13:31:21.732684	2025-06-20 13:31:21.732684
2	user1	$2a$10$wE9K9T.P0Q4u5M.mJ7k.bO/M9J7Y7/k/P0Q4u5M.mJ7k.bO	user1@example.com	0987654321	t	2025-06-20 13:31:21.732684	2025-06-20 13:31:21.732684	2025-06-20 13:31:21.732684
\.
--
-- TOC entry 4934 (class 0 OID 33279)
-- Dependencies: 226
-- Data for Name: documents; Type: TABLE DATA; Schema: hp; Owner: postgres
--

COPY hp.documents (doc_id, doc_name, doc_category, doc_type, doc_size, doc_upload_date, doc_status, doc_icon, doc_color, doc_file_path, doc_file_url, doc_project_id, project_id) FROM stdin;
1	doc1.pdf	Plans	PDF	1.2MB	2025-06-19	Verified	pdf-icon	#FF0000	/path/to/doc1.pdf	http://example.com/doc1.pdf	1	\N
2	image.png	Photos	PNG	0.5MB	2025-06-19	Unverified	img-icon	#00FF00	/path/to/image.png	http://example.com/image.png	1	\N
\.
--
-- TOC entry 4947 (class 0 OID 33402)
-- Dependencies: 239
-- Data for Name: manage_architects; Type: TABLE DATA; Schema: hp; Owner: postgres
--

COPY hp.manage_architects (ar_id, ar_first_name, ar_last_name, ar_phone_number, ar_location, ar_created_at, ar_updated_at, ar_status, ar_is_active) FROM stdin;
1	Anveshan	Patil	1234567890	Pune	2025-06-23 16:53:07.12781	2025-06-23 16:53:07.12781	active	t
2	John	Doe	9876543210	Mumbai	2025-06-23 16:53:07.12781	2025-06-23 16:53:07.12781	active	t
\.
--
-- TOC entry 4936 (class 0 OID 33287)
-- Dependencies: 228
-- Data for Name: project_grid; Type: TABLE DATA; Schema: hp; Owner: postgres
--

COPY hp.project_grid (pg_project_id, pg_last_updated, pg_project_name, pg_supervisor_name, pg_steps_completed, pg_work_completed_percent, pg_payment_due_percent, pg_project_cost, pg_created_date, pg_updated_date, pg_is_active, pg_status, pg_customer_phone, pg_supervisor_id, pg_pin_code, pg_latitude, pg_longitude, pg_project_type, pg_land_area, pg_construction_area, pg_num_floors, pg_num_rooms, pg_num_kitchens, pg_start_date, pg_end_date, pg_bim_file_path, pg_floor_plan_file_path, pg_design_file_path, pg_description, pg_supervisor2_id, pg_supervisor3_id) FROM stdin;
1	2025-06-20 13:31:21.732684	Project Alpha	Supervisor A	5	50.00	25.00	100000.00	2025-06-20 13:31:21.732684	2025-06-20 13:31:21.732684	t	In Progress	9876543210	1	12345	12.345678	78.901234	Residential	1500.000	1200.000	2	4	1	2025-01-01	2025-12-31	/path/to/bim1.ifc	/path/to/floorplan1.pdf	/path/to/design1.dwg	Initial phase completed.	\N	\N
2	2025-06-20 13:31:21.732684	Project Beta	Supervisor B	8	80.00	10.00	250000.00	2025-06-20 13:31:21.732684	2025-06-20 13:31:21.732684	t	Completed	9876543211	2	54321	34.567890	90.123456	Commercial	3000.000	2500.000	5	10	2	2024-06-15	2025-06-15	/path/to/bim2.ifc	/path/to/floorplan2.pdf	/path/to/design2.dwg	Final checks pending.	\N	\N
\.
--
-- TOC entry 4938 (class 0 OID 33300)
-- Dependencies: 230
-- Data for Name: project_milestones; Type: TABLE DATA; Schema: hp; Owner: postgres
--

COPY hp.project_milestones (pm_milestone_id, pm_project_id, pm_milestone_name, pm_target_date, pm_created_date, pm_updated_date, pm_is_active) FROM stdin;
1	1	Foundation Complete	2025-02-28	2025-06-20 13:31:21.732684	2025-06-20 13:31:21.732684	t
2	1	Framing Done	2025-05-31	2025-06-20 13:31:21.732684	2025-06-20 13:31:21.732684	t
3	2	Initial Design Approved	2024-07-31	2025-06-20 13:31:21.732684	2025-06-20 13:31:21.732684	t
\.
--
-- TOC entry 4940 (class 0 OID 33306)
-- Dependencies: 232
-- Data for Name: project_supervisors; Type: TABLE DATA; Schema: hp; Owner: postgres
--

COPY hp.project_supervisors (ps_id, ps_project_id, ps_supervisor_id, ps_otp_verified, ps_created_date, ps_updated_date, ps_is_active) FROM stdin;
1	1	1	t	2025-06-20 13:31:21.732684	2025-06-20 13:31:21.732684	t
2	2	2	t	2025-06-20 13:31:21.732684	2025-06-20 13:31:21.732684	t
\.
--
-- TOC entry 4942 (class 0 OID 33313)
-- Dependencies: 234
-- Data for Name: site_manage; Type: TABLE DATA; Schema: hp; Owner: postgres
--

COPY hp.site_manage (sm_id, sm_project_name, sm_address, sm_start, sm_start_location, sm_last_visit, sm_visit_person_name, sm_visit_location, sm_last_update, sm_created_date, sm_updated_date, sm_action, sm_is_active) FROM stdin;
1	Project Alpha	123 Main St	2025-01-01 09:00:00	Site Office A	2025-06-20 10:00:00	John Doe	Site Office A	Materials Delivered	2025-06-20 13:31:21.732684	2025-06-20 13:31:21.732684	Update	t
2	Project Beta	456 Oak Ave	2024-06-15 08:30:00	Site Office B	2025-06-19 11:30:00	Jane Smith	Site Office B	Inspection Done	2025-06-20 13:31:21.732684	2025-06-20 13:31:21.732684	Update	t
\.
--
-- TOC entry 4944 (class 0 OID 33321)
-- Dependencies: 236
-- Data for Name: tabular_format; Type: TABLE DATA; Schema: hp; Owner: postgres
--

COPY hp.tabular_format (tf_id, tf_cust_name, tf_phone_number, tf_project_name, tf_supervisor, tf_project_cost, tf_payment_due, tf_payment_collected, tf_pay_receive_date, tf_created_date, tf_updated_date, tf_action, tf_is_active) FROM stdin;
1	John Doe	9876553210	Project Alpha	Supervisor A	100000	25000	75000	2025-06-15 00:00:00	2025-06-20 13:31:21.732684	2025-06-20 13:31:21.732684	Paid	t
2	Jane Smith	9876543211	Project Beta	Supervisor B	250000	10000	240000	2025-06-10 00:00:00	2025-06-20 13:31:21.732684	2025-06-20 13:31:21.732684	Paid	t
\.
--
-- TOC entry 4949 (class 0 OID 0)
-- Dependencies: 219
-- Name: add_customers_ac_id_seq; Type: SEQUENCE SET; Schema: hp; Owner: postgres
--

SELECT pg_catalog.setval('hp.add_customers_ac_id_seq', 12, true);

--
-- TOC entry 4950 (class 0 OID 0)
-- Dependencies: 221
-- Name: add_new_project_anp_project_id_seq; Type: SEQUENCE SET; Schema: hp; Owner: postgres
--

SELECT pg_catalog.setval('hp.add_new_project_anp_project_id_seq', 18, true);

--
-- TOC entry 4951 (class 0 OID 0)
-- Dependencies: 223
-- Name: add_supervisors_as_id_seq; Type: SEQUENCE SET; Schema: hp; Owner: postgres
--

SELECT pg_catalog.setval('hp.add_supervisors_as_id_seq', 15, true);

--
-- TOC entry 4952 (class 0 OID 0)
-- Dependencies: 225
-- Name: admin_users_au_admin_id_seq; Type: SEQUENCE SET; Schema: hp; Owner: postgres
--

SELECT pg_catalog.setval('hp.admin_users_au_admin_id_seq', 2, true);

--
-- TOC entry 4964 (class 0 OID 0)
-- Dependencies: 227
-- Name: documents_doc_id_seq; Type: SEQUENCE SET; Schema: hp; Owner: postgres
--

SELECT pg_catalog.setval('hp.documents_doc_id_seq', 2, true);

--
-- TOC entry 4965 (class 0 OID 0)
-- Dependencies: 238
-- Name: manage_architects_ar_id_seq; Type: SEQUENCE SET; Schema: hp; Owner: postgres
--

SELECT pg_catalog.setval('hp.manage_architects_ar_id_seq', 2, true);

--
-- TOC entry 4966 (class 0 OID 0)
-- Dependencies: 229
-- Name: project_grid_pg_project_id_seq; Type: SEQUENCE SET; Schema: hp; Owner: postgres
--

SELECT pg_catalog.setval('hp.project_grid_pg_project_id_seq', 2, true);

--
-- TOC entry 4967 (class 0 OID 0)
-- Dependencies: 231
-- Name: project_milestones_pm_milestone_id_seq; Type: SEQUENCE SET; Schema: hp; Owner: postgres
--

SELECT pg_catalog.setval('hp.project_milestones_pm_milestone_id_seq', 3, true);

--
-- TOC entry 4968 (class 0 OID 0)
-- Dependencies: 233
-- Name: project_supervisors_ps_id_seq; Type: SEQUENCE SET; Schema: hp; Owner: postgres
--

SELECT pg_catalog.setval('hp.project_supervisors_ps_id_seq', 2, true);

--
-- TOC entry 4969 (class 0 OID 0)
-- Dependencies: 235
-- Name: site_manage_sm_id_seq; Type: SEQUENCE SET; Schema: hp; Owner: postgres
--

SELECT pg_catalog.setval('hp.site_manage_sm_id_seq', 2, true);

--
-- TOC entry 4970 (class 0 OID 0)
-- Dependencies: 237
-- Name: tabular_format_tf_id_seq; Type: SEQUENCE SET; Schema: hp; Owner: postgres
--

SELECT pg_catalog.setval('hp.tabular_format_tf_id_seq', 2, true);

--
-- TOC entry 4733 (class 2606 OID 33338)
-- Name: add_customers add_customers_ac_phone_number_key; Type: CONSTRAINT; Schema: hp; Owner: postgres
--

ALTER TABLE ONLY hp.add_customers
    ADD CONSTRAINT add_customers_ac_phone_number_key UNIQUE (ac_phone_number);

--
-- TOC entry 4735 (class 2606 OID 33340)
-- Name: add_customers add_customers_pkey; Type: CONSTRAINT; Schema: hp; Owner: postgres
--

ALTER TABLE ONLY hp.add_customers
    ADD CONSTRAINT add_customers_pkey PRIMARY KEY (ac_id);

--
-- TOC entry 4737 (class 2606 OID 33342)
-- Name: add_new_project add_new_project_anp_project_name_key; Type: CONSTRAINT; Schema: hp; Owner: postgres
--

ALTER TABLE ONLY hp.add_new_project
    ADD CONSTRAINT add_new_project_anp_project_name_key UNIQUE (anp_project_name);

--
-- TOC entry 4739 (class 2606 OID 33344)
-- Name: add_new_project add_new_project_pkey; Type: CONSTRAINT; Schema: hp; Owner: postgres
--

ALTER TABLE ONLY hp.add_new_project
    ADD CONSTRAINT add_new_project_pkey PRIMARY KEY (anp_project_id);

--
-- TOC entry 4741 (class 2606 OID 33346)
-- Name: add_supervisors add_supervisors_as_email_id_key; Type: CONSTRAINT; Schema: hp; Owner: postgres
--

ALTER TABLE ONLY hp.add_supervisors
    ADD CONSTRAINT add_supervisors_as_email_id_key UNIQUE (as_email_id);

--
-- TOC entry 4743 (class 2606 OID 33348)
-- Name: add_supervisors add_supervisors_as_phone_number_key; Type: CONSTRAINT; Schema: hp; Owner: postgres
--

ALTER TABLE ONLY hp.add_supervisors
    ADD CONSTRAINT add_supervisors_as_phone_number_key UNIQUE (as_phone_number);

--
-- TOC entry 4745 (class 2606 OID 33350)
-- Name: add_supervisors add_supervisors_pkey; Type: CONSTRAINT; Schema: hp; Owner: postgres
--

ALTER TABLE ONLY hp.add_supervisors
    ADD CONSTRAINT add_supervisors_pkey PRIMARY KEY (as_id);

--
-- TOC entry 4747 (class 2606 OID 33352)
-- Name: admin_users admin_users_au_email_key; Type: CONSTRAINT; Schema: hp; Owner: postgres
--

ALTER TABLE ONLY hp.admin_users
    ADD CONSTRAINT admin_users_au_email_key UNIQUE (au_email);

--
-- TOC entry 4749 (class 2606 OID 33354)
-- Name: admin_users admin_users_au_phone_key; Type: CONSTRAINT; Schema: hp; Owner: postgres
--

ALTER TABLE ONLY hp.admin_users
    ADD CONSTRAINT admin_users_au_phone_key UNIQUE (au_phone);

--
-- TOC entry 4751 (class 2606 OID 33356)
-- Name: admin_users admin_users_au_username_key; Type: CONSTRAINT; Schema: hp; Owner: postgres
--

ALTER TABLE ONLY hp.admin_users
    ADD CONSTRAINT admin_users_au_username_key UNIQUE (au_username);

--
-- TOC entry 4753 (class 2606 OID 33358)
-- Name: admin_users admin_users_pkey; Type: CONSTRAINT; Schema: hp; Owner: postgres
--

ALTER TABLE ONLY hp.admin_users
    ADD CONSTRAINT admin_users_pkey PRIMARY KEY (au_admin_id);

--
-- TOC entry 4755 (class 2606 OID 33360)
-- Name: documents documents_doc_file_path_key; Type: CONSTRAINT; Schema: hp; Owner: postgres
--

ALTER TABLE ONLY hp.documents
    ADD CONSTRAINT documents_doc_file_path_key UNIQUE (doc_file_path);

--
-- TOC entry 4757 (class 2606 OID 33362)
-- Name: documents documents_doc_file_url_key; Type: CONSTRAINT; Schema: hp; Owner: postgres
--

ALTER TABLE ONLY hp.documents
    ADD CONSTRAINT documents_doc_file_url_key UNIQUE (doc_file_url);

--
-- TOC entry 4759 (class 2606 OID 33364)
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: hp; Owner: postgres
--

ALTER TABLE ONLY hp.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (doc_id);

--
-- TOC entry 4761 (class 2606 OID 33409)
-- Name: manage_architects manage_architects_ar_phone_number_key; Type: CONSTRAINT; Schema: hp; Owner: postgres
--

ALTER TABLE ONLY hp.manage_architects
    ADD CONSTRAINT manage_architects_ar_phone_number_key UNIQUE (ar_phone_number);

--
-- TOC entry 4763 (class 2606 OID 33407)
-- Name: manage_architects manage_architects_pkey; Type: CONSTRAINT; Schema: hp; Owner: postgres
--

ALTER TABLE ONLY hp.manage_architects
    ADD CONSTRAINT manage_architects_pkey PRIMARY KEY (ar_id);

--
-- TOC entry 4765 (class 2606 OID 33366)
-- Name: project_grid project_grid_pg_project_name_key; Type: CONSTRAINT; Schema: hp; Owner: postgres
--

ALTER TABLE ONLY hp.project_grid
    ADD CONSTRAINT project_grid_pg_project_name_key UNIQUE (pg_project_name);

--
-- TOC entry 4767 (class 2606 OID 33368)
-- Name: project_grid project_grid_pkey; Type: CONSTRAINT; Schema: hp; Owner: postgres
--

ALTER TABLE ONLY hp.project_grid
    ADD CONSTRAINT project_grid_pkey PRIMARY KEY (pg_project_id);

--
-- TOC entry 4769 (class 2606 OID 33370)
-- Name: project_milestones project_milestones_pkey; Type: CONSTRAINT; Schema: hp; Owner: postgres
--

ALTER TABLE ONLY hp.project_milestones
    ADD CONSTRAINT project_milestones_pkey PRIMARY KEY (pm_milestone_id);

--
-- TOC entry 4771 (class 2606 OID 33372)
-- Name: project_supervisors project_supervisors_pkey; Type: CONSTRAINT; Schema: hp; Owner: postgres
--

ALTER TABLE ONLY hp.project_supervisors
    ADD CONSTRAINT project_supervisors_pkey PRIMARY KEY (ps_id);

--
-- TOC entry 4773 (class 2606 OID 33374)
-- Name: site_manage site_manage_pkey; Type: CONSTRAINT; Schema: hp; Owner: postgres
--

ALTER TABLE ONLY hp.site_manage
    ADD CONSTRAINT site_manage_pkey PRIMARY KEY (sm_id);

--
-- TOC entry 4775 (class 2606 OID 33376)
-- Name: tabular_format tabular_format_pkey; Type: CONSTRAINT; Schema: hp; Owner: postgres
--

ALTER TABLE ONLY hp.tabular_format
    ADD CONSTRAINT tabular_format_pkey PRIMARY KEY (tf_id);

--
-- TOC entry 4776 (class 2606 OID 33377)
-- Name: project_grid fk_pg_customer_phone; Type: FK CONSTRAINT; Schema: hp; Owner: postgres
--

ALTER TABLE ONLY hp.project_grid
    ADD CONSTRAINT fk_pg_customer_phone FOREIGN KEY (pg_customer_phone) REFERENCES hp.add_customers(ac_phone_number);


--
-- TOC entry 4777 (class 2606 OID 33380)
-- Name: project_grid fk_pg_supervisor_id; Type: FK CONSTRAINT; Schema: hp; Owner: postgres
--

ALTER TABLE ONLY hp.project_grid
    ADD CONSTRAINT fk_pg_supervisor_id FOREIGN KEY (pg_supervisor_id) REFERENCES hp.add_supervisors(as_id);


--
-- TOC entry 4778 (class 2606 OID 33385)
-- Name: project_milestones project_milestones_pm_project_id_fkey; Type: FK CONSTRAINT; Schema: hp; Owner: postgres
--

ALTER TABLE ONLY hp.project_milestones
    ADD CONSTRAINT project_milestones_pm_project_id_fkey FOREIGN KEY (pm_project_id) REFERENCES hp.add_new_project(anp_project_id);


--
-- TOC entry 4779 (class 2606 OID 33390)
-- Name: project_supervisors project_supervisors_ps_project_id_fkey; Type: FK CONSTRAINT; Schema: hp; Owner: postgres
--

ALTER TABLE ONLY hp.project_supervisors
    ADD CONSTRAINT project_supervisors_ps_project_id_fkey FOREIGN KEY (ps_project_id) REFERENCES hp.add_new_project(anp_project_id);


--
-- TOC entry 4780 (class 2606 OID 33395)
-- Name: documents documents_doc_project_id_fkey; Type: FK CONSTRAINT; Schema: hp; Owner: postgres
--

ALTER TABLE ONLY hp.documents
    ADD CONSTRAINT documents_doc_project_id_fkey FOREIGN KEY (doc_project_id) REFERENCES hp.add_new_project(anp_project_id);


--
-- TOC entry 4781 (class 2606 OID 33398)
-- Name: project_supervisors project_supervisors_ps_supervisor_id_fkey; Type: FK CONSTRAINT; Schema: hp; Owner: postgres
--

ALTER TABLE ONLY hp.project_supervisors
    ADD CONSTRAINT project_supervisors_ps_supervisor_id_fkey FOREIGN KEY (ps_supervisor_id) REFERENCES hp.add_supervisors(as_id);


-- PostgreSQL database dump complete
--