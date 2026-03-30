const Location = require('../models/Location');
const Review = require('../models/Review');

const shapeLocation = (loc, lang = 'en') => {
    const other = lang === 'en' ? 'kn' : 'en';
    return {
        ...loc,
        displayName: (loc.name && (loc.name[lang] || loc.name[other])) || loc.name,
        displayDescription: (loc.description && (loc.description[lang] || loc.description[other])) || loc.description,
        displayCulturalStory: (loc.culturalStory && (loc.culturalStory[lang] || loc.culturalStory[other])) || '',
        displayTravelTips: (loc.travelTips && (loc.travelTips[lang] || loc.travelTips[other])) || ''
    };
};

const getDistanceMeters = (lat1, lon1, lat2, lon2) => {
    const R = 6371000;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

// GET /api/locations
exports.getLocations = async (req, res) => {
    try {
        const { north, south, east, west, category, citySlug, search, lang = 'en' } = req.query;
        let query = {};

        // Bounding box filter (MapEngine style)
        if (north && south && east && west) {
            query.location = {
                $geoWithin: {
                    $box: [
                        [parseFloat(west), parseFloat(south)],
                        [parseFloat(east), parseFloat(north)]
                    ]
                }
            };
        }

        if (category && category !== 'all') {
            const cats = category.split(',').map(c => c.trim().toLowerCase());
            // Create a broader list including capitalized versions for legacy data
            const expandedCats = [...cats];
            cats.forEach(c => {
                if (c === 'food') expandedCats.push('Restaurant', 'Street Food', 'Cafe');
                if (c === 'nature') expandedCats.push('Nature', 'Park', 'Waterfall');
                if (c === 'heritage') expandedCats.push('Heritage', 'Fort', 'Palace');
                if (c === 'shop') expandedCats.push('Shopping', 'Bazaar', 'Mall');
                if (c === 'temple') expandedCats.push('Temple', 'Religious Site');
                const capitalized = c.charAt(0).toUpperCase() + c.slice(1);
                if (!expandedCats.includes(capitalized)) expandedCats.push(capitalized);
            });
            query.category = { $in: expandedCats };
        }

        if (citySlug && citySlug !== 'all') {
            query.citySlug = citySlug;
        }

        if (search) {
            query.$text = { $search: search };
        }

        // Support for radius search (Original NammaDiscover feature)
        const { lat, lng, radius } = req.query;
        if (lat && lng && radius && !query.location) {
            query.location = {
                $nearSphere: {
                    $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
                    $maxDistance: parseFloat(radius) * 1000
                }
            };
        }

        const locations = await Location.find(query)
            .select('-reviews -localGuides -__v')
            .limit(200)
            .lean();

        res.json(locations.map(loc => shapeLocation(loc, lang)));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/locations/search (MapEngine style)
exports.searchLocations = async (req, res) => {
    try {
        const { q, lang = 'en' } = req.query;
        if (!q) return res.json([]);

        const locations = await Location.find({
            $or: [
                { 'name.en': { $regex: new RegExp(q, 'i') } },
                { 'name.kn': { $regex: new RegExp(q, 'i') } },
                { tags: { $regex: new RegExp(q, 'i') } },
                { city: { $regex: new RegExp(q, 'i') } }
            ]
        })
            .select('name category city location tags rating isVerified lat lng citySlug')
            .limit(20)
            .lean();

        res.json(locations.map(loc => shapeLocation(loc, lang)));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getLocationById = async (req, res) => {
    try {
        const { lang = 'en' } = req.query;
        const location = await Location.findById(req.params.id)
            .populate('reviews')
            .lean();
        if (!location) return res.status(404).json({ message: 'Location not found' });
        res.json(shapeLocation(location, lang));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getNearby = async (req, res) => {
    try {
        const { radius = 10000, lang = 'en', category } = req.query;
        const location = await Location.findById(req.params.id).lean();

        if (!location) return res.status(404).json({ message: 'Location not found' });

        const query = {
            _id: { $ne: location._id },
            location: {
                $nearSphere: {
                    $geometry: location.location,
                    $maxDistance: parseInt(radius)
                }
            }
        };

        if (category) {
            const cats = category.split(',');
            query.category = { $in: cats };
        }

        const nearby = await Location.find(query).limit(20).lean();

        const withDistance = nearby.map(loc => {
            const shaped = shapeLocation(loc, lang);
            shaped.distance = getDistanceMeters(
                location.lat, location.lng,
                loc.lat, loc.lng
            );
            return shaped;
        });

        res.json(withDistance);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getReviewsByLocation = async (req, res) => {
    try {
        const reviews = await Review.find({ location: req.params.id, status: 'approved' }).sort('-createdAt').lean();
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.postReview = async (req, res) => {
    try {
        const { reviewerName, rating, comment, photos } = req.body;
        const review = await Review.create({
            location: req.params.id,
            reviewerName,
            rating: parseFloat(rating),
            comment,
            photos: photos || []
        });

        const location = await Location.findById(req.params.id);
        if (location) {
            location.reviews.push(review._id);
            const allReviews = await Review.find({ location: req.params.id });
            const avg = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
            location.rating = Math.round(avg * 10) / 10;
            await location.save();
        }

        res.status(201).json(review);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc  Create a new location (Admin)
// @route POST /api/locations
exports.createLocation = async (req, res) => {
    try {
        const { name, category, city, lat, lng, description, images, tags, budget, yearsInOperation, isFamilyRun, authenticityScore, verifiedLocal, address, openingHours, bestTimeToVisit, contactInfo } = req.body;

        // Ensure name and description are objects for bilingual support
        const formattedName = typeof name === 'string' ? { en: name, kn: '' } : name;
        const formattedDesc = typeof description === 'string' ? { en: description, kn: '' } : description;

        const location = new Location({
            name: formattedName,
            category,
            city,
            citySlug: city ? city.toLowerCase().replace(/ /g, '-') : 'general',
            lat: parseFloat(lat),
            lng: parseFloat(lng),
            location: {
                type: 'Point',
                coordinates: [parseFloat(lng), parseFloat(lat)]
            },
            description: formattedDesc,
            images: images || [],
            tags: tags || [],
            budget: budget || 0,
            yearsInOperation: yearsInOperation || 0,
            isFamilyRun: !!isFamilyRun,
            authenticityScore: authenticityScore || 80,
            verifiedLocal: !!verifiedLocal,
            isVerified: true,
            address: address || '',
            openingHours: openingHours || '',
            bestTimeToVisit: bestTimeToVisit || '',
            contactInfo: contactInfo || ''
        });

        const saved = await location.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
