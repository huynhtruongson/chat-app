const express = require('express')
const Router = express.Router()
var multipart = require('connect-multiparty')
var multipartMiddleware = multipart();

const checkLogin = require('../middlewares/checkLogin')
const {conversationList, addMessage, imageGallery} = require('../controllers/conversationController')

Router.route('/list').get(checkLogin, conversationList)

Router.route('/add-message').post(checkLogin, multipartMiddleware, addMessage)

Router.route('/image-gallery/:id').get(checkLogin, imageGallery)

module.exports = Router