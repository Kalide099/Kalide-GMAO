const siteService = require('../services/site.service');
const { successResponse } = require('../utils/responseHandler');

exports.getSites = async (req, res, next) => {
    try {
        const lang = req.lang || 'en';
        const sites = await siteService.getAllSites(req.user.company_id, lang);
        return successResponse(res, 200, 'Geographic hubs retrieved.', sites);
    } catch (err) {
        next(err);
    }
};

exports.getWarRoom = async (req, res, next) => {
    try {
        const stats = await siteService.getWarRoomStats(req.user.company_id);
        return successResponse(res, 200, 'War Room command data synchronized.', stats);
    } catch (err) {
        next(err);
    }
};
