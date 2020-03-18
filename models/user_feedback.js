require('../src/db/mongoose')
const mongoose = require('mongoose')

const feedbackSchema = new mongoose.Schema({
    lawyer : {
        type : mongoose.Types.ObjectId , 
        required : true 
    } , 
    user : {
        type : mongoose.Types.ObjectId , 
        required : true
    } , 
    rate : {
        type : Number , 
    } ,
    body : {
        type : String , 
    }
} , {
    timestamps : true 
})

const FeedBack = mongoose.model('feedback' , feedbackSchema)


module.exports = FeedBack