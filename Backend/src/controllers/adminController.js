const MarketItem = require('../models/MarketItem');
const generatePriceHistory = require('../utils/generatePriceHistory');

// @desc    Create market item
// @route   POST /api/admin/market-items
// @access  Private/Admin
exports.createMarketItem = async (req, res, next) => {
  try {
    const { name, category, region, currentPrice, unit } = req.body;

    // Generate 7-day price history
    const priceHistory = generatePriceHistory(currentPrice, 7);

    const marketItem = await MarketItem.create({
      name,
      category,
      region,
      currentPrice,
      unit: unit || 'per kg',
      priceHistory,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: marketItem,
      message: 'Market item created successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all market items
// @route   GET /api/admin/market-items
// @access  Private/Admin
exports.getAllMarketItems = async (req, res, next) => {
  try {
    const { category, region, search } = req.query;

    // Build query
    const query = {};
    if (category) query.category = category;
    if (region) query.region = { $regex: region, $options: 'i' };
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const marketItems = await MarketItem.find(query)
      .populate('createdBy', 'name email')
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

// @desc    Get single market item
// @route   GET /api/admin/market-items/:id
// @access  Private/Admin
exports.getMarketItem = async (req, res, next) => {
  try {
    const marketItem = await MarketItem.findById(req.params.id).populate(
      'createdBy',
      'name email'
    );

    if (!marketItem) {
      return res.status(404).json({
        success: false,
        message: 'Market item not found',
      });
    }

    res.status(200).json({
      success: true,
      data: marketItem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update market item
// @route   PUT /api/admin/market-items/:id
// @access  Private/Admin
exports.updateMarketItem = async (req, res, next) => {
  try {
    const { name, category, region, currentPrice, unit } = req.body;

    let marketItem = await MarketItem.findById(req.params.id);

    if (!marketItem) {
      return res.status(404).json({
        success: false,
        message: 'Market item not found',
      });
    }

    // If price changed, update price history
    if (currentPrice && currentPrice !== marketItem.currentPrice) {
      const newPriceHistory = generatePriceHistory(currentPrice, 7);
      marketItem.priceHistory = newPriceHistory;
    }

    // Update fields
    if (name) marketItem.name = name;
    if (category) marketItem.category = category;
    if (region) marketItem.region = region;
    if (currentPrice) marketItem.currentPrice = currentPrice;
    if (unit) marketItem.unit = unit;

    // Add current price to history
    marketItem.priceHistory.push({
      price: marketItem.currentPrice,
      date: new Date(),
    });

    // Keep only last 7 days of history
    if (marketItem.priceHistory.length > 7) {
      marketItem.priceHistory = marketItem.priceHistory.slice(-7);
    }

    await marketItem.save();

    res.status(200).json({
      success: true,
      data: marketItem,
      message: 'Market item updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete market item
// @route   DELETE /api/admin/market-items/:id
// @access  Private/Admin
exports.deleteMarketItem = async (req, res, next) => {
  try {
    const marketItem = await MarketItem.findById(req.params.id);

    if (!marketItem) {
      return res.status(404).json({
        success: false,
        message: 'Market item not found',
      });
    }

    await marketItem.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Market item deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res, next) => {
  try {
    const totalItems = await MarketItem.countDocuments();
    const totalVegetables = await MarketItem.countDocuments({ category: 'vegetable' });
    const totalFruits = await MarketItem.countDocuments({ category: 'fruit' });

    // Calculate average price
    const avgPriceResult = await MarketItem.aggregate([
      {
        $group: {
          _id: null,
          avgPrice: { $avg: '$currentPrice' },
        },
      },
    ]);

    const avgPrice = avgPriceResult.length > 0 ? avgPriceResult[0].avgPrice : 0;

    // Get unique regions
    const regions = await MarketItem.distinct('region');

    res.status(200).json({
      success: true,
      data: {
        totalItems,
        totalVegetables,
        totalFruits,
        averagePrice: Math.round(avgPrice * 100) / 100,
        totalRegions: regions.length,
        regions,
      },
    });
  } catch (error) {
    next(error);
  }
};

