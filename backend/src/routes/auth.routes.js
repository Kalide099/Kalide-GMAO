const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/logout', authenticate, authController.logout);
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
