const authService = require('../services/auth.service');
const { registerSchema, loginSchema } = require('../validations/auth.validation');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const { t } = require('../utils/i18n');

const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.getSSOConfigs = async (req, res, next) => {
    try {
        const lang = req.lang || 'en';
        const [rows] = await pool.query('SELECT * FROM sso_configs WHERE company_id = ?', [req.user.company_id]);
        return successResponse(res, 200, t('auth.sso_retrieved', lang), rows);
    } catch (err) {
        next(err);
    }
};

exports.createSSOConfig = async (req, res, next) => {
    try {
        const id = uuidv4();
        const lang = req.lang || 'en';
        await pool.query(
            `INSERT INTO sso_configs (id, company_id, provider_name, idp_entity_id, sso_url, public_certificate) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [id, req.user.company_id, provider_name, idp_entity_id, sso_url, public_certificate]
        );
        return successResponse(res, 201, t('auth.sso_established', lang), { id, provider_name });
    } catch (err) {
        next(err);
    }
};

exports.register = async (req, res, next) => {
    try {
        const lang = req.lang || 'en';
        const { error, value } = registerSchema.validate(req.body);
        if (error) {
            return errorResponse(res, 400, error.details[0].message);
        }

        const result = await authService.registerCompanyAndAdmin(value);
        return successResponse(res, 201, t('common.save_success', lang), result);
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const lang = req.lang || 'en';
        const { error, value } = loginSchema.validate(req.body);
        if (error) {
            return errorResponse(res, 400, error.details[0].message);
        }

        const result = await authService.loginUser(value.email, value.password, lang);
        return successResponse(res, 200, t('auth.login_success', lang), result);
    } catch (err) {
        next(err);
    }
};

exports.getProfile = async (req, res, next) => {
    try {
        const lang = req.lang || 'en';
        // The user object is injected by the auth middleware
        return successResponse(res, 200, t('auth.profile_retrieved', lang), {
            user: req.user
        });
    } catch (err) {
        next(err);
    }
};
