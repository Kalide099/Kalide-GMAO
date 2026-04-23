const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

/**
 * Migration Engine
 * Automatically applies SQL migrations in sequential order.
 */

async function runMigrations() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'kgmao_db',
        multipleStatements: true
    });

    try {
        console.log("🚀 Starting SaaS Schema Migrations...");

        const migrationsDir = path.join(__dirname, '..', '..', 'database', 'migrations');
        const migrationFiles = fs.readdirSync(migrationsDir).sort();

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
                INDEX (company_id),
                INDEX (asset_id)
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
                INDEX (company_id),
                INDEX (asset_id)
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
                INDEX (company_id),
                INDEX (procedure_id)
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
                INDEX (company_id),
                INDEX (next_calibration_due)
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
                INDEX (company_id),
                INDEX (entity_id)
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

        console.log("INDUSTRIAL DATABASE EVOLUTION: Global Nexus Schema Stabilized.");

        // Ensure migrations table exists
        await connection.query(`
            CREATE TABLE IF NOT EXISTS migrations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                version VARCHAR(255) NOT NULL UNIQUE,
                executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        for (const file of migrationFiles) {
            if (file.endsWith('.sql')) {
                const versionName = file.replace('.sql', '');
                
                // Check if already executed
                const [rows] = await connection.query('SELECT * FROM migrations WHERE version = ?', [versionName]);
                
                if (rows.length === 0) {
                    console.log(`Applying Migration: ${file}...`);
                    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
                    await connection.query(sql);
                    
                    // The SQL itself should insert into migrations table, 
                    // but we do it here as a fallback/standard.
                    await connection.query('INSERT IGNORE INTO migrations (version) VALUES (?)', [versionName]);
                    console.log(`✅ Success: ${file}`);
                } else {
                    console.log(`⏭️ Skipping: ${file} (Already Applied)`);
                }
            }
        }

        console.log("🏁 All migrations processed successfully.");
        process.exit(0);
    } catch (err) {
        console.error("❌ Migration Failed:", err.message);
        process.exit(1);
    }
}

runMigrations();
