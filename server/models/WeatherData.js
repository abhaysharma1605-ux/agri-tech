const mongoose = require('mongoose');

const dailySchema = new mongoose.Schema(
  {
    date: String,
    tempMax: Number,
    tempMin: Number,
    rainMm: Number,
    rainProbability: Number,
    windMax: Number,
    weatherCode: Number,
  },
  { _id: false }
);

const weatherSchema = new mongoose.Schema(
  {
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true, index: true },
    fetchedAt: { type: Date, default: Date.now },
    current: {
      temperature: Number,
      humidity: Number,
      windSpeed: Number,
      precipitation: Number,
      weatherCode: Number,
    },
    daily: [dailySchema],
  },
  { timestamps: true }
);

// Auto-purge cached weather after 7 days
weatherSchema.index({ fetchedAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 7 });

module.exports = mongoose.model('WeatherData', weatherSchema);
