const statusCodes = require('http-status-codes')
const User = require('../models/usersModel')
const Chat = require('../models/chatsModel')
const CustomError = require('../errors/customError')
const bcrypt = require('bcryptjs')

const getUsers = async (req, res) => {
    const { userId } = req.user
    const { query } = req.query
    const queryObj = {
        _id: { $nin: [userId] }
    }

    if (query) {
        queryObj.$or = [
            { name: { $regex: `^${query}`, $options: 'i' } },
            { username: { $regex: `^${query}`, $options: 'i' } }
        ]

        const users = await User.find(queryObj).select(
            '_id name username profile'
        )

        res.status(statusCodes.OK).json({
            status: 'success',
            nbHits: users.length,
            users
        })
    } else {
        throw new CustomError(
            statusCodes.BAD_REQUEST,
            'Please provide the query'
        )
    }
}

const getUser = async (req, res) => {
    const { userId: receiverId } = req.params

    const user = await User.findOne({ _id: receiverId }).select(
        '_id name username profile'
    )

    if (!user) {
        throw new CustomError(404, "Couldn't find the user...")
    }

    res.status(statusCodes.OK).json({ status: 'success', user })
}

const updateUser = async (req, res) => {
    const { userId } = req.params
    const { oldPassword, updateValue } = req.body

    if (!oldPassword) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: userId },
                updateValue,
                {
                    new: true,
                    runValidators: true
                }
            ).select('_id name username profile')

            const chat = await Chat.updateMany(
                { 'chats.receiverId': userId },
                {
                    $set: {
                        'chats.$[elem].name': user.name,
                        'chats.$[elem].username': user.username
                    }
                },
                { arrayFilters: [{ 'elem.receiverId': userId }] }
            )

            if (!user) {
                throw new CustomError(404, 'User not found')
            }

            const token = user.createJWT()

            res.status(statusCodes.OK).json({ user, token })
        } catch (err) {
            if (err?.code === 11000) {
                throw new CustomError(409, 'Username already exists!')
            }
        }
    } else {
        if (oldPassword === updateValue.password) {
            throw new CustomError(
                409,
                'New password cannot be the same as the old one'
            )
        }

        let user = await User.findOne({ _id: userId })

        if (!user) {
            throw new CustomError(404, 'User not found')
        }

        const isPasswordCorrect = await user.comparePassword(oldPassword)

        if (!isPasswordCorrect) {
            throw new CustomError(401, 'Wrong password!')
        }

        const salt = await bcrypt.genSalt(10)
        updateValue.password = await bcrypt.hash(updateValue.password, salt)

        user = await User.findOneAndUpdate({ _id: userId }, updateValue, {
            new: true,
            runValidators: true
        }).select('_id name username profile')

        res.status(statusCodes.OK).json({ status: 'success' })
    }
}

const deleteUser = async (req, res) => {
    const { userId } = req.user
    const { password } = req.body

    let user = await User.findOne({ _id: userId })

    if (!user) {
        throw new CustomError(404, 'User not found!')
    }

    const isPasswordCorrect = await user.comparePassword(password)

    if (!isPasswordCorrect) {
        throw new CustomError(401, 'Wrong password!')
    }

    try {
        user = await User.findOneAndDelete({ _id: userId })

        res.status(statusCodes.OK).json({ status: 'success' })
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    getUsers,
    getUser,
    updateUser,
    deleteUser
}
