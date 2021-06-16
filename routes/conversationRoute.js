const express = require('express')
const Router = express.Router()
const {conversationList} = require('../controllers/conversationController')

Router.route('/conversationlist/:time').get(conversationList)

module.exports = Router