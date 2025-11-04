const express = require('express');
const router = express.Router();
const {
  createMarketItem,
  getAllMarketItems,
  getMarketItem,
  updateMarketItem,
  deleteMarketItem,
  getStats,
} = require('../controllers/adminController');
const {
  createOrUpdateWeather,
  getAllWeather,
  getWeather,
  updateWeather,
  deleteWeather,
} = require('../controllers/weatherController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Market Items Routes
router.route('/market-items').get(getAllMarketItems).post(createMarketItem);
router
  .route('/market-items/:id')
  .get(getMarketItem)
  .put(updateMarketItem)
  .delete(deleteMarketItem);

// Weather Routes
router.route('/weather').get(getAllWeather).post(createOrUpdateWeather);
router
  .route('/weather/:id')
  .get(getWeather)
  .put(updateWeather)
  .delete(deleteWeather);

// Stats Route
router.get('/stats', getStats);

module.exports = router;

