const jwt = require('jsonwebtoken')
const admins = require('../../models/admin')

const auth = async (req, res, next) => {
    try {
        // looking for the header 
        const token   = req.header('Authorization').replace('Bearer ', '')
        // validate the header and jwt
        const decoded = jwt.verify(token , process.env.SECRET_JWT_KEY)
        const admin  = await admins.findOne({_id : decoded._id , 'tokens.token' : token})

        if(!admin){
            throw new Error('errrrrrrrrror')
        }
        req.token  = token
        req.admin = admin
        next()
    }catch (e) {
        res.status(401).send('please auth!')
    }
}

module.exports = auth