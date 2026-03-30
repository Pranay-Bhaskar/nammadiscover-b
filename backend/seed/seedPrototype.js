const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load models
const Location = require('../models/Location');
const Review = require('../models/Review');
const City = require('../models/City');
const Explorer = require('../models/Explorer');

dotenv.config({ path: path.join(__dirname, '../.env') });

const CITIES = [
  { slug: 'bengaluru', name: 'Bengaluru', lat: 12.9716, lng: 77.5946, video: 'forest', overview: 'Silicon Valley of India, rich in culture, food and innovation.', highlights: ['🏛️ Cubbon Park', '🍛 CTR Dosa', '🛍️ Commercial Street', '🌿 Lalbagh'], bestTime: 'Oct–Feb' },
  { slug: 'mysuru', name: 'Mysuru', lat: 12.2958, lng: 76.6394, video: 'palace', overview: 'The City of Palaces — royal grandeur meets lived-in charm.', highlights: ['🏰 Mysore Palace', '🧵 Silk Market', '🌸 Chamundi Hill', '🎭 Dasara Festival'], bestTime: 'Sep–Mar' },
  { slug: 'hampi', name: 'Hampi', lat: 15.3350, lng: 76.4600, video: 'ruins', overview: 'Ancient Vijayanagara capital, UNESCO World Heritage Site.', highlights: ['🛕 Virupaksha Temple', '🧗 River Bouldering', '🪨 Stone Chariot', '🌅 Matanga Hill'], bestTime: 'Nov–Feb' },
  { slug: 'coorg', name: 'Coorg', lat: 12.4244, lng: 75.7382, video: 'forest', overview: 'Scotland of India — misty hills, coffee estates and Kodava culture.', highlights: ['☕ Coffee Estates', '💧 Abbey Falls', '🐘 Nagarhole', '🏡 Kodava Heritage'], bestTime: 'Oct–Apr' },
  { slug: 'udupi', name: 'Udupi', lat: 13.3409, lng: 74.7421, video: 'beach', overview: 'Temple town famous for authentic Udupi cuisine and pristine beaches.', highlights: ['🛕 Krishna Temple', '🏖️ Kapu Beach', '🍛 Udupi Thali', '🌊 Malpe Beach'], bestTime: 'Nov–Mar' }
];

