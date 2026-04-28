const express = require('express');

const AuthRouter = require('./AuthRouter');
const TopicRouter = require('./TopicRouter');
const TaskRouter = require('./TaskRouter');

const router = express.Router();

router.use('/auth', AuthRouter);
router.use('/topics', TopicRouter);
router.use('/tasks', TaskRouter);

module.exports = router;