const joi = require('joi');

exports.createAssetSchema = joi.object({
    name_en: joi.string().required().max(255),
    name_fr: joi.string().required().max(255),
    description_en: joi.string().allow('', null),
    description_fr: joi.string().allow('', null),
    serialNumber: joi.string().allow('', null).max(100),
    status: joi.string().valid('active', 'maintenance', 'retired').default('active'),
    location: joi.string().allow('', null).max(255),
    acquiredAt: joi.date().allow(null)
});

exports.updateAssetSchema = joi.object({
    name_en: joi.string().max(255),
    name_fr: joi.string().max(255),
    description_en: joi.string().allow('', null),
    description_fr: joi.string().allow('', null),
    serialNumber: joi.string().allow('', null).max(100),
    status: joi.string().valid('active', 'maintenance', 'retired'),
    location: joi.string().allow('', null).max(255),
    acquiredAt: joi.date().allow(null)
});
