const express = require('express')
const Router = express.Router()

const loginValidator = require('./Validators/LoginValidator')
const registerValidator = require('./Validators/RegisterValidator')

const {loginController,registerController} = require('../controllers/authController')
Router.route('/login').post(loginValidator,loginController)

Router.route('/register').post(registerValidator, registerController)

module.exports = Router