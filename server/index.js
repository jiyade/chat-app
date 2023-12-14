require('dotenv').config()
require('express-async-errors')

const express = require('express')
const cors = require('cors')
const { Server } = require('socket.io')

const connectDB = require('./db/connect')
const usersRoute = require('./routes/usersRoute')
const authRoute = require('./routes/authRoute')
const roomsRoute = require('./routes/roomsRoute')
const messagesRoute = require('./routes/messagesRoute')
const chatsRoute = require('./routes/chatsRoute')
const notFound = require('./middleware/notFound')
const errorHandler = require('./middleware/errorHandler')
const authMiddleware = require('./middleware/auth')

const app = express()

app.use(cors())

app.use(express.json())

app.get('/', (req, res) => {
    res.status(200).send('Hello')
})

app.use('/auth', authRoute)
app.use('/api/v1/users', authMiddleware, usersRoute)
app.use('/api/v1/rooms', authMiddleware, roomsRoute)
app.use('/api/v1/messages', authMiddleware, messagesRoute)
app.use('/api/v1/chats', authMiddleware, chatsRoute)

app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 3000

const server = app.listen(port, async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        console.log(`Server is listening on port ${port}...`)
    } catch (err) {
        console.log(err)
    }
})

const io = new Server(server, {
    cors: {
        origin: process.env.REACT_URL
    }
})

io.on('connection', (socket) => {
    socket.on('join_room', (data) => {
        socket.join(data)
    })

    socket.on('send_msg', (data) => {
        data.messageData._id = Date.now().toString()
        socket.to(data.roomId).emit('receive_msg', data.messageData)
    })

    socket.on('delete_msg', (data) => {
        socket.to(data.roomId).emit('msg_deleted', data.msgId)
    })

    socket.on('leave_room', (data) => {
        socket.leave(data)
    })
})
