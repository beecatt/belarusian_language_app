const express = require('express');
const TaskController = require('../controllers/TaskController');
const authMiddleware = require('../middlewares/authMiddleware');

const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

router.get('/topic/:topicId', TaskController.getTasksByTopicId);
router.get('/:id', TaskController.getTaskById);
router.post('/:id/submit', authMiddleware, TaskController.submitTaskAnswer);

router.post(
    '/',
    authMiddleware,
    roleMiddleware('admin'),
    TaskController.createTask
);

router.put(
    '/:id',
    authMiddleware,
    roleMiddleware('admin'),
    TaskController.updateTask
);

router.delete(
    '/:id',
    authMiddleware,
    roleMiddleware('admin'),
    TaskController.deleteTask
);


module.exports = router;