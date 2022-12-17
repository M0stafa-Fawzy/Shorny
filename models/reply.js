const mongoose = require('mongoose')

const replySchema = new mongoose.Schema({
    body: {
        type: String,
    }, likes: [{
        like: {
            type: mongoose.Types.ObjectId,
            ref: 'user'
        }
    }], dislikes: [{
        dislike: {
            type: mongoose.Types.ObjectId,
            ref: 'user'
        }
    }], owner: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    }, consultation: {
        type: mongoose.Types.ObjectId,
        ref: 'consultation'
    }
}, { timestamps: true })

const Reply = mongoose.model('reply', replySchema)


module.exports = Reply