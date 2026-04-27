const express = require('express');
const TaskController = require('../controllers/TaskController');

const router = express.Router();

router.get('/topic/:topicId', TaskController.getTasksByTopicId);
router.get('/:id', TaskController.getTaskById);

module.exports = router;