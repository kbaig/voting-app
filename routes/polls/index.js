const express = require('express');
const router = express.Router();
const jsonBodyMiddleware = express.json();

const ObjectId = require('mongoose').Types.ObjectId;

const Poll = require('../../schema/poll');

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


// TODO: add form validation and authentication protection
// TODO: add attribution for created polls
// create a poll
router.post('/', jsonBodyMiddleware, async (req, res) => {
    const recievedPoll = req.body;

    // shape data into how schema expects it
    recievedPoll.options = recievedPoll.options.map(o => ({ name: o }));
   
    try {
        const unformattedPoll = await Poll.create(recievedPoll);
        const poll = unformattedPoll.format();
        res.json({ poll });
    } catch (error) {
        res.json({ error });
    }
});

// TODO: add authentication protection
// delete a poll
router.delete('/:pollId', async (req, res) => {
    const { pollId } = req.params;

    try {
        const unformattedPoll = await Poll.findByIdAndDelete(ObjectId(pollId));
        const poll = unformattedPoll.format();
        res.json({ poll });
    } catch (error) {
        res.json({ error });
    }
    
});

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

// TODO: add form validation and authentication protection
// add an option to a poll
router.post('/add-option/:pollId', async (req, res) => {
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