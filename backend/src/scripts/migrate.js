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
