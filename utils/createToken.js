const jwt = require('jsonwebtoken');

const { TOKEN_SECRET } = process.env;
const options = {
    expiresIn: '1h'
};

const createToken = payload => jwt.sign(payload, TOKEN_SECRET, options);

module.exports = createToken;