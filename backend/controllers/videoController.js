/*
const Video = require('../models/Video');
const { getThumbnailUrl, deleteFromCloudinary, isCloudinary, toLocalUrl } = require('../utils/cloudinary');

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/videos/upload
// ─────────────────────────────────────────────────────────────────────────────
const uploadVideo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No video file provided. Make sure the field name is "video".' });
        }

        const { title, description, category, tags, latitude, longitude, place_name } = req.body;

        if (!title || !title.trim())    return res.status(400).json({ error: 'Title is required.' });
        if (!category)                  return res.status(400).json({ error: 'Category is required.' });

        let video_url, thumbnail_url, cloudinary_public_id;

        if (isCloudinary()) {
            video_url            = req.file.path;
            cloudinary_public_id = req.file.filename;
            thumbnail_url        = getThumbnailUrl(cloudinary_public_id);
        } else {
            video_url            = toLocalUrl(req, req.file.filename);
            cloudinary_public_id = req.file.path;
            thumbnail_url        = null;
        }

        const video = new Video({
            title:       title.trim(),
            description: description ? description.trim() : '',
            category,
            tags:        tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
            latitude:    latitude  ? parseFloat(latitude)  : undefined,
            longitude:   longitude ? parseFloat(longitude) : undefined,
            place_name:  place_name || '',
            uploader_id: req.user._id,
            video_url,
            thumbnail_url,
            cloudinary_public_id,
            status: 'pending',
        });

        await video.save();
        console.log(`✅ Video saved: "${video.title}" | storage: ${isCloudinary() ? 'Cloudinary' : 'local'}`);
        res.status(201).json({ message: 'Video uploaded successfully!', video });

    } catch (err) {
        console.error('uploadVideo error:', err);
        if (err.name === 'ValidationError') {
            const msg = Object.values(err.errors).map((e) => e.message).join(', ');
            return res.status(400).json({ error: msg });
        }
        res.status(500).json({ error: err.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/videos
// ?status=approved|pending|rejected|all  &category=  &uploader_id=  &search=
// ─────────────────────────────────────────────────────────────────────────────
const getVideos = async (req, res) => {
    try {
        const { uploader_id, category, status, search } = req.query;
        const filter = {};

        if (uploader_id) filter.uploader_id = uploader_id;
        if (category)    filter.category    = category;

        if (status && status !== 'all') {
            filter.status = status;
        } else if (!status) {
            filter.status = 'approved';
        }

        if (search && search.trim()) {
            const re = new RegExp(search.trim(), 'i');
            filter.$or = [{ title: re }, { place_name: re }, { tags: re }];
        }

        const videos = await Video.find(filter).sort({ upload_time: -1 });
        res.json(videos);
    } catch (err) {
        console.error('getVideos error:', err);
        res.status(500).json({ error: err.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/videos/:id  — single video + increment view count
// ─────────────────────────────────────────────────────────────────────────────
const getVideoById = async (req, res) => {
    try {
        const video = await Video.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
            { new: true }
        );
        if (!video) return res.status(404).json({ error: 'Video not found.' });
        res.json(video);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/videos/:id  — update metadata
// ─────────────────────────────────────────────────────────────────────────────
const updateVideo = async (req, res) => {
    try {
        const { title, description, category, tags, latitude, longitude, place_name } = req.body;

        const updated = await Video.findByIdAndUpdate(
            req.params.id,
            {
                ...(title       && { title: title.trim() }),
                ...(description !== undefined && { description }),
                ...(category    && { category }),
                ...(tags        !== undefined && { tags: tags.split(',').map((t) => t.trim()).filter(Boolean) }),
                ...(latitude    !== undefined && { latitude: parseFloat(latitude) }),
                ...(longitude   !== undefined && { longitude: parseFloat(longitude) }),
                ...(place_name  !== undefined && { place_name }),
            },
            { new: true, runValidators: true }
        );

        if (!updated) return res.status(404).json({ error: 'Video not found.' });
        res.json({ message: 'Video updated.', video: updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/videos/:id  — remove from DB + storage
// ─────────────────────────────────────────────────────────────────────────────
const deleteVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ error: 'Video not found.' });

        if (video.cloudinary_public_id) {
            await deleteFromCloudinary(video.cloudinary_public_id);
        }

        await video.deleteOne();
        res.json({ message: 'Video deleted.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Kept for backwards compatibility with any existing admin route
const updateVideoStatus = async (req, res) => {
    try {
        const { status, moderation_note } = req.body;
        const video = await Video.findByIdAndUpdate(
            req.params.id,
            { status, moderation_note, moderated_at: Date.now(), moderated_by: req.user._id },
            { new: true }
        );
        if (!video) return res.status(404).json({ error: 'Video not found' });
        res.json(video);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getMyVideos = async (req, res) => {
    try {
        const videos = await Video.find({ uploader_id: req.user._id }).sort({ upload_time: -1 });
        res.json(videos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/videos/explorers — local explorers who uploaded approved videos
// ─────────────────────────────────────────────────────────────────────────────
const getExplorers = async (req, res) => {
    try {
        const explorers = await Video.aggregate([
            { $match: { status: 'approved' } },
            { $group: { _id: '$uploader_id', videoCount: { $sum: 1 } } },
            { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
            { $unwind: '$user' },
            { $project: {
                _id: '$user._id',
                username: '$user.username',
                avatar: '$user.avatar',
                videoCount: 1,
            }},
            { $sort: { videoCount: -1 } },
        ]);
        res.json(explorers);
    } catch (err) {
        console.error('getExplorers error:', err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = { uploadVideo, getVideos, getVideoById, updateVideo, deleteVideo, getMyVideos, updateVideoStatus, getExplorers };

*/





