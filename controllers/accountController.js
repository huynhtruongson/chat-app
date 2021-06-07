const cloudinary = require('../config/cloudinary')

const AccountModel = require('../models/AccountModel')

module.exports.current = async(req,res)=>{
    try{
        let data = await AccountModel.findById(req.user.id,'email firstname lastname avatar')
    
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