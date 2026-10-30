const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema(
  {
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    expert: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    subject: { type: String, required: [true, 'Subject is required'], trim: true },
    question: { type: String, required: [true, 'Question is required'] },
    crop: String,
    status: { type: String, enum: ['open', 'answered', 'closed'], default: 'open' },
    answer: String,
    answeredAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Consultation', consultationSchema);
