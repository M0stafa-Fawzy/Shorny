const router = require("express").Router()
const {
    signup,
    login,
    getProfileData,
    updateProfile,
    deleteAccount,
    verifyUser
} = require("../controllers/user")

router.route('/').post(signup).get(getProfileData).put(updateProfile).delete(deleteAccount)
router.post("/login", login)
router.post("/verify", verifyUser)

module.exports = router