const express = require('express')
const lawyers = require('../models/lawyer')
const clients = require('../models/client')
const consultations = require('../models/consultation')
const auth = require('../src/middleware/lawyerAuth')
const {registerMail , deleteMail} = require('../src/emails/email')
const multer = require('multer')
const sharp = require('sharp')
const lawyerRoute = new express.Router()

function signup() {
    lawyerRoute.post('/lawyers' , async (req ,res) => {
        try{
            const lawyer = new lawyers(req.body)
            await registerMail(lawyer.email , lawyer.name)
            const token = await lawyer.authToken()
            const roleToken = await lawyer.authToken2()
            await lawyer.save()
            res.status(201).send({ lawyer , token , roleToken})

        }catch(err){
            res.status(400).send(err)
        }
    })
}

signup()



function login() {
    lawyerRoute.post('/lawyers/login' , async (req , res) => {
        try{
            const lawyer = await lawyers.findByAlternatives(req.body.email , req.body.password)
            const token = await lawyer.authToken()
                res.status(200).send({lawyer , token})
        }catch(err){
            res.status(400).send(err)
        }
    })
}

login()


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
    lawyerRoute.post('/lawyers/me/profilepicture' , auth , upload.single('profile pic') , async (req , res) => {
        const pic = await sharp(req.file.buffer).resize({width : 250 , height : 250}).png().toBuffer()
        req.lawyer.profile_picture = pic 
        await req.lawyer.save()
        res.send()
    } , (error , req , res , next) => {
        res.status(400).send({error : error.message})
    })
} 

uploadProfilePic()


function deleteProfilePic(){
    lawyerRoute.delete('/lawyers/me/profilepicture' , auth , async (req , res) => {
        req.lawyer.profile_picture = undefined
        await req.lawyer.save()
        res.send()
    })
}

deleteProfilePic()


function getProfilePic(){
    lawyerRoute.get('/lawyers/:id/profilePic' , async (req , res) => {
        try{
            const lawyer = await lawyers.findById(req.params.id)
            if(!lawyer || !lawyer.profile_picture){
                throw new Error()
            }
            res.set('Content-Type' , 'image/png')
            res.send(lawyer.profile_picture)
        }catch(err){
            res.status(400).send(err)
        }
    })
}

getProfilePic()


function showMyProfile(){
    lawyerRoute.get('/lawyers/me' , auth , (req , res) => {
        res.send(req.lawyer)
    })
}

showMyProfile()


function logout(){
    lawyerRoute.post('/lawyers/logout', auth , async (req , res) => {
        try {
            // just remove a index form tokens array
              req.lawyer.tokens = req.lawyer.tokens.filter((token) => {
                  return token.token !== req.token
              })
              await req.lawyer.save()
              res.status(200).send()

          } catch (err) {
              res.status(400).send()
          }
    })
}

logout()


function logoutAll(){
    lawyerRoute.post('/lawyers/logoutAll', auth , async (req , res) => {
        try {
            req.lawyer.tokens = []
            await req.lawyer.save()
            res.send()
        } catch (err) {
            res.status(400).send()
        }
    })

}

logoutAll()


function updateProfile(){
    lawyerRoute.patch('/lawyers/me' , auth , async (req , res) => {
        const updates = Object.keys(req.body)
        const allowUpdates = ['name' , 'phoneNumber' , 'password' , 'email' , 'lawyer_type' , 'status']
        const isValidOperation = updates.every((update) => allowUpdates.includes(update))
    
        if(!isValidOperation){
            return res.status(400).send({error : 'invalid updates '})
        }
    
        try {    
            updates.forEach((update) => req.lawyer[update] = req.body[update] )
            await req.lawyer.save()
    
            res.status(200).send(req.lawyer) 
            }catch (err) {   
            res.status(400).send(err) 
        }
    })
}

updateProfile()


function deleteAccount(){
    lawyerRoute.delete('/lawyers/me' , auth , async (req , res) => {
        try{
            await req.lawyer.remove()
            await deleteMail(req.lawyer.email , req.lawyer.name)
            res.send(req.lawyer)
        } catch (err) {
            res.status(500).send()
        }
    })
}

deleteAccount()

function getClientProfile(){
    lawyerRoute.get('/lawyers/userProfile/:id' , auth , async (req , res) => {
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


function getLawyerProfile(){
    lawyerRoute.get('/lawyers/profile/:id' , auth , async (req , res) => {
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

function likeConsultation(){
    lawyerRoute.post('/consultations/like' , (req , res) => {

    })

}

likeConsultation()


function disLikeConcultation(){
    lawyerRoute.post('/consultations/dislike' , (req , res) => {
        
    })
}

disLikeConcultation()


// function replyConcultation(){ // the id is belong to concultation
//     lawyerRoute.post('/lawyers/consultations/:id/replies' , auth , async (req , res) => {
//         try{
//             const rep = new replies({
//                 ...req.body , 
//                 lawyer : req.lawyer._id ,
//                 concultation : req.params.id
//             })
//             await (await rep.save()).populate('concultation lawyer').execPopulate()
//             res.status(201).send(rep)
//         }catch(err){
//             res.status(500).send(err)
//         }
//     })
// }

// replyConcultation()


// function deleteReply(){// the id is elong to the reply itself
//     lawyerRoute.delete('/lawyers/consultations/:id/replies/:replyid' , auth , async (req , res) => {
//         try{
//             const rep = await replies.findOne({_id : req.params.id , lawyer : req.lawyer.id})
//             await rep.remove()
//             res.status(200).send()
//         }catch(err){
//             res.status(404).send(err)
//         }
//     })
// }

// deleteReply()


// function updateReply(){
//     lawyerRoute.patch('/lawyers/consultations/:id/replies/:replyid' , auth , async (req , res) => {
//         const updates = Object.keys(req.body)
//         const allowUpdates = ['body']
//         const isValidOperation = updates.every((update) => allowUpdates.includes(update))
    
//         if(!isValidOperation){
//             return res.status(400).send({error : 'invalid updates '})
//         }

//         try {   
//             const rep = await replies.findOne({_id : req.params.id , lawyer : req.lawyer.id}) 
//             if(!rep){
//                 return res.status(404).send()
//             }
//             updates.forEach((update) => rep[update] = req.body[update] )
//             await rep.save()
    
//             res.send(rep) 
//             }catch (err) {   
//             res.status(400).send(err) 
//         }
//     })
// }

// updateReply()


// this function is for showing the ability to take the case
function showAbility(){ // id = the id of concultation
    lawyerRoute.post('/lawyers/showAbility/:id' , auth , async (req , res ) => {
        try{
            const con = await consultations.findById(req.params.id)
            con.ready_Lawyers = con.ready_Lawyers.concat({_id : req.lawyer.id})
            await con.save()
            res.status(200).send(con)
        }catch(err){
            res.status(400).send(err)
        }
    })
}

showAbility()


function showAssinedCons(){
    lawyerRoute.get('/lawyers/consultations' , auth , async (req , res) => {
        try{
            const cons = await consultations.find({_id : req.lawyer.consultations})
            //await cons.populate('client').execPopulate()
            res.status(200).send(cons)
        }catch(err){
            res.status(404).send(err)
        }
    })
}

showAssinedCons()



function showAssingerClients(){
    lawyerRoute.get('/lawyers/users' , auth , async (req , res) => {
        try{
            const clis = req.lawyer.clients
            //await clis.populate('clients').execPopulate()
            const clins = await clients.find({_id : clis})
            res.status(200).send(clins)
        }catch(err){
            res.status(404).send()
        }
    })
}

showAssingerClients()




module.exports = lawyerRoute 