const passport = require('passport');
const GitHubStrategy = require('./github');

passport.use(GitHubStrategy);

module.exports = passport;