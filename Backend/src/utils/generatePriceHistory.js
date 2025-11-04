// Generate 7-day price history with realistic variations
const generatePriceHistory = (currentPrice, days = 7) => {
  const history = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    // Generate price with ±15% variation from current price
    const variation = (Math.random() - 0.5) * 0.3; // -15% to +15%
    const price = Math.round(currentPrice * (1 + variation) * 100) / 100;

    history.push({
      price: Math.max(0, price), // Ensure price is not negative
      date: date,
    });
  }

  return history;
};

module.exports = generatePriceHistory;

