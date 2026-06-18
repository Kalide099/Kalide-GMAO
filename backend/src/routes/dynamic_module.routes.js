const express = require('express');
const router = express.Router();
const dynamicModuleController = require('../controllers/dynamic_module.controller');

router.get('/:moduleName', dynamicModuleController.getModuleData);
router.post('/:moduleName', dynamicModuleController.addModuleData);
router.put('/:moduleName/:id', dynamicModuleController.updateModuleData);
router.delete('/:moduleName/:id', dynamicModuleController.deleteModuleData);

module.exports = router;
