const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

process.on('uncaughtException', (err) => {
    console.error('🔥 UNCAUGHT EXCEPTION: Shutting down...', err.name, err.message, err.stack);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('🔥 UNHANDLED REJECTION: Shutting down...', err.name, err.message, err.stack);
    process.exit(1);
});

const app = require('./app');
const pool = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async (retries = 5, delay = 5000) => {
    while (retries) {
        try {
            // Verify database connection
            const connection = await pool.getConnection();
            console.log('✅ Connected to MySQL database via connection pool.');
            connection.release();

            app.listen(PORT, '0.0.0.0', () => {
                console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
            });
            break;
        } catch (error) {
            console.error(`❌ Unable to connect to database. Retries left: ${retries - 1}. Error:`, error.message);
            retries -= 1;
            if (retries === 0) {
                console.error('🔥 CRITICAL: Could not connect to DB after multiple retries. Exiting...');
                process.exit(1);
            }
            await new Promise(res => setTimeout(res, delay));
        }
    }
};

startServer();

