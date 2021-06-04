const {cloudinary} = require('../config/cloudinary')

const AccountModel = require('../models/AccountModel')

module.exports.current = async(req,res)=>{
    try{
        let data = await AccountModel.findById(req.user.id)
    
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
        let {id} = req.params
        let {firstName,lastName} = req.body
        let  file = req.files.image
        let data = undefined
        if(!file){
            data = {
                firstname:firstName,
                lastName:lastName
            }
        }
        else{
            const imageCloud = await cloudinary.uploader.upload(file.path)
            data = {
                firstname:firstName,
                lastName:lastName,
                avatar:imageCloud.secure_url,
                id_avatar:imageCloud.public_id
            }
        }

        let user = await AccountModel.findByIdAndUpdate(id, data)

        res.status(200).json({message:"Update success",data:user})
    }catch(err){
        return res.status(400).json({message: err.message})
    }
}