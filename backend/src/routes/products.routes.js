const express = require('express');
const { getProducts, getProductById } = require('../controllers/products.controller');

const router = express.Router();

router.get('/api/products', getProducts);
router.get('/api/products/:id', getProductById);

module.exports = router;
