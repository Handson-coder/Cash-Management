const router = require('express').Router()
const ControllerProfile = require('../Controllers/ControllerProfile')

router.put('/edit', ControllerProfile.updateProfile)

module.exports = router