const router = require('express').Router()
const ControllerHistory = require('../Controllers/ControllerHistory')

router.get('/', ControllerHistory.findAllHistories)
router.post('/logout', ControllerHistory.createHistoryLogout)

module.exports = router