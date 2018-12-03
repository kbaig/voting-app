const express = require('express');
const router = express.Router();
const jsonBodyMiddleware = express.json();

const ObjectId = require('mongoose').Types.ObjectId;

const Poll = require('../../schema/poll');

const { ensureValidToken } = require('../../utils/jwt');
const validate = require('../validate');

// get the polls
router.get('/', async (req, res) => {
    try {
        const unformattedPolls = await Poll.find({});
        const polls = unformattedPolls.map(poll => poll.format());
        res.json({ polls });
    } catch (error) {
        res.json({ error });
    }    
});

// get a specific poll
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const unformattedPoll = await Poll.findById(id);
        const poll = unformattedPoll.format();
        res.json({ poll });
    } catch (error) {
        res.json({ error });
    }

});

// get all polls created by a specific user
router.get('/user/:id', async (req, res) => {
    const creator_id = ObjectId(req.params.id);

    try {
        const unformattedPolls = await Poll.find({ creator_id });
        const polls = unformattedPolls.map(poll => poll.format());
        res.json({ polls });
    } catch (error) {
        res.json({ error });
    }

});

// create a poll
router.post('/', ensureValidToken, jsonBodyMiddleware, validate('createPoll'), async (req, res) => {
    const recievedPoll = req.body;

    // add creator_id
    recievedPoll.creator_id = req.user.id;

    // shape options into how schema expects it
    recievedPoll.options = recievedPoll.options.map(o => ({ name: o }));
    
    try {
        const unformattedPoll = await Poll.create(recievedPoll);
        const poll = unformattedPoll.format();
        res.json({ poll });
    } catch (error) {
        res.json({ error });
    }

});

// delete a poll
router.delete('/:pollId', ensureValidToken, async (req, res) => {
    console.log(req.user);
    const _id = ObjectId(req.params.pollId);
    const creator_id = ObjectId(req.user.id);

    try {
        const unformattedPoll = await Poll.findOneAndDelete({ _id, creator_id });
        const poll = unformattedPoll.format();
        res.json({ poll });
    } catch (error) {
        res.json({ error });
    }
    
});

// TODO: do something about infinite voting (nonce)
// vote
router.post('/vote/:pollId/:optionId', async (req, res) => {
    const pollId = ObjectId(req.params.pollId);
    const optionId = ObjectId(req.params.optionId);

    try {
        const unformattedPoll = await Poll.findOneAndUpdate(
            { _id: pollId },
            { $inc: { "options.$[option].votes": 1 } },
            {
                arrayFilters: [{ "option._id": { $eq: optionId } }],
                new: true
            }
        );
        const poll = unformattedPoll.format();
        res.json({ poll });
    } catch (error) {
        res.json({ error });
    }

});

// add an option to a poll
router.post('/add-option/:pollId', ensureValidToken, validate('addPollOption'), async (req, res) => {
    console.log('req.user:', req.user);
    const pollId = ObjectId(req.params.pollId);
    const { option } = req.query;

    try {
        const unformattedPoll = await Poll.findOneAndUpdate(
            { _id: pollId },
            { $push: { options: { name: option } } },
            { new: true }
        );
        const poll = unformattedPoll.format();
        res.json({ poll });
    } catch (error) {
        res.json({ error });
    }

});

module.exports = router;