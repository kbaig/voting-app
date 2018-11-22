const router = require('express').Router();
const passport = require('./passport');


router.get('/github', passport.authenticate('github'));

router.get(
    '/github/callback',
    passport.authenticate('github', { failureRedirect: 'http://localhost:3000/login' }),
    (req, res) => {
        console.log({ "req.user": req.user });
        res.redirect('http://localhost:3000/');
    }
);


module.exports = router;