//NEW

const mongoose = require('mongoose');
const Video = require('../models/Video');
const {
    getThumbnailUrl,
    deleteFromCloudinary,
    isCloudinary,
    toLocalUrl
} = require('../utils/cloudinary');

// POST /api/videos/upload
const uploadVideo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                error: 'No video file provided. Make sure the field name is "video".'
            });
        }

        const { title, description, category, tags, latitude, longitude, place_name } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({ error: 'Title is required.' });
        }

        if (!category || !category.trim()) {
            return res.status(400).json({ error: 'Category is required.' });
        }

        let video_url, thumbnail_url, cloudinary_public_id;

        if (isCloudinary()) {
            video_url = req.file.path;
            cloudinary_public_id = req.file.filename;
            thumbnail_url = getThumbnailUrl(cloudinary_public_id);
        } else {
            video_url = toLocalUrl(req, req.file.filename);
            cloudinary_public_id = req.file.path;
            thumbnail_url = null;
        }

        const parsedLatitude =
            latitude !== undefined && latitude !== '' ? parseFloat(latitude) : undefined;
        const parsedLongitude =
            longitude !== undefined && longitude !== '' ? parseFloat(longitude) : undefined;

        if (latitude !== undefined && latitude !== '' && Number.isNaN(parsedLatitude)) {
            return res.status(400).json({ error: 'Latitude must be a valid number.' });
        }

        if (longitude !== undefined && longitude !== '' && Number.isNaN(parsedLongitude)) {
            return res.status(400).json({ error: 'Longitude must be a valid number.' });
        }

        const video = new Video({
            title: title.trim(),
            description: description ? description.trim() : '',
            category: category.trim(),
            tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
            latitude: parsedLatitude,
            longitude: parsedLongitude,
            place_name: place_name ? place_name.trim() : '',
            uploader_id: req.user._id,
            video_url,
            thumbnail_url,
            cloudinary_public_id,
            status: 'pending',
        });

        await video.save();

        console.log(`✅ Video saved: "${video.title}" | storage: ${isCloudinary() ? 'Cloudinary' : 'local'}`);
        res.status(201).json({ message: 'Video uploaded successfully!', video });

    } catch (err) {
        console.error('uploadVideo error:', err);

        if (err.name === 'ValidationError') {
            const msg = Object.values(err.errors).map(e => e.message).join(', ');
            return res.status(400).json({ error: msg });
        }

        res.status(500).json({ error: err.message });
    }
};

