const db = require('../config/db');

exports.getLogisticsOverview = async (req, res, next) => {
    try {
        const companyId = req.user.company_id;
        
        // Fetch purchase orders that are 'sent' or 'received' as proxy for shipments
        const [orders] = await db.query(
            `SELECT po.*, s.name_en as supplier_name 
             FROM purchase_orders po
             JOIN suppliers s ON po.supplier_id = s.id
             WHERE po.company_id = ? AND po.status IN ('sent', 'received')
             ORDER BY po.updated_at DESC LIMIT 10`,
            [companyId]
        );

        // Simulated port congestion for global matrix
        const portDelays = [
            { port: 'Port of Rotterdam', delay: 4, status: 'caution' },
            { port: 'Singapore Hub', delay: 0, status: 'nominal' },
            { port: 'Jebel Ali Port', delay: 12, status: 'critical' }
        ];

        res.status(200).json({
            success: true,
            data: {
                shipments: orders,
                portDelays,
                freightFlux: Math.floor(Math.random() * 50) + 100 // Simulated metrics
            }
        });
    } catch (error) {
        next(error);
    }
};
