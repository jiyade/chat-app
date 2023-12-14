const statusCodes = require('http-status-codes')
const Message = require('../models/messagesModel')
const CustomError = require('../errors/customError')

const getMessages = async (req, res) => {
    const { roomId } = req.params

    try {
        const messages = await Message.findOne({ roomId })
        res.status(statusCodes.OK).json({ messages })
    } catch (err) {
        console.log(err)
    }
}

const addMessage = async (req, res) => {
    const { messageData, roomId } = req.body
    const data = {
        message: messageData.message,
        time: messageData.time,
        senderId: messageData.senderId,
        customId: messageData._id
    }
    let messages

    try {
        messages = await Message.findOne({ roomId })
    } catch (err) {
        console.log(err)
    }

    if (!messages) {
        try {
            messages = await Message.create({
                roomId,
                messages: data
            })
            res.status(statusCodes.OK).json({ messages })
        } catch (err) {
            console.log(err)
        }
    } else {
        messages = await Message.findOneAndUpdate(
            { roomId },
            {
                $push: { messages: data }
            },
            {
                new: true,
                runValidators: true
            }
        )
        res.status(statusCodes.OK).json({ messages })
    }
}

const deleteMessage = async (req, res) => {
    const { roomId, msgId } = req.params
    let message, error

    try {
        message = await Message.findOne({ roomId, 'messages._id': msgId })
    } catch (err) {
        if (err.name === 'CastError') {
            error = err.name
        } else {
            console.log(err)
        }
    }

    try {
        if (error === 'CastError') {
            message = await Message.updateOne(
                {
                    roomId,
                    'messages.customId': msgId
                },
                {
                    $pull: {
                        messages: { customId: msgId }
                    }
                }
            )
        } else {
            message = await Message.updateOne(
                {
                    roomId,
                    'messages._id': msgId
                },
                {
                    $pull: {
                        messages: { _id: msgId }
                    }
                }
            )
        }

        res.status(statusCodes.OK).json({ status: 'success' })
    } catch (err) {
        console.log(err)
    }
}

module.exports = { getMessages, addMessage, deleteMessage }
