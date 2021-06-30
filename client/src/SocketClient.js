import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addMessage } from './actions/messageAction'
import { addUserOnline, getUserOnline, removeUserOnline } from './actions/onlineUserAction'

const SocketClient = () => {
    const socket = useSelector(state => state.socket)
    const {info} = useSelector(state => state.user) 
    const dispatch = useDispatch()
    //User connect
    useEffect(()=> {
        if(!info._id) return 
        socket.emit('JOIN-USER',info._id)
    },[info._id,socket])
    // Add message
    useEffect(()=>{
        socket.on('ADD-MESSAGE',({msg,user}) => {
            dispatch(addMessage(msg,user))
        })
        return ()=> socket.off('ADD-MESSAGE') 
    },[socket,dispatch])
    // Get user online
    useEffect(() => {
        socket.emit('ONLINE_USER',info._id)
    },[socket,dispatch,info._id])
    // Get user online
    useEffect(() => {
        socket.on('ONLINE_USER',userList => {
            dispatch(getUserOnline(userList))
        })
        return ()=> socket.off('ONLINE_USER')
    },[socket,dispatch,info._id])
    // Add user online
    useEffect(() => {
        socket.on('ADD_USER_ONLINE',userId => {
            dispatch(addUserOnline(userId))
        })
        return ()=> socket.off('ADD_USER_ONLINE')
    },[socket,dispatch,info._id])
    // Remove user online
    useEffect(() => {
        socket.on('REMOVE_USER_ONLINE',userId => {
            dispatch(removeUserOnline(userId))
        })
        return ()=> socket.off('REMOVE_USER_ONLINE')
    },[socket,dispatch,info._id])
}

export default SocketClient
