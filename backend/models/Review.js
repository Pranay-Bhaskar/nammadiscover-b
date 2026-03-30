const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
    reviewerName: { type: String, required: true, trim: true },
    reviewerPhoto: { type: String, default: '' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
    photos: [String],
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
