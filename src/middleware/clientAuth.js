const jwt = require('jsonwebtoken')
const clients = require('../../models/client')

// this whole bunch of code is responsible for
// return the user which has this token
const auth = async (req, res, next) => {
    try {
        // looking for the header 
        const token = req.header('Authorization').replace('Bearer ', '')
        // validate the header and jwt
        const decoded = jwt.verify(token , process.env.SECRET_JWT_KEY)
        const client = await clients.findOne({_id : decoded._id , 'tokens.token' : token})

        if(!client){
            throw new Error('errrrrrrrrror')
        }
        req.token  = token
        req.client = client
        next()
    }catch (e) {
        res.status(401).send('please auth!')
    }
}

module.exports = auth