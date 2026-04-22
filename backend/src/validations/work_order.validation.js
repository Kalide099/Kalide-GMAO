const joi = require('joi');

exports.createWorkOrderSchema = joi.object({
    assetId: joi.string().uuid().required(),
    assignedTo: joi.string().uuid().allow(null),
    type: joi.string().valid('preventive', 'corrective').required(),
    priority: joi.string().valid('low', 'medium', 'high', 'critical').default('medium'),
    scheduledDate: joi.date().iso().allow(null),
    title_en: joi.string().required().max(255),
    title_fr: joi.string().required().max(255),
    description_en: joi.string().allow('', null),
    description_fr: joi.string().allow('', null)
});

exports.updateWorkOrderStatusSchema = joi.object({
    status: joi.string().valid('pending', 'in_progress', 'on_hold', 'completed', 'cancelled').required(),
    completedDate: joi.date().iso().when('status', { is: 'completed', then: joi.required() })
});
