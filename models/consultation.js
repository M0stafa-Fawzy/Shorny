const mongoose = require('mongoose')
const replies = require('./replies')

const consultatoinSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    }, law_type: {
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

consultatoinSchema.pre('remove', async function (next) {
    const { ObjectId } = require('mongoose')
    await replies.deleteMany({ consultation: new ObjectId(this._id) })

    next()
})


const Concultation = mongoose.model('consultation', consultatoinSchema)

module.exports = Concultation;

