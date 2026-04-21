const express = require('express');
const categoriesController = require('../controllers/categories.controller');

const router = express.Router();

router.get('/api/categories', categoriesController.getCategories);
router.get('/api/categories/:id', categoriesController.getCategoryById);
router.post('/api/categories', categoriesController.createCategory);
router.put('/api/categories/:id', categoriesController.updateCategory);
router.delete('/api/categories/:id', categoriesController.deleteCategory);

module.exports = router;
