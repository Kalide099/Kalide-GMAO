const mysql = require('mysql2/promise');
require('dotenv').config();

// Ensure the app doesn't crash if env vars are missing
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'kgmao',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
};

console.log(`📡 Initializing DB Pool for host: ${dbConfig.host}`);

const pool = mysql.createPool(dbConfig);

// Helper to safely execute queries with automatic connection release
pool.safeQuery = async (sql, params) => {
    try {
        const [results] = await pool.query(sql, params);
        return results;
    } catch (error) {
        console.error('❌ Database Query Error:', error.message);
        throw error;
    }
};

module.exports = pool;
