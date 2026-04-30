const express = require('express');
const TaskController = require('../controllers/TaskController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/topic/:topicId', TaskController.getTasksByTopicId);
router.get('/:id', TaskController.getTaskById);
router.post('/:id/submit', authMiddleware, TaskController.submitTaskAnswer);


module.exports = router;