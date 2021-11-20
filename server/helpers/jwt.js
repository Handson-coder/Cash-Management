const jwt = require('jsonwebtoken')

function signToken(payload) {
    return jwt.sign(payload, process.env.JWTPASS)
}

function verifyToken(token) {
    return jwt.verify(token, process.env.JWTPASS)
}

module.exports = { signToken, verifyToken }