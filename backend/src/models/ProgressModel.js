const db = require('../config/database');

async function upsertProgress(progressData) {
    const {
        user_id,
        topic_id,
        mastery_percent,
        completed_tasks_count
    } = progressData;

    await db.query(
        `INSERT INTO progress 
            (user_id, topic_id, mastery_percent, completed_tasks_count)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
            mastery_percent = VALUES(mastery_percent),
            completed_tasks_count = VALUES(completed_tasks_count),
            updated_at = CURRENT_TIMESTAMP`,
        [user_id, topic_id, mastery_percent, completed_tasks_count]
    );
}
    async function getUserProgress(userId) {
        const [rows] = await db.query(
            `SELECT 
            p.progress_id,
            p.user_id,
            p.topic_id,
            t.topic_name,
            t.school_class,
            t.difficulty_level,
            p.mastery_percent,
            p.completed_tasks_count,
            p.updated_at
         FROM progress p
         JOIN topics t ON p.topic_id = t.topic_id
         WHERE p.user_id = ?
         ORDER BY t.school_class, t.topic_name`,
            [userId]
        );

        return rows;
    }



module.exports = {
    upsertProgress,
    getUserProgress
};