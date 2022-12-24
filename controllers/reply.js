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
            user: id
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
            { _id: replyID, user: id },
            { body },
            { new: true, runValidators: true }
        )
        if (!reply) {
            throw new CustomError("reply not updated. it may be deleted or it does not belong to you", 400)
        }

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

        const reply = await Reply.findOneAndDelete({ _id: replyID, user: id })
        if (!reply) {
            throw new CustomError("reply not deleted. it may be already deleted or it does not belong to you", 400)
        }
        return res.status(200).json({ message: 'deleted' })
    } catch (error) {
        next(error)
    }
}

const likeORdisLikeReply = async (req, res, next) => {
    try {
        const { replyID } = req.params
        if (!replyID) throw new CustomError("reply id is required", 400)

        const { value } = req.body
        if (value != true && value != false) throw new CustomError("value can only be true or false", 400)

        const { id } = req
        const reply = await Reply.findById(replyID)
        await reply.addAction(value, id)
        return res.status(200).json({ reply })
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