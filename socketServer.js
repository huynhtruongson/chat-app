let userList = []

module.exports.socketServer = (socket) =>{
    socket.on("JOIN_USER", (user) => {
        let userListOnline = userList.filter(us => us.friendList.find(id => id === user._id))

        userListOnline.forEach(us => {
            socket.to(us.socketID).emit("ADD_USER_ONLINE", user._id)
        });
        userList.push({userID: user._id, socketID: socket.id , friendList: user.friend_list})

    })

    socket.on("disconnect", ()=>{
        let userOffline  = userList.find(user => user.socketID === socket.id)
        if (userOffline) {
            let users = userList.filter(user => user.friendList.find(id => id === userOffline.userID ))
            userList = userList.filter(user => user.socketID !== socket.id)
            users.forEach(user => {socket.to(user.socketID).emit("REMOVE_ONLINE_USER", userOffline.userID)});
        }
    })

    socket.on("ADD_MESSAGE", ({msg,user}) => {
        let userChat = userList.find(({userID})=> userID === msg.receiver)
        if(userChat)
            socket.to(userChat.socketID).emit("ADD_MESSAGE",{msg,user})
    })

    socket.on("ONLINE_USER", (userID) => {
        let user = userList.find(us => us.userID === userID)
        if (user) {
            let userListOnline = userList.filter(us => us.friendList.find(id => id === userID))
            userListOnline = userListOnline.map(us => us.userID)
            socket.emit("ONLINE_USER",userListOnline)
        }
    })

    socket.on("DELETE_MESSAGE",({id,receiver}) => {
        let receiveUser = userList.find(({userID}) => userID === receiver)
        if(receiveUser)
            socket.to(receiveUser.socketID).emit("DELETE_MESSAGE",id)
    })
    
    // socket.on('UPDATE_CONVERSATION',({msg,receiver}) => {
    //     const receiveUser = userList.find(({userID}) => userID === receiver)
    //     if(receiveUser)
    //         socket.to(receiveUser.socketID).emit("UPDATE_CONVERSATION",msg)
    // })

    socket.on('TYPING',({receiver}) => {
        let userChat = userList.find(({userID})=> userID === receiver)
        if(userChat)
            socket.to(userChat.socketID).emit("TYPING",{receiver})
    })

    socket.on('UPDATE_MESSAGE',({msg,receiver})=>{
        const receiveUser = userList.find(({userID}) => userID === receiver) 
        if(receiveUser)
            socket.to(receiveUser.socketID).emit("UPDATE_MESSAGE",msg)
    })
    socket.on('FRIEND_REQUEST',({info,id}) => {
        const receiveUser = userList.find(({userID}) => userID === id) 
        if(receiveUser)
            socket.to(receiveUser.socketID).emit("FRIEND_REQUEST",info)
    })
}