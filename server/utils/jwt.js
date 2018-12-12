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

    if (authHeaderMissing) return res.status(401).json({ error: 'Unauthorized' });

    const tokenMatch = authHeader.match(/^Bearer (.+)$/);
    const tokenIncorrectlyFormatted = !tokenMatch;

    if (tokenIncorrectlyFormatted) return res.status(401).json({ error: 'Unauthorized' });

    const token = tokenMatch[1];

    jwt.verify(token, TOKEN_SECRET, (error, payload) => {
        if (error) {
            // respond with unauthorized error as token is invalid
            res.status(401).json({ error: 'Unauthorized' });
        }

        // append user to req and move to next middleware
        req.user = payload;            
        next();
    });
}

module.exports = { createToken, ensureValidToken };