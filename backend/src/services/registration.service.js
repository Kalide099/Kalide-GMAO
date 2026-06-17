const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const { getModulesForPlan } = require('../config/industryTemplates');

const REGISTRATION_REQUEST_COLUMNS = {
    admin_phone: 'ALTER TABLE registration_requests ADD COLUMN admin_phone VARCHAR(50) NULL AFTER admin_email',
    preferred_language: "ALTER TABLE registration_requests ADD COLUMN preferred_language CHAR(2) NOT NULL DEFAULT 'en' AFTER password_hash",
    requested_plan: "ALTER TABLE registration_requests ADD COLUMN requested_plan ENUM('basic', 'pro', 'enterprise') NOT NULL DEFAULT 'basic' AFTER preferred_language"
};

const VALID_PLANS = new Set(['basic', 'pro', 'enterprise']);

const normalizePlan = (plan) => {
    const normalized = String(plan || 'basic').toLowerCase();
    return VALID_PLANS.has(normalized) ? normalized : 'basic';
};

const normalizeLanguage = (language) => (
    String(language || 'en').toLowerCase() === 'fr' ? 'fr' : 'en'
);

const isMissingCompanyDefaultLanguageColumn = (error) => (
    error &&
    error.code === 'ER_BAD_FIELD_ERROR' &&
    String(error.sqlMessage || '').toLowerCase().includes('default_language')
);

const isMissingUserPreferredLanguageColumn = (error) => (
    error &&
    error.code === 'ER_BAD_FIELD_ERROR' &&
    String(error.sqlMessage || '').toLowerCase().includes('preferred_language')
);

const isMissingCompanyEnabledModulesColumn = (error) => (
    error &&
    error.code === 'ER_BAD_FIELD_ERROR' &&
    String(error.sqlMessage || '').toLowerCase().includes('enabled_modules')
);

