const mongoose = require('mongoose')

const requestSchema = new mongoose.Schema({
    ID: {
        type: Number,
        required: true,
        trim: true,
        unique: true,
    }, lawyeer_ID: {
        type: Number,
        required: true,
        trim: true,
    }, user_ID: {
        type: Number,
        required: true,
        trim: true,
    }, destination_ID: {
        type: Number,
        required: true,
        trim: true,
    }
})

const Requests = mongoose.model('request', requestSchema)

module.exports = Requests;

// const re = new Requests({
//     ID : 10 ,
//     lawyeer_ID : 11 ,
//     user_ID : 12 ,
//     destination_ID : 13
// })

// re.save() ; 