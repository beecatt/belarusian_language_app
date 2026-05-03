const db = require('../config/database');

async function getAllTopics() {
    const [rows] = await db.query(
        'SELECT * FROM topics ORDER BY school_class, topic_name'
    );

    return rows;
}

async function getTopicById(topicId) {
    const [rows] = await db.query(
        'SELECT * FROM topics WHERE topic_id = ?',
        [topicId]
    );

    return rows[0];
}

async function createTopic(topicData) {
    const {
        topic_name,
        description,
        school_class,
        difficulty_level
    } = topicData;

    const [result] = await db.query(
        `INSERT INTO topics 
            (topic_name, description, school_class, difficulty_level)
         VALUES (?, ?, ?, ?)`,
        [topic_name, description, school_class, difficulty_level]
    );

    return result.insertId;
}

async function updateTopic(topicId, topicData) {
    const {
        topic_name,
        description,
        school_class,
        difficulty_level
    } = topicData;

    await db.query(
        `UPDATE topics
         SET topic_name = ?,
             description = ?,
             school_class = ?,
             difficulty_level = ?
         WHERE topic_id = ?`,
        [topic_name, description, school_class, difficulty_level, topicId]
    );
}

async function deleteTopic(topicId) {
    await db.query(
        'DELETE FROM topics WHERE topic_id = ?',
        [topicId]
    );
}

module.exports = {
    getAllTopics,
    getTopicById,
    createTopic,
    updateTopic,
    deleteTopic
};