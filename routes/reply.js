const router = require('express').Router()
const { auth } = require('../src/middleware/auth')
const {
    createReply,
    updateReply,
    deleteReply,
    likeORdisLikeReply
} = require("../controllers/reply")

router.use(auth)
router.route("/")
    .post(auth, createReply)

router.route("/:replyID")
    .put(updateReply)
    .delete(deleteReply)
    .post(likeORdisLikeReply)

module.exports = router

