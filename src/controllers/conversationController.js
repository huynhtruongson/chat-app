const mongoose = require('mongoose')

const conversationModel = require('../models/conversationModel')
const messageModel = require('../models/messageModel')
const cloudinary = require('../config/cloudinary')
const AccountModel = require('../models/AccountModel')

module.exports.conversationList = async (req, res) => {
    try{
        let pageSkip = req.query.pageSkip*1 || 0

        let conversationList = await conversationModel.find({party: mongoose.Types.ObjectId(req.user.id)}).sort({'createdAt': 'desc'}).limit(10).skip(pageSkip).populate("party")
        
        return res.status(200).json({
                message: 'get conversation list success',
                data:conversationList
        })
    }
    catch(err){
        console.log(err)
        return res.status(400).json({message:err.message})
    }
}

module.exports.addMessage = async (req, res) => {
    try {

        let {text,receiver} = req.body
        let {media} = req.files
        let file = media

        if (!receiver) {
            throw new Error ("error message")
        }

        if (!text && !file ) {
            throw new Error ("error message")
        }

        let checkReceiver = await AccountModel.findById(mongoose.Types.ObjectId(receiver))    
        
        if (!checkReceiver) {
            throw new Error ("error message - 404")
        }

        let promiseArr = []
        let messageMedia = []
        let listError = []

        if(file){
            
            if (!file.length) {
                
                let {type} = file

                if (type.split("/")[0] === "application") {
                    
                    const mediaCloud = await cloudinary.uploader.upload(file.path,{folder:'message', resource_type: "raw"})
                    messageMedia.push({
                        id_cloud: mediaCloud.public_id,
                        url_cloud: mediaCloud.secure_url,
                        name: file.name,
                        resource_type: mediaCloud.resource_type
                    })

                } else {

                    const mediaCloud = await cloudinary.uploader.upload(file.path,{folder:'message', resource_type: type.split("/")[0]})
                    messageMedia.push({
                        id_cloud: mediaCloud.public_id,
                        url_cloud: mediaCloud.secure_url,
                        name: file.name,
                        resource_type: mediaCloud.resource_type
                    })

                }

            } else {
                
                for (const element of file) {
                    let {type} = element

                    if (type.split("/")[0] === "application") {

                        promiseArr.push(cloudinary.uploader.upload(element.path,{folder:'message', resource_type: "raw"}).catch(()=>{}))
                        
                    } else {

                        promiseArr.push(cloudinary.uploader.upload(element.path,{folder:'message',  resource_type: type.split("/")[0]}).catch(()=>{}))
                
                    }
                }
                let uploadInf = await Promise.all(promiseArr)
                
                
                for (let i = 0; i < uploadInf.length; i++) {
                    
                    if (uploadInf[i] === undefined) {
                        
                        listError.push(file[i].name)
                        messageMedia.push({
                            id_cloud: null,
                            url_cloud: null,
                            name: null,
                            resource_type: null
                        })
                    
                    }else{

                        messageMedia.push({
                            id_cloud: uploadInf[i].public_id,
                            url_cloud: uploadInf[i].secure_url,
                            name: file[i].name,
                            resource_type: uploadInf[i].resource_type
                        })
                    }
                }
            }

        }
        //service in database

        let conversationUpdate = await conversationModel.findOneAndUpdate({ 
            $or: [
                { party: [mongoose.Types.ObjectId(req.user.id), mongoose.Types.ObjectId(receiver)] }, 
                { party: [mongoose.Types.ObjectId(receiver), mongoose.Types.ObjectId(req.user.id)] }
            ]},
            {
                party: [ mongoose.Types.ObjectId(receiver), mongoose.Types.ObjectId(req.user.id)] ,
                text: text,
                media: messageMedia
            },
            { new: true, upsert: true }
        )

        let new_message = new messageModel({
            sender: mongoose.Types.ObjectId(req.user.id),
            receiver: mongoose.Types.ObjectId(receiver),
            text: text,
            media: messageMedia,
        })
        new_message.save()

        return res.status(200).json({message:"Send message success", data:{new_message:new_message, conversationUpdate: conversationUpdate}, errMedia: listError})
    } catch (err) {
        return res.json({message:err.message})
    }
}