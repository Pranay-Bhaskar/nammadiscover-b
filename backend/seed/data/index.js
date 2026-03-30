require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Location = require('../models/Location');
const Review = require('../models/Review');
const Guide = require('../models/Guide');

const locationsA = require('./locationsA');
const locationsB = require('./locationsB');
const guidesData = require('./guides');
const reviewsData = require('./reviews');

const seed = async () => {
  await connectDB();

  console.log('⚠️  Clearing existing data...');
  await Location.deleteMany({});
  await Review.deleteMany({});
  await Guide.deleteMany({});

  console.log('🌱 Seeding guides...');
  const guides = await Guide.insertMany(guidesData);
  console.log(`   ✅ ${guides.length} guides inserted`);

  console.log('🗺  Seeding locations...');
  const allLocations = [...locationsA, ...locationsB];
  const locations = await Location.insertMany(allLocations);
  console.log(`   ✅ ${locations.length} locations inserted`);

  console.log('⭐ Seeding reviews...');
  let reviewCount = 0;
  for (const rd of reviewsData) {
    const loc = locations.find(l => l.name.en === rd.locationName);
    if (!loc) continue;
    const review = await Review.create({
      location: loc._id,
      reviewerName: rd.reviewerName,
      rating: rd.rating,
      comment: rd.comment,
      photos: rd.photos || []
    });
    loc.reviews.push(review._id);
    loc.rating = rd.rating;
    await Location.findByIdAndUpdate(loc._id, {
      $push: { reviews: review._id },
      rating: rd.rating
    });
    reviewCount++;
  }
  console.log(`   ✅ ${reviewCount} reviews inserted`);

  // Link guides to cities
  console.log('🔗 Linking guides to city locations...');
  for (const guide of guides) {
    await Location.updateMany(
      { city: { $regex: new RegExp(guide.city, 'i') } },
      { $addToSet: { localGuides: guide._id } }
    );
  }

  console.log('\n🎉 Seed complete!');
  console.log(`   📍 ${locations.length} locations`);
  console.log(`   👥 ${guides.length} guides`);
  console.log(`   ⭐ ${reviewCount} reviews`);
  process.exit(0);
};

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
