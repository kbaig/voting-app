const jwt = require('jsonwebtoken');

const { expiresIn } = require('../config/jwt-config');
const { TOKEN_SECRET } = process.env;

const options = {
    expiresIn
};

// token creation
const createToken = (payload, callback) => jwt.sign(payload, TOKEN_SECRET, options, callback);

// token verification middleware
const ensureValidToken = (req, res, next) => {
    const authHeader = req.get('Authorization');
    const authHeaderMissing = !authHeader;

    if (authHeaderMissing) return res.sendStatus(401);

    const token = authHeader.match(/^Bearer (.+)$/)[1];

    jwt.verify(token, TOKEN_SECRET, (err, payload) => {
        if (err) {
            // respond with error
            return res.sendStatus(401);
        } else {
            // append user to req
            req.user = payload;            
        }
        next();
    });
}

module.exports = { createToken, ensureValidToken };