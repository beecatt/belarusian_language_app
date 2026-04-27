const express = require('express');
const TopicRouter = require('./TopicRouter');

const router = express.Router();

router.use('/topics', TopicRouter);

module.exports = router;