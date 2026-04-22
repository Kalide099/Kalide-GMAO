const joi = require('joi');

exports.registerSchema = joi.object({
    firstName: joi.string().required().max(100),
    lastName: joi.string().required().max(100),
    email: joi.string().email().required().max(255),
    password: joi.string().min(8).required(),
    companyName: joi.string().required().max(255), // When registering initially, a company is created
    industry: joi.string().allow('', null).max(100)
});

exports.loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
});
