const statusCodes = require('http-status-codes')
const Room = require('../models/roomsModel')
const CustomError = require('../errors/customError')

const createRoom = async (req, res) => {
    const { userId1, userId2 } = req.body

    const roomId1 = `${userId1}_${userId2}`
    const roomId2 = `${userId2}_${userId1}`

    const queryObj = {
        $or: [{ roomId: roomId1 }, { roomId: roomId2 }]
    }

    let room

    try {
        room = await Room.find(queryObj)
    } catch (err) {
        console.log(err)
    }

    if (room.length === 0) {
        try {
            room = await Room.create({ roomId: roomId1, userId1, userId2 })
            res.status(statusCodes.CREATED).json({ room })
        } catch (err) {
            console.log(err)
        }
    } else {
        room = room[0]
        res.status(statusCodes.OK).json({ room })
    }
}

const getRoom = async (req, res) => {
    const { userId1, userId2 } = req.body

    const roomId1 = `${userId1}_${userId2}`
    const roomId2 = `${userId2}_${userId1}`

    const queryObj = {
        $or: [{ roomId: roomId1 }, { roomId: roomId2 }]
    }

    try {
        let room = await Room.find(queryObj)
        room = room[0]
        res.status(statusCodes.OK).json({ room })
    } catch (err) {
        throw new CustomError(404, "Couldn't find the room")
    }
}

const deleteRoom = async (req, res) => {
    const { roomId } = req.params

    try {
        const room = await Room.findOneAndDelete({ roomId })
        res.status(statusCodes.OK).json({ status:"success" })
    } catch (err) {
        throw new CustomError(404, "Couldn't find the room")
    }
}

module.exports = { createRoom, getRoom, deleteRoom }
