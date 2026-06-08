const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const { idempotency } = require('../middlewares/idempotency.middleware');

router.post('/register', idempotency, authController.register);
router.post('/login', idempotency, authController.login);
router.post('/forgot-password', idempotency, authController.forgotPassword);
router.post('/reset-password', idempotency, authController.resetPassword);
router.post('/logout', authenticate, idempotency, authController.logout);
router.post('/mfa/setup', authenticate, authController.setupMfa);
router.post('/mfa/verify', authenticate, authController.verifyMfa);
router.post('/mfa/disable', authenticate, authController.disableMfa);
router.post('/mfa/backup-codes/regenerate', authenticate, authController.regenerateMfaBackupCodes);
router.get('/mfa/status', authenticate, authController.getMfaStatus);

router.get('/sso-config', authenticate, authController.getSSOConfigs);
router.post('/sso-config', authenticate, authController.createSSOConfig);
router.delete('/sso-config/:id', authenticate, authController.deleteSSOConfig);
router.get('/profile', authenticate, authController.getProfile);

module.exports = router;
