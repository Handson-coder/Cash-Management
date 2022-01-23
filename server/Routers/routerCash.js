const router = require('express').Router()
const ControllerCash = require('../Controllers/ControllerCash')

router.get('/', ControllerCash.getCurrentBalance)

module.exports = router