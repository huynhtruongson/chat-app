const express = require('express')
const Router = express.Router()
var multipart = require('connect-multiparty')
var multipartMiddleware = multipart();

const checkLogin = require('../middlewares/checkLogin')
const {conversationList, addMessage, imageGallery, videoGallery, fileGallery, delConversation, seenConversation} = require('../controllers/conversationController')

Router.route('/list').get(checkLogin, conversationList)

Router.route('/add-message').post(checkLogin, multipartMiddleware, addMessage)

Router.route('/image-gallery/:id').get(checkLogin, imageGallery)

Router.route('/video-gallery/:id').get(checkLogin, videoGallery)

Router.route('/file-gallery/:id').get(checkLogin, fileGallery)

Router.route('/delete/:id').delete(checkLogin, delConversation)

Router.route('/seen/:id').put(checkLogin, seenConversation)

module.exports = Router