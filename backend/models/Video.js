const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: { type: String, required: true },
    tags: [{ type: String, trim: true }],
    latitude: { type: Number },
    longitude: { type: Number },
    place_name: { type: String, trim: true },
    uploader_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    upload_time: { type: Date, default: Date.now },
    video_url: { type: String, required: true },
    thumbnail_url: { type: String },
    cloudinary_public_id: { type: String },
    duration: { type: Number },
    file_size: { type: Number },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
    moderation_note: { type: String },
    moderated_at: { type: Date },
    moderated_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    views: { type: Number, default: 0 },
}, { timestamps: true });

videoSchema.index({ uploader_id: 1 });
videoSchema.index({ status: 1 });
videoSchema.index({ category: 1 });
videoSchema.index({ latitude: 1, longitude: 1 });

module.exports = mongoose.model("Video", videoSchema);
