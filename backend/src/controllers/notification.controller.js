const notificationService = require('../services/notification.service');
const { successResponse, errorResponse } = require('../utils/responseHandler');

exports.getNotifications = async (req, res, next) => {
    try {
        const notifications = await notificationService.getNotifications(req.user.company_id, req.user.id);
        return successResponse(res, 200, 'Notifications retrieved.', notifications);
    } catch (err) {
        next(err);
    }
};

exports.markAsRead = async (req, res, next) => {
    try {
        await notificationService.markAsRead(req.user.company_id, req.params.id);
        return successResponse(res, 200, 'Notification marked as read.');
    } catch (err) {
        next(err);
    }
};
