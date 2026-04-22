const certService = require('../services/certification.service');

exports.getMatrix = async (req, res) => {
    try {
        const matrix = await certService.getCompanySkillMatrix(req.user.companyId);
        res.json({ success: true, data: matrix });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getMyCerts = async (req, res) => {
    try {
        const certs = await certService.getUserCertifications(req.user.id);
        res.json({ success: true, data: certs });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.addCertification = async (req, res) => {
    try {
        const result = await certService.assignCertification(req.body);
        res.status(201).json({ success: true, data: result });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
