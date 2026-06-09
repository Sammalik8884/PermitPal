-- ============================================================
-- PermitPal — Short-Term Rental Compliance SaaS
-- MySQL 8.0 Database Schema
-- Markets: US (500+ cities) · EU (27 member states) · Australia (state + council)
-- Architecture: Shared DB + organisation_id tenant isolation (TenantMiddleware.cs)
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;
SET sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO';

-- ============================================================
-- DOMAIN 1: TENANCY & ORGANISATIONS
-- ============================================================

CREATE TABLE organisations (
    id                  CHAR(36)     NOT NULL DEFAULT (UUID()),
    name                VARCHAR(255) NOT NULL,
    slug                VARCHAR(100) NOT NULL,
    country             CHAR(2)      NOT NULL,               -- 'US','GB','AU','FR','ES', etc.
    timezone            VARCHAR(100) NOT NULL,
    email               VARCHAR(255) NOT NULL,
    phone               VARCHAR(30),
    subscription_plan   ENUM('solo','host','operator','manager') NOT NULL DEFAULT 'solo',
    subscription_status ENUM('trialing','active','past_due','cancelled') NOT NULL DEFAULT 'trialing',
    trial_ends_at       DATETIME,
    stripe_customer_id  VARCHAR(100),
    stripe_subscription_id VARCHAR(100),
    max_properties      INT NOT NULL DEFAULT 1,              -- enforced by plan
    max_team_seats      INT NOT NULL DEFAULT 1,
    created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_org_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- DOMAIN 2: USERS & TEAM
-- ============================================================

CREATE TABLE users (
    id                  CHAR(36)     NOT NULL DEFAULT (UUID()),
    organisation_id     CHAR(36)     NOT NULL,
    email               VARCHAR(255) NOT NULL,
    password_hash       VARCHAR(255) NOT NULL,
    first_name          VARCHAR(100) NOT NULL,
    last_name           VARCHAR(100) NOT NULL,
    role                ENUM('owner','admin','viewer') NOT NULL DEFAULT 'owner',
    is_active           TINYINT(1)   NOT NULL DEFAULT 1,
    mfa_enabled         TINYINT(1)   NOT NULL DEFAULT 0,
    mfa_secret          VARCHAR(255),                        -- TOTP secret encrypted at rest
    last_login_at       DATETIME,
    reset_token         VARCHAR(255),
    reset_token_expires DATETIME,
    created_at          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_users_org_email (organisation_id, email),
    CONSTRAINT fk_users_org FOREIGN KEY (organisation_id) REFERENCES organisations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- DOMAIN 3: JURISDICTION RULES DATABASE
-- This is the core data moat — city/state/country rule sets
-- Maintained by PermitPal regulatory data team
-- ============================================================

CREATE TABLE countries (
    code            CHAR(2)      NOT NULL,                   -- ISO 3166-1 alpha-2
    name            VARCHAR(100) NOT NULL,
    currency        CHAR(3)      NOT NULL,
    str_legal_status ENUM('legal','restricted','banned','varies') NOT NULL DEFAULT 'varies',
    national_framework_url VARCHAR(500),                     -- EU: EUR-Lex 2024/1028 link
    notes           TEXT,
    updated_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE states_regions (
    id              CHAR(36)     NOT NULL DEFAULT (UUID()),
    country_code    CHAR(2)      NOT NULL,
    name            VARCHAR(100) NOT NULL,
    code            VARCHAR(10),                             -- e.g. 'NSW', 'CA', 'FR-75'
    has_state_registration TINYINT(1) DEFAULT 0,
    registration_url VARCHAR(500),
    registration_fee_cents INT,
    registration_renewal_fee_cents INT,
    registration_validity_months INT,
    night_cap_default INT,                                   -- NULL = no state cap
    night_cap_hosted INT,                                    -- hosted (owner present) cap
    levy_pct        DECIMAL(5,2),                            -- e.g. 7.50 for Victoria
    levy_authority  VARCHAR(200),
    levy_report_url VARCHAR(500),
    notes           TEXT,
    updated_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_sr_country FOREIGN KEY (country_code) REFERENCES countries(code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE jurisdictions (
    id                       CHAR(36)     NOT NULL DEFAULT (UUID()),
    country_code             CHAR(2)      NOT NULL,
    state_region_id          CHAR(36),
    name                     VARCHAR(200) NOT NULL,           -- 'City of Sydney', 'Paris 1st Arr'
    slug                     VARCHAR(200) NOT NULL,           -- 'sydney-nsw-au', 'paris-fr'
    jurisdiction_type        ENUM('city','county','district','borough','commune','shire','lga') NOT NULL,
    -- Permit requirements
    permit_required          TINYINT(1)   NOT NULL DEFAULT 0,
    permit_type              VARCHAR(200),                    -- 'STR License', 'Home-Sharing Permit'
    permit_description       TEXT,
    permit_fee_cents         INT,
    permit_renewal_fee_cents INT,
    permit_validity_months   INT DEFAULT 12,
    permit_portal_url        VARCHAR(500),
    permit_number_in_listing TINYINT(1)   DEFAULT 0,         -- must display in ad?
    -- Night caps
    night_cap_unhosted       INT,                            -- NULL = no cap
    night_cap_hosted         INT,
    night_cap_notes          TEXT,
    -- Primary residency
    primary_residence_required TINYINT(1) DEFAULT 0,
    primary_residence_days   INT,                            -- e.g. 275 for San Francisco
    -- Zoning
    zoning_restrictions      TINYINT(1)   DEFAULT 0,
    zoning_notes             TEXT,
    -- Taxes
    tot_rate_pct             DECIMAL(5,2),                   -- Transient Occupancy Tax %
    tot_name                 VARCHAR(100),                   -- 'TOT', 'Hotel Tax', 'TDT'
    tot_platform_collects    TINYINT(1)   DEFAULT 1,         -- Airbnb remits automatically?
    tot_self_remit_required  TINYINT(1)   DEFAULT 0,         -- host must remit for direct bookings
    tot_filing_url           VARCHAR(500),
    additional_taxes         JSON,                           -- [{name, rate, platform_collects}]
    -- EU specific
    eu_registration_scheme   VARCHAR(100),                   -- 'Déclaratrion', 'NRU', 'BRP'
    eu_registration_url      VARCHAR(500),
    eu_data_sharing_active   TINYINT(1)   DEFAULT 0,         -- platforms share data with authority
    -- AU specific
    au_stra_register_required TINYINT(1)  DEFAULT 0,
    au_fire_safety_standard  VARCHAR(50),                    -- 'AS3786', 'QLD2027'
    au_contact_person_required TINYINT(1) DEFAULT 0,         -- Brisbane: 24/7 contact
    au_complaint_response_minutes INT,                       -- Brisbane: 60 min
    -- Enforcement
    fine_min_cents           INT,
    fine_max_cents           INT,
    fine_currency            CHAR(3)      DEFAULT 'USD',
    fine_notes               TEXT,
    enforcement_level        ENUM('low','medium','high','very_high') DEFAULT 'medium',
    -- Status
    is_active                TINYINT(1)   NOT NULL DEFAULT 1,
    last_verified_at         DATE,
    next_review_date         DATE,
    verified_by              VARCHAR(100),
    source_urls              JSON,                           -- array of source URLs
    created_at               DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at               DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_jurisdiction_slug (slug),
    KEY idx_jur_country (country_code),
    KEY idx_jur_state (state_region_id),
    FULLTEXT KEY ft_jur_name (name),
    CONSTRAINT fk_jur_country FOREIGN KEY (country_code) REFERENCES countries(code),
    CONSTRAINT fk_jur_state   FOREIGN KEY (state_region_id) REFERENCES states_regions(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE jurisdiction_postcodes (
    postcode        VARCHAR(20)  NOT NULL,
    country_code    CHAR(2)      NOT NULL,
    jurisdiction_id CHAR(36)     NOT NULL,
    is_primary      TINYINT(1)   NOT NULL DEFAULT 1,         -- one postcode → one primary jurisdiction
    PRIMARY KEY (postcode, country_code),
    KEY idx_jp_jur (jurisdiction_id),
    CONSTRAINT fk_jp_jur     FOREIGN KEY (jurisdiction_id) REFERENCES jurisdictions(id) ON DELETE CASCADE,
    CONSTRAINT fk_jp_country FOREIGN KEY (country_code)    REFERENCES countries(code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Regulatory change log — tracked by monitoring job
CREATE TABLE regulatory_changes (
    id              CHAR(36)     NOT NULL DEFAULT (UUID()),
    jurisdiction_id CHAR(36)     NOT NULL,
    change_type     ENUM('permit_fee','night_cap','new_permit','permit_removed',
                         'tot_rate','zoning','enforcement','other') NOT NULL,
    change_summary  TEXT         NOT NULL,
    old_value       VARCHAR(500),
    new_value       VARCHAR(500),
    effective_date  DATE,
    source_url      VARCHAR(500),
    ai_summary      TEXT,                                    -- Claude-generated plain English summary
    severity        ENUM('info','warning','critical') NOT NULL DEFAULT 'warning',
    created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_rc_jur FOREIGN KEY (jurisdiction_id) REFERENCES jurisdictions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- DOMAIN 4: PROPERTIES
-- ============================================================

CREATE TABLE properties (
    id                  CHAR(36)     NOT NULL DEFAULT (UUID()),
    organisation_id     CHAR(36)     NOT NULL,
    name                VARCHAR(255) NOT NULL,               -- friendly name: 'Beach Cottage'
    address_line1       VARCHAR(255) NOT NULL,
    address_line2       VARCHAR(255),
    city                VARCHAR(100) NOT NULL,
    state_region        VARCHAR(100),
    postcode            VARCHAR(20)  NOT NULL,
    country_code        CHAR(2)      NOT NULL,
    lat                 DECIMAL(10,7),
    lng                 DECIMAL(10,7),
    jurisdiction_id     CHAR(36),                            -- resolved from postcode
    property_type       ENUM('entire_home','private_room','shared_room','apartment',
                             'house','villa','cabin','other') NOT NULL DEFAULT 'entire_home',
    is_primary_residence TINYINT(1)  NOT NULL DEFAULT 0,
    owner_occupied      TINYINT(1)   NOT NULL DEFAULT 0,
    hosted_type         ENUM('hosted','unhosted') NOT NULL DEFAULT 'unhosted',
    -- Platform listings
    airbnb_listing_id   VARCHAR(50),
    airbnb_listing_url  VARCHAR(500),
    vrbo_listing_id     VARCHAR(50),
    booking_listing_id  VARCHAR(50),
    -- Current compliance score (cached, recalculated nightly)
    compliance_score    TINYINT UNSIGNED DEFAULT NULL,       -- 0–100
    compliance_status   ENUM('compliant','warning','non_compliant','unknown') DEFAULT 'unknown',
    score_calculated_at DATETIME,
    is_active           TINYINT(1)   NOT NULL DEFAULT 1,
    notes               TEXT,
    created_at          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_prop_org  (organisation_id),
    KEY idx_prop_jur  (jurisdiction_id),
    KEY idx_prop_post (postcode, country_code),
    CONSTRAINT fk_prop_org FOREIGN KEY (organisation_id) REFERENCES organisations(id) ON DELETE CASCADE,
    CONSTRAINT fk_prop_jur FOREIGN KEY (jurisdiction_id) REFERENCES jurisdictions(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- DOMAIN 5: PERMITS & REGISTRATIONS
-- ============================================================

CREATE TABLE permits (
    id                  CHAR(36)     NOT NULL DEFAULT (UUID()),
    organisation_id     CHAR(36)     NOT NULL,
    property_id         CHAR(36)     NOT NULL,
    jurisdiction_id     CHAR(36),
    permit_type         VARCHAR(200) NOT NULL,               -- 'STR Business License', 'STRA Registration'
    permit_number       VARCHAR(200),                        -- the actual license number
    status              ENUM('active','expired','pending','cancelled','not_required') NOT NULL DEFAULT 'pending',
    issuing_authority   VARCHAR(200),
    issued_date         DATE,
    expiry_date         DATE,
    renewal_fee_cents   INT,
    renewal_url         VARCHAR(500),
    auto_renewed        TINYINT(1)   DEFAULT 0,
    display_in_listing  TINYINT(1)   DEFAULT 0,              -- must show in Airbnb ad?
    -- EU specific
    eu_registration_number VARCHAR(200),                     -- France Déclaratrion, Spain NRU
    eu_registration_country CHAR(2),
    eu_registration_valid TINYINT(1) DEFAULT NULL,           -- validated against national registry
    eu_registration_checked_at DATETIME,
    -- Alerts sent
    alerted_90d         TINYINT(1)   DEFAULT 0,
    alerted_30d         TINYINT(1)   DEFAULT 0,
    alerted_7d          TINYINT(1)   DEFAULT 0,
    alerted_expired     TINYINT(1)   DEFAULT 0,
    notes               TEXT,
    created_at          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_permits_org      (organisation_id),
    KEY idx_permits_property (property_id),
    KEY idx_permits_expiry   (expiry_date),
    CONSTRAINT fk_permits_org  FOREIGN KEY (organisation_id) REFERENCES organisations(id) ON DELETE CASCADE,
    CONSTRAINT fk_permits_prop FOREIGN KEY (property_id)     REFERENCES properties(id)     ON DELETE CASCADE,
    CONSTRAINT fk_permits_jur  FOREIGN KEY (jurisdiction_id) REFERENCES jurisdictions(id)  ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- DOMAIN 6: NIGHT CAP TRACKING
-- ============================================================

CREATE TABLE night_cap_records (
    id                  CHAR(36)     NOT NULL DEFAULT (UUID()),
    organisation_id     CHAR(36)     NOT NULL,
    property_id         CHAR(36)     NOT NULL,
    calendar_year       SMALLINT     NOT NULL,               -- e.g. 2025
    cap_limit           INT,                                 -- NULL = no cap
    nights_used         INT          NOT NULL DEFAULT 0,
    nights_remaining    INT GENERATED ALWAYS AS (
                            CASE WHEN cap_limit IS NULL THEN NULL
                            ELSE GREATEST(0, cap_limit - nights_used) END
                        ) STORED,
    pct_used            DECIMAL(5,2) GENERATED ALWAYS AS (
                            CASE WHEN cap_limit IS NULL OR cap_limit = 0 THEN NULL
                            ELSE ROUND((nights_used / cap_limit) * 100, 2) END
                        ) STORED,
    alerted_80pct       TINYINT(1)   DEFAULT 0,
    alerted_90pct       TINYINT(1)   DEFAULT 0,
    alerted_100pct      TINYINT(1)   DEFAULT 0,
    last_synced_at      DATETIME,
    created_at          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_ncr_prop_year (property_id, calendar_year),
    CONSTRAINT fk_ncr_org  FOREIGN KEY (organisation_id) REFERENCES organisations(id) ON DELETE CASCADE,
    CONSTRAINT fk_ncr_prop FOREIGN KEY (property_id)     REFERENCES properties(id)     ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE booked_nights (
    id              CHAR(36)    NOT NULL DEFAULT (UUID()),
    organisation_id CHAR(36)    NOT NULL,
    property_id     CHAR(36)    NOT NULL,
    night_date      DATE        NOT NULL,                    -- each night counted separately
    source          ENUM('airbnb','vrbo','booking','direct','manual') NOT NULL,
    booking_ref     VARCHAR(100),
    ical_uid        VARCHAR(500),                            -- from iCal VEVENT UID
    guest_count     TINYINT,
    created_at      DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_bn_prop_night_source (property_id, night_date, source),
    KEY idx_bn_org  (organisation_id),
    KEY idx_bn_prop_date (property_id, night_date),
    CONSTRAINT fk_bn_org  FOREIGN KEY (organisation_id) REFERENCES organisations(id) ON DELETE CASCADE,
    CONSTRAINT fk_bn_prop FOREIGN KEY (property_id)     REFERENCES properties(id)     ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE ical_feeds (
    id              CHAR(36)     NOT NULL DEFAULT (UUID()),
    organisation_id CHAR(36)     NOT NULL,
    property_id     CHAR(36)     NOT NULL,
    platform        ENUM('airbnb','vrbo','booking','direct','other') NOT NULL,
    ical_url        VARCHAR(1000) NOT NULL,
    last_synced_at  DATETIME,
    last_sync_status ENUM('success','failed','pending') DEFAULT 'pending',
    last_sync_error TEXT,
    nights_imported INT          NOT NULL DEFAULT 0,
    is_active       TINYINT(1)   NOT NULL DEFAULT 1,
    created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_ical_org  FOREIGN KEY (organisation_id) REFERENCES organisations(id) ON DELETE CASCADE,
    CONSTRAINT fk_ical_prop FOREIGN KEY (property_id)     REFERENCES properties(id)     ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- DOMAIN 7: DOCUMENTS
-- ============================================================

CREATE TABLE documents (
    id                  CHAR(36)     NOT NULL DEFAULT (UUID()),
    organisation_id     CHAR(36)     NOT NULL,
    property_id         CHAR(36),
    permit_id           CHAR(36),
    document_type       ENUM('permit','registration','insurance','fire_cert',
                             'safety_inspection','tax_cert','other') NOT NULL,
    name                VARCHAR(255) NOT NULL,
    file_url            VARCHAR(1000) NOT NULL,              -- R2 pre-signed or permanent URL
    file_size_bytes     INT,
    mime_type           VARCHAR(100),
    expiry_date         DATE,                                -- cert expiry if applicable
    alerted_expiry      TINYINT(1)   DEFAULT 0,
    uploaded_by_user_id CHAR(36),
    created_at          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_docs_org  (organisation_id),
    KEY idx_docs_prop (property_id),
    CONSTRAINT fk_docs_org  FOREIGN KEY (organisation_id) REFERENCES organisations(id) ON DELETE CASCADE,
    CONSTRAINT fk_docs_prop FOREIGN KEY (property_id)     REFERENCES properties(id)     ON DELETE SET NULL,
    CONSTRAINT fk_docs_perm FOREIGN KEY (permit_id)       REFERENCES permits(id)        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- DOMAIN 8: ALERTS & NOTIFICATIONS
-- ============================================================

CREATE TABLE alert_subscriptions (
    id              CHAR(36)    NOT NULL DEFAULT (UUID()),
    organisation_id CHAR(36)    NOT NULL,
    user_id         CHAR(36)    NOT NULL,
    jurisdiction_id CHAR(36),                               -- NULL = all org jurisdictions
    property_id     CHAR(36),
    alert_type      ENUM('permit_expiry','night_cap','regulatory_change',
                         'eu_registration','levy_due','all') NOT NULL DEFAULT 'all',
    channel         SET('email','sms','push')  NOT NULL DEFAULT 'email',
    is_active       TINYINT(1)  NOT NULL DEFAULT 1,
    created_at      DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_as_org  FOREIGN KEY (organisation_id) REFERENCES organisations(id) ON DELETE CASCADE,
    CONSTRAINT fk_as_user FOREIGN KEY (user_id)         REFERENCES users(id)         ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE notification_log (
    id                  CHAR(36)    NOT NULL DEFAULT (UUID()),
    organisation_id     CHAR(36)    NOT NULL,
    user_id             CHAR(36),
    property_id         CHAR(36),
    permit_id           CHAR(36),
    alert_type          VARCHAR(50) NOT NULL,
    channel             ENUM('email','sms','push') NOT NULL,
    recipient           VARCHAR(255) NOT NULL,
    subject             VARCHAR(255),
    body                TEXT        NOT NULL,
    status              ENUM('queued','sent','delivered','failed') NOT NULL DEFAULT 'queued',
    provider_message_id VARCHAR(255),
    sent_at             DATETIME,
    error_message       TEXT,
    created_at          DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_nl_org  (organisation_id),
    KEY idx_nl_prop (property_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Regulatory change alerts (broadcast to affected users)
CREATE TABLE regulatory_alert_log (
    id                  CHAR(36)    NOT NULL DEFAULT (UUID()),
    regulatory_change_id CHAR(36)   NOT NULL,
    organisation_id     CHAR(36)    NOT NULL,
    user_id             CHAR(36)    NOT NULL,
    sent_at             DATETIME,
    channel             ENUM('email','sms') NOT NULL DEFAULT 'email',
    read_at             DATETIME,
    PRIMARY KEY (id),
    CONSTRAINT fk_ral_change FOREIGN KEY (regulatory_change_id) REFERENCES regulatory_changes(id),
    CONSTRAINT fk_ral_org    FOREIGN KEY (organisation_id)      REFERENCES organisations(id)   ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- DOMAIN 9: EU COMPLIANCE WIZARDS
-- ============================================================

CREATE TABLE eu_registration_progress (
    id                  CHAR(36)    NOT NULL DEFAULT (UUID()),
    organisation_id     CHAR(36)    NOT NULL,
    property_id         CHAR(36)    NOT NULL,
    country_code        CHAR(2)     NOT NULL,
    scheme_name         VARCHAR(100) NOT NULL,               -- 'Déclaratrion', 'NRU', 'BRP', 'CIR'
    current_step        TINYINT     NOT NULL DEFAULT 1,
    total_steps         TINYINT     NOT NULL,
    steps_data          JSON,                                -- answers per step stored as JSON
    registration_number VARCHAR(200),                        -- filled when complete
    registration_status ENUM('not_started','in_progress','submitted','active','invalid','expired') DEFAULT 'not_started',
    submitted_at        DATETIME,
    expiry_date         DATE,
    portal_url          VARCHAR(500),
    notes               TEXT,
    created_at          DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_erp_org  FOREIGN KEY (organisation_id) REFERENCES organisations(id) ON DELETE CASCADE,
    CONSTRAINT fk_erp_prop FOREIGN KEY (property_id)     REFERENCES properties(id)     ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- DOMAIN 10: AUSTRALIA SPECIFIC
-- ============================================================

CREATE TABLE au_levy_records (
    id                  CHAR(36)     NOT NULL DEFAULT (UUID()),
    organisation_id     CHAR(36)     NOT NULL,
    property_id         CHAR(36)     NOT NULL,
    state_code          VARCHAR(10)  NOT NULL,               -- 'VIC', 'ACT'
    quarter             TINYINT      NOT NULL,               -- 1, 2, 3, 4
    calendar_year       SMALLINT     NOT NULL,
    total_bookings_cents INT         NOT NULL DEFAULT 0,     -- total booking value subject to levy
    levy_rate_pct       DECIMAL(5,2) NOT NULL,               -- 7.50 for Victoria
    levy_amount_cents   INT          NOT NULL DEFAULT 0,     -- calculated levy
    platform_collected_cents INT     NOT NULL DEFAULT 0,     -- Airbnb collected this
    self_remit_cents    INT GENERATED ALWAYS AS (
                            GREATEST(0, levy_amount_cents - platform_collected_cents)
                        ) STORED,
    report_generated_at DATETIME,
    lodged_at           DATETIME,
    lodgement_reference VARCHAR(100),
    status              ENUM('calculating','ready','lodged','overdue') DEFAULT 'calculating',
    created_at          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_levy_prop_quarter (property_id, state_code, quarter, calendar_year),
    CONSTRAINT fk_lev_org  FOREIGN KEY (organisation_id) REFERENCES organisations(id) ON DELETE CASCADE,
    CONSTRAINT fk_lev_prop FOREIGN KEY (property_id)     REFERENCES properties(id)     ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE au_fire_safety_records (
    id                  CHAR(36)    NOT NULL DEFAULT (UUID()),
    organisation_id     CHAR(36)    NOT NULL,
    property_id         CHAR(36)    NOT NULL,
    state_code          VARCHAR(10) NOT NULL,
    -- Smoke alarms
    smoke_alarms_installed     TINYINT(1) DEFAULT 0,
    smoke_alarm_standard       VARCHAR(50) DEFAULT 'AS3786',
    smoke_alarm_test_date      DATE,
    smoke_alarm_expiry_date    DATE,
    interconnected             TINYINT(1) DEFAULT 0,         -- QLD mandatory from 2027
    photoelectric              TINYINT(1) DEFAULT 0,
    -- Fire equipment
    fire_extinguisher          TINYINT(1) DEFAULT 0,
    fire_extinguisher_type     VARCHAR(50) DEFAULT '2.5kg ABE',
    fire_extinguisher_test_date DATE,
    fire_blanket               TINYINT(1) DEFAULT 0,
    -- Evacuation
    evacuation_diagram         TINYINT(1) DEFAULT 0,
    evacuation_diagram_location VARCHAR(200),
    -- Records
    last_inspection_date       DATE,
    inspection_certificate_url VARCHAR(1000),
    next_inspection_due        DATE,
    notes                      TEXT,
    created_at                 DATETIME   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at                 DATETIME   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_fsr_org  FOREIGN KEY (organisation_id) REFERENCES organisations(id) ON DELETE CASCADE,
    CONSTRAINT fk_fsr_prop FOREIGN KEY (property_id)     REFERENCES properties(id)     ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE au_complaint_log (
    id                  CHAR(36)    NOT NULL DEFAULT (UUID()),
    organisation_id     CHAR(36)    NOT NULL,
    property_id         CHAR(36)    NOT NULL,
    complaint_received_at DATETIME  NOT NULL,
    complaint_source    ENUM('neighbour','council','platform','other') NOT NULL DEFAULT 'neighbour',
    complaint_description TEXT,
    -- Brisbane requirements
    response_required_by DATETIME,                          -- complaint_received_at + 60 min
    responded_at        DATETIME,
    response_notes      TEXT,
    resolved_by         DATETIME,                           -- complaint_received_at + 24 hrs
    resolved_at         DATETIME,
    resolution_notes    TEXT,
    council_report_due  DATETIME,                           -- 24h after response
    council_report_sent DATETIME,
    status              ENUM('open','responded','resolved','escalated') DEFAULT 'open',
    created_at          DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_cl_org  FOREIGN KEY (organisation_id) REFERENCES organisations(id) ON DELETE CASCADE,
    CONSTRAINT fk_cl_prop FOREIGN KEY (property_id)     REFERENCES properties(id)     ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- DOMAIN 11: US TAX TRACKING
-- ============================================================

CREATE TABLE us_tax_records (
    id                  CHAR(36)     NOT NULL DEFAULT (UUID()),
    organisation_id     CHAR(36)     NOT NULL,
    property_id         CHAR(36)     NOT NULL,
    jurisdiction_id     CHAR(36)     NOT NULL,
    tax_period_start    DATE         NOT NULL,
    tax_period_end      DATE         NOT NULL,
    tax_type            ENUM('tot','sales_tax','county_occupancy','city_tax','other') NOT NULL,
    total_revenue_cents INT          NOT NULL DEFAULT 0,
    platform_revenue_cents INT       NOT NULL DEFAULT 0,    -- Airbnb/VRBO booked revenue
    direct_revenue_cents INT         NOT NULL DEFAULT 0,    -- direct bookings (must self-remit)
    tax_rate_pct        DECIMAL(5,2) NOT NULL,
    tax_owed_cents      INT          NOT NULL DEFAULT 0,    -- on direct_revenue only typically
    platform_remitted_cents INT      NOT NULL DEFAULT 0,
    self_remit_cents    INT GENERATED ALWAYS AS (
                            GREATEST(0, tax_owed_cents - platform_remitted_cents)
                        ) STORED,
    filing_url          VARCHAR(500),
    filed_at            DATETIME,
    filing_reference    VARCHAR(100),
    status              ENUM('pending','filed','overdue') DEFAULT 'pending',
    created_at          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_utr_org  FOREIGN KEY (organisation_id) REFERENCES organisations(id) ON DELETE CASCADE,
    CONSTRAINT fk_utr_prop FOREIGN KEY (property_id)     REFERENCES properties(id)     ON DELETE CASCADE,
    CONSTRAINT fk_utr_jur  FOREIGN KEY (jurisdiction_id) REFERENCES jurisdictions(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- DOMAIN 12: AUDIT LOG
-- ============================================================

CREATE TABLE audit_log (
    id              BIGINT       NOT NULL AUTO_INCREMENT,
    organisation_id CHAR(36)     NOT NULL,
    user_id         CHAR(36),
    action          VARCHAR(50)  NOT NULL,
    resource_type   VARCHAR(100) NOT NULL,
    resource_id     CHAR(36),
    old_values      JSON,
    new_values      JSON,
    ip_address      VARCHAR(45),
    created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_audit_org  (organisation_id, created_at DESC),
    KEY idx_audit_prop (resource_id, created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TENANT ISOLATION
-- ============================================================

DELIMITER $$
CREATE PROCEDURE set_tenant(IN org_id CHAR(36))
BEGIN SET @current_org_id = org_id; END$$
DELIMITER ;

-- ============================================================
-- SEED: COUNTRIES
-- ============================================================
INSERT INTO countries (code,name,currency,str_legal_status) VALUES
('US','United States','USD','varies'),
('AU','Australia','AUD','varies'),
('GB','United Kingdom','GBP','varies'),
('FR','France','EUR','restricted'),
('ES','Spain','EUR','restricted'),
('NL','Netherlands','EUR','restricted'),
('DE','Germany','EUR','restricted'),
('PT','Portugal','EUR','varies'),
('IT','Italy','EUR','varies'),
('GR','Greece','EUR','varies'),
('CA','Canada','CAD','varies'),
('NZ','New Zealand','NZD','varies');

SET FOREIGN_KEY_CHECKS = 1;
-- ============================================================
-- END OF SCHEMA
-- ============================================================
