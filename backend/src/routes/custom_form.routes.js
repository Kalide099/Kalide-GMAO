const express = require('express');
const router = express.Router();
const customFormController = require('../controllers/custom_form.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.use(authenticate);

router.get('/', customFormController.getCustomForms);
router.post('/', customFormController.createCustomForm);

module.exports = router;
