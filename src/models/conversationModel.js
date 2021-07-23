const mongoose = require('mongoose')
const Schema = mongoose.Schema

const conversationSchema = new Schema({
    party: [
        {
            type: Schema.Types.ObjectId,
            ref:"Account",
        }
    ],
    last_sender: {
        type: Schema.Types.ObjectId,
        ref:"Account",
    },
    delete: [
        {
            type: Schema.Types.ObjectId,
            ref:"Account",
        }
    ],
    seen: {
        type: Boolean,
        default: false
    },
    update_time: Date,
    name: String,
    text: String,
    media: [{
        id_cloud: String,
        url_cloud: String,
        name: String,
        resource_type: String
    }],
},{timestamps:true})
module.exports = mongoose.model('conversation',conversationSchema)
