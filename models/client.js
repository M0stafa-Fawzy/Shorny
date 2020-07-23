const mongoose = require('mongoose')
const consultations = require('../models/consultation')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const clientSchema = new mongoose.Schema({

    name : {
        type : String ,
        requried : true ,
    } ,
    phoneNumber : {
        type : String , 
        required : true , 
        trim : true ,
        unique : true , 
        minlength : 10 ,      
        validate(value) {
            if(!validator.isMobilePhone(value , ['ar-EG'])){
                throw new Error ("Please Enter a Correct Phone Number")
            }
        }
    } ,
    password : {
        type : String ,
        requried : true , 
        minlength : 7 , 
        validate(value) {
            if(validator.equals(value ,'password')){
                throw new Error("Password Can't Be Like That")
            }
        }
    } ,
    email : {
        type: String ,
        unique : true , 
        requried : true ,
        trim : true , 
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error ("It'S not an Email, Please Enter a Correct One")
            }
        }
    } , 
    role : {
        type : String , 
        trim : true , 
        requried : true
    } , 
    tokens : [{
        token : {
            type : String , 
            requried : true
        }
    }] , 
    roleToken : {
        type : String , 
        requried : true
    } , 
    accessCode : {
        type : String , 
        default : ""
    } ,
    lawyers : [{
        lawyer : {
            type : mongoose.Types.ObjectId , 
            ref : 'lawyer'
        }
    }] ,
    profile_picture : {
        type : Buffer
    } ,
    doesHavePicture : {
        type : Boolean , 
        default : false
    }
} , {
     timestamps : true
})

clientSchema.virtual('concultations' , { // or any aonther name
    ref : 'consultation' , // the model you want 
    // is where is tha local data is stored
    localField : '_id' , // id is relaton between cons and client
    // name of property on consultation i wanna to to make relation with
    foreignField : 'client'
})
 


clientSchema.methods.authToken = async function () {
    // just return token witch generated from id + key
    const token = jwt.sign({ _id:this._id.toString() } , process.env.SECRET_JWT_KEY)
    this.tokens = this.tokens.concat({token})
    await this.save()
    return token
}

clientSchema.methods.authToken2 = async function () {
    // just return token witch generated from role + key
    const roletoken = jwt.sign({ role : this.role} , process.env.SECRET_JWT_KEY)
    this.roleToken = roletoken
    await this.save()
    return  roletoken 
}



// automated function to hide some private data
clientSchema.methods.toJSON = function () {

    const  data = this.toObject()
    delete data.password
    delete data.tokens
    delete data.roleToken
    delete data.profile_picture
    delete data.__v
    delete data.lawyers

    return data
}


clientSchema.statics.findByAlternatives = async (email , password) => {
    const client = await Clients.findOne({email})
    if(!client){
        throw new Error("User Doesn't Exist!")
    }
    const match = await bcrypt.compare(password , client.password)
    if(!match){
        throw new Error("Wrong Password!. Please Confirm Password")
    }
    return client
}


clientSchema.pre('save' , async function (next) {

    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password , 8)
    }
    next()
})


clientSchema.pre('remove' , async function (next) {

     await consultations.deleteMany({client : this._id})

    next()
})

const Clients = mongoose.model('client' , clientSchema) ; 

module.exports = Clients

