-- v4_language_preferences.sql
-- Persist the user's chosen UI language from registration through future logins.

USE kgmao_db;

ALTER TABLE registration_requests
    ADD COLUMN IF NOT EXISTS preferred_language CHAR(2) NOT NULL DEFAULT 'en' AFTER password_hash;

ALTER TABLE companies
    ADD COLUMN IF NOT EXISTS default_language CHAR(2) NOT NULL DEFAULT 'en' AFTER industry_fr;

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS preferred_language CHAR(2) NOT NULL DEFAULT 'en' AFTER status;

INSERT IGNORE INTO migrations (version) VALUES ('v4_language_preferences');
