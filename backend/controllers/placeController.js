const mongoose = require('mongoose');
const Place = require('../models/Place');

/* ================= CREATE PLACE ================= */
// POST /api/places
const createPlace = async (req, res) => {
    try {
        const { name, category, tags, latitude, longitude, address, city, state } = req.body;

        if (!name || !name.en) {
            return res.status(400).json({ error: 'Place name (en) is required' });
        }

        if (!category) {
            return res.status(400).json({ error: 'Category is required' });
        }

        if (latitude === undefined || longitude === undefined) {
            return res.status(400).json({ error: 'Latitude and Longitude are required' });
        }

        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);

        if (Number.isNaN(lat) || Number.isNaN(lng)) {
            return res.status(400).json({ error: 'Invalid coordinates' });
        }

        /* 🔥 BASIC DUPLICATE CHECK (can be improved later) */
        const existing = await Place.findOne({
            "name.en": name.en.trim(),
            location: {
                $near: {
                    $geometry: { type: "Point", coordinates: [lng, lat] },
                    $maxDistance: 100 // within 100 meters
                }
            }
        });

        if (existing) {
            return res.status(409).json({
                error: 'Similar place already exists nearby',
                existing
            });
        }

        const place = new Place({
            name: {
                en: name.en.trim(),
                ...(name.kn && { kn: name.kn.trim() })
            },
            category,
            tags: tags ? tags.split(',').map(t => t.trim()) : [],
            location: {
                type: "Point",
                coordinates: [lng, lat]
            },
            address,
            city,
            state,
            created_by: req.user._id,
            status: 'pending'
        });

        await place.save();

        res.status(201).json({
            message: 'Place submitted for approval',
            place
        });

    } catch (err) {
        console.error('createPlace error:', err);
        res.status(500).json({ error: err.message });
    }
};


/* ================= GET ALL PLACES ================= */
// GET /api/places
const getPlaces = async (req, res) => {
    try {
        const { category, status, search } = req.query;

        const filter = {};

        if (category) filter.category = category;

        if (status && status !== 'all') {
            filter.status = status;
        } else {
            filter.status = 'approved';
        }

        if (search) {
            filter.$text = { $search: search };
        }

        const places = await Place.find(filter).sort({ createdAt: -1 });

        res.json(places);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


/* ================= GET NEARBY PLACES ================= */
// GET /api/places/nearby?lat=&lng=&radius=
const getNearbyPlaces = async (req, res) => {
    try {
        const { lat, lng, radius = 5000 } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({ error: 'lat and lng required' });
        }

        const places = await Place.find({
            status: 'approved',
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: parseInt(radius)
                }
            }
        });

        res.json(places);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


/* ================= GET PLACE BY ID ================= */
// GET /api/places/:id
const getPlaceById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }

        const place = await Place.findByIdAndUpdate(
            id,
            { $inc: { views: 1 } },
            { new: true }
        );

        if (!place) {
            return res.status(404).json({ error: 'Place not found' });
        }

        res.json(place);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


/* ================= UPDATE PLACE ================= */
// PUT /api/places/:id
const updatePlace = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }

        const updates = req.body;

        if (updates.latitude && updates.longitude) {
            updates.location = {
                type: "Point",
                coordinates: [
                    parseFloat(updates.longitude),
                    parseFloat(updates.latitude)
                ]
            };
        }

        const updated = await Place.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({ error: 'Place not found' });
        }

        res.json(updated);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


/* ================= DELETE PLACE ================= */
// DELETE /api/places/:id
const deletePlace = async (req, res) => {
    try {
        const { id } = req.params;

        const place = await Place.findByIdAndDelete(id);

        if (!place) {
            return res.status(404).json({ error: 'Place not found' });
        }

        res.json({ message: 'Place deleted' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


/* ================= ADMIN MODERATION ================= */
// PUT /api/places/:id/status
const updatePlaceStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, moderation_note } = req.body;

        const place = await Place.findByIdAndUpdate(
            id,
            {
                status,
                moderation_note,
                moderated_at: Date.now(),
                moderated_by: req.user._id
            },
            { new: true }
        );

        if (!place) {
            return res.status(404).json({ error: 'Place not found' });
        }

        res.json(place);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


module.exports = {
    createPlace,
    getPlaces,
    getNearbyPlaces,
    getPlaceById,
    updatePlace,
    deletePlace,
    updatePlaceStatus
};
