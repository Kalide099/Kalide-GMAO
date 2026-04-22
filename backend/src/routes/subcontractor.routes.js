const express = require('express');
const router = express.Router();
const subcontractorController = require('../controllers/subcontractor.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.use(authenticate);

router.get('/', subcontractorController.getSubcontractors);
router.post('/', subcontractorController.createSubcontractor);

module.exports = router;
