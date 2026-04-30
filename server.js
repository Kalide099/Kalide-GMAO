require('dotenv').config();
const app = require('./backend/src/app');
const pool = require('./backend/src/config/db');

const PORT = process.env.PORT || 3000;

// CRITICAL: Ensure server starts BEFORE DB connection to prevent 503 boot loops
const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 KGMAO Production Server is ACTIVE on port ${PORT}`);
    console.log(`📡 Binding: 0.0.0.0:${PORT}`);
});

// Non-blocking background database initialization
const initializeDatabase = async (retries = 10, delay = 5000) => {
    console.log('🔄 Attempting background database connection...');
    while (retries > 0) {
        try {
            const connection = await pool.getConnection();
            console.log('✅ MySQL Database connection established.');
            connection.release();
            return;
        } catch (error) {
            console.error(`❌ DB Connection failed (${error.code}). Retries left: ${retries - 1}`);
            retries -= 1;
            if (retries === 0) {
                console.error('🔥 WARNING: Database unavailable. Server remains running but API features will fail.');
                return;
            }
            await new Promise(res => setTimeout(res, delay));
        }
    }
};

// Start DB connection in background without awaiting
initializeDatabase();

// Safety: Prevent process from dying on unhandled errors
process.on('uncaughtException', (err) => {
    console.error('🔥 CRITICAL UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('🔥 UNHANDLED REJECTION:', reason);
});
