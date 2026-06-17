const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

/**
 * Enterprise Maintenance Scheduler
 * Triggered periodically to generate work orders from schedules
 */
exports.processSchedules = async () => {
    const [schedules] = await pool.query(
        `SELECT s.*, a.company_id, a.name_en as asset_name
         FROM maintenance_schedules s
         JOIN assets a ON s.asset_id = a.id
         WHERE s.status = 'active' AND (s.next_run <= NOW() OR s.next_run IS NULL)`
    );

    for (let schedule of schedules) {
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            const woId = uuidv4();
            // Generate Work Order
            await connection.query(
                `INSERT INTO work_orders (id, company_id, asset_id, creator_id, title_en, title_fr, type, priority, status, scheduled_date)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    woId, 
                    schedule.company_id, 
                    schedule.asset_id, 
                    '00000000-0000-0000-0000-000000000000', // System account
                    `Preventive Maintenance: ${schedule.asset_name}`,
                    `Maintenance Préventive : ${schedule.asset_name}`,
                    'preventive',
                    'medium',
                    'pending',
                    new Date()
                ]
            );

            // Update schedule next run (simplification: +30 days)
            const nextRun = new Date();
            nextRun.setDate(nextRun.getDate() + 30); 

            await connection.query(
                `UPDATE maintenance_schedules SET last_run = NOW(), next_run = ? WHERE id = ?`,
                [nextRun, schedule.id]
            );

            await connection.commit();
            console.log(`[SCHEDULER] Generated WO ${woId} for Asset ${schedule.asset_id}`);
        } catch (err) {
            await connection.rollback();
            console.error(`[SCHEDULER ERROR] ${err.message}`);
        } finally {
            connection.release();
        }
    }
};

// Auto-run every hour (in a real production app, this would be in a separate worker)
// cron.schedule('0 * * * *', () => {
//     this.processSchedules();
// });
