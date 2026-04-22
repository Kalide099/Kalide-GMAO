-- v1_bilingual_refactor.sql
-- Refactoring Work Orders and standardizing bilingual naming conventions across the SaaS fleet.

USE kgmao_db;

-- 1. REFACTOR WORK ORDERS to TRANSLATION TABLE PATTERN
-- Create translation table as requested
CREATE TABLE IF NOT EXISTS work_order_translations (
    id CHAR(36) PRIMARY KEY,
    work_order_id CHAR(36) NOT NULL,
    language_code CHAR(2) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    FOREIGN KEY (work_order_id) REFERENCES work_orders(id) ON DELETE CASCADE,
    UNIQUE INDEX idx_unique_wo_lang (work_order_id, language_code)
);

-- Migrate existing data from title_en/fr to the new table
INSERT IGNORE INTO work_order_translations (id, work_order_id, language_code, title, description)
SELECT UUID(), id, 'en', title_en, description_en FROM work_orders;

INSERT IGNORE INTO work_order_translations (id, work_order_id, language_code, title, description)
SELECT UUID(), id, 'fr', title_fr, description_fr FROM work_orders;

-- Remove legacy columns from work_orders
ALTER TABLE work_orders DROP COLUMN title_en;
ALTER TABLE work_orders DROP COLUMN title_fr;
ALTER TABLE work_orders DROP COLUMN description_en;
ALTER TABLE work_orders DROP COLUMN description_fr;

-- 2. STANDARDIZE COMPANIES (Ensure name_en/fr exists, remove generic 'name')
-- Checking schema, it already uses name_en/fr. Ensuring no generic 'name' exists.
-- IF EXISTS (SELECT * FROM information_schema.columns WHERE table_name = 'companies' AND column_name = 'name')
-- THEN ALTER TABLE companies DROP COLUMN name;

-- 3. STANDARDIZE SUPPLIERS (Currently uses 'name')
ALTER TABLE suppliers ADD COLUMN name_en VARCHAR(255) AFTER id;
ALTER TABLE suppliers ADD COLUMN name_fr VARCHAR(255) AFTER name_en;

UPDATE suppliers SET name_en = name, name_fr = name;
ALTER TABLE suppliers DROP COLUMN name;

-- 4. IMPLEMENT MIGRATION TRACKING
CREATE TABLE IF NOT EXISTS migrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    version VARCHAR(255) NOT NULL UNIQUE,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO migrations (version) VALUES ('v1_bilingual_refactor');
