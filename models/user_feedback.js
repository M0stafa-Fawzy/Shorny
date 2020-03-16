require('../src/db/mongoose')
const mongoose = require ('mongoose') 
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken') 

const feedbackSchema = new mongoose.Schema({
    ID : {
        type : Number , 
        required : true , 
        trim : true , 
        unique : true , 
    } , lawyeer_ID : {
        type : Number , 
        required : true , 
        trim : true ,
    } , user_ID : {
        type : Number , 
        required : true , 
        trim : true , 
    } , feedback_body : {
        type : String , 
        required : true , 
        trim : true , 
    } , ratting : {
        type : Number , 
        required : true , 
        trim : true , 
    } , date : {
        type : Date , 
        trim : true , 
    }
})

const Feedbacks = mongoose.model('feedback' , feedbackSchema)

module.exports = Feedbacks ; 

const tr = new Feedbacks ({
    ID : 200,
    lawyeer_ID : 201 , 
    user_ID : 202 , 
    feedback_body : " this is a magnificent app " , 
    ratting : 2.3 , 
    date : "2017-1-4" 
})

tr.save() ; 