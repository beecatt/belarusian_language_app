const express = require('express');
const TopicRouter = require('./TopicRouter');
const TaskRouter = require('./TaskRouter');

const router = express.Router();

router.use('/topics', TopicRouter);
router.use('/tasks', TaskRouter);

module.exports = router;