const Weather = require('../models/Weather');

// @desc    Create or update weather data
// @route   POST /api/admin/weather
// @access  Private/Admin
exports.createOrUpdateWeather = async (req, res, next) => {
  try {
    const { region, temperature, humidity, condition, windSpeed, description } = req.body;

    const weather = await Weather.findOneAndUpdate(
      { region: region.toLowerCase() },
      {
        region: region.toLowerCase(),
        temperature,
        humidity,
        condition,
        windSpeed: windSpeed || 0,
        description,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: weather,
      message: 'Weather data updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all weather data
// @route   GET /api/admin/weather
// @access  Private/Admin
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

// @desc    Get single weather data
// @route   GET /api/admin/weather/:id
// @access  Private/Admin
exports.getWeather = async (req, res, next) => {
  try {
    const weather = await Weather.findById(req.params.id);

    if (!weather) {
      return res.status(404).json({
        success: false,
        message: 'Weather data not found',
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

// @desc    Update weather data
// @route   PUT /api/admin/weather/:id
// @access  Private/Admin
exports.updateWeather = async (req, res, next) => {
  try {
    const { temperature, humidity, condition, windSpeed, description } = req.body;

    const weather = await Weather.findById(req.params.id);

    if (!weather) {
      return res.status(404).json({
        success: false,
        message: 'Weather data not found',
      });
    }

    if (temperature !== undefined) weather.temperature = temperature;
    if (humidity !== undefined) weather.humidity = humidity;
    if (condition) weather.condition = condition;
    if (windSpeed !== undefined) weather.windSpeed = windSpeed;
    if (description !== undefined) weather.description = description;

    await weather.save();

    res.status(200).json({
      success: true,
      data: weather,
      message: 'Weather data updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete weather data
// @route   DELETE /api/admin/weather/:id
// @access  Private/Admin
exports.deleteWeather = async (req, res, next) => {
  try {
    const weather = await Weather.findById(req.params.id);

    if (!weather) {
      return res.status(404).json({
        success: false,
        message: 'Weather data not found',
      });
    }

    await weather.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Weather data deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

