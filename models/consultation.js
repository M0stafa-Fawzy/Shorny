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
            unique: true,
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

consultationSchema.methods.addAction = async function (value, id) {
    if (value == true) {
        console.log({ id });
        this.likes = this.likes.push({ userId: new require("mongoose").Types.ObjectId(id) })
    } else if (value == false) {
        this.dislikes = this.dislikes.push({ userId: id })
    } else { }
    await this.save()
}

const Consultation = mongoose.model('consultation', consultationSchema)

module.exports = Consultation;

