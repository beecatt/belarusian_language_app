const TaskModel = require('../models/TaskModel');
const TaskResultModel = require('../models/TaskResultModel');
const UserModel = require('../models/UserModel');
const ProgressModel = require('../models/ProgressModel');
const AchievementModel = require('../models/AchievementModel');

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

        const newAchievements = [];

        const totalCompletedTasks = await TaskResultModel.countCorrectOrPartialResultsByUser(userId);

        if (totalCompletedTasks >= 1) {
            const achievement = await AchievementModel.giveAchievementIfNotExists(
                userId,
                'Першы крок'
            );

            if (achievement) {
                newAchievements.push('Першы крок');
            }
        }

        const updatedUser = await UserModel.findUserById(userId);

        if (updatedUser.experience_points >= 100) {
            const achievement = await AchievementModel.giveAchievementIfNotExists(
                userId,
                'Упэўнены старт'
            );

            if (achievement) {
                newAchievements.push('Упэўнены старт');
            }
        }

        if (masteryPercent >= 80) {
            const achievement = await AchievementModel.giveAchievementIfNotExists(
                userId,
                'Знаўца тэмы'
            );

            if (achievement) {
                newAchievements.push('Знаўца тэмы');
            }
        }

        res.json({
            message: isCorrect ? 'Ответ правильный' : 'Ответ неправильный',
            is_correct: isCorrect,
            correct_answer: isCorrect ? undefined : task.correct_answer,
            score,
            mastery_percent: masteryPercent,
            completed_tasks_count: completedTasksCount,
            new_achievements: newAchievements
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Ошибка при проверке задания'
        });
    }
}

async function createTask(req, res) {
    try {
        const {
            topic_id,
            task_text,
            task_type,
            options_json,
            correct_answer,
            difficulty_level,
            points
        } = req.body;

        if (!topic_id || !task_text || !task_type || !correct_answer) {
            return res.status(400).json({
                message: 'Заполните обязательные поля'
            });
        }

        if (!['test', 'open', 'matching', 'fill_in'].includes(task_type)) {
            return res.status(400).json({
                message: 'Некорректный тип задания'
            });
        }

        if (!['easy', 'medium', 'hard'].includes(difficulty_level)) {
            return res.status(400).json({
                message: 'Некорректная сложность'
            });
        }

        const taskId = await TaskModel.createTask({
            topic_id,
            task_text,
            task_type,
            options_json,
            correct_answer,
            difficulty_level,
            points: points || 0
        });

        const task = await TaskModel.getTaskById(taskId);

        res.status(201).json({
            message: 'Задание создано',
            task
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Ошибка при создании задания'
        });
    }
}

async function updateTask(req, res) {
    try {
        const taskId = req.params.id;

        const existing = await TaskModel.getTaskById(taskId);

        if (!existing) {
            return res.status(404).json({
                message: 'Задание не найдено'
            });
        }

        await TaskModel.updateTask(taskId, req.body);

        const updated = await TaskModel.getTaskById(taskId);

        res.json({
            message: 'Задание обновлено',
            task: updated
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Ошибка при обновлении задания'
        });
    }
}

async function deleteTask(req, res) {
    try {
        const taskId = req.params.id;

        const existing = await TaskModel.getTaskById(taskId);

        if (!existing) {
            return res.status(404).json({
                message: 'Задание не найдено'
            });
        }

        await TaskModel.deleteTask(taskId);

        res.json({
            message: 'Задание удалено'
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Ошибка при удалении задания'
        });
    }
}

module.exports = {
    getTasksByTopicId,
    getTaskById,
    submitTaskAnswer,
    createTask,
    updateTask,
    deleteTask
};