const router = require('express').Router()

const UserController = require('../controllers/userController')
const publicRoutes = require('./public')
const news = require('./news')
const user = require('./user')
const categories = require('./category')

const errorHandler = require('../middlewares/errorHandler')
const authentication = require('../middlewares/authentication')
const {adminAuthorization} = require('../middlewares/authorization')


router.post('/login', UserController.login)
router.post('/google-login', UserController.googleLogin)
router.use('/pub', publicRoutes)

//middleware untuk authentication sama authorization
router.use(authentication)

router.use('/', user)
router.use('/news', news)
router.use('/categories', adminAuthorization, categories)

router.use(errorHandler)

module.exports = router;