const GitHubStrategy = require('passport-github').Strategy;

const GitHubConfig = {
    clientID: '3a131bf62bd53c407b42',
    clientSecret: 'cdb144a621b89a267888c9dfebb43810830fb418',
    callbackURL: 'http://localhost:3001/api/auth/github/callback'
};

const strategy = new GitHubStrategy(GitHubConfig, (accessToken, refreshToken, profile, done) => {
    console.log({ accessToken, refreshToken, profile, done });
    return done(null, profile);
});

module.exports = strategy;

