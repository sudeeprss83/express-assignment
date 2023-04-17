// importing required modules
const express = require('express')
const userRouter = express.Router()
const userController = require('../controllers/userController')
const { authenticate } = require('../middlewares/authentication')
const { upload } = require('../middlewares/upload')
const { UPLOADS } = require('../configuration/config')

userRouter.post('/register', userController.registerUser)
userRouter.post('/login', userController.userLogin)
userRouter.post('/logout', userController.userLogout)
userRouter.post('/forgot/password', userController.userForgotPassword)

// protected routes
userRouter.use(authenticate())

userRouter.post('/show/details/', userController.fetchProfile)
userRouter.post(
  '/upload',
  upload(
    [{ name: 'userPic', maxCount: 1 }],
    UPLOADS.destination,
    UPLOADS.mimeTypes
  ),
  userController.uploadImage
)

module.exports = userRouter
