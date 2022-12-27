const mongoose = require('mongoose')

const feedbackSchema = new mongoose.Schema({
    lawyer: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    user: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    rate: {
        type: Number,
        required: true
    },
    body: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
})

const FeedBack = mongoose.model('feedback', feedbackSchema)

module.exports = FeedBack