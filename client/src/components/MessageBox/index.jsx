import {Avatar,Box,IconButton,InputAdornment,makeStyles,Popover,TextField,Typography,CircularProgress} from '@material-ui/core';
import {Info,PhotoLibrary,AttachFile,EmojiEmotionsRounded} from '@material-ui/icons';
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import ICONS from '../../constants/Icons';
import useAlert from '../../hooks/alert';
import Message from '../Mesage';
import { addMessage, updateLastMessage } from '../../actions/messageAction';
import { useDispatch, useSelector } from 'react-redux';
import IsolateSubmitBtn from '../IsolateSubmitBtn';
import IsolateMedia from '../IsolateMedia';
import { useEffect } from 'react';
import MessageApi from '../../api/messageApi';
import useLoadMessage from '../../hooks/useLoadMessage';
import { useCallback } from 'react';
import React from 'react';
const MessageBox = () => {
    console.log('message box reredenr')
    const style = useStyle();
    const {activeConv,messages} = useSelector(state => state.message)
    const socket = useSelector(state => state.socket)
    const {info} = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [anchorEl, setAnchoEl] = useState(null);
    const { register, handleSubmit, setValue, getValues, control,reset,formState : {isSubmitting,isSubmitSuccessful} } = useForm();
    const chatFileRef = useRef();
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
        })
        if(node) observer.current.observe(node)
    },[loading,hasMore])
    const [isSending,setIsSending] = useState(false)
    const { _alert } = useAlert();
    const { ref: inputRef, ...inputRest } = register('message');
    const handleClickIcon = (icon) => {
        setValue('message', getValues('message') + icon);
    };
    const handleChangeMedia = (e) => {
        const files = [...e.target.files];
        const fileArr = [];
        if (!files.length) return;
        files.forEach((file) => {
            if (file.size > 1024 * 1024 * 10) {
                _alert({ icon: 'error', msg: 'File is too large!' });
                return;
            }
            fileArr.push(file);
        });
        const currentFile = [].concat(getValues('media') || []);
        setValue('media', [...currentFile, ...fileArr]);
    };
    const handleRemoveMedia = (index) => {
        const currentFiles = [...getValues('media')]
        currentFiles.splice(index,1)
        setValue('media',currentFiles)
    }  
    const onSubmit = async (data) => {
        setIsSending(true)
        const msg = {
            sender : info._id,
            receiver : activeConv._id,
            text : data.message,
            media : [].concat(data.media || [])
        }
        if(!data.message && !data.media)
            msg.text = ':like:'
        dispatch(addMessage({...msg},activeConv))
        const msgData = new FormData()
        msgData.append('text',msg.text)
        msgData.append('receiver',msg.receiver)
        msg.media.forEach(file => msgData.append('media',file))
        reset()
        const res =  await MessageApi.addMessage(msgData)
        if(res.status === 200) {
            setIsSending(false)
            dispatch(updateLastMessage(res.data.new_message))
            socket.emit('ADD_MESSAGE',{msg : res.data.new_message,activeConv})
        }
    };
    useEffect(()=>{setPage(1)},[activeConv._id])
    return (
        <Box display="flex" flexDirection="column" height="100%">
            <Box className={style.messageHeader}>
                <Box display="flex" alignItems="center">
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
                    <IconButton color="primary">
                        <Info />
                    </IconButton>
                </Box>
                <Box className={style.loading}>
                    {loading && <CircularProgress/>}
                </Box> 
            </Box>
            <Box className={style.messagesContainer}>
                {/* {
                    messages[0]?.sender === info._id && <Box alignSelf='flex-end' p={1}>
                        <Typography color='primary'>{isSubmitting ? 'Sending...' : 'Sent ✔'}</Typography>
                        <Typography color='primary'>{isSubmitting ? 'Sending...' : 'Sent ✔'}</Typography>
                    </Box>
                } */}
                {isSubmitting && 
                    <Typography color='primary'>Sending...</Typography>
                }
                {isSubmitSuccessful && 
                    <Typography color='primary'>Sent</Typography>
                }
                {messages && messages.map((msg,index) => (
                    <Message 
                        key={msg+Math.random()} 
                        msg={msg} 
                        user={activeConv}
                        self={msg.sender === info._id}
                        noAvatar={index === 0 ? true : msg.receiver !== messages[index-1].receiver}
                        ref={index === messages.length-1 ? messageEndRef : null}/>
                ))}
            </Box>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box display="flex" alignItems="flex-end" pb={0.8} borderTop='1px solid #bdbdbd'>
                    <Box display="flex">
                        <input
                            ref={chatFileRef}
                            type="file"
                            hidden
                            multiple
                            id="chat-button-file"
                            onChange={handleChangeMedia}
                        />
                        <label htmlFor="chat-button-file">
                            <IconButton
                                color="primary"
                                component="span"
                                onClick={() =>(chatFileRef.current.accept = 'image/*')}>
                                <PhotoLibrary />
                            </IconButton>
                        </label>
                        <label htmlFor="chat-button-file">
                            <IconButton
                                color="primary"
                                component="span"
                                onClick={() =>(chatFileRef.current.accept = '*')}>
                                <AttachFile />
                            </IconButton>
                        </label>
                    </Box>
                    <Box flex="1" display="flex" flexDirection="column">
                        <Box display="flex" py={0.8} overflow='auto'>
                            <IsolateMedia control={control} handleRemoveMedia={handleRemoveMedia} />
                        </Box>
                        <TextField
                            inputRef={inputRef}
                            {...inputRest}
                            fullWidth
                            variant="outlined"
                            placeholder="Aa"
                            size="small"
                            InputProps={{
                                classes: { root: style.chatInput },
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            classes={{ root: style.iconButton }}
                                            onClick={(e) => setAnchoEl(e.target)}>
                                            <EmojiEmotionsRounded color="primary" />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                    <IconButton type="submit" color="primary">
                        <IsolateSubmitBtn control={control}/>
                    </IconButton>
                </Box>
            </form>
            <Popover
                open={!!anchorEl}
                onClose={() => setAnchoEl(null)}
                anchorEl={anchorEl}
                anchorOrigin={{vertical: 'top',horizontal: 'left'}}
                transformOrigin={{vertical: 'bottom',horizontal: 'right'}}>
                <Box className={style.iconBox}>
                    {ICONS.map((icon) => (
                        <span
                            key={icon}
                            onClick={() => handleClickIcon(icon)}
                            className={style.iconItem}>
                            {icon}
                        </span>
                    ))}
                </Box>
            </Popover>
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
    chatInput: {
        borderRadius: '100rem',
    },
    iconButton: {
        padding: '8px',
    },
    iconBox: {
        display: 'grid',
        gridTemplateColumns: 'repeat(6,auto)',
        maxHeight: '160px',
        overflow: 'auto',
        gridGap: '8px',
        padding: '8px',
    },
    iconItem: {
        fontSize: '1.2rem',
        cursor: 'pointer',
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
    },
    messageHeader : {
        display:"flex",
        justifyContent:"space-between",
        alignItems:"center",
        borderBottom:"1px solid #cacaca",
        height:'65px',
        padding : '0 8px',
        position : 'relative'
    }
}));
export default React.memo(MessageBox);
