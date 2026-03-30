const express = require('express');
const router = express.Router();
const { 
    getLocations, 
    getLocationById, 
    createLocation, 
    searchLocations, 
    getNearby, 
    getReviewsByLocation,
    postReview 
} = require('../controllers/locationController');
const { protect, isAdmin } = require('../middleware/auth');

router.get('/', getLocations);
router.get('/search', searchLocations);
router.get('/:id', getLocationById);
router.get('/:id/nearby', getNearby);
router.get('/:id/reviews', getReviewsByLocation);
router.post('/:id/reviews', protect, postReview);
router.post('/', protect, isAdmin, createLocation);

module.exports = router;
