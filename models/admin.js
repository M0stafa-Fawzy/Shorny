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
        trim : true
    } , role : {
        type : String ,
        requried : true ,
        trim : true
    } ,
    phoneNumber : {
        type : String , 
        required : true , 
        trim : true ,
        unique : true , 
        minlength : 10 
    } ,
     password : {
        type : String ,
        requried : true , 
        minlength : 7 , 
        trim : true , 
        validate(value) {
            if(!value && value.includes('password')){
                throw Error("password can not be like that")
            }
        }
    } ,
    email : {
        type: String ,
        unique : true , 
        requried : true ,
        trim : true , 
        lowercase : true ,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error ("it is not an email, please enter a correct email ")
            }
        }
    } , tokens : [{
        token : {
            type : String , 
            requried : true
        }
    }] , role_token : {
            type : String , 
            requried : true
        } , profile_picture : {
        type : Buffer
    }
} , {
    timestamps : true
})

adminSchema.methods.autnToken = async function () {

    const token = jwt.sign({ _id:this._id.toString() } , process.env.ADMIN_JWT)
    this.tokens = this.tokens.concat({token})
    await this.save()
    return token
}

adminSchema.methods.autnToken2 = async function () {

    const roletoken = jwt.sign({ role:this.role } , process.env.ADMIN_JWT)
    this.role_token = roletoken
    await this.save()
    return roletoken
}


// adminSchema.methods.toJSON =  function () {

//     const  admin = this
//     const  adminObject = admin.toObject()
//     delete adminObject.password
//     delete adminObject.tokens

//     return adminObject

// }


// adminSchema.statics.findByAlternatives = async (email , password) => {
//     const admin = await Users.findOne( {email : email} )

//     if(!admin){
//         throw new Error('can not login')
//     }

//     const isMatch = await bcrypt.compare(password , admin.password)

//     if(!isMatch){
//         throw new Error('can  not login')
//     }
//     return admin
// }


// function for hashing passwords before saving them
adminSchema.pre('save' , async function (next) {

    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password , 8)
    }
    next()
})

const Admins = mongoose.model('admin' , adminSchema)

module.exports = Admins



