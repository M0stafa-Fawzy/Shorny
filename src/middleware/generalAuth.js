const jwt = require('jsonwebtoken')
const lawyers = require('../../models/lawyer')
const users = require('../../models/client')
const admins = require('../../models/admin')

const auth = async (req, res, next) => {
    try {
        // looking for the header 
        const token   = req.header('Authorization').replace('Bearer ', '')
        // validate the header and jwt
        const decoded = jwt.verify(token , process.env.SECRET_JWT_KEY)

        const user = await users.findOne({_id : decoded._id , 'tokens.token' : token}) 
        const lawyer  = await lawyers.findOne({_id : decoded._id , 'tokens.token' : token})
        const admin = await admins.findOne({_id : decoded._id , 'tokens.token' : token})

        if(user){
            req.token  = token
            req.actor = user
        }else  if(lawyer){
            req.token  = token
            req.actor = lawyer
        }else if(admin){
            req.token  = token
            req.actor = admin
        }else{
            throw new Error('ERRRRRRRRRRROR')
        }
        next()
    }catch (e) {
        res.status(401).send('please auth!')
    }
}



module.exports = auth