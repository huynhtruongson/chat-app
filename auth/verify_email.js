const express = require('express')
const Router = express.Router()
const AccountModel = require('../Models/AccountModel')

Router.get('/account/:token', async(req,res) => {
    try{
        let {token} = req.params
        
        if(!token){
            throw new Error("Link xác thực bị lỗi, vui lòng đăng ký lại")
        }

        let accountVerify = await AccountModel.findOne({"tokenVerify":token})
        if (!accountVerify){
            throw new Error("không có dữ liệu của tài khoản vui lòng đăng ký lại")
        }

        if(accountVerify.verify === true){
            throw new Error("Tài khoản này đã được xác thực, vui lòng không xác thực thêm")
        }

        res.json({
            code: 0,
            message: 'xác thực thành công'
        })
    }catch(err){
        return res.send('Xác thực thất bại: '+ err.message)
    }
})

module.exports = Router