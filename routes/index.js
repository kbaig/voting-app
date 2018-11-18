const express = require('express');

const router = express.Router();
const jsonMiddleware = express.json();

// const pollsRouter = require('./polls');
// const pollRouter = require('./poll');

// router.use('/polls', pollsRouter);
// router.use('/poll', pollRouter);

let polls = require('../data/polls');

router.get('/', (req, res) => res.json('Welcome to the API'));

// get the polls
router.get('/polls', (req, res) => {
    res.json(polls);
});

// get a specific poll
router.get('/polls/:id', (req, res) => {
    res.json(polls[req.params.id]);
});

// create a poll
router.post('/polls', jsonMiddleware, (req, res) => {
    const poll = req.body;
    poll.options = poll.options.map(o => ({ name: o, votes: 0 }));
    polls.push(poll);
    res.json(poll);
});

// vote
router.post('/polls/vote/:pollid/:voteid', (req, res) => {
    const { pollid, voteid } = req.params;
    polls[pollid].options[voteid].votes++;

    res.json(polls[pollid]);
});

module.exports = router;