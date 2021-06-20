const conversationModel = require('../models/conversationModel')
const messageModel = require('../models/messageModel')
const cloudinary = require('../config/cloudinary')
const AccountModel = require('../models/AccountModel')

module.exports.conversationList = async (req, res) => {
    try{
        let {time} = req.params
        let pageSkip = undefined
        if(!parseInt(time)){
            throw new Error ("Resquest is not a number type")
        }
        
        let countConversation = await conversationModel.countDocuments({users: req.user.id})
        console.log(Math.ceil(countConversation/10))
        // if(Math.ceil(countConversation/10) < parseInt( time )){
        //     return res.json({message:"End of list"})
        // } 
        // pageSkip = (parseInt(time)-1)*10

        // let messlist = await message.find({}).populate('user').populate('user_id','_id user_name avatar').sort({'date': 'desc'}).limit(10).skip(parseInt(pageSkip))
        return res.json({
                message: '',
                total:(Math.ceil(countConversation/10)),
                // data:messlist
            })
    }
    catch(err){
        return res.json({message:err.message})
    }
}

module.exports.addMessage = async (req, res) => {
    try {

        let {text,receiver} = req.body
        let {file} = req.files

        if (!text && !file ) {
            throw new Error ("error message")
        }

        let checkReceiver = await AccountModel.findById(receiver)

        if (!checkReceiver) {
            throw new Error ("error message - 404")
        }

        let promiseArr = []
        let messageMedia = []


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
                let listError = []
                
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
                { party: [req.user.id, receiver] }, 
                { party: [receiver, req.user.id] }
            ]},
            {
                party: [receiver, req.user.id] ,
                text: text,
                media: messageMedia
            },
            { new: true, upsert: true }
        )
        

        let new_message = new messageMedia({
            sender: req.user.id,
            receiver: receiver,
            text: String,
            media: messageMedia,
        })
        new_message.save()

        return res.status(200).json({message:"Send message success", data:{new_message:new_message, conversationUpdate: conversationUpdate}, errMedia: listError})
    } catch (err) {
        return res.json({message:err.message})
    }
}