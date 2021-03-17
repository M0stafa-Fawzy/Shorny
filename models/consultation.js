require('../src/db/mongoose')
const mongoose = require ('mongoose') 
const replies = require('./replies')

const consultatoinSchema = new mongoose.Schema({
     client : {
        type : mongoose.Schema.Types.ObjectId , 
        required : true , 
        ref : 'client'
    } , law_type : {
        type : String , 
        required : false , 
        trim : true ,
    } , 
    likes : [{
            userId : {
                type : mongoose.Schema.Types.ObjectId , 
                ref : 'client' , 
            }
    }]
    , dislikes : [{
            userId : {
                type : mongoose.Schema.Types.ObjectId , 
                ref : 'client' , 
            }
     }] , 
     body : {
        type : String , 
        required : false ,
    } , title : {
        type : String ,
        maxlength : 200 ,
        required : true
    }  , ready_Lawyers : [{
            lawyer : {
                type : mongoose.Schema.Types.ObjectId , 
                ref : 'lawyer' , 
            }
    }]
})





// function for delete concultation replies if the concultation is deleted
//hint : it does not work and i do not know why 
consultatoinSchema.pre('remove' , async function (next) {

    await replies.deleteMany({consultation : this._id})

   next()
})


const Concultations = mongoose.model('consultation' , consultatoinSchema)

module.exports = Concultations ; 

