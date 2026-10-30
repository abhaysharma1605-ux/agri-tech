const mongoose = require('mongoose');

const pestAlertSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    pest: { type: String, required: [true, 'Pest name is required'] },
    description: { type: String, required: true },
    severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
    affectedCrops: [String],
    region: { state: String, district: String }, // empty = nationwide
    prevention: String,
    treatment: String,
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PestAlert', pestAlertSchema);
