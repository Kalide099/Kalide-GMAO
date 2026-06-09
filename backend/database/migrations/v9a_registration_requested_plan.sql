-- v9a: Persist requested plan on registration applications
ALTER TABLE registration_requests
    ADD COLUMN IF NOT EXISTS requested_plan ENUM('basic', 'pro', 'enterprise') NOT NULL DEFAULT 'basic' AFTER preferred_language;

INSERT IGNORE INTO migrations (version) VALUES ('v9a_registration_requested_plan');