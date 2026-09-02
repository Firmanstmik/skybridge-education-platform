const jwt = require('jsonwebtoken');
const db = require('../config/db');

const hasUserColumn = async (columnName) => {
    try {
        const [rows] = await db.query('SHOW COLUMNS FROM users LIKE ?', [columnName]);
        return Array.isArray(rows) && rows.length > 0;
    } catch (_error) {
        return false;
    }
};

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const statusColumnExists = await hasUserColumn('status');
            const fields = statusColumnExists ? 'id, role, status' : 'id, role';
            const [users] = await db.query(`SELECT ${fields} FROM users WHERE id = ?`, [decoded.id]);
            if (users.length === 0) {
                res.status(401).json({ message: 'Not authorized, user not found' });
                return;
            }

            const user = users[0];
            if (statusColumnExists && user.status === 'Inactive') {
                res.status(401).json({ message: 'Not authorized, account inactive' });
                return;
            }

            req.user = {
                ...decoded,
                id: user.id,
                role: user.role,
            };
            next();
            return;
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
            return;
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && (req.user.role === 'SUPER_ADMIN' || req.user.role === 'superadmin')) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, admin };
