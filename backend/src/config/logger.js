const serializeError = (err) => {
    if (!err) return undefined;
    return {
        message: err.message,
        stack: err.stack,
        code: err.code,
        statusCode: err.statusCode
    };
};

const log = (level, message, meta = {}) => {
    const payload = {
        ts: new Date().toISOString(),
        level,
        message,
        ...meta
    };

    const line = JSON.stringify(payload);

    if (level === 'error') {
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
