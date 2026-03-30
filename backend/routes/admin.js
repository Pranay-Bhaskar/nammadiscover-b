const express = require('express');
const router = express.Router();
const { getStats, getUsers, updateUserRole } = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/auth');

router.get('/stats', protect, isAdmin, getStats);
router.get('/users', protect, isAdmin, getUsers);
router.put('/users/:id/role', protect, isAdmin, updateUserRole);

module.exports = router;
