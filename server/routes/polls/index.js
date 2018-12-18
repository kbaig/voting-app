const express = require('express');
const router = express.Router();
const jsonBodyMiddleware = express.json();

const ObjectId = require('mongoose').Types.ObjectId;

const Poll = require('../../schema/poll');

const { ensureValidToken } = require('../../utils/jwt');
const validate = require('../../utils/validate');

// get the polls
router.get('/', async (req, res) => {
    try {
        const unformattedPolls = await Poll.find({});
        const polls = unformattedPolls.map(poll => poll.format());
        res.json({ polls });
    } catch (error) {
        console.log({ error });
        res.status(500).json({ error: 'Internal server error occurred' });
    }    
});

// TODO: validate id as objectid and consider case where no poll for given id
// get a specific poll
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const unformattedPoll = await Poll.findById(id);
        const poll = unformattedPoll.format();
        res.json({ poll });
    } catch (error) {
        console.log({ error });
        res.status(500).json({ error: 'Internal server error occurred' });
    }

});

// TODO: validate id as objectid and consider case where no user for given id
// get all polls created by a specific user
router.get('/user/:id', async (req, res) => {
    const creator_id = ObjectId(req.params.id);

    try {
        const unformattedPolls = await Poll.find({ creator_id });
        const polls = unformattedPolls.map(poll => poll.format());
        res.json({ polls });
    } catch (error) {
        console.log({ error });
        res.status(500).json({ error: 'Internal server error occurred' });
    }

});

// create a poll
router.post('/', ensureValidToken, jsonBodyMiddleware, validate('createPoll'), async (req, res) => {
    const recievedPoll = req.body;

    // add creator_id
    recievedPoll.creator_id = req.user.id;
    
    try {
        const unformattedPoll = await Poll.create(recievedPoll);
        const poll = unformattedPoll.format();
        res.json({ poll });
    } catch (error) {
        console.log({ error });
        res.status(500).json({ error: 'Internal server error occurred' });
    }

});

// TODO: validate pollid as objectid and consider what happens when poll doesn't exist with given pollid
// delete a poll
router.delete('/:pollId', ensureValidToken, async (req, res) => {
    console.log(req.user);
    const _id = ObjectId(req.params.pollId);
    const creator_id = ObjectId(req.user.id);

    try {
        const unformattedPoll = await Poll.findOneAndDelete({ _id, creator_id });
        const deletedPoll = unformattedPoll.format();
        res.json({ deletedPoll });
    } catch (error) {
        console.log({ error });
        res.status(500).json({ error: 'Internal server error occurred' });
    }
    
});

// TODO: validate pollid and optionid as objectid and case for nonexistence
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
        console.log('error:', error);
        res.status(500).json({ error: 'Internal server error occurred' });
    }

});

// TODO: validate objectids and make sure poll exists
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
        console.log('error:', error);
        res.status(500).json({ error: 'Internal server error occurred' });
    }

});

module.exports = router;