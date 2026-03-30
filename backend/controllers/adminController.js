const User = require('../models/User');
const Video = require('../models/Video');
const Location = require('../models/Location');
const ExplorerApplication = require('../models/ExplorerApplication');

// @desc  Admin stats dashboard
// @route GET /api/admin/stats
const getStats = async (req, res) => {
    try {
        const [
            totalUsers, totalExplorers, totalAdmins,
            totalLocations, totalVideos, pendingVideos, approvedVideos,
            pendingApplications,
        ] = await Promise.all([
            User.countDocuments({ role: 'user' }),
            User.countDocuments({ role: 'explorer' }),
            User.countDocuments({ role: 'admin' }),
            Location.countDocuments({}),
            Video.countDocuments({}),
            Video.countDocuments({ status: 'pending' }),
            Video.countDocuments({ status: 'approved' }),
            ExplorerApplication.countDocuments({ status: 'pending' }),
        ]);

        const cities = await Location.distinct('city');

        // Total views across all videos
        const viewAgg = await Video.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]);
        const totalViews = viewAgg[0]?.total || 0;

        // Video breakdown by category
        const videoByCategory = await Video.aggregate([
            { $match: { status: 'approved' } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);

        // Recent users
        const recentUsers = await User.find({}).select('-password').sort({ createdAt: -1 }).limit(5);

        res.json({
            users: { total: totalUsers + totalExplorers + totalAdmins, explorers: totalExplorers, admins: totalAdmins },
            locations: { total: totalLocations, cities: cities.length },
            videos: { total: totalVideos, pending: pendingVideos, approved: approvedVideos },
            pendingApplications,
            totalViews,
            videoByCategory,
            recentUsers,
            cityList: cities,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc  Get all users (admin)
// @route GET /api/admin/users
const getUsers = async (req, res) => {
    try {
        const { search, role } = req.query;
        const filter = {};
        if (role) filter.role = role;
        if (search?.trim()) {
            const re = new RegExp(search.trim(), 'i');
            filter.$or = [{ username: re }, { email: re }];
        }
        const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc  Update user role (admin)
// @route PUT /api/admin/users/:id/role
const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!['user', 'explorer', 'admin'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }
        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getStats, getUsers, updateUserRole };
