const mongoose = require('mongoose')
const Schema = mongoose.Schema

const conversationSchema = new Schema({
    party: [
        {
            type: Schema.Types.ObjectId,
            ref:"Account",
            required: [true, "user id in party should not be emty"]
        }
    ],
    text: String,
    media: [{
        id_cloud: String,
        url_cloud: String,
        name: String,
        resource_type: String

    }]
},{timestamps:true})
module.exports = mongoose.model('conversation',conversationSchema)
