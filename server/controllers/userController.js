const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, username, email, full_name, role, status, created_at FROM users ORDER BY created_at DESC');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const [rows] = await db.query(
            'SELECT id, username, email, full_name, role, status, created_at FROM users WHERE id = ?',
            [userId]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateProfile = async (req, res) => {
    const userId = req.user.id;
    const { email, full_name, username, password } = req.body;

    try {
        // Ensure unique username/email if provided
        if (email) {
            const [emailUsers] = await db.query('SELECT id FROM users WHERE email = ? AND id <> ?', [email, userId]);
            if (emailUsers.length > 0) {
                return res.status(400).json({ message: 'Email already in use' });
            }
        }
        if (username) {
            const [usernameUsers] = await db.query('SELECT id FROM users WHERE username = ? AND id <> ?', [username, userId]);
            if (usernameUsers.length > 0) {
                return res.status(400).json({ message: 'Username already in use' });
            }
        }

        let query = 'UPDATE users SET ';
        const params = [];
        const sets = [];

        if (email !== undefined) {
            sets.push('email = ?');
            params.push(email);
        }
        if (full_name !== undefined) {
            sets.push('full_name = ?');
            params.push(full_name);
        }
        if (username !== undefined) {
            sets.push('username = ?');
            params.push(username);
        }
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            sets.push('password = ?');
            params.push(hashedPassword);
        }

        if (sets.length === 0) {
            return res.json({ message: 'Nothing to update' });
        }

        query += sets.join(', ') + ' WHERE id = ?';
        params.push(userId);

        await db.query(query, params);

        // Return updated profile
        const [rows] = await db.query(
            'SELECT id, username, email, full_name, role, status, created_at FROM users WHERE id = ?',
            [userId]
        );

        res.json({ message: 'Profile updated successfully', user: rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createUser = async (req, res) => {
    const { username, email, password, full_name, role, status } = req.body;
    
    // Validate role
    const validRoles = ['SUPER_ADMIN', 'STAFF', 'KEPALA_LPK', 'admin', 'superadmin'];
    if (!validRoles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
    }

    try {
        // Check if username or email exists
        const [existing] = await db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await db.query(
            'INSERT INTO users (username, email, password, full_name, role, status) VALUES (?, ?, ?, ?, ?, ?)',
            [username, email, hashedPassword, full_name, role, status || 'Active']
        );

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { email, full_name, role, status, password } = req.body;

    try {
        // Check if user exists
        const [users] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        let query = 'UPDATE users SET email = ?, full_name = ?, role = ?, status = ?';
        let params = [email, full_name, role, status];

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            query += ', password = ?';
            params.push(hashedPassword);
        }

        query += ' WHERE id = ?';
        params.push(id);

        await db.query(query, params);

        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM users WHERE id = ?', [id]);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
