const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    video: { type: String, default: 'forest' }, // reference to common video motifs
    overview: { type: String, default: '' },
    highlights: [String],
    bestTime: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('City', citySchema);
