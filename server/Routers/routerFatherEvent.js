const router = require('express').Router()
const ControllerFatherEvent = require('../Controllers/ControllerFatherEvent')

router.get('/', ControllerFatherEvent.findAllFatherEvents)
router.get('/:id', ControllerFatherEvent.findOneFatherEvents)

module.exports = router