const LISTINGS = [
  { name: 'CTR (Shivaji Military Hotel)', category: 'Restaurant', city: 'Bengaluru', citySlug: 'bengaluru', description: 'Family-run since 1924, famous for the best benne masala dosa in Bengaluru. Generations of Malleshwaram families breakfast here.', yearsInOperation: 100, isFamilyRun: true, lat: 13.0005, lng: 77.5678, authenticityScore: 96, verifiedLocal: true, images: ['https://b.zmtcdn.com/data/pictures/0/21707610/8db379697e031389b88936ab10d81efe.jpg?fit=around|960:500&crop=960:500;*,*'], tags: ['Dosa', 'Heritage', 'Breakfast'], rating: 4.9, stayType: null, category_icon: '🍽️', budget: 200 },
  { name: 'Hessarghatta Lake', category: 'Nature', city: 'Bengaluru', citySlug: 'bengaluru', description: 'A hidden gem reservoir offering birdwatching, cycling tracks and boat rides — largely unknown to outsiders.', yearsInOperation: 80, isFamilyRun: false, lat: 13.1391, lng: 77.4680, authenticityScore: 84, verifiedLocal: true, images: ['https://content.jdmagicbox.com/v2/comp/bangalore/y5/080pxx80.xx80.141226121415.y2y5/catalogue/hessaraghatta-lake-hessargatta-lake-bangalore-tourist-attraction-p8k3bmwqk1.jpg'], tags: ['Lake', 'Birds', 'Cycling'], rating: 4.5, stayType: null, category_icon: '🌿', budget: 100 },
  { name: 'Lalbagh Botanical Garden', category: 'Nature', city: 'Bengaluru', citySlug: 'bengaluru', description: '240 acres of botanical wonder with century-old glass house and irreplaceable tree lineages from around the world.', yearsInOperation: 250, isFamilyRun: false, lat: 12.9507, lng: 77.5848, authenticityScore: 92, verifiedLocal: false, images: ['https://www.en-vols.com/wp-content/uploads/afmm/2025/12/jardin-botanique-lalbagh-inde-glass-house.jpg'], tags: ['Botanical', 'History', 'Nature'], rating: 4.7, stayType: null, category_icon: '🌿', budget: 50 },
  { name: 'Mysore Palace Night View', category: 'Heritage', city: 'Mysuru', citySlug: 'mysuru', description: 'On Sundays, 97,000 bulbs illuminate this palace. A spectacle that feels impossible to believe until you see it.', yearsInOperation: 100, isFamilyRun: false, lat: 12.3052, lng: 76.6552, authenticityScore: 99, verifiedLocal: true, images: ['https://upload.wikimedia.org/wikipedia/commons/6/6e/Mysore_Palace_in_night.jpg'], tags: ['Palace', 'Lights', 'Heritage'], rating: 5.0, stayType: null, category_icon: '🏛️', budget: 50 },
  { name: 'Vinayaka Mylari', category: 'Restaurant', city: 'Mysuru', citySlug: 'mysuru', description: 'Iconic 80-year-old hotel serving the legendary Mysuru-style dose — thin, crispy, ghee-drenched. Locals queue at 7am sharp.', yearsInOperation: 80, isFamilyRun: true, lat: 12.3021, lng: 76.6489, authenticityScore: 97, verifiedLocal: true, images: ['https://im.whatshot.in/img/2020/Aug/hotel-original-vinayaka-mylari-1596699053.jpg'], tags: ['Dosa', 'Heritage', 'Breakfast'], rating: 4.9, stayType: null, category_icon: '🍽️', budget: 150 },
  { name: 'Sri Lakshmi Silk Store', category: 'Shopping', city: 'Mysuru', citySlug: 'mysuru', description: 'A four-generation silk-weaving family still using traditional power looms. Buy Mysore silk straight from the weavers.', yearsInOperation: 65, isFamilyRun: true, lat: 12.3071, lng: 76.6445, authenticityScore: 91, verifiedLocal: true, images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRudJwvUvwqbEachCbQYWW7pl-v626ijEnwjg&s'], tags: ['Silk', 'Crafts', 'Weaving'], rating: 4.8, stayType: null, category_icon: '🧵', budget: 500 },
  { name: 'Virupaksha Temple', category: 'Heritage', city: 'Hampi', citySlug: 'hampi', description: 'An active 7th-century temple, the focal point of the Hampi ruins. A living, breathing pilgrimage site amidst stone ruins.', yearsInOperation: 1300, isFamilyRun: false, lat: 15.3350, lng: 76.4597, authenticityScore: 100, verifiedLocal: true, images: ['https://www.vikipandit.com/wp-content/uploads/Virupaksha-Temple-1.jpg'], tags: ['Temple', 'Ruins', 'UNESCO'], rating: 4.9, stayType: null, category_icon: '🏛️', budget: 30 },
  { name: 'Hampi Riverside Bouldering', category: 'Adventure', city: 'Hampi', citySlug: 'hampi', description: 'Hampi is one of the world\'s top bouldering destinations. Granite boulders, blue sky, and ancient ruins — a surreal setting.', yearsInOperation: 20, isFamilyRun: false, lat: 15.3300, lng: 76.4650, authenticityScore: 88, verifiedLocal: true, images: ['https://www.xtremespots.com/wp-content/uploads/2013/10/Bouldering-in-Hampi-Rocks.jpg'], tags: ['Bouldering', 'Sports', 'Outdoors'], rating: 4.7, stayType: null, category_icon: '🧗', budget: 300 },
  { name: 'Coorg Coffee Estate Homestay', category: 'Homestay', city: 'Coorg', citySlug: 'coorg', description: 'Wake up to misty hills and pluck coffee berries. A Kodava family welcomes you into their ancestral estate.', yearsInOperation: 30, isFamilyRun: true, lat: 12.4244, lng: 75.7382, authenticityScore: 95, verifiedLocal: true, images: ['https://q-xx.bstatic.com/xdata/images/hotel/max500/388365863.jpg?k=e5fc5d929ea6134d3c805da9c3b15acd4db11506f891ccf78daff0b7f3fb47fb&o='], tags: ['Coffee', 'Mist', 'Homestay'], rating: 4.9, stayType: 'Homestay', category_icon: '🏡', budget: 4500 },
  { name: 'Abbey Falls', category: 'Nature', city: 'Coorg', citySlug: 'coorg', description: 'A cascading 70ft waterfall hidden within a private coffee plantation. The walk through the estate is half the magic.', yearsInOperation: 0, isFamilyRun: false, lat: 12.4304, lng: 75.7348, authenticityScore: 82, verifiedLocal: false, images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4UlCSIVfnPVFITNdwyDJC_Kys6y3exy0n8w&s'], tags: ['Waterfall', 'Trekking', 'Nature'], rating: 4.6, stayType: null, category_icon: '💧', budget: 100 },
  { name: 'Iruppu Falls (Hidden Gem)', category: 'Nature', city: 'Coorg', citySlug: 'coorg', description: 'Sacred waterfall mentioned in the Ramayana. Locals take a ritual dip on Shivaratri. Rarely visited by tourists.', yearsInOperation: 0, isFamilyRun: false, lat: 12.1102, lng: 75.8634, authenticityScore: 90, verifiedLocal: true, images: ['https://assets.simplotel.com/simplotel/image/upload/x_0,y_334,w_2160,h_720,r_0,c_crop,q_85,fl_progressive/w_2160,f_auto,c_fit/machaan-wilderness-lodge-nagarahole/Iruppu_hohsib'], tags: ['Waterfall', 'Sacred', 'Hidden'], rating: 4.8, stayType: null, category_icon: '💧', budget: 50 },
  { name: 'Udupi Sri Krishna Temple', category: 'Heritage', city: 'Udupi', citySlug: 'udupi', description: 'The 13th-century temple that gave the world Udupi-style vegetarian cuisine. Pilgrims view the deity through a holed window.', yearsInOperation: 750, isFamilyRun: false, lat: 13.3409, lng: 74.7421, authenticityScore: 99, verifiedLocal: true, images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDOvZhHxTtUXxTAHLdPrVH7GuXh0xJUz9mtA&s'], tags: ['Temple', 'Pilgrimage', 'Heritage'], rating: 4.9, stayType: null, category_icon: '🛕', budget: 0 },
  { name: "Diana's Beach (Kapu)", category: 'Nature', city: 'Udupi', citySlug: 'udupi', description: 'A pristine, uncrowded beach with a 19th-century lighthouse. Skip Goa and come here — locals say it\'s far more beautiful.', yearsInOperation: 0, isFamilyRun: false, lat: 13.2889, lng: 74.7260, authenticityScore: 86, verifiedLocal: true, images: ['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/05/57/9b/08/kaup-beach.jpg?w=600&h=-1&s=1'], tags: ['Beach', 'Lighthouse', 'Hidden'], rating: 4.7, stayType: null, category_icon: '🏖️', budget: 0 },
  { name: 'Hotel Woodlands (Udupi)', category: 'Restaurant', city: 'Udupi', citySlug: 'udupi', description: 'The original Udupi restaurant chain since 1938. Sambar, rasam, and banana-leaf meals that have never changed recipe.', yearsInOperation: 86, isFamilyRun: true, lat: 13.3445, lng: 74.7402, authenticityScore: 94, verifiedLocal: true, images: ['https://img.restaurantguru.com/ra5e-Udupi-woodlands-Restaurant-exterior.jpg'], tags: ['Meals', 'Banana Leaf', 'Heritage'], rating: 4.8, stayType: null, category_icon: '🍽️', budget: 200 },
  { name: 'Evolve Back Coorg (Boutique)', category: 'Boutique Stay', city: 'Coorg', citySlug: 'coorg', description: 'A luxury boutique eco-resort amidst 300 acres of coffee and spice estates. Voted among the world\'s best eco-stays.', yearsInOperation: 15, isFamilyRun: false, lat: 12.3892, lng: 75.7541, authenticityScore: 88, verifiedLocal: false, images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfY6mEig_N1uzU8k4VtQb4ujvZmpx78LaLRQ&s'], tags: ['Eco', 'Luxury', 'Coffee'], rating: 4.9, stayType: 'Boutique Stay', category_icon: '🏨', budget: 35000 },
  { name: 'Rajendra Vilas Heritage Hotel', category: 'Boutique Stay', city: 'Mysuru', citySlug: 'mysuru', description: 'A former Maharaja\'s summer palace turned boutique heritage hotel. Experience Mysuru royalty firsthand.', yearsInOperation: 90, isFamilyRun: false, lat: 12.2958, lng: 76.6800, authenticityScore: 93, verifiedLocal: true, images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtmiWxUm_6nagpXzDkFKa99wfgzq4bcUMj1A&s'], tags: ['Palace', 'Heritage', 'Luxury'], rating: 4.8, stayType: 'Heritage Hotel', category_icon: '🏰', budget: 18000 },
  { name: 'Hampi Eco Lodge', category: 'Eco Stay', city: 'Hampi', citySlug: 'hampi', description: 'Solar-powered cottages on the banks of the Tungabhadra. Wake up to boulder views and temple bells.', yearsInOperation: 12, isFamilyRun: false, lat: 15.3320, lng: 76.4580, authenticityScore: 87, verifiedLocal: true, images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfY6mEig_N1uzU8k4VtQb4ujvZmpx78LaLRQ&s'], tags: ['Eco', 'River', 'Sunrise'], rating: 4.7, stayType: 'Eco Stay', category_icon: '🌱', budget: 3200 }
];

const REVIEWS_SEED = [
  { author: 'Preethi N.', place: 'CTR (Shivaji Military Hotel)', text: 'Absolutely amazing benne dosa! The butter melts perfectly. Best breakfast in the city — worth the 20-minute queue.', date: '2026-02-15', sentiment: 'positive' },
  { author: 'Arjun R.', place: 'Mysore Palace Night View', text: 'Truly breathtaking. The palace looks extraordinary at night. A must-visit for anyone in Mysuru.', date: '2026-01-28', sentiment: 'positive' },
  { author: 'Divya K.', place: 'Coorg Coffee Estate Homestay', text: 'The stay was mediocre. The rooms were okay but I expected much more.', date: '2026-02-03', sentiment: 'negative' },
  { author: 'Ratan L.', place: 'Virupaksha Temple', text: 'A normal temple visit. Decent, had some good moments.', date: '2026-01-10', sentiment: 'neutral' }
];

const EXPLORERS = [
  { name: 'Kavya Reddy', city: 'Bengaluru', badge: '🏅 Gold Explorer', contributions: 42, rating: 4.9, avatar: '🧑‍💼', speciality: 'Food & Heritage' },
  { name: 'Mahesh Gowda', city: 'Coorg', badge: '🥈 Silver Explorer', contributions: 28, rating: 4.7, avatar: '👨‍🌾', speciality: 'Nature & Hikes' },
  { name: 'Priya Nair', city: 'Udupi', badge: '🥉 Bronze Explorer', contributions: 15, rating: 4.8, avatar: '👩‍🍳', speciality: 'Local Cuisine' },
  { name: 'Rohan Kumar', city: 'Hampi', badge: '🌟 Legend', contributions: 87, rating: 5.0, avatar: '🧗', speciality: 'Adventure Spots' },
  { name: 'Smitha Rao', city: 'Mysuru', badge: '🏅 Gold Explorer', contributions: 53, rating: 4.9, avatar: '👩‍🎨', speciality: 'Art & Culture' },
  { name: 'Aditya Bhat', city: 'Udupi', badge: '🥈 Silver Explorer', contributions: 31, rating: 4.6, avatar: '🤿', speciality: 'Beach & Coastal' }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await City.deleteMany({});
    await Location.deleteMany({});
    await Review.deleteMany({});
    await Explorer.deleteMany({});

    // Seed Cities
    await City.insertMany(CITIES);
    console.log('Cities seeded!');

    // Seed Locations
    const locationsWithGeo = LISTINGS.map(l => ({
      ...l,
      location: {
        type: 'Point',
        coordinates: [l.lng, l.lat]
      }
    }));
    await Location.insertMany(locationsWithGeo);
    console.log('Locations seeded!');

    // Seed Reviews
    await Review.insertMany(REVIEWS_SEED);
    console.log('Reviews seeded!');

    // Seed Explorers
    await Explorer.insertMany(EXPLORERS);
    console.log('Explorers seeded!');

    console.log('Database seeded successfully! 🌱');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
