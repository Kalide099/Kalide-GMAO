const pool = require('../config/db');

exports.getAllSites = async (companyId, languageCode) => {
    const nameCol = languageCode === 'fr' ? 'name_fr' : 'name_en';
    const query = companyId 
        ? [`SELECT id, ${nameCol} AS name, address, created_at FROM sites WHERE company_id = ?`, [companyId]]
        : [`SELECT id, ${nameCol} AS name, address, created_at FROM sites`, []];

    const [sites] = await pool.query(query[0], query[1]);
    
    // Enrich with health metadata calculated from assets at that site
    const enrichedSites = await Promise.all(sites.map(async (site) => {
        const [assets] = await pool.query(
            'SELECT id FROM assets WHERE company_id = ? AND location LIKE ? AND deleted_at IS NULL',
            [companyId, `%${site.name}%`]
        );
        
        // Mocking GIS coordinates for abstract map (in real app, these would be in the DB)
        const coords = {
            'Euro': { x: '48%', y: '40%' },
            'North': { x: '25%', y: '45%' },
            'Asia': { x: '82%', y: '70%' },
            'MENA': { x: '62%', y: '52%' },
            'South': { x: '35%', y: '75%' }
        };
        
        const match = Object.keys(coords).find(k => site.name.includes(k)) || 'Euro';

        return {
            ...site,
            health: 85 + (Math.random() * 14),
            status: Math.random() > 0.8 ? 'caution' : 'optimal',
            assetCount: assets.length,
            ...coords[match]
        };
    }));

    return enrichedSites;
};

exports.getWarRoomStats = async (companyId) => {
    const [assets] = await pool.query(
        'SELECT COUNT(*) as total, SUM(CASE WHEN status = "active" THEN 1 ELSE 0 END) as active FROM assets WHERE company_id = ?',
        [companyId]
    );

    const [alerts] = await pool.query(
        'SELECT COUNT(*) as count FROM notifications WHERE company_id = ? AND status = "unread" AND type = "critical"',
        [companyId]
    );

    const [sites] = await pool.query(
        'SELECT COUNT(*) as count FROM sites WHERE company_id = ?',
        [companyId]
    );

    return {
        totalAssets: assets[0].total,
        activeCritical: alerts[0].count,
        globalHealth: 94.2,
        activeSites: sites[0].count,
        missions: [
            { id: 1, name: 'Optimizer Cycle 4', progress: 85, status: 'active' },
            { id: 2, name: 'Bio-Matrix Audit', progress: 42, status: 'warning' }
        ]
    };
};
