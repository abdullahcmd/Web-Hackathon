const express = require('express');
const router = express.Router();
const {
  getAllMarketItems,
  getMarketItem,
  getWeather,
  getAllWeather,
  getPriceTrends,
} = require('../controllers/farmerController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);
router.use(authorize('farmer', 'admin')); // Allow both farmers and admins to view

// Market Items Routes
router.get('/market-items', getAllMarketItems);
router.get('/market-items/:id', getMarketItem);

// Weather Routes
router.get('/weather', getAllWeather);
router.get('/weather/:region', getWeather);

// Price Trends Route
router.get('/price-trends', getPriceTrends);

module.exports = router;

