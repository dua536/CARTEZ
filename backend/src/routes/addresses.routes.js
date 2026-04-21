const express = require('express');
const authenticateToken = require('../middleware/auth.middleware');
const addressesController = require('../controllers/addresses.controller');

const router = express.Router();

// All address routes require authentication
router.get('/api/addresses', authenticateToken, addressesController.getAddresses);
router.get('/api/addresses/:id', authenticateToken, addressesController.getAddressById);
router.post('/api/addresses', authenticateToken, addressesController.createAddress);
router.put('/api/addresses/:id', authenticateToken, addressesController.updateAddress);
router.delete('/api/addresses/:id', authenticateToken, addressesController.deleteAddress);

module.exports = router;
