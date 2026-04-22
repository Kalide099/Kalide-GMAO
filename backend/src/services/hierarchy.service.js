const pool = require('../config/db');

/**
 * Asset Hierarchy & Location Navigator
 */
exports.getAssetTree = async (companyId) => {
    const [rows] = await pool.query(
        `SELECT id, parent_id, name_en, name_fr, status, zone_id
         FROM assets
         WHERE company_id = ? AND deleted_at IS NULL`,
        [companyId]
    );

    const assetMap = {};
    const roots = [];

    rows.forEach(asset => {
        asset.children = [];
        assetMap[asset.id] = asset;
    });

    rows.forEach(asset => {
        if (asset.parent_id && assetMap[asset.parent_id]) {
            assetMap[asset.parent_id].children.push(asset);
        } else {
            roots.push(asset);
        }
    });

    return roots;
};

exports.getLocationHierarchy = async (companyId) => {
    const [sites] = await pool.query(
        `SELECT * FROM sites WHERE company_id = ?`,
        [companyId]
    );

    for (let site of sites) {
        const [zones] = await pool.query(
            `SELECT * FROM zones WHERE site_id = ?`,
            [site.id]
        );
        site.zones = zones;
        
        for (let zone of zones) {
            const [assets] = await pool.query(
                `SELECT id, name_en, name_fr FROM assets WHERE zone_id = ?`,
                [zone.id]
            );
            zone.assets = assets;
        }
    }

    return sites;
};
