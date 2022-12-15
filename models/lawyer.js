//require('../src/db/mongoose')
const feedback = require('./user_feedback')
const mongoose = require ('mongoose') 
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken') 

const lawyerSchema = new mongoose.Schema({
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
    address : {
        type : String , 
       // required : true , 
    } , 
    town : String ,
    region : String
    ,
    role : {
        type : String , 
        required : true , 
        trim : true 
    },
    lawyer_type : {
        type : String , 
       // required : true , 
        trim : true ,
    } , 
    facebook_link : {
        type : String , 
        trim : true ,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error ("It'S not an Facebook Link, Please Enter a Correct One")
            }
        }
    } ,
    twitter_link : {
        type : String , 
        trim : true ,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error ("It'S not an Twitter Link, Please Enter a Correct One")
            }
        }
    } ,
    status : {
        type : String , 
        default : 'Available' ,
       // required : true ,
        trim : true , 
    } , 
    rate : {
        type : Number , 
        defauth : 0
    } ,
    accessCode : {
        type : String , 
        default : ""
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
    clients : [{
        client : {
            type : mongoose.Types.ObjectId , 
            ref : 'client'
        }
    }] , 
    consultations : [{
        consultation : {
            type : mongoose.Types.ObjectId , 
            ref : 'consultation'
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


lawyerSchema.virtual('replies' , { // or any aonther name
    ref : 'reply' , // the model you want 
    // is where is tha local data is stored
    localField : '_id' , // id is relaton between cons and client
    // name of property on consultation i wanna to to make relation with
    foreignField : 'lawyer'
})


lawyerSchema.virtual('consultationss' , { // or any aonther name
    ref : 'consultation' , // the model you want 
    // is where is tha local data is stored
    localField : '_id' , // id is relaton between cons and client
    // name of property on consultation i wanna to to make relation with
    foreignField : 'lawyer'
})


lawyerSchema.methods.toJSON = function() {

    const  data = this.toObject()
    delete data.password
    delete data.tokens
    delete data.roleToken
    delete data.clients
    delete data.consultations
    delete data.profile_picture
    delete data.ID
    delete data.__v

    return data
}



lawyerSchema.methods.authToken = async function () {
    
    const token = jwt.sign({ _id:this._id.toString() } , process.env.SECRET_JWT_KEY)
    this.tokens = this.tokens.concat({token})
    await this.save()
    return token
}

// method for signning the role of the actor
lawyerSchema.methods.authToken2 = async function () {
    const roletoken = jwt.sign({ role : this.role} , process.env.SECRET_JWT_KEY)
    this.roleToken = roletoken
    await this.save()
    return  roletoken 
}

lawyerSchema.methods.rateRatio = async function () {
    const rates = await feedback.find({lawyer : this._id})
    const count = await feedback.countDocuments({lawyer : this._id})
    let avrRate = 0 
    rates.forEach(value => avrRate += (value.rate) / count)
    this.rate = avrRate
    await this.save()
}


lawyerSchema.statics.findByAlternatives = async (email , password) => {
    const lawyer = await Lawyers.findOne({email : email})
    if(!lawyer){
        throw new Error("User Doesn't Exist!")
    }
    const match = await bcrypt.compare(password , lawyer.password)
    if(!match){
        throw new Error("Wrong Password!. Please Confirm Password")
    }
    return lawyer
}



lawyerSchema.pre('save' , async function(next){

    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password , 8)
    }
    next()
})



const Lawyers = mongoose.model('lawyer' , lawyerSchema) 

module.exports = Lawyers 
