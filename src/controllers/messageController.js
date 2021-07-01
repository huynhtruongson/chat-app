const accountModel = require("../models/AccountModel")
const messageModel = require("../models/messageModel")
const mongoose = require('mongoose')
const cloudinary = require('../config/cloudinary')

module.exports.getMessage = async (req, res) =>{
    try {
        let pageSkip = req.query.pageSkip*1 || 0
        let {receiver} = req.params
        if (!receiver) {
            throw new Error ("Missing receiver ID")
        }

        let messageList = await messageModel.find({$or: [
            { sender: mongoose.Types.ObjectId(req.user.id),  receiver: mongoose.Types.ObjectId(receiver) }, 
            { sender: mongoose.Types.ObjectId(receiver), receiver: mongoose.Types.ObjectId(req.user.id) }
        ]}).sort({'createdAt': 'desc'}).limit(10).skip(pageSkip).populate("party","email avatar fullname ")

        return res.status(200).json({
            message: 'get conversation list success',
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

        if(!typeDelete) {
            throw new Error ("Oops something went wrong")
        }

        if(typeDelete === "text") {
            messageDel = await messageModel.findByIdAndUpdate(id, {text: ""}, {new: true })
        } else if (typeDelete === "image") {
            messageDel = await messageModel.findOne({_id: id, "media.resource_type": "image"},"media")
            messageDel.media.forEach(async ({id_cloud}) => await cloudinary.uploader.destroy(id_cloud))
            messageDel = await messageModel.findByIdAndUpdate(id,{$pull: {media: {resource_type: "image"}}}, {new: true })
        } else {
            messageDel = await messageModel.findOne({_id: id, "media.resource_type": "raw"},"media")
            messageDel.media.forEach(async ({id_cloud}) => await cloudinary.uploader.destroy(id_cloud))
            messageDel = await messageModel.findByIdAndUpdate(id,{$pull: {media: {resource_type: "raw"}}}, {new: true })
        }

        if(!messageDel.text && !messageDel.media.length){
            await messageModel.findByIdAndDelete(id)
        }

        return res.status(200).json({message:"success"})
    } catch (err) {
        return res.status(400).json({message: err.message})
    }
}