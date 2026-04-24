require('dotenv').config();
const app = require('./app');
const pool = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Verify database connection
        const connection = await pool.getConnection();
        console.log('✅ Connected to MySQL database via connection pool.');
        connection.release();

        app.listen(PORT, () => {
            console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
        });

    } catch (error) {
        console.error('❌ Unable to connect to the database or start server:', error.message);
        process.exit(1);
    }
};

startServer();
