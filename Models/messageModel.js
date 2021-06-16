const mongoose = require('mongoose')
const Schema = mongoose.Schema

const conversationSchema = new Schema({
    sender:{
        type: Schema.Types.ObjectId,
        ref: "Account",
    },
    receiver:{
        type: Schema.Types.ObjectId,
        ref:"Account",
    },
    message: String,
    image:String,
    id_image:String,
    file:String,
    id_file:String,
},{timestamps: true})
module.exports = mongoose.model('message',conversationSchema)
