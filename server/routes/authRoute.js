const express = require('express')

const { signUp, login, verifyToken } = require('../controllers/auth')

const router = new express.Router()

router.post('/signup', signUp)
router.post('/login', login)
router.post('/verify', verifyToken)

module.exports = router
