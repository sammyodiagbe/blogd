const mongoose = require('mongoose');
const User = require('./userModel');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    post_content: {
        type: String,
        required: true,
    },

    post_time: {
        type: Date,
        default: Date.now
    },
    post_author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('post', PostSchema);