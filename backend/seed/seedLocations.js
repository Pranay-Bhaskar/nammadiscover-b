require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');

const Location = require('../models/Location');
const Review = require('../models/Review');
const User = require('../models/User');

/* ── helpers ─────────────────────────────────────────────── */
const mk = (en, kn) => ({ en, kn });

/* ── full location data (from mapEngine) ─────────────────── */
const locations = [
    // ── Bengaluru ──────────────────────────────────────────────
    { name: mk('Lalbagh Botanical Garden', 'ಲಾಲ್‌ಬಾಗ್ ಸಸ್ಯೋದ್ಯಾನ'), category: 'nature', subcategory: 'garden', description: mk('A 240-acre botanical garden founded by Hyder Ali, home to over 1,800 plant species and a stunning glasshouse modeled on London\'s Crystal Palace.', 'ಹೈದರ್ ಅಲಿ ಸ್ಥಾಪಿಸಿದ 240 ಎಕರೆ ಸಸ್ಯೋದ್ಯಾನ.'), culturalStory: mk('Hyder Ali began Lalbagh in 1760, and his son Tipu Sultan expanded it.', 'ಹೈದರ್ ಅಲಿ 1760ರಲ್ಲಿ ಲಾಲ್‌ಬಾಗ್ ನಿರ್ಮಿಸಿದರು.'), travelTips: mk('Visit early morning. Flower shows in Jan and Aug.', 'ಬೆಳಿಗ್ಗೆ ಭೇಟಿ ನೀಡಿ.'), location: { type: 'Point', coordinates: [77.5846, 12.9507] }, city: 'Bengaluru', district: 'Bengaluru Urban', tags: ['garden', 'nature', 'heritage', 'flower show'], rating: 4.5, authenticityScore: 88, isVerified: true, openingHours: '6:00 AM – 7:00 PM', bestTimeToVisit: 'Oct–Feb', entryFee: '₹20 adults' },
    { name: mk('Vidhana Soudha', 'ವಿಧಾನ ಸೌಧ'), category: 'heritage', subcategory: 'government building', description: mk('Karnataka\'s majestic legislative assembly — neo-Dravidian and Vedic styles, lit spectacularly on Sundays.', 'ಕರ್ನಾಟಕ ವಿಧಾನ ಸಭೆ.'), culturalStory: mk('Built in 1956, a symbol of democratic pride and Indo-Saracenic architecture.', '1956ರಲ್ಲಿ ನಿರ್ಮಿತ.'), travelTips: mk('Best viewed at night when illuminated. Photography outside only.', 'ರಾತ್ರಿ ದರ್ಶನ ಉತ್ತಮ.'), location: { type: 'Point', coordinates: [77.5913, 12.9789] }, city: 'Bengaluru', district: 'Bengaluru Urban', tags: ['heritage', 'iconic', 'architecture'], rating: 4.4, authenticityScore: 85, isVerified: true, openingHours: 'External viewing only', bestTimeToVisit: 'Year-round', entryFee: 'Free' },
    { name: mk('CTR - Central Tiffin Room', 'ಸೆಂಟ್ರಲ್ ಟಿಫಿನ್ ರೂಂ'), category: 'food', subcategory: 'restaurant', description: mk('Bengaluru\'s iconic breakfast institution since 1922. Famous for crispy benne dosa and filter coffee.', '1922ರಿಂದ ಬೆಂಗಳೂರಿನ ತಿಂಡಿ ತಾಣ.'), culturalStory: mk('Politicians, artists, and locals all queue together for the city\'s finest benne dosa.', 'ರಾಜಕಾರಣಿಗಳು ಮತ್ತು ಕಲಾವಿದರು ಇಲ್ಲಿ ತಿಂಡಿ ತಿನ್ನುತ್ತಾರೆ.'), travelTips: mk('Arrive by 8AM or expect queues. Cash only.', 'ಬೆಳಿಗ್ಗೆ 8 ಗಂಟೆಗೆ ಬನ್ನಿ.'), location: { type: 'Point', coordinates: [77.5716, 13.0035] }, city: 'Bengaluru', district: 'Bengaluru Urban', tags: ['food', 'iconic', 'breakfast', 'local favorite'], rating: 4.7, authenticityScore: 95, isVerified: true, openingHours: '6:30 AM – 12:30 PM', bestTimeToVisit: 'Year-round', entryFee: 'None' },
    { name: mk('Cubbon Park', 'ಕಬ್ಬನ್ ಉದ್ಯಾನ'), category: 'nature', subcategory: 'park', description: mk('A 300-acre green lung in the heart of Bengaluru with colonial-era buildings.', 'ಬೆಂಗಳೂರಿನ ಹಸಿರು ಶ್ವಾಸಕೋಶ.'), culturalStory: mk('Laid out in 1870 by Richard Sankey during British rule.', '1870ರಲ್ಲಿ ನಿರ್ಮಿತ.'), travelTips: mk('Cars restricted on Sunday mornings. Great for cycling.', 'ಭಾನುವಾರ ಬೆಳಿಗ್ಗೆ ವಾಹನ ನಿರ್ಬಂಧ.'), location: { type: 'Point', coordinates: [77.5946, 12.9763] }, city: 'Bengaluru', district: 'Bengaluru Urban', tags: ['park', 'nature', 'heritage', 'family'], rating: 4.3, authenticityScore: 80, isVerified: true, openingHours: '6:00 AM – 8:00 PM', bestTimeToVisit: 'Year-round', entryFee: 'Free' },
    { name: mk('Church Street', 'ಚರ್ಚ್ ಸ್ಟ್ರೀಟ್'), category: 'local_pick', subcategory: 'cultural street', description: mk('Vibrant pedestrian-friendly street filled with bookstores, cafés, street art, and live music venues.', 'ಪುಸ್ತಕ ಅಂಗಡಿಗಳು, ಕ್ಯಾಫೆಗಳು ಮತ್ತು ಸ್ಟ್ರೀಟ್ ಆರ್ಟ್‌ನಿಂದ ಪ್ರಸಿದ್ಧ.'), culturalStory: mk('Once colonial-era road, now Bengaluru\'s literary and café culture hub.', 'ಕಾಲೊನಿಯಲ್ ಕಾಲದ ರಸ್ತೆ ಈಗ ಬೆಂಗಳೂರು ಕಫೆ ಕೇಂದ್ರ.'), travelTips: mk('Best explored on foot in the evening.', 'ಸಂಜೆ ಸಮಯದಲ್ಲಿ ಕಾಲ್ನಡಿಗೆಯಲ್ಲಿ ಭೇಟಿ.'), location: { type: 'Point', coordinates: [77.6069, 12.9756] }, city: 'Bengaluru', district: 'Bengaluru Urban', tags: ['street', 'cafes', 'bookstores', 'culture'], rating: 4.7, authenticityScore: 90, isVerified: true, openingHours: 'Open 24 hours', bestTimeToVisit: 'Evening & weekends', entryFee: 'None' },
    { name: mk('Bull Temple (Dodda Basavana Gudi)', 'ಡೋಡ್ಡ ಬಸವಣ್ಣ ಗುಡಿ'), category: 'temple', subcategory: 'megalithic temple', description: mk('World\'s largest Nandi statue (4.5m tall granite monolith) from 16th century.', 'ವಿಶ್ವದ ಅತಿದೊಡ್ಡ ನಂದಿ.'), culturalStory: mk('Built by local shepherd when giant bull ate groundnut crops. October Groundnut Fair draws lakhs.', 'ಕಡಲೆಕಾಯಿ ಪರಿಸ್ ಅಕ್ಟೋಬರ್.'), travelTips: mk('October groundnut fair is unique. Climb nearby rock for views.', 'ಅಕ್ಟೋಬರ್ ಕಡಲೆಕಾಯಿ ಪರಿಸ್.'), location: { type: 'Point', coordinates: [77.5578, 12.9385] }, city: 'Bengaluru', district: 'Bengaluru South', tags: ['temple', 'Nandi', 'groundnut fair'], rating: 4.5, authenticityScore: 91, isVerified: true, openingHours: '6AM–8PM', bestTimeToVisit: 'Oct', entryFee: 'Free' },
    { name: mk('KR Market Flower Auction', 'ಕೆ.ಆರ್. ಮಾರ್ಕೆಟ್ ಹೂವು ಹರಾಜು'), category: 'local_pick', subcategory: 'dawn auction', description: mk('3AM secret flower auction where wholesalers bid on jasmine, marigold truckloads.', '3AM ಹೂವಿನ ಹರಾಜು.'), culturalStory: mk('Bengaluru supplies 40% Karnataka temple flowers. Auctioneer chants are pure poetry.', 'ಕರ್ನಾಟಕ 40% ದೇವಾಲಯ ಹೂವು ಬೆಂಗಳೂರಿನಿಂದ.'), travelTips: mk('Arrive 2:45AM. Wear old clothes. Follow flower truck.', '2:45AM ಬನ್ನಿ.'), location: { type: 'Point', coordinates: [77.5785, 12.9642] }, city: 'Bengaluru', district: 'Bengaluru Urban', tags: ['auction', 'flowers', 'dawn', 'local'], rating: 4.8, authenticityScore: 97, isVerified: true, openingHours: '2AM–6AM daily', bestTimeToVisit: 'Year-round', entryFee: 'Free' },

    // ── Mysuru ─────────────────────────────────────────────────
    { name: mk('Mysore Palace', 'ಮೈಸೂರು ಅರಮನೆ'), category: 'heritage', subcategory: 'palace', description: mk('One of India\'s most visited monuments and the official residence of the Wadiyar dynasty. Hindu, Mughal, Rajput, and Gothic blend.', 'ಮೈಸೂರು ಅರಮನೆ ಭಾರತದ ಪ್ರಮುಖ ಪ್ರವಾಸಿ ತಾಣ.'), culturalStory: mk('The present palace was built in 1912. Illuminated by 97,000 bulbs every Sunday.', '1912ರಲ್ಲಿ ನಿರ್ಮಿತ. 97,000 ದೀಪಗಳಿಂದ ಅಲಂಕೃತ.'), travelTips: mk('Sunday evenings offer illumination. Dasara is the best time.', 'ದಸರಾ ಸಮಯ ಬೇಟಿ ಉತ್ತಮ.'), location: { type: 'Point', coordinates: [76.6552, 12.3052] }, city: 'Mysuru', district: 'Mysuru', tags: ['heritage', 'palace', 'iconic', 'dasara'], rating: 4.8, authenticityScore: 97, isVerified: true, openingHours: '10:00 AM – 5:30 PM', bestTimeToVisit: 'Sep–Nov (Dasara)', entryFee: '₹100 adults' },
    { name: mk('Chamundeshwari Temple', 'ಚಾಮುಂಡೇಶ್ವರಿ ದೇವಾಲಯ'), category: 'temple', subcategory: 'hilltop temple', description: mk('A sacred 1000-year-old temple atop Chamundi Hills with sweeping views of Mysuru city.', 'ಚಾಮುಂಡಿ ಬೆಟ್ಟದ ಮೇಲಿರುವ ಪ್ರಾಚೀನ ದೇವಾಲಯ.'), culturalStory: mk('The Wadiyar kings were devout followers. The 1,000-step climb is a sacred ritual.', 'ವಾಡಿಯಾರ್ ರಾಜರ ಆರಾಧ್ಯ ದೈವ.'), travelTips: mk('Climb 1000 steps for blessings. Vehicle access also available.', '1000 ಮೆಟ್ಟಿಲು ಹತ್ತಬಹುದು.'), location: { type: 'Point', coordinates: [76.67, 12.2723] }, city: 'Mysuru', district: 'Mysuru', tags: ['temple', 'sacred', 'hilltop', 'views'], rating: 4.7, authenticityScore: 94, isVerified: true, openingHours: '7:30 AM – 2:00 PM, 3:30–9:00 PM', bestTimeToVisit: 'Year-round', entryFee: 'Free' },
    { name: mk('Brindavan Gardens', 'ಬೃಂದಾವನ ಉದ್ಯಾನ'), category: 'nature', subcategory: 'garden', description: mk('Terraced ornamental gardens on the KRS Dam reservoir, famous for musical illuminated fountain shows.', 'ಕೆಆರ್‌ಎಸ್ ಅಣೆಕಟ್ಟಿನ ಬಳಿಯ ಸುಂದರ ತೋಟ.'), culturalStory: mk('Built in 1932, designed by Sir Mirza Ismail.', '1932ರಲ್ಲಿ ಸರ್ ಮಿರ್ಜಾ ಇಸ್ಮಾಯಿಲ್ ವಿನ್ಯಾಸ.'), travelTips: mk('Musical fountain: 6:30–7:45 PM (weekdays), 7:30–8:45 PM (weekends).', 'ಸಂಗೀತ ಕಾರಂಜಿ ರಾತ್ರಿ.'), location: { type: 'Point', coordinates: [76.5741, 12.4231] }, city: 'Mysuru', district: 'Mandya', tags: ['garden', 'fountain', 'family', 'KRS'], rating: 4.4, authenticityScore: 82, isVerified: true, openingHours: '6:00 AM – 8:00 PM', bestTimeToVisit: 'Oct–Feb', entryFee: '₹30 adults' },

    // ── Hampi ──────────────────────────────────────────────────
    { name: mk('Virupaksha Temple', 'ವಿರೂಪಾಕ್ಷ ದೇವಾಲಯ'), category: 'temple', subcategory: 'ancient temple', description: mk('One of the oldest functioning temples in India at the heart of Hampi\'s UNESCO ruins.', 'ಹಂಪಿಯ ಮಧ್ಯದಲ್ಲಿರುವ ಐತಿಹಾಸಿಕ ದೇವಾಲಯ.'), culturalStory: mk('Dating to the 7th century, the religious heart of the Vijayanagara Empire.', '7ನೇ ಶತಮಾನದ ದೇವಾಲಯ.'), travelTips: mk('Wake up for sunrise on Hemakuta Hill. Fridays for special puja.', 'ಹೇಮಕೂಟ ಬೆಟ್ಟದಿಂದ ಸೂರ್ಯೋದಯ.'), location: { type: 'Point', coordinates: [76.4622, 15.335] }, city: 'Hampi', district: 'Vijayanagara', tags: ['temple', 'UNESCO', 'heritage', 'Vijayanagara'], rating: 4.9, authenticityScore: 99, isVerified: true, openingHours: '6:00 AM – 6:00 PM', bestTimeToVisit: 'Oct–Mar', entryFee: 'Free (₹500 camera fee)' },
    { name: mk('Vittala Temple Complex', 'ವಿಠ್ಠಲ ದೇವಾಲಯ'), category: 'heritage', subcategory: 'ancient ruins', description: mk('Home to the iconic Stone Chariot and musical pillars — a masterpiece of Vijayanagara architecture.', 'ಸಂಗೀತ ಸ್ತಂಭಗಳಿಗೆ ಹೆಸರಾದ ದೇವಾಲಯ.'), culturalStory: mk('Built in 15th century. The stone chariot is the symbol of Karnataka Tourism.', '15ನೇ ಶತಮಾನದ ವಿಖ್ಯಾತ ದೇವಾಲಯ.'), travelTips: mk('Early morning. Electric vehicle from ticket counter. Do not touch pillars.', 'ಬೆಳಿಗ್ಗೆ ಭೇಟಿ. ಸ್ತಂಭ ಮುಟ್ಟಬೇಡಿ.'), location: { type: 'Point', coordinates: [76.4761, 15.3355] }, city: 'Hampi', district: 'Vijayanagara', tags: ['heritage', 'UNESCO', 'stone chariot', 'musical pillars'], rating: 4.9, authenticityScore: 99, isVerified: true, openingHours: '8:00 AM – 5:30 PM', bestTimeToVisit: 'Oct–Mar', entryFee: '₹600 foreigners / ₹40 Indians' },
    { name: mk('Matanga Hill Sunrise', 'ಮತಂಗ ಬೆಟ್ಟ'), category: 'photo_spot', subcategory: 'viewpoint', description: mk('The highest point in Hampi — 360° panorama of ruins, boulders and the Tungabhadra river.', 'ಹಂಪಿಯ ಅತ್ಯುನ್ನತ ಬೆಟ್ಟ.'), culturalStory: mk('Sage Matanga meditated here according to the Ramayana.', 'ರಾಮಾಯಣದ ಮತಂಗ ಋಷಿಯ ತಪಸ್ಥಳ.'), travelTips: mk('Start climbing 45 min before sunrise. Slippery stones — wear good shoes.', 'ಸೂರ್ಯೋದಯಕ್ಕೆ 45 ನಿಮಿಷ ಮೊದಲು ಹತ್ತಿ.'), location: { type: 'Point', coordinates: [76.4735, 15.332] }, city: 'Hampi', district: 'Vijayanagara', tags: ['photo spot', 'sunrise', 'viewpoint', 'hidden gem'], rating: 4.8, authenticityScore: 91, isVerified: true, openingHours: 'Accessible 24/7', bestTimeToVisit: 'Oct–Mar', entryFee: 'Free' },

    // ── Coorg ──────────────────────────────────────────────────
    { name: mk('Abbey Falls', 'ಅಭಯ ಜಲಪಾತ'), category: 'nature', subcategory: 'waterfall', description: mk('A stunning 70-foot waterfall nestled in the coffee estates near Madikeri.', 'ಮಡಿಕೇರಿ ಸಮೀಪ ಕಾಫಿ ಎಸ್ಟೇಟ್‌ಗಳ ನಡುವಿರುವ 70 ಅಡಿ ಜಲಪಾತ.'), culturalStory: mk('The waterfall flows through a private coffee estate, accessible via a suspended bridge.', 'ಕಾಫಿ ಎಸ್ಟೇಟ್ ನಡುವಿನ ಜಲಪಾತ.'), travelTips: mk('Visit during monsoon (Jul-Sep) for maximum flow. Mornings less crowded.', 'ಮಳೆಗಾಲದಲ್ಲಿ ಭೇಟಿ ನೀಡಿ.'), location: { type: 'Point', coordinates: [75.7284, 12.4131] }, city: 'Coorg', district: 'Kodagu', tags: ['waterfall', 'nature', 'trekking', 'scenic'], rating: 4.4, authenticityScore: 85, isVerified: true, openingHours: '8:00 AM – 5:30 PM', bestTimeToVisit: 'Jul–Sep', entryFee: '₹30' },
    { name: mk('Raja\'s Seat', 'ರಾಜನ ಆಸನ'), category: 'photo_spot', subcategory: 'viewpoint', description: mk('A scenic garden and viewpoint where the kings of Coorg watched the sunset over the western plains.', 'ಕೊಡಗಿನ ರಾಜರು ಸೂರ್ಯಾಸ್ತ ವೀಕ್ಷಿಸಿದ ಉದ್ಯಾನ.'), culturalStory: mk('Literally meaning "King\'s Seat", this royal garden offers unmatched sunset views over tea estates.', 'ರಾಜನ ಆಸನ — ಸೂರ್ಯಾಸ್ತ ನೋಡುವ ಸ್ಥಳ.'), travelTips: mk('Arrive 30 min before sunset. Musical fountain shows on weekends.', 'ಸೂರ್ಯಾಸ್ತಕ್ಕೆ 30 ನಿಮಿಷ ಮೊದಲು ಬನ್ನಿ.'), location: { type: 'Point', coordinates: [75.7378, 12.4244] }, city: 'Coorg', district: 'Kodagu', tags: ['viewpoint', 'sunset', 'garden', 'scenic'], rating: 4.3, authenticityScore: 80, isVerified: true, openingHours: '6:00 AM – 7:30 PM', bestTimeToVisit: 'Oct–May', entryFee: '₹10' },

    // ── Chikmagalur ────────────────────────────────────────────
    { name: mk('Mullayanagiri Peak', 'ಮುಳ್ಳಯ್ಯನಗಿರಿ ಶಿಖರ'), category: 'nature', subcategory: 'trekking', description: mk('The highest peak in Karnataka at 1,930m, offering breathtaking views of the Western Ghats.', 'ಕರ್ನಾಟಕದ ಅತ್ಯುನ್ನತ ಶಿಖರ 1,930 ಮೀ.'), culturalStory: mk('Named after sage Mulayyagiri, the peak has a small temple at its summit.', 'ಮುಳ್ಳಯ್ಯ ಋಷಿ ಹೆಸರಿನ ಶಿಖರ.'), travelTips: mk('Trek takes 2-3 hours. Start early to avoid afternoon mist.', 'ಟ್ರೆಕ್ 2-3 ಗಂಟೆ. ಮುಂಜಾನೆ ಪ್ರಾರಂಭಿಸಿ.'), location: { type: 'Point', coordinates: [75.7334, 13.3945] }, city: 'Chikmagalur', district: 'Chikkamagaluru', tags: ['trekking', 'peak', 'nature', 'Western Ghats'], rating: 4.6, authenticityScore: 90, isVerified: true, openingHours: 'Open 24/7', bestTimeToVisit: 'Sep–Feb', entryFee: 'Free' },

    // ── Gokarna ────────────────────────────────────────────────
    { name: mk('Om Beach', 'ಓಂ ಬೀಚ್'), category: 'nature', subcategory: 'beach', description: mk('A pristine beach shaped like the sacred Om symbol, surrounded by forested hills.', 'ಓಂ ಆಕಾರದ ಪವಿತ್ರ ಸಮುದ್ರ ತೀರ.'), culturalStory: mk('Gokarna\'s most sacred beach, near the ancient Mahabaleshwara temple.', 'ಮಹಾಬಲೇಶ್ವರ ದೇವಾಲಯ ಸಮೀಪ.'), travelTips: mk('Kayaking and banana boat rides available. Avoid monsoon season.', 'ಕಯಾಕಿಂಗ್ ಲಭ್ಯ.'), location: { type: 'Point', coordinates: [74.3119, 14.5264] }, city: 'Gokarna', district: 'Uttara Kannada', tags: ['beach', 'nature', 'sacred', 'photo spot'], rating: 4.5, authenticityScore: 88, isVerified: true, openingHours: 'Open 24/7', bestTimeToVisit: 'Oct–Mar', entryFee: 'Free' },

    // ── Udupi ──────────────────────────────────────────────────
    { name: mk('Sri Krishna Temple Udupi', 'ಶ್ರೀ ಕೃಷ್ಣ ಮಠ ಉಡುಪಿ'), category: 'temple', subcategory: 'mathas', description: mk('800-year-old temple, birthplace of Udupi cuisine, with the famous window through which Kanakadasa received blessings.', '800 ವರ್ಷ ಹಳೆಯ ದೇವಾಲಯ, ಉಡುಪಿ ಅಡುಗೆಯ ಹುಟ್ಟೂರು.'), culturalStory: mk('Founded by Sri Madhvacharya. Eight mathas encircle it. The window (Kanakana Kindi) honors devotee Kanakadasa.', 'ಶ್ರೀ ಮಧ್ವಾಚಾರ್ಯ ಸ್ಥಾಪನೆ.'), travelTips: mk('Darshan free. Prasadam served daily. Avoid festivals for easy access.', 'ದರ್ಶನ ಉಚಿತ.'), location: { type: 'Point', coordinates: [74.7517, 13.3409] }, city: 'Udupi', district: 'Udupi', tags: ['temple', 'sacred', 'heritage', 'Madhva'], rating: 4.8, authenticityScore: 96, isVerified: true, openingHours: '6:00 AM – 8:30 PM', bestTimeToVisit: 'Year-round', entryFee: 'Free' },

    // ── Mangalore ──────────────────────────────────────────────
    { name: mk('Kudla Tulunad Fish Market', 'ಮೀನು ಮಾರುಕಟ್ಟೆ'), category: 'local_pick', subcategory: 'fish market', description: mk('Mangalore\'s vibrant dawn fish market where the freshest catch from the Arabian Sea arrives daily.', 'ಅರಬ್ಬಿ ಸಮುದ್ರದ ತಾಜಾ ಮೀನು.'), culturalStory: mk('Tulu culture revolves around seafood. Watch expert fishwives grade, auction, and sell within minutes.', 'ತುಳು ಸಂಸ್ಕೃತಿ ಮತ್ತು ಸಮುದ್ರ.'), travelTips: mk('Arrive 6AM for the auction. Taste fresh Surmai at a nearby hotel.', 'ಬೆಳಿಗ್ಗೆ 6ಕ್ಕೆ ಹರಾಜು ನೋಡಿ.'), location: { type: 'Point', coordinates: [74.8456, 12.8739] }, city: 'Mangalore', district: 'Dakshina Kannada', tags: ['fish market', 'local', 'culture', 'food'], rating: 4.5, authenticityScore: 92, isVerified: true, openingHours: '5:00 AM – 11:00 AM', bestTimeToVisit: 'Year-round', entryFee: 'Free' },
];

