const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const clients = require('../models/client')
const lawyers = require('../models/lawyer')
const admins = require('../models/admin')
const generalAuth = require('../src/middleware/generalAuth')
const actorRoute = new express.Router()

function login(){
    actorRoute.post('/login' , async (req , res) => {
        let cli = await clients.findOne({email : req.body.email})
        let lawyer = await lawyers.findOne({email : req.body.email})
        let admin = await admins.findOne({email : req.body.email})

        if(cli){
            try{
                cli = await clients.findByAlternatives(req.body.email , req.body.password)
                const token = await cli.authToken()
                return res.status(200).send({ currentUser : cli , token })
            }catch(err){
                res.status(400).send(err)
            }
        }
        else if(lawyer){
            try{
                lawyer = await lawyers.findByAlternatives(req.body.email , req.body.password)
                const token = await lawyer.authToken()
                return res.status(200).send({ lawyer , token })
            }catch(err){
                res.status(400).send(err)
            }
        }else if(admin){
            try{
                admin = await admins.findByAlternatives(req.body.email , req.body.password)
                const token = await admin.authToken()
                return res.status(200).send({ admin , token })
            }catch(err){
                res.status(400).send(err)
            }
        }else{
            return res.status(400).send()
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
    actorRoute.post('/me/profilepicture' , generalAuth , upload.single('profilepicture') , async (req , res) => {
        const pic = await sharp(req.file.buffer).resize({width : 250 , height : 250}).png().toBuffer()
        req.actor.profile_picture = pic
        req.actor.doesHavePicture = true
        await req.actor.save()
        res.send()
    } , (error , req , res , next) => {
        res.status(400).send({error : error.message})
    })
} 

uploadProfilePic()

function getProfilePic(){
    actorRoute.get('/me/profilepicture' , generalAuth , async (req , res) => {
        try{
            if(!req.actor.profile_picture){
                throw new Error()
            }
            res.set('Content-Type' , 'image/png')
            res.send(req.actor.profile_picture)
        }catch(err){
            res.status(400).send(err)
        }
    })
}

getProfilePic()

function deleteProfilePic(){
    actorRoute.delete('/me/profilepicture' , generalAuth , async (req , res) => {
        req.actor.profile_picture = undefined
        await req.actor.save()
        res.send()
    })
}

deleteProfilePic()

function showMyProfile(){
    actorRoute.get('/me' , generalAuth , async (req , res) => {
        res.send(req.actor)
    })
}

showMyProfile()

function logout(){
    actorRoute.post('/logout', generalAuth , async (req, res)=> {
        try {
          // just remove a index form tokens array
            req.actor.tokens = req.actor.tokens.filter((token) => {
                return token.token !== req.token
            })
            await req.actor.save()
            res.send()
        } catch (err) {
            res.status(400).send()
        }
    })
}

logout()

function logoutAll(){
    actorRoute.post('/logoutAll' , generalAuth , async (req, res) => {
            try {
                req.actor.tokens = []
                await req.actor.save()
                res.send()
            } catch (err) {
                res.status(400).send()
            }
        })
}

logoutAll()

function deleteAccount(){
    actorRoute.delete('/me', generalAuth , async (req, res) => {
        try{
            await req.actor.remove()
            // await deleteMail(req.client.email , req.client.name)
            res.send(req.actor)
        } catch (err) {
            res.status(400).send()
        }
    })
}

deleteAccount() 

function getClientProfile(){
    actorRoute.get('/users/:id' , async (req , res) => {
        try{
            const client = await clients.findById(req.params.id)
            if(!client){
                return res.status(404).send()
            }
            res.status(200).send(client)
        }catch(err){
            res.status(404).send(err)
        }
    })
}

getClientProfile()

function getClientProfileByName(){
    actorRoute.get('/users/profile/:name' , async (req , res) => {
        try{
            const client = await clients.find({name : req.params.name})
            if(!client){
                return res.status(404).send()
            }
            res.status(200).send(client)
        }catch(err){
            res.status(404).send(err)
        }
    })
}

getClientProfileByName()

function getLawyerProfile(){
    actorRoute.get('/lawyers/:id' , async (req , res) => {
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

function getLawyerProfileByName(){
    actorRoute.get('/lawyers/profile/:name' , async (req , res) => {
        try{
            const lawyer = await lawyers.find({ name : req.params.name })
            if(!lawyer){
                return res.status(404).send()
            }
            res.status(200).send(lawyer)
        }catch(err){
            res.status(404).send(err)
        }
    })
}

getLawyerProfileByName()


module.exports = actorRoute