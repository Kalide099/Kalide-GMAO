const mysql = require('mysql2/promise');
require('dotenv').config();

// Safety Guards for Hostinger Production
const requiredEnv = ['DB_HOST', 'DB_USER', 'DB_NAME', 'JWT_SECRET'];
requiredEnv.forEach(key => {
    if (!process.env[key]) {
        console.warn(`⚠️ WARNING: Missing environment variable [${key}]. App may fail during operations.`);
    }
});

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

console.log(`📡 DB Connection Configured for: ${dbConfig.host}`);

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
