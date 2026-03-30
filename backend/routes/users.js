const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');

// @desc  Get user by ID (public profile)
// @route GET /api/users/:id
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password -savedPlaces');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc  Save/unsave a location
// @route PUT /api/users/saved/:locationId
router.put('/saved/:locationId', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const locId = req.params.locationId;
        const idx = user.savedPlaces.indexOf(locId);
        if (idx > -1) {
            user.savedPlaces.splice(idx, 1);
        } else {
            user.savedPlaces.addToSet(locId);
        }
        await user.save();
        res.json({ savedPlaces: user.savedPlaces });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
