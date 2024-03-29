const asyncWrapper = require('../middleware/asyncWrapper')
const User = require('../models/user.model')
const appError = require('../utils/appError')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const generateJwt = require('../utils/generateJWT')

const getAllUsers = asyncWrapper(

    async (req, res, next) => {
        const query = req.query;
        const limit = query.limit || 10;
        const page = query.page || 1;
        const skip = (page - 1) * limit;
        const users = await User.find({}, { "__v": false, "password": false, }).limit(limit).skip(skip);
        res.json({ status: "success", data: { users } });
    })

const register = asyncWrapper(
    async (req, res, next) => {
        const { firstName, lastName, email, password, role } = req.body;
        const user = await User.findOne({ email: email })
        if (user) {
            const error = appError.create('email is already used', 400, "fail")
            return next(error)
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role,
            avatar: req.file.filename
        })
        //generate token 
        const token = await generateJwt({ email: email, id: newUser._id, role: newUser.role })
        newUser.token = token
        await newUser.save()
        res.status(201).json({ status: "success", data: { user: newUser } });
    }
)


const login = asyncWrapper(
    async (req, res, next) => {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email })

        if (!user) {
            const error = appError.create('user not found ', 400, "fail")
            return next(error)
        }

        const matchedPassword = await bcrypt.compare(password, user.password)

        const token = await generateJwt({ email: email, id: user._id, role: user.role })

        if (user && matchedPassword) {
            //logged in successfully
            return res.json({ status: "success", data: { token } });

        }
        else {
            const error = appError.create('something wrong', 500, "error")
            return next(error)
        }

    }
);

module.exports = {
    getAllUsers,
    register,
    login
}