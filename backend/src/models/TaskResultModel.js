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

async function countCorrectOrPartialResultsByUser(userId) {
    const [rows] = await db.query(
        `SELECT COUNT(*) AS total_count
         FROM task_results
         WHERE user_id = ?
           AND completion_status IN ('correct', 'partial')`,
        [userId]
    );

    return rows[0].total_count;
}

async function hasSuccessfulResult(userId, taskId) {
    const [rows] = await db.query(
        `SELECT result_id
         FROM task_results
         WHERE user_id = ?
           AND task_id = ?
           AND completion_status IN ('correct', 'partial')
         LIMIT 1`,
        [userId, taskId]
    );

    return rows.length > 0;
}


module.exports = {
    createTaskResult,
    countCompletedTasksByTopic,
    countCorrectOrPartialResultsByUser,
    hasSuccessfulResult
};