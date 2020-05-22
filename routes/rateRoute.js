const Feedback = require('../models/user_feedback')
const lawyers = require('../models/lawyer')
const auth = require('../src/middleware/clientAuth')
const express = require('express')
const rateRouter = new express.Router()

function rateLawyer(){
    rateRouter.post('/rate/:id', auth , async (req, res) => {
        try{
            const lawyer = await lawyers.findById(req.params.id)
            if(!lawyer){
                return res.status(404).send()
            }
            const feedback = new Feedback({
            ...req.body , 
            lawyer : req.params.id , 
            user : req.client._id
        })
        await feedback.save()
        await lawyer.rateRatio()
        res.status(201).send(feedback)
        }catch(err){
            res.status(400).send(err)
        }
    })
}

rateLawyer()

function showFeedbacks(){
    rateRouter.get('/rate/:id' , async (req, res) => {
        try{
            const feedbacks = await Feedback.find({lawyer : req.params.id})
            if(!feedbacks){
                return res.status(404).send()
            }
            res.status(200).send(feedbacks)
            req.app.io.emit('feedback' , feedbacks)
        }catch(err){
            res.status(400).send(err)
        }
    })
}

showFeedbacks()


module.exports = rateRouter