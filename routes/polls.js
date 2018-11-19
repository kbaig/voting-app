const express = require('express');
const mongoose = require('mongoose');

const Poll = require('../db/schema/poll');

const router = express.Router();
const jsonMiddleware = express.json();

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

// create a poll
router.post('/', jsonMiddleware, async (req, res) => {
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

// vote
router.post('/vote/:pollid/:optionid', async (req, res) => {
    const pollid = mongoose.Types.ObjectId(req.params.pollid);
    const optionid = mongoose.Types.ObjectId(req.params.optionid);

    try {
        const poll = await Poll.findOneAndUpdate(
            { _id: pollid },
            { $inc: { "options.$[option].votes": 1 } },
            {
                arrayFilters: [{ "option._id": { $eq: optionid } }],
                new: true
            }
        );
        res.json(poll);
    } catch (err) {
        res.json(err);
    }    
});

module.exports = router;