const ensureRegistrationRequestsSchema = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS registration_requests (
            id CHAR(36) PRIMARY KEY,
            company_name VARCHAR(255) NOT NULL,
            industry VARCHAR(100) NOT NULL,
            admin_first_name VARCHAR(100) NOT NULL,
            admin_last_name VARCHAR(100) NOT NULL,
            admin_email VARCHAR(255) NOT NULL,
            admin_phone VARCHAR(50) NULL,
            password_hash VARCHAR(255) NOT NULL,
            preferred_language CHAR(2) NOT NULL DEFAULT 'en',
            requested_plan ENUM('basic', 'pro', 'enterprise') NOT NULL DEFAULT 'basic',
            status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            processed_at TIMESTAMP NULL,
            processed_by CHAR(36) NULL,
            FOREIGN KEY (processed_by) REFERENCES users(id) ON DELETE SET NULL
        )
    `);

    const [columns] = await pool.query(
        `SELECT column_name AS column_name
         FROM information_schema.columns
         WHERE table_schema = DATABASE()
           AND table_name = 'registration_requests'
           AND column_name IN ('admin_phone', 'preferred_language', 'requested_plan')`
    );

    const existingColumns = new Set(columns.map((column) => column.column_name));
    for (const [columnName, alterSql] of Object.entries(REGISTRATION_REQUEST_COLUMNS)) {
        if (!existingColumns.has(columnName)) {
            try {
                await pool.query(alterSql);
            } catch (error) {
                if (error.code !== 'ER_DUP_FIELDNAME') {
                    throw error;
                }
            }
        }
    }
};

exports.createRequest = async (data) => {
    const { companyName, industry, adminFirstName, adminLastName, adminEmail, adminPhone, password } = data;
    const id = uuidv4();
    const requestedPlan = normalizePlan(data.plan || data.requestedPlan || data.requested_plan);
    const preferredLanguage = normalizeLanguage(data.preferredLanguage || data.preferred_language);

    await ensureRegistrationRequestsSchema();

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    try {
        await pool.query(
            'INSERT INTO registration_requests (id, company_name, industry, admin_first_name, admin_last_name, admin_email, admin_phone, password_hash, preferred_language, requested_plan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [id, companyName, industry, adminFirstName, adminLastName, adminEmail, adminPhone || null, passwordHash, preferredLanguage, requestedPlan]
        );
    } catch (error) {
        if (error.code === 'ER_BAD_FIELD_ERROR') {
            const msg = String(error.sqlMessage || '').toLowerCase();
            if (msg.includes('preferred_language') && msg.includes('admin_phone')) {
                await pool.query(
                    'INSERT INTO registration_requests (id, company_name, industry, admin_first_name, admin_last_name, admin_email, password_hash, requested_plan) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [id, companyName, industry, adminFirstName, adminLastName, adminEmail, passwordHash, requestedPlan]
                );
            } else if (msg.includes('admin_phone')) {
                await pool.query(
                    'INSERT INTO registration_requests (id, company_name, industry, admin_first_name, admin_last_name, admin_email, password_hash, preferred_language, requested_plan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [id, companyName, industry, adminFirstName, adminLastName, adminEmail, passwordHash, preferredLanguage, requestedPlan]
                );
            } else if (msg.includes('preferred_language')) {
                await pool.query(
                    'INSERT INTO registration_requests (id, company_name, industry, admin_first_name, admin_last_name, admin_email, admin_phone, password_hash, requested_plan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [id, companyName, industry, adminFirstName, adminLastName, adminEmail, adminPhone || null, passwordHash, requestedPlan]
                );
            } else {
                throw error;
            }
        } else {
            throw error;
        }
    }

    return { id };
};

exports.getAllRequests = async () => {
    const [rows] = await pool.query('SELECT * FROM registration_requests ORDER BY created_at DESC');
    return rows;
};

exports.processRequest = async (id, status, processorId, notes = '') => {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        await connection.query(
            'UPDATE registration_requests SET status = ?, processed_at = NOW(), processed_by = ?, notes = ? WHERE id = ?',
            [status, processorId, notes, id]
        );

        if (status === 'approved') {
            const [requests] = await connection.query('SELECT * FROM registration_requests WHERE id = ?', [id]);
            const r = requests[0];

            if (!r) {
                const err = new Error('Registration request not found.');
                err.statusCode = 404;
                throw err;
            }

            const companyId = uuidv4();
            const userId = uuidv4();
            const approvedPlan = normalizePlan(r.requested_plan);
            const preferredLanguage = normalizeLanguage(r.preferred_language);
            const assignedModules = getModulesForPlan(r.industry, approvedPlan);

            try {
                await connection.query(
                    'INSERT INTO companies (id, name_en, name_fr, industry_en, industry_fr, subscription_status, plan, default_language, enabled_modules) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [companyId, r.company_name, r.company_name, r.industry, r.industry, 'active', approvedPlan, preferredLanguage, JSON.stringify(assignedModules)]
                );
            } catch (error) {
                if (isMissingCompanyEnabledModulesColumn(error)) {
                    try {
                        await connection.query(
                            'INSERT INTO companies (id, name_en, name_fr, industry_en, industry_fr, subscription_status, plan, default_language) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                            [companyId, r.company_name, r.company_name, r.industry, r.industry, 'active', approvedPlan, preferredLanguage]
                        );
                    } catch (fallbackError) {
                        if (!isMissingCompanyDefaultLanguageColumn(fallbackError)) {
                            throw fallbackError;
                        }

                        await connection.query(
                            'INSERT INTO companies (id, name_en, name_fr, industry_en, industry_fr, subscription_status, plan) VALUES (?, ?, ?, ?, ?, ?, ?)',
                            [companyId, r.company_name, r.company_name, r.industry, r.industry, 'active', approvedPlan]
                        );
                    }
                } else if (isMissingCompanyDefaultLanguageColumn(error)) {
                    await connection.query(
                        'INSERT INTO companies (id, name_en, name_fr, industry_en, industry_fr, subscription_status, plan, enabled_modules) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                        [companyId, r.company_name, r.company_name, r.industry, r.industry, 'active', approvedPlan, JSON.stringify(assignedModules)]
                    );
                } else {
                    throw error;
                }
            }

            try {
                await connection.query('UPDATE companies SET plan = ?, enabled_modules = ? WHERE id = ?', [approvedPlan, JSON.stringify(assignedModules), companyId]);
            } catch (syncModulesError) {
                if (!isMissingCompanyEnabledModulesColumn(syncModulesError)) {
                    throw syncModulesError;
                }

                await connection.query('UPDATE companies SET plan = ? WHERE id = ?', [approvedPlan, companyId]);
            }

            try {
                await connection.query('UPDATE companies SET default_language = ? WHERE id = ?', [preferredLanguage, companyId]);
            } catch (syncLanguageError) {
                if (!isMissingCompanyDefaultLanguageColumn(syncLanguageError)) {
                    throw syncLanguageError;
                }
            }

            try {
                await connection.query(
                    'INSERT INTO users (id, company_id, first_name, last_name, email, password_hash, role, status, preferred_language) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [userId, companyId, r.admin_first_name, r.admin_last_name, r.admin_email, r.password_hash, 'admin', 'active', preferredLanguage]
                );
            } catch (error) {
                if (!isMissingUserPreferredLanguageColumn(error)) {
                    throw error;
                }

                await connection.query(
                    'INSERT INTO users (id, company_id, first_name, last_name, email, password_hash, role, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [userId, companyId, r.admin_first_name, r.admin_last_name, r.admin_email, r.password_hash, 'admin', 'active']
                );
            }

            await connection.commit();
            return {
                companyId,
                userId,
                approved: true,
                plan: approvedPlan,
                enabledModules: assignedModules,
                preferredLanguage
            };
        }

        await connection.commit();
        return { approved: false };
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
};
