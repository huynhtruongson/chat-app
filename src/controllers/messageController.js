const accountModel = require("../models/AccountModel")
const messageModel = require("../models/messageModel")

module.exports.getMessage = async (req, res) =>{
    try {
        let {pageSkip} = req.query
        let {receiver} = req.params
        if (!receiver) {
            throw new Error ("Missing receiver ID")
        }

        if(!parseInt(pageSkip)){
            throw new Error ("Resquest is not a number type")
        }

        let countMessage = await messageModel.find({$or: [
            { sender: mongoose.Types.ObjectId(req.user.id),  receiver: mongoose.Types.ObjectId(receiver) }, 
            { sender: mongoose.Types.ObjectId(receiver), receiver: mongoose.Types.ObjectId(req.user.id) }
        ]})

        if(Math.ceil(countMessage/10) < parseInt(pageSkip)){
            return res.status(200).json({message:"End of list"})
        }

        pageSkip = (parseInt(pageSkip)-1)*10

        let messageList = await messageModel.find({$or: [
            { sender: mongoose.Types.ObjectId(req.user.id),  receiver: mongoose.Types.ObjectId(receiver) }, 
            { sender: mongoose.Types.ObjectId(receiver), receiver: mongoose.Types.ObjectId(req.user.id) }
        ]}).sort({'createdAt': 'desc'}).limit(10).skip(pageSkip).populate(party)
        
        return res.status(200).json({
            message: 'get conversation list success',
            data: messageList
        })

    } catch (err) {
        return res.status(400).json({message: err.message})
    }
}