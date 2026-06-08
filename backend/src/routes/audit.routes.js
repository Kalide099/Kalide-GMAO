const express = require('express');
const router = express.Router();
const auditController = require('../controllers/audit.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.use(authenticate);
router.get('/', auditController.getLogs);
router.get('/export', auditController.exportLogs);

module.exports = router;
