const energyService = require('../services/energy.service');

exports.getESGOverview = async (req, res) => {
    try {
        const stats = await energyService.getCompanyESGStats(req.user.company_id);
        const nodes = await energyService.getDiagnosticNodes(req.user.company_id);
        res.json({
            success: true,
            data: {
                stats,
                nodes
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getAssetEnergy = async (req, res) => {
    try {
        const history = await energyService.getAssetEnergyHistory(req.params.assetId);
        res.json({ success: true, data: history });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
