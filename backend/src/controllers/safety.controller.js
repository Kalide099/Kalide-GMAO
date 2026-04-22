const safetyService = require('../services/safety.service');

exports.getPending = async (req, res) => {
    try {
        const permits = await safetyService.getPendingPermits(req.user.company_id);
        res.json({ success: true, data: permits });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getStats = async (req, res) => {
    try {
        const stats = await safetyService.getSafetyStats(req.user.company_id);
        res.json({ success: true, data: stats });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.requestPermit = async (req, res) => {
    try {
        const { workOrderId, checklist } = req.body;
        const result = await safetyService.createPermit(workOrderId, req.user.id, checklist);
        res.status(201).json({ success: true, data: result });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.approvePermit = async (req, res) => {
    try {
        const { permitId, photoUrl, signature } = req.body;
        const result = await safetyService.validatePermit(permitId, photoUrl, signature, req.user.id);
        res.json(result);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
