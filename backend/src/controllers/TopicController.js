const TopicModel = require('../models/TopicModel');

async function getAllTopics(req, res) {
    try {
        const topics = await TopicModel.getAllTopics();

        res.json(topics);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Ошибка при получении тем'
        });
    }
}

async function getTopicById(req, res) {
    try {
        const topicId = req.params.id;

        const topic = await TopicModel.getTopicById(topicId);

        if (!topic) {
            return res.status(404).json({
                message: 'Тема не найдена'
            });
        }

        res.json(topic);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Ошибка при получении темы'
        });
    }
}

module.exports = {
    getAllTopics,
    getTopicById
};