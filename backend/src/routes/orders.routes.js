const express = require('express');
const authenticateToken = require('../middleware/auth.middleware');
const ordersController = require('../controllers/orders.controller');

const router = express.Router();

router.get('/api/orders', authenticateToken, ordersController.listOrders);
router.post('/api/orders', authenticateToken, ordersController.placeOrder);

module.exports = router;
