const CustomError = require('../errors/customError')
const statusCodes = require('http-status-codes')

const errorHandler = (err, req, res, next) => {
    if (err instanceof CustomError) {
        return res.status(err.statusCode).json({ msg: err.message })
    }

    return res
        .status(statusCodes.INTERNAL_SERVER_ERROR)
        .send('Something went wrong, please try again later...')
}

module.exports = errorHandler
