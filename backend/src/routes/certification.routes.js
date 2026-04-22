const express = require('express');
const router = express.Router();
const certController = require('../controllers/certification.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.use(authenticate);

router.get('/matrix', certController.getMatrix);
router.get('/my', certController.getMyCerts);
router.post('/assign', certController.addCertification);

module.exports = router;
