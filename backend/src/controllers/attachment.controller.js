const attachmentService = require('../services/attachment.service');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const multer = require('multer');
const path = require('path');

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
}).single('file');

exports.uploadFile = (req, res, next) => {
    upload(req, res, async (err) => {
        if (err) return errorResponse(res, 400, "Upload Error: " + err.message);
        if (!req.file) return errorResponse(res, 400, "No file provided.");

        try {
            const { entity_type, entity_id } = req.body;
            const attachment = await attachmentService.createAttachment(req.user.company_id, req.user.id, {
                entity_type,
                entity_id,
                file_name: req.file.originalname,
                file_path: req.file.path,
                file_size: req.file.size,
                mime_type: req.file.mimetype
            });
            
            return successResponse(res, 201, "File uploaded successfully.", attachment);
        } catch (error) {
            next(error);
        }
    });
};

exports.getAttachments = async (req, res, next) => {
    try {
        const { entity_type, entity_id } = req.query;
        const list = await attachmentService.getAttachments(req.user.company_id, entity_type, entity_id);
        return successResponse(res, 200, "Attachments retrieved.", list);
    } catch (err) {
        next(err);
    }
};
