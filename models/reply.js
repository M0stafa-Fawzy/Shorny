const mongoose = require('mongoose')

const replySchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    body: {
        type: String,
        required: true
    },
    consultation: {
        type: mongoose.Types.ObjectId,
        ref: 'consultation',
        required: true
    },
    likes: [
        {
            userId: {
                type: mongoose.Types.ObjectId,
                ref: 'user'
            }
        }
    ],
    dislikes: [
        {
            userId: {
                type: mongoose.Types.ObjectId,
                ref: 'user'
            }
        }
    ]
}, { timestamps: true })

replySchema.methods.addAction = async function (value, id) {
    if (value == true) {
        this.likes = this.likes.concat({ userId: new mongoose.Types.ObjectId(id) })
    } else if (value == false) {
        this.dislikes = this.dislikes.concat({ userId: new mongoose.Types.ObjectId(id) })
    } else { }
    await this.save()
}

const Reply = mongoose.model('reply', replySchema)

module.exports = Reply