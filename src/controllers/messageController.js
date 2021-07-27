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
        let {typeDelete} = req.body        
        let messageDel = undefined

        if (!typeDelete) throw new Error("Opps something went wrong...")
        messageDel = await messageModel.findById(id)

        if(!messageDel) {
            throw new Error ("Opps something went wrong..")
        }

        if (typeDelete === "text") {
            messageDel.text = ""
        } else if (typeDelete ===  "image") {
            messageDel.media.forEach(async (media) =>{ 
                if (media.resource_type === "image")
                    await cloudinary.uploader.destroy(media.id_cloud)
            })
            messageDel.media = messageDel.media.filter(media => media.resource_type !== "image")   
        } else {
            messageDel.media.forEach(async (media) =>{ 
                if (media._id.equals(typeDelete))
                    await cloudinary.uploader.destroy(media.id_cloud)
            })
            messageDel.media = messageDel.media.filter(media => !media._id.equals(typeDelete))  
        }
        
        if (!messageDel.media.length && !messageDel.text) {
            await messageModel.findByIdAndDelete(id)
        }else await messageDel.save()

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
        ]},{text: messageLast.text, media: messageLast.media,last_sender:messageLast.sender,seen:messageLast.seen})
        
        return res.status(200).json({message:"success", data: messageDel})
    } catch (err) {
        return res.status(400).json({message: err.message})
    }
}