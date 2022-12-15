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
const { auth } = require("../src/middleware/auth")

router.route('/').post(signup).get(auth, getProfileData).put(auth, updateProfile).delete(auth, deleteAccount)
router.post("/:id", getUserProfileByID)
router.post("/login", login)
router.post("/verify", verifyUser)

module.exports = router