const express = require('express');
const router = express.Router();

const {
    createPlace,
    getMyPlaces
} = require('../controllers/placeController');

const { protect } = require('../middleware/auth');


/* ================= CREATE ================= */
// User submits a place
router.post('/', protect, createPlace);


/* ================= USER SUBMISSIONS ================= */
// Optional but VERY useful for debugging/user dashboard
router.get('/my', protect, getMyPlaces);


module.exports = router;
