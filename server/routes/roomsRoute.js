const express = require('express')

const { createRoom, getRoom,deleteRoom } = require('../controllers/rooms')

const router = new express.Router()

router.route('/').post(createRoom)
router.route('/getRoom').post(getRoom)
router.route('/:roomId').delete(deleteRoom)

module.exports = router
