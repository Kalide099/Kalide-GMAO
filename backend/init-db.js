const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

async function initLocalXamppDatabase() {
    try {
        console.log("Attempting native XAMPP MySQL Authentication...");
        
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'srv1319.hstgr.io',
            user: process.env.DB_USER || 'u633695266_gmaouser',
            password: process.env.DB_PASSWORD || 'Kgmao123',
            database: process.env.DB_NAME || 'u633695266_kgmao',
            port: process.env.DB_PORT || 3306,
            multipleStatements: true 
        });

        console.log("✅ Authenticated with XAMPP MySQL Server Successfully.");

        const dbName = process.env.DB_NAME || 'u633695266_kgmao';

        console.log(`⚠️  REBUILDING SCHEMA [${dbName}] for i18n Compliance...`);

        const schemaLocation = path.join(__dirname, 'database', 'schema.sql');
        const schemaSQL = fs.readFileSync(schemaLocation, 'utf8');

        console.log("Executing core SaaS architectural SQL schemas...");
        await connection.query('SET FOREIGN_KEY_CHECKS = 0;');
        await connection.query(schemaSQL);
        await connection.query('SET FOREIGN_KEY_CHECKS = 1;');

        const salt = await bcrypt.genSalt(10);

        // ==========================================
        // 1. RECONSTRUCT SUPER ADMIN
        // ==========================================
        const adminEmail = 'root@kgmao.com';
        const adminPass = 'RootMaster2026!';
        const adminHash = await bcrypt.hash(adminPass, salt);
        const adminId = '00000000-0000-0000-0000-000000000000';

        await connection.query(
            'INSERT IGNORE INTO users (id, company_id, first_name, last_name, email, password_hash, role, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [adminId, null, 'Kalide', 'Root', adminEmail, adminHash, 'super_admin', 'active']
        );

        // ==========================================
        // 2. SEED SAAS PLANS (Pro & Enterprise)
        // ==========================================
        const proPlanId = uuidv4();
        const entPlanId = uuidv4();

        await connection.query(
            'INSERT IGNORE INTO subscription_plans (id, price, currency, features) VALUES (?, ?, ?, ?)',
            [proPlanId, 99.00, 'USD', JSON.stringify({ max_assets: 50, max_users: 10, reporting: true })]
        );
        await connection.query(
            'INSERT IGNORE INTO subscription_plan_translations (id, plan_id, language_code, name) VALUES (?, ?, ?, ?), (?, ?, ?, ?)',
            [uuidv4(), proPlanId, 'en', 'Pro Plan', uuidv4(), proPlanId, 'fr', 'Plan Pro']
        );

        await connection.query(
            'INSERT IGNORE INTO subscription_plans (id, price, currency, features) VALUES (?, ?, ?, ?)',
            [entPlanId, 499.00, 'USD', JSON.stringify({ max_assets: 1000, max_users: 100, reporting: true, predictive: true })]
        );
        await connection.query(
            'INSERT IGNORE INTO subscription_plan_translations (id, plan_id, language_code, name) VALUES (?, ?, ?, ?), (?, ?, ?, ?)',
            [uuidv4(), entPlanId, 'en', 'Enterprise Plan', uuidv4(), entPlanId, 'fr', 'Plan Entreprise']
        );

        // ==========================================
        // 3. CREATE SAMPLE BILINGUAL TENANT
        // ==========================================
        const tenantEmail = 'demo@kgmao.com';
        const tenantPass = 'DemoUser2026!';
        const tenantHash = await bcrypt.hash(tenantPass, salt);
        const companyId = uuidv4();
        const tenantUserId = uuidv4();

        console.log(`Creating Bilingual Tenant [Kalide Solutions]...`);

        await connection.query(
            'INSERT IGNORE INTO companies (id, name_en, name_fr, industry_en, industry_fr, subscription_status, plan, enabled_modules) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [companyId, 'Kalide Solutions', 'Solutions Kalide', 'Technology', 'Technologie', 'active', 'pro', JSON.stringify(['safety', 'iot', 'predictive', 'global', 'finance', 'map', 'skills', 'warehouse', 'command', 'twin', 'ar', 'hub', 'esg'])]
        );

        await connection.query(
            'INSERT IGNORE INTO users (id, company_id, first_name, last_name, email, password_hash, role, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [tenantUserId, companyId, 'John', 'Tenant', tenantEmail, tenantHash, 'admin', 'active']
        );

        // Link company to Pro Plan
        await connection.query(
            'INSERT IGNORE INTO subscriptions (id, company_id, plan_id, start_date, end_date, status) VALUES (?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 1 YEAR), ?)',
            [uuidv4(), companyId, proPlanId, 'active']
        );

        // ==========================================
        // 4. SEED BILINGUAL ASSET + IOT CONFIG
        // ==========================================
        const assetId = uuidv4();
        await connection.query(
            'INSERT IGNORE INTO assets (id, company_id, name_en, name_fr, description_en, description_fr, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [assetId, companyId, 'Industrial HVAC 01', 'CVC Industriel 01', 'Main production floor cooling', 'Refroidissement de l\'étage de production principal', 'active']
        );

        // Configure IoT Anomaly Detection: Trigger if Temp > 80C
        await connection.query(
            'INSERT IGNORE INTO asset_sensor_configs (id, asset_id, sensor_type, max_threshold, unit) VALUES (?, ?, ?, ?, ?)',
            [uuidv4(), assetId, 'temperature', 80.00, '°C']
        );

        // ==========================================
        // 5. SEED WORK ORDER WITH TRANSLATIONS
        // ==========================================
        const woId = uuidv4();
        await connection.query(
            'INSERT IGNORE INTO work_orders (id, company_id, asset_id, creator_id, type, priority, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [woId, companyId, assetId, tenantUserId, 'corrective', 'high', 'pending']
        );

        await connection.query(
            'INSERT IGNORE INTO work_order_translations (id, work_order_id, language_code, title, description) VALUES (?, ?, ?, ?, ?), (?, ?, ?, ?, ?)',
            [
                uuidv4(), woId, 'en', 'Check strange noise in motor', 'Vibration detected by field operator.',
                uuidv4(), woId, 'fr', 'Vérifier bruit moteur', 'Vibration détectée par l\'opérateur.'
            ]
        );

        // Standard Suppliers
        await connection.query(
            'INSERT IGNORE INTO suppliers (id, company_id, name_en, name_fr, email) VALUES (?, ?, ?, ?, ?)',
            [uuidv4(), companyId, 'Kalide Parts', 'Kalide Pièces', 'parts@kgmao.com']
        );

        console.log("============ SUCCESS ============");
        console.log("Tiered SaaS Architecture Hydrated with Digital Twins.");
        console.log("");
        process.exit(0);
        
    } catch (err) {
        console.error("❌ Failed to reconstruct users:", err.message);
        process.exit(1);
    }
}

initLocalXamppDatabase();
