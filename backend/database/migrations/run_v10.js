const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const readline = require('readline');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

async function runMigration() {
    const uri = "mysql://u633695266_gmaouser:MoyoLim123@srv1319.hstgr.io:3306/u633695266_kgmao?connect_timeout=30&sslmode=no-verify";
    
    console.log(`Connecting directly to Hostinger DB using provided connection string...`);

    const pool = mysql.createPool({
        uri: uri,
        multipleStatements: true
    });

    try {
        console.log('Applying v10_ai_industry_type.sql to Hostinger...');
        const sql = fs.readFileSync(path.join(__dirname, 'v10_ai_industry_type.sql'), 'utf8');
        await pool.query(sql);
        console.log('✅ Migration v10 applied successfully to Hostinger!');
    } catch (e) {
        console.error('❌ Migration failed:', e);
    } finally {
        await pool.end();
    }
}

runMigration();
