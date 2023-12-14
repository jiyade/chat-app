const express = require('express')

const {
  getChats,
    addChat,
} = require('../controllers/chats')

const router = new express.Router()

router.route('/').get(getChats).post(addChat)
router.route('/:chatId')

module.exports = router
