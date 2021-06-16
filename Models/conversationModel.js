const mongoose = require('mongoose')
const Schema = mongoose.Schema

const conversationSchema = new Schema({
    users: [
        {
            type: Schema.Types.ObjectId,
            ref:"Account",
        }
    ],
    message:String,
},{timestamps:true})
module.exports = mongoose.model('conversation',conversationSchema)
