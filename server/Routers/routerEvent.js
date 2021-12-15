const router = require('express').Router()
const ControllerEvent = require('../Controllers/ControllerEvent')

router.get('/', ControllerEvent.findAllEvents)
router.get('/:id', ControllerEvent.findOneEvent)
router.post('/add-event', ControllerEvent.addNewEvent)
router.delete('/:id', ControllerEvent.deleteEvent)
router.put('/edit-event/:id', ControllerEvent.editEvent)
// router.put('/:id/finished', ControllerEvent.finishedEvent)

module.exports = router