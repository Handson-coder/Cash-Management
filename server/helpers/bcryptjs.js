const  bcrypt = require('bcryptjs')

function hashPassword(value) {
    return bcrypt.hashSync(value, bcrypt.genSaltSync(10))
}

function checkPassword(value, hash) {
    return bcrypt.compareSync(value, hash)
}

module.exports = { hashPassword, checkPassword }