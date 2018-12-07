require('dotenv').load();

const express = require('express');
const db = require('./server/db');

const apiRouter = require('./server/routes');

const app = express();
const port = 3001;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE");
    next();
});

app.get('/', (req, res) => res.json(`welcome to the back end server on port ${port}`));

app.use('/api', apiRouter);

app.listen(port, () => console.log(`App listening on port ${port}`));