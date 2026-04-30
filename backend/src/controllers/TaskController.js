const TaskModel = require('../models/TaskModel');
const TaskResultModel = require('../models/TaskResultModel');
const UserModel = require('../models/UserModel');
const ProgressModel = require('../models/ProgressModel');

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

async function submitTaskAnswer(req, res) {
    try {
        const taskId = req.params.id;
        const userId = req.user.user_id;
        const { answer } = req.body;

        if (!answer) {
            return res.status(400).json({
                message: 'Ответ не передан'
            });
        }

        const task = await TaskModel.getTaskWithAnswerById(taskId);

        if (!task) {
            return res.status(404).json({
                message: 'Задание не найдено'
            });
        }

        const userAnswer = String(answer).trim().toLowerCase();
        const correctAnswer = String(task.correct_answer).trim().toLowerCase();

        const isCorrect = userAnswer === correctAnswer;

        const score = isCorrect ? task.points : 0;
        const completionStatus = isCorrect ? 'correct' : 'incorrect';

        await TaskResultModel.createTaskResult({
            user_id: userId,
            task_id: task.task_id,
            completion_status: completionStatus,
            score
        });

        if (score > 0) {
            await UserModel.addExperiencePoints(userId, score);
        }

        const completedTasksCount = await TaskResultModel.countCompletedTasksByTopic(
            userId,
            task.topic_id
        );

        const totalTasksCount = await TaskModel.countTasksByTopic(task.topic_id);

        const masteryPercent = totalTasksCount > 0
            ? Number(((completedTasksCount / totalTasksCount) * 100).toFixed(2))
            : 0;

        await ProgressModel.upsertProgress({
            user_id: userId,
            topic_id: task.topic_id,
            mastery_percent: masteryPercent,
            completed_tasks_count: completedTasksCount
        });

        res.json({
            message: isCorrect ? 'Ответ правильный' : 'Ответ неправильный',
            is_correct: isCorrect,
            correct_answer: isCorrect ? undefined : task.correct_answer,
            score,
            mastery_percent: masteryPercent,
            completed_tasks_count: completedTasksCount
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Ошибка при проверке задания'
        });
    }
}

module.exports = {
    getTasksByTopicId,
    getTaskById,
    submitTaskAnswer
};