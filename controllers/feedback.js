const Feedback = require('../models/feedback')
const User = require('../models/user')
const { CustomError } = require('../src/utils/errors')

const addFeedBack = async (req, res, next) => {
    try {
        const { id } = req
        const { lawyerID, rate, body } = req.body
        if (!lawyerID || !body || !rate) throw new CustomError("lawyer id, rate and feed back body are required", 400)

        let lawyer = await User.findById(lawyerID)
        if (!lawyer || lawyer.role != 'lawyer') throw new CustomError('lawyer not found', 404)

        const count = await Feedback.countDocuments({ user: id, lawyer: lawyerID })
        if (count >= 1) throw new CustomError('you already have submitted your feedback!', 400)

        const [feedback] = await Promise.all([
            Feedback.create({
                user: id,
                lawyer: lawyerID,
                rate,
                body
            }),
            lawyer.rateRatio()
        ])

        if (!feedback) throw new CustomError("feed back doesn't created", 400)
        return res.status(201).json({ feedback })
    } catch (error) {
        console.log({ error });
        next(error)
    }
}

const getLawyerFeedBacks = async (req, res, next) => {
    try {
        const { lawyerID } = req.params
        const feedbacks = await Feedback.find({ lawyer: lawyerID })
        return res.status(200).json({ feedbacks })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    addFeedBack,
    getLawyerFeedBacks
}