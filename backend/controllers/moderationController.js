const Video = require('../models/Video');

/**
 * GET /api/moderate/queue
 * Return all videos with status = pending
 */
const getModerationQueue = async (req, res) => {
    try {
        const videos = await Video.find({ status: 'pending' })
            .populate('uploader_id', 'username email')
            .sort({ upload_time: 1 });
        res.json(videos);
    } catch (err) {
        console.error('getModerationQueue error:', err);
        res.status(500).json({ error: err.message });
    }
};

/**
 * POST /api/moderate/:id
 * Approve or reject a video
 * Body: { action: 'approve' | 'reject', note: string }
 */
const moderateVideo = async (req, res) => {
    try {
        const { action, note } = req.body;

        if (!['approve', 'reject'].includes(action)) {
            return res.status(400).json({ error: 'action must be "approve" or "reject".' });
        }

        const video = await Video.findByIdAndUpdate(
            req.params.id,
            {
                status: action === 'approve' ? 'approved' : 'rejected',
                moderation_note: note || '',
                moderated_at: new Date(),
                moderated_by: req.user._id,
            },
            { new: true }
        );

        if (!video) return res.status(404).json({ error: 'Video not found.' });

        res.json({ message: `Video ${action}d successfully.`, video });
    } catch (err) {
        console.error('moderateVideo error:', err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getModerationQueue, moderateVideo };
