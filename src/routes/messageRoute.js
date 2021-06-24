const express = require('express')
const Router = express.Router()
const {getMessage} = require('../controllers/messageController')
const checkLogin = require('../auth/checkLogin')

Router.route('/:receiver').get(checkLogin, getMessage)

module.exports = Router