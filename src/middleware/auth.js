const jwt = require('jsonwebtoken')
const User = require("../../models/user")
const { CustomError } = require('../utils/errors')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        if (!token) throw new CustomError('auhorization header is not provided', 401)

        jwt.verify(token, process.env.SECRET_JWT_KEY, async (err, { id, role }) => {
            if (err) throw new CustomError(`token error is ${err.message}`, 401)
            // const { id, role } = pay
            req.id = id
            req.role = role

            next()
        })
    } catch (error) {
        next(error)
    }
}

const isUser = async (req, res, next) => {
    try {
        const { role } = req
        if (role != 'user') throw new CustomError(`a user with role ${role} cannot perform such action`, 401)
        next()
    } catch (error) {
        next(error)
    }
}

const isLawyer = async (req, res, next) => {
    try {
        const { role } = req
        if (role != 'lawyer') throw new CustomError(`a user with role ${role} cannot perform such action`, 401)
        next()
    } catch (error) {
        next(error)
    }
}

const isVerified = async (req, res, next) => {
    try {
        const { id } = req
        const { status } = await User.findById(id)

        if (status != 'verified') throw new CustomError(`you need to verify your account so you can perform such action`, 401)
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = {
    auth,
    isUser,
    isLawyer,
    isVerified
}