// GET /api/videos
const getVideos = async (req, res) => {
    try {
        const { uploader_id, category, status, search } = req.query;
        const filter = {};

        if (uploader_id) filter.uploader_id = uploader_id;
        if (category) filter.category = category;

        if (status && status !== 'all') {
            filter.status = status;
        } else if (!status) {
            filter.status = 'approved';
        }


        if (search && search.trim()) {
            const normalized = search.trim().toLowerCase();

            filter.$or = [
                { title: { $regex: normalized, $options: 'i' } },
                { place_name: { $regex: `^${normalized}$`, $options: 'i' } }, // ✅ EXACT MATCH IGNORING CASE
                { tags: { $regex: normalized, $options: 'i' } }
            ];
        }
/*
        if (search && search.trim()) {
            const re = new RegExp(search.trim(), 'i');
            filter.$or = [
                { title: re },
                { place_name: re },
                { tags: re }
            ];
        }
*/
        const videos = await Video.find(filter).sort({ upload_time: -1 });
        res.json(videos);
    } catch (err) {
        console.error('getVideos error:', err);
        res.status(500).json({ error: err.message });
    }
};

// GET /api/videos/:id
const getVideoById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid video ID.' });
        }

        const video = await Video.findByIdAndUpdate(
            id,
            { $inc: { views: 1 } },
            { new: true }
        );

        if (!video) {
            return res.status(404).json({ error: 'Video not found.' });
        }

        res.json(video);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// PUT /api/videos/:id
const updateVideo = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid video ID.' });
        }

        const { title, description, category, tags, latitude, longitude, place_name } = req.body;

        const updateData = {
            ...(title && { title: title.trim() }),
            ...(description !== undefined && { description: description.trim() }),
            ...(category && { category: category.trim() }),
            ...(tags !== undefined && {
                tags: typeof tags === 'string'
                    ? tags.split(',').map(t => t.trim()).filter(Boolean)
                    : Array.isArray(tags)
                        ? tags.map(t => String(t).trim()).filter(Boolean)
                        : []
            }),
            ...(place_name !== undefined && { place_name: place_name.trim() }),
        };

        if (latitude !== undefined) {
            const parsedLatitude = parseFloat(latitude);
            if (Number.isNaN(parsedLatitude)) {
                return res.status(400).json({ error: 'Latitude must be a valid number.' });
            }
            updateData.latitude = parsedLatitude;
        }

        if (longitude !== undefined) {
            const parsedLongitude = parseFloat(longitude);
            if (Number.isNaN(parsedLongitude)) {
                return res.status(400).json({ error: 'Longitude must be a valid number.' });
            }
            updateData.longitude = parsedLongitude;
        }

        const updated = await Video.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({ error: 'Video not found.' });
        }

        res.json({ message: 'Video updated.', video: updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE /api/videos/:id
const deleteVideo = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid video ID.' });
        }

        const video = await Video.findById(id);
        if (!video) {
            return res.status(404).json({ error: 'Video not found.' });
        }

        if (video.cloudinary_public_id) {
            await deleteFromCloudinary(video.cloudinary_public_id);
        }

        await video.deleteOne();
        res.json({ message: 'Video deleted.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Backwards compatibility
const updateVideoStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, moderation_note } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid video ID.' });
        }

        const video = await Video.findByIdAndUpdate(
            id,
            {
                status,
                moderation_note,
                moderated_at: Date.now(),
                moderated_by: req.user._id
            },
            { new: true, runValidators: true }
        );

        if (!video) {
            return res.status(404).json({ error: 'Video not found.' });
        }

        res.json(video);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getMyVideos = async (req, res) => {
    try {
        const videos = await Video.find({ uploader_id: req.user._id }).sort({ upload_time: -1 });
        res.json(videos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /api/videos/explorers
const getExplorers = async (req, res) => {
    try {
        const explorers = await Video.aggregate([
            { $match: { status: 'approved' } },
            { $group: { _id: '$uploader_id', videoCount: { $sum: 1 } } },
            { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
            { $unwind: '$user' },
            {
                $project: {
                    _id: '$user._id',
                    username: '$user.username',
                    avatar: '$user.avatar',
                    videoCount: 1,
                }
            },
            { $sort: { videoCount: -1 } },
        ]);

        res.json(explorers);
    } catch (err) {
        console.error('getExplorers error:', err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    uploadVideo,
    getVideos,
    getVideoById,
    updateVideo,
    deleteVideo,
    getMyVideos,
    updateVideoStatus,
    getExplorers
};
