const express = require('express')
const Router = express.Router()
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

const checkLogin = require('../auth/checkLogin')
const {current, updateUser, addFriend, acceptFriend, search, friendRequestList, friendList, refuseFriend} = require('../controllers/accountController');


Router.route('/current').get(checkLogin, current)

Router.route('/update').put(checkLogin, multipartMiddleware, updateUser)

Router.route('/request-friend/:id').put(checkLogin, addFriend)

Router.route('/accept-friend/:id').put(checkLogin, acceptFriend)

Router.route('/refuse-friend/:id').put(checkLogin, refuseFriend )

Router.route('/search').get(checkLogin, search)

Router.route('/friend-request-list').get(checkLogin, friendRequestList)

Router.route('/friend-list').get(checkLogin, friendList)

module.exports = Router