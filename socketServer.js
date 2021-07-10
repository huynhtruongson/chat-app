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
        let userChat = userList.find(({userID})=> userID === msg.reciver)
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

    socket.on("REMOVE_MESSAGE",(msg,user) => {
        let userChat = userList.find(({userID})=> userID === user._id)
        if(userChat)
            socket.to(userChat.socketID).emit("REMOVE_MESSAGE",{msg,user})
    })

}