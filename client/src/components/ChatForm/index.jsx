import {Box,IconButton,InputAdornment,makeStyles,Popover,TextField} from '@material-ui/core';
import {PhotoLibrary,AttachFile,EmojiEmotionsRounded} from '@material-ui/icons';
import IsolateSubmitBtn from '../IsolateSubmitBtn';
import _alert from '../../utils/alert';
import IsolateMedia from '../IsolateMedia';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { addMessage, updateLastMessage, updateSeenConversation } from '../../actions/messageAction';
import MessageApi from '../../api/messageApi';
import ICONS from '../../constants/Icons';
import { updateGallery } from '../../actions/galleryAction';
const ChatForm = () => {
    const style = useStyle();
    const {activeConv} = useSelector(state => state.message)
    const socket = useSelector(state => state.socket)
    const {info} = useSelector(state => state.user)
    const [anchorEl, setAnchoEl] = useState(null);
    const dispatch = useDispatch()
    const { register, handleSubmit, setValue, getValues, control,reset } = useForm();
    const { ref: inputRef, ...inputRest } = register('message');
    const chatFileRef = useRef();
    const handleClickIcon = (icon) => {
        setValue('message', getValues('message') + icon);
    };
    const handleChangeMedia = (e) => {
        const files = [...e.target.files];
        const fileArr = [];
        const fileErrorArr = []
        if (!files.length) return;
        files.forEach((file) => {
            if (file.size > 1024 * 1024 * 10) {
                fileErrorArr.push(file.name)
            }
            else
                fileArr.push(file);
        });
        const currentFile = [].concat(getValues('media') || []);
        setValue('media', [...currentFile, ...fileArr]);
        if(fileErrorArr.length)
            _alert({icon:'error',title:'File is too large!',msg:'Maximum size of a file is 10MB'})
    };
    const handleRemoveMedia = (index) => {
        const currentFiles = [...getValues('media')]
        currentFiles.splice(index,1)
        setValue('media',currentFiles)
    }  
    const onSubmit = async (data) => {
        const msg = {
            sender : info._id,
            receiver : activeConv._id,
            text : data.message,
            media : [].concat(data.media || [])
        }
        if(!data.message && !data.media)
            msg.text = ':like:'
        const id = Math.random()+''
        reset()
        dispatch(addMessage({...msg,
            id,
            createdAt : new Date().toISOString(),
            status : 'Sending...',
            seen : false},activeConv))
        dispatch(updateSeenConversation(activeConv._id,false))
        const msgData = new FormData()
        msgData.append('text',msg.text)
        msgData.append('receiver',msg.receiver)
        msg.media.forEach(file => msgData.append('media',file))
        const res =  await MessageApi.addMessage(msgData)
        if(res.status === 200) {
            dispatch(updateLastMessage({...res.data.new_message,status : 'Sent ✔'},id))
            socket.emit('ADD_MESSAGE',{msg : res.data.new_message,user:info})
            if(res.data.new_message.media.length)
                dispatch(updateGallery(res.data.new_message.media))
        }
    };
    const handleFocusInput = () => {
        socket.emit('USER_TYPING',{receiver :activeConv._id,convId: info._id})
    }
    const handleBlurInput = () => {
        socket.emit('USER_CANCEL_TYPING',{receiver :activeConv._id,convId: info._id})
    }
    return (
        <Box>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box display='flex' alignItems='flex-end' pb={0.8} borderTop='1px solid #bdbdbd'>
                    <Box display='flex'>
                        <input
                            ref={chatFileRef}
                            type='file'
                            hidden
                            multiple
                            id='chat-button-file'
                            onChange={handleChangeMedia}
                        />
                        <label htmlFor='chat-button-file'>
                            <IconButton
                                color='primary'
                                component='span'
                                onClick={() => (chatFileRef.current.accept = 'image/*')}>
                                <PhotoLibrary />
                            </IconButton>
                        </label>
                        <label htmlFor='chat-button-file'>
                            <IconButton
                                color='primary'
                                component='span'
                                onClick={() => (chatFileRef.current.accept = '*')}>
                                <AttachFile />
                            </IconButton>
                        </label>
                    </Box>
                    <Box flex='1' display='flex' flexDirection='column'>
                        <Box display='flex' py={0.8} overflow='auto'>
                            <IsolateMedia control={control} handleRemoveMedia={handleRemoveMedia} />
                        </Box>
                        <TextField
                            inputRef={inputRef}
                            {...inputRest}
                            fullWidth
                            autoComplete='off'
                            variant='outlined'
                            placeholder='Aa'
                            size='small'
                            InputProps={{
                                classes: {root: style.chatInput},
                                endAdornment: (
                                    <InputAdornment position='end'>
                                        <IconButton
                                            classes={{root: style.iconButton}}
                                            onClick={(e) => setAnchoEl(e.target)}>
                                            <EmojiEmotionsRounded color='primary' />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            onFocus={handleFocusInput}
                            onBlur={handleBlurInput}
                        />
                    </Box>
                    <IconButton type='submit' color='primary'>
                        <IsolateSubmitBtn control={control} />
                    </IconButton>
                </Box>
            </form>
            <Popover
                open={!!anchorEl}
                onClose={() => setAnchoEl(null)}
                anchorEl={anchorEl}
                anchorOrigin={{vertical: 'top', horizontal: 'left'}}
                transformOrigin={{vertical: 'bottom', horizontal: 'right'}}>
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
    
}));
export default ChatForm;
