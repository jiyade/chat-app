const statusCodes = require('http-status-codes')
const Chat = require('../models/chatsModel')
const User = require('../models/usersModel')
const CustomError = require('../errors/customError')

const getChats = async (req, res) => {
    const { userId } = req.user

    try {
        const chats = await Chat.findOne({ createdBy: userId })
        res.status(statusCodes.OK).json({ chats })
    } catch (err) {
        console.log(err)
    }
}

const addChat = async (req, res) => {
    const { roomId, receiverId } = req.body
    const { userId } = req.user
    let chats1, chats2

    try {
        chats1 = await Chat.findOne({ createdBy: userId })
        chats2 = await Chat.findOne({ createdBy: receiverId })
    } catch (err) {
        console.log(err)
    }

    if (!chats1) {
        try {
            const user = await User.findOne({ _id: receiverId }).select(
                ' name username profile'
            )

            if (!user) {
                throw new CustomError(404, 'User not found')
            }

            const { name, username, profile } = user

            chats1 = await Chat.create({
                createdBy: userId,
                chats: {
                    roomId,
                    receiverId,
                    name,
                    username,
                    profile
                }
            })
        } catch (err) {
            if (err?.code !== 11000) {
                console.log(err)
            }
        }
    } else {
        const user = await User.findOne({ _id: receiverId }).select(
            ' name username profile'
        )

        if (!user) {
            throw new CustomError(404, 'User not found')
        }

        const { name, username, profile } = user

        try {
            chats = await Chat.findOneAndUpdate(
                { createdBy: userId },
                {
                    $push: {
                        chats: {
                            roomId,
                            receiverId,
                            name,
                            username,
                            profile
                        }
                    }
                },
                {
                    new: true,
                    runValidators: true
                }
            )
        } catch (err) {
            if (err?.code !== 11000) {
                console.log(err)
            }
        }
    }

    if (!chats2) {
      try {
        const user = await User.findOne({ _id: userId }).select(
            ' name username profile'
        )

        if (!user) {
            throw new CustomError(404, 'User not found')
        }

        const { name, username, profile } = user

        chats2 = await Chat.create({
            createdBy: receiverId,
            chats: {
                roomId,
                receiverId: userId,
                name,
                username,
                profile
            }
        })
      } catch (err) {
        if (err?.code !== 11000) {
                console.log(err)
            }
      }
    } else {
        const user = await User.findOne({ _id: userId }).select(
            ' name username profile'
        )

        if (!user) {
            throw new CustomError(404, 'User not found')
        }

        const { name, username, profile } = user

        try {
            chats = await Chat.findOneAndUpdate(
                { createdBy: receiverId },
                {
                    $push: {
                        chats: {
                            roomId,
                            receiverId: userId,
                            name,
                            username,
                            profile
                        }
                    }
                },
                {
                    new: true,
                    runValidators: true
                }
            )
        } catch (err) {
            if (err?.code !== 11000) {
                console.log(err)
            }
        }
    }

    res.status(statusCodes.OK).json({ chats1, chats2 })
}

module.exports = { getChats, addChat }
