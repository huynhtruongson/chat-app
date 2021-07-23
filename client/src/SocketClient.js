import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addMessage, deleteMessage, updateMessage } from './actions/messageAction'
import { addUserOnline, getUserOnline, removeUserOnline } from './actions/onlineUserAction'

const SocketClient = () => {
    const socket = useSelector(state => state.socket)
    const {info} = useSelector(state => state.user) 
    const dispatch = useDispatch()
    //User connect
    useEffect(()=> {
        if(!info._id) return 
        socket.emit('JOIN_USER',info)
    },[info,socket])
    // Add message
    useEffect(()=>{
        socket.on('ADD_MESSAGE',({msg,user}) => {
            dispatch(addMessage(msg,user))
        })
        return ()=> socket.off('ADD_MESSAGE') 
    },[socket,dispatch])
    // Get user online
    useEffect(() => {
        if(!info._id) return 
        socket.emit('ONLINE_USER',info._id)
    },[socket,info])
    // Get user online
    useEffect(() => {
        socket.on('ONLINE_USER',userList => {
            dispatch(getUserOnline(userList))
        })
        return ()=> socket.off('ONLINE_USER')
    },[socket,dispatch])
    // Add user online
    useEffect(() => {
        socket.on('ADD_USER_ONLINE',userId => {
            dispatch(addUserOnline(userId))
        })
        return ()=> socket.off('ADD_USER_ONLINE')
    },[socket,dispatch])
    // Remove user online
    useEffect(() => {
        socket.on('REMOVE_ONLINE_USER',userId => {
            dispatch(removeUserOnline(userId))
        })
        return ()=> socket.off('REMOVE_ONLINE_USER')
    },[socket,dispatch])
    // Delete message
    useEffect(()=>{
        socket.on('DELETE_MESSAGE',(id) => {
            dispatch(deleteMessage(id))
        })
        return ()=> socket.off('DELETE_MESSAGE') 
    },[socket,dispatch])
    // Update message
    useEffect(()=>{
        socket.on('UPDATE_MESSAGE',(msg) => {
            dispatch(updateMessage(msg))
        })
        return ()=> socket.off('UPDATE_MESSAGE') 
    },[socket,dispatch])
    // Update conversation
    // useEffect(()=>{
    //     socket.on('UPDATE_CONVERSATION',(msg) => {
    //         dispatch(updateConversation(msg))
    //     })
    //     return ()=> socket.off('UPDATE_CONVERSATION') 
    // },[socket,dispatch])
    
    return <></>
}

export default SocketClient
