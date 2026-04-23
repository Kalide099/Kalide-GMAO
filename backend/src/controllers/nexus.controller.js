const nexusService = require('../services/nexus.service');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.fetchRca = async (req, res, next) => {
    try {
        const { assetId } = req.query;
        const data = await nexusService.getRcaByAsset(req.user.company_id, assetId);
        return successResponse(res, 200, 'RCA Matrix Ingested', data);
    } catch (err) {
        next(err);
    }
};

exports.createRca = async (req, res, next) => {
    try {
        const id = await nexusService.createRca(req.user.company_id, req.user.id, req.body);
        return successResponse(res, 201, 'RCA Protocol Initialized', { id });
    } catch (err) {
        next(err);
    }
};

exports.fetchFmea = async (req, res, next) => {
    try {
        const { assetId } = req.query;
        const data = await nexusService.getFmeaByAsset(req.user.company_id, assetId);
        return successResponse(res, 200, 'FMEA Logic Extracted', data);
    } catch (err) {
        next(err);
    }
};

exports.addFmea = async (req, res, next) => {
    try {
        const id = await nexusService.addFmeaEntry(req.user.company_id, req.body);
        return successResponse(res, 201, 'FMEA Failure Mode Indexed', { id });
    } catch (err) {
        next(err);
    }
};

exports.fetchLoto = async (req, res, next) => {
    try {
        const { assetId } = req.query;
        const data = await nexusService.getLotoProcedures(req.user.company_id, assetId);
        return successResponse(res, 200, 'LOTO Protocols Synchronized', data);
    } catch (err) {
        next(err);
    }
};

exports.signLoto = async (req, res, next) => {
    try {
        const id = await nexusService.logLotoAction(req.user.company_id, req.user.id, req.body);
        
        // --- FORENSIC AUDIT LOGGING ---
        await pool.query(
            'INSERT INTO audit_logs (id, company_id, user_id, action, entity_type, entity_id, payload) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [uuidv4(), req.user.company_id, req.user.id, 'LOTO_SIGNATURE', 'nexus_loto', id, JSON.stringify({ action: req.body.action })]
        );

        return successResponse(res, 201, 'LOTO Signature Authenticated', { id });
    } catch (err) {
        next(err);
    }
};

exports.addDocument = async (req, res, next) => {
    try {
        const id = await nexusService.addDocument(req.user.company_id, req.user.id, req.body);
        return successResponse(res, 201, 'Document Matrix Uplinked', { id });
    } catch (err) {
        next(err);
    }
};

exports.fetchCalibration = async (req, res, next) => {
    try {
        const data = await nexusService.getCalibrationRegistry(req.user.company_id);
        return successResponse(res, 200, 'Metrology Registry Decoded', data);
    } catch (err) {
        next(err);
    }
};

exports.submitTpm = async (req, res, next) => {
    try {
        const id = await nexusService.submitTpmChecklist(req.user.company_id, req.user.id, req.body);
        return successResponse(res, 201, 'TPM Operator Feedback Synchronized', { id });
    } catch (err) {
        next(err);
    }
};

exports.fetchPredictions = async (req, res, next) => {
    try {
        const data = await nexusService.getSparePartsPredictions(req.user.company_id);
        return successResponse(res, 200, 'AI Inventory Forecasting Active', data);
    } catch (err) {
        next(err);
    }
};
