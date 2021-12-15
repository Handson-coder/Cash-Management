const router = require('express').Router()
const ControllerSubEvent = require('../Controllers/ControllerSubEvent')

router.get('/:id', ControllerSubEvent.findOneSubEvent)
router.put('/:id', ControllerSubEvent.processSubEvent)
router.delete('/:id', ControllerSubEvent.deleteSubEvent)
router.post('/add', ControllerSubEvent.createSubEvent)
router.put('/edit/:id', ControllerSubEvent.editSubEvent)
router.get('/from-event/:id', ControllerSubEvent.findAllSubEvents)

module.exports = router