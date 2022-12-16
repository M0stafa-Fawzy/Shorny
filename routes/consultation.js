const router = require('express').Router()
const {
    createConsultation,
    getMyConsultation,
    getSingleConsultation,
    updateConsultation,
    deleteConsultation,
    likeORdisLikeConsultation
} = require("../controllers/consultation")
const {
    auth,
    isUser,
    isLawyer
} = require('../src/middleware/auth')

router.use(auth)
router.route('/')
    .post(isUser, createConsultation)
    .get(getMyConsultation)

router.route("/:conID")
    .get(getSingleConsultation)
    .put(updateConsultation)
    .delete(deleteConsultation)

router.post("/action", likeORdisLikeConsultation)

module.exports = router





