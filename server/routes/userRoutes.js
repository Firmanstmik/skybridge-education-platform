const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// Admin-only user management
router.get('/', protect, admin, userController.getAllUsers);
router.post('/', protect, admin, userController.createUser);
router.put('/:id', protect, admin, userController.updateUser);
router.delete('/:id', protect, admin, userController.deleteUser);

// Self profile endpoints
router.get('/me', protect, userController.getProfile);
router.put('/me', protect, userController.updateProfile);

module.exports = router;
