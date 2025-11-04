const MarketItem = require('../models/MarketItem');
const Weather = require('../models/Weather');

// @desc    Get all market items with prices
// @route   GET /api/farmer/market-items
// @access  Private/Farmer
exports.getAllMarketItems = async (req, res, next) => {
  try {
    const { category, region, search } = req.query;

    // Build query
    const query = {};
    if (category) query.category = category;
    if (region) query.region = { $regex: region, $options: 'i' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { region: { $regex: search, $options: 'i' } },
      ];
    }

    const marketItems = await MarketItem.find(query)
      .select('name category region currentPrice unit priceHistory createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: marketItems.length,
      data: marketItems,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single market item with price trend
// @route   GET /api/farmer/market-items/:id
// @access  Private/Farmer
exports.getMarketItem = async (req, res, next) => {
  try {
    const marketItem = await MarketItem.findById(req.params.id).select(
      'name category region currentPrice unit priceHistory createdAt'
    );

    if (!marketItem) {
      return res.status(404).json({
        success: false,
        message: 'Market item not found',
      });
    }

    // Format price history for chart (last 7 days)
    const priceTrend = marketItem.priceHistory
      .slice(-7)
      .map((item) => ({
        date: item.date.toISOString().split('T')[0],
        price: item.price,
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    res.status(200).json({
      success: true,
      data: {
        ...marketItem.toObject(),
        priceTrend,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get weather by region
// @route   GET /api/farmer/weather/:region
// @access  Private/Farmer
exports.getWeather = async (req, res, next) => {
  try {
    const { region } = req.params;

    const weather = await Weather.findOne({
      region: region.toLowerCase(),
    });

    if (!weather) {
      return res.status(404).json({
        success: false,
        message: 'Weather data not found for this region',
      });
    }

    res.status(200).json({
      success: true,
      data: weather,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all weather data
// @route   GET /api/farmer/weather
// @access  Private/Farmer
exports.getAllWeather = async (req, res, next) => {
  try {
    const weatherData = await Weather.find().sort({ region: 1 });

    res.status(200).json({
      success: true,
      count: weatherData.length,
      data: weatherData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get price trends for all items
// @route   GET /api/farmer/price-trends
// @access  Private/Farmer
exports.getPriceTrends = async (req, res, next) => {
  try {
    const { region, category } = req.query;

    const query = {};
    if (region) query.region = { $regex: region, $options: 'i' };
    if (category) query.category = category;

    const marketItems = await MarketItem.find(query).select(
      'name category region currentPrice priceHistory'
    );

    const trends = marketItems.map((item) => ({
      id: item._id,
      name: item.name,
      category: item.category,
      region: item.region,
      currentPrice: item.currentPrice,
      trend: item.priceHistory
        .slice(-7)
        .map((h) => ({
          date: h.date.toISOString().split('T')[0],
          price: h.price,
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date)),
    }));

    res.status(200).json({
      success: true,
      count: trends.length,
      data: trends,
    });
  } catch (error) {
    next(error);
  }
};

