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

async function createTopic(req, res) {
    try {
        const {
            topic_name,
            description,
            school_class,
            difficulty_level
        } = req.body;

        if (!topic_name || !school_class || !difficulty_level) {
            return res.status(400).json({
                message: 'Заполните название темы, класс и уровень сложности'
            });
        }

        if (school_class < 1 || school_class > 11) {
            return res.status(400).json({
                message: 'Класс должен быть от 1 до 11'
            });
        }

        if (!['easy', 'medium', 'hard'].includes(difficulty_level)) {
            return res.status(400).json({
                message: 'Некорректный уровень сложности'
            });
        }

        const topicId = await TopicModel.createTopic({
            topic_name,
            description,
            school_class,
            difficulty_level
        });

        const topic = await TopicModel.getTopicById(topicId);

        res.status(201).json({
            message: 'Тема создана',
            topic
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Ошибка при создании темы'
        });
    }
}

async function updateTopic(req, res) {
    try {
        const topicId = req.params.id;

        const existingTopic = await TopicModel.getTopicById(topicId);

        if (!existingTopic) {
            return res.status(404).json({
                message: 'Тема не найдена'
            });
        }

        const {
            topic_name,
            description,
            school_class,
            difficulty_level
        } = req.body;

        if (!topic_name || !school_class || !difficulty_level) {
            return res.status(400).json({
                message: 'Заполните название темы, класс и уровень сложности'
            });
        }

        if (school_class < 1 || school_class > 11) {
            return res.status(400).json({
                message: 'Класс должен быть от 1 до 11'
            });
        }

        if (!['easy', 'medium', 'hard'].includes(difficulty_level)) {
            return res.status(400).json({
                message: 'Некорректный уровень сложности'
            });
        }

        await TopicModel.updateTopic(topicId, {
            topic_name,
            description,
            school_class,
            difficulty_level
        });

        const updatedTopic = await TopicModel.getTopicById(topicId);

        res.json({
            message: 'Тема обновлена',
            topic: updatedTopic
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Ошибка при обновлении темы'
        });
    }
}

async function deleteTopic(req, res) {
    try {
        const topicId = req.params.id;

        const existingTopic = await TopicModel.getTopicById(topicId);

        if (!existingTopic) {
            return res.status(404).json({
                message: 'Тема не найдена'
            });
        }

        await TopicModel.deleteTopic(topicId);

        res.json({
            message: 'Тема удалена'
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Ошибка при удалении темы'
        });
    }
}

module.exports = {
    getAllTopics,
    getTopicById,
    createTopic,
    updateTopic,
    deleteTopic
};