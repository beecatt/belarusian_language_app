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

module.exports = {
    upsertProgress
};