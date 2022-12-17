const User = require("../models/user")
const { CustomError } = require("../src/utils/errors")
const { generateOTP } = require("../src/utils/otp")
const { registerMail, deleteMail, verificationMail } = require('../src/emails/email')


const signup = async (req, res, next) => {
    try {
        const { username, phoneNumber, password, email, specialize, address, role } = req.body
        const user = await User.create({
            username,
            phoneNumber,
            password,
            email,
            specialize,
            address,
            role,
            otp: generateOTP()
        })
        // registerMail(user.email, user.username)
        // verificationMail(user.email, user.otp)
        return res.status(201).json({ user, token: user.authToken() })
    } catch (error) {
        next(error)
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        if (!email || !password) throw new CustomError("email and password are required", 400)

        const user = await User.findByAlternatives(email, password)
        return res.status(200).json({ user, token: user.authToken() })
    } catch (error) {
        next(error)
    }
}

const getProfileData = async (req, res, next) => {
    try {
        const { id } = req
        const user = await User.findById(id)
        return res.status(200).json({ user })
    } catch (error) {
        next(error)
    }
}

const updateProfile = async (req, res, next) => {
    try {
        const { id } = req
        const { username, email, password, phoneNumber, address, specialize } = req.body
        const user = await User.findByIdAndUpdate(
            id,
            { username, email, password, phoneNumber, address, specialize },
            { new: true, runValidators: true }
        )

        if (!user) throw new CustomError("update user failed", 400)
        return res.status(200).json({ user })
    } catch (error) {
        next(error)
    }
}

const verifyUser = async (req, res, next) => {
    try {
        const { email, otp } = req.body
        if (!email || !otp) throw new CustomError("email and verification code are required", 400)

        let user = await User.findOne({ email })
        if (!user) throw new CustomError("user doesn't exist", 401)

        if (user.status == 'verified') throw new CustomError("user is already verified", 400)
        if (otp != user.otp) throw new CustomError("wrong verification code", 401)

        user = await User.findOneAndUpdate({ email }, { status: 'verified' }, { new: true, runValidators: true })
        return res.status(200).json({ message: 'account verified successfully', user, token: user.authToken() })
    } catch (error) {
        next(error)
    }
}

const deleteAccount = async (req, res, next) => {
    try {
        const { id } = req
        const user = await User.findById(id)
        if (!user) throw new CustomError("user not found", 401)

        await user.remove()
        // deleteMail(user.email, user.username)
        return res.status(200).json({ message: "account deleted successfully" })
    } catch (error) {
        next(error)
    }
}

const forgetPassword = async (req, res, next) => {
    try {
        const { email } = req.body
        let user = await User.findOne({ email: email })
        if (!user) throw new CustomError("user not found", 401)

        user = await User.findOneAndUpdate(
            email,
            { otp: generateOTP(), status: 'pending' },
            { new: true, runValidators: true }
        )

        // verificationMail(email, otp)
        return res.status(200).json({ message: 'verification code has been sent to your mail' })
    } catch (error) {
        next(error)
    }
}

const getUserProfileByID = async (req, res, next) => {
    try {
        const { id } = req.params
        const user = await User.findById(id)

        if (!user) throw new CustomError("user not found", 400)
        return res.status(200).json({ user })
    } catch (error) {
        next(error)
    }
}

// function showReadyLawyer() {
//     clientRouter.get('/users/ready/:id', auth, async (req, res) => {
//         try {
//             const con = await consultations.findOne({ _id: req.params.id, client: req.client._id })
//             if (!con) {
//                 return res.status(404).send()
//             }
//             const readr_Lawyers = await lawyers.find({ _id: con.ready_Lawyers })
//             if (!readr_Lawyers) {
//                 return res.status(404).send()
//             }
//             res.status(200).send(readr_Lawyers)
//         } catch (err) {
//             res.status(400).send(err)
//         }
//     })
// }

// showReadyLawyer()



// function assignLawyerToCon() {
//     clientRouter.post('/users/:conID/lawyer/:id', auth, async (req, res) => {
//         try {
//             const con = await consultations.findById(req.params.conID)
//             if (con.client != req.client.id) {
//                 return res.status(401).send()
//             }
//             const lawyer = await lawyers.findById(req.params.id)
//             if (!lawyer) {
//                 return res.status(404).send()
//             }
//             lawyer.User = lawyer.User.concat({ _id: req.client._id })
//             req.client.lawyers = req.client.lawyers.concat({ _id: req.params.id })
//             lawyer.consultations = lawyer.consultations.concat({ _id: req.params.conID })
//             await lawyer.save()
//             await req.client.save()
//             res.status(200).send(lawyer)
//         } catch (err) {
//             res.status(400).send(err)
//         }
//     })
// }

// assignLawyerToCon()

// //this function is for showing the ability to take the case
// function showAbility(){ // id = the id of concultation
//     lawyerRoute.post('/lawyers/showAbility/:id' , auth , async (req , res ) => {
//         try{
//             const con = await consultations.findById(req.params.id)
//             if(!con){
//                 return res.status(404).send
//             }
//             con.ready_Lawyers = con.ready_Lawyers.concat({_id : req.lawyer._id})
//             await con.save()
//             res.status(200).send(con)
//         }catch(err){
//             res.status(400).send(err)
//         }
//     })
// }

// showAbility()

// function showAbility() { // id = the id of concultation
//     lawyerRoute.post('/lawyers/showAbility/:id', auth, async (req, res) => {
//         try {
//             const con = await consultations.findById(req.params.id)
//             if (!con) {
//                 return res.status(404).send()
//             }
//             if (req.body.value == true) {
//                 con.ready_Lawyers = con.ready_Lawyers.concat({ _id: req.lawyer._id })
//             } else {
//                 con.ready_Lawyers = con.ready_Lawyers.filter((lawyer) => {
//                     return lawyer._id.toString() !== req.lawyer._id.toString()
//                 })
//             }
//             await con.save()
//             res.status(200).send(ready_Lawyers)
//         } catch (err) {
//             res.status(400).send(err)
//         }
//     })
// }

// showAbility()
module.exports = {
    signup,
    login,
    getProfileData,
    updateProfile,
    deleteAccount,
    verifyUser,
    forgetPassword,
    getUserProfileByID
}

// function showAssinedCons() {
//     lawyerRoute.get('/lawyers/consultations', auth, async (req, res) => {
//         try {
//             const cons = await consultations.find({ _id: req.lawyer.consultations })
//             .populate('client').execPopulate()
//             res.status(200).send(cons)
//         } catch (err) {
//             res.status(404).send(err)
//         }
//     })
// }

// showAssinedCons()

// function getRecentCons() {
//     conRouter.get('/recent', async (req, res) => {
//         try {
//             const cons = await consultations.find({ law_type: req.lawyer.lawyer_type })
//             if (!cons) {
//                 return res.status(404).send()
//             }
//             res.status(200).send(cons)

//         } catch (err) {
//             res.status(400).send(err)
//         }

//     })


// }

// getRecentCons()