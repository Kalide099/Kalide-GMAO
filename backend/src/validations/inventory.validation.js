const joi = require('joi');

exports.createInventorySchema = joi.object({
    sku: joi.string().required().max(100),
    quantity: joi.number().min(0).default(0),
    minimumQuantity: joi.number().min(0).default(0),
    price: joi.number().min(0).allow(null),
    supplierId: joi.string().uuid().allow(null),
    name_en: joi.string().required().max(255),
    name_fr: joi.string().required().max(255)
});
