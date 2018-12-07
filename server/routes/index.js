const router = require('express').Router();

const pollsRouter = require('./polls');
const authRouter = require('./auth');

router.get('/', (req, res) => res.json('Welcome to the API'));
router.use('/polls', pollsRouter);
router.use('/auth', authRouter);

module.exports = router;