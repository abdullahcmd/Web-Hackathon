const mongoose = require('mongoose');

const priceHistorySchema = new mongoose.Schema({
  price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const marketItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
    lowercase: true,
  },
  category: {
    type: String,
    enum: ['vegetable', 'fruit'],
    required: [true, 'Category is required'],
  },
  region: {
    type: String,
    required: [true, 'Region is required'],
    trim: true,
  },
  currentPrice: {
    type: Number,
    required: [true, 'Current price is required'],
    min: [0, 'Price cannot be negative'],
  },
  unit: {
    type: String,
    default: 'per kg',
    trim: true,
  },
  priceHistory: [priceHistorySchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
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
marketItemSchema.index({ name: 1, region: 1 });
marketItemSchema.index({ category: 1 });
marketItemSchema.index({ region: 1 });

// Update timestamp on save
marketItemSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('MarketItem', marketItemSchema);

