const router = require('express').Router();
const queryString = require('query-string');
const jsonBodyMiddleware = require('express').json();
const fetch = require('node-fetch');
// const ObjectId = require('mongoose').Types.ObjectId;

const User = require('../../db/schema/user');
const createToken = require('./createToken');
const { encrypt, comparePasswords } = require('./encryption');

const GitHubConfig = {
    clientID: '3a131bf62bd53c407b42',
    clientSecret: 'cdb144a621b89a267888c9dfebb43810830fb418',
    callbackURL: 'http://localhost:3000/',
    scope: 'read:user'
};

// begin github auth process
router.get('/github', (req, res) => {
    const query = queryString.stringify({
        client_id: GitHubConfig.clientID,
        redirect_uri: GitHubConfig.callbackURL,
        scope: GitHubConfig.scope
    });
    res.redirect(`https://github.com/login/oauth/authorize?${query}`)
});

// use github login code to get user profile and return jwt
router.post('/github', jsonBodyMiddleware, async (req, res) => {
    try {
        // exchange code for token
        const tokenQuery = queryString.stringify({
            client_id: GitHubConfig.clientID,
            client_secret: GitHubConfig.clientSecret,
            code: req.body.code
        });
        const tokenResponse = await fetch(`https://github.com/login/oauth/access_token?${tokenQuery}`, {
            method: 'POST',
            headers: { Accept: 'application/json' }
        });
        const tokenData = await tokenResponse.json();

        // use token to get user data
        const { access_token } = tokenData;
        const userQuery = queryString.stringify({ access_token });
        const userResponse = await fetch(`https://api.github.com/user?${userQuery}`);
        const userData = await userResponse.json();

        // create or update user in db
        const {
            id: github_id,
            login: github_login,
            name,
            email,
            avatar_url: avatar
        } = userData;
        const payloadDoc = await User.githubUpdateOrCreate({ github_id, github_login, name, email, avatar });
        
        // create jwt
        const payload = payloadDoc.toObject();
        const token = createToken(payload);
        console.log('token: ', token);

        // send jwt as response
        res.json(token);
    } catch (error) {
        console.log('error:', error);
        res.json('there was an error');
    }
});

// process sign up form
router.post('/signup', jsonBodyMiddleware, async (req, res) => {
    const { name, email, username, password } = req.body;

    try {
        // check if username or email are taken
        const preexistingUsers = await User.find({ $or: [{ email }, { username }] });
        if (preexistingUsers.length > 0) {
            return res.json({error: 'email or username already taken'});
        }

        // encrypt password
        const encrypted_password = await encrypt(password);

        // create account
        const user = await User.create({ name, email, username, encrypted_password });

        // create jwt
        const payload = user.toObject();
        const token = createToken(payload);

        // send jwt as response
        res.json({ token });
    } catch (error) {
        console.log('error:', error);
        res.json({ error });
    }
});

// log users in
router.post('/login', jsonBodyMiddleware, async (req, res) => {
    const { username, password } = req.body;

    try {
        // attempt to get user
        const user = await User.findOne({ username });
        const userExists = !!user;

        if (userExists) {
            // compare passwords
            const passwordsMatch = await comparePasswords(password, user.encrypted_password);

            if (passwordsMatch) {
                // create jwt
                const payload = user.toObject();
                const token = createToken(payload);

                // send jwt as response
                return res.json({ token });
            }
        }

        // respond with error if user doesn't exist and/or passwords don't match
        res.json({ error: 'invalid username or password' });

    } catch (error) {
        console.log('error:', error);
        res.json({ error });
    }
});


module.exports = router;