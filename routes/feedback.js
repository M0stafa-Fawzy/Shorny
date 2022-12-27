const { auth } = require('../src/middleware/auth')
const router = require("express").Router()
const {
    addFeedBack,
    getLawyerFeedBacks
} = require("../controllers/feedback")

router.use(auth)
router.post("/", addFeedBack)
router.get("/:lawyerID", getLawyerFeedBacks)

module.exports = router