const { hash, compare } = require('bcrypt');

const saltRounds = 10;

module.exports.encrypt = async password => {
    try {
        return(hash(password, saltRounds));        
    } catch (error) {
        console.log('there was an error in encrypting the password');
    }
};

module.exports.comparePasswords = compare;