const pool = require('../config/db');

/**
 * Enterprise SLA & Ticketing Engine
 */
exports.checkSLAViolations = async (companyId) => {
    // 1. Find all active work orders and compare vs deadlines
    const [orders] = await pool.query(
        `SELECT wo.id, wo.priority, wo.created_at, wo.status
         FROM work_orders wo
         WHERE wo.company_id = ? AND wo.status != 'completed'`,
        [companyId]
    );

    const violations = [];
    const now = new Date();

    const SLA_THRESHOLDS = {
        critical: 4, // 4 hours
        high: 12,
        medium: 24,
        low: 72
    };

    for (const order of orders) {
        const threshold = SLA_THRESHOLDS[order.priority] || 24;
        const elapsed = (now - new Date(order.created_at)) / (1000 * 60 * 60);
        
        if (elapsed > threshold) {
            violations.push({
                orderId: order.id,
                penalty: 'SLA_BREACH',
                severity: order.priority === 'critical' ? 'CRITICAL' : 'WARNING'
            });
        }
    }

    return violations;
};

/**
 * Ticketing Portal Logic
 * Converts external client requests into Work Orders
 */
exports.convertTicketToWorkOrder = async (ticketData) => {
    // Shared ingestion logic
};
