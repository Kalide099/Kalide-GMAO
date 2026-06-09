-- v9b: Align SSO configuration storage with the active SSO Identity UI
CREATE TABLE IF NOT EXISTS sso_configs (
    id CHAR(36) PRIMARY KEY,
    company_id CHAR(36) NOT NULL,
    provider_name VARCHAR(100) NOT NULL DEFAULT '',
    idp_entity_id VARCHAR(512) NOT NULL DEFAULT '',
    sso_url VARCHAR(512) NOT NULL DEFAULT '',
    public_certificate TEXT NULL,
    is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_sso_company (company_id),
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

ALTER TABLE sso_configs
    ADD COLUMN IF NOT EXISTS provider_name VARCHAR(100) NOT NULL DEFAULT '' AFTER company_id,
    ADD COLUMN IF NOT EXISTS idp_entity_id VARCHAR(512) NOT NULL DEFAULT '' AFTER provider_name,
    ADD COLUMN IF NOT EXISTS sso_url VARCHAR(512) NOT NULL DEFAULT '' AFTER idp_entity_id,
    ADD COLUMN IF NOT EXISTS public_certificate TEXT NULL AFTER sso_url,
    ADD COLUMN IF NOT EXISTS is_enabled BOOLEAN NOT NULL DEFAULT TRUE AFTER public_certificate,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at;

INSERT IGNORE INTO migrations (version) VALUES ('v9b_sso_config_columns');