const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc  Register user
// @route POST /api/auth/register
const register = async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        if (await User.findOne({ email })) {
            return res.status(400).json({ error: 'Email already registered' });
        }
        if (await User.findOne({ username })) {
            return res.status(400).json({ error: 'Username already taken' });
        }
        // Allow user, admin, or explorer role on public registration
        const safeRole = ['user', 'admin', 'explorer'].includes(role) ? role : 'user';
        const user = await User.create({ username, email, password, role: safeRole });
        res.status(201).json({
            _id: user._id, username: user.username, email: user.email,
            role: user.role, explorerStatus: user.explorerStatus,
            avatar: user.avatar, city: user.city, bio: user.bio,
            token: generateToken(user._id),
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc  Login user
// @route POST /api/auth/login
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id, username: user.username, email: user.email,
                role: user.role, explorerStatus: user.explorerStatus,
                avatar: user.avatar, city: user.city, bio: user.bio,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc  Get current user
// @route GET /api/auth/me
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc  Update profile
// @route PUT /api/auth/profile
const updateProfile = async (req, res) => {
    try {
        const { username, bio, city, avatar } = req.body;
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (username) user.username = username;
        if (bio !== undefined) user.bio = bio;
        if (city !== undefined) user.city = city;
        if (avatar !== undefined) user.avatar = avatar;

        await user.save();
        res.json({
            _id: user._id, username: user.username, email: user.email,
            role: user.role, explorerStatus: user.explorerStatus,
            avatar: user.avatar, city: user.city, bio: user.bio,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { register, login, getMe, updateProfile };
