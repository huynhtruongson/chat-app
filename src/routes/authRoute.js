const express = require('express')
const Router = express.Router()

const loginValidator = require('./Validators/LoginValidator')
const registerValidator = require('./Validators/RegisterValidator')

const {loginController, registerController, verifyController, forgotPasswordController, verifyResetpassword, googleLoginController} = require('../controllers/authController')

Router.route('/login').post(loginValidator,loginController)

Router.route('/login/google').post(googleLoginController)

Router.route('/register').post(registerValidator, registerController)

Router.route('/verify-user').post(verifyController)

Router.route('/forgot-password').post(forgotPasswordController)

Router.route('/reset-password').put(verifyResetpassword)

module.exports = Router