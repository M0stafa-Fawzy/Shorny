const clients = require('../models/client')
const consultations = require('../models/consultation')
const lawyers = require('../models/lawyer')
const admins = require('../models/admin')
const auth = require('../src/middleware/clientAuth')
const {registerMail , deleteMail , verificationMail } = require('../src/emails/email')
const express = require('express')
const clientRouter = new express.Router()


function Signup(){
    clientRouter.post('/users' , async (req , res)=> {
        try{
            const client = new clients(req.body)
           // await registerMail(client.email , client.name)
            const token = await client.authToken()
            await client.authToken2()
            await client.save() ; 
            res.status(201).send({currentUser : client , token})
        }catch(err){
            res.status(400).send(err)
        }
    })
}

Signup()



function forgetAccount(){
    clientRouter.post('/users/login/identify' , async (req , res) => {
        try{
            const user = await clients.findOne({email : req.body.email})

            if(!user){
                return res.status(404).send('Your search did not return any results. Please try again with other information')
            }

            const code = Math.random().toString(20).substr(2 , 7)

            await verificationMail(req.body.email , code)

            user.accessCode = code
            await user.save()

            res.status(200).send(user)
        } catch(err){
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

function checkVerificationCode(){
    clientRouter.post('/users/login/validate' , async (req, res) => {
        try{
            const user = await clients.findOne({accessCode : req.body.accessCode})

            if(!user){
                return res.status(404).send()
            }

            await user.authToken()
            return res.status(200).send(user)
        }catch(err){
            res.status(400).send(err)
        }

    })

}

checkVerificationCode()

// function getProfilePic(){
//     clientRouter.get('/lawyers/:id/profilePic' , async (req , res) => {
//         try{
//             const lawyer = await lawyers.findById(req.params.id)
//             if(!lawyer || !lawyer.profile_picture){
//                 throw new Error()
//             }
//             res.set('Content-Type' , 'image/png')
//             res.send(lawyer.profile_picture)
//         }catch(err){
//             res.status(400).send(err)
//         }
//     })
// }

// getProfilePic()

function updateProfile() {
    clientRouter.patch('/users/me', auth , async (req, res) => {
        const updates = Object.keys(req.body) // convert my req.body object to an array of its properties
        const allowUpdates = ['name' , 'email' , 'password' , 'phoneNumber']
        const isValidOperation = updates.every((update) => allowUpdates.includes(update))
    
        if(!isValidOperation){
            return res.status(500).send({error : 'invalid updates '})
        }
    
        try {    
            updates.forEach((update) => req.client[update] = req.body[update] )
            await req.client.save()
            res.send(req.client) 
            }catch (err) {   
            res.status(400).send(err) 
        }
    })
}

updateProfile()



function sarchByRate(){
    clientRouter.get('/users/rateSearch/:rate' , async (req , res) => {
        try{
            const lawys = await lawyers.find({rate : req.params.rate})
            res.send(lawys)
        }catch(err){
            res.status(400).send()
        }
    })
}

sarchByRate()


function sarchByLawyerType(){
    clientRouter.get('/users/Typesearch/:type' , async (req , res) => {
        try{
            const lawys = await lawyers.find({lawyer_type : req.params.type})
            if(!lawys){
                return res.status(404).send()
            }
            res.status(200).send(lawys)
        }catch(err){
            res.status(400).send()
        }
    })
}

sarchByLawyerType()


function sarchByLawyerAddress(){
    clientRouter.get('/users/addressSearch/:address' , async (req , res) => {
        try{
            const lawys = await lawyers.find({address : req.params.address})
            if(!lawys){
                return res.status(404).send()
            }
            res.status(200).send(lawys)
        }catch(err){
            res.status(400).send()
        }
    })
}

sarchByLawyerAddress()


function generalSearch(){
    clientRouter.get('/users/search/:town/:region/:type/:rate' , async (req , res) => {
        try{
            const lawys = await lawyers.find({town : req.params.town , region : req.params.region , lawyer_type : req.params.type , rate : req.params.rate})
            if(!lawys){
                return res.status(404).send()
            }
            res.send(lawys)
        }catch(err){
            res.status(400).send()
        }
    })
}

generalSearch()


function showReadyLawyer(){
    clientRouter.get('/users/ready/:id' , auth , async (req , res) => {
        try{
            const con = await consultations.findOne({ _id : req.params.id , client : req.client._id})
            if(!con){
                return res.status(404).send()
            }
            const readr_Lawyers = await lawyers.find({_id : con.ready_Lawyers})
            if(!readr_Lawyers){
                return res.status(404).send()
            }
            res.status(200).send(readr_Lawyers)
        }catch(err){
            res.status(400).send(err)
        }
    })
}

showReadyLawyer()



function assignLawyerToCon(){
    clientRouter.post('/users/:conID/lawyer/:id' , auth , async (req , res) => {
        try{
            const con = await consultations.findById(req.params.conID)
            if(con.client != req.client.id ){
                return res.status(401).send()
            }
            const lawyer = await lawyers.findById(req.params.id)
            if(!lawyer){
                return res.status(404).send()
            }
            lawyer.clients = lawyer.clients.concat({_id : req.client._id})
            req.client.lawyers = req.client.lawyers.concat({_id : req.params.id})
            lawyer.consultations = lawyer.consultations.concat({_id : req.params.conID})
            await lawyer.save()
            await req.client.save()
            res.status(200).send(lawyer)
        }catch(err){
            res.status(400).send(err)
        }
    })
}

assignLawyerToCon()


function showAssinedLawyer(){
    clientRouter.get('/users/me/lawyers' , auth , async (req , res) => {
        try{
            const laws = await lawyers.find({_id : req.client.lawyers})
            if(!laws){
                return res.status(404).send()
            }
            res.status(200).send(laws)
        }catch(err){
            res.status(404).send(err)
        }
    })
}

showAssinedLawyer()





//  clientRouter.get('/rate/:id' , async (req,res) => {
//     const t = await lawyers.findById(req.params.id)
//     await t.rateRatio()
//     res.json('tt')
//  })

//  clientRouter.get('/rate' , async (req,res) => {
//     const typesss = await lawyers.find()
//     var x = []
//     for(var i=0 ; i<typesss.length ; i++){
//         x[i] = typesss[i].lawyer_type
//     }
//     res.send(x)
//  })

// clientRouter.get('/test' , async function (req , mo) {
//     const cli = await clients.find({role : "user"}).select('email name')
//     mo.json(cli)
//     console.log(cli)
// })


module.exports = clientRouter 