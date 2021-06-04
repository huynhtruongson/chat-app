const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AccountSchema = new Schema({
    email:{
        type:String,
        unique: true
    },
    firstname:String,
    lastname:String,
    birth:String,
    gender:String,
    phone:String,
    avatar:String,
    id_avatar:String,
    password: String,
    role:String,
    unread:Array,
    tokenVerify:String,
    verify:{
        type:Boolean,
        default:false,
    },
    conversations: Array,
    deleted:[Object],
},{timestamps:true})
module.exports = mongoose.model('Account',AccountSchema)
