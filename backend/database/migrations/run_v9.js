const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'kgmao_db',
    });

    try {
        const sql = fs.readFileSync(path.join(__dirname, 'v9_create_jobs_table.sql'), 'utf8');
        await pool.query(sql);
        console.log('Migration v9 applied successfully');
    } catch (e) {
        console.error('Migration failed:', e);
    } finally {
        await pool.end();
    }
}
run();
