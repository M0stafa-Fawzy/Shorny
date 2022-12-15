const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const clients = require('../models/user')
const lawyers = require('../models/lawyer')
const admins = require('../models/admin')
const generalAuth = require('../src/middleware/generalAuth')
const actorRoute = new express.Router()


const upload = multer({
    limits: {
        fileSize: 1000000
    }, fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpes|png)$/)) {
            return cb(new Error('picture format not matched , please upload jpg,jpes or png image'))
        }
        cb(undefined, true)
    }
})

function uploadProfilePic() {
    actorRoute.post('/me/profilepicture', generalAuth, upload.single('profilepicture'), async (req, res) => {
        const pic = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
        req.actor.profile_picture = pic
        req.actor.doesHavePicture = true
        await req.actor.save()
        res.send()
    }, (error, req, res, next) => {
        res.status(400).send({ error: error.message })
    })
}

uploadProfilePic()

function showMyProfile() {
    actorRoute.get('/me', generalAuth, async (req, res) => {
        res.send(req.actor)
    })
}

showMyProfile()

function deleteAccount() {
    actorRoute.delete('/me', generalAuth, async (req, res) => {
        try {
            await req.actor.remove()
            // await deleteMail(req.client.email , req.client.name)
            res.send(req.actor)
        } catch (err) {
            res.status(400).send()
        }
    })
}

deleteAccount()

function getClientProfile() {
    actorRoute.get('/users/:id', async (req, res) => {
        try {
            const client = await clients.findById(req.params.id)
            if (!client) {
                return res.status(404).send()
            }
            res.status(200).send(client)
        } catch (err) {
            res.status(404).send(err)
        }
    })
}

getClientProfile()

// function getClientProfileByName() {
//     actorRoute.get('/users/profile/:name', async (req, res) => {
//         try {
//             const client = await clients.find({ name: req.params.name })
//             if (!client) {
//                 return res.status(404).send()
//             }
//             res.status(200).send(client)
//         } catch (err) {
//             res.status(404).send(err)
//         }
//     })
// }

// getClientProfileByName()

// function getLawyerProfile() {
//     actorRoute.get('/lawyers/:id', async (req, res) => {
//         try {
//             const lawyer = await lawyers.findById(req.params.id)
//             if (!lawyer) {
//                 res.status(404).send()
//             }
//             res.status(200).send(lawyer)
//         } catch (err) {
//             res.status(400).send(err)
//         }
//     })
// }

// getLawyerProfile()

// function getLawyerProfileByName() {
//     actorRoute.get('/lawyers/profile/:name', async (req, res) => {
//         try {
//             const lawyer = await lawyers.find({ name: req.params.name })
//             if (!lawyer) {
//                 return res.status(404).send()
//             }
//             res.status(200).send(lawyer)
//         } catch (err) {
//             res.status(404).send(err)
//         }
//     })
// }

// getLawyerProfileByName()


module.exports = actorRoute