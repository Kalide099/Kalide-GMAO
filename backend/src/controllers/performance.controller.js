const db = require('../config/db');

exports.getTeamPerformance = async (req, res, next) => {
    try {
        const companyId = req.user.company_id;
        
        // Aggregate work order metrics per user
        const [performers] = await db.query(
            `SELECT 
                u.first_name, 
                u.last_name, 
                COUNT(wo.id) as total_tasks,
                SUM(CASE WHEN wo.status = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
                AVG(CASE WHEN wo.status = 'completed' THEN TIMESTAMPDIFF(HOUR, wo.created_at, wo.updated_at) ELSE NULL END) as avg_hours
             FROM users u
             LEFT JOIN work_orders wo ON u.id = wo.technician_id
             WHERE u.company_id = ? AND u.role = 'technician'
             GROUP BY u.id
             ORDER BY completed_tasks DESC LIMIT 5`,
            [companyId]
        );

        // Overall company metrics
        const [totals] = await db.query(
            `SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
             FROM work_orders
             WHERE company_id = ?`,
            [companyId]
        );

        const totalWO = totals[0].total || 0;
        const completedWO = totals[0].completed || 0;
        const completionRate = totalWO > 0 ? Math.round((completedWO / totalWO) * 100) : 0;

        res.status(200).json({
            success: true,
            data: {
                performers,
                stats: {
                    completionRate,
                    qualityScore: 94, // Placeholder for feedback-based score
                    activeTechnicians: performers.length,
                    avgRepairTime: 4.2 // Hours
                }
            }
        });
    } catch (error) {
        next(error);
    }
};
