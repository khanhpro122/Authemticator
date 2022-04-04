var express = require('express')
var router = express.Router()
const userController = require('../Controller/userController')
const middlewareController = require('../Controller/middlewareController')


router.post('/signup', userController.signupUser)
router.post('/signin', userController.loginUser)
router.get('/allUser',middlewareController.verifyToken ,userController.getAllUser)
router.post('/refreshToken', userController.requestRefreshToken)
router.delete('/delete-user/:id',middlewareController.verifyAdmin ,userController.deleteUser)

module.exports = router

