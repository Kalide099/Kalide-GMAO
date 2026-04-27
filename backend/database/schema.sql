-- KGMAO Multi-tenant Enterprise Database Schema with Strong i18n Translation Tables & SaaS Billing

-- Clean Purge for Shared Hosting (where DROP DATABASE is restricted)
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS integration_webhooks, system_plugins, inventory_transactions, warehouse_locations, ot_security_alerts, sla_contracts, blockchain_ledger, esg_telemetry, digital_twin_snapshots, ai_prescriptions, user_certifications, certifications, expert_sessions, asset_telemetrics, asset_financial_models, safety_permits, registration_requests, technician_kpis, energy_readings, purchase_orders, iot_readings, asset_sensor_configs, role_permissions, permissions, audit_logs, notifications, work_order_parts, failure_predictions, maintenance_schedules, work_order_history, work_order_comments, work_order_translations, work_orders, inventory_items, suppliers, assets, users, subscriptions, zones, sites, companies, subscription_plan_translations, subscription_plans;
SET FOREIGN_KEY_CHECKS = 1;

-- ==========================================
-- SAAS BILLING INFRASTRUCTURE
-- ==========================================

CREATE TABLE IF NOT EXISTS subscription_plans (
    id CHAR(36) PRIMARY KEY,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    currency CHAR(3) DEFAULT 'USD',
    billing_cycle ENUM('monthly', 'yearly') DEFAULT 'monthly',
    features JSON, -- e.g., {"max_assets": 100, "reporting": true}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS subscription_plan_translations (
    id CHAR(36) PRIMARY KEY,
    plan_id CHAR(36) NOT NULL,
    language_code CHAR(2) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    FOREIGN KEY (plan_id) REFERENCES subscription_plans(id) ON DELETE CASCADE,
    UNIQUE INDEX idx_unique_plan_lang (plan_id, language_code)
);


-- 1. COMPANIES (Tenants - Strict Bilingual)
CREATE TABLE IF NOT EXISTS companies (
    id CHAR(36) PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL,
    name_fr VARCHAR(255) NOT NULL,
    industry_en VARCHAR(100),
    industry_fr VARCHAR(100),
    country_code CHAR(2) DEFAULT 'US',
    vat_id VARCHAR(50),
    unit_system ENUM('metric', 'imperial') DEFAULT 'metric',
    timezone VARCHAR(100) DEFAULT 'UTC',
    currency CHAR(3) DEFAULT 'USD',
    subscription_status ENUM('trial', 'active', 'suspended', 'expired', 'cancelled') DEFAULT 'trial',
    plan ENUM('basic', 'pro', 'enterprise') DEFAULT 'basic',
    enabled_modules JSON NULL, -- e.g., ["safety", "finance", "gis", "iot", "predictive"]
    api_key CHAR(64) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    INDEX idx_company_status (subscription_status)
);

-- ==========================================
-- ENTERPRISE LOCATION HIERARCHY
-- ==========================================

CREATE TABLE IF NOT EXISTS sites (
    id CHAR(36) PRIMARY KEY,
    company_id CHAR(36) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    name_fr VARCHAR(255) NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS zones (
    id CHAR(36) PRIMARY KEY,
    site_id CHAR(36) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    name_fr VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS subscriptions (
    id CHAR(36) PRIMARY KEY,
    company_id CHAR(36) NOT NULL,
    plan_id CHAR(36) NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    status ENUM('trial', 'active', 'expired', 'cancelled') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES subscription_plans(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS payments (
    id CHAR(36) PRIMARY KEY,
    company_id CHAR(36) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency CHAR(3) NOT NULL,
    provider VARCHAR(50) NOT NULL, -- 'stripe', 'razorpay', 'mobile_money'
    status ENUM('pending', 'success', 'failed') DEFAULT 'pending',
    transaction_reference VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);


-- 2. USERS (SaaS Roles expanded)
CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY,
    company_id CHAR(36) NULL, -- Allow NULL strictly for super_admin root accounts
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('super_admin', 'admin', 'manager', 'technician', 'client') DEFAULT 'client',
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    UNIQUE INDEX idx_company_email (company_id, email, deleted_at)
);


-- ==========================================
-- ASSETS (Strict Bilingual)
-- ==========================================

CREATE TABLE IF NOT EXISTS assets (
    id CHAR(36) PRIMARY KEY,
    company_id CHAR(36) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    name_fr VARCHAR(255) NOT NULL,
    description_en TEXT,
    description_fr TEXT,
    serial_number VARCHAR(100),
    status ENUM('active', 'maintenance', 'retired') DEFAULT 'active',
    location VARCHAR(255),
    acquired_at DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    INDEX idx_company_asset_status (company_id, status),
    required_certification_id CHAR(36) NULL
);


-- ==========================================
-- INVENTORY ITEMS (Strict Bilingual)
-- ==========================================

CREATE TABLE IF NOT EXISTS suppliers (
    id CHAR(36) PRIMARY KEY,
    company_id CHAR(36) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    name_fr VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS inventory_items (
    id CHAR(36) PRIMARY KEY,
    company_id CHAR(36) NOT NULL,
    supplier_id CHAR(36) NULL,
    name_en VARCHAR(255) NOT NULL,
    name_fr VARCHAR(255) NOT NULL,
    sku VARCHAR(100),
    quantity DECIMAL(10,2) DEFAULT 0,
    minimum_quantity DECIMAL(10,2) DEFAULT 0,
    price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL,
    UNIQUE INDEX idx_company_sku (company_id, sku, deleted_at)
);


-- ==========================================
-- WORK ORDERS (Strict Bilingual + Cost Tracking)
-- ==========================================

CREATE TABLE IF NOT EXISTS work_orders (
    id CHAR(36) PRIMARY KEY,
    company_id CHAR(36) NOT NULL,
    asset_id CHAR(36) NOT NULL,
    creator_id CHAR(36) NOT NULL,
    assigned_to CHAR(36) NULL,
    type ENUM('preventive', 'corrective') NOT NULL,
    priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    status ENUM('pending', 'in_progress', 'on_hold', 'completed', 'cancelled') DEFAULT 'pending',
    estimated_labor_cost DECIMAL(10,2) DEFAULT 0.00,
    actual_labor_cost DECIMAL(10,2) DEFAULT 0.00,
    scheduled_date DATETIME,
    completed_date DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_company_wo_status (company_id, status),
    INDEX idx_company_wo_assigned (company_id, assigned_to)
);

CREATE TABLE IF NOT EXISTS work_order_translations (
    id CHAR(36) PRIMARY KEY,
    work_order_id CHAR(36) NOT NULL,
    language_code CHAR(2) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    FOREIGN KEY (work_order_id) REFERENCES work_orders(id) ON DELETE CASCADE,
    UNIQUE INDEX idx_unique_wo_lang (work_order_id, language_code)
);

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
    action VARCHAR(255) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (work_order_id) REFERENCES work_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ==========================================
-- PREVENTIVE SCHEDULING (CRON-LIKE)
-- ==========================================

CREATE TABLE IF NOT EXISTS maintenance_schedules (
    id CHAR(36) PRIMARY KEY,
    company_id CHAR(36) NOT NULL,
    asset_id CHAR(36) NOT NULL,
    last_run TIMESTAMP NULL,
    next_run TIMESTAMP NULL,
    recurrence_rule VARCHAR(100), -- CRON expression or JSON
    status ENUM('active', 'paused') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE
);

-- ==========================================
-- PREDICTIVE ANALYTICS
-- ==========================================

CREATE TABLE IF NOT EXISTS failure_predictions (
    id CHAR(36) PRIMARY KEY,
    asset_id CHAR(36) NOT NULL,
    predicted_failure_date DATE NOT NULL,
    confidence_score DECIMAL(5,2),
    recommendation_en TEXT,
    recommendation_fr TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS work_order_parts (
    id CHAR(36) PRIMARY KEY,
    company_id CHAR(36) NOT NULL,
    work_order_id CHAR(36) NOT NULL,
    inventory_item_id CHAR(36) NOT NULL,
    quantity_used DECIMAL(10,2) NOT NULL,
    cost_per_unit DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (work_order_id) REFERENCES work_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (inventory_item_id) REFERENCES inventory_items(id) ON DELETE CASCADE
);


-- ==========================================
-- NOTIFICATIONS AND LOGS
-- ==========================================

CREATE TABLE IF NOT EXISTS notifications (
    id CHAR(36) PRIMARY KEY,
    company_id CHAR(36) NOT NULL,
    user_id CHAR(36) NULL, -- Optional for specific targeting
    type VARCHAR(50) DEFAULT 'system', -- anomaly, prediction, inventory, system
    title_en VARCHAR(255),
    title_fr VARCHAR(255),
    message_en TEXT NOT NULL,
    message_fr TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id CHAR(36) PRIMARY KEY,
    company_id CHAR(36) NULL,
    user_id CHAR(36) NULL,
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id CHAR(36) NOT NULL,
    details JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ==========================================
-- ADVANCED RBAC
-- ==========================================

CREATE TABLE IF NOT EXISTS permissions (
    id CHAR(36) PRIMARY KEY,
    name_en VARCHAR(100) NOT NULL UNIQUE,
    name_fr VARCHAR(100) NOT NULL UNIQUE,
    module VARCHAR(50) NOT NULL, -- e.g., 'assets', 'inventory'
    action VARCHAR(20) NOT NULL, -- e.g., 'create', 'edit', 'delete'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS role_permissions (
    role ENUM('super_admin', 'tenant_admin', 'manager', 'technician', 'viewer') NOT NULL,
    permission_id CHAR(36) NOT NULL,
    PRIMARY KEY (role, permission_id),
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- ==========================================
-- IOT TELEMETRY & DIGITAL TWINS
-- ==========================================

CREATE TABLE IF NOT EXISTS asset_sensor_configs (
    id CHAR(36) PRIMARY KEY,
    asset_id CHAR(36) NOT NULL,
    sensor_type ENUM('temperature', 'pressure', 'vibration', 'humidity') NOT NULL,
    min_threshold DECIMAL(10,2) DEFAULT NULL,
    max_threshold DECIMAL(10,2) DEFAULT NULL,
    unit VARCHAR(20) NOT NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS iot_readings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    asset_id CHAR(36) NOT NULL,
    sensor_type VARCHAR(50) NOT NULL,
    reading_value DECIMAL(10,4) NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_asset_sensor (asset_id, sensor_type),
    INDEX idx_recorded_at (recorded_at),
    FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE
);

-- ==========================================
-- MARKET COMPETITIVE EXPANSION
-- ==========================================

-- 1. PROCUREMENT & AUTO-REPLENISHMENT
CREATE TABLE IF NOT EXISTS purchase_orders (
    id CHAR(36) PRIMARY KEY,
    company_id CHAR(36) NOT NULL,
    item_id CHAR(36) NOT NULL,
    supplier_id CHAR(36) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    total_cost DECIMAL(10,2) NOT NULL,
    status ENUM('draft', 'sent', 'received', 'cancelled') DEFAULT 'draft',
    sent_at TIMESTAMP NULL,
    received_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES inventory_items(id) ON DELETE CASCADE,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE
);

-- 2. ENERGY & ESG ANALYTICS
CREATE TABLE IF NOT EXISTS energy_readings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    asset_id CHAR(36) NOT NULL,
    consumption_kwh DECIMAL(10,4) NOT NULL,
    voltage_spike DECIMAL(5,2) DEFAULT 0.00,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE,
    INDEX idx_asset_energy (asset_id, recorded_at)
);

-- 3. WORKFORCE EFFICIENCY ANALYTICS
CREATE TABLE IF NOT EXISTS technician_kpis (
    id CHAR(36) PRIMARY KEY,
    company_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    avg_repair_time_minutes INT DEFAULT 0,
    tasks_completed_count INT DEFAULT 0,
    quality_score DECIMAL(3,2) DEFAULT 0.00,
    recorded_date DATE NOT NULL,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE INDEX idx_user_date (user_id, recorded_date)
);

-- ==========================================
-- SAAS ONBOARDING & APPROVAL WORKFLOW
-- ==========================================

CREATE TABLE IF NOT EXISTS registration_requests (
    id CHAR(36) PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    industry VARCHAR(100) NOT NULL,
    admin_first_name VARCHAR(100) NOT NULL,
    admin_last_name VARCHAR(100) NOT NULL,
    admin_email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP NULL,
    processed_by CHAR(36) NULL,
    FOREIGN KEY (processed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ==========================================
-- STRATEGIC ROADMAP MODULES (Market Leader)
-- ==========================================

-- 1. EHS & DIGITAL SAFETY PERMITS
CREATE TABLE IF NOT EXISTS safety_permits (
    id CHAR(36) PRIMARY KEY,
    work_order_id CHAR(36) NOT NULL,
    technician_id CHAR(36) NOT NULL,
    checklist_json JSON NOT NULL, -- Detailed safety steps
    lockout_photo_url VARCHAR(255),
    status ENUM('pending', 'locked', 'unlocked', 'violated') DEFAULT 'pending',
    signed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (work_order_id) REFERENCES work_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (technician_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 2. ASSET FINANCIAL LIFE-CYCLE
CREATE TABLE IF NOT EXISTS asset_financial_models (
    id CHAR(36) PRIMARY KEY,
    asset_id CHAR(36) UNIQUE NOT NULL,
    purchase_price DECIMAL(15,2) NOT NULL,
    salvage_value DECIMAL(15,2) DEFAULT 0.00,
    useful_life_years INT NOT NULL,
    depreciation_method ENUM('straight_line', 'double_declining') DEFAULT 'straight_line',
    last_valuation_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE
);

-- 3. DYNAMIC GIS & TELEMATICS
CREATE TABLE IF NOT EXISTS asset_telemetrics (
    id CHAR(36) PRIMARY KEY,
    asset_id CHAR(36) NOT NULL,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    fuel_level_percent DECIMAL(5,2),
    odometer_km DECIMAL(15,2),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE
);

-- 4. COLLABORATIVE EXPERT SESSIONS
CREATE TABLE IF NOT EXISTS expert_sessions (
    id CHAR(36) PRIMARY KEY,
    work_order_id CHAR(36) NOT NULL,
    expert_id CHAR(36) NOT NULL,
    field_tech_id CHAR(36) NOT NULL,
    session_token VARCHAR(255), -- For WebRTC/Live Streaming
    recorded_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (work_order_id) REFERENCES work_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (expert_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (field_tech_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. INDUSTRIAL SKILL-MATRIX & CERTIFICATIONS
CREATE TABLE IF NOT EXISTS certifications (
    id CHAR(36) PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL,
    name_fr VARCHAR(255) NOT NULL,
    authority VARCHAR(255),
    validity_months INT DEFAULT 12,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_certifications (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    certification_id CHAR(36) NOT NULL,
    certificate_number VARCHAR(100),
    issued_at DATE NOT NULL,
    expires_at DATE NOT NULL,
    document_url VARCHAR(255), -- PDF scan of the certificate
    status ENUM('active', 'expired', 'revoked') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (certification_id) REFERENCES certifications(id) ON DELETE CASCADE
);

-- Link Assets to required certifications for maintenance (Moved to assets table definition)
-- ALTER TABLE assets ADD COLUMN required_certification_id CHAR(36) NULL;
-- 7. AUTONOMOUS AI ENGINE & PRESCRIPTIVE LOGIC
CREATE TABLE IF NOT EXISTS ai_prescriptions (
    id CHAR(36) PRIMARY KEY,
    asset_id CHAR(36) NOT NULL,
    prediction_score DECIMAL(5,2), -- Probability of failure
    rul_estimated_days INT, -- Remaining Useful Life
    recommended_action ENUM('repair', 'replace', 'monitor', 'overhaul') NOT NULL,
    prescriptive_note_en TEXT,
    prescriptive_note_fr TEXT,
    cost_saving_estimate DECIMAL(15,2),
    is_auto_generated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE
);

-- 8. DIGITAL TWIN SYSTEM
CREATE TABLE IF NOT EXISTS digital_twin_snapshots (
    id CHAR(36) PRIMARY KEY,
    asset_id CHAR(36) NOT NULL,
    state_json JSON NOT NULL, -- Full 3D/Parameter state
    simulation_mode ENUM('realtime', 'what-if', 'historical') DEFAULT 'realtime',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE
);

-- 9. ESG & ENERGY INTELLIGENCE
CREATE TABLE IF NOT EXISTS esg_telemetry (
    id CHAR(36) PRIMARY KEY,
    company_id CHAR(36) NOT NULL,
    asset_id CHAR(36),
    energy_kwh DECIMAL(15,2),
    carbon_footprint_kg DECIMAL(15,2),
    water_usage_m3 DECIMAL(15,2),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- 10. BLOCKCHAIN AUDIT LAYER (Immutable Hash Chaining)
CREATE TABLE IF NOT EXISTS blockchain_ledger (
    id CHAR(36) PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL, -- 'work_order', 'safety_permit', 'inventory'
    entity_id CHAR(36) NOT NULL,
    data_hash CHAR(64) NOT NULL, -- SHA-256 of the event data
    previous_hash CHAR(64), -- Link to previous block for integrity
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. CONTRACT & SLA MANAGEMENT
CREATE TABLE IF NOT EXISTS sla_contracts (
    id CHAR(36) PRIMARY KEY,
    company_id CHAR(36) NOT NULL,
    vendor_id VARCHAR(255),
    response_time_limit_mins INT,
    uptime_guarantee_percent DECIMAL(5,2),
    penalty_per_hour DECIMAL(10,2),
    expires_at DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- 12. OT CYBERSECURITY & ANOMALY ALERTS
CREATE TABLE IF NOT EXISTS ot_security_alerts (
    id CHAR(36) PRIMARY KEY,
    asset_id CHAR(36),
    risk_score INT, -- 0-100
    anomaly_type VARCHAR(100),
    network_origin VARCHAR(100),
    status ENUM('investigating', 'mitigated', 'threat') DEFAULT 'investigating',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. SMART WAREHOUSE & LOGISTICS
CREATE TABLE IF NOT EXISTS warehouse_locations (
    id CHAR(36) PRIMARY KEY,
    company_id CHAR(36) NOT NULL,
    site_id CHAR(36),
    name VARCHAR(255) NOT NULL, -- e.g. "Main Hangar - Row A"
    qr_code CHAR(64) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS inventory_transactions (
    id CHAR(36) PRIMARY KEY,
    inventory_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    from_location_id CHAR(36),
    to_location_id CHAR(36),
    quantity_change DECIMAL(10,2) NOT NULL,
    transaction_type ENUM('purchase', 'consumption', 'transfer', 'adjustment', 'return') NOT NULL,
    reference_id VARCHAR(100), -- Work Order ID or Purchase ID
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (inventory_id) REFERENCES inventory_items(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Update inventory table to support QR and location
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS qr_id CHAR(64) UNIQUE;
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS current_location_id CHAR(36);
ALTER TABLE inventory_items ADD CONSTRAINT fk_inv_loc FOREIGN KEY (current_location_id) REFERENCES warehouse_locations(id) ON DELETE SET NULL;

-- 13. INTEGRATION HUB & API PLATFORM
CREATE TABLE IF NOT EXISTS integration_webhooks (
    id CHAR(36) PRIMARY KEY,
    company_id CHAR(36) NOT NULL,
    url VARCHAR(255) NOT NULL,
    event_type VARCHAR(100) NOT NULL, -- 'work_order.created', 'iot.alert'
    secret_key VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS system_plugins (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category ENUM('erp', 'iot', 'gis', 'custom') NOT NULL,
    config_schema JSON, -- Metadata explaining inputs
    is_global BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
