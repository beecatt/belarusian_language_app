const express = require('express');

const AuthRouter = require('./AuthRouter');
const TopicRouter = require('./TopicRouter');
const TaskRouter = require('./TaskRouter');
const ProgressRouter = require('./ProgressRouter');

const router = express.Router();

router.use('/auth', AuthRouter);
router.use('/topics', TopicRouter);
router.use('/tasks', TaskRouter);
router.use('/progress', ProgressRouter);

module.exports = router;