// DEFINE THE MODELS
require('../src/db/mongoose')
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const adminSchema = new mongoose.Schema({
    name : {
        type : String ,
        requried : true ,
    } ,
    role : {
        type : String ,
        requried : true ,
        trim : true
    } ,
    phoneNumber : {
        type : String , 
        required : true , 
        trim : true ,
        unique : true , 
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
            if(validator.equals(value , 'password')){
                throw Error("Password Can't Be Like That")
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
    tokens : [{
        token : {
            type : String , 
            requried : true
    }
    }] , 
    role_token : {
        type : String , 
        requried : true
    } , 
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

adminSchema.methods.authToken = async function () {

    const token = jwt.sign({ _id:this._id.toString() } , process.env.SECRET_JWT_KEY)
    this.tokens = this.tokens.concat({token})
    await this.save()
    return token
}

adminSchema.methods.authToken2 = async function () {

    const roletoken = jwt.sign({ role:this.role } , process.env.SECRET_JWT_KEY)
    this.role_token = roletoken
    await this.save()
    return roletoken
}


adminSchema.methods.toJSON =  function () {

    const  data = this.toObject()
    delete data.password
    delete data.tokens
    delete data.profile_picture
    delete data.role_token
    delete data.__v

    return data

}


adminSchema.statics.findByAlternatives = async (email , password) => {
    const admin = await Admins.findOne( {email} )
    if(!admin){
        throw new Error("Admin Doesn't Exist!")
    }
    const isMatch = await bcrypt.compare(password , admin.password)
    if(!isMatch){
        throw new Error("Wrong Password!. Please Confirm Password")
    }
    return admin
}


// function for hashing passwords before saving them
adminSchema.pre('save' , async function (next) {

    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password , 8)
    }
    next()
})

const Admins = mongoose.model('admin' , adminSchema)

module.exports = Admins



