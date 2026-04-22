const express = require('express');
const router = express.Router();
const attachmentController = require('../controllers/attachment.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.use(authenticate);

router.post('/upload', attachmentController.uploadFile);
router.get('/', attachmentController.getAttachments);

module.exports = router;
