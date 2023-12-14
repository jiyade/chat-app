const mongoose = require('mongoose')

const subSchema = new mongoose.Schema(
    {
        message: {
            type: String,
            required: true
        },
        senderId: {
            type: String,
            required: true
        },
        customId: {
            type: String
        }
    },
    { timestamps: true }
)

const messageSchema = new mongoose.Schema(
    {
        roomId: {
            type: String,
            required: [true, 'Please provide the room id']
        },
        messages: [subSchema]
    },
    { timestamps: true }
)

module.exports = mongoose.model('Message', messageSchema)
