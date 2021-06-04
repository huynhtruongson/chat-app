const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')
const nodemailer = require('nodemailer')
const crypto = require('crypto')

const AccountModel = require('../models/AccountModel')

module.exports.loginController =  async(req, res) => {
    try{
        let result = validationResult(req)
        if(result.errors.length === 0){
            let {email, password} = req.body
            let account = await AccountModel.findOne({email: email})
            
            if (!account){
                throw new Error("Tài khoản không tồn tại")
            }
            
            if(account.verify === false){
                throw new Error("Tài khoản chưa được xác thực")
            }

            let passwordMatch = await bcrypt.compare(password, account.password)
            
            if(!passwordMatch){
                return res.status(401).json({code: 2, message: "Mật khẩu không chính xác"})
            }
            const {JWT_SECRET} = process.env
            jwt.sign({
                id:account.id,
            },JWT_SECRET,{
                expiresIn:'3h'
            },(err,token)=>{
                if(err) throw err
                return res.json({
                    code: 0,
                    message: "Đăng nhập thành công",
                    token: token
                })
            })

            
        }else{
            let messages = result.mapped()
            let message = ''
            for(m in messages){
                message= messages[m].msg
                break
            }
            throw new Error (message)
        }
    }
    catch(err){
        return res.status(401).json({message : "Đăng nhập thất bại:" + err.message})
    }
}


module.exports.registerController = async (req,res) =>{
    try{
        let result = validationResult(req)
        if(result.errors.length !== 0){
            let messages = result.mapped()
            let message = ''
            for(m in messages){
                message= messages[m].msg
                break
            }
            throw new Error (message)
        }
        let {email,firstname,lastname,password} = req.body
        var token = crypto.randomBytes(48).toString('hex');
        let checkExist = await AccountModel.findOne({email:email})
        if (checkExist){
            throw new Error('Tài khoản này đã đăng ký')
        }
        let password_hash = await bcrypt.hash(password,10)
        let account = await new AccountModel({
            email: email,
            firstname: firstname,
            lastname: lastname,
            password: password_hash,
            tokenVerify: token
        })
        account.save()

        var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS_EMAIL
            },
            tls: {
                rejectUnauthorized: false
            }
        })

        let link_verify = `${process.env.PATH_HOST}/api/verify/account/${token}`
        var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
            from: process.env.EMAIL,
            to: email,
            subject: 'Account verification',
            html: '<p>Chào mừng bạn đến với <b>LƯỢM message</b>. <br>Để kích hoạt tài khoản và sử dụng dịch vụ của chúng tôi, vui lòng nhấn <a href="'+link_verify+'">vào đây</a> để xác thực tài khoản</p>'
        }
        
        transporter.sendMail(mainOptions, function(err, info){
            if (err) {
                return res.send("error message: "+err.message)
            } else {
                res.send('done');
            }
        }) 
    }catch(err){
        return res.send(err.message)
    }
}
