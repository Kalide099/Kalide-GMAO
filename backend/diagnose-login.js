const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function diagnose() {
    console.log("==========================================");
    console.log("🔍 KGMAO LOGIN DIAGNOSTIC TOOL");
    console.log("==========================================");

    const testAccounts = [
        { email: 'root@kgmao.com', pass: 'RootMaster2026!' },
        { email: 'demo@kgmao.com', pass: 'DemoUser2026!' }
    ];

    try {
        // 1. Check Env Vars
        console.log("\n1. Checking Environment Variables...");
        if (!process.env.JWT_SECRET) {
            console.error("❌ ERROR: JWT_SECRET is missing in .env!");
        } else {
            console.log("✅ JWT_SECRET is present.");
        }

        // 2. Check Database Connection
        console.log("\n2. Connecting to Database...");
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3306
        });
        console.log(`✅ Connected to [${process.env.DB_NAME}] on [${process.env.DB_HOST}]`);

        // 3. Check Users and Passwords
        console.log("\n3. Verifying Accounts...");
        for (const acc of testAccounts) {
            console.log(`--- Checking: ${acc.email} ---`);
            const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', [acc.email]);
            
            if (rows.length === 0) {
                console.error(`❌ ERROR: User [${acc.email}] not found in database!`);
                continue;
            }

            const user = rows[0];
            console.log(`✅ User found (Role: ${user.role}, Status: ${user.status})`);

            if (user.status !== 'active') {
                console.error(`❌ ERROR: User status is [${user.status}], should be [active]!`);
            }

            const isMatch = await bcrypt.compare(acc.pass, user.password_hash);
            if (isMatch) {
                console.log("✅ Password VERIFIED (Bcrypt match successful).");
            } else {
                console.error("❌ ERROR: Password does NOT match the hash in DB!");
                console.log("💡 Tip: Re-run 'npm run init-db' to reset the passwords.");
            }

            // 4. Test Token Generation
            try {
                const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
                console.log("✅ JWT Token generation: SUCCESS");
            } catch (jwtErr) {
                console.error("❌ ERROR: Failed to sign JWT token:", jwtErr.message);
            }
        }

        await connection.end();
        console.log("\n==========================================");
        console.log("DIAGNOSTIC COMPLETE");
        console.log("==========================================");

    } catch (err) {
        console.error("\n❌ CRITICAL SYSTEM ERROR:");
        console.error(err.stack);
        process.exit(1);
    }
}

diagnose();
