const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'kgmao_db',
    port: Number(process.env.DB_PORT || 3306),
    multipleStatements: true
};

async function migrate() {
    console.log('Connecting to database...');
    const conn = await mysql.createConnection(dbConfig);
    console.log('Reading migration file...');
    const sqlPath = path.join(__dirname, 'backend', 'database', 'migrations', 'v9_create_jobs_table.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    console.log('Executing migration...');
    await conn.query(sql);
    console.log('Migration successful.');
    await conn.end();
}

migrate().catch(console.error);
