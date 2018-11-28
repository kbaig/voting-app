const jwt = require('jsonwebtoken');

const secret = 'secret';
const options = {
    expiresIn: '1h'
};

const createToken = payload => jwt.sign(payload, secret, options);

module.exports = createToken;