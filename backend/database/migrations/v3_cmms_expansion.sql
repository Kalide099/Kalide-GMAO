-- v3_cmms_expansion.sql
-- implementing core requested features: subcontracting, contracts, budgets, attachments, and sso.

USE kgmao_db;

-- 1. ATTACHMENTS (Document joints)
CREATE TABLE IF NOT EXISTS attachments (
    id CHAR(36) PRIMARY KEY,
    company_id CHAR(36) NOT NULL,
    entity_type ENUM('asset', 'work_order', 'contract', 'procurement') NOT NULL,
    entity_id CHAR(36) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(512) NOT NULL,
    file_size INT,
    mime_type VARCHAR(100),
    uploaded_by CHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 2. SUBCONTRACTING (Sous-traitance)
CREATE TABLE IF NOT EXISTS subcontractors (
    id CHAR(36) PRIMARY KEY,
    company_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    service_type VARCHAR(100), -- e.g., 'Electrical', 'HVAC'
    rating DECIMAL(3,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- Adding subcontractor_id to work_orders
ALTER TABLE work_orders ADD COLUMN subcontractor_id CHAR(36) AFTER assigned_to;
ALTER TABLE work_orders ADD FOREIGN KEY (subcontractor_id) REFERENCES subcontractors(id) ON DELETE SET NULL;

-- 3. CONTRACTS & BUDGETS
CREATE TABLE IF NOT EXISTS contracts (
    id CHAR(36) PRIMARY KEY,
    company_id CHAR(36) NOT NULL,
    subcontractor_id CHAR(36),
    title VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    value DECIMAL(15,2) DEFAULT 0,
    currency CHAR(3) DEFAULT 'USD',
    status ENUM('active', 'expired', 'pending', 'cancelled') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (subcontractor_id) REFERENCES subcontractors(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS budgets (
    id CHAR(36) PRIMARY KEY,
    company_id CHAR(36) NOT NULL,
    year INT NOT NULL,
    sector ENUM('maintenance', 'energy', 'procurement', 'logistics', 'general') NOT NULL,
    allocated_amount DECIMAL(15,2) DEFAULT 0,
    spent_amount DECIMAL(15,2) DEFAULT 0,
    currency CHAR(3) DEFAULT 'USD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    UNIQUE INDEX idx_company_year_sector (company_id, year, sector)
);

-- 4. CUSTOM FORMS (Formulaires personnalisés)
CREATE TABLE IF NOT EXISTS custom_forms (
    id CHAR(36) PRIMARY KEY,
    company_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    entity_type ENUM('asset', 'work_order', 'safety_audit') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS custom_form_fields (
    id CHAR(36) PRIMARY KEY,
    form_id CHAR(36) NOT NULL,
    label VARCHAR(255) NOT NULL,
    field_type ENUM('text', 'number', 'date', 'select', 'checkbox', 'image') NOT NULL,
    options JSON, -- for select fields
    is_required BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    
    FOREIGN KEY (form_id) REFERENCES custom_forms(id) ON DELETE CASCADE
);

-- 5. SSO CONFIGURATION
CREATE TABLE IF NOT EXISTS sso_configs (
    id CHAR(36) PRIMARY KEY,
    company_id CHAR(36) NOT NULL UNIQUE,
    provider ENUM('google', 'azure', 'okta', 'saml') NOT NULL,
    client_id VARCHAR(255) NOT NULL,
    client_secret VARCHAR(255),
    entry_point VARCHAR(512), -- for SAML
    cert TEXT, -- for SAML
    is_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

INSERT IGNORE INTO migrations (version) VALUES ('v3_cmms_expansion');
