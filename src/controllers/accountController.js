const crypto = require('crypto')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const cloudinary = require('../config/cloudinary')
const AccountModel = require('../models/AccountModel')

module.exports.current = async(req,res)=>{
    try{
        let data = await AccountModel.findById(req.user.id,'email firstname lastname avatar fullname friend_list type_account')
    
        return res.status(200).json({
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

        await AccountModel.findByIdAndUpdate(req.user.id, {$pull: {friend_request_list: id},$push: {friend_list: id}},{ safe: true })
        await AccountModel.findByIdAndUpdate(id, {$pull: {friend_invite_list: req.user.id}, $push: {friend_list: req.user.id}}, { safe: true })

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
            await AccountModel.findByIdAndUpdate(req.user.id, {$pull: {friend_invite_list: id}}, {safe: true})
            await AccountModel.findByIdAndUpdate(id, {$pull: {friend_request_list: req.user.id}}, {safe: true})

            return res.status(200).json({message:"remove a friend request"})
        }

        await AccountModel.findByIdAndUpdate(req.user.id, {$push: {friend_invite_list: id} })

        userAddFriend.friend_request_list.push(req.user.id)
        await userAddFriend.save()

        return res.status(200).json({message:"Sent a friend request"})
    } catch (err) {
        return res.status(400).json({message: err.message})
    }
}

module.exports.search = async(req, res) =>{
    try{
        let search = req.query
        if(Object.keys(search)[0]==="fullname")
            search.fullname = {"$regex": search.fullname, "$options":"i"}

        let userCurrent = await AccountModel.findById(req.user.id)
        let {friend_list, friend_invite_list} = userCurrent

        let searchList = await AccountModel.find({...search, friend_invite_list: {$nin: req.user.id},_id: {$nin: [...friend_list,req.user.id]}}, "-verify -password -tokenVerify -friend_request_list -friend_invite_list").lean()
        searchList = searchList.map(user => {
            if(friend_invite_list)
                if(friend_invite_list.includes(user._id)) 
                    return {...user,isRequested : true}
                return {...user,isRequested : false}
        })

        let invite_to_me = await AccountModel.find({...search, friend_invite_list: req.user.id, _id: {$nin: [...friend_list,req.user.id]}}, "-verify -password -tokenVerify -friend_request_list -friend_invite_list").lean()
        invite_to_me = invite_to_me.map(user => ({ ...user, isInvited: true}))
        return res.status(200).json({message:"success", data:  [...invite_to_me,...searchList]})

    } catch (err) {
        return res.status(400).json({message: err.message})
    }

}

module.exports.friendRequestList = async (req, res) => {
    try {
        let friendRequestList = await AccountModel.findById(req.user.id, "friend_request_list").populate("friend_request_list",'email firstname lastname fullname avatar')

        return res.status(200).json({message:"success", data: friendRequestList.friend_request_list})
    } catch (err) {
        return res.status(400).json({message: err.message})
    }
}

module.exports.friendList = async (req, res) => {
    try {
        let friendList = await AccountModel.findById(req.user.id, "friend_list").populate("friend_list",'email firstname lastname fullname avatar')

        return res.status(200).json({message:"success", data: friendList.friend_list})
    } catch (err) {
        return res.status(400).json({message: err.message})
    }
}

module.exports.refuseFriend = async (req, res) => {
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

        await AccountModel.findByIdAndUpdate(req.user.id, {$pull: {friend_request_list: id}},{ safe: true })
        await AccountModel.findByIdAndUpdate(id, {$pull: {friend_invite_list: req.user.id}}, { safe: true })

        return res.status(200).json({message: "Refuse success"})

    } catch (err) {
        return res.status(400).json({message: err.message})
    }
}

module.exports.changePassword = async (req, res) =>{
    try {
        let {password, new_password, confirm_password} = req.body

        if (!new_password || !password || !confirm_password){
            throw new Error("Opps something went wrong....")
        }

        let account = await AccountModel.findById(req.user.id)
        if(account.type_account === 'google')
            return res.status(400).json({message: 'You can not change password,you can do this action via your google account.'})
        let passwordMatch = await bcrypt.compare(password, account.password)

        if(!passwordMatch ) {
            throw new Error("Your old password is not correct")
        }

        if(new_password !== confirm_password ){
            throw new Error("Confirm password is not match")
        }

        let newPassword = await bcrypt.hash(confirm_password, 10)
        account.password = newPassword
        await account.save()
        
        return res.status(200).json({message:"Change password success"})
    } catch (err) {
        return res.status(400).json({message: err.message})
    }
}