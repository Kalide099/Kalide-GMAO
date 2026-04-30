const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

exports.registerCompanyAndAdmin = async (data) => {
    const { firstName, lastName, email, password, companyName, industry } = data;
    
    // Start transaction since we'll insert into multiple tables
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        // 1. Check if user already exists
        const [existing] = await connection.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            const err = new Error('Email is already registered');
            err.statusCode = 409;
            err.isOperational = true;
            throw err;
        }

        const companyId = uuidv4();
        const userId = uuidv4();

        // 2. Create Company
        await connection.query(
            'INSERT INTO companies (id, name_en, name_fr, industry_en, industry_fr, subscription_status, plan) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [companyId, companyName, companyName, industry, industry, 'active', 'basic']
        );

        // 3. Hash password and Create User (Admin of the company)
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        await connection.query(
            'INSERT INTO users (id, company_id, first_name, last_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, companyId, firstName, lastName, email, passwordHash, 'admin']
        );

        await connection.commit();
        
        return {
            userId,
            companyId,
            role: 'admin'
        };

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

exports.loginUser = async (email, password) => {
    const [users] = await pool.query(`
        SELECT u.*, c.industry_en as industry, c.enabled_modules, c.plan
        FROM users u 
        LEFT JOIN companies c ON u.company_id = c.id 
        WHERE u.email = ?
    `, [email]);
    
    if (users.length === 0) {
        const err = new Error('Invalid email or password');
        err.statusCode = 401;
        throw err;
    }

    const user = users[0];

    if (user.status !== 'active' || user.deleted_at !== null) {
        const err = new Error('Account is inactive or suspended.');
        err.statusCode = 401;
        throw err;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        const err = new Error('Invalid email or password');
        err.statusCode = 401;
        throw err;
    }

    // Parse enabled_modules if it exists
    let enabledModules = [];
    try {
        enabledModules = typeof user.enabled_modules === 'string' 
            ? JSON.parse(user.enabled_modules) 
            : (user.enabled_modules || []);
    } catch (e) {
        console.error("Failed to parse modules for user", user.id);
    }

    // Generate JWT Token
    const payload = {
        id: user.id,
        company_id: user.company_id,
        role: user.role,
        industry: user.industry,
        plan: user.plan || 'enterprise', // Default for system admins
        enabled_modules: enabledModules
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    });

    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            role: user.role,
            companyId: user.company_id,
            industry: user.industry
        }
    };
};
