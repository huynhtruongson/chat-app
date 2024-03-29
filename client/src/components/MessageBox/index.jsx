import {Avatar,Box,IconButton,makeStyles,Typography,CircularProgress, Badge} from '@material-ui/core';
import {Info,ArrowBack} from '@material-ui/icons';
import { useState, useRef } from 'react';
import Message from '../Mesage';
import ChatForm from '../ChatForm'
import {  useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import useLoadMessage from '../../hooks/useLoadMessage';
import { useCallback } from 'react';
import React from 'react';
import { deleteMessage, updateMessage } from '../../actions/messageAction';
import _alert from '../../utils/alert';
import MessageApi from '../../api/messageApi';
import Images from '../../constants/Images';
import ProfileModal from '../ProfileModal';
import moment from 'moment';
const MessageBox = ({handleShowInfo,handleShowConversation}) => {
    const {activeConv,messages} = useSelector(state => state.message)
    const {info} = useSelector(state => state.user)
    const socket = useSelector(state => state.socket)
    const onlineUser = useSelector(state => state.onlineUser)
    const isUserOnline = onlineUser.includes(activeConv._id)
    const [onTyping,setOnTyping] = useState(false)
    const [userModal,setUserModal] = useState(false)
    const style = useStyle({isUserOnline,onTyping});
    const dispatch = useDispatch()
    const observer = useRef()
    const [page,setPage] = useState(1)
    const {loading,hasMore} = useLoadMessage(page)
    const messageEndRef = useCallback(node => {
        if(loading) return
        if(observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1)
            }
        },{
            threshold : 1
        })
        if(node) observer.current.observe(node)
    },[loading,hasMore])
    const handleDeleteMessage = async (msg,data)=> {
        _alert({
            title : 'Delete message',
            msg : 'Are you sure you want to delete this message.',
            icon : 'warning',
            showCancelButton : true,
            confirmButtonText : 'Delete',
            callback : async ({isConfirmed}) => {
                if(isConfirmed) {
                    try {
                        const updateMsg = {...msg}
                        if(data === 'text')
                            updateMsg.text = ''
                        else if(data === 'image')
                            updateMsg.media = updateMsg.media.filter(md => md.resource_type !== 'image')
                        else {
                            updateMsg.media = updateMsg.media.filter(md => md._id !== data)
                        }
                        if(!updateMsg.text && !updateMsg.media.length) {
                            dispatch(deleteMessage(updateMsg._id))
                        }
                        else {
                            dispatch(updateMessage(updateMsg))
                        }
                        const res = await MessageApi.deleteMessage(updateMsg._id,{typeDelete : data})
                        if(res.status === 200) {
                            if(!updateMsg.text && !updateMsg.media.length) {
                                socket.emit('DELETE_MESSAGE',{id : updateMsg._id,receiver : updateMsg.receiver})
                            }
                            else {
                                socket.emit('UPDATE_MESSAGE',{msg : res.data,receiver:updateMsg.receiver})
                            }
                        }
                    } catch (error) {
                        console.log(error)
                    }
                }
            }
        })
    }
    const isDisplayTimeDivider = (pre,curr) => {
        const msgTime = moment(curr)
        const preMsgTime = moment(pre)
        const duration = moment.duration(msgTime.diff(preMsgTime))
        return Math.abs(duration.asHours()) >= 1
    }
    useEffect(()=>{
        setPage(1)
        setOnTyping(false)
    },[activeConv._id])
    useEffect(()=>{
        if(socket) {
            socket.on('USER_TYPING',(convId)=> {
                if(activeConv._id === convId)
                    setOnTyping(true)
            })
        }
        return ()=> {
            if(socket)
                socket.off('USER_TYPING')
        }
    },[socket,activeConv._id])
    useEffect(()=>{
        if(socket) {
            socket.on('USER_TYPING',(convId)=> {
                if(activeConv._id === convId)
                    setOnTyping(true)
            })
        }
        return ()=> {
            if(socket)
                socket.off('USER_TYPING')
        }
    },[socket,activeConv._id])
    useEffect(()=>{
        if(socket) {
            socket.on('USER_CANCEL_TYPING',(convId)=> {
                if(activeConv._id === convId)
                    setOnTyping(false)
            })
        }
        return ()=> {
            if(socket)
                socket.off('USER_CANCEL_TYPING')
        }
    },[socket,activeConv._id])
    return (
        <Box display="flex" flexDirection="column" height="100%">
            <Box className={style.messageHeader}>
                <Box display="flex" alignItems="center">
                    <IconButton onClick={()=>handleShowConversation(false)} className={style.backBtn}>
                        <ArrowBack color='primary'/>
                    </IconButton>
                    <Badge
                        variant="dot"
                        classes={{
                            dot: style.badgeDot,
                            anchorOriginTopRightRectangle : style.badgeAnchor
                        }}
                    >
                        <Avatar
                            classes={{ root: style.avatar }}
                            src={activeConv.avatar}
                        />
                    </Badge>
                    <Box ml={0.8}>
                        <Typography
                            onClick={()=>setUserModal(true)}
                            classes={{ root: style.username }}
                            variant="subtitle2">
                            {activeConv.fullname}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {
                                isUserOnline ? 'Active now' : 'Offline'
                            }
                        </Typography>
                    </Box>
                </Box>
                <Box>
                    <IconButton onClick={handleShowInfo} color="primary">
                        <Info />
                    </IconButton>
                </Box>
                <Box className={style.loading}>
                    {loading && <CircularProgress/>}
                </Box> 
            </Box>
            <Box className={style.messagesContainer}>
                <Box className={style.typingMsg}>
                    <Avatar src={activeConv.avatar} />
                    <img src={Images.TYPING_IMG} alt="" className={style.typingImage} />
                </Box>
                {messages && messages.map((msg,index) => (
                    <Message 
                        key={msg._id} 
                        msg={msg} 
                        user={activeConv}
                        self={msg.sender === info._id}
                        isAvatar={index === 0 ? true : 
                            msg.receiver !== messages[index-1].receiver || 
                            isDisplayTimeDivider(messages[index-1].createdAt,msg.createdAt)}
                        handleDeleteMessage={handleDeleteMessage}
                        displayTime={index === messages.length-1 ? true : isDisplayTimeDivider(messages[index+1].createdAt,msg.createdAt)}
                        isLast={index === 0}
                        ref={index === messages.length-1 ? messageEndRef : null}/>
                ))}
            </Box>
            <ChatForm/>
            <ProfileModal open={userModal} onClose={()=> setUserModal(false)} user={activeConv} />
        </Box>
    );
};
const useStyle = makeStyles((theme) => ({
    avatar: {
        width: '48px',
        height: '48px',
        border : '2px solid #fff'
    },
    username: {
        fontSize: '1.1rem',
        cursor : 'pointer',
        '&:hover' : {
            textDecoration : 'underline'
        }
    },
    loading : {
        textAlign : 'center',
        padding : '12px 0',
        position : 'absolute',
        bottom : 0,
        left : 0,
        width : '100%',
        transform : 'translateY(100%)',
        zIndex : 10
    },
    messagesContainer : {
        flex: 1,
        display:"flex",
        overflow:"auto",
        flexDirection:"column-reverse",
        padding : '16px 0'
    },
    messageHeader : {
        display:"flex",
        justifyContent:"space-between",
        alignItems:"center",
        borderBottom:"1px solid #cacaca",
        height:'65px',
        padding : '0 8px',
        position : 'relative'
    },
    backBtn : {
        display : 'none',
        [theme.breakpoints.down('sm')] : {
            display : 'block'
        }
    },
    badgeDot: {
        display : ({isUserOnline}) => isUserOnline ? 'block' : 'none',
        backgroundColor: '#15A85F',
        width: '12px',
        height: '12px',
        border: '1.5px solid #fff',
        borderRadius: '100rem',
    },
    badgeAnchor: {
        top: '8px',
        right: '6px',
    },
    typingMsg : {
        display: ({onTyping}) => onTyping ? 'flex' : 'none',
        alignItems:'center',
        marginLeft: theme.spacing(1)
    },
    typingImage : {
        width : '60px',
        height : '40px',
        objectFit : 'cover'
    }
}));
export default React.memo(MessageBox);
