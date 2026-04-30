const express = require('express');
const ProgressController = require('../controllers/ProgressController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/my', authMiddleware, ProgressController.getMyProgress);
router.get('/achievements', authMiddleware, ProgressController.getMyAchievements);

module.exports = router;