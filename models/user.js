const mongoose = require('mongoose')
const consultations = require('./consultation')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { CustomError } = require("../src/utils/errors")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        requried: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: 11,
        validate(value) {
            if (!validator.isMobilePhone(value, ['ar-EG'])) {
                throw new Error("Please Enter a Correct Phone Number")
            }
        }
    },
    password: {
        type: String,
        requried: true,
        minlength: 7
    },
    email: {
        type: String,
        unique: true,
        requried: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("It'S not an Email, Please Enter a Correct One")
            }
        }
    },
    role: {
        type: String,
        requried: true,
        enum: ['user', 'lawyer', 'admin']
    },
    otp: {
        type: String,
        requried: true
    },
    profile_picture: String,
    address: {
        type: String,
        required: true
    },
    specialize: {
        type: String,
        required: () => {
            return role == 'lawyer'
        },
    },
    rate: {
        type: Number,
        defauth: 0
    },
}, { timestamps: true })

userSchema.virtual('concultations', { // or any aonther name
    ref: 'consultation', // the model you want 
    // is where is tha local data is stored
    localField: '_id', // id is relaton between cons and client
    // name of property on consultation i wanna to to make relation with
    foreignField: 'client'
})

userSchema.methods.authToken = async function () {
    const token = jwt.sign({ id: this._id.toString() }, process.env.SECRET_JWT_KEY)
    return token
}

userSchema.methods.toJSON = function () {
    const data = this.toObject()
    delete data.password
    return data
}


userSchema.statics.findByAlternatives = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new CustomError("User Doesn't Exist!", 401)
    }
    const match = bcrypt.compare(password, user.password)
    if (!match) {
        throw new CustomError("Wrong Password!. Please Confirm Password", 401)
    }
    return user
}

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = bcrypt.hash(this.password, 8)
    }
    next()
})

userSchema.pre('remove', async function (next) {
    await consultations.deleteMany({ user: this._id })
    next()
})

const User = mongoose.model('user', userSchema);

module.exports = User



// lawyerSchema.virtual('replies' , { // or any aonther name
//     ref : 'reply' , // the model you want
//     // is where is tha local data is stored
//     localField : '_id' , // id is relaton between cons and client
//     // name of property on consultation i wanna to to make relation with
//     foreignField : 'lawyer'
// })


// lawyerSchema.virtual('consultationss' , { // or any aonther name
//     ref : 'consultation' , // the model you want
//     // is where is tha local data is stored
//     localField : '_id' , // id is relaton between cons and client
//     // name of property on consultation i wanna to to make relation with
//     foreignField : 'lawyer'
// })


// lawyerSchema.methods.rateRatio = async function () {
//     const rates = await feedback.find({lawyer : this._id})
//     const count = await feedback.countDocuments({lawyer : this._id})
//     let avrRate = 0
//     rates.forEach(value => avrRate += (value.rate) / count)
//     this.rate = avrRate
//     await this.save()
// }


