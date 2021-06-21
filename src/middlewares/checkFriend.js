let accountModel = require("../models/AccountModel")

module.exports.checkFriend = async (req, res, next) =>{
    try {
        let {receiver} = req.body
        let user = await accountModel.findById(req.user.id)
        let {friend} = user
        
        if (!friend.includes(receiver)) {
            throw new Error("Let be friend to chatting")
        }
        next()
    } catch (err) {
        return res.status(400).json({message:err.message})
    }
    
}