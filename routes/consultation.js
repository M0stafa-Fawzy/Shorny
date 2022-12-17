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

router.use(auth)
router.route('/')
    .post(isUser, createConsultation)
    .get(getMyConsultation)

router.route("/:conID")
    .get(getSingleConsultation)
    .put(updateConsultation)
    .delete(deleteConsultation)

router.post("/action", likeORdisLikeConsultation)
router.post("/replies/:conID", getAllRepliesByConsultationID)

module.exports = router





