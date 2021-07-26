const mongoose = require('mongoose')

const conversationModel = require('../models/conversationModel')
const messageModel = require('../models/messageModel')
const cloudinary = require('../config/cloudinary')
const AccountModel = require('../models/AccountModel')

function convertViToEn(str) {

    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a")
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i")
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o")
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
    str = str.replace(/đ/g, "d")
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A")
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E")
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I")
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O")
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U")
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y")
    str = str.replace(/Đ/g, "D")
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, "") // Huyền sắc hỏi ngã nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, "") // Â, Ê, Ă, Ơ, Ư

    return str
}

module.exports.conversationList = async (req, res) => {
    try{
        let pageSkip = req.query.pageSkip*1 || 0
        let conversationList = await conversationModel.find({party: mongoose.Types.ObjectId(req.user.id), delete: {$ne: [req.user.id]}}).sort({'update_time': 'desc'}).limit(15).skip(pageSkip).populate("party","fullname avatar email firstname lastname")
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
            throw new Error ("error message, missing id")
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
                    
                    let linkcloud = mediaCloud.secure_url.split('upload')
                    
                    messageMedia.push({
                        id_cloud: mediaCloud.public_id,
                        url_cloud: encodeURI(`${linkcloud[0]}upload/fl_attachment:${convertViToEn(file.name.split(".")[0])}${linkcloud[1]}`),
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

                        let urlCloud = undefined
                        if(uploadInf[i].resource_type === "raw"){
                            let urlSplit = uploadInf[i].secure_url.split('upload')   
                            urlCloud = encodeURI(`${urlSplit[0]}upload/fl_attachment:${convertViToEn(file[i].name.split(".")[0])}${urlSplit[1]}`)
                        }
                        else{
                            urlCloud =uploadInf[i].secure_url
                        }

                        messageMedia.push({
                            id_cloud: uploadInf[i].public_id,
                            url_cloud: urlCloud,
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
                media: messageMedia,
                delete: [],
                seen: false,
                update_time: new Date().toISOString(),
                last_sender: req.user.id
            },
            { new: true, upsert: true }
        )

        let new_message = new messageModel({
            conversation: mongoose.Types.ObjectId(conversationUpdate._id),
            sender: mongoose.Types.ObjectId(req.user.id),
            receiver: mongoose.Types.ObjectId(receiver),
            text: text,
            seen: false,
            media: messageMedia,
        })
        new_message.save()

        return res.status(200).json({message:"Send message success", data:{new_message:new_message, conversationUpdate: conversationUpdate}, errMedia: listError})
    } catch (err) {
        return res.json({message:err.message})
    }
}

module.exports.imageGallery = async (req, res) =>{
    try {

        let {id} = req.params
        let imageList = []
        let imageListQuery = await messageModel.find({
                $or: [ 
                    { sender: mongoose.Types.ObjectId(req.user.id),  receiver: mongoose.Types.ObjectId(id) }, 
                    { sender: mongoose.Types.ObjectId(id), receiver: mongoose.Types.ObjectId(req.user.id) }
                ],
                "media.resource_type": "image"
            },
        ).sort({'createdAt': 'desc'})
        
        imageListQuery.forEach(element => imageList = imageList.concat(element.media))
        imageList = imageList.filter(f => f.resource_type === 'image').map(({url_cloud}) => ({url_cloud}))
        return res.status(200).json({message: "Get image gallery success", data: imageList})

    } catch (err) {
        return res.status(400).json({message: err.message})
    }
}

module.exports.videoGallery = async (req, res) =>{
    try {

        let {id} = req.params
        let videoList = []
        let videoListQuery = await messageModel.find({
                $or: [ 
                    { sender: mongoose.Types.ObjectId(req.user.id),  receiver: mongoose.Types.ObjectId(id) }, 
                    { sender: mongoose.Types.ObjectId(id), receiver: mongoose.Types.ObjectId(req.user.id) }
                ],
                "media.resource_type": "video"
            },
        ).sort({'createdAt': 'desc'})

        videoListQuery.forEach(element => videoList = videoList.concat(element.media))
        videoList = videoList.filter(f => f.resource_type === 'video').map(({url_cloud}) => ({url_cloud}))
        return res.status(200).json({message: "Get image gallery success", data: videoList})

    } catch (err) {
        return res.status(400).json({message: err.message})
    }
}

module.exports.fileGallery = async (req, res) =>{
    try {

        let {id} = req.params
        let fileList = []
        let fileListQuery = await messageModel.find({
                $or: [ 
                    { sender: mongoose.Types.ObjectId(req.user.id),  receiver: mongoose.Types.ObjectId(id) }, 
                    { sender: mongoose.Types.ObjectId(id), receiver: mongoose.Types.ObjectId(req.user.id) }
                ],
                "media.resource_type": "raw"
            },
        ).sort({'createdAt': 'desc'})

        fileListQuery.forEach(element => fileList = fileList.concat(element.media))
        fileList = fileList.filter(f => f.resource_type === 'raw').map(({url_cloud,name}) => ({url_cloud,name}))
        return res.status(200).json({message: "Get image gallery success", data: fileList})

    } catch (err) {
        return res.status(400).json({message: err.message})
    }
}

module.exports.delConversation = async (req, res) =>{
    try {
        let {id} = req.params
        let checkExist = await conversationModel.findOne({
            $or: [
                { party: [mongoose.Types.ObjectId(req.user.id), mongoose.Types.ObjectId(id)] }, 
                { party: [mongoose.Types.ObjectId(id), mongoose.Types.ObjectId(req.user.id)] }
            ]}
        )

        if(!checkExist || checkExist.delete.includes(req.user.id)) {
            throw new Error ("Opps something went wrong ...")
        }
        
        let updateConversation = await conversationModel.findOneAndUpdate({
            $or: [
                { party: [mongoose.Types.ObjectId(req.user.id), mongoose.Types.ObjectId(id)] }, 
                { party: [mongoose.Types.ObjectId(id), mongoose.Types.ObjectId(req.user.id)] }
            ]}
            , {$push: {delete: req.user.id}}, {new: true})
        
        let receiver = updateConversation.party.find(user => String(user) !== req.user.id)

        let updateMessage = await messageModel.updateMany({
            $or: [
                { sender: mongoose.Types.ObjectId(req.user.id),  receiver: mongoose.Types.ObjectId(receiver) }, 
                { sender: mongoose.Types.ObjectId(receiver), receiver: mongoose.Types.ObjectId(req.user.id) }
            ],
            delete: {$ne: [req.user.id]}

        }, {$push: {delete: req.user.id}})
        
        return res.send(updateConversation)
       
    } catch (err){
        return res.status(400).json({message: err.message})
    }
}

module.exports.seenConversation = async (req, res) =>{
    try {
        let {id} = req.params
    
        if (!id) throw new Error("Opps something went wrong..")
        let updateConversation = await conversationModel.findOne({ 
            $or: [
                { party: [mongoose.Types.ObjectId(req.user.id), mongoose.Types.ObjectId(id)] }, 
                { party: [mongoose.Types.ObjectId(id), mongoose.Types.ObjectId(req.user.id)] }
            ]}
        )
        
        if(!updateConversation) throw new Error("Opps something went wrong ...")

        let updateMessages = await messageModel.updateMany({
            $or: [
                { sender: mongoose.Types.ObjectId(req.user.id),  receiver: mongoose.Types.ObjectId(receiver) }, 
                { sender: mongoose.Types.ObjectId(receiver), receiver: mongoose.Types.ObjectId(req.user.id) }
            ],
            seen: false,

        },{seen: true})
        
        updateConversation.seen = true
        await updateConversation.save()

        return res.status(200).json({message: "Success"})
    } catch (err) {
        return res.status(400).json({message: err.message})
    }
    

}