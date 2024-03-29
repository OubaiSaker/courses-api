const { body, validationResult } = require('express-validator')

const User = require('../models/user.model')

const userValidationSchema = () => {
    return [
        body('email')
            .notEmpty()
            .withMessage("email is required"),
        body('password')
            .notEmpty()
            .withMessage("password is required")
    ]
}

module.exports = { userValidationSchema };