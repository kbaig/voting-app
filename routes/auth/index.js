const router = require('express').Router();
const queryString = require('query-string');
const jsonBodyMiddleware = require('express').json();
const fetch = require('node-fetch');
// const ObjectId = require('mongoose').Types.ObjectId;

const User = require('../../db/schema/user');
const createToken = require('./createToken');

const GitHubConfig = {
    clientID: '3a131bf62bd53c407b42',
    clientSecret: 'cdb144a621b89a267888c9dfebb43810830fb418',
    callbackURL: 'http://localhost:3000/',
    scope: 'read:user'
};

router.get('/github', (req, res) => {
    const query = queryString.stringify({
        client_id: GitHubConfig.clientID,
        redirect_uri: GitHubConfig.callbackURL,
        scope: GitHubConfig.scope
    });
    res.redirect(`https://github.com/login/oauth/authorize?${query}`)
});

router.post('/github/', jsonBodyMiddleware, async (req, res) => {
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
        console.log('error: ', error);
        res.json('there was an error');
    }
});


module.exports = router;