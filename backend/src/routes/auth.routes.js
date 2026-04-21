const express = require('express');
const { register, login, me } = require('../controllers/auth.controller');
const authenticateToken = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/api/auth/register', register);
router.post('/api/auth/login', login);
router.get('/api/auth/me', authenticateToken, me);

module.exports = router;
