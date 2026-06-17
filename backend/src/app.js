const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const crypto = require('crypto');

const globalErrorHandler = require('./middlewares/error.middleware');
const { extractLanguage } = require('./middlewares/lang.middleware');
const { xssSanitizer, globalLimiter, authLimiter } = require('./middlewares/security.middleware');
const checkModule = require('./middlewares/module.middleware');
const { config } = require('./config/env');
const logger = require('./config/logger');
const db = require('./config/db');
const { recordRequest, snapshotMetrics } = require('./utils/runtimeMetrics');

// Route imports
const authRoutes = require('./routes/auth.routes');
const companyRoutes = require('./routes/company.routes');
const assetRoutes = require('./routes/asset.routes');
const workOrderRoutes = require('./routes/work_order.routes');
const subscriptionRoutes = require('./routes/subscription.routes');
const adminRoutes = require('./routes/admin.routes');
const inventoryRoutes = require('./routes/inventory.routes');
const predictiveRoutes = require('./routes/predictive.routes');
const iotRoutes = require('./routes/iot.routes');
const notificationRoutes = require('./routes/notification.routes');
const auditRoutes = require('./routes/audit.routes');
const siteRoutes = require('./routes/site.routes');
const registrationRoutes = require('./routes/registration.routes');
const safetyRoutes = require('./routes/safety.routes');
const energyRoutes = require('./routes/energy.routes');
const certificationRoutes = require('./routes/certification.routes');
const warehouseRoutes = require('./routes/warehouse.routes');
const financeRoutes = require('./routes/finance.routes');
const gisRoutes = require('./routes/gis.routes');
const procurementRoutes = require('./routes/procurement.routes');
const supplierRoutes = require('./routes/supplier.routes');
const logisticsRoutes = require('./routes/logistics.routes');
const performanceRoutes = require('./routes/performance.routes');
const subcontractorRoutes = require('./routes/subcontractor.routes');
const customFormRoutes = require('./routes/custom_form.routes');
const attachmentRoutes = require('./routes/attachment.routes');
const nexusRoutes = require('./routes/nexus.routes');

const app = express();

app.use((req, res, next) => {
    const requestId = req.headers['x-request-id'] || crypto.randomUUID();
    req.requestId = requestId;
    res.setHeader('X-Request-Id', requestId);
    next();
});

app.use((req, res, next) => {
    const startedAtNs = process.hrtime.bigint();
    const requestPath = req.originalUrl.split('?')[0];

    res.on('finish', () => {
        const durationMs = Number(process.hrtime.bigint() - startedAtNs) / 1_000_000;
        recordRequest({
            method: req.method,
            path: requestPath,
            statusCode: res.statusCode,
            durationMs
        });

        logger.info('Request completed', {
            requestId: req.requestId,
            method: req.method,
            path: requestPath,
            statusCode: res.statusCode,
            durationMs: Number(durationMs.toFixed(2))
        });
    });

    logger.info('Incoming request', {
        requestId: req.requestId,
        method: req.method,
        path: requestPath
    });
    next();
});

app.set('trust proxy', config.trustProxy ? 1 : false);

// Global Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = config.corsOrigin === '*'
    ? true
    : config.corsOrigin.split(',').map((item) => item.trim()).filter(Boolean);
const credentialsEnabled = config.corsOrigin !== '*';

app.use(cors({
    origin: allowedOrigins,
    credentials: credentialsEnabled
}));
app.use(helmet());
app.use(xssSanitizer);
app.use(extractLanguage);
app.use('/api', globalLimiter);
const { idempotency } = require('./middlewares/idempotency.middleware');
app.use('/api', idempotency);

// Static files - Disable CDN caching to ensure the latest React build is always served
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(express.static(path.join(__dirname, '../../frontend/dist'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.html') || path.endsWith('.js') || path.endsWith('.css')) {
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
        }
    }
}));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Health Check Endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'active',
        message: 'KGMAO SaaS Operating Securely',
        uptime: process.uptime(),
        version: config.appVersion,
        build: config.buildSha,
        timestamp: new Date().toISOString()
    });
});

app.get('/ready', async (req, res) => {
    const dbHealthy = await db.checkDatabaseHealth();
    if (!dbHealthy) {
        return res.status(503).json({
            status: 'degraded',
            message: 'Database unavailable',
            requestId: req.requestId
        });
    }

    return res.status(200).json({
        status: 'ready',
        message: 'All critical dependencies available',
        requestId: req.requestId,
        version: config.appVersion,
        build: config.buildSha
    });
});

app.get('/metrics', (req, res) => {
    res.status(200).json({
        status: 'ok',
        requestId: req.requestId,
        metrics: snapshotMetrics()
    });
});

// API Routes
app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/companies', companyRoutes);
app.use('/api/v1/company', companyRoutes);
app.use('/api/v1/assets', assetRoutes);
app.use('/api/v1/work-orders', workOrderRoutes);
app.use('/api/v1/inventory', inventoryRoutes);
app.use('/api/v1/subscriptions', subscriptionRoutes);
app.use('/api/v1/predictive', checkModule('predictive'), predictiveRoutes);
app.use('/api/v1/iot', checkModule('iot'), iotRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/audit', auditRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/sites', siteRoutes);
app.use('/api/v1/registrations', registrationRoutes);
app.use('/api/v1/safety', checkModule('safety'), safetyRoutes);
app.use('/api/v1/energy', checkModule('esg'), energyRoutes);
app.use('/api/v1/certifications', checkModule('skills'), certificationRoutes);
app.use('/api/v1/warehouse', checkModule('warehouse'), warehouseRoutes);
app.use('/api/v1/finance', checkModule('finance'), financeRoutes);
app.use('/api/v1/gis', checkModule('map'), gisRoutes);
app.use('/api/v1/procurement', procurementRoutes);
app.use('/api/v1/suppliers', supplierRoutes);
app.use('/api/v1/logistics', logisticsRoutes);
app.use('/api/v1/performance', performanceRoutes);
app.use('/api/v1/subcontractors', subcontractorRoutes);
app.use('/api/v1/custom-forms', customFormRoutes);
app.use('/api/v1/attachments', attachmentRoutes);
app.use('/api/v1/nexus', nexusRoutes);

// Handle React Routing - Serve index.html for non-API routes
app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
        return res.status(404).json({
            message: `API Route Not Found - ${req.originalUrl}`
        });
    }
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

// Global Error Handler
app.use(globalErrorHandler);

module.exports = app;