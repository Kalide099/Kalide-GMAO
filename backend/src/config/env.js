const REQUIRED_IN_PRODUCTION = [
    'JWT_SECRET',
    'DB_HOST',
    'DB_USER',
    'DB_PASSWORD',
    'DB_NAME',
    'CORS_ORIGIN',
    'APP_VERSION',
    'BUILD_SHA'
];

const UNSAFE_JWT_SECRETS = new Set([
    'your_super_secret_jwt_key_here',
    'change-this-for-desktop-deployment',
    'TEST_SECRET_KEY',
    'secret',
    'changeme'
]);

const toBoolean = (value, defaultValue = false) => {
    if (value === undefined || value === null || value === '') return defaultValue;
    return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
};

const toNumber = (value, defaultValue) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : defaultValue;
};

const getEnv = (name, fallback) => {
    const value = process.env[name];
    return value === undefined || value === null || value === '' ? fallback : value;
};

const buildConfig = () => {
    const nodeEnv = getEnv('NODE_ENV', 'development');

    return {
        nodeEnv,
        isProd: nodeEnv === 'production',
        port: toNumber(getEnv('PORT', 3000), 3000),
        appVersion: getEnv('APP_VERSION', '1.0.0'),
        buildSha: getEnv('BUILD_SHA', 'local'),
        corsOrigin: getEnv('CORS_ORIGIN', '*'),
        trustProxy: toBoolean(getEnv('TRUST_PROXY', 'true'), true),
        globalRateLimitWindowMs: toNumber(getEnv('RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000), 15 * 60 * 1000),
        globalRateLimitMax: toNumber(getEnv('RATE_LIMIT_MAX', 1000), 1000),
        authRateLimitWindowMs: toNumber(getEnv('AUTH_RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000), 15 * 60 * 1000),
        authRateLimitMax: toNumber(getEnv('AUTH_RATE_LIMIT_MAX', 100), 100),
        passwordResetTokenTtlMinutes: toNumber(getEnv('PASSWORD_RESET_TOKEN_TTL_MINUTES', 15), 15),
        mfaEnforcementEnabled: toBoolean(getEnv('MFA_ENFORCEMENT_ENABLED', 'false'), false),
        mfaIssuer: getEnv('MFA_ISSUER', 'KGMAO'),
        mfaBackupCodesCount: toNumber(getEnv('MFA_BACKUP_CODES_COUNT', 10), 10),
        dbConnectRetries: toNumber(getEnv('DB_CONNECT_RETRIES', 5), 5),
        dbConnectRetryDelayMs: toNumber(getEnv('DB_CONNECT_RETRY_DELAY_MS', 5000), 5000),
        shutdownTimeoutMs: toNumber(getEnv('SHUTDOWN_TIMEOUT_MS', 15000), 15000)
    };
};

const validateEnv = (config) => {
    if (!config.isProd) return;

    const missing = REQUIRED_IN_PRODUCTION.filter((key) => {
        const value = process.env[key];
        return value === undefined || value === null || value === '';
    });

    if (missing.length > 0) {
        throw new Error(`Missing environment variables: ${missing.join(', ')}`);
    }

    const jwtSecret = process.env.JWT_SECRET || '';
    if (UNSAFE_JWT_SECRETS.has(jwtSecret) || jwtSecret.length < 32) {
        throw new Error('JWT_SECRET is weak or missing. Please provide a strong secret (32+ chars).');
    }

    const isDesktopRuntime = Boolean(process.env.DESKTOP_BACKEND_PORT);
    if (!isDesktopRuntime && config.corsOrigin === '*') {
        throw new Error('CORS_ORIGIN cannot be "*" in production unless running desktop runtime.');
    }

    if (config.appVersion === '1.0.0' || config.buildSha === 'local') {
        console.warn('[WARNING] APP_VERSION or BUILD_SHA not set to production values.');
    }
};

const config = buildConfig();

module.exports = {
    config,
    getEnv,
    validateEnv
};
