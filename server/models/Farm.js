const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: [true, 'Farm name is required'], trim: true },
    location: {
      village: String,
      district: String,
      state: String,
      latitude: { type: Number, required: [true, 'Latitude is required'], min: -90, max: 90 },
      longitude: { type: Number, required: [true, 'Longitude is required'], min: -180, max: 180 },
    },
    areaInAcres: { type: Number, required: [true, 'Area is required'], min: 0.01 },
    soilType: {
      type: String,
      enum: ['alluvial', 'black', 'red', 'laterite', 'sandy', 'clay', 'loamy'],
      default: 'loamy',
    },
    irrigationType: {
      type: String,
      enum: ['rainfed', 'canal', 'drip', 'sprinkler', 'tubewell'],
      default: 'rainfed',
    },
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Farm', farmSchema);
