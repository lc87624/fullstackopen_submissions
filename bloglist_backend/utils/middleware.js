const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const config = require('./config')

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
    next()
}
const errorHandler = (error, request, response, next) => {
    logger.error(error.message)
    if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    if (error.name === 'CastError') {
        return response.status(400).json({ error: 'malformatted id' })
    }
    if (error.name === 'MongoServerError' && error.code === 11000) {
        return response.status(400).json({ error: 'username must be unique' })
    }
    if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({ error: 'token invalid' })
    }
    next(error)
}

const userExtractor = async (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        const token = authorization.substring(7)
        if (!token) {
            return response.status(401).json({ error: 'token missing' })
        }

        const decodedToken = jwt.verify(token, config.SECRET)

        if (!decodedToken.id) {
            return response.status(401).json({ error: 'token invalid' })
        }

        const user = await User.findById(decodedToken.id)

        if (!user) {
            return response.status(401).json({ error: 'token invalid' })
        }
        request.user = user
    } else {
        request.user = null
    }
    next()
}

module.exports = {
    errorHandler,
    userExtractor,
    requestLogger
}
