const db = require('../config/database');

async function getUserAchievements(userId) {
    const [rows] = await db.query(
        `SELECT 
            ua.user_achievement_id,
            ua.received_at,
            a.achievement_id,
            a.achievement_name,
            a.description,
            a.condition_text,
            a.bonus_points
         FROM user_achievements ua
         JOIN achievements a ON ua.achievement_id = a.achievement_id
         WHERE ua.user_id = ?
         ORDER BY ua.received_at DESC`,
        [userId]
    );

    return rows;
}

async function giveAchievementIfNotExists(userId, achievementName) {
    const [achievements] = await db.query(
        `SELECT achievement_id, bonus_points
         FROM achievements
         WHERE achievement_name = ?`,
        [achievementName]
    );

    if (achievements.length === 0) {
        return null;
    }

    const achievement = achievements[0];

    const [existing] = await db.query(
        `SELECT user_achievement_id
         FROM user_achievements
         WHERE user_id = ? AND achievement_id = ?`,
        [userId, achievement.achievement_id]
    );

    if (existing.length > 0) {
        return null;
    }

    await db.query(
        `INSERT INTO user_achievements (user_id, achievement_id)
         VALUES (?, ?)`,
        [userId, achievement.achievement_id]
    );

    await db.query(
        `UPDATE users
         SET experience_points = experience_points + ?
         WHERE user_id = ?`,
        [achievement.bonus_points, userId]
    );

    return achievement;
}

module.exports = {
    getUserAchievements,
    giveAchievementIfNotExists
};