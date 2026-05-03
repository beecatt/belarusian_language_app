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

async function countTasksByTopic(topicId) {
    const [rows] = await db.query(
        `SELECT COUNT(*) AS total_count
         FROM tasks
         WHERE topic_id = ?`,
        [topicId]
    );

    return rows[0].total_count;
}

async function createTask(taskData) {
    const {
        topic_id,
        task_text,
        task_type,
        options_json,
        correct_answer,
        difficulty_level,
        points
    } = taskData;

    const [result] = await db.query(
        `INSERT INTO tasks 
            (topic_id, task_text, task_type, options_json, correct_answer, difficulty_level, points)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            topic_id,
            task_text,
            task_type,
            options_json ? JSON.stringify(options_json) : null,
            correct_answer,
            difficulty_level,
            points
        ]
    );

    return result.insertId;
}

async function updateTask(taskId, taskData) {
    const {
        topic_id,
        task_text,
        task_type,
        options_json,
        correct_answer,
        difficulty_level,
        points
    } = taskData;

    await db.query(
        `UPDATE tasks
         SET topic_id = ?,
             task_text = ?,
             task_type = ?,
             options_json = ?,
             correct_answer = ?,
             difficulty_level = ?,
             points = ?
         WHERE task_id = ?`,
        [
            topic_id,
            task_text,
            task_type,
            options_json ? JSON.stringify(options_json) : null,
            correct_answer,
            difficulty_level,
            points,
            taskId
        ]
    );
}

async function deleteTask(taskId) {
    await db.query(
        'DELETE FROM tasks WHERE task_id = ?',
        [taskId]
    );
}


module.exports = {
    getTasksByTopicId,
    getTaskById,
    getTaskWithAnswerById,
    countTasksByTopic,
    createTask,
    updateTask,
    deleteTask
};