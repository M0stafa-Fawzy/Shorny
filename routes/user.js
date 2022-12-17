const router = require("express").Router()
const {
    signup,
    login,
    getProfileData,
    updateProfile,
    deleteAccount,
    verifyUser,
    forgetPassword,
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

router.post("/forget", forgetPassword)
router.post("/login", login)
router.post("/verify", verifyUser)
router.get("/:id", getUserProfileByID)

module.exports = router