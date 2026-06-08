-- v6_mfa_security_hardening.sql
-- Adds multi-factor authentication support for privileged users.

USE kgmao_db;

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE AFTER preferred_language,
    ADD COLUMN IF NOT EXISTS mfa_secret VARCHAR(255) NULL AFTER mfa_enabled,
    ADD COLUMN IF NOT EXISTS mfa_temp_secret VARCHAR(255) NULL AFTER mfa_secret;

CREATE TABLE IF NOT EXISTS mfa_backup_codes (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    code_hash VARCHAR(255) NOT NULL,
    used_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_mfa_backup_user_id (user_id),
    INDEX idx_mfa_backup_used_at (used_at)
);
