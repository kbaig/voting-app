const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
    name: String,
    votes: {
        type: Number,
        default: 0
    } 
});

const pollSchema = new mongoose.Schema({
    name: String,
    options: [ optionSchema ]
});

const Poll = mongoose.model('Poll', pollSchema);

module.exports = Poll;