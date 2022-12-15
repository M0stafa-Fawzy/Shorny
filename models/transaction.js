require('../src/db/mongoose')
const mongoose = require ('mongoose') 
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken') 

const transactionSchema = new mongoose.Schema({
    ID : {
        type : Number , 
        required : true , 
        trim : true , 
        unique : true , 
    } , lawyeer_type : {
        type : String , 
        required : true , 
        trim : true ,
    } , user_ID : {
        type : Number , 
        required : true , 
        trim : true , 
    } , transaction_body : {
        type : String , 
        required : true , 
        trim : true , 
    }
})

const Transactions = mongoose.model('transaction' , transactionSchema)

module.exports = Transactions ; 

// const tr = new Transactions ({
//     ID : 15 ,
//     lawyeer_type : "GERARA" , 
//     user_ID : 120 , 
//     transaction_body : " IT IS FROM HIM TO ME"
// })

// tr.save() ; 