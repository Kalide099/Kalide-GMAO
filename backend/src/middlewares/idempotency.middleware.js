const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.idempotency = async (req, res, next) => {
    const idempotencyKey = req.headers['idempotency-key'] || req.headers['x-idempotency-key'];

    if (!idempotencyKey) {
        return next();
    }

    // Only apply idempotency to POST, PUT, PATCH
    if (!['POST', 'PUT', 'PATCH'].includes(req.method)) {
        return next();
    }

    // If user is not authenticated, fallback to IP address for idempotency (e.g. login/register)
    const userId = req.user?.id || req.ip;

    try {
        const [rows] = await pool.query(
            'SELECT response_body, response_status FROM idempotency_keys WHERE idempotency_key = ? AND user_id = ? LIMIT 1',
            [idempotencyKey, userId]
        );

        if (rows.length > 0) {
            const cachedResponse = rows[0];
            return res.status(cachedResponse.response_status).json(cachedResponse.response_body);
        }

        // Intercept response
        const originalSend = res.send;
        let responseSent = false;

        res.send = function (body) {
            if (responseSent) return;
            responseSent = true;

            const status = res.statusCode;
            let parsedBody = body;
            
            try {
                if (typeof body === 'string') {
                    parsedBody = JSON.parse(body);
                }
            } catch (e) {
                // Not JSON, save as string
            }

            // Save asynchronously to not block the current response
            pool.query(
                `INSERT INTO idempotency_keys (id, idempotency_key, user_id, request_path, response_body, response_status)
                 VALUES (?, ?, ?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE id=id`, // Ignore race condition dupes
                [uuidv4(), idempotencyKey, userId, req.originalUrl, JSON.stringify(parsedBody), status]
            ).catch(err => console.error('Failed to save idempotency key:', err));

            originalSend.call(this, body);
        };

        next();
    } catch (error) {
        next(error);
    }
};
