const crypto = require('crypto')

const cloudinary = require('../config/cloudinary')
const AccountModel = require('../models/AccountModel')

module.exports.current = async(req,res)=>{
    try{
        let data = await AccountModel.findById(req.user.id,'email firstname lastname avatar idAdd')
    
        return res.json({
            code:0,
            message: 'Get login session data successfully',
            data: data
        })
    }catch(err){
        return res.status(400).json({message: err.message})
    }
}

module.exports.updateUser = async(req,res) =>{
    try{
        let {firstname,lastname} = req.body
        let  file = req.files.avatar
        let data = {
            firstname:firstname,
            lastname:lastname
        }

        let checkAvatar = await AccountModel.findById(req.user.id)

        if (checkAvatar.avatar) {
            await cloudinary.uploader.destroy(checkAvatar.id_avatar)            
        }

        if (file){
            const imageCloud = await cloudinary.uploader.upload(file.path,{folder:'avatar'})
            data = {
                ...data,
                avatar:imageCloud.secure_url,
                id_avatar:imageCloud.public_id
            }
        }

        let user = await AccountModel.findByIdAndUpdate(req.user.id, data,{new:true}).select('-_id email firstname lastname avatar')

        res.status(200).json({message:"Update success",data:user})
    }catch(err){
        return res.status(400).json({message: err.message})
    }
}

module.exports.acceptFriend = async (req, res) => {
    try {
        let {id} = req.params
        
        if (!id){
            throw new Error ("Invaluable id")
        }

        let user = await AccountModel.findById(id)

        if (!user) {
            throw new Error ("Opps, something went wrong...")
        }

        if(!user.friend_invite.includes(req.user.id)) {
            throw new Error ("This user not already add friend you")
        }

        await AccountModel.findByIdAndUpdate(req.user.id, {$pull: {friend_request: id}, friend: id},{ safe: true })
        await AccountModel.findByIdAndUpdate(id, {$pull: {friend_invite: req.user.id}, friend: req.user.id}, { safe: true })

        return res.status(200).json({message: "Accept success"})

    } catch (err) {
        return res.status(400).json({message: err.message})
    }
}

module.exports.addFriend = async (req, res) => {
    try {
        let {id} = req.params
        
        if (!id) {
            throw new Error ("Invaluable id add friend")
        }

        let userAddFriend = await AccountModel.findById(id)

        if (!userAddFriend) {
            throw new Error ("Id user not found, please check id again")
        }

        if (userAddFriend.friendrequest.includes(req.user.id)) {
            throw new Error ("The account has already sent a friend request, please wait for acceptance")
        }

        await AccountModel.findByIdAndUpdate(req.user.id, {$push: {friend_invite: id} })

        userAddFriend.friendrequest.push(req.user.id)
        userAddFriend.save()

        return res.status(200).json({message:"Sent a friend request"})
    } catch (err) {
        return res.status(400).json({message: err.message})
    }
}