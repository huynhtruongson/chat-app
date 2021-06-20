const express = require('express')
const Router = express.Router()
const AccountModel = require('../models/AccountModel')

Router.get('/account/:token', async(req,res) => {
    try{
        let {token} = req.params
        
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
            message: 'Successful verify'
        })
    }catch(err){
        return res.send('Verify failed: '+ err.message)
    }
})

module.exports = Router