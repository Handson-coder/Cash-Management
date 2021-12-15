const router = require('express').Router()
const ControllerUser = require('../Controllers/ControllerUser')

router.post('/login', ControllerUser.login)

module.exports = router