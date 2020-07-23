const userAuth = require('../src/middleware/clientAuth')
const auth = require('../src/middleware/generalAuth')
const consultations = require('../models/consultation')
const lawyers = require('../models/lawyer')
const express = require('express')
const conRouter = new express.Router()

function makeConsultation(){
    conRouter.post('/consultations' , userAuth , async (req , res) => {
        try{
            const con = new consultations({
                ...req.body , 
                client : req.client._id ,
            })
            await con.save()
            res.status(201).send(con)
        }catch(err){
            res.status(400).send(err)
        }
    })
}

makeConsultation()



function getConsCount(){
    conRouter.get('/consultations/count' , userAuth , async (req , res) => {
        try{
            const NOcons = await consultations.countDocuments({client : req.client.id})
            res.status(200).json(NOcons)
        }catch(err){
            res.status(400).send()
        }
    })
}

getConsCount()


function getAllConcultations(){
    conRouter.get('/consultations' , userAuth , async (req , res) => {
        try{
            const cons = await consultations.find({client : req.client._id})
            res.status(200).send(cons)
        }catch(err){
            res.status(404).send(err)
        }
    })
}

getAllConcultations()


function getConcultation(){
    conRouter.get('/consultations/:id' , userAuth , async (req , res) => {
        try{
            const con = await consultations.findOne({_id : req.params.id , client : req.client._id})
            if(!con){
                return res.status(404).send()
            }
            res.status(200).send(con)
        }catch(err){
            res.status(400).send(err)
        }
    })
}

getConcultation()


function updateConsultation() {
    conRouter.patch('/consultations/:id' , userAuth , async (req ,res) => {
        const updates = Object.keys(req.body)
        const allowUpdates = ['law_type' , 'body' , 'title']
        const isValidOperation = updates.every((update) => allowUpdates.includes(update))
    
        if(!isValidOperation){
            return res.status(400).send({error : 'invalid updates '})
        }
    
        try {    
            const con = await consultations.findOne({_id : req.params.id , client : req.client._id})

            if(!con){
                return res.status(404).send()
            }

            updates.forEach((update) => con[update] = req.body[update])
            await con.save()
            res.send(con) 
           // req.app.io.emit('updateCon' , con)
            }catch (err) {   
            res.status(400).send(err) 
        }
    })

}

updateConsultation()

// do not use findByIdAndDelete because there is an error
function deleteConsultation() {
    conRouter.delete('/consultations/:id', userAuth , async (req , res)=> {
        try{
            const con = await consultations.findOne({_id : req.params.id , client : req.client._id})
            if(!con){
                return res.status(404).send()
            }
            await con.remove()
            res.status(200).send(con)
           // req.app.io.emit('deleteCon' , con)
        }catch(err){
            res.status(500).send()
        }
    })
}

deleteConsultation() 


// don not use con.remove() method because ther is an warning
function deleteAllConsultations() {
    conRouter.delete('/consultations', userAuth , async (req , res)=> {
        try{
            const cons = await consultations.deleteMany({client : req.client._id})
            if(!cons){
               return res.status(404).send()
            }
            res.status(200).send(cons)
           // req.app.io.emit('deleteAllCons' , cons)
        }catch(err){
            res.status(500).send(err)
        }
    })
}

deleteAllConsultations() 


function likeCon() {
    conRouter.post('/consultations/:id/like' , userAuth , async (req , res) => {
        try{
            const con = await consultations.findById(req.params.id)
            const like = req.body
            if(like){
                con.likes.push(req.client._id)
            }else{
                con.likes = con.likes.filter((like) => {
                    return like.userId !== req.client._id
                })
            }
            await con.save()
            res.status(200).send(con.likes)
           // req.app.io.emit('likeCon' , con)
        }catch(err){
            res.status(400).send()
        }
    })
}

likeCon()


function dislikeCon() {
    conRouter.post('/consultations/:id/dislikes' , async (req , res) => {
        try{
            const con = await consultations.findById(req.params.id)
            con.dislikes ++
            await con.save()
            res.status(200).send(con)
           // req.app.io.emit('dislikeCon' , con)
        }catch(err){
            res.status(400).send()
        }
    })
}

dislikeCon()

function getAvailableLawyers(){
    conRouter.get('/consultations/:id/AvailableLawyers' , userAuth , async (req , res) => {
        try{
            const con = await consultations.findById(req.params.id)
            if(!con || con.client != req.client.id ){
                return res.status(404).send()
            }
            const avaiLawyers = await lawyers.find({_id : con.ready_Lawyers})
            res.status(200).send(avaiLawyers)
        }catch(err){
            res.status(400).send()
        }
    })
}

getAvailableLawyers()


module.exports = conRouter