const pool = require('../config/db');
const logger = require('../config/logger');

// Store background job processors
const processors = {};

/**
 * Register a function to process a specific job type
 */
exports.registerProcessor = (type, processorFn) => {
    processors[type] = processorFn;
};

/**
 * Enqueue a new job
 */
exports.enqueueJob = async (type, payload, userId, companyId) => {
    const [result] = await pool.query(
        'INSERT INTO background_jobs (type, payload, created_by, company_id) VALUES (?, ?, ?, ?)',
        [type, JSON.stringify(payload), userId, companyId]
    );
    
    logger.info(`Job enqueued`, { jobId: result.insertId, type });
    return result.insertId;
};

/**
 * Process a single pending job
 */
const processNextJob = async () => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Find the oldest pending job and lock it
        const [jobs] = await connection.query(
            'SELECT * FROM background_jobs WHERE status = "pending" ORDER BY created_at ASC LIMIT 1 FOR UPDATE SKIP LOCKED'
        );

        if (jobs.length === 0) {
            await connection.commit();
            return false;
        }

        const job = jobs[0];

        // Mark as processing
        await connection.query(
            'UPDATE background_jobs SET status = "processing", started_at = CURRENT_TIMESTAMP WHERE id = ?',
            [job.id]
        );
        await connection.commit();

        logger.info(`Processing job`, { jobId: job.id, type: job.type });

        try {
            const processor = processors[job.type];
            if (!processor) throw new Error(`No processor registered for job type: ${job.type}`);

            const result = await processor(job.payload, job.created_by, job.company_id);

            // Mark completed
            await pool.query(
                'UPDATE background_jobs SET status = "completed", result = ?, completed_at = CURRENT_TIMESTAMP WHERE id = ?',
                [JSON.stringify(result || {}), job.id]
            );
            logger.info(`Job completed`, { jobId: job.id });
        } catch (error) {
            // Mark failed
            await pool.query(
                'UPDATE background_jobs SET status = "failed", error = ?, completed_at = CURRENT_TIMESTAMP WHERE id = ?',
                [error.message || String(error), job.id]
            );
            logger.error(`Job failed`, { jobId: job.id, error });
        }

        return true;
    } catch (error) {
        await connection.rollback();
        logger.error('Error in job queue processor', { error });
        return false;
    } finally {
        connection.release();
    }
};

/**
 * Start the polling worker
 */
exports.startWorker = () => {
    logger.info('Background job worker started');
    
    const poll = async () => {
        try {
            const hasMoreJobs = await processNextJob();
            // If we found a job, look for another one immediately. 
            // If not, wait 5 seconds before polling again to reduce DB load.
            setTimeout(poll, hasMoreJobs ? 100 : 5000);
        } catch (err) {
            logger.error('Worker polling error', { error: err });
            setTimeout(poll, 5000);
        }
    };
    
    poll();
};
