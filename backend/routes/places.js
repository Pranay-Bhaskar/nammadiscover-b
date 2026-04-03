const express = require('express');
const router = express.Router();

const { createPlace, getMyPlaces } = require('../controllers/placeController');
const { protect } = require('../middleware/auth');

// Submit place
router.post('/', protect, createPlace);

// My submissions
router.get('/my', protect, getMyPlaces);

module.exports = router;
