let mongoose = require('mongoose')
let bcrypt = require('bcrypt-nodejs');

let Schema = mongoose.Schema;

let User = new Schema({
    firstname: {
        type: String,
        required: true
    },

    lastname: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
    }


});

User.methods.hashPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

User.methods.validatePassword = (password, hash) => {
    return bcrypt.compareSync(password, hash);
}

module.exports = mongoose.model('User', User)