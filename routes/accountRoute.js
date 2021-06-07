const express = require('express')
const Router = express.Router()
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

const checkLogin = require('../auth/checkLogin')
const {current,updateUser} = require('../controllers/accountController')

Router.route('/current').get(checkLogin,current)

Router.route('/update').put(checkLogin,multipartMiddleware, updateUser)

module.exports = Router