import { isEmpty, isLength, matches, isEmail, equals } from 'validator';

const validate = (attr, val, prevForm) => {
    switch (attr) {
        case 'name':
            val = val.trim();
            if (isEmpty(val)) {
                return 'Enter a name';
            } else if (!isLength(val, { max: 25 })) {
                return 'Cannot be longer than 25 characters';
            } else if (!matches(val, /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/)) {
                return 'Invalid characters used';
            }
            break;

        case 'email':
            val = val.trim();
            if (isEmpty(val)) {
                return 'Enter an email';
            } else if (!isEmail(val)) {
                return 'Email formatted incorrectly';
            }
            break;

        case 'username':
            val = val.trim();
            if (isEmpty(val)) {
                return 'Enter a username';
            } else if (!isLength(val, { min: 4 })) {
                return 'Must be at least 4 characters';
            } else if (!isLength(val, { max: 15 })) {
                return 'Cannot be longer than 15 characters';
            } else if (!matches(val, /^[a-zA-Z\d]{4,15}$/)) {
                return 'Only aphanumeric characters are permitted';
            }
            break;

        case 'password':
            if (isEmpty(val)) {
                return 'Enter a password';
            } else if (!isLength(val, { min: 8 })) {
                return 'Must be at least 8 characters';
            } else if (!matches(val, /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*~-]).{8,}$/)) {
                return 'Does not meet requirements';
            }
            break;

        case 'passwordConfirmation':
            if (isEmpty(val)) {
                return 'Please confirm password';
            } else if (!equals(val, prevForm.password.value)) {
                return 'Password and password confirmation do not match';
            }
            break;
        
        default:
            return null;
    }
    return null;
};


export default validate;