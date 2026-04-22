const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.getNotifications = async (companyId, userId = null) => {
    // If userId is provided, get notifications for that user or global company notifications
    const query = userId 
        ? 'SELECT * FROM notifications WHERE company_id = ? AND (user_id = ? OR user_id IS NULL) ORDER BY created_at DESC LIMIT 20'
        : 'SELECT * FROM notifications WHERE company_id = ? ORDER BY created_at DESC LIMIT 50';
    
    const params = userId ? [companyId, userId] : [companyId];
    const [rows] = await pool.query(query, params);
    return rows;
};

exports.markAsRead = async (companyId, notificationId) => {
    await pool.query(
        'UPDATE notifications SET is_read = TRUE WHERE id = ? AND company_id = ?',
        [notificationId, companyId]
    );
    return true;
};

exports.createNotification = async (companyId, data) => {
    const id = uuidv4();
    const { userId, type, title_en, title_fr, message_en, message_fr } = data;
    
    await pool.query(
        `INSERT INTO notifications (id, company_id, user_id, type, title_en, title_fr, message_en, message_fr) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, companyId, userId || null, type || 'system', title_en, title_fr, message_en, message_fr]
    );
    return { id, ...data };
};
