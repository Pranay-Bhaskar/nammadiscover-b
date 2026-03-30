const express = require('express');
const router = express.Router();
const { getModerationQueue, moderateVideo } = require('../controllers/moderationController');
const { protect, isAdmin } = require('../middleware/auth');

// GET /api/moderate/queue - Get all pending videos (admin only)
router.get('/queue', protect, isAdmin, getModerationQueue);

// POST /api/moderate/:id - Approve or reject a specific video (admin only)
router.post('/:id', protect, isAdmin, moderateVideo);

module.exports = router;
