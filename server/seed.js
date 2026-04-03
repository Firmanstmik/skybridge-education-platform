const db = require('./config/db');
const bcrypt = require('bcryptjs');

const USERNAME = 'adminlpk';
const PASSWORD = 'LPKSDoryouku';

const seedAdmin = async () => {
    try {
        console.log('Seeding admin user...');
        
        const [users] = await db.query('SELECT * FROM users WHERE username = ?', [USERNAME]);
        
        if (users.length > 0) {
            console.log('Admin user already exists.');
            console.log('Username:', USERNAME);
            console.log('Password: (already set in database)');
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(PASSWORD, salt);
        
        await db.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [USERNAME, hashedPassword, 'superadmin']);
        
        console.log('Admin user created successfully.');
        console.log('Username:', USERNAME);
        console.log('Password:', PASSWORD);
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
