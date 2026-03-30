const Review = require('../models/Review');

// @desc    Get all reviews
const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Submit a review
const submitReview = async (req, res) => {
    try {
        const review = new Review(req.body);
        const saved = await review.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = { getReviews, submitReview };
