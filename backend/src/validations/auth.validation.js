const joi = require('joi');

exports.registerSchema = joi.object({
    firstName: joi.string().required().max(100),
    lastName: joi.string().required().max(100),
    email: joi.string().email().required().max(255),
    password: joi.string().min(8).required(),
    companyName: joi.string().required().max(255), // When registering initially, a company is created
    industry: joi.string().allow('', null).max(100),
    preferredLanguage: joi.string().valid('en', 'fr').required()
});

exports.loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
    mfaCode: joi.string().pattern(/^[0-9]{6}$/).optional(),
    backupCode: joi.string().pattern(/^[A-Za-z0-9\-]{6,20}$/).optional()
});

exports.forgotPasswordSchema = joi.object({
    email: joi.string().email().required().max(255)
});

exports.resetPasswordSchema = joi.object({
    token: joi.string().min(32).required(),
    password: joi.string().min(8).required()
});

exports.mfaVerifySchema = joi.object({
    code: joi.string().pattern(/^[0-9]{6}$/).required()
});

exports.mfaDisableSchema = joi.object({
    mfaCode: joi.string().pattern(/^[0-9]{6}$/).optional(),
    backupCode: joi.string().pattern(/^[A-Za-z0-9\-]{6,20}$/).optional()
}).or('mfaCode', 'backupCode');

exports.mfaRegenerateBackupCodesSchema = joi.object({
    mfaCode: joi.string().pattern(/^[0-9]{6}$/).required()
});
