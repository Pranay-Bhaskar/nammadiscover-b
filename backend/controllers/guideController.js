const Guide = require('../models/Guide');

const getGuides = async (req, res) => {
    try {
        const { city } = req.query;
        const filter = city ? { city } : {};
        const guides = await Guide.find(filter).sort({ createdAt: -1 });
        res.json(guides);
    } catch (err) {
        console.error('getGuides error:', err);
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getGuides };