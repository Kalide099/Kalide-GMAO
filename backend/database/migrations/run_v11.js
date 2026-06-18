const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function runMigration() {
    const uri = "mysql://u633695266_gmaouser:MoyoLim123@srv1319.hstgr.io:3306/u633695266_kgmao?connect_timeout=30&sslmode=no-verify";
    
    console.log(`Connecting directly to Hostinger DB using provided connection string...`);

    const pool = mysql.createPool({
        uri: uri,
        multipleStatements: true
    });

    try {
        console.log('Applying v11_nexus_module_data.sql to Hostinger...');
        const sql = fs.readFileSync(path.join(__dirname, 'v11_nexus_module_data.sql'), 'utf8');
        await pool.query(sql);
        console.log('✅ Migration v11 applied successfully to Hostinger!');
    } catch (e) {
        console.error('❌ Migration failed:', e);
    } finally {
        await pool.end();
    }
}

runMigration();
