const mysql = require('mysql2/promise');
const { getEnv } = require('./env');
const logger = require('./logger');

let dbHealthy = false;

const dbConfig = {
    host: getEnv('DB_HOST', 'localhost'),
    user: getEnv('DB_USER', 'root'),
    password: getEnv('DB_PASSWORD', ''),
    database: getEnv('DB_NAME', 'kgmao_db'),
    port: Number(getEnv('DB_PORT', 3306)),
    waitForConnections: true,
    connectionLimit: 5, // Tightened for Hostinger shared DB limits
    queueLimit: 100, // Explicit queue limit to fail fast under extreme load rather than crash
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    connectTimeout: 5000 // 🚀 FAIL FAST: Force error before Hostinger's 15s limit
};

const pool = mysql.createPool(dbConfig);

(async () => {
    try {
        const conn = await pool.getConnection();
        dbHealthy = true;
        logger.info('Database initial connection established');
        conn.release();
    } catch (err) {
        dbHealthy = false;
        logger.error('Database initial connection failed', { error: err });
    }
})();

const checkDatabaseHealth = async () => {
    try {
        const conn = await pool.getConnection();
        await conn.ping();
        conn.release();
        dbHealthy = true;
        return true;
    } catch (err) {
        dbHealthy = false;
        return false;
    }
};

const isDatabaseHealthy = () => dbHealthy;

module.exports = pool;
module.exports.checkDatabaseHealth = checkDatabaseHealth;
module.exports.isDatabaseHealthy = isDatabaseHealthy;