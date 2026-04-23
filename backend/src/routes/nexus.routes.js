const express = require('express');
const router = express.Router();
const nexusController = require('../controllers/nexus.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { checkModuleAccess } = require('../middlewares/plan.middleware');

router.use(authenticate);

// RCA
router.get('/rca', checkModuleAccess('rca'), nexusController.fetchRca);
router.post('/rca', checkModuleAccess('rca'), nexusController.createRca);

// FMEA
router.get('/fmea', checkModuleAccess('fmea'), nexusController.fetchFmea);
router.post('/fmea', checkModuleAccess('fmea'), nexusController.addFmea);

// LOTO
router.get('/loto', checkModuleAccess('loto'), nexusController.fetchLoto);
router.post('/loto/sign', checkModuleAccess('loto'), nexusController.signLoto);

// Calibration
router.get('/calibration', checkModuleAccess('calibration'), nexusController.fetchCalibration);

// TPM
router.post('/tpm', checkModuleAccess('tpm'), nexusController.submitTpm);

// DMS
router.post('/dms', checkModuleAccess('dms'), nexusController.addDocument);

// AI Predictions
router.get('/predictions', checkModuleAccess('predictive'), nexusController.fetchPredictions);

module.exports = router;
