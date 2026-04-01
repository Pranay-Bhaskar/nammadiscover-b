/*
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
*/



// NEW 

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
        const { name, rating, comment, locationId } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'Name is required.' });
        }

        if (rating === undefined || Number.isNaN(Number(rating))) {
            return res.status(400).json({ message: 'Valid rating is required.' });
        }

        const numericRating = Number(rating);
        if (numericRating < 1 || numericRating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
        }

        const review = new Review({
            name: name.trim(),
            rating: numericRating,
            comment: comment ? comment.trim() : '',
            ...(locationId && { locationId }),
        });

        const saved = await review.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = { getReviews, submitReview };