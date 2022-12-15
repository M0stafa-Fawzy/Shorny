const express = require('express')
const lawyers = require('../models/lawyer')
const clients = require('../models/user')
const consultations = require('../models/consultation')
const auth = require('../src/middleware/lawyerAuth')
const generalAuth = require('../src/middleware/generalAuth')
const { registerMail, deleteMail, verificationMail } = require('../src/emails/email')
const multer = require('multer')
const sharp = require('sharp')
const lawyerRoute = new express.Router()

function signup() {
    lawyerRoute.post('/lawyers', async (req, res) => {
        try {
            const lawyer = new lawyers(req.body)
            // await registerMail(lawyer.email , lawyer.name)
            const token = await lawyer.authToken()
            await lawyer.authToken2()
            await lawyer.save()
            res.status(201).send({ currentUser: lawyer, token })

        } catch (err) {
            res.status(400).send(err)
        }
    })
}

signup()


function forgetAccount() {
    lawyerRoute.post('/lawyers/login/identify', async (req, res) => {
        try {
            const lawyer = await lawyers.findOne({ email: req.body.email })

            if (!lawyer) {
                return res.status(404).send('Your search did not return any results. Please try again with other information')
            }

            const code = Math.random().toString(20).substr(2, 7)
            await verificationMail(req.body.email, code)

            lawyer.accessCode = code
            await lawyer.save()

            res.status(200).send(lawyer)
        } catch (err) {
            res.status(400).send(err)
        }
    })
}

forgetAccount()

// function generateVerificationCode(){
//     clientRouter.post('/users/login/identify' , async (req, res) => {
//         try{

//             const user = await clients.findById(req.body.email)
//             const code = Math.random().toString(20).substr(2 , 7)

//             await verificationMail(req.body.email , code)

//             user.accessCode = code
//             await user.save()

//             res.send(user)
//         }catch(err){
//             res.status(400).send(err)
//         }

//     })
// }

// generateVerificationCode()

function checkVerificationCode() {
    lawyerRoute.post('/lawyers/login/validate', async (req, res) => {
        try {
            const lawyer = await lawyers.findOne({ accessCode: req.body.accessCode })

            if (!lawyer) {
                return res.status(404).send()
            }

            await lawyer.authToken()
            return res.status(200).send(lawyer)
        } catch (err) {
            res.status(400).send(err)
        }

    })

}

checkVerificationCode()

function updatePassword() {
    lawyerRoute.post('/lawyers/changepassword', async (req, res) => {
        try {

            const lawyer = await lawyers.findOne({ email: req.body.email })
            lawyer.password = req.body.password

            await lawyer.save()
            res.status(200).send(lawyer)

        } catch (err) {
            res.send(400).send(err)
        }
    })

}

updatePassword()



function updateProfile() {
    lawyerRoute.patch('/lawyers/me', auth, async (req, res) => {
        const updates = Object.keys(req.body)
        const allowUpdates = ['name', 'phoneNumber', 'password', 'email', 'lawyer_type', 'status', 'twitter_link', 'facebook_link']
        const isValidOperation = updates.every((update) => allowUpdates.includes(update))

        if (!isValidOperation) {
            return res.status(400).send({ error: 'invalid updates ' })
        }

        try {
            updates.forEach((update) => req.lawyer[update] = req.body[update])
            await req.lawyer.save()

            res.status(200).send(req.lawyer)
        } catch (err) {
            res.status(400).send(err)
        }
    })
}

updateProfile()


function getLawyerProfileByName() {
    lawyerRoute.get('/lawyers/profile/:name', async (req, res) => {
        try {
            const lawyer = await lawyers.find({ name: req.params.name })
            if (!lawyer) {
                res.status(404).send()
            }
            res.status(200).send(lawyer)
        } catch (err) {
            res.status(400).send(err)
        }
    })
}

getLawyerProfileByName()


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


function showAbility() { // id = the id of concultation
    lawyerRoute.post('/lawyers/showAbility/:id', auth, async (req, res) => {
        try {
            const con = await consultations.findById(req.params.id)
            if (!con) {
                return res.status(404).send()
            }
            if (req.body.value == true) {
                con.ready_Lawyers = con.ready_Lawyers.concat({ _id: req.lawyer._id })
            } else {
                con.ready_Lawyers = con.ready_Lawyers.filter((lawyer) => {
                    return lawyer._id.toString() !== req.lawyer._id.toString()
                })
            }
            await con.save()
            res.status(200).send(ready_Lawyers)
        } catch (err) {
            res.status(400).send(err)
        }
    })
}

showAbility()


function showAssinedCons() {
    lawyerRoute.get('/lawyers/consultations', auth, async (req, res) => {
        try {
            const cons = await consultations.find({ _id: req.lawyer.consultations })
            //await cons.populate('client').execPopulate()
            res.status(200).send(cons)
        } catch (err) {
            res.status(404).send(err)
        }
    })
}

showAssinedCons()



function showAssingerClients() {
    lawyerRoute.get('/lawyers/users', auth, async (req, res) => {
        try {
            const clis = req.lawyer.clients
            //await clis.populate('clients').execPopulate()
            const clins = await clients.find({ _id: clis })
            res.status(200).send(clins)
        } catch (err) {
            res.status(404).send()
        }
    })
}

showAssingerClients()


function changeStatus() {
    lawyerRoute.post('/lawyers/status', auth, async (req, res) => {
        try {
            req.lawyer.status = req.body.status
            await req.lawyer.save()
            res.status(200).send(req.lawyer)
        } catch (err) {
            res.status(400).send(err)
        }
    })
}

changeStatus()



module.exports = lawyerRoute 