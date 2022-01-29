const router = require('express').Router()
const ControllerProfile = require('../Controllers/ControllerProfile')
const authorization = require('../middlewares/authorization')

router.put('/edit', ControllerProfile.updateProfile)
router.post('/register', authorization, ControllerProfile.register)
router.get('/lists', authorization, ControllerProfile.checkUserList)

module.exports = router