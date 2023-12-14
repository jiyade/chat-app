const express = require('express')

const {
    getMessages,
    addMessage,
    deleteMessage
} = require('../controllers/messages')

const router = new express.Router()

router.route('/:roomId').get(getMessages).post(addMessage)
router.route('/:roomId/:msgId').delete(deleteMessage)

module.exports = router
