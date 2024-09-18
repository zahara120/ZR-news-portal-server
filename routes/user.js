const UserController = require('../controllers/userController')
const { adminAuthorization } = require('../middlewares/authorization')
const user = require('express').Router()

user.get('/users', adminAuthorization, UserController.getData)
user.post('/add-user', adminAuthorization, UserController.addUser)
module.exports = user