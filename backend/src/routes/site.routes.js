const express = require('express');
const router = express.Router();
const siteController = require('../controllers/site.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.get('/', authenticate, siteController.getSites);
router.get('/war-room', authenticate, siteController.getWarRoom);

module.exports = router;
