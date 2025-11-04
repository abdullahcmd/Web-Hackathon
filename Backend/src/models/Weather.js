const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
  region: {
    type: String,
    required: [true, 'Region is required'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  temperature: {
    type: Number,
    required: [true, 'Temperature is required'],
  },
  humidity: {
    type: Number,
    required: [true, 'Humidity is required'],
    min: [0, 'Humidity cannot be negative'],
    max: [100, 'Humidity cannot exceed 100%'],
  },
  condition: {
    type: String,
    enum: ['sunny', 'cloudy', 'rainy', 'stormy', 'foggy'],
    required: [true, 'Weather condition is required'],
  },
  windSpeed: {
    type: Number,
    default: 0,
    min: [0, 'Wind speed cannot be negative'],
  },
  description: {
    type: String,
    trim: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient queries
weatherSchema.index({ region: 1 });

// Update timestamp on save
weatherSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Weather', weatherSchema);

