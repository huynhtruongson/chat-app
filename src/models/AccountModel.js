const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AccountSchema = new Schema({
    email:{
        type:String,
        unique: true
    },
    fullname:String,
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
    friend_invite_list:[String],
    friend_list:[String],
    friend_request_list:[String],
    deleted:[Object],
    blocked:[String]
},{timestamps:true})
module.exports = mongoose.model('Account',AccountSchema)
