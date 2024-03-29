const mongoose = require("mongoose")

const validator = require('validator')

const userRole = require('../utils/user-roles')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, 'email is required required'],
        unique: true,
        validate: [validator.isEmail, 'filed must be a valid email address']
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String,

    },
    role: {
        type: String,
        enum: [userRole.USER, userRole.ADMIN, userRole.MANAGER],
        default: userRole.USER
    },
    avatar: {
        type: String,
        default: 'uploads/profile1.png'
    }
})

module.exports = mongoose.model('user', userSchema);