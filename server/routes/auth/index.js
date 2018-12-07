const router = require('express').Router();

const githubRouter = require('./github');
const basicRouter = require('./basic');

router.use('/github', githubRouter);
router.use('/basic', basicRouter);

module.exports = router;