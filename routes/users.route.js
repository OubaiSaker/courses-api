const express = require('express')

const router = express.Router()

const usersController = require('../controller/users.controller')

const { userValidationSchema } = require('../middleware/userValidation')

const verifyToken = require('../middleware/verifyToken')

const multer = require('multer')

const appError = require('../utils/appError')

const diskStorage = multer.diskStorage({
    destination: function (req, file, callBack) {

        callBack(null, 'uploads')
    },
    filename: function (req, file, callBack) {
        const ext = file.mimetype.split('/')[1]
        const fileName = `user-${Date.now()}.${ext}`;
        callBack(null, fileName)
    }
})

const fileFilter = (req, file, cb) => {
    const imageType = file.mimetype.split('/')[0]
    if (imageType === 'image') {
        return cb(null, true);
    }
    else {
        return cb(appError.create('file must be image', 400, 'error'), false)
    }
}

const upload = multer({
    storage: diskStorage,
    fileFilter
})
//get all users
//register
//login 
router.route('/')
    .get(verifyToken, usersController.getAllUsers)

router.route('/register')
    .post(upload.single('avatar'), usersController.register)

router.route('/login')
    .post(userValidationSchema(), usersController.login)


module.exports = router;