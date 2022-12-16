const Consultation = require("../models/consultation")
const { CustomError } = require("../src/utils/errors")

const createConsultation = async (req, res, next) => {
    try {
        const { id } = req
        const { law_type, body, title } = req.body
        if (!law_type || !body || !title) throw new CustomError("please fill all fields", 400)

        const consultation = await Consultation.create({
            law_type,
            body,
            title,
            user: id,
        })
        if (!consultation) throw new CustomError("please fill all fields", 400)

        return res.status(201).json({ consultation })
    } catch (error) {
        next(error)
    }
}

const getMyConsultation = async (req, res, next) => {
    try {
        const { id } = req
        const cons = await Consultation.find({ user: id })
        return res.status(200).json({ cons })
    } catch (error) {
        next(error)
    }
}

const getSingleConsultation = async (req, res, next) => {
    try {
        const { conID } = req.params
        if (!conID) throw new CustomError("consultation ID is not provided", 400)

        const con = await Consultation.findOne({ _id: conID })
        return res.status(200).json({ con })
    } catch (error) {
        next(error)
    }
}

const updateConsultation = async (req, res, next) => {
    try {
        const { law_type, body, title } = req.body
        const { conID } = req.params
        const { id } = req
        if (!conID) throw new CustomError("consultation ID is not provided", 400)

        const con = await Consultation.findOneAndUpdate(
            { _id: conID, user: id },
            { law_type, body, title },
            { new: true, runValidators: true }
        )
        return res.status(200).json({ con })
    } catch (error) {
        next(error)
    }
}

const deleteConsultation = async (req, res, next) => {
    try {
        const { conID } = req.params
        const { id } = req
        if (!conID) throw new CustomError("consultation ID is not provided", 400)

        const con = await Consultation.findOneAndDelete({ _id: conID, user: id })
        return res.status(200).json({ message: 'deleted', con })
    } catch (error) {
        next(error)
    }
}

const likeORdisLikeConsultation = async (req, res, next) => {
    try {
        const { value } = req.body
        const { conID } = req.params
        const { id } = req
        if (!conID) throw new CustomError("consultation ID is not provided", 400)

        if (value == true) {
            const con = await Consultation.findByIdAndUpdate(
                conID,
                { likes: likes.concat({ userId: id }) },
                { new: true, runValidators: true }
            )
            return res.status(200).json({ con })
        }
        else {
            const con = await Consultation.findByIdAndUpdate(
                conID,
                { likes: likes.concat({ userId: id }) },
                { new: true, runValidators: true }
            )
            return res.status(200).json({ con })
        }
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createConsultation,
    getMyConsultation,
    getSingleConsultation,
    updateConsultation,
    deleteConsultation,
    likeORdisLikeConsultation
}