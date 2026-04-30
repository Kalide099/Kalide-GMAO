require('dotenv').config();
const app = require('./backend/src/app');
const pool = require('./backend/src/config/db');

const PORT = process.env.PORT || 3000;

// Start server immediately to prevent Hostinger 503 errors during boot
const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 KGMAO Production Server running on port ${PORT}`);
    console.log(`📡 Health check available at: http://localhost:${PORT}/`);
});

// Connect to database in background
const connectDB = async (retries = 10, delay = 5000) => {
    while (retries > 0) {
        try {
            const connection = await pool.getConnection();
            console.log('✅ MySQL Database connected successfully.');
            connection.release();
            return;
        } catch (error) {
            console.error(`❌ DB Connection failed. Retries left: ${retries - 1}. Error:`, error.message);
            retries -= 1;
            if (retries === 0) {
                console.error('🔥 CRITICAL: Database unavailable after multiple attempts. Server remains active.');
                return;
            }
            await new Promise(res => setTimeout(res, delay));
        }
    }
};

connectDB();
