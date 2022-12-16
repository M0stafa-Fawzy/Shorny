const router = require("express").Router()
const {
    signup,
    login,
    getProfileData,
    updateProfile,
    deleteAccount,
    verifyUser,
    getUserProfileByID
} = require("../controllers/user")
const {
    auth,
    isUser,
    isLawyer
} = require("../src/middleware/auth")

router.route('/')
    .post(signup)
    .get(auth, getProfileData)
    .put(auth, updateProfile)
    .delete(auth, deleteAccount)
router.post("/login", login)
router.post("/verify", verifyUser)
router.post("/:id", getUserProfileByID)

module.exports = router