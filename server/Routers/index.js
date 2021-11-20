const router = require('express').Router()
const routerUser = require('./routerUser')
// const routerProduct = require('./routerProduct')
// const routerProduct = require('./routerProduct')
// const ErrorHandler = require('../middlewares/ErrorHandler')

router.use('/users', routerUser)
// router.use('/cash', routerUser)
// router.use('/events', routerProduct)

// router.use(ErrorHandler)

module.exports = router