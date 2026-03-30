const ExplorerApplication = require('../models/ExplorerApplication');
const User = require('../models/User');

// @desc  Submit explorer application
// @route POST /api/explorers/apply
const applyExplorer = async (req, res) => {
    try {
        const { reason, experience, city, portfolio, phone, specialties, locations, socialLinks } = req.body;
        if (!reason || !phone) return res.status(400).json({ error: 'Reason and Phone are required' });

        const existing = await ExplorerApplication.findOne({ user: req.user._id });
        if (existing) {
            if (existing.status === 'pending') return res.status(400).json({ error: 'Application already pending' });
            if (existing.status === 'approved') return res.status(400).json({ error: 'You are already an explorer' });
            
            // Allow re-apply if rejected
            existing.reason = reason;
            existing.experience = experience || '';
            existing.city = city || '';
            existing.portfolio = portfolio || '';
            existing.phone = phone;
            existing.specialties = specialties || [];
            existing.locations = locations || [];
            existing.socialLinks = socialLinks || {};
            existing.status = 'pending';
            existing.reviewed_by = undefined;
            existing.reviewed_at = undefined;
            existing.admin_note = '';
            await existing.save();
            await User.findByIdAndUpdate(req.user._id, { explorerStatus: 'pending' });
            return res.status(201).json({ message: 'Application resubmitted', application: existing });
        }

        const application = await ExplorerApplication.create({
            user: req.user._id, 
            reason, 
            experience, 
            city, 
            portfolio,
            phone,
            specialties: specialties || [],
            locations: locations || [],
            socialLinks: socialLinks || {}
        });
        await User.findByIdAndUpdate(req.user._id, { explorerStatus: 'pending' });
        res.status(201).json({ message: 'Application submitted', application });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc  Get my application status
// @route GET /api/explorers/my-application
const getMyApplication = async (req, res) => {
    try {
        const app = await ExplorerApplication.findOne({ user: req.user._id });
        res.json(app || null);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc  Get all applications (admin)
// @route GET /api/explorers/applications
const getApplications = async (req, res) => {
    try {
        const { status } = req.query;
        const filter = status ? { status } : {};
        const apps = await ExplorerApplication.find(filter)
            .populate('user', 'username email avatar city')
            .sort({ createdAt: -1 });
        res.json(apps);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc  Approve/reject explorer application (admin)
// @route PUT /api/explorers/:id/review
const reviewApplication = async (req, res) => {
    try {
        const { action, note } = req.body;
        if (!['approve', 'reject'].includes(action)) {
            return res.status(400).json({ error: 'action must be approve or reject' });
        }

        const app = await ExplorerApplication.findById(req.params.id).populate('user');
        if (!app) return res.status(404).json({ error: 'Application not found' });

        app.status = action === 'approve' ? 'approved' : 'rejected';
        app.reviewed_by = req.user._id;
        app.reviewed_at = new Date();
        app.admin_note = note || '';
        await app.save();

        // Update user role and explorerStatus
        const newRole = action === 'approve' ? 'explorer' : app.user.role;
        const newStatus = action === 'approve' ? 'approved' : 'rejected';
        await User.findByIdAndUpdate(app.user._id, { explorerStatus: newStatus, role: newRole });

        res.json({ message: `Application ${action}d`, application: app });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const Explorer = require('../models/Explorer');

// @desc  Get all approved explorers
// @route GET /api/explorers
const getExplorers = async (req, res) => {
    try {
        const explorers = await Explorer.find().sort({ contributions: -1 });
        res.json(explorers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { applyExplorer, getMyApplication, getApplications, reviewApplication, getExplorers };
