const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const app = require('./app');
const pool = require('./config/db');

const PORT = process.env.PORT || 3000;

// Start server immediately
const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

// Then connect to DB separately
const connectDB = async (retries = 5, delay = 5000) => {
    while (retries) {
        try {
            const connection = await pool.getConnection();
            console.log("✅ Connected to MySQL database.");
            connection.release();
            return;
        } catch (error) {
            console.error(`❌ DB connection failed. Retries left: ${retries - 1}`);
            retries--;

            if (retries === 0) {
                console.error("🔥 DB unavailable, but server is still running.");
                return;
            }

            await new Promise(res => setTimeout(res, delay));
        }
    }
};

connectDB();