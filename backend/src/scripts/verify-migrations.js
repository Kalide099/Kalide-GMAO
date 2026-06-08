const mysql = require('mysql2/promise');
require('dotenv').config();

async function verifyMigrations() {
    const dbName = process.env.DB_NAME || 'kgmao_db';
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: dbName,
        port: Number(process.env.DB_PORT || 3306)
    });

    try {
        const [migrationRows] = await connection.query('SELECT version FROM migrations ORDER BY version');

        const [passwordResetTable] = await connection.query(
            "SELECT COUNT(*) AS cnt FROM information_schema.tables WHERE table_schema = ? AND table_name = 'password_reset_tokens'",
            [dbName]
        );

        const [companyLangColumn] = await connection.query(
            "SELECT COUNT(*) AS cnt FROM information_schema.columns WHERE table_schema = ? AND table_name = 'companies' AND column_name = 'default_language'",
            [dbName]
        );

        const [userLangColumn] = await connection.query(
            "SELECT COUNT(*) AS cnt FROM information_schema.columns WHERE table_schema = ? AND table_name = 'users' AND column_name = 'preferred_language'",
            [dbName]
        );

        const [mfaColumns] = await connection.query(
            "SELECT column_name FROM information_schema.columns WHERE table_schema = ? AND table_name = 'users' AND column_name IN ('mfa_enabled', 'mfa_secret', 'mfa_temp_secret') ORDER BY column_name",
            [dbName]
        );

        console.log(JSON.stringify({
            database: dbName,
            migrations: migrationRows.map((row) => row.version),
            checks: {
                password_reset_tokens_table: Number(passwordResetTable[0].cnt) === 1,
                companies_default_language_column: Number(companyLangColumn[0].cnt) === 1,
                users_preferred_language_column: Number(userLangColumn[0].cnt) === 1,
                users_mfa_columns: mfaColumns.map((row) => row.column_name)
            }
        }, null, 2));
    } finally {
        await connection.end();
    }
}

verifyMigrations().catch((error) => {
    console.error('Migration verification failed:', error.message);
    process.exit(1);
});
