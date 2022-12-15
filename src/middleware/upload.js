const multer = require("multer")
1
exports.upload = multer({
    limits: {
        fileSize: 1000000
    }, fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpes|png)$/)) {
            return cb(new Error('picture format not matched , please upload jpg,jpes or png image'))
        }
        cb(undefined, true)
    }
})