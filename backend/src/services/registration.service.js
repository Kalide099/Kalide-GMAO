const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.createRequest = async (data) => {
    const { companyName, industry, adminFirstName, adminLastName, adminEmail } = data;
    const id = uuidv4();
    
    await pool.query(
        'INSERT INTO registration_requests (id, company_name, industry, admin_first_name, admin_last_name, admin_email) VALUES (?, ?, ?, ?, ?, ?)',
        [id, companyName, industry, adminFirstName, adminLastName, adminEmail]
    );
    
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
        // 1. Update Request Status
        await connection.query(
            'UPDATE registration_requests SET status = ?, processed_at = NOW(), processed_by = ?, notes = ? WHERE id = ?',
            [status, processorId, notes, id]
        );

        if (status === 'approved') {
            // 2. Fetch request details
            const [requests] = await connection.query('SELECT * FROM registration_requests WHERE id = ?', [id]);
            const r = requests[0];

            const companyId = uuidv4();
            const userId = uuidv4();

            // 3. Create Company
            await connection.query(
                'INSERT INTO companies (id, name_en, name_fr, industry_en, industry_fr, subscription_status) VALUES (?, ?, ?, ?, ?, ?)',
                [companyId, r.company_name, r.company_name, r.industry, r.industry, 'active']
            );

            // 4. Create Admin User (Temp password needs to be sent via email in real app)
            // For this demo, we use a default password 'Welcome123!'
            const bcrypt = require('bcrypt');
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash('Welcome123!', salt);

            await connection.query(
                'INSERT INTO users (id, company_id, first_name, last_name, email, password_hash, role, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [userId, companyId, r.admin_first_name, r.admin_last_name, r.admin_email, passwordHash, 'admin', 'active']
            );
            
            await connection.commit();
            return { companyId, userId, approved: true };
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
