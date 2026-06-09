-- PermitPal Database Schema
-- MySQL 8.0+ required
-- Generated from domain entities

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

CREATE DATABASE IF NOT EXISTS `permitpal`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `permitpal`;

-- ============================================================
-- 1. Organisations
-- ============================================================
CREATE TABLE `organisations` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `country` VARCHAR(10) NOT NULL,
    `timezone` VARCHAR(100) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(50) NULL,
    `subscription_plan` ENUM('Solo','Host','Operator','Manager') NOT NULL DEFAULT 'Solo',
    `subscription_status` ENUM('Trialing','Active','PastDue','Cancelled') NOT NULL DEFAULT 'Trialing',
    `trial_ends_at` DATETIME NULL,
    `stripe_customer_id` VARCHAR(255) NULL,
    `stripe_subscription_id` VARCHAR(255) NULL,
    `max_properties` INT NOT NULL DEFAULT 1,
    `max_team_seats` INT NOT NULL DEFAULT 1,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_organisations_slug` (`slug`),
    KEY `ix_organisations_stripe_customer` (`stripe_customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 2. Users
-- ============================================================
CREATE TABLE `users` (
    `id` CHAR(36) NOT NULL,
    `organisation_id` CHAR(36) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `first_name` VARCHAR(100) NOT NULL,
    `last_name` VARCHAR(100) NOT NULL,
    `role` ENUM('Owner','Admin','Viewer') NOT NULL DEFAULT 'Owner',
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `mfa_enabled` BOOLEAN NOT NULL DEFAULT FALSE,
    `mfa_secret` VARCHAR(255) NULL,
    `last_login_at` DATETIME NULL,
    `reset_token` VARCHAR(255) NULL,
    `reset_token_expires` DATETIME NULL,
    `refresh_token` VARCHAR(512) NULL,
    `refresh_token_expires` DATETIME NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_users_email` (`email`),
    KEY `ix_users_organisation` (`organisation_id`),
    CONSTRAINT `fk_users_organisation` FOREIGN KEY (`organisation_id`) REFERENCES `organisations`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 3. Countries
-- ============================================================
CREATE TABLE `countries` (
    `code` VARCHAR(10) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `currency` VARCHAR(10) NOT NULL,
    `str_legal_status` ENUM('Legal','Restricted','Banned','Varies') NOT NULL DEFAULT 'Varies',
    `national_framework_url` VARCHAR(2048) NULL,
    `notes` TEXT NULL,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 4. State/Regions
-- ============================================================
CREATE TABLE `state_regions` (
    `id` CHAR(36) NOT NULL,
    `country_code` VARCHAR(10) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `code` VARCHAR(20) NULL,
    `has_state_registration` BOOLEAN NOT NULL DEFAULT FALSE,
    `registration_url` VARCHAR(2048) NULL,
    `registration_fee_cents` INT NULL,
    `registration_renewal_fee_cents` INT NULL,
    `registration_validity_months` INT NULL,
    `night_cap_default` INT NULL,
    `night_cap_hosted` INT NULL,
    `levy_pct` DECIMAL(6,4) NULL,
    `levy_authority` VARCHAR(255) NULL,
    `levy_report_url` VARCHAR(2048) NULL,
    `notes` TEXT NULL,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `ix_state_regions_country` (`country_code`),
    CONSTRAINT `fk_state_regions_country` FOREIGN KEY (`country_code`) REFERENCES `countries`(`code`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 5. Jurisdictions
-- ============================================================
CREATE TABLE `jurisdictions` (
    `id` CHAR(36) NOT NULL,
    `country_code` VARCHAR(10) NOT NULL,
    `state_region_id` CHAR(36) NULL,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `jurisdiction_type` ENUM('City','County','District','Borough','Commune','Shire','Lga') NOT NULL DEFAULT 'City',
    `permit_required` BOOLEAN NOT NULL DEFAULT FALSE,
    `permit_type` VARCHAR(255) NULL,
    `permit_description` TEXT NULL,
    `permit_fee_cents` INT NULL,
    `permit_renewal_fee_cents` INT NULL,
    `permit_validity_months` INT NULL DEFAULT 12,
    `permit_portal_url` VARCHAR(2048) NULL,
    `permit_number_in_listing` BOOLEAN NOT NULL DEFAULT FALSE,
    `night_cap_unhosted` INT NULL,
    `night_cap_hosted` INT NULL,
    `night_cap_notes` TEXT NULL,
    `primary_residence_required` BOOLEAN NOT NULL DEFAULT FALSE,
    `primary_residence_days` INT NULL,
    `zoning_restrictions` BOOLEAN NOT NULL DEFAULT FALSE,
    `zoning_notes` TEXT NULL,
    `tot_rate_pct` DECIMAL(6,4) NULL,
    `tot_name` VARCHAR(255) NULL,
    `tot_platform_collects` BOOLEAN NOT NULL DEFAULT TRUE,
    `tot_self_remit_required` BOOLEAN NOT NULL DEFAULT FALSE,
    `tot_filing_url` VARCHAR(2048) NULL,
    `additional_taxes` TEXT NULL,
    `eu_registration_scheme` VARCHAR(255) NULL,
    `eu_registration_url` VARCHAR(2048) NULL,
    `eu_data_sharing_active` BOOLEAN NOT NULL DEFAULT FALSE,
    `au_stra_register_required` BOOLEAN NOT NULL DEFAULT FALSE,
    `au_fire_safety_standard` VARCHAR(255) NULL,
    `au_contact_person_required` BOOLEAN NOT NULL DEFAULT FALSE,
    `au_complaint_response_minutes` INT NULL,
    `fine_min_cents` INT NULL,
    `fine_max_cents` INT NULL,
    `fine_currency` VARCHAR(10) NOT NULL DEFAULT 'USD',
    `fine_notes` TEXT NULL,
    `enforcement_level` ENUM('Low','Medium','High','VeryHigh') NOT NULL DEFAULT 'Medium',
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `last_verified_at` DATE NULL,
    `next_review_date` DATE NULL,
    `verified_by` VARCHAR(255) NULL,
    `source_urls` TEXT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_jurisdictions_slug` (`slug`),
    KEY `ix_jurisdictions_country` (`country_code`),
    KEY `ix_jurisdictions_state_region` (`state_region_id`),
    CONSTRAINT `fk_jurisdictions_country` FOREIGN KEY (`country_code`) REFERENCES `countries`(`code`) ON DELETE CASCADE,
    CONSTRAINT `fk_jurisdictions_state_region` FOREIGN KEY (`state_region_id`) REFERENCES `state_regions`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 6. Jurisdiction Postcodes
-- ============================================================
CREATE TABLE `jurisdiction_postcodes` (
    `postcode` VARCHAR(20) NOT NULL,
    `country_code` VARCHAR(10) NOT NULL,
    `jurisdiction_id` CHAR(36) NOT NULL,
    `is_primary` BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (`postcode`, `country_code`, `jurisdiction_id`),
    KEY `ix_jurisdiction_postcodes_jurisdiction` (`jurisdiction_id`),
    CONSTRAINT `fk_jurisdiction_postcodes_jurisdiction` FOREIGN KEY (`jurisdiction_id`) REFERENCES `jurisdictions`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_jurisdiction_postcodes_country` FOREIGN KEY (`country_code`) REFERENCES `countries`(`code`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 7. Regulatory Changes
-- ============================================================
CREATE TABLE `regulatory_changes` (
    `id` CHAR(36) NOT NULL,
    `jurisdiction_id` CHAR(36) NOT NULL,
    `change_type` ENUM('PermitFee','NightCap','NewPermit','PermitRemoved','TotRate','Zoning','Enforcement','Other') NOT NULL,
    `change_summary` TEXT NOT NULL,
    `old_value` VARCHAR(500) NULL,
    `new_value` VARCHAR(500) NULL,
    `effective_date` DATE NULL,
    `source_url` VARCHAR(2048) NULL,
    `ai_summary` TEXT NULL,
    `severity` ENUM('Info','Warning','Critical') NOT NULL DEFAULT 'Warning',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `ix_regulatory_changes_jurisdiction` (`jurisdiction_id`),
    KEY `ix_regulatory_changes_effective_date` (`effective_date`),
    CONSTRAINT `fk_regulatory_changes_jurisdiction` FOREIGN KEY (`jurisdiction_id`) REFERENCES `jurisdictions`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 8. Properties
-- ============================================================
CREATE TABLE `properties` (
    `id` CHAR(36) NOT NULL,
    `organisation_id` CHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `address_line1` VARCHAR(255) NOT NULL,
    `address_line2` VARCHAR(255) NULL,
    `city` VARCHAR(255) NOT NULL,
    `state_region` VARCHAR(255) NULL,
    `postcode` VARCHAR(20) NOT NULL,
    `country_code` VARCHAR(10) NOT NULL,
    `lat` DECIMAL(10,7) NULL,
    `lng` DECIMAL(10,7) NULL,
    `jurisdiction_id` CHAR(36) NULL,
    `property_type` ENUM('EntireHome','PrivateRoom','SharedRoom','Apartment','House','Villa','Cabin','Other') NOT NULL DEFAULT 'EntireHome',
    `is_primary_residence` BOOLEAN NOT NULL DEFAULT FALSE,
    `owner_occupied` BOOLEAN NOT NULL DEFAULT FALSE,
    `hosted_type` ENUM('Hosted','Unhosted') NOT NULL DEFAULT 'Unhosted',
    `airbnb_listing_id` VARCHAR(255) NULL,
    `airbnb_listing_url` VARCHAR(2048) NULL,
    `vrbo_listing_id` VARCHAR(255) NULL,
    `booking_listing_id` VARCHAR(255) NULL,
    `compliance_score` TINYINT UNSIGNED NULL,
    `compliance_status` ENUM('Compliant','Warning','NonCompliant','Unknown') NOT NULL DEFAULT 'Unknown',
    `score_calculated_at` DATETIME NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `notes` TEXT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `ix_properties_organisation` (`organisation_id`),
    KEY `ix_properties_jurisdiction` (`jurisdiction_id`),
    KEY `ix_properties_postcode` (`postcode`, `country_code`),
    CONSTRAINT `fk_properties_organisation` FOREIGN KEY (`organisation_id`) REFERENCES `organisations`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_properties_jurisdiction` FOREIGN KEY (`jurisdiction_id`) REFERENCES `jurisdictions`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 9. Permits
-- ============================================================
CREATE TABLE `permits` (
    `id` CHAR(36) NOT NULL,
    `organisation_id` CHAR(36) NOT NULL,
    `property_id` CHAR(36) NOT NULL,
    `jurisdiction_id` CHAR(36) NULL,
    `permit_type` VARCHAR(255) NOT NULL,
    `permit_number` VARCHAR(255) NULL,
    `status` ENUM('Active','Expired','Pending','Cancelled','NotRequired') NOT NULL DEFAULT 'Pending',
    `issuing_authority` VARCHAR(255) NULL,
    `issued_date` DATE NULL,
    `expiry_date` DATE NULL,
    `renewal_fee_cents` INT NULL,
    `renewal_url` VARCHAR(2048) NULL,
    `auto_renewed` BOOLEAN NOT NULL DEFAULT FALSE,
    `display_in_listing` BOOLEAN NOT NULL DEFAULT FALSE,
    `eu_registration_number` VARCHAR(255) NULL,
    `eu_registration_country` VARCHAR(10) NULL,
    `eu_registration_valid` BOOLEAN NULL,
    `eu_registration_checked_at` DATETIME NULL,
    `alerted_90d` BOOLEAN NOT NULL DEFAULT FALSE,
    `alerted_30d` BOOLEAN NOT NULL DEFAULT FALSE,
    `alerted_7d` BOOLEAN NOT NULL DEFAULT FALSE,
    `alerted_expired` BOOLEAN NOT NULL DEFAULT FALSE,
    `notes` TEXT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `ix_permits_organisation` (`organisation_id`),
    KEY `ix_permits_property` (`property_id`),
    KEY `ix_permits_jurisdiction` (`jurisdiction_id`),
    KEY `ix_permits_expiry_date` (`expiry_date`),
    CONSTRAINT `fk_permits_organisation` FOREIGN KEY (`organisation_id`) REFERENCES `organisations`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_permits_property` FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_permits_jurisdiction` FOREIGN KEY (`jurisdiction_id`) REFERENCES `jurisdictions`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 10. Night Cap Records
-- ============================================================
CREATE TABLE `night_cap_records` (
    `id` CHAR(36) NOT NULL,
    `organisation_id` CHAR(36) NOT NULL,
    `property_id` CHAR(36) NOT NULL,
    `calendar_year` SMALLINT NOT NULL,
    `cap_limit` INT NULL,
    `nights_used` INT NOT NULL DEFAULT 0,
    `alerted_80_pct` BOOLEAN NOT NULL DEFAULT FALSE,
    `alerted_90_pct` BOOLEAN NOT NULL DEFAULT FALSE,
    `alerted_100_pct` BOOLEAN NOT NULL DEFAULT FALSE,
    `last_synced_at` DATETIME NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_night_cap_records_property_year` (`property_id`, `calendar_year`),
    KEY `ix_night_cap_records_organisation` (`organisation_id`),
    CONSTRAINT `fk_night_cap_records_organisation` FOREIGN KEY (`organisation_id`) REFERENCES `organisations`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_night_cap_records_property` FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 11. Booked Nights
-- ============================================================
CREATE TABLE `booked_nights` (
    `id` CHAR(36) NOT NULL,
    `organisation_id` CHAR(36) NOT NULL,
    `property_id` CHAR(36) NOT NULL,
    `night_date` DATE NOT NULL,
    `source` ENUM('Airbnb','Vrbo','Booking','Direct','Manual') NOT NULL,
    `booking_ref` VARCHAR(255) NULL,
    `ical_uid` VARCHAR(500) NULL,
    `guest_count` TINYINT UNSIGNED NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_booked_nights_property_date_source` (`property_id`, `night_date`, `source`),
    KEY `ix_booked_nights_organisation` (`organisation_id`),
    KEY `ix_booked_nights_night_date` (`night_date`),
    CONSTRAINT `fk_booked_nights_organisation` FOREIGN KEY (`organisation_id`) REFERENCES `organisations`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_booked_nights_property` FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 12. iCal Feeds
-- ============================================================
CREATE TABLE `ical_feeds` (
    `id` CHAR(36) NOT NULL,
    `organisation_id` CHAR(36) NOT NULL,
    `property_id` CHAR(36) NOT NULL,
    `platform` ENUM('Airbnb','Vrbo','Booking','Direct','Manual') NOT NULL,
    `ical_url` VARCHAR(2048) NOT NULL,
    `last_synced_at` DATETIME NULL,
    `last_sync_status` ENUM('Success','Failed','Pending') NOT NULL DEFAULT 'Pending',
    `last_sync_error` TEXT NULL,
    `nights_imported` INT NOT NULL DEFAULT 0,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `ix_ical_feeds_organisation` (`organisation_id`),
    KEY `ix_ical_feeds_property` (`property_id`),
    CONSTRAINT `fk_ical_feeds_organisation` FOREIGN KEY (`organisation_id`) REFERENCES `organisations`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_ical_feeds_property` FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 13. Documents
-- ============================================================
CREATE TABLE `documents` (
    `id` CHAR(36) NOT NULL,
    `organisation_id` CHAR(36) NOT NULL,
    `property_id` CHAR(36) NULL,
    `permit_id` CHAR(36) NULL,
    `document_type` ENUM('Permit','Registration','Insurance','FireCert','SafetyInspection','TaxCert','Other') NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `file_url` VARCHAR(2048) NOT NULL,
    `file_size_bytes` INT NULL,
    `mime_type` VARCHAR(100) NULL,
    `expiry_date` DATE NULL,
    `alerted_expiry` BOOLEAN NOT NULL DEFAULT FALSE,
    `uploaded_by_user_id` CHAR(36) NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `ix_documents_organisation` (`organisation_id`),
    KEY `ix_documents_property` (`property_id`),
    KEY `ix_documents_permit` (`permit_id`),
    CONSTRAINT `fk_documents_organisation` FOREIGN KEY (`organisation_id`) REFERENCES `organisations`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_documents_property` FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_documents_permit` FOREIGN KEY (`permit_id`) REFERENCES `permits`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 14. Alert Subscriptions
-- ============================================================
CREATE TABLE `alert_subscriptions` (
    `id` CHAR(36) NOT NULL,
    `organisation_id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `jurisdiction_id` CHAR(36) NULL,
    `property_id` CHAR(36) NULL,
    `alert_type` ENUM('PermitExpiry','NightCap','RegulatoryChange','EuRegistration','LevyDue','All') NOT NULL DEFAULT 'All',
    `channel` VARCHAR(20) NOT NULL DEFAULT 'email',
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `ix_alert_subscriptions_organisation` (`organisation_id`),
    KEY `ix_alert_subscriptions_user` (`user_id`),
    CONSTRAINT `fk_alert_subscriptions_organisation` FOREIGN KEY (`organisation_id`) REFERENCES `organisations`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_alert_subscriptions_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 15. Notification Logs
-- ============================================================
CREATE TABLE `notification_logs` (
    `id` CHAR(36) NOT NULL,
    `organisation_id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NULL,
    `property_id` CHAR(36) NULL,
    `permit_id` CHAR(36) NULL,
    `alert_type` VARCHAR(100) NOT NULL,
    `channel` ENUM('Email','Sms','Push') NOT NULL,
    `recipient` VARCHAR(255) NOT NULL,
    `subject` VARCHAR(500) NULL,
    `body` TEXT NOT NULL,
    `status` ENUM('Queued','Sent','Delivered','Failed') NOT NULL DEFAULT 'Queued',
    `provider_message_id` VARCHAR(255) NULL,
    `sent_at` DATETIME NULL,
    `error_message` TEXT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `ix_notification_logs_organisation` (`organisation_id`),
    KEY `ix_notification_logs_status` (`status`),
    KEY `ix_notification_logs_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 16. Regulatory Alert Logs
-- ============================================================
CREATE TABLE `regulatory_alert_logs` (
    `id` CHAR(36) NOT NULL,
    `regulatory_change_id` CHAR(36) NOT NULL,
    `organisation_id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `sent_at` DATETIME NULL,
    `channel` ENUM('Email','Sms','Push') NOT NULL DEFAULT 'Email',
    `read_at` DATETIME NULL,
    PRIMARY KEY (`id`),
    KEY `ix_regulatory_alert_logs_change` (`regulatory_change_id`),
    KEY `ix_regulatory_alert_logs_organisation` (`organisation_id`),
    CONSTRAINT `fk_regulatory_alert_logs_change` FOREIGN KEY (`regulatory_change_id`) REFERENCES `regulatory_changes`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_regulatory_alert_logs_organisation` FOREIGN KEY (`organisation_id`) REFERENCES `organisations`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 17. EU Registration Progress
-- ============================================================
CREATE TABLE `eu_registration_progress` (
    `id` CHAR(36) NOT NULL,
    `organisation_id` CHAR(36) NOT NULL,
    `property_id` CHAR(36) NOT NULL,
    `country_code` VARCHAR(10) NOT NULL,
    `scheme_name` VARCHAR(255) NOT NULL,
    `current_step` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `total_steps` TINYINT UNSIGNED NOT NULL,
    `steps_data` JSON NULL,
    `registration_number` VARCHAR(255) NULL,
    `registration_status` ENUM('NotStarted','InProgress','Submitted','Active','Invalid','Expired') NOT NULL DEFAULT 'NotStarted',
    `submitted_at` DATETIME NULL,
    `expiry_date` DATE NULL,
    `portal_url` VARCHAR(2048) NULL,
    `notes` TEXT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `ix_eu_registration_organisation` (`organisation_id`),
    KEY `ix_eu_registration_property` (`property_id`),
    CONSTRAINT `fk_eu_registration_organisation` FOREIGN KEY (`organisation_id`) REFERENCES `organisations`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_eu_registration_property` FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 18. AU Levy Records
-- ============================================================
CREATE TABLE `au_levy_records` (
    `id` CHAR(36) NOT NULL,
    `organisation_id` CHAR(36) NOT NULL,
    `property_id` CHAR(36) NOT NULL,
    `state_code` VARCHAR(10) NOT NULL,
    `quarter` TINYINT UNSIGNED NOT NULL,
    `calendar_year` SMALLINT NOT NULL,
    `total_bookings_cents` INT NOT NULL DEFAULT 0,
    `levy_rate_pct` DECIMAL(6,4) NOT NULL,
    `levy_amount_cents` INT NOT NULL DEFAULT 0,
    `platform_collected_cents` INT NOT NULL DEFAULT 0,
    `report_generated_at` DATETIME NULL,
    `lodged_at` DATETIME NULL,
    `lodgement_reference` VARCHAR(255) NULL,
    `status` ENUM('Calculating','Ready','Lodged','Overdue') NOT NULL DEFAULT 'Calculating',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_au_levy_records_property_quarter` (`property_id`, `calendar_year`, `quarter`),
    KEY `ix_au_levy_records_organisation` (`organisation_id`),
    CONSTRAINT `fk_au_levy_records_organisation` FOREIGN KEY (`organisation_id`) REFERENCES `organisations`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_au_levy_records_property` FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 19. AU Fire Safety Records
-- ============================================================
CREATE TABLE `au_fire_safety_records` (
    `id` CHAR(36) NOT NULL,
    `organisation_id` CHAR(36) NOT NULL,
    `property_id` CHAR(36) NOT NULL,
    `state_code` VARCHAR(10) NOT NULL,
    `smoke_alarms_installed` BOOLEAN NOT NULL DEFAULT FALSE,
    `smoke_alarm_standard` VARCHAR(50) NOT NULL DEFAULT 'AS3786',
    `smoke_alarm_test_date` DATE NULL,
    `smoke_alarm_expiry_date` DATE NULL,
    `interconnected` BOOLEAN NOT NULL DEFAULT FALSE,
    `photoelectric` BOOLEAN NOT NULL DEFAULT FALSE,
    `fire_extinguisher` BOOLEAN NOT NULL DEFAULT FALSE,
    `fire_extinguisher_type` VARCHAR(100) NOT NULL DEFAULT '2.5kg ABE',
    `fire_extinguisher_test_date` DATE NULL,
    `fire_blanket` BOOLEAN NOT NULL DEFAULT FALSE,
    `evacuation_diagram` BOOLEAN NOT NULL DEFAULT FALSE,
    `evacuation_diagram_location` VARCHAR(255) NULL,
    `last_inspection_date` DATE NULL,
    `inspection_certificate_url` VARCHAR(2048) NULL,
    `next_inspection_due` DATE NULL,
    `notes` TEXT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `ix_au_fire_safety_organisation` (`organisation_id`),
    KEY `ix_au_fire_safety_property` (`property_id`),
    CONSTRAINT `fk_au_fire_safety_organisation` FOREIGN KEY (`organisation_id`) REFERENCES `organisations`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_au_fire_safety_property` FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 20. AU Complaint Logs
-- ============================================================
CREATE TABLE `au_complaint_logs` (
    `id` CHAR(36) NOT NULL,
    `organisation_id` CHAR(36) NOT NULL,
    `property_id` CHAR(36) NOT NULL,
    `complaint_received_at` DATETIME NOT NULL,
    `complaint_source` ENUM('Neighbour','Council','Platform','Other') NOT NULL DEFAULT 'Neighbour',
    `complaint_description` TEXT NULL,
    `response_required_by` DATETIME NULL,
    `responded_at` DATETIME NULL,
    `response_notes` TEXT NULL,
    `resolved_by` DATETIME NULL,
    `resolved_at` DATETIME NULL,
    `resolution_notes` TEXT NULL,
    `council_report_due` DATETIME NULL,
    `council_report_sent` DATETIME NULL,
    `status` ENUM('Open','Responded','Resolved','Escalated') NOT NULL DEFAULT 'Open',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `ix_au_complaint_logs_organisation` (`organisation_id`),
    KEY `ix_au_complaint_logs_property` (`property_id`),
    KEY `ix_au_complaint_logs_status` (`status`),
    CONSTRAINT `fk_au_complaint_logs_organisation` FOREIGN KEY (`organisation_id`) REFERENCES `organisations`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_au_complaint_logs_property` FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 21. US Tax Records
-- ============================================================
CREATE TABLE `us_tax_records` (
    `id` CHAR(36) NOT NULL,
    `organisation_id` CHAR(36) NOT NULL,
    `property_id` CHAR(36) NOT NULL,
    `jurisdiction_id` CHAR(36) NOT NULL,
    `tax_period_start` DATE NOT NULL,
    `tax_period_end` DATE NOT NULL,
    `tax_type` ENUM('Tot','SalesTax','CountyOccupancy','CityTax','Other') NOT NULL,
    `total_revenue_cents` INT NOT NULL DEFAULT 0,
    `platform_revenue_cents` INT NOT NULL DEFAULT 0,
    `direct_revenue_cents` INT NOT NULL DEFAULT 0,
    `tax_rate_pct` DECIMAL(6,4) NOT NULL,
    `tax_owed_cents` INT NOT NULL DEFAULT 0,
    `platform_remitted_cents` INT NOT NULL DEFAULT 0,
    `filing_url` VARCHAR(2048) NULL,
    `filed_at` DATETIME NULL,
    `filing_reference` VARCHAR(255) NULL,
    `status` ENUM('Pending','Filed','Overdue') NOT NULL DEFAULT 'Pending',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `ix_us_tax_records_organisation` (`organisation_id`),
    KEY `ix_us_tax_records_property` (`property_id`),
    KEY `ix_us_tax_records_jurisdiction` (`jurisdiction_id`),
    KEY `ix_us_tax_records_period` (`tax_period_start`, `tax_period_end`),
    CONSTRAINT `fk_us_tax_records_organisation` FOREIGN KEY (`organisation_id`) REFERENCES `organisations`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_us_tax_records_property` FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_us_tax_records_jurisdiction` FOREIGN KEY (`jurisdiction_id`) REFERENCES `jurisdictions`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 22. Audit Logs
-- ============================================================
CREATE TABLE `audit_logs` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `organisation_id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NULL,
    `action` VARCHAR(100) NOT NULL,
    `resource_type` VARCHAR(100) NOT NULL,
    `resource_id` VARCHAR(36) NULL,
    `old_values` JSON NULL,
    `new_values` JSON NULL,
    `ip_address` VARCHAR(45) NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `ix_audit_logs_organisation` (`organisation_id`),
    KEY `ix_audit_logs_user` (`user_id`),
    KEY `ix_audit_logs_resource` (`resource_type`, `resource_id`),
    KEY `ix_audit_logs_created_at` (`created_at`),
    CONSTRAINT `fk_audit_logs_organisation` FOREIGN KEY (`organisation_id`) REFERENCES `organisations`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;