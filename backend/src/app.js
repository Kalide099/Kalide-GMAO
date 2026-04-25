const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const globalErrorHandler = require('./middlewares/error.middleware');
const { extractLanguage } = require('./middlewares/lang.middleware');
const { globalLimiter, authLimiter, xssSanitizer } = require('./middlewares/security.middleware');
const checkModule = require('./middlewares/module.middleware');

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

// Global Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(xssSanitizer);
app.use(globalLimiter); 
app.use(extractLanguage);
app.use('/uploads', express.static('uploads'));
app.use(express.static(path.join(__dirname, '../../dist')));

// Serve React App for any non-API routes
const serveFrontend = (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
};

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Health Check Endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'active', message: 'KGMAO SaaS Operating Securely' });
});

// API Routes
// Protect Authentication flows densely using the auth limiting block explicitly
app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/companies', companyRoutes);
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
        const err = new Error(`API Route Not Found - ${req.originalUrl}`);
        err.statusCode = 404;
        return next(err);
    }
    serveFrontend(req, res);
});

// Global Error Handler
app.use(globalErrorHandler);

module.exports = app;
