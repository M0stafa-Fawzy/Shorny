const mongoose = require('mongoose')
const replies = require('./reply')

const consultationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    law_type: {
        type: String,
        required: true
    },
    likes: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        }
    }]
    , dislikes: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        }
    }],
    body: {
        type: String,
        required: true,
    }, title: {
        type: String,
        required: true
    }, ready_Lawyers: [{
        lawyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        }
    }]
})

consultationSchema.pre('remove', async function (next) {
    await replies.deleteMany({ consultation: new mongoose.ObjectId(this._id) })
    next()
})


const Consultation = mongoose.model('consultation', consultationSchema)

module.exports = Consultation;

