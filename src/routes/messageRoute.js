const express = require('express')
const Router = express.Router()
const {getMessage, deleteMessage} = require('../controllers/messageController')
const checkLogin = require('../middlewares/checkLogin')
const checkAllow = require('../middlewares/checkAllow')

Router.route('/:receiver').get(checkLogin, getMessage)

Router.route('/delete/:id').delete(checkLogin, checkAllow, deleteMessage)

module.exports = Router