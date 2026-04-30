// ======================
// FULL BACKEND (SERVER.JS)
// ======================

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

// ======================
// DATABASE CONFIG
// ======================
const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// ======================
// HEALTH CHECK
// ======================
app.get("/", (req, res) => {
    res.send("API is running ✅");
});

// ======================
// LOGIN ROUTE (FIXED)
// ======================
app.post("/api/v1/auth/login", async (req, res) => {
    let connection;

    try {
        const { email, password } = req.body;

        console.log("🔍 LOGIN ATTEMPT:", email);

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }

        // Get DB connection
        connection = await pool.getConnection();

        // Query user
        const [users] = await connection.query(
            `SELECT u.*, c.industry_en as industry, c.enabled_modules, c.plan
       FROM users u
       LEFT JOIN companies c ON u.company_id = c.id
       WHERE u.email = ?`,
            [email]
        );

        if (!users || users.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const user = users[0];

        // Check user status
        if (user.status !== "active" || user.deleted_at !== null) {
            return res.status(401).json({ message: "Account inactive" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Parse modules safely
        let enabledModules = [];
        try {
            enabledModules =
                typeof user.enabled_modules === "string"
                    ? JSON.parse(user.enabled_modules)
                    : user.enabled_modules || [];
        } catch (e) {
            console.error("Module parse error:", e.message);
        }

        // Generate token
        const token = jwt.sign(
            {
                id: user.id,
                company_id: user.company_id,
                role: user.role,
                industry: user.industry,
                plan: user.plan || "enterprise",
                enabled_modules: enabledModules,
            },
            process.env.JWT_SECRET || "fallback_secret",
            { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
        );

        console.log("✅ LOGIN SUCCESS:", email);

        return res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                role: user.role,
                companyId: user.company_id,
                industry: user.industry,
            },
        });

    } catch (error) {
        console.error("❌ LOGIN ERROR:", error.message);

        return res.status(503).json({
            message: "Database unavailable or server error",
        });

    } finally {
        if (connection) connection.release();
    }
});

// ======================
// START SERVER
// ======================
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
});