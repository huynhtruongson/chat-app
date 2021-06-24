const accountModel = require("../models/AccountModel")
const messageModel = require("../models/messageModel")
const mongoose = require('mongoose')

module.exports.getMessage = async (req, res) =>{
    try {
        let {pageSkip} = req.query.pageSkip*1 || 0
        let {receiver} = req.params
        if (!receiver) {
            throw new Error ("Missing receiver ID")
        }

        let countMessage = await messageModel.find({$or: [
            { sender: mongoose.Types.ObjectId(req.user.id),  receiver: mongoose.Types.ObjectId(receiver) }, 
            { sender: mongoose.Types.ObjectId(receiver), receiver: mongoose.Types.ObjectId(req.user.id) }
        ]})

        if(Math.ceil(countMessage/10) < pageSkip){
            return res.status(200).json({message:"End of list"})
        }

        let messageList = await messageModel.find({$or: [
            { sender: mongoose.Types.ObjectId(req.user.id),  receiver: mongoose.Types.ObjectId(receiver) }, 
            { sender: mongoose.Types.ObjectId(receiver), receiver: mongoose.Types.ObjectId(req.user.id) }
        ]}).sort({'createdAt': 'desc'}).limit(10).skip(pageSkip).populate("party")
        
        return res.status(200).json({
            message: 'get conversation list success',
            data: messageList
        })

    } catch (err) {
        return res.status(400).json({message: err.message})
    }
}