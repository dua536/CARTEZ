const { checkDbConnection } = require('../../db');

// ✅ Root endpoint
async function getRoot(_req, res) {
  res.status(200).json({
    success: true,
    message: 'Grocery backend API is running',
  });
}

// ✅ Health check (Oracle compatible)
async function getHealth(_req, res, next) {
  try {
    // This should internally run something like: SELECT 1 FROM DUAL
    await checkDbConnection();

    res.status(200).json({
      success: true,
      message: 'Server and Oracle DB are healthy',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getRoot,
  getHealth,
};