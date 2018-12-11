import { isEmpty, isLength, matches, isEmail, equals } from 'validator';

const validate = (attr, form) => {
    let val = form[attr];

    switch (attr) {
        case 'name':
            val = val.trim();
            if (isEmpty(val)) {
                return 'Enter a name';
            } else if (!isLength(val, { max: 25 })) {
                return 'Cannot be longer than 25 characters';
            } else if (!matches(val, /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/)) {
                return 'Invalid character used';
            }
            break;

        case 'email':
            val = val.trim();
            if (isEmpty(val)) {
                return 'Enter an email';
            } else if (!isEmail(val)) {
                return 'Invalid email';
            }
            break;

        case 'username':
            val = val.trim();
            if (isEmpty(val)) {
                return 'Enter a username';
            } else if (!matches(val, /^[a-zA-Z\d]{4,15}$/)) {
                return 'Invalid username';
            }
            break;

        case 'password':
            if (isEmpty(val)) {
                return 'Enter a password';
            } else if (!matches(val, /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)) {
                return 'Password does not meet requirements';
            }
            break;

        case 'passwordConfirmation':
            if (isEmpty(val)) {
                return 'Enter a password confirmation';
            } else if (!equals(val, form.password)) {
                return 'Password and password confirmation do not match';
            }
            break;
        
        default:
            return null;
    }
    return null;
};


export default validate;