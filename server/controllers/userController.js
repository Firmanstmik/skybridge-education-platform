const db = require('../config/db');
const bcrypt = require('bcryptjs');

const userColumnCache = new Map();

const hasUserColumn = async (columnName) => {
    const key = String(columnName || '').trim();
    if (!key) return false;
    if (userColumnCache.has(key)) return userColumnCache.get(key);
    try {
        const [rows] = await db.query('SHOW COLUMNS FROM users LIKE ?', [key]);
        const exists = Array.isArray(rows) && rows.length > 0;
        userColumnCache.set(key, exists);
        return exists;
    } catch (_e) {
        userColumnCache.set(key, false);
        return false;
    }
};

const getSelectableUserFields = async () => {
    const fields = ['id', 'username'];
    if (await hasUserColumn('email')) fields.push('email');
    if (await hasUserColumn('full_name')) fields.push('full_name');
    if (await hasUserColumn('role')) fields.push('role');
    if (await hasUserColumn('status')) fields.push('status');
    if (await hasUserColumn('created_at')) fields.push('created_at');
    return fields.join(', ');
};

exports.getAllUsers = async (req, res) => {
    try {
        const fields = await getSelectableUserFields();
        const [users] = await db.query(`SELECT ${fields} FROM users ORDER BY created_at DESC`);
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const fields = await getSelectableUserFields();
        const [rows] = await db.query(
            `SELECT ${fields} FROM users WHERE id = ?`,
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
        if (email && await hasUserColumn('email')) {
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

        if (email !== undefined && await hasUserColumn('email')) {
            sets.push('email = ?');
            params.push(email);
        }
        if (full_name !== undefined && await hasUserColumn('full_name')) {
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
        const fields = await getSelectableUserFields();
        const [rows] = await db.query(
            `SELECT ${fields} FROM users WHERE id = ?`,
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
        let existing = [];
        if (await hasUserColumn('email')) {
            const [rows] = await db.query('SELECT id FROM users WHERE username = ? OR email = ?', [username, email]);
            existing = rows;
        } else {
            const [rows] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
            existing = rows;
        }
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const insertCols = ['username', 'password'];
        const insertVals = [username, hashedPassword];

        if (await hasUserColumn('email')) {
            insertCols.push('email');
            insertVals.push(email ?? null);
        }
        if (await hasUserColumn('full_name')) {
            insertCols.push('full_name');
            insertVals.push(full_name ?? null);
        }
        if (await hasUserColumn('role')) {
            insertCols.push('role');
            insertVals.push(role);
        }
        if (await hasUserColumn('status')) {
            insertCols.push('status');
            insertVals.push(status || 'Active');
        }

        const placeholders = insertCols.map(() => '?').join(', ');
        await db.query(`INSERT INTO users (${insertCols.join(', ')}) VALUES (${placeholders})`, insertVals);

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        const msg = String(error?.message || '');
        if (msg.includes("Unknown column 'email'") || msg.includes("Unknown column 'full_name'") || msg.includes("Unknown column 'status'")) {
            return res.status(500).json({ message: 'Struktur tabel users di database belum lengkap. Jalankan migration kolom users.email/users.full_name/users.status.' });
        }
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

        const sets = [];
        const params = [];

        if (await hasUserColumn('email')) {
            sets.push('email = ?');
            params.push(email ?? null);
        }
        if (await hasUserColumn('full_name')) {
            sets.push('full_name = ?');
            params.push(full_name ?? null);
        }
        if (await hasUserColumn('role')) {
            sets.push('role = ?');
            params.push(role);
        }
        if (await hasUserColumn('status')) {
            sets.push('status = ?');
            params.push(status);
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

        const query = `UPDATE users SET ${sets.join(', ')} WHERE id = ?`;
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
