const conversationModel = require('../models/conversationModel')
const messageMode = require('../models/messageModel')

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
        return res.json({code:1,message:err.message})
    }
}