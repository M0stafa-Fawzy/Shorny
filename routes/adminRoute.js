const admins = require('../models/admin')
const lawyers = require('../models/lawyer')
const clients = require('../models/client')
const concultations = require('../models/consultation')
const auth = require('../src/middleware/adminAuth')
const {registerMail , deleteMail} = require('../src/emails/email')
const multer = require('multer')
const sharp = require('sharp')
const express = require('express')

const adminRouter = new express.Router()


// function login(){ // Done
//     adminRouter.post('/admins/login' , async (req , res) => {
//         try{
//             const admin = await admins.findByAlternatives(req.body.email , req.body.password)
//             const token = await admin.authToken()
//             res.status(200).send({admin , token})
//         } catch(err){
//             res.send(err)
//         }
//     })
// }

// login()


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
    adminRouter.post('/admins/me/profilepicture' , auth , upload.single('profilepicture') , async (req , res) => {
        const pic = await sharp(req.file.buffer).resize({width : 250 , height : 250}).png().toBuffer()
        req.admin.profile_picture = pic 
        req.admin.doesHavePicture = true
        await req.admin.save()
        res.send()
    } , (error , req , res , next) => {
        res.status(400).send({error : error.message})
    })
} 

uploadProfilePic()


function deleteProfilePic(){
    adminRouter.delete('/admins/me/profilepicture' , auth , async (req , res) => {
        req.admin.profile_picture = undefined
        await req.admin.save()
        res.send()
    })
}

deleteProfilePic()


function getProfilePic(){
    adminRouter.get('/admins/:id/profilePic' , async (req , res) => {
        try{
            const admin = await admins.findById(req.params.id)
            if(!admin || !admin.profile_picture){
                throw new Error()
            }
            res.set('Content-Type' , 'image/png')
            res.send(admin.profile_picture)
        }catch(err){
            res.status(400).send(err)
        }
    })
}

getProfilePic()



function logout(){ // Done
    adminRouter.post('/admins/logout' , auth , async (req , res) => {
        try {
            // just remove a index form tokens array
            req.admin.tokens = req.admin.tokens.filter((token) => {
            return token.token !== req.token
            })
            await req.admin.save()
            res.send()
        } catch (err) {
            res.status(400).send()
        }
    })
}

logout()


function showMyProfile(){
    adminRouter.get('/admins/me' , auth , async (req , res) => {
        res.send(req.admin)
    })
}

showMyProfile()


function updateProfile(){ // Done 
    adminRouter.patch('/admins/me' , auth , async (req , res ) => {
        const updates = Object.keys(req.body)
        const allowUpdates = ['name' , 'phoneNumber' , 'password' , 'email'  ]
        const isValidOperation = updates.every((update) => allowUpdates.includes(update))

        if(!isValidOperation){
            return res.status(400).send({error : 'invalid updates '})
        }

        try {    
            const admin = await admins.findById(req.params.id)
            updates.forEach((update) => admin[update] = req.body[update] )
            await admin.save()
            //const admin = await Users.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }) 
            if (!admin) {      
            return res.status(404).send()     
            } 
    
            res.send(admin) 
            }catch (err) {   
            res.status(400).send(err) 
        }

    })
}

updateProfile()


function deleteAccount(){ // done
    adminRouter.delete('/admins/me' , auth , async (req , res) => {
        try{
            await req.admin.remove()
            await deleteMail(req.admin.email , req.admin.name)
            res.send()
        }catch(err){
            res.status(400).send(err)
        }
    })
}

deleteAccount()


function showAllAdmins(){ // done
    adminRouter.get('/admins' , auth , async (req , res ) => {
        try {
            const Admins = await admins.find()
            if(!Admins){
                res.status(404).send()
            }
            res.send(Admins)
        }catch(err){
            res.status(400).send(err)
        }
    })
}

showAllAdmins()



function addAdmin(){
    adminRouter.post('/admins/addAdmin' , auth , async (req , res) => {
            try{
                const admin = new admins(req.body)
                //await registerMail(admin.email , admin.name)
                const token = await admin.authToken()
                await admin.authToken2()
                await admin.save()
                res.status(201).send({currentUser : admin , token })
            }catch(err){
                res.status(400).send(err)
            }
    })
}

addAdmin()


function addUser(){ // done
    adminRouter.post('/admins/user' , auth , async (req , res) => {
        try{
            const cli = new clients(req.body)
            const token = await cli.autnToken()
            const roletoken = await cli.autnToken2()
            await cli.save()
            res.status(201).send({ cli , token , roletoken})
        }catch(err){
            res.status(400).send(err)
        }
    })
}

addUser()


function deleteClient(){
    adminRouter.delete('/admins/user/:id' , auth , async (req , res) => {
        try{
            const client = await clients.findById(req.params.id)
            if(!client){
                res.status(404).send()
            }
            await client.remove()
            res.status(200).send()
        }catch(err){
            res.status(400).send(err)
        }
    })
}
deleteClient()


function showAllClients(){
    adminRouter.get('/admins/users' , auth , async (req , res ) => {
        try{
            const clis = await clients.find()
            if(!clis){
                res.status(404).send()
            }
            res.status(200).send(clis)
        }catch(err){
            res.status(404).send(err)
        }
    })
}
showAllClients()


function addLawyer(){
    adminRouter.post('/admins/lawyer' , auth , async (req , res) => {
        try{
            const lawyer = new lawyers(req.body)
            const token = await lawyer.autnToken()
            const roletoken = await lawyer.autnToken2()
            await lawyer.save()
            res.status(201).send({lawyer, token , roletoken})

        }catch(err){
            res.status(400).send(err)
        }
    })
}

addLawyer()



function deleteLawyer(){
    adminRouter.delete('/admins/lawyer/:id' , auth , async (req , res) => {
        try{
            const lawyer = await lawyers.findById(req.params.id)
            if(!lawyer){
                res.status(404).send()
            }
            await lawyer.remove()
            res.send()
        }catch(err){
            res.status(400).send(err)
        }
    })
}

deleteLawyer()


function showAllLawyers(){
    adminRouter.get('/admins/Lawyers' , auth , async (req , res ) => {
            try{
                const lawys = await lawyers.find()
                if(!lawys){
                    res.status(404).send()
                }
                res.status(200).send(lawys)
            } catch(err){
                res.status(400).send(err)
            }
    })
}

showAllLawyers()


function getConsByClientID(){
    adminRouter.get('/admins/cons/:id', auth , async (req , res) => {
        try{
            const cons = await concultations.find({client : req.params.id})
            if(!cons){
                res.status(404).send()
            }
            res.status(200).send(cons)
        }catch(err){
            res.status(400).send(err)
        }
    })
}

getConsByClientID()


// function getClientByCon(){
//     adminRouter.get('/admins/user/:id' , async (req , res) => {
//         try{
//             const con = await concultations.findById(req.params.id)
//             const cli = await con.populate('client').execPopulate()
//             res.status(200).send(cli)
//         }catch(err){
//             res.status(404).send(err)
//         }
//     })
// }

// getClientByCon()


module.exports = adminRouter 