const mongoose = require('mongoose')

const subSchema = new mongoose.Schema(
    {
        roomId: {
            type: String,
            required: true,
            unique: true
        },
        receiverId: {
            type: String,
            required: true
        },
        name: {
          type: String,
          required:true
        },
        username: {
          type: String,
          required:true
        },
        profile: {
          type: String,
          required:true
        }
    },
    { timestamps: true }
)

const chatSchema = new mongoose.Schema(
    {
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true
        },
        chats: [subSchema]
    },
    { timestamps: true }
)

module.exports = mongoose.model('Chat', chatSchema)
