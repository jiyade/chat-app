const express = require('express')

const {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
} = require('../controllers/users')

const router = new express.Router()

router.route('/').get(getUsers)
router.route('/:userId').get(getUser).patch(updateUser)
router.route('/delete-account').delete(deleteUser)

module.exports = router
