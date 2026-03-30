const express = require('express');
const router = express.Router();
const {
    uploadVideo,
    getVideos,
    getVideoById,
    updateVideo,
    deleteVideo,
    getMyVideos,
    updateVideoStatus,
    getExplorers,
} = require('../controllers/videoController');
const { protect, isAdmin } = require('../middleware/auth');
const { upload } = require('../utils/cloudinary');

// Upload a new video (multipart/form-data with field name "video")
router.post('/upload', protect, upload.single('video'), uploadVideo);

// Get all videos (filterable by ?uploader_id=&category=&status=&search=)
router.get('/', getVideos);

// Local explorers aggregation (public)
router.get('/explorers', getExplorers);

// My videos (current logged-in user)
router.get('/my', protect, getMyVideos);

// Single video (increments view count)
router.get('/:id', getVideoById);

// Update video metadata
router.put('/:id', protect, updateVideo);

// Delete video (DB + Cloudinary/local)
router.delete('/:id', protect, deleteVideo);

// Legacy status update (kept for admin panel compat)
router.put('/:id/status', protect, isAdmin, updateVideoStatus);

module.exports = router;

