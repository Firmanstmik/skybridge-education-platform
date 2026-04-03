
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const db = require('./config/db');

async function migrate() {
    try {
        console.log('Starting migration...');
        
        // Check if columns exist
        const [columns] = await db.query('SHOW COLUMNS FROM users');
        const columnNames = columns.map(c => c.Field);

        if (!columnNames.includes('email')) {
            console.log('Adding email column...');
            await db.query('ALTER TABLE users ADD COLUMN email VARCHAR(100) UNIQUE');
        }
        
        if (!columnNames.includes('full_name')) {
            console.log('Adding full_name column...');
            await db.query('ALTER TABLE users ADD COLUMN full_name VARCHAR(100)');
        }

        if (!columnNames.includes('status')) {
            console.log('Adding status column...');
            await db.query("ALTER TABLE users ADD COLUMN status ENUM('Active', 'Nonactive') DEFAULT 'Active'");
        }

        // Update role column to be VARCHAR to support new roles or update ENUM
        console.log('Updating role column...');
        // We change to VARCHAR to avoid ENUM issues with new roles for now, or just extend ENUM
        // Safest is often VARCHAR for flexibility unless strict constraint is needed. 
        // But if it's currently ENUM, changing to VARCHAR is usually safe.
        await db.query("ALTER TABLE users MODIFY COLUMN role VARCHAR(50) DEFAULT 'STAFF'");

        console.log('Migration completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
