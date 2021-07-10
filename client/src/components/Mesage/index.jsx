import React from 'react';
import {Avatar, Box, makeStyles, Typography, IconButton} from '@material-ui/core';
import {ThumbUp,Description,DeleteForever} from '@material-ui/icons';
import { useDispatch } from 'react-redux';
import { getActiveImage } from '../../actions/galleryAction';
const Message = React.forwardRef(({user, self, msg, isAvatar,handleDeleteMessage},ref) => {
    const imageList = msg.media.filter((md) => md.resource_type === 'image')
    const videoList = msg.media.filter((md) => md.resource_type === 'video')
    const fileList = msg.media.filter((md) => md.resource_type === 'raw')
    const style = useStyle({self,imgLength : imageList.length});
    const dispatch = useDispatch()
    const handleShowGallery = (url) => {
        dispatch(getActiveImage(url))
    }
    return (
        <Box className={style.messageContainer}>
            {!self &&<Box minWidth='40px' mr={1}>
                {!self && isAvatar && <Avatar src={user.avatar} />}
            </Box>}
            {self &&
                <Box className={style.deleteBtn}>
                    <IconButton onClick={handleDeleteMessage} color='secondary'>
                        <DeleteForever/>
                    </IconButton>
                </Box>
            }
            {ref && <div ref={ref}></div>}
            <Box className={style.contentContainer}>
                {msg.text &&
                    (msg.text === ':like:' ? (
                        <Box><ThumbUp fontSize='large' color='primary' /></Box>
                    ) : (
                        <Box
                            className={style.textMessage}
                            p={1}
                            borderRadius='6px'
                            maxWidth='500px'
                        >
                            <Typography variant='body1'>{msg.text}</Typography>
                        </Box>
                    ))}
                {msg.media.length > 0 && (
                    <>
                        {imageList.length > 0  &&
                        <Box className={style.imageContainer}>
                            {imageList.map(img => 
                                    <img onClick={()=>handleShowGallery(img.url_cloud)} key={img.url_cloud} src={img.url_cloud} className={style.imgMessage} alt='img'/>
                                )
                            }
                        </Box>}
                        {videoList.length > 0 && videoList.map(video => 
                            <Box key={video.url_cloud} className={style.videoContainer}>
                                <video src={video.url_cloud} className={style.videoMessage} controls />
                            </Box>)
                        }
                        {fileList.length > 0 && fileList.map(file => 
                            <Box key={file.url_cloud} maxWidth='250px'>
                                <a className={style.fileMessage} target='_blank' href={file.url_cloud} rel='noreferrer'>
                                    <Description/>
                                    <Typography variant='inherit'>{file.name}</Typography>
                                </a>
                            </Box>)
                        }
                    </>
                )}
                {msg.status && <Typography color='primary'>{msg.status}</Typography>}
            </Box>
        </Box>
    );
});
const useStyle = makeStyles((theme) => ({
    messageContainer : {
        margin: `0 ${theme.spacing(1)}px  ${theme.spacing(1.5)}px`,
        alignSelf:({self}) => self ? 'flex-end' : 'flex-start',
        display:'flex',
        alignItems:'center',
        '&:hover $deleteBtn' : {
            display : 'block'
        },
    },
    deleteBtn : {
        display : 'none',
        marginRight : theme.spacing(1),
        '&:hover' : {
            '&+$contentContainer' : {
                border : '1px solid red',
                borderRadius : theme.spacing(1)
            }
        }
    },
    contentContainer : {
        display:'flex',
        flexDirection:'column',
        alignItems:({self}) => self ? 'flex-end' : 'flex-start',
        '&>.MuiBox-root + .MuiBox-root' : {
            marginTop : theme.spacing(1.5)
        },
    },
    textMessage: {
        backgroundColor: ({self}) => (self ? theme.palette.primary.main : theme.palette.grey[200]),
        color: ({self}) => (self ? '#fff' : null),
    },
    imgMessage: {
        width: ({imgLength}) => imgLength === 1 ? '100%' : imgLength > 3 ? `${375/3}px` : `${375/imgLength}px`,
        height: ({imgLength}) => imgLength === 1 ? 'initial' : imgLength > 3 ? `${375/3}px` : `${375/imgLength}px`,
        objectFit: 'cover',
    },
    imageContainer : {
        maxWidth:'380px',
        display:'flex' ,
        flexWrap:'wrap',
        borderRadius : theme.spacing(1),
        overflow : 'hidden',
        '&>img' : {
            cursor : 'pointer'
        },
        '&>img:hover': {
            filter : 'contrast(50%)'
        }
    },
    videoContainer : {
        maxWidth : '380px',
        borderRadius : theme.spacing(1),
        overflow : 'hidden'
    },
    videoMessage : {
        width : '100%',
        borderRadius : 'inherit'
    },
    fileMessage : {
        display:'flex',
        alignItems:'center',
        textDecoration : 'none',
        padding : theme.spacing(1),
        backgroundColor : theme.palette.grey[400],
        borderRadius : theme.spacing(1),
        color : '#000',
        '&>.MuiTypography-root' : {
            marginLeft : theme.spacing(.6),
            display:'-webkit-box',
            '-webkit-line-clamp': 2,
            '-webkit-box-orient': 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            wordBreak: 'break-word',
        },
        '&:hover' : {
            backgroundColor : theme.palette.grey[500],
        }
    },
}));
export default Message;
