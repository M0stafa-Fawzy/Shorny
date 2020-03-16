const express = require('express')
const replyRouter = new express.Router()
const lawyers = require('../models/lawyer')
const lawyerAuth = require('../src/middleware/lawyerAuth')
const consultations = require('../models/consultation')
const replies = require('../models/replies')

function replayConsultation(){
    replyRouter.post('/consultations/:id/replies', lawyerAuth , async (req , res) => {
        const rep = new replies({
            ...req.body , 
            consultation : req.params.id , 
            lawyer : req.lawyer._id
        })
        try{
            await (await rep.save()).populate('consultation lawyer').execPopulate()
            res.status(201).send(rep)
        }catch(err){
            res.status(400).send(err)
        }
    }) 
}

replayConsultation()


function updateReply(){
    replyRouter.patch('/replies/:id' , lawyerAuth , async (req , res) => {
        const updates = Object.keys(req.body)
        const allowUpdates = ['body']
        const isValidOperation = updates.every((update) => allowUpdates.includes(update))
    
        if(!isValidOperation){
            return res.status(400).send({error : 'invalid updates '})
        }

        try {   
            const rep = await replies.findOne({_id : req.params.id , lawyer : req.lawyer._id}) 
            if(!rep){
                return res.status(404).send()
            }
            updates.forEach((update) => rep[update] = req.body[update] )
            await rep.save()
    
            res.send(rep) 
            }catch (err) {   
            res.status(400).send(err) 
        }
    })
}

updateReply()


function deleteReply(){// id belongs to the reply itself
    replyRouter.delete('/replies/:id' , lawyerAuth , async (req , res) => {
        try{
            const rep = await replies.findOne({_id : req.params.id , lawyer : req.lawyer.id})
            await rep.remove()
            res.status(200).send(rep)
        }catch(err){
            res.status(404).send(err)
        }
    })
}

deleteReply()


function repliesCount(){ // every actor can do it so it does not need to sit under auth
    replyRouter.get('/replies/:id/count' , async (req , res) => {
        try{
            const numberOfReps = await replies.countDocuments({consultation : req.params.id}) 
            if(!numberOfReps){
                res.status(404).send()
            }
            res.status(200).json(numberOfReps)
        }catch(err){
            replies.status(400).send(err)
        }

    })
}

repliesCount()



function getAllReplies(){ // every actor can do it so it does not need to sit under auth
    replyRouter.get('/consultations/:id/replies' , async (req , res) => {
        try{
            const reps = await replies.find({consultation : req.params.id})
            if(!reps){
                res.status(404).send()
            }
            res.status(200).send(reps)
        }catch(err){
            res.status(400).send(err)
        }
    })
}

getAllReplies()


function likeReply() {
    replyRouter.post('/replies/:id/likes' , async (req , res) => {
        try{
            const reply = await replies.findById(req.params.id)
            reply.likes ++
            await reply.save()
            res.status(200).send(reply)
        }catch(err){
            res.status(400).send()
        }
    })
}

likeReply()


function dislikeReply() {
    replyRouter.post('/replies/:id/dislikes' , async (req , res) => {
        try{
            const reply = await replies.findById(req.params.id)
            reply.dislikes ++
            await reply.save()
            res.status(200).send(reply)
        }catch(err){
            res.status(400).send()
        }
    })
}

dislikeReply()


module.exports = replyRouter