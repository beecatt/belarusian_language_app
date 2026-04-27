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

module.exports = {
    getAllTopics,
    getTopicById
};