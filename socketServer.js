let userList = []

module.exports.socketServer = (socket) =>{
    socket.on("JOIN_USER", (user) => {
        let userListOnline = userList.filter(us => us.friendList.find(id => id === user._id))
        console.log('id : ',socket.id)
        console.log(userListOnline)
        userListOnline.forEach(us => {
            // console.log(us.socketID,typeof us.socketID)
            socket.to(us.socketID).emit("ADD_USER_ONLINE", user._id)
        });
        userList.push({userID: user._id, socketID: socket.id , friendList: user.friend_list})
        console.log('list : ',userList)
    })

    socket.on("disconnect", ()=>{
        console.log(socket.id)
        let userOffline  = userList.find(user => user.socketID = socket.id)
        if (userOffline) {
            let users = userList.filter(user => user.friendList.find(id => id === socket.id ))
            userList = userList.filter(user => 
                user.socketID !== socket.id
            )
            
            users.forEach(user => {
                socket.to(String(user.socketID)).emit("REMOVE_ONLINE_USER", userOffline.userID)
            });
        }
    })

    socket.on("ADD_MESSAGE", ({msg,user}) => {
        let userChat = userList.find(({userID})=> userID === user._id)
        if(userChat)
            socket.to(String(userChat.socketID)).emit("ADD_MESSAGE",{msg,user})
    })

    socket.on("ONLINE_USER", (userID) => {
        let user = userList.find(user => user.userID === userID)
        if (user) {
            let userListOnline = userList.filter(us => us.friendList.find(id => id === user.userID))
            socket.to(user.socketID).emit("ONLINE_USER",userListOnline)
        }
    })

    socket.on("REMOVE_MESSAGE",(msg,user) => {
        let userChat = userList.find(({userID})=> userID === user._id)
        if(userChat)
            socket.to(String(userChat.socketID)).emit("REMOVE_MESSAGE",{msg,user})
    })

}