const mongoose = require('mongoose');

const explorerApplicationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    reason: { type: String, required: true },
    experience: { type: String, default: '' },
    city: { type: String, default: '' },
    portfolio: { type: String, default: '' },
    phone: { type: String, required: true },
    specialties: { type: [String], default: [] },
    locations: { type: [String], default: [] },
    socialLinks: {
        instagram: String,
        twitter: String,
        website: String
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    reviewed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewed_at: { type: Date },
    admin_note: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('ExplorerApplication', explorerApplicationSchema);
