const jwt = require('jsonwebtoken')
const User = require('../../models/user')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        if (!token) return res.status(401).json({ error: 'auhorization header is not provided' })

        jwt.verify(token, process.env.JWT_KEY, async (err, { id, role }) => {
            if (err) return res.status(401).json({ error: `token error is ${err.message}` })

            req.id = id
            req.role = role

            next()
        })
    } catch (error) {
        return res.status(401).json({ error: error.message })
    }
}

module.exports = {
    auth
}