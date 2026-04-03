const mysql = require('mysql2/promise');
require('dotenv').config();

const run = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('Connected to database.');

        // Add 'Draft' to status ENUM
        await connection.query("ALTER TABLE students MODIFY COLUMN status ENUM('Menunggu Verifikasi', 'Diterima', 'Ditolak', 'Terverifikasi', 'Draft') DEFAULT 'Menunggu Verifikasi'");
        console.log('Successfully added "Draft" and "Terverifikasi" to status ENUM.');

        await connection.end();
    } catch (error) {
        console.error('Migration failed:', error);
    }
};

run();
