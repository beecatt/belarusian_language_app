const db = require('../config/database');

async function createTaskResult(resultData) {
    const {
        user_id,
        task_id,
        completion_status,
        score
    } = resultData;

    const [result] = await db.query(
        `INSERT INTO task_results 
            (user_id, task_id, completion_status, score)
         VALUES (?, ?, ?, ?)`,
        [user_id, task_id, completion_status, score]
    );

    return result.insertId;
}

async function countCompletedTasksByTopic(userId, topicId) {
    const [rows] = await db.query(
        `SELECT COUNT(DISTINCT tr.task_id) AS completed_count
         FROM task_results tr
         JOIN tasks t ON tr.task_id = t.task_id
         WHERE tr.user_id = ?
           AND t.topic_id = ?
           AND tr.completion_status IN ('correct', 'partial')`,
        [userId, topicId]
    );

    return rows[0].completed_count;
}

module.exports = {
    createTaskResult,
    countCompletedTasksByTopic
};