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
    creator_id: mongoose.Schema.Types.ObjectId,
    options: [ optionSchema ]
});

pollSchema.methods.format = function () {
    // return this;
    const poll = this.toObject();

    // rename _id field
    poll.id = poll._id;

    // remove undesired fields
    delete poll._id;
    delete poll.__v;

    // rename _id to id for each option
    poll.options = poll.options.map(option => {
        option.id = option._id;
        delete option._id;
        return option;
    });

    console.log('formmated poll:', poll);
    return poll;
};

const Poll = mongoose.model('Poll', pollSchema);

module.exports = Poll;