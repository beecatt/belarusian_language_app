const db = require('../config/database');

async function getTasksByTopicId(topicId) {
    const [rows] = await db.query(
        `SELECT 
            task_id,
            topic_id,
            task_text,
            task_type,
            options_json,
            difficulty_level,
            points
         FROM tasks
         WHERE topic_id = ?
         ORDER BY task_id`,
        [topicId]
    );

    return rows;
}

async function getTaskById(taskId) {
    const [rows] = await db.query(
        `SELECT 
            task_id,
            topic_id,
            task_text,
            task_type,
            options_json,
            difficulty_level,
            points
         FROM tasks
         WHERE task_id = ?`,
        [taskId]
    );

    return rows[0];
}

async function getTaskWithAnswerById(taskId) {
    const [rows] = await db.query(
        'SELECT * FROM tasks WHERE task_id = ?',
        [taskId]
    );

    return rows[0];
}

module.exports = {
    getTasksByTopicId,
    getTaskById,
    getTaskWithAnswerById
};