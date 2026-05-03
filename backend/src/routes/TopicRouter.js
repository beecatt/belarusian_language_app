const express = require('express');

const TopicController = require('../controllers/TopicController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

router.get('/', TopicController.getAllTopics);
router.get('/:id', TopicController.getTopicById);

router.post(
    '/',
    authMiddleware,
    roleMiddleware('admin'),
    TopicController.createTopic
);

router.put(
    '/:id',
    authMiddleware,
    roleMiddleware('admin'),
    TopicController.updateTopic
);

router.delete(
    '/:id',
    authMiddleware,
    roleMiddleware('admin'),
    TopicController.deleteTopic
);

module.exports = router;