const mongoose = require('mongoose');

const soilReadingSchema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now },
    ph: { type: Number, min: 0, max: 14 },
    nitrogen: { type: Number, min: 0 }, // kg/ha
    phosphorus: { type: Number, min: 0 }, // kg/ha
    potassium: { type: Number, min: 0 }, // kg/ha
    moisture: { type: Number, min: 0, max: 100 }, // %
    organicCarbon: { type: Number, min: 0, max: 100 }, // %
  },
  { _id: true }
);

const activitySchema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now },
    type: {
      type: String,
      enum: ['sowing', 'irrigation', 'fertilizer', 'pesticide', 'weeding', 'harvest', 'other'],
      default: 'other',
    },
    description: String,
  },
  { _id: true }
);

const cropSchema = new mongoose.Schema(
  {
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true, index: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: [true, 'Crop name is required'], trim: true },
    variety: String,
    season: { type: String, enum: ['kharif', 'rabi', 'zaid', 'perennial'], default: 'kharif' },
    sowingDate: { type: Date, required: [true, 'Sowing date is required'] },
    expectedHarvestDate: Date,
    areaInAcres: { type: Number, min: 0 },
    status: {
      type: String,
      enum: ['planned', 'growing', 'harvested', 'failed'],
      default: 'growing',
    },
    expectedYieldKg: { type: Number, min: 0 },
    actualYieldKg: { type: Number, min: 0 },
    soilReadings: [soilReadingSchema],
    activities: [activitySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Crop', cropSchema);
