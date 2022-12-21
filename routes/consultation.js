const router = require('express').Router()
const {
    createConsultation,
    getMyConsultation,
    getSingleConsultation,
    updateConsultation,
    deleteConsultation,
    likeORdisLikeConsultation,
    getAllRepliesByConsultationID
} = require("../controllers/consultation")
const {
    auth,
    isUser
} = require('../src/middleware/auth')

router.route('/')
    .post(auth, isUser, createConsultation)
    .get(auth, getMyConsultation)

router.route("/:conID")
    .get(getSingleConsultation)
    .put(auth, updateConsultation)
    .delete(auth, deleteConsultation)

router.post("/action/:conID", auth, likeORdisLikeConsultation)
router.post("/replies/:conID", getAllRepliesByConsultationID)

module.exports = router





