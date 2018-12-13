const { body, query, validationResult } = require('express-validator/check');

const User = require('../schema/user');

// middleware for throwing validation errors
const handleValidation = (req, res, next) => {
    const errors = validationResult(req).formatWith(error => error.msg);
    const errorsExist = !errors.isEmpty();

    if (errorsExist) return res.status(422).json({ error: errors.mapped() });

    next();
};

// return middleware for validating given route
const validateMethod = method => {
    switch (method) {
        case 'createPoll':
            return [
                body('name')
                    .exists().withMessage('Enter a name')
                    .isString().withMessage('Name must be a string')
                    .trim()
                    .not().isEmpty().withMessage('Name must be a nonempty string'),
                body('options')
                    .exists().withMessage('Enter some options')
                    .isArray().withMessage('Options must be an array'),
                    body('options.*')
                        .isString().withMessage('Options must only contains strings')
                        .trim()
                        .not().isEmpty().withMessage('Options cannot contain nonempty strings'),
                    body('options')
                        .custom(options => options.length >= 2).withMessage('There must be at least two options'),
                    body('options.*')
                        .customSanitizer(option => ({ name: option }) )                        
            ];
        case 'addPollOption':
            return [
                query('option')
                    .exists().withMessage('Enter an option')
                    .isString().withMessage('Option must be a string')
                    .trim()
                    .not().isEmpty().withMessage('Option must be a nonempty string')
            ];
        case 'signup':
            return [
                body('name')
                    .exists().withMessage('Enter a name')
                    .isString().withMessage('Name must be a string')
                    .trim()
                    .not().isEmpty().withMessage('Enter a name')
                    .isLength({ max: 25 }).withMessage('Cannot be longer than 25 characters')
                    .matches(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/).withMessage('Invalid characters used'),
                body('email')
                    .exists().withMessage('Enter an email')
                    .isEmail().withMessage('Email formatted incorrectly')
                    .trim()
                    .custom(async email => {
                        const preexistingUsers = await User.find({ email });
                        return preexistingUsers.length === 0;
                    }).withMessage('Email already taken'),
                body('username')
                    .exists().withMessage('Enter a username')
                    .isString().withMessage('Username must be a string')
                    .trim()
                    .not().isEmpty().withMessage('Enter a username')
                    .isLength({ min: 4 }).withMessage('Must be at least 4 characters')
                    .isLength({ max: 15 }).withMessage('Cannot be longer than 15 characters')
                    .matches(/^[a-zA-Z\d]{4,15}$/).withMessage('Only aphanumeric characters are permitted')
                    .custom(async username => {
                        const preexistingUsers = await User.find({ username });
                        return preexistingUsers.length === 0;
                    }).withMessage('Username already taken'),
                body('password')
                    .exists().withMessage('Enter a password')
                    .isString().withMessage('Password must be a string')
                    .not().isEmpty().withMessage('Enter a password')                    
                    .isLength({ min: 8 }).withMessage('Must be at least 8 characters')
                    .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*~-]).{8,}$/).withMessage('Does not meet requirements'),
                body('passwordConfirmation')
                    .exists().withMessage('Please confirm password')
                    .isString().withMessage('Password confirmation must be a string')
                    .not().isEmpty().withMessage('Please confirm password')
                    .custom((confirmation, { req }) => confirmation === req.body.password).withMessage('Password and password confirmation do not match')
            ];
        case 'login':
            return [
                body('username')
                    .exists().withMessage('Enter a username')
                    .isString().withMessage('Username must be a string')
                    .trim(),
                body('password')
                    .exists().withMessage('Enter a password')
                    .isString().withMessage('Password must be a string')
            ];
    }
};


// return method validation with validation handling appended
module.exports = method => [...validateMethod(method), handleValidation];