const mysql = require('mysql2/promise');

async function checkUser() {
    try {
        const connection = await mysql.createConnection({
            host: '127.0.0.1',
            user: 'root',
            password: '',
            database: 'kgmao_db',
            port: 3306
        });

        const [rows] = await connection.query('SELECT id, email, role, status FROM users WHERE email = ?', ['demo@kgmao.com']);
        console.log('User from DB:', rows);
        process.exit(0);
    } catch (err) {
        console.error('Error connecting to root localhost db:', err.message);
        
        try {
            console.log('Trying u633695266_kgmao database instead...');
            const connection2 = await mysql.createConnection({
                host: '127.0.0.1',
                user: 'root',
                password: '',
                database: 'u633695266_kgmao',
                port: 3306
            });
            const [rows2] = await connection2.query('SELECT id, email, role, status FROM users WHERE email = ?', ['demo@kgmao.com']);
            console.log('User from u633695266_kgmao DB:', rows2);
            process.exit(0);
        } catch(err2) {
            console.error('Error connecting to root localhost u633695266_kgmao:', err2.message);
            process.exit(1);
        }
    }
}
checkUser();
