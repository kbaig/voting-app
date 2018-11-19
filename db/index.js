require('dotenv').load();

const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

const { DB_USER, DB_PW, MONGO_URI } = process.env;
mongoose.connect(`mongodb://${DB_USER}:${DB_PW}@${MONGO_URI}`, { useNewUrlParser: true });

module.exports = mongoose.connection;