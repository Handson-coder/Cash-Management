const router = require('express').Router()
const ControllerChildEvent = require('../Controllers/ControllerChildEvent')

router.get('/', ControllerChildEvent.findAllChildEvents)

module.exports = router