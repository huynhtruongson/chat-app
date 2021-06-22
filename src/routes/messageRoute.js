const express = require('express')
const Router = express.Router()
const {getMessage} = require('../controllers/messageController')

Router.route('/:receiver').get(getMessage)

module.exports = Router