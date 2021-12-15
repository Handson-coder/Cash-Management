const router = require('express').Router()
const routerUser = require('./routerUser')
const routerCash = require('./routerCash')
const routerEvent = require('./routerEvent')
const routerSubEvent = require('./routerSubEvent')
const routerHistory = require('./routerHistory')
const authentication = require('../middlewares/authentication')
const errorHandler = require('../middlewares/errorHandler')

router.use('/users', routerUser)
router.use(authentication)
router.use('/cash', routerCash)
router.use('/events', routerEvent)
router.use('/sub-events', routerSubEvent)
router.use('/histories', routerHistory)
router.use(errorHandler)

module.exports = router