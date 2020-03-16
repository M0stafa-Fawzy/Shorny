const clients = require('../models/client')
const consultations = require('../models/consultation')
const lawyers = require('../models/lawyer')
const auth = require('../src/middleware/clientAuth')
const {registerMail , deleteMail} = require('../src/emails/email')
const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const clientRouter = new express.Router()


function Signup(){
    clientRouter.post('/users' , async (req , res)=> {
        try{
            const client = new clients(req.body)
            await registerMail(client.email , client.name)
            const token = await client.authToken()
            const role = await client.authToken2()
            await client.save() ; 
            res.status(201).send({client , token , role})
        }catch(err){
            res.status(400).send(err)
        }
    })
}

Signup()




function Login(){
    clientRouter.post('/users/login' , async (req , res) => {
        try{
            const cli = await clients.findByAlternatives(req.body.email , req.body.password)
            const token = await cli.authToken()
            res.status(200).send({ cli , token })
        } catch(err){
            res.status(400).send(err)
        }
    })
}

Login()


const upload = multer({
    limits : {
        fileSize : 1000000
    } , fileFilter (req , file , cb) {
        if(!file.originalname.match(/\.(jpg|jpes|png)$/)){
            return cb(new Error('picture format not matched , please upload jpg,jpes or png image'))
        }
        cb(undefined , true)
    }
})



function uploadProfilePic(){
    clientRouter.post('/users/me/profilepicture' , auth , upload.single('profile pic') , async (req , res) => {
        const pic = await sharp(req.file.buffer).resize({width : 250 , height : 250}).png().toBuffer()
        req.client.profile_picture = pic 
        await req.client.save()
        res.send()
    } , (error , req , res , next) => {
        res.status(400).send({error : error.message})
    })
} 

uploadProfilePic()


function deleteProfilePic(){
    clientRouter.delete('/users/me/profilepicture' , auth , async (req , res) => {
        req.client.profile_picture = undefined
        await req.client.save()
        res.send()
    })
}

deleteProfilePic()


function getProfilePic(){
    clientRouter.get('/users/:id/profilePic' , async (req , res) => {
        try{
            const user = await clients.findById(req.params.id)
            if(!user || !user.profile_picture){
                throw new Error()
            }
            res.set('Content-Type' , 'image/png')
            res.send(user.profile_picture)
        }catch(err){
            res.status(400).send(err)
        }
    })
}

getProfilePic()


function showMyProfile(){
    clientRouter.get('/users/me' , auth , async (req , res) => {
        res.send(req.client)
    })
}

showMyProfile()


function logout(){
    clientRouter.post('/users/logout', auth , async (req, res)=> {
        try {
          // just remove a index form tokens array
            req.client.tokens = req.client.tokens.filter((token) => {
                return token.token !== req.token
            })
            await req.client.save()
            res.send()
        } catch (err) {
            res.status(400).send()
        }
    })
}

logout()


function logoutAll(){
    clientRouter.post('/users/logoutAll' , auth , async (req, res) => {
            try {
                req.client.tokens = []
                await req.client.save()
                res.send()
            } catch (err) {
                res.status(400).send()
            }
        })
}

logoutAll()


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


function deleteAccount(){
    clientRouter.delete('/users/me', auth , async (req, res) => {

        try{
            await req.client.remove()
            await deleteMail(req.client.email , req.client.name)
            res.send(req.client)
        } catch (err) {
            res.status(400).send()
        }
    })
}

deleteAccount() 


function getClientProfile(){
    clientRouter.get('/users/profile/:id' , auth , async (req , res) => {
        try{
            const client = await clients.findById(req.params.id)
            if(!client){
                res.status(404).send()
            }
            res.status(200).send(client)
        }catch(err){
            res.status(400).send(err)
        }
    })
}

getClientProfile()

//it does not work on postman but 

// function getClientProfileByName(){
//     clientRouter.get('/users/profile/:name' , async (req , res) => {
//         try{
//             const client = await clients.find({ name : req.params.name })
//             res.status(200).send(client)
//         }catch(err){
//             res.status(404).send(err)
//         }
//     })
// }

// getClientProfileByName()


function getLawyerProfile(){
    clientRouter.get('/users/lawyerProfile/:id' , auth , async (req , res) => {
        try{
            const lawyer = await lawyers.findById(req.params.id)
            if(!lawyer){
                res.status(404).send()
            }
            res.status(200).send(lawyer)
        }catch(err){
            res.status(400).send(err)
        }
    })
}

getLawyerProfile()



// function makeConsultation(){
//     clientRouter.post('/users/Consultations' , auth , async (req , res) => {
//         const con = new consultations ({
//             ...req.body ,
//             client : req.client._id
//         })
//         try{
//             await con.save()
//             res.status(201).send(con)
//         }catch(err){
//             res.status(400).send(err)
//         }
//     })
// }

// makeConsultation()


// function getConsultation(){
//     clientRouter.get('/users/consultations/:id' , auth , async (req , res) => {
//         try{
//         const con = await consultations.findOne({_id : req.params.id , client : req.client._id })
//         const reps = await replies.find({concultation : req.params.id})
//         if(!con){
//             return res.status(404).send()
//         }
//         res.send({con,reps})
//         }catch(err){
//             res.status(500).send(err)
//         }
//     })
// }

// getConsultation()


// function getAllConsultations(){
//     clientRouter.get('/users/consultations' , auth , async (req , res) => {
//         try{
//         //await req.client.populate('concultations').execPopulate()
//         const cons = await consultations.find({client : req.client._id})
//         if(!cons){
//             return res.status(404).send()
//         }
//         res.send(cons)
//         //res.send(req.client.concultations)
//         }catch(err){
//             res.status(500).send(err)
//         }
//     })
// }

// getAllConsultations()


// function updateConsultation() {
//     clientRouter.patch('/users/Consultations/:id' , auth , async (req ,res) => {
//         const updates = Object.keys(req.body)
//         const allowUpdates = ['law_type' , 'body' , 'title']
//         const isValidOperation = updates.every((update) => allowUpdates.includes(update))
    
//         if(!isValidOperation){
//             return res.status(400).send({error : 'invalid updates '})
//         }
    
//         try {    
//             const con = await consultations.findOne({_id : req.params.id , client : req.client._id})

//             if(!con){
//                 return res.status(404).send()
//             }

//             updates.forEach((update) => con[update] = req.body[update])
//             await con.save()
//             res.send(con) 
//             }catch (err) {   
//             res.status(400).send(err) 
//         }
//     })

// }

// updateConsultation()


// don not use con.remove() method because ther is an warning
// function deleteConsultation() {
//     clientRouter.delete('/users/Consultations/:id', auth , async (req , res)=> {
//         try{
//             const con = await consultations.findByIdAndDelete({_id : req.params.id , client : req.client._id})
//             if(!con){
//                 return res.status(404).send()
//             }
//             res.send(con)
//         }catch(err){
//             res.status(500).send()
//         }
//     })
// }

// deleteConsultation() 


// // don not use con.remove() method because ther is an warning
// function deleteAllConsultations() {
//     clientRouter.delete('/users/Consultations', auth , async (req , res)=> {
//         try{
//             const cons = await consultations.deleteMany({client : req.client._id})
//             if(!cons){
//                 res.status(404).send()
//             }
//             res.send(cons)
//         }catch(err){
//             res.status(500).send(err)
//         }
//     })
// }

// deleteAllConsultations() 




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
            res.status(200).send(laws)
        }catch(err){
            res.status(404).send(err)
        }
    })
}

showAssinedLawyer()



module.exports = clientRouter 