const router = require('express').Router()
const ControllerChildEvent = require('../Controllers/ControllerChildEvent')

router.get('/', ControllerChildEvent.findAllChildEvents)
router.get('/:id', ControllerChildEvent.findOneChildEvent)
router.delete('/:id', ControllerChildEvent.deleteChildEvent)
router.post('/create', ControllerChildEvent.createNewChildEvent)

module.exports = router