const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({

    name: {
        en: { type: String, required: true, trim: true },
        kn: { type: String, trim: true }
    },

    description: {
        en: { type: String, trim: true },
        kn: { type: String, trim: true }
    },

    culturalStory: {
        en: { type: String },
        kn: { type: String }
    },

    travelTips: {
        en: { type: String },
        kn: { type: String }
    },

    category: { type: String, required: true },
    subcategory: { type: String },

    city: { type: String },
    district: { type: String },

    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number], // [lng, lat]
            required: true
        }
    },

    address: { type: String },

    tags: [{ type: String }],
    images: [{ type: String }],

    rating: { type: Number, default: 0 },
    authenticityScore: { type: Number, default: 0 },

    openingHours: { type: String },
    bestTimeToVisit: { type: String },
    entryFee: { type: String },

    isVerified: { type: Boolean, default: false },

    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    }

}, { timestamps: true });

placeSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Place", placeSchema);
