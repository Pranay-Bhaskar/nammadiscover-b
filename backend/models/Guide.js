const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  district: String,
  specialty: [String],
  tier: { type: String, enum: ['Bronze', 'Silver', 'Gold'], default: 'Bronze' },
  rating: { type: Number, default: 4.0, min: 1, max: 5 },
  contributions: { type: Number, default: 0 },
  bio: { type: String, default: '' },
  languages: [String],
  contact: {
    phone: String,
    email: String,
    whatsapp: String
  },
  avatar: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Guide', guideSchema);
