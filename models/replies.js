require('../src/db/mongoose')
const mongoose = require ('mongoose') 

const replySchema = new mongoose.Schema({
    body : {
        type : String ,
    } , likes : {
        type :  Number ,
        default : 0 
    } , dislikes : {
        type : Number ,
        default : 0 
    }, lawyer : {
        type : mongoose.Types.ObjectId ,
        ref : 'lawyer'
    } , consultation : {
        type : mongoose.Types.ObjectId ,
        ref : 'consultation'
    }
})

const Replies = mongoose.model('reply' , replySchema)


module.exports = Replies