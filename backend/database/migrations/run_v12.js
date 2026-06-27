/**
 * run_v12.js — Deduplicate emails then apply v12_email_uniqueness.sql
 *
 * Safe strategy:
 *   users               : for each duplicated email, keep the row with the
 *                         latest created_at; soft-delete the older ones.
 *   registration_requests: for each duplicated email, keep the latest row;
 *                         reject (status='rejected') the older ones.
 *
 * Run: node backend/database/migrations/run_v12.js
 */

'use strict';

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const mysql = require('mysql2/promise');

const DB_CONFIG = {
    host:     process.env.DB_HOST     || 'localhost',
    port:     parseInt(process.env.DB_PORT || '3306', 10),
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME     || 'kgmao',
    multipleStatements: true,
};

async function run() {
    const conn = await mysql.createConnection(DB_CONFIG);
    console.log('✅  Connected to database:', DB_CONFIG.database);

    try {
        await conn.beginTransaction();

        // ── 1. Deduplicate active users ─────────────────────────────────────────
        // Find emails with more than one active (non-deleted) row
        const [dupUsers] = await conn.query(`
            SELECT email
            FROM   users
            WHERE  deleted_at IS NULL
            GROUP  BY email
            HAVING COUNT(*) > 1
        `);

        if (dupUsers.length === 0) {
            console.log('  users         : no duplicates found');
        } else {
            console.log(`  users         : ${dupUsers.length} duplicate email(s) to resolve`);
            for (const { email } of dupUsers) {
                // Keep the row created most recently; soft-delete the others
                const [rows] = await conn.query(
                    `SELECT id, created_at FROM users
                     WHERE  email = ? AND deleted_at IS NULL
                     ORDER  BY created_at DESC`,
                    [email]
                );
                const [keep, ...discard] = rows;
                console.log(`    email="${email}": keeping id=${keep.id}, soft-deleting ${discard.length} older row(s)`);
                for (const row of discard) {
                    await conn.query(
                        `UPDATE users SET deleted_at = NOW() WHERE id = ?`,
                        [row.id]
                    );
                }
            }
        }

        // ── 2. Deduplicate registration_requests ────────────────────────────────
        const [dupReqs] = await conn.query(`
            SELECT admin_email
            FROM   registration_requests
            WHERE  status IN ('pending', 'approved')
            GROUP  BY admin_email
            HAVING COUNT(*) > 1
        `);

        if (dupReqs.length === 0) {
            console.log('  reg_requests  : no duplicates found');
        } else {
            console.log(`  reg_requests  : ${dupReqs.length} duplicate email(s) to resolve`);
            for (const { admin_email } of dupReqs) {
                const [rows] = await conn.query(
                    `SELECT id, created_at FROM registration_requests
                     WHERE  admin_email = ? AND status IN ('pending', 'approved')
                     ORDER  BY created_at DESC`,
                    [admin_email]
                );
                const [keep, ...discard] = rows;
                console.log(`    email="${admin_email}": keeping id=${keep.id}, rejecting ${discard.length} older request(s)`);
                for (const row of discard) {
                    await conn.query(
                        `UPDATE registration_requests
                         SET status = 'rejected', notes = 'Auto-rejected: duplicate email during v12 deduplication'
                         WHERE id = ?`,
                        [row.id]
                    );
                }
            }
        }

        await conn.commit();
        console.log('✅  Deduplication committed');

        // ── 3. Apply v12 DDL ────────────────────────────────────────────────────
        console.log('\nApplying v12 schema changes…');

        // Drop old broken composite index (ignore if already gone)
        try {
            await conn.query('ALTER TABLE users DROP INDEX idx_company_email');
            console.log('  Dropped idx_company_email');
        } catch (e) {
            if (e.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
                console.log('  idx_company_email already absent — skipping');
            } else {
                throw e;
            }
        }

        // Add global unique index on users.email
        try {
            await conn.query('ALTER TABLE users ADD UNIQUE INDEX idx_email_unique (email)');
            console.log('  Added UNIQUE INDEX idx_email_unique on users(email)');
        } catch (e) {
            if (e.code === 'ER_DUP_KEYNAME') {
                console.log('  idx_email_unique already exists — skipping');
            } else {
                throw e;
            }
        }

        // Add unique index on registration_requests.admin_email
        try {
            await conn.query('ALTER TABLE registration_requests ADD UNIQUE INDEX idx_reg_email_unique (admin_email)');
            console.log('  Added UNIQUE INDEX idx_reg_email_unique on registration_requests(admin_email)');
        } catch (e) {
            if (e.code === 'ER_DUP_KEYNAME') {
                console.log('  idx_reg_email_unique already exists — skipping');
            } else {
                throw e;
            }
        }

        console.log('\n✅  v12 migration complete');
    } catch (err) {
        await conn.rollback();
        console.error('❌  Migration failed — rolled back:', err.message);
        process.exit(1);
    } finally {
        await conn.end();
    }
}

run();
