const startedAt = Date.now();

const metrics = {
    requestsTotal: 0,
    requestsByStatus: {},
    requestsByMethod: {},
    requestsByRoute: {},
    latencyBucketsMs: {
        le_50: 0,
        le_100: 0,
        le_250: 0,
        le_500: 0,
        le_1000: 0,
        gt_1000: 0
    },
    errorsTotal: 0
};

const bucketLatency = (durationMs) => {
    if (durationMs <= 50) return 'le_50';
    if (durationMs <= 100) return 'le_100';
    if (durationMs <= 250) return 'le_250';
    if (durationMs <= 500) return 'le_500';
    if (durationMs <= 1000) return 'le_1000';
    return 'gt_1000';
};

const increment = (map, key) => {
    map[key] = (map[key] || 0) + 1;
};

const normalizeRoute = (path) => {
    if (!path) return 'unknown';
    return String(path).split('?')[0];
};

const recordRequest = ({ method, path, statusCode, durationMs }) => {
    metrics.requestsTotal += 1;

    increment(metrics.requestsByMethod, String(method || 'UNKNOWN').toUpperCase());
    increment(metrics.requestsByStatus, String(statusCode || 0));
    increment(metrics.requestsByRoute, normalizeRoute(path));

    const bucket = bucketLatency(durationMs);
    increment(metrics.latencyBucketsMs, bucket);

    if (statusCode >= 500) {
        metrics.errorsTotal += 1;
    }
};

const snapshotMetrics = () => {
    const uptimeSec = Math.floor((Date.now() - startedAt) / 1000);
    return {
        uptimeSec,
        ...metrics
    };
};

module.exports = {
    recordRequest,
    snapshotMetrics
};
