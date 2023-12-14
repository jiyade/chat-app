const statusCodes = require('http-status-codes')
const User = require('../models/usersModel')
const CustomError = require('../errors/customError')
const jwt = require('jsonwebtoken')

const signUp = async (req, res) => {
    const { name, username, password } = req.body

    if (!name || !username || !password) {
        throw new CustomError(400, 'Please provide name, username and password')
    }

     try {
        const user = await User.create({ name, username, password })
        const token = user.createJWT()

        res.status(statusCodes.CREATED).json({
            status: 'success',
            user: {
                userId: user._id,
                name: user.name,
                username: user.username,
                profile: user.profile
            },
            token
        })
    } catch (err) {
        if (err?.code === 11000) {
            throw new CustomError(409, 'Username already exists!')
        } else {
            console.log(err)
        }
    }
}

const login = async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        throw new CustomError(400, 'Please provide username and password')
    }

    const user = await User.findOne({ username })

    if (!user) {
        throw new CustomError(404, 'User not found')
    }

    const isPasswordCorrect = await user.comparePassword(password)

    if (!isPasswordCorrect) {
        throw new CustomError(statusCodes.UNAUTHORIZED, 'Invalid credentials!')
    }

    const token = user.createJWT()

    res.status(statusCodes.OK).json({
        status: 'success',
        user: {
            userId: user._id,
            name: user.name,
            username: user.username
        },
        token
    })
}

const verifyToken = async (req, res) => {
    const { token: authToken } = req.body

    if (!authToken || !authToken.startsWith('Bearer ')) {
        throw new CustomError(401, 'Authentication invalid')
    }

    const token = authToken.split(' ')[1]
    let payload, user

    try {
        payload = jwt.verify(token, process.env.JWT_SECRET)
        const { userId, username, name, profile } = payload
        user = { userId, username, name, profile }
    } catch (err) {
        throw new CustomError(401, 'Authentication invalid')
    }

    res.status(statusCodes.OK).json({ user })
}

module.exports = { signUp, login, verifyToken }
