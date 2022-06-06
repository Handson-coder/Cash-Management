const router = require('express').Router()
const ControllerFatherEvent = require('../Controllers/ControllerFatherEvent')

router.get('/', ControllerFatherEvent.findAllFatherEvents)
router.get('/:id', ControllerFatherEvent.findOneFatherEvents)
router.delete('/:id', ControllerFatherEvent.deleteFatherEvent)
router.post('/create', ControllerFatherEvent.createNewFatherEvent)

module.exports = router