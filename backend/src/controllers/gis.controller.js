const gisService = require('../services/gis.service');

exports.getFleet = async (req, res) => {
    try {
        const fleet = await gisService.getFleetLocations(req.user.companyId);
        res.json({ success: true, data: fleet });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getTrack = async (req, res) => {
    try {
        const track = await gisService.getAssetTrack(req.params.assetId);
        res.json({ success: true, data: track });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
