const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    name: {
        en: { type: String, required: true },
        kn: { type: String, default: '' }
    },
    category: {
        type: String,
        enum: ['Restaurant', 'Nature', 'Heritage', 'Shopping', 'Adventure', 'Homestay', 'Boutique Stay', 'Eco Stay', 'food', 'stay', 'shop', 'nature', 'temple', 'heritage', 'hidden_gem', 'photo_spot', 'local_pick'],
        required: true
    },
    category_icon: { type: String, default: '📍' },
    city: { type: String, required: true },
    citySlug: { type: String, required: true },
    description: {
        en: { type: String, default: '' },
        kn: { type: String, default: '' }
    },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true } // [longitude, latitude]
    },
    yearsInOperation: { type: Number, default: 0 },
    isFamilyRun: { type: Boolean, default: false },
    authenticityScore: { type: Number, default: 70, min: 0, max: 100 },
    verifiedLocal: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false }, // Sync with MapEngine
    images: [String],
    tags: [String],
    rating: { type: Number, default: 4.0, min: 0, max: 5 },
    budget: { type: Number, default: 0 },
    stayType: { type: String, default: null },
    // Extended fields from MapEngine
    culturalStory: {
        en: { type: String, default: '' },
        kn: { type: String, default: '' }
    },
    travelTips: {
        en: { type: String, default: '' },
        kn: { type: String, default: '' }
    },
    address: { type: String, default: '' },
    openingHours: { type: String, default: '' },
    bestTimeToVisit: { type: String, default: '' },
    contactInfo: { type: String, default: '' },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    localGuides: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Guide' }]
}, { timestamps: true });

locationSchema.index({ location: '2dsphere' });
locationSchema.index({ citySlug: 1, category: 1 });
locationSchema.index({ 'name.en': 'text', 'name.kn': 'text', tags: 'text' });

module.exports = mongoose.model('Location', locationSchema);
