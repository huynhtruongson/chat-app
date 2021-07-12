const accountModel = require("../models/AccountModel")
const messageModel = require("../models/messageModel")
const mongoose = require('mongoose')
const cloudinary = require('../config/cloudinary')
const conversationModel = require('../models/conversationModel')

module.exports.getMessage = async (req, res) =>{
    try {
        let pageSkip = req.query.pageSkip*1 || 0
        let {receiver} = req.params
        if (!receiver) {
            throw new Error ("Missing receiver ID")
        }

        let messageList = await messageModel.find({
            $or: [
                { sender: mongoose.Types.ObjectId(req.user.id),  receiver: mongoose.Types.ObjectId(receiver) }, 
                { sender: mongoose.Types.ObjectId(receiver), receiver: mongoose.Types.ObjectId(req.user.id) }
            ],
            delete: {$ne: [req.user.id]}
        }).sort({'createdAt': 'desc'}).limit(20).skip(pageSkip).populate("party","email avatar fullname ")

        return res.status(200).json({
            message: 'get message list success',
            data: messageList
        })

    } catch (err) {
        return res.status(400).json({message: err.message})
    }
}

module.exports.deleteMessage = async (req, res) =>{
    try{
        let {id} = req.params
        let messageDel = undefined

        messageDel = await messageModel.findById(id)
        messageDel.media.forEach(async ({id_cloud}) => await cloudinary.uploader.destroy(id_cloud))
        await messageModel.findByIdAndDelete(id)

        let messageLast = await messageModel.findOne({
            $or: [
                { sender: mongoose.Types.ObjectId(req.user.id),  receiver: mongoose.Types.ObjectId(messageDel.receiver) }, 
                { sender: mongoose.Types.ObjectId(messageDel.receiver), receiver: mongoose.Types.ObjectId(req.user.id) }
            ],
            // delete: {$ne: [req.user.id]}
        }).sort({'createdAt': 'desc'})

        let check = await conversationModel.findOneAndUpdate({$or: [
            { party: [mongoose.Types.ObjectId(req.user.id), mongoose.Types.ObjectId(messageDel.receiver)] }, 
            { party: [mongoose.Types.ObjectId(messageDel.receiver), mongoose.Types.ObjectId(req.user.id)] }
        ]},{text: messageLast.text, media: messageLast.media})

        console.log(messageLast,check)

        return res.status(200).json({message:"success"})
    } catch (err) {
        return res.status(400).json({message: err.message})
    }
}