const router = require('express').Router();

const polls = require('../data/polls');

router.get('/', (req, res) => {
    res.json(polls);
});

module.exports = router;