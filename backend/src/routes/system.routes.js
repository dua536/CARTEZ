const express = require('express');
const { getRoot, getHealth } = require('../controllers/system.controller');

const router = express.Router();

router.get('/', getRoot);
router.get('/api/health', getHealth);

module.exports = router;
