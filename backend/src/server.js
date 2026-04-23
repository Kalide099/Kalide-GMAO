require('dotenv').config();
const app = require('./app');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Self-heal: Create database if it doesn't exist
        const bootstrapConn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });
        await bootstrapConn.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
        await bootstrapConn.end();

        // Now we can safely use the pool
        const pool = require('./config/db');
        const connection = await pool.getConnection();
        console.log('✅ Connected to MySQL database via connection pool.');
        
        // Ensure CORE tables exist before seeding
        await connection.query(`
            CREATE TABLE IF NOT EXISTS companies (
                id CHAR(36) PRIMARY KEY,
                name_en VARCHAR(255) NOT NULL,
                name_fr VARCHAR(255) NOT NULL,
                industry_en VARCHAR(100),
                industry_fr VARCHAR(100),
                subscription_status ENUM('trial', 'active', 'suspended', 'expired', 'cancelled') DEFAULT 'trial',
                plan ENUM('basic', 'pro', 'enterprise') DEFAULT 'basic',
                enabled_modules JSON NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id CHAR(36) PRIMARY KEY,
                company_id CHAR(36) NULL,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                email VARCHAR(255) NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role ENUM('super_admin', 'admin', 'manager', 'technician', 'client') DEFAULT 'client',
                status ENUM('active', 'inactive') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP NULL,
                FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
            )
        `);

        // Ensure onboarding table exists
        await connection.query(`
            CREATE TABLE IF NOT EXISTS registration_requests (
                id CHAR(36) PRIMARY KEY,
                company_name VARCHAR(255) NOT NULL,
                industry ENUM('manufacturing', 'energy', 'oil_gas', 'logistics', 'mining') NOT NULL,
                admin_first_name VARCHAR(100) NOT NULL,
                admin_last_name VARCHAR(100) NOT NULL,
                admin_email VARCHAR(255) NOT NULL,
                status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                processed_at TIMESTAMP NULL,
                processed_by CHAR(36) NULL,
                FOREIGN KEY (processed_by) REFERENCES users(id) ON DELETE SET NULL
            )
        `);

        // 7. AUTONOMOUS AI ENGINE
        await connection.query(`
            CREATE TABLE IF NOT EXISTS ai_prescriptions (
                id CHAR(36) PRIMARY KEY,
                asset_id CHAR(36) NOT NULL,
                prediction_score DECIMAL(5,2),
                rul_estimated_days INT,
                recommended_action ENUM('repair', 'replace', 'monitor', 'overhaul') NOT NULL,
                prescriptive_note_en TEXT,
                prescriptive_note_fr TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 8. BLOCKCHAIN AUDIT LAYER
        await connection.query(`
            CREATE TABLE IF NOT EXISTS blockchain_ledger (
                id CHAR(36) PRIMARY KEY,
                entity_type VARCHAR(50) NOT NULL,
                entity_id CHAR(36) NOT NULL,
                data_hash CHAR(64) NOT NULL,
                previous_hash CHAR(64),
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 9. ESG & ENERGY
        await connection.query(`
            CREATE TABLE IF NOT EXISTS esg_telemetry (
                id CHAR(36) PRIMARY KEY,
                company_id CHAR(36) NOT NULL,
                energy_kwh DECIMAL(15,2),
                carbon_footprint_kg DECIMAL(15,2),
                recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Ensure enabled_modules column exists in companies
        try {
            await connection.query('ALTER TABLE companies ADD COLUMN enabled_modules JSON NULL AFTER subscription_status');
        } catch (err) {}

        // --- 11. FINANCE & SUBCONTRACTING ---
        await connection.query(`
            CREATE TABLE IF NOT EXISTS subcontractor_matrix (
                id VARCHAR(36) PRIMARY KEY,
                company_id VARCHAR(36),
                name VARCHAR(255),
                category VARCHAR(100),
                rating DECIMAL(3,2),
                contact_email VARCHAR(255),
                status ENUM('active', 'inactive', 'blacklisted') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX (company_id)
            )
        `);

        // --- 12. NEXUS MODULE: ROOT CAUSE ANALYSIS (RCA) ---
        await connection.query(`
            CREATE TABLE IF NOT EXISTS rca_reports (
                id VARCHAR(36) PRIMARY KEY,
                company_id VARCHAR(36),
                work_order_id VARCHAR(36),
                asset_id VARCHAR(36),
                title_en VARCHAR(255),
                title_fr VARCHAR(255),
                status ENUM('draft', 'under_review', 'finalized') DEFAULT 'draft',
                whys_json JSON,
                ishikawa_json JSON,
                fta_json JSON,
                created_by VARCHAR(36),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX (company_id)
            )
        `);

        // --- 13. NEXUS MODULE: RCM + FMEA (AMDEC) ---
        await connection.query(`
            CREATE TABLE IF NOT EXISTS fmea_analysis (
                id VARCHAR(36) PRIMARY KEY,
                company_id VARCHAR(36),
                asset_id VARCHAR(36),
                failure_mode_en TEXT,
                failure_mode_fr TEXT,
                effects_en TEXT,
                effects_fr TEXT,
                severity INT DEFAULT 1,
                occurrence INT DEFAULT 1,
                detection INT DEFAULT 1,
                rpn INT GENERATED ALWAYS AS (severity * occurrence * detection) STORED,
                recommended_action TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX (company_id)
            )
        `);

        // --- 14. NEXUS MODULE: LOTO (LOCKOUT TAGOUT) ---
        await connection.query(`
            CREATE TABLE IF NOT EXISTS loto_procedures (
                id VARCHAR(36) PRIMARY KEY,
                company_id VARCHAR(36),
                asset_id VARCHAR(36),
                title_en VARCHAR(255),
                title_fr VARCHAR(255),
                steps_json JSON,
                energy_sources JSON,
                required_approvals INT DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX (company_id)
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS loto_logs (
                id VARCHAR(36) PRIMARY KEY,
                company_id VARCHAR(36),
                procedure_id VARCHAR(36),
                user_id VARCHAR(36),
                action ENUM('isolated', 'verified', 'reenergized'),
                signature_data TEXT,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX (company_id)
            )
        `);

        // --- 15. NEXUS MODULE: CALIBRATION ---
        await connection.query(`
            CREATE TABLE IF NOT EXISTS instruments (
                id VARCHAR(36) PRIMARY KEY,
                company_id VARCHAR(36),
                asset_id VARCHAR(36),
                tag_number VARCHAR(100),
                range_min DECIMAL(15,2),
                range_max DECIMAL(15,2),
                unit VARCHAR(20),
                calibration_cycle_days INT,
                last_calibration_date DATE,
                next_calibration_due DATE,
                status ENUM('nominal', 'drift_detected', 'expired') DEFAULT 'nominal',
                INDEX (company_id)
            )
        `);

        // --- 16. NEXUS MODULE: DMS (DOCUMENT MANAGEMENT) ---
        await connection.query(`
            CREATE TABLE IF NOT EXISTS document_vault (
                id VARCHAR(36) PRIMARY KEY,
                company_id VARCHAR(36),
                entity_type ENUM('asset', 'work_order', 'rca', 'contract'),
                entity_id VARCHAR(36),
                file_name VARCHAR(255),
                file_type VARCHAR(50),
                file_url TEXT,
                storage_provider ENUM('local', 's3', 'azure_blob'),
                uploaded_by VARCHAR(36),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX (company_id)
            )
        `);

        // --- 17. NEXUS MODULE: TPM (AUTONOMOUS MAINTENANCE) ---
        await connection.query(`
            CREATE TABLE IF NOT EXISTS tpm_checklists (
                id VARCHAR(36) PRIMARY KEY,
                company_id VARCHAR(36),
                asset_id VARCHAR(36),
                operator_id VARCHAR(36),
                items_json JSON,
                anomaly_detected BOOLEAN DEFAULT FALSE,
                image_evidence_url TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX (company_id)
            )
        `);

        // 10. AUDIT & LOGGING
        await connection.query(`
            CREATE TABLE IF NOT EXISTS audit_logs (
                id CHAR(36) PRIMARY KEY,
                company_id CHAR(36),
                user_id CHAR(36),
                action VARCHAR(100) NOT NULL,
                entity_type VARCHAR(50),
                entity_id CHAR(36),
                details JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
            )
        `);

        // 11. FINANCE & PAYMENTS
        await connection.query(`
            CREATE TABLE IF NOT EXISTS payments (
                id CHAR(36) PRIMARY KEY,
                company_id CHAR(36) NOT NULL,
                amount DECIMAL(15,2) NOT NULL,
                currency VARCHAR(10) DEFAULT 'USD',
                status ENUM('pending', 'success', 'failed') DEFAULT 'pending',
                provider VARCHAR(50),
                provider_transaction_id VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
            )
        `);

        // 12. ASSET DEPTH (Financials & Telematics)
        await connection.query(`
            CREATE TABLE IF NOT EXISTS asset_financial_models (
                id CHAR(36) PRIMARY KEY,
                asset_id CHAR(36) NOT NULL,
                purchase_price DECIMAL(15,2),
                salvage_value DECIMAL(15,2),
                useful_life_years INT,
                depreciation_method ENUM('straight_line', 'double_declining') DEFAULT 'straight_line',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS asset_telemetrics (
                id CHAR(36) PRIMARY KEY,
                asset_id CHAR(36) NOT NULL,
                latitude DECIMAL(10,8),
                longitude DECIMAL(11,8),
                fuel_level_percent DECIMAL(5,2),
                odometer_km DECIMAL(15,2),
                recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE
            )
        `);

        // 13. SAFETY & COMPLIANCE
        await connection.query(`
            CREATE TABLE IF NOT EXISTS safety_permits (
                id CHAR(36) PRIMARY KEY,
                work_order_id CHAR(36) NOT NULL,
                technician_id CHAR(36) NOT NULL,
                checklist_json JSON,
                status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (work_order_id) REFERENCES work_orders(id) ON DELETE CASCADE,
                FOREIGN KEY (technician_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // Ensure required_certification_id exists in assets
        try {
            await connection.query('ALTER TABLE assets ADD COLUMN required_certification_id CHAR(36) NULL');
        } catch (err) {}

        // Create certifications table if missing
        await connection.query(`
            CREATE TABLE IF NOT EXISTS certifications (
                id CHAR(36) PRIMARY KEY,
                name_en VARCHAR(255) NOT NULL,
                name_fr VARCHAR(255) NOT NULL,
                authority VARCHAR(255),
                validity_months INT DEFAULT 12,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Ensure ASSETS and INVENTORY exist before ALTER
        await connection.query(`
            CREATE TABLE IF NOT EXISTS assets (
                id CHAR(36) PRIMARY KEY,
                company_id CHAR(36) NOT NULL,
                name_en VARCHAR(255) NOT NULL,
                name_fr VARCHAR(255) NOT NULL,
                status ENUM('active', 'maintenance', 'retired') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS inventory_items (
                id CHAR(36) PRIMARY KEY,
                company_id CHAR(36) NOT NULL,
                name_en VARCHAR(255) NOT NULL,
                name_fr VARCHAR(255) NOT NULL,
                quantity DECIMAL(10,2) DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
            )
        `);

        // Create user_certifications table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS user_certifications (
                id CHAR(36) PRIMARY KEY,
                user_id CHAR(36) NOT NULL,
                certification_id CHAR(36) NOT NULL,
                certificate_number VARCHAR(100),
                issued_at DATE NOT NULL,
                expires_at DATE NOT NULL,
                document_url VARCHAR(255),
                status ENUM('active', 'expired', 'revoked') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (certification_id) REFERENCES certifications(id) ON DELETE CASCADE
            )
        `);

        // Ensure QR and Location columns in inventory_items
        try {
            await connection.query('ALTER TABLE inventory_items ADD COLUMN qr_id CHAR(64) UNIQUE');
        } catch (err) {}
        try {
            await connection.query('ALTER TABLE inventory_items ADD COLUMN current_location_id CHAR(36)');
        } catch (err) {}

        // Create warehouse_locations
        await connection.query(`
            CREATE TABLE IF NOT EXISTS warehouse_locations (
                id CHAR(36) PRIMARY KEY,
                company_id CHAR(36) NOT NULL,
                name VARCHAR(255) NOT NULL,
                qr_code CHAR(64) UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 14. GEOGRAPHIC SITES (War Room / GIS)
        await connection.query(`
            CREATE TABLE IF NOT EXISTS sites (
                id CHAR(36) PRIMARY KEY,
                company_id CHAR(36) NOT NULL,
                name_en VARCHAR(255) NOT NULL,
                name_fr VARCHAR(255) NOT NULL,
                address VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
            )
        `);

        // Create inventory_transactions
        await connection.query(`
            CREATE TABLE IF NOT EXISTS inventory_transactions (
                id CHAR(36) PRIMARY KEY,
                inventory_id CHAR(36) NOT NULL,
                user_id CHAR(36) NOT NULL,
                quantity_change DECIMAL(10,2) NOT NULL,
                transaction_type ENUM('purchase', 'consumption', 'transfer', 'adjustment', 'return') NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (inventory_id) REFERENCES inventory_items(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // SEEDING LOGIC (Self-healing credentials)
        
        // 1. Ensure Super Admin
        const [superAdmins] = await connection.query("SELECT id FROM users WHERE email = 'root@kgmao.com'");
        if (superAdmins.length === 0) {
            const hash = await bcrypt.hash('RootMaster2026!', 10);
            await connection.query(
                "INSERT INTO users (id, first_name, last_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?, ?)",
                [uuidv4(), 'Super', 'Admin', 'root@kgmao.com', hash, 'super_admin']
            );
            console.log("✅ Seeded Super Admin: root@kgmao.com / RootMaster2026!");
        }

        // 2. Ensure Test Company & Admin
        const [companies] = await connection.query("SELECT id FROM companies WHERE name_en = 'Alpha Omega Corp'");
        let companyId;
        if (companies.length === 0) {
            companyId = uuidv4();
            await connection.query(
                "INSERT INTO companies (id, name_en, name_fr, industry_en, industry_fr, subscription_status, enabled_modules) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [companyId, 'Alpha Omega Corp', 'Alpha Omega Corp', 'manufacturing', 'manufacturing', 'active', JSON.stringify(['safety', 'finance', 'gis', 'iot', 'predictive', 'command', 'twin', 'ar', 'hub', 'esg'])]
            );
        } else {
            companyId = companies[0].id;
        }

        const [admins] = await connection.query("SELECT id FROM users WHERE email = 'omega@kgmao.com'");
        if (admins.length === 0) {
            const hash = await bcrypt.hash('OmegaPassword2026!', 10);
            await connection.query(
                "INSERT INTO users (id, company_id, first_name, last_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [uuidv4(), companyId, 'Omega', 'Admin', 'omega@kgmao.com', hash, 'admin']
            );
            console.log("✅ Seeded Admin: omega@kgmao.com / OmegaPassword2026!");
        }

        // 3. Ensure Geographic Sites for War Room
        const [existingSites] = await connection.query("SELECT id FROM sites WHERE company_id = ?", [companyId]);
        if (existingSites.length === 0) {
            const sites = [
                { id: uuidv4(), en: 'North America Hub', fr: 'Hub Amérique du Nord', addr: 'Detroit, USA' },
                { id: uuidv4(), en: 'Euro Cluster Alpha', fr: 'Cluster Euro Alpha', addr: 'Berlin, Germany' },
                { id: uuidv4(), en: 'Asia Matrix Node', fr: 'Nœud Matrice Asie', addr: 'Singapore' },
                { id: uuidv4(), en: 'MENA Gateway', fr: 'Portail MENA', addr: 'Dubai, UAE' },
                { id: uuidv4(), en: 'South Shield', fr: 'Bouclier Sud', addr: 'Sao Paulo, Brazil' }
            ];
            for (const s of sites) {
                await connection.query(
                    "INSERT INTO sites (id, company_id, name_en, name_fr, address) VALUES (?, ?, ?, ?, ?)",
                    [s.id, companyId, s.en, s.fr, s.addr]
                );
            }
            console.log("✅ Seeded 5 Global Strategic Sites for War Room.");
        }

        await connection.query(`
            CREATE TABLE IF NOT EXISTS work_orders (
                id CHAR(36) PRIMARY KEY,
                company_id CHAR(36) NOT NULL,
                asset_id CHAR(36) NOT NULL,
                creator_id CHAR(36) NOT NULL,
                assigned_to CHAR(36),
                type ENUM('preventive', 'corrective', 'predictive', 'inspection') DEFAULT 'corrective',
                priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
                status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
                scheduled_date DATETIME,
                completed_date DATETIME,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP NULL,
                FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS work_order_translations (
                id CHAR(36) PRIMARY KEY,
                work_order_id CHAR(36) NOT NULL,
                language_code CHAR(2) NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                UNIQUE INDEX idx_unique_wo_lang (work_order_id, language_code),
                FOREIGN KEY (work_order_id) REFERENCES work_orders(id) ON DELETE CASCADE
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS work_order_history (
                id CHAR(36) PRIMARY KEY,
                company_id CHAR(36) NOT NULL,
                work_order_id CHAR(36) NOT NULL,
                user_id CHAR(36),
                action VARCHAR(100) NOT NULL,
                old_value TEXT,
                new_value TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
                FOREIGN KEY (work_order_id) REFERENCES work_orders(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS work_order_comments (
                id CHAR(36) PRIMARY KEY,
                company_id CHAR(36) NOT NULL,
                work_order_id CHAR(36) NOT NULL,
                user_id CHAR(36) NOT NULL,
                comment TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (work_order_id) REFERENCES work_orders(id) ON DELETE CASCADE
            )
        `);
        
        // --- GLOBAL BILINGUAL ENFORCEMENT PATCH ---
        try {
            // Work Orders
            await connection.query('ALTER TABLE work_orders ADD COLUMN title_en VARCHAR(255) NULL AFTER assigned_to');
            await connection.query('ALTER TABLE work_orders ADD COLUMN title_fr VARCHAR(255) NULL AFTER title_en');
            await connection.query('ALTER TABLE work_orders ADD COLUMN description_en TEXT NULL AFTER title_fr');
            await connection.query('ALTER TABLE work_orders ADD COLUMN description_fr TEXT NULL AFTER description_en');
            
            // Instruments
            await connection.query('ALTER TABLE instruments ADD COLUMN name_en VARCHAR(255) NULL AFTER asset_id');
            await connection.query('ALTER TABLE instruments ADD COLUMN name_fr VARCHAR(255) NULL AFTER name_en');
            
            // Document Vault
            await connection.query('ALTER TABLE document_vault ADD COLUMN description_en TEXT NULL AFTER file_name');
            await connection.query('ALTER TABLE document_vault ADD COLUMN description_fr TEXT NULL AFTER description_en');
            
            // TPM
            await connection.query('ALTER TABLE tpm_checklists ADD COLUMN title_en VARCHAR(255) NULL AFTER asset_id');
            await connection.query('ALTER TABLE tpm_checklists ADD COLUMN title_fr VARCHAR(255) NULL AFTER title_en');
            
            // FMEA (Extend existing)
            await connection.query('ALTER TABLE fmea_analysis ADD COLUMN recommended_action_en TEXT NULL AFTER detection');
            await connection.query('ALTER TABLE fmea_analysis ADD COLUMN recommended_action_fr TEXT NULL AFTER recommended_action_en');
            
            // LOTO Logs
            await connection.query('ALTER TABLE loto_logs ADD COLUMN notes_en TEXT NULL AFTER signature_data');
            await connection.query('ALTER TABLE loto_logs ADD COLUMN notes_fr TEXT NULL AFTER notes_en');

            // Companies
            await connection.query('ALTER TABLE companies ADD COLUMN plan ENUM("basic", "pro", "enterprise") DEFAULT "basic" AFTER subscription_status');

            console.log("🛠️ INTELLIGENT PATCH: Global Bilingual Alignment SUCCESS.");
        } catch (err) {
            // Ignoring errors if columns already exist
        }

        connection.release();

        app.listen(PORT, () => {
            console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        });

    } catch (error) {
        console.error('❌ Unable to connect to the database or start server:', error.message);
        process.exit(1);
    }
};

startServer();
