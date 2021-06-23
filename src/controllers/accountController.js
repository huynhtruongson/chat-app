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
        let fullname = firstname + " " + lastname

        let data = {
            firstname:firstname,
            lastname:lastname,
            fullname: fullname
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

        if(!user.friend_invite_list.includes(req.user.id)) {
            throw new Error ("This user not already add friend you")
        }

        await AccountModel.findByIdAndUpdate(req.user.id, {$pull: {friend_request_list: id}, friend_list: id},{ safe: true })
        await AccountModel.findByIdAndUpdate(id, {$pull: {friend_invite_list: req.user.id}, friend_list: req.user.id}, { safe: true })

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

        if (userAddFriend.friend_request_list.includes(req.user.id)) {
            throw new Error ("The account has already sent a friend request, please wait for acceptance")
        }

        await AccountModel.findByIdAndUpdate(req.user.id, {$push: {friend_invite_list: id} })

        userAddFriend.friend_request_list.push(req.user.id)
        userAddFriend.save()

        return res.status(200).json({message:"Sent a friend request"})
    } catch (err) {
        return res.status(400).json({message: err.message})
    }
}

module.exports.search = async(req, res) =>{
    try{
        let {fullname} = req.query
        let userCurrent = await AccountModel.find({_id: req.user.id})
        let {friend_list, friend_invite_list} = userCurrent
        
        let searchList = await AccountModel.find({fullname: {"$regex":fullname,"$options":"i"}, _id: {$ne: friend_list}}, "-verify -password -tokenVerify -friend_request_list -friend_invite_list").limit(10).lean()

        searchList = searchList.map(user => friend_invite_list && friend_invite.includes(user._id) ? {...user,isRequested : true} : {...user,isRequested : false})
        
        return res.status(200).json({message:"success", data: searchList})
    } catch (err) {
        return res.status(400).json({message: err.message})
    }

}