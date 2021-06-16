const express = require('express')
const Router = express.Router()
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

const checkLogin = require('../auth/checkLogin')
const {current, updateUser, addFriend, acceptFriend} = require('../controllers/accountController')

Router.route('/current').get(checkLogin, current)

Router.route('/update').put(checkLogin, multipartMiddleware, updateUser)

Router.route('/add-friend/:id').put(checkLogin, addFriend)

Router.route('/accept-friend/:id').put(checkLogin, acceptFriend)

module.exports = Router