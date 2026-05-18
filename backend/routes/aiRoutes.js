const express = require('express');
const router = express.Router();
const { getRecommendations } = require('../controllers/aiController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/recommend', authMiddleware, getRecommendations);

module.exports = router;
