const Feedback = require('../models/feedback')
const User = require('../models/user')
const { auth } = require('../src/middleware/auth')
const express = require('express')
const rateRouter = new express.Router()

function rateLawyer() {
    rateRouter.post('/rate/:id', auth, async (req, res) => {
        try {
            const lawyer = await User.findById(req.params.id)
            if (!lawyer) {
                return res.status(404).send()
            }
            const count = await Feedback.countDocuments({ user: req.client._id, lawyer: req.params.id })
            if (count >= 1) {
                return res.status(400).send('you already have giveen your feedback!')
            } else {
                const feedback = new Feedback({
                    ...req.body,
                    lawyer: req.params.id,
                    user: req.client._id
                })
                await feedback.save()
                await lawyer.rateRatio()
                res.status(201).send(feedback)
            }
        } catch (err) {
            res.status(400).send(err)
        }
    })
}

rateLawyer()

function showFeedbacks() {
    rateRouter.get('/rate/:id', async (req, res) => {
        try {
            const feedbacks = await Feedback.find({ lawyer: req.params.id })
            if (!feedbacks) {
                return res.status(404).send()
            }
            res.status(200).send(feedbacks)
            // req.app.io.emit('feedback' , feedbacks)
        } catch (err) {
            res.status(400).send(err)
        }
    })
}

showFeedbacks()


module.exports = rateRouter