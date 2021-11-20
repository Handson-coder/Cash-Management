const router = require('express').Router()
const ControllerUser = require('../Controllers/ControllerUser')

router.post('/login', ControllerUser.login)
router.post('/register', ControllerUser.register)
// router.post('/auth/google', ControllerUser.googleAuthLogin)

module.exports = router