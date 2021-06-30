let userList = []

module.exports.socketServer = (socket) =>{
    socket.on("JOIN_USER", (user) => {
        userList.push({userID: user._id, socketID: socket.id , friendList: user.friendList})
        let userListOnline = userList.filter(us => user.friendList.find(id => id === us.userID))
        
        userListOnline.forEach(us => {
            socket.to(String(us.socketID).emit("ADD_USER_ONLINE", user._id)
        });
    })

    socket.on("disconnect", ()=>{
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

    socket.on("ADD_MESSAGE", ({msg,user})=>{
        let userChat = userList.find(({userID})=> userID === user._id)
        if(userChat)
            socket.to(String(userChat.socketID)).emit("ADD_MESSAGE",{msg,user})
    })

    socket.on("ONLINE_USER", (id) => {
        let user = userList.find(user => user.socketID = socket.id)
        if (user) {
            let userListOnline = userList.filter(user => user.friendList.find(id => id === socket.id))
            socket.to(user.socketID).emit("ONLINE_USER",userListOnline)
        }
    })
}