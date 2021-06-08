const express = require('express')
const Router = express.Router()

const loginValidator = require('./Validators/LoginValidator')
const registerValidator = require('./Validators/RegisterValidator')

const {loginController,registerController,verifyController,forgotPasswordController,verifyResetpassword} = require('../controllers/authController')
const { route } = require('../auth/verify_email')
Router.route('/login').post(loginValidator,loginController)

Router.route('/register').post(registerValidator, registerController)

Router.route('/verify-user').post(verifyController)

Router.route('/forgot-password').post(forgotPasswordController)

Router.route('/reset-password').put(verifyResetpassword)

module.exports = Router