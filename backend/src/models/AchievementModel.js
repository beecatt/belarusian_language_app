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

module.exports = {
    getUserAchievements
};