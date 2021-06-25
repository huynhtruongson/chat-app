let messageModel = require('../models/messageModel')
const mongoose = require('mongoose')

module.exports = async (req, res, next) =>{
    try {
        let {id} = req.params
        let {sender} = await messageModel.findById(id)

        if(String(sender) !== req.user.id) {
            throw new Error("You do not have this permission")
        }

        next()
    } catch (err) {
        return res.status(400).json({message: err.message})
    }
} 