const warehouseService = require('../services/warehouse.service');

exports.getOverview = async (req, res) => {
    try {
        const locations = await warehouseService.getWarehouseLocations(req.user.companyId);
        const metrics = await warehouseService.getWarehouseMetrics(req.user.companyId);
        res.json({ success: true, data: { locations, metrics } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getLocationStock = async (req, res) => {
    try {
        const stock = await warehouseService.getInventoryByLocation(req.params.locationId);
        res.json({ success: true, data: stock });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.transfer = async (req, res) => {
    try {
        const result = await warehouseService.transferItem({ ...req.body, user_id: req.user.id });
        res.json(result);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
