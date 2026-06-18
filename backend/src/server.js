const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const app = require('./app');
const db = require('./config/db');
const { config, validateEnv } = require('./config/env');
const logger = require('./config/logger');

validateEnv(config);

// Start server immediately
const server = app.listen(config.port, "0.0.0.0", () => {
    logger.info('Server started', { port: config.port, env: config.nodeEnv });
});

// Initialize WebSockets
const { initSocket } = require('./config/socket');
initSocket(server);

server.on('error', (error) => {
    logger.error('HTTP server startup/runtime error', { error, port: config.port });
    if (error.code === 'EADDRINUSE') {
        logger.error('Configured port is already in use', { port: config.port });
    }
    process.exit(1);
});

// Then connect to DB separately
const connectDB = async (retries = config.dbConnectRetries, delay = config.dbConnectRetryDelayMs) => {
    while (retries) {
        try {
            const connection = await db.getConnection();
            logger.info('Connected to MySQL database');
            connection.release();
            
            // Start background job worker
            const queueService = require('./services/queue.service');
            require('./services/processors'); // Load all job processors
            queueService.startWorker();

            // Start IoT simulation
            const iotService = require('./services/iot.service');
            iotService.startContinuousSimulation();
            
            return;
        } catch (error) {
            logger.warn('DB connection failed', { retriesLeft: retries - 1, error });
            retries--;

            if (retries === 0) {
                logger.error('DB unavailable, server remains online in degraded mode', { error });
                return;
            }

            await new Promise(res => setTimeout(res, delay));
        }
    }
};

connectDB();

let isShuttingDown = false;

const shutdown = (signal) => {
    if (isShuttingDown) return;
    isShuttingDown = true;
    logger.warn('Shutdown signal received', { signal });

    server.close(async () => {
        try {
            await db.end();
            logger.info('HTTP server and DB pool closed');
            process.exit(0);
        } catch (error) {
            logger.error('Error while closing DB pool', { error });
            process.exit(1);
        }
    });

    setTimeout(() => {
        logger.error('Forced shutdown due to timeout', { timeoutMs: config.shutdownTimeoutMs });
        process.exit(1);
    }, config.shutdownTimeoutMs).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled promise rejection', { reason });
});

process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception', { error });
    shutdown('UNCAUGHT_EXCEPTION');
});