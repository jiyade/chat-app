const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema(
    {
      roomId: {
        type: String,
        required: true
      },
        userId1: {
            type: String,
            required: true
        },
        userId2: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model('Room', roomSchema)
