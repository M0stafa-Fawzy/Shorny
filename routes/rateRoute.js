const express = require('express')
const rateRouter = new express.Router()
const auth = require('../src/middleware/clientAuth')
const lawyers = require('../models/lawyer')
const feedback = require('../models/user_feedback')

function rateLawyer(){
    rateRouter.post('/rate/:id' , auth , async (req , res) => {
        try{
            const feedBack = new feedback({
                ...req.body ,
                lawyer : req.params.id , 
                user : req.client._id
            })
            const lawyer = await lawyers.findById(req.params.id)
            await feedBack.save()
            await lawyer.rateRatio()
            res.status(201).send(feedBack)
        }catch(err){
            res.status(400).send(err)
        }
    })
}

rateLawyer()


function showfeedbacks(){
    rateRouter.get('/rate/:id', async (req , res) => {
        try{
            const feedBacks = await feedback.find({lawyer:req.params.id})
            if(!feedBacks){
                return res.status(404).send()
            }
            res.status(200).send(feedBacks)
        }catch(err){
            res.status(400).send(err)
        }
    })
}

showfeedbacks()


module.exports = rateRouter