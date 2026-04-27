const express = require('express');
const TopicController = require('../controllers/TopicController');

const router = express.Router();

router.get('/', TopicController.getAllTopics);
router.get('/:id', TopicController.getTopicById);

module.exports = router;