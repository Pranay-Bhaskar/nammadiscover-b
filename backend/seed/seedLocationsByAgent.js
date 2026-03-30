require('dotenv').config();
const mongoose = require('mongoose');
const Location = require('../models/Location');

const locations = [
    {
        name: { en: "CTR (Sri Sagar) Malleshwaram", kn: "ಸಿ.ಟಿ.ಆರ್ (ಶ್ರೀ ಸಾಗರ್) ಮಲ್ಲೇಶ್ವರಂ" },
        category: "food",
        description: { en: "Legendary butter sponge dose (Benne Dose) in the heart of Malleshwaram.", kn: "ಮಲ್ಲೇಶ್ವರಂನ ಹೃದಯಭಾಗದಲ್ಲಿರುವ ಅದ್ಭುತ ಬೆಣ್ಣೆ ಮಸಾಲೆ ದೋಸೆ ಕೇಂದ್ರ." },
        location: { type: "Point", coordinates: [77.5694, 12.9984] },
        city: "bengaluru",
        district: "Bengaluru Urban",
        tags: ["Dose", "Breakfast", "Heritage"],
        rating: 4.8,
        isVerified: true,
        images: ["https://images.unsplash.com/photo-1668231304245-4d577102e49e?auto=format&fit=crop&q=80&w=800"]
    },
    {
        name: { en: "Virupaksha Temple, Hampi", kn: "ವಿರೂಪಾಕ್ಷ ದೇವಸ್ಥಾನ, ಹಂಪಿ" },
        category: "heritage",
        description: { en: "Located in Hampi, this UNESCO World Heritage site is dedicated to Lord Shiva.", kn: "ಹಂಪಿಯಲ್ಲಿರುವ ಯುನೆಸ್ಕೋ ವಿಶ್ವ ಪರಂಪರೆಯ ತಾಣ ವಿರೂಪಾಕ್ಷ ದೇವಸ್ಥಾನ." },
        location: { type: "Point", coordinates: [76.4578, 15.3350] },
        city: "hampi",
        district: "Vijayanagara",
        tags: ["Temple", "UNESCO", "Architecture"],
        rating: 4.9,
        isVerified: true,
        images: ["https://images.unsplash.com/photo-1524222717473-73942004244d?auto=format&fit=crop&q=80&w=800"]
    },
    {
        name: { en: "Abbey Falls, Coorg", kn: "ಅಬ್ಬೆ ಜಲಪಾತ, ಕೊಡಗು" },
        category: "nature",
        description: { en: "A beautiful waterfall nestled within coffee and spice plantations.", kn: "ಕಾಫಿ ಮತ್ತು ಸಾಂಬಾರ ಪದಾರ್ಥಗಳ ತೋಟಗಳ ಮಧ್ಯೆ ನೆಲೆಸಿರುವ ಸುಂದರ ಜಲಪಾತ." },
        location: { type: "Point", coordinates: [75.7208, 12.4510] },
        city: "coorg",
        district: "Kodagu",
        tags: ["Waterfall", "Nature", "Photography"],
        rating: 4.6,
        isVerified: true,
        images: ["https://images.unsplash.com/photo-1590050730032-1f55f2694380?auto=format&fit=crop&q=80&w=800"]
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");
        await Location.deleteMany({});
        await Location.insertMany(locations);
        console.log("Database Seeded!");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
