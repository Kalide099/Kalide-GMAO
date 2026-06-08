CREATE TABLE IF NOT EXISTS idempotency_keys (
    id VARCHAR(36) PRIMARY KEY,
    idempotency_key VARCHAR(255) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    request_path VARCHAR(255) NOT NULL,
    response_body JSON,
    response_status INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_idempotency_user (user_id, idempotency_key),
    UNIQUE KEY uk_user_key (user_id, idempotency_key)
);
