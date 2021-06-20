const express = require('express')
const Router = express.Router()
var multipart = require('connect-multiparty')
var multipartMiddleware = multipart();

const checkLogin = require('../auth/checkLogin')
const {conversationList, addMessage} = require('../controllers/conversationController')

Router.route('/list/:time').get(conversationList)

Router.route('/add-message').post(checkLogin, multipartMiddleware, addMessage)

module.exports = Router