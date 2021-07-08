import {Avatar,Box,IconButton,makeStyles,Typography,CircularProgress} from '@material-ui/core';
import {Info,ArrowBack} from '@material-ui/icons';
import { useState, useRef } from 'react';
import Message from '../Mesage';
import ChatForm from '../ChatForm'
import {  useSelector } from 'react-redux';
import { useEffect } from 'react';
import useLoadMessage from '../../hooks/useLoadMessage';
import { useCallback } from 'react';
import React from 'react';
const MessageBox = ({handleShowInfo,handleShowConversation}) => {
    console.log('message box reredenr')
    const style = useStyle();
    const {activeConv,messages} = useSelector(state => state.message)
    const {info} = useSelector(state => state.user)
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
    useEffect(()=>{setPage(1)},[activeConv._id])
    return (
        <Box display="flex" flexDirection="column" height="100%">
            <Box className={style.messageHeader}>
                <Box display="flex" alignItems="center">
                    <IconButton onClick={()=>handleShowConversation(false)} className={style.backBtn}>
                        <ArrowBack color='primary'/>
                    </IconButton>
                    <Avatar classes={{ root: style.avatar }} src={activeConv.avatar} />
                    <Box ml={0.8}>
                        <Typography
                            classes={{ root: style.username }}
                            variant="subtitle2">
                            {activeConv.fullname}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Active now
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
                {messages && messages.map((msg,index) => (
                    <Message 
                        key={msg+Math.random()} 
                        msg={msg} 
                        user={activeConv}
                        self={msg.sender === info._id}
                        isAvatar={index === 0 ? true : msg.receiver !== messages[index-1].receiver}
                        ref={index === messages.length-1 ? messageEndRef : null}/>
                ))}
            </Box>
            <ChatForm/>
        </Box>
    );
};
const useStyle = makeStyles((theme) => ({
    avatar: {
        width: '48px',
        height: '48px',
    },
    username: {
        fontSize: '1.1rem',
    },
    loading : {
        textAlign : 'center',
        padding : '12px 0',
        position : 'absolute',
        bottom : 0,
        left : 0,
        width : '100%',
        transform : 'translateY(100%)'
    },
    messagesContainer : {
        flex: 1,
        display:"flex",
        overflow:"auto",
        flexDirection:"column-reverse",
        padding : '8px 0'
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
    }
}));
export default React.memo(MessageBox);
