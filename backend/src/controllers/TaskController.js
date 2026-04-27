const TaskModel = require('../models/TaskModel');

async function getTasksByTopicId(req, res) {
    try {
        const topicId = req.params.topicId;

        const tasks = await TaskModel.getTasksByTopicId(topicId);

        res.json(tasks);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Ошибка при получении заданий темы'
        });
    }
}

async function getTaskById(req, res) {
    try {
        const taskId = req.params.id;

        const task = await TaskModel.getTaskById(taskId);

        if (!task) {
            return res.status(404).json({
                message: 'Задание не найдено'
            });
        }

        res.json(task);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Ошибка при получении задания'
        });
    }
}

module.exports = {
    getTasksByTopicId,
    getTaskById
};