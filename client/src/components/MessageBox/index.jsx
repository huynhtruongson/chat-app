import {Avatar,Box,IconButton,InputAdornment,makeStyles,Popover,TextField,Typography,} from '@material-ui/core';
import {Info,PhotoLibrary,AttachFile,ThumbUp,EmojiEmotionsRounded,Send, CancelOutlined,Description} from '@material-ui/icons';
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import ICONS from '../../constants/Icons';
import useAlert from '../../hooks/alert';
import Message from '../Mesage';
import {useData} from '../../context/DataContext'
import { addMessage } from '../../actions/messageAction';
import Images from '../../constants/Images'
const MessageBox = () => {
    const style = useStyle();
    const [anchorEl, setAnchoEl] = useState(null);
    const { register, handleSubmit, setValue, getValues, watch,reset } = useForm();
    const chatFileRef = useRef();
    const { _alert } = useAlert();
    const { ref: inputRef, ...inputRest } = register('message');
    const {message : [messageState,dispatch],user:[userState]} = useData()
    const {user,messages} = messageState
    const handleClickIcon = (icon) => {
        setValue('message', getValues('message') + icon);
    };
    const handleChangeMedia = (e) => {
        const files = [...e.target.files];
        const fileArr = [];
        if (!files.length) return;
        files.forEach((file) => {
            if (file.size > 1024 * 1024 * 5) {
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
    const onSubmit = (data) => {
        console.log(data);
        const msg = {
            sender : userState.info._id,
            recipient : user._id,
            text : data.message,
            media : [].concat(data.media || [])
        }
        if(!data.message && !data.media)
            msg.text = ':like:'
        console.log(msg)
        dispatch(addMessage(msg,user))
        reset()
    };
    if(!user._id)
        return (
            <Box position='relative' height='100%'>
                <Box className={style.bgcGreeting} textAlign='center'>
                    <img src={Images.CHAT_LOGO2} className={style.bgcImage} alt='img'/>
                    <Typography variant='h5'>Welcome to Chat App</Typography>
                </Box>
            </Box>
        )
    return (
        <Box display="flex" flexDirection="column" height="100%">
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderBottom="1px solid #cacaca"
                p={1}
            >
                <Box display="flex" alignItems="center">
                    <Avatar classes={{ root: style.avatar }} src={user.avatar} />
                    <Box ml={0.8}>
                        <Typography
                            classes={{ root: style.username }}
                            variant="subtitle2"
                        >
                            {`${user.firstname} ${user.lastname}`}
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
            </Box>
            <Box
                flex={1}
                display="flex"
                overflowx="auto"
                flexDirection="column-reverse">
                {
                    messages.map(msg => (
                        <Message 
                            key={msg+Math.random()} 
                            msg={msg} 
                            user={messageState.user}
                            self={msg.sender === userState.info._id}/>
                    ))
                }
            </Box>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box display="flex" alignItems="flex-end" py={0.8} borderTop='1px solid #bdbdbd'>
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
                                onClick={() =>
                                    (chatFileRef.current.accept = 'image/*')
                                }
                            >
                                <PhotoLibrary />
                            </IconButton>
                        </label>
                        <label htmlFor="chat-button-file">
                            <IconButton
                                color="primary"
                                component="span"
                                onClick={() =>
                                    (chatFileRef.current.accept = '*')
                                }
                            >
                                <AttachFile />
                            </IconButton>
                        </label>
                    </Box>
                    <Box flex="1" display="flex" flexDirection="column">
                        <Box display="flex" py={1} overflow='auto'>
                            {watch('media') &&
                                getValues('media').map((media, index) => (
                                    <Box key={media.name+index} className={style.mediaBox}>
                                        {media.type.match(/video/i) ? (
                                            <video
                                                src={URL.createObjectURL(media)}
                                                controls
                                                className={style.mediaMessage}
                                            />
                                        ) : media.type.match(/image/i) ? (
                                            <img
                                                src={URL.createObjectURL(media)}
                                                alt="img"
                                                className={style.mediaMessage}  
                                            />
                                        ) : <Box display='flex' height='100%' alignItems='center' width='120px'>
                                                <Description/>
                                                <Typography className={style.mediaFileName} variant='body2'>{media.name}</Typography>
                                            </Box>
                                        }
                                        <span className={style.mediaMessageIcon} onClick={()=>handleRemoveMedia(index)}>
                                            <CancelOutlined/>
                                        </span>
                                    </Box>
                                ))}
                        </Box>
                        <TextField
                            inputRef={inputRef}
                            {...inputRest}
                            // multiline
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
                                            onClick={(e) =>
                                                setAnchoEl(e.target)
                                            }
                                        >
                                            <EmojiEmotionsRounded color="primary" />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                    <IconButton type="submit" color="primary">
                        {watch('message') ? <Send /> : <ThumbUp />}
                    </IconButton>
                </Box>
            </form>
            <Popover
                open={!!anchorEl}
                onClose={() => setAnchoEl(null)}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
            >
                <Box className={style.iconBox}>
                    {ICONS.map((icon) => (
                        <span
                            key={icon}
                            onClick={() => handleClickIcon(icon)}
                            className={style.iconItem}
                        >
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
    mediaMessage : {
        height : '100%',
        width : '100%',
        objectFit:'cover',
        borderRadius:'inherit'
    },
    mediaMessageIcon : {
        position : 'absolute',
        top : '-6px',
        right : '-6px',
        color : theme.palette.secondary.main,
        cursor: 'pointer'
    },
    mediaBox : {
        height:'60px',
        flexBasis : '60px',
        position:'relative',
        marginRight : theme.spacing(1),
        borderRadius:'8px',
        boxShadow : theme.shadows[1],
        flex : 'none'
    },
    bgcImage : {
        width : '450px',
    },
    bgcGreeting : {
        position : 'absolute',
        top : '50%',
        left : '50%',
        transform : 'translate(-50%,-50%)'
    },
    mediaFileName : {
        display:'-webkit-box',
        '-webkit-line-clamp': 2,
        '-webkit-box-orient': 'vertical',
        // webkitLineClamp : 3,
        // webkitBoxOrient : 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        wordBreak: 'break-word',
    }
}));
export default MessageBox;
