const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Resource name is required'], trim: true },
    category: {
      type: String,
      enum: ['seeds', 'fertilizer', 'pesticide', 'equipment', 'tools', 'other'],
      required: true,
    },
    description: String,
    price: { type: Number, required: [true, 'Price is required'], min: 0 },
    unit: { type: String, default: 'unit' },
    stock: { type: Number, default: 0, min: 0 },
    isApproved: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

resourceSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Resource', resourceSchema);
