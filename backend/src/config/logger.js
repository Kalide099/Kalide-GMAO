const serializeError = (err) => {
    if (!err) return undefined;
    return {
        message: err.message,
        stack: err.stack,
        code: err.code,
        statusCode: err.statusCode
    };
};

const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const log = (level, message, meta = {}) => {
    const payload = {
        ts: new Date().toISOString(),
        level,
        message,
        ...meta
    };

    const line = JSON.stringify(payload);

    // Write to file asynchronously
    fs.appendFile(path.join(logDir, 'combined.log'), line + '\n', (err) => {
        if (err) console.error('Failed to write to log file', err);
    });

    if (level === 'error') {
        fs.appendFile(path.join(logDir, 'error.log'), line + '\n', () => {});
        console.error(line);
        return;
    }

    console.log(line);
};

module.exports = {
    info: (message, meta) => log('info', message, meta),
    warn: (message, meta) => log('warn', message, meta),
    error: (message, meta = {}) => log('error', message, { ...meta, error: serializeError(meta.error) })
};
