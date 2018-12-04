const express = require('express');
const router = express.Router();
const jsonBodyMiddleware = express.json();

const User = require('../../schema/user');

const { encrypt, comparePasswords } = require('../../utils/encryption');
const validate = require('../validate');

// process sign up form
router.post('/signup', jsonBodyMiddleware, validate('signup'), async (req, res) => {
    // also requires a passwordConfirmation field, but that is used in form validation
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
        res.status(500).json({ error: 'Internal server error occurred' });
    }
});

// log user in
router.post('/login', jsonBodyMiddleware, validate('login'), async (req, res) => {
    const { username, password } = req.body;

    try {
        // attempt to get user
        const user = await User.findOne({ username });
        const userExists = !!user;
        
        if (userExists) {
            // compare passwords
            const passwordsMatch = await comparePasswords(password, user.encrypted_password);
            
            if (passwordsMatch) {
                // format, tokenize, and send
                user.formatAndTokenize((error, token) => {
                    if (error) {
                        console.log(error);
                        res.json({ error });
                    } else {
                        console.log({ token });
                        res.json({ token })
                    }
                });
            } else {
                // respond with error if passwords don't match
                console.log('error:', 'invalid username or password');
                res.json({ error: 'invalid username or password' });
            }
        } else {
            // respond with error if user doesn't exist
            console.log('error:', 'invalid username or password');
            res.json({ error: 'invalid username or password' });
        }

    } catch (error) {
        console.log('error:', error);
        res.status(500).json({ error: 'Internal server error occurred' });
    }
});

module.exports = router;