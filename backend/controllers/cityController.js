const City = require('../models/City');

// @desc    Get all cities
const getCities = async (req, res) => {
    try {
        const cities = await City.find();
        res.json(cities);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get city by slug
const getCityBySlug = async (req, res) => {
    try {
        const city = await City.findOne({ slug: req.params.slug });
        if (!city) return res.status(404).json({ message: 'City not found' });
        res.json(city);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getCities, getCityBySlug };
