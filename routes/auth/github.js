const express = require('express');
const router = express.Router();
const jsonBodyMiddleware = express.json();

const queryString = require('query-string');
const fetch = require('node-fetch');

const User = require('../../schema/user');

const GitHubConfig = require('../../config/github-config');

// begin github auth process
router.get('/', (req, res) => {
    const query = queryString.stringify({
        client_id: GitHubConfig.clientID,
        redirect_uri: GitHubConfig.callbackURL,
        scope: GitHubConfig.scope
    });
    res.redirect(`https://github.com/login/oauth/authorize?${query}`);
});

// use github login code to get user profile and return jwt
router.post('/', jsonBodyMiddleware, async (req, res) => {
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
        const user = await User.githubUpdateOrCreate({ github_id, github_login, name, email, avatar });
        
        // format, tokenize, and send
        user.formatAndTokenize((error, token) => {
            if (error) {
                console.log('error:', error);
                res.json({ error });
            } else {
                console.log('token:', token);
                res.json({ token });
            }
        });
    } catch (error) {
        console.log('error:', error);
        res.json({ error });
    }
});

module.exports = router;