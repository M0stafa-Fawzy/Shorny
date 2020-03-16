const jwt = require('jsonwebtoken')
const lawyers = require('../../models/lawyer')

const auth = async (req, res, next) => {
    try {
        // looking for the header 
        const token   = req.header('Authorization').replace('Bearer ', '')
        // validate the header and jwt
        const decoded = jwt.verify(token , process.env.LAWYER_JWT)
        const lawyer  = await lawyers.findOne({_id : decoded._id , 'tokens.token' : token})

        if(!lawyer){
            throw new Error('errrrrrrrrror')
        }
        req.token  = token
        req.lawyer = lawyer
        next()
    }catch (e) {
        res.status(401).send('please auth!')
    }
}

module.exports = auth