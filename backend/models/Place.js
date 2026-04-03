const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    name: {
        en: { type: String, required: true, trim: true },
        kn: { type: String, trim: true }, // Kannada (optional)
    },

    description: {
        type: String,
        trim: true,
    },

    category: {
        type: String,
        required: true,
        enum: [
            'food',
            'nature',
            'historical',
            'temple',
            'adventure',
            'shopping',
            'local_picks',
            'other'
        ]
    },

    tags: [{ type: String, trim: true }],

    // 🌍 GEOJSON (CRITICAL — not like your video schema)
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number], // [lng, lat]
            required: true,
        }
    },

    // Optional human readable
    address: {
        type: String,
        trim: true,
    },

    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, default: 'India' },

    // Who created this place
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    // Moderation system (same as videos)
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },

    moderation_note: { type: String },
    moderated_at: { type: Date },
    moderated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

    // Metrics
    views: { type: Number, default: 0 },

}, { timestamps: true });

/* ================= INDEXES ================= */

// 🔥 Most important index (for map queries)
placeSchema.index({ location: '2dsphere' });

// Filters
placeSchema.index({ status: 1 });
placeSchema.index({ category: 1 });

// Search optimization
placeSchema.index({ "name.en": "text", tags: "text" });

// Duplicate prevention (approx)
placeSchema.index(
    { "name.en": 1, location: 1 },
    { unique: false } // don't make strict unique yet
);

module.exports = mongoose.model('Place', placeSchema);