/* ── Admin seed user ─────────────────────────────────────── */
const adminUser = {
    username: 'namma_admin',
    email: 'admin@nammadiscover.in',
    password: 'Admin@1234',
    role: 'admin',
};

const seed = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected for seeding');

    // Upsert admin
    const existingAdmin = await User.findOne({ email: adminUser.email });
    if (!existingAdmin) {
        await User.create(adminUser);
        console.log('👤 Admin user created — email: admin@nammadiscover.in  password: Admin@1234');
    } else {
        console.log('ℹ️  Admin user already exists');
    }

    // Clear and reseed locations with correct fields
    await Location.deleteMany({});
    const processedLocations = locations.map(loc => ({
        ...loc,
        lat: loc.location.coordinates[1],
        lng: loc.location.coordinates[0],
        citySlug: loc.city.toLowerCase().replace(/\s+/g, '-')
    }));
    const inserted = await Location.insertMany(processedLocations);
    console.log(`📍 ${inserted.length} locations seeded`);

    // Sample reviews
    const sampleLoc = inserted[0];
    await Review.deleteMany({});
    await Review.create([
        { location: sampleLoc._id, reviewerName: 'Rahul K', rating: 5, comment: 'Absolutely stunning botanical paradise! Perfect for morning walks and photography.' },
        { location: sampleLoc._id, reviewerName: 'Priya S', rating: 4, comment: 'Beautiful garden, especially the glasshouse. Gets crowded on weekends.' },
    ]);
    await Location.findByIdAndUpdate(sampleLoc._id, {
        $push: { reviews: { $each: (await Review.find({ location: sampleLoc._id })).map(r => r._id) } }
    });
    console.log('⭐ Sample reviews seeded');
    console.log('\n🎉 Seed complete!');
    process.exit(0);
};

seed().catch(err => { console.error('Seed error:', err); process.exit(1); });
