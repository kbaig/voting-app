const express = require('express');
const ObjectId = require('mongoose').Types.ObjectId;

const Poll = require('../../db/schema/poll');

const router = express.Router();
const jsonBodyMiddleware = express.json();

// get the polls
router.get('/', async (req, res) => {
    try {
        const polls = await Poll.find({});
        res.json(polls);
    } catch (err) {
        res.json(err);
    }    
});

// get a specific poll
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const poll = await Poll.findById(id);
        res.json(poll);
    } catch (err) {
        res.json(err);
    }
});

// get all polls created by a specific user
router.get('/user/:id', async (req, res) => {
    const creator_id = ObjectId(req.params.id);
    try {
        const polls = await Poll.find({ creator_id });
        res.json(polls);
    } catch (err) {
        res.json(err);
    }
});

// create a poll
router.post('/', jsonBodyMiddleware, async (req, res) => {
    const recievedPoll = req.body;

    // shape data into how schema expects it
    recievedPoll.options = recievedPoll.options.map(o => ({ name: o }));
   
    try {
        const poll = await Poll.create(recievedPoll);
        res.json(poll);
    } catch (err) {
        res.json(err);
    }
});

// delete a poll and return it
router.delete('/:pollId', async (req, res) => {
    const { pollId } = req.params;

    try {
        const poll = await Poll.findByIdAndDelete(ObjectId(pollId));
        res.json(poll);
    } catch (err) {
        res.json(error);
    }
    
});

// vote
router.post('/vote/:pollId/:optionId', async (req, res) => {
    const pollId = ObjectId(req.params.pollId);
    const optionId = ObjectId(req.params.optionId);

    try {
        const poll = await Poll.findOneAndUpdate(
            { _id: pollId },
            { $inc: { "options.$[option].votes": 1 } },
            {
                arrayFilters: [{ "option._id": { $eq: optionId } }],
                new: true
            }
        );
        res.json(poll);
    } catch (err) {
        res.json(err);
    }

});

// add an option to a poll
router.post('/add-option/:pollId', async (req, res) => {
    const pollId = ObjectId(req.params.pollId);
    const { option } = req.query;

    try {
        const poll = await Poll.findOneAndUpdate(
            { _id: pollId },
            { $push: { options: { name: option } } },
            { new: true }
        );
        res.json(poll);
    } catch (err) {
        res.json(err);
    }

});

module.exports = router;