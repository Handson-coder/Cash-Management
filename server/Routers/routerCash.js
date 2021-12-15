const router = require('express').Router()
const ControllerCash = require('../Controllers/ControllerCash')

router.get('/', ControllerCash.getCurrentBalance)
router.patch('/add-balance', ControllerCash.addCurrentBalance)
router.patch('/edit-balance', ControllerCash.editCurrentBalance)

module.exports = router