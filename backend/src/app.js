const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const globalErrorHandler = require('./middlewares/error.middleware');
const { extractLanguage } = require('./middlewares/lang.middleware');
const { xssSanitizer } = require('./middlewares/security.middleware');
const checkModule = require('./middlewares/module.middleware');

// Routes
const authRoutes = require('./routes/auth.routes');
const companyRoutes = require('./routes/company.routes');
const assetRoutes = require('./routes/asset.routes');
// (keep your other routes as they are)

const app = express();

// ======================
// TRUST PROXY (IMPORTANT FOR HOSTINGER)
// ======================
app.set('trust proxy', true);

// ======================
// SAFE RATE LIMITERS
// ======================
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000, // high enough to avoid blocking legit users
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200, // allow login attempts safely
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
});

// ======================
// MIDDLEWARES
// ======================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(xssSanitizer);
app.use(globalLimiter);
app.use(extractLanguage);

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// Logging (dev only)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// ======================
// HEALTH CHECK
// ======================
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'active',
        message: 'KGMAO SaaS Running'
    });
});

// Root
app.get('/', (req, res) => {
    res.status(200).send('API is running ✅');
});

// ======================
// API ROUTES (FIXED)
// ======================

// 🔥 AUTH ROUTES (safe limiter)
app.use('/api/v1/auth', authLimiter, authRoutes);

// Other routes
app.use('/api/v1/companies', companyRoutes);
app.use('/api/v1/assets', assetRoutes);

// (keep the rest unchanged)

// ======================
// FRONTEND ROUTING FIX
// ======================
app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
        return res.status(404).json({
            message: `API Route Not Found - ${req.originalUrl}`
        });
    }

    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

// ======================
// GLOBAL ERROR HANDLER (SAFE)
// ======================
app.use((err, req, res, next) => {
    console.error("❌ ERROR:", err.message);

    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error"
    });
});

module.exports = app;