const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    github_id: Number,
    github_login: String,
    name: String,
    email: String,
    avatar: String
});

userSchema.statics.githubUpdateOrCreate = async function (user) {
    try {
        const { github_id, ...rest } = user;
    
        const userExists = !!await this.findOne({ github_id });
    
        let payloadDoc;
    
        if (userExists) {
            payloadDoc = await this.findOneAndUpdate(
                { github_id },
                { $set: { ...rest } }
            );
            console.log('updated user: ', payloadDoc);
        } else {
            payloadDoc = await this.create(user);
            console.log('new user: ', payloadDoc);
        }

        return payloadDoc;
    } catch (error) {
        console.log(error);
    }
}



const User = mongoose.model('User', userSchema);

module.exports = User;