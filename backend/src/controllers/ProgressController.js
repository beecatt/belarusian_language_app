const ProgressModel = require('../models/ProgressModel');
const AchievementModel = require('../models/AchievementModel');

async function getMyProgress(req, res) {
    try {
        const userId = req.user.user_id;

        const progress = await ProgressModel.getUserProgress(userId);

        res.json(progress);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Ошибка при получении прогресса'
        });
    }
}

async function getMyAchievements(req, res) {
    try {
        const userId = req.user.user_id;

        const achievements = await AchievementModel.getUserAchievements(userId);

        res.json(achievements);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Ошибка при получении достижений'
        });
    }
}

module.exports = {
    getMyProgress,
    getMyAchievements
};