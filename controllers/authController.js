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
                throw new Error("Wrong email or password")
            }

            let passwordMatch = await bcrypt.compare(password, account.password)
            
            if(!passwordMatch){
                return res.status(400).json({message: "Wrong email or password"})
            }
            
            if(account.verify === false){
                return res.status(401).json({message: "Unverified account. Please check your email for email verification"})
            }
            
            const {JWT_SECRET} = process.env
            jwt.sign({
                id:account.id,
            },JWT_SECRET,{
                expiresIn:'3h'
            },(err,token)=>{
                if(err) throw err
                return res.status(200).json({
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
    catch (err) {
        return res.status(400).json({message : "Đăng nhập thất bại:" + err.message})
    }
}

module,exports.googleLoginController = (req, res) =>{
    const{tokenId}=req.body
    let original_id = mongoose.Types.ObjectId()
    client.verifyIdToken({idToken :tokenId,audience:"173768816222-a3th16lqbckuej5epilhsnv3tg0l031q.apps.googleusercontent.com"})
    .then(response=>{
        const {email_verified,name,email,picture}= response.payload

        if(email_verified){        
            AccountModel.findOne({email:email}).exec((err,user)=>{
                if(err){
                    return res.status(400).json({message:err.message})
                } else{
                    
                    if(user){
                        const {JWT_SECRET} = process.env
                        const token = jwt.sign({
                            id:user.id,
                        },JWT_SECRET,{expiresIn:"3h"})
                        res.json({code:0,message:"Login success",token:token})
                        
                    }else{
                        cloudinary.uploader.upload(picture)
                        .then(imageCloud=>{
                        let newAccount = new AccountModel({
                            _id: original_id,
                            email: email,
                            firstname: firstname,
                            lastname: lastname,
                            avatar: imageCloud.secure_url,
                            id_avatar: imageCloud.public_id,
                            
                        })
                        newAccount.save((err,data)=>{
                            if(err){
                                return res.status(400).json({
                                   message:err.message
                                })
                            }

                            const {JWT_SECRET} = process.env
                            const token = jwt.sign({
                                id:data.id,
                                },JWT_SECRET,{expiresIn:"3d"})
                                res.status(200).json({message:"Login success",token:token})
                        })
                    })
                    }
                }
            })
        }
    })
}

module.exports.registerController = async (req, res) =>{
    try{
        let result = validationResult(req)
        if(result.errors.length !== 0){
            let messages = result.mapped()
            let message = ''

            for(m in messages){
                message = messages[m].msg
                break
            }
            throw new Error (message)
        }
        let {email, firstname, lastname, password} = req.body
        var token = crypto.randomBytes(48).toString('hex')
        var idAdd = crypto.randomBytes(4).toString('hex')
        
        let checkExist = await AccountModel.findOne({email: email})

        if (checkExist) {
            throw new Error ('This account is registered')
        }
        while(await AccountModel.findOne({idAdd:idAdd})){
            idAdd = crypto.randomBytes(4).toString('hex')
        }
        let password_hash = await bcrypt.hash(password,10)
        let account = await new AccountModel({
            email: email,
            firstname: firstname,
            lastname: lastname,
            password: password_hash,
            tokenVerify: token,
            idAdd: idAdd
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

        let link_verify = `${process.env.PATH_HOST}/verify-email/${token}`
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
                res.status(200).json({message:"A verification link has seen to your email account. Please click the link to verify your email and continue the registration process."})
            }
        }) 
    } catch (err) {
        return res.status(400).json({message:err.message})
    }
}

module.exports.verifyController = async (req, res) =>{
    try{
        let {token} = req.body
        
        if(!token){
            throw new Error("Verify link is broken, please re-register")
        }

        let accountVerify = await AccountModel.findOne({"tokenVerify":token})
        if (!accountVerify){
            throw new Error("No account data, please re-register")
        }

        if(accountVerify.verify === true){
            throw new Error("This account has been verified, please do not verify further")
        }
        await AccountModel.findOneAndUpdate({"tokenVerify":token},{verify:true})
        res.status(200).json({
            message: 'Verify success'
        })
    }catch(err){
        return res.status(400).json({message:'Verify failed: '+ err.message})
    }

}

module.exports.forgotPasswordController = async(req, res) => {
    try {
        let email = req.body.email
        var token = crypto.randomBytes(48).toString('hex')

        await AccountModel.findOneAndUpdate({email:email},{token:token})

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

        let link_verify = `${process.env.PATH_HOST}/reset-password/${token}`
        var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
            from: process.env.EMAIL,
            to: email,
            subject: 'Reset password account',
            html: '<p>Đây là tin nhắn của<b>LƯỢM message</b> giúp bạn reset password. <br>Để kích đổi lại mật khẩu và sử dụng dịch vụ của chúng tôi, vui lòng nhấn <a href="'+link_verify+'">vào đây</a> để thay đổi mật khẩu tài khoản</p>'
        }
        
        transporter.sendMail(mainOptions, function(err, info){
            if (err) {
                return res.send("error message: "+err.message)
            } else {
                res.status(200).json({message:"A reset password link has seen to your email account. Please click the link to change your password and continue the registration process."})
            }
        })

    } catch(err) {
        return res.status(400).json({message:'Verify failed: '+ err.message})
    }
}


module.exports.verifyResetpassword = async(req, res) =>{
    try {
        let {token, password} = req.body
        
        if (!token) {
            throw new Error("Token not found")
        }    
        
        let password_hash = await bcrypt.hash(password, 10)
        let user = await AccountModel.findOneAndUpdate({token: token}, {password: password_hash})
        
        if (!user) {
            throw new Error('Opss, something went wrong...')
        }

        return res.status(400).json({message:"Change password success"})
    } catch (err) {
        return res.status(400).json({message: err.message})
    }
}