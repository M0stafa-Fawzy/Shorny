const User = require("../models/user")
const { CustomError } = require("../src/utils/errors")
const { generateOTP } = require("../src/utils/otp")
const { registerMail, deleteMail, verificationMail } = require('../src/emails/email')


const signup = async (req, res, next) => {
    try {
        const { username, phoneNumber, password, email, specialize, address, role } = req.body
        const user = await User.create({
            username,
            phoneNumber,
            password,
            email,
            specialize,
            address,
            role,
            otp: generateOTP()
        })

        if (!user) throw new CustomError("User doesn't created", 400)
        // registerMail(user.email , user.username)
        // verificationMail(user.email, user.otp)
        return res.status(201).json({ user, token: user.authToken() })
    } catch (error) {
        next(error)
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        if (!email || !password) throw new CustomError("email and password are required", 400)

        const user = await User.findByAlternatives(email, password)
        return res.status(200).json({ user, token: user.authToken() })
    } catch (error) {
        next(error)
    }
}

const getProfileData = async (req, res, next) => {
    try {
        const { id } = req
        const user = await User.findById(id)
        return res.status(200).json({ user })
    } catch (error) {
        next(error)
    }
}

const updateProfile = async (req, res, next) => {
    try {
        const { username, email, password, phoneNumber, profile_picture, address, specialize } = req.body
        const user = await User.findByIdAndUpdate(
            id,
            { username, email, password, phoneNumber, profile_picture, address, specialize },
            { new: true, runValidators: true }
        )

        if (!user) throw new CustomError("update user failed", 400)
        return res.status(200).json({ user })
    } catch (error) {
        next(error)
    }
}

const verifyUser = async (req, res, next) => {
    try {
        const { email, otp } = req.body
        if (!email || !otp) throw new CustomError("email and verification code are required", 400)

        const user = await User.findOne({ email })
        if (!user) throw new CustomError("user doesn't exist", 401)

        if (otp != user.otp) throw new CustomError("wrong verification code", 401)
        return res.status(200).json({ user, token: user.authToken() })
    } catch (error) {
        next(error)
    }
}

const deleteAccount = async (req, res, next) => {
    try {
        const { id } = req
        const user = await User.findById(id)
        if (!user) throw new CustomError("user not found", 401)

        await user.remove()
        // deleteMail(user.email, user.username)
        return res.status(200).json({ message: "account deleted successfully" })
    } catch (error) {
        next(error)
    }
}

const forgetPassword = async (req, res, next) => {
    try {
        const { email } = req.body
        let user = await User.findOne({ email: email })
        if (!user) throw new CustomError("user not found", 401)

        const otp = generateOTP()
        user = await User.findOneAndUpdate(
            email,
            { otp },
            { new: true, runValidators: true }
        )

        // verificationMail(email, otp)
        return res.status(200).json({ message: 'verification code has been sent to your mail' })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    signup,
    login,
    getProfileData,
    updateProfile,
    deleteAccount,
    verifyUser,
    forgetPassword
}