const jwt = require('jsonwebtoken');
const appError = require('../utils/appError')

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['Authorization'] || req.headers['authorization']
    if (!authHeader) {
        const error = appError.create('token is required', 401, 'error')
        return next(error)

    }
    const token = authHeader.split(' ')[1];
    try {
        const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.currentUser = currentUser
        console.log(currentUser);
        next();

    } catch (err) {
        return res.status(401).json('invalid token ')
    }
}

module.exports = verifyToken;
