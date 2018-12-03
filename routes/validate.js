const { body, query, validationResult } = require('express-validator/check');

// TODO: add http status code 422
// middleware for throwing validation errors
const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    const errorsExist = !errors.isEmpty();

    if (errorsExist) res.status(422).json({ errors: errors.array({ onlyFirstError: true }) });

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
                        .custom(options => options.length >= 2).withMessage('There must be at least two options')
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
                    .not().isEmpty().withMessage('Name must be a nonempty string')
                    .isLength({ max: 25 }).withMessage('Names cannot be longer than 25 characters')
                    .matches(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/).withMessage(`Names may only contain alphabets, spaces, and the following characters: , . - '`),
                body('email')
                    .exists().withMessage('Enter an email')
                    .isEmail().withMessage('Email must be formatted correctly (e.g. user@example.com)')
                    .trim(),
                body('username')
                    .exists().withMessage('Enter a username')
                    .isString().withMessage('Username must be a string')
                    .trim()
                    .not().isEmpty().withMessage('Username must be a nonempty string')                    
                    .matches(/^[a-zA-Z\d]{4,15}$/).withMessage('Username may only contain alphanumeric characters and be between 4 and 15 characters long'),
                body('password')
                    .exists().withMessage('Enter a password')
                    .isString().withMessage('Password must be a string')
                    .not().isEmpty().withMessage('Password must be a nonempty string')                    
                    .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).withMessage('Password must be at least 8 characters long, and include at least one uppercase letter, lowercase letter, digit, and special character'),
                body('passwordConfirmation')
                    .exists().withMessage('Enter a password confirmation')
                    .isString().withMessage('Password confirmation must be a string')
                    .not().isEmpty().withMessage('Password confirmation must be a nonempty string')
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