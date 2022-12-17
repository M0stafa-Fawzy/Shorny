const Reply = require("../models/reply")
const { CustomError } = require("../src/utils/errors")

const createReply = async (req, res, next) => {
    try {
        const { id } = req
        const { consultation, body } = req.body
        if (!consultation || !body) throw new CustomError("consultation id and reply body are required", 400)

        const reply = await Reply.create({
            consultation,
            body,
            owner: id
        })
        return res.status(201).json({ reply })
    } catch (error) {
        next(error)
    }
}

const updateReply = async (req, res, next) => {
    try {
        const { replyID } = req.params
        const { body } = req.body
        const { id } = req
        if (!replyID || !body) throw new CustomError("reply id and body is required", 400)

        const reply = await Reply.findOneAndUpdate(
            { _id: replyID, owner: id },
            { body },
            { new: true, runValidators: true }
        )
        return res.status(200).json({ reply })
    } catch (error) {
        next(error)
    }
}

const deleteReply = async (req, res, next) => {
    try {
        const { replyID } = req.params
        const { id } = req
        if (!replyID) throw new CustomError("reply id is required", 400)

        const reply = await Reply.findOneAndDelete({ _id: replyID, owner: id })
        return res.status(200).json({ message: 'deleted' })
    } catch (error) {
        next(error)
    }
}

const likeORdisLikeReply = async (req, res, next) => {
    try {
        const { replyID } = req.params
        const { id } = req
        const { value } = req.body
        if (!replyID) throw new CustomError("reply id is required", 400)

        if (value == true) {
            const reply = await Reply.findByIdAndUpdate(
                replyID,
                { likes: likes.concat({ like: id }) }
            )
            return res.status(200).json({ reply })
        } else if (value == false) {
            const reply = await Reply.findByIdAndUpdate(
                replyID,
                { dislikes: dislikes.concat({ dislike: id }) }
            )
            return res.status(200).json({ reply })
        } else throw new CustomError("value can only be true or false", 400)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createReply,
    updateReply,
    deleteReply,
    likeORdisLikeReply
}