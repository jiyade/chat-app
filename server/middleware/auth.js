const jwt = require('jsonwebtoken')
const CustomError = require('../errors/customError')

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new CustomError(401, 'Please provide the token')
    }

    const token = authHeader.split(' ')[1]

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        const { userId, username, name, profile } = payload
        req.user = { userId, username, name }
        next()
    } catch (err) {
        throw new CustomError(401, 'Not authorized to access this route')
    }
}

module.exports = authMiddleware
