-- v2_work_order_extensions.sql
-- Expanding Work Order module with communication and audit trails.

USE kgmao_db;

CREATE TABLE IF NOT EXISTS work_order_comments (
    id CHAR(36) PRIMARY KEY,
    company_id CHAR(36) NOT NULL,
    work_order_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (work_order_id) REFERENCES work_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS work_order_history (
    id CHAR(36) PRIMARY KEY,
    company_id CHAR(36) NOT NULL,
    work_order_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    action VARCHAR(255) NOT NULL, -- e.g., 'status_change', 'assigned_technician'
    old_value TEXT,
    new_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (work_order_id) REFERENCES work_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT IGNORE INTO migrations (version) VALUES ('v2_work_order_extensions');
