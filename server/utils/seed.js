require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Resource = require('../models/Resource');
const PestAlert = require('../models/PestAlert');

(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/agritech');
  console.log('Seeding...');

  const users = [
    { name: 'Admin', email: 'admin@agritech.com', password: 'admin123', role: 'admin' },
    { name: 'Dr. Meera Expert', email: 'expert@agritech.com', password: 'expert123', role: 'expert' },
    { name: 'Ramesh Farmer', email: 'farmer@agritech.com', password: 'farmer123', role: 'farmer', location: { state: 'Madhya Pradesh', district: 'Bhopal' } },
  ];
  for (const u of users) {
    if (!(await User.findOne({ email: u.email }))) await User.create(u);
  }
  const admin = await User.findOne({ email: 'admin@agritech.com' });

  if (!(await Resource.countDocuments())) {
    await Resource.insertMany([
      { name: 'Hybrid Wheat Seeds (HD-2967)', category: 'seeds', price: 45, unit: 'kg', stock: 500, description: 'High-yield wheat variety for rabi season', isApproved: true, createdBy: admin._id },
      { name: 'Soybean Seeds (JS-9560)', category: 'seeds', price: 90, unit: 'kg', stock: 300, description: 'Early maturing soybean for kharif', isApproved: true, createdBy: admin._id },
      { name: 'Urea (46% N)', category: 'fertilizer', price: 266, unit: '45kg bag', stock: 200, description: 'Nitrogen fertilizer', isApproved: true, createdBy: admin._id },
      { name: 'DAP (18-46-0)', category: 'fertilizer', price: 1350, unit: '50kg bag', stock: 120, description: 'Phosphorus and nitrogen source', isApproved: true, createdBy: admin._id },
      { name: 'Neem Oil Bio-pesticide', category: 'pesticide', price: 350, unit: 'litre', stock: 80, description: 'Organic pest control', isApproved: true, createdBy: admin._id },
      { name: 'Knapsack Sprayer 16L', category: 'equipment', price: 1800, unit: 'piece', stock: 40, description: 'Manual sprayer', isApproved: true, createdBy: admin._id },
    ]);
  }

  if (!(await PestAlert.countDocuments())) {
    await PestAlert.insertMany([
      { title: 'Fall armyworm outbreak', pest: 'Fall armyworm', severity: 'high', affectedCrops: ['maize', 'sorghum'], description: 'Larvae feeding on leaf whorls reported across districts.', prevention: 'Early sowing, field scouting, pheromone traps.', treatment: 'Spray emamectin benzoate 5% SG or neem-based formulation in the evening.', createdBy: admin._id },
      { title: 'Yellow rust in wheat', pest: 'Puccinia striiformis', severity: 'medium', affectedCrops: ['wheat'], description: 'Yellow stripes on leaves in cool, humid weather.', prevention: 'Use resistant varieties; avoid excess nitrogen.', treatment: 'Spray propiconazole 25% EC at first symptoms.', createdBy: admin._id },
      { title: 'Whitefly infestation', pest: 'Bemisia tabaci', severity: 'medium', affectedCrops: ['cotton', 'tomato', 'soybean'], description: 'Whiteflies transmit viral diseases and weaken plants.', prevention: 'Yellow sticky traps, remove weeds.', treatment: 'Neem oil spray; thiamethoxam if infestation is severe.', createdBy: admin._id },
    ]);
  }

  console.log('Done. Demo logins: admin@agritech.com/admin123, expert@agritech.com/expert123, farmer@agritech.com/farmer123');
  await mongoose.disconnect();
})();
