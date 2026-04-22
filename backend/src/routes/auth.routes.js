const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/sso-config', authenticate, authController.getSSOConfigs);
router.post('/sso-config', authenticate, authController.createSSOConfig);
router.get('/profile', authenticate, authController.getProfile);

module.exports = router;
