const mongoose = require('mongoose');

const explorerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    city: { type: String, required: true },
    badge: { type: String, default: 'Explorer' },
    contributions: { type: Number, default: 0 },
    rating: { type: Number, default: 5.0 },
    avatar: { type: String, default: '🧑‍💼' },
    speciality: { type: String, default: 'General' }
}, { timestamps: true });

module.exports = mongoose.model('Explorer', explorerSchema);
