require('dotenv').config();
const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    connectTimeout: 5000 // 🚀 FAIL FAST: Force error before Hostinger's 15s limit
};

const pool = mysql.createPool(dbConfig);

(async () => {
    try {
        const conn = await pool.getConnection();
        console.log("DB CONNECTED");
        conn.release();
    } catch (err) {
        console.error("DB FAILED:", err.message);
    }
})();

module.exports = pool;