//require('../src/db/mongoose')
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
        required : true , 
        trim : true 
    } , 
    role : {
        type : String , 
        required : true , 
        trim : true 
    }, 
    ratting : {
        type : Number ,
    } , 
    lawyer_type : {
        type : String , 
        required : true , 
        trim : true ,
    } , 
    status : {
        type : String , 
        required : true ,
        trim : true , 
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



lawyerSchema.methods.toJSON = function() {

    const  data = this.toObject()
    delete data.password
    delete data.tokens
    delete data.roleToken
    delete data.clients
    delete data.consultations
    delete data.profile_picture
    delete data.ID
    delete data.role
    delete data.__v

    return data
}



lawyerSchema.methods.authToken = async function () {
    
    const token = jwt.sign({ _id:this._id.toString() } , process.env.LAWYER_JWT)
    this.tokens = this.tokens.concat({token})
    await this.save()
    return token
}

// method for signning the role of the actor
lawyerSchema.methods.authToken2 = async function () {
    const roletoken = jwt.sign({ role : this.role} , process.env.LAWYER_JWT)
    this.roleToken = roletoken
    await this.save()
    return  roletoken 
}



lawyerSchema.statics.findByAlternatives = async (email , password) => {
    const lawyer = await Lawyers.findOne({email})
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

    this.password = await bcrypt.hash(this.password, 8)
    next() ; 

})

const Lawyers = mongoose.model('lawyer' , lawyerSchema) 

module.exports = Lawyers 
