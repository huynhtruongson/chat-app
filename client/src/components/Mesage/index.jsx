import React from 'react';
import {Avatar, Box, makeStyles, Typography, IconButton} from '@material-ui/core';
import {ThumbUp,Description,DeleteForever} from '@material-ui/icons';
import { useDispatch } from 'react-redux';
import { getActiveImage } from '../../actions/galleryAction';
const Message = React.forwardRef(({user, self, msg, isAvatar,handleDeleteMessage,isLast},ref) => {
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
                        >
                            <Typography variant='body1'>{msg.text}</Typography>
                        </Box>
                    ))}
                    {imageList.length > 0  &&
                    <Box className={style.imageContainer}>
                        {imageList.map(img => 
                            <Box className={style.imgMessageItem}>
                                <Box className={style.imgMessageRatio}>
                                    <img onClick={()=>handleShowGallery(img.url_cloud)} key={img.url_cloud} src={img.url_cloud} className={style.imgMessage} alt='img'/>
                                </Box>
                            </Box>
                            )
                        }
                    </Box>}
                    {videoList.length > 0 && videoList.map(video => 
                        <Box key={video.url_cloud} className={style.videoContainer}>
                            <video src={video.url_cloud} className={style.videoMessage} controls />
                        </Box>)
                    }
                    {fileList.length > 0 && fileList.map(file => 
                        <Box key={file.url_cloud} className={style.fileContainer}>
                            <a className={style.fileMessage} target='_blank' href={file.url_cloud} rel='noreferrer'>
                                <Description/>
                                <Typography variant='inherit'>{file.name}</Typography>
                            </a>
                        </Box>)
                    }
            </Box>
            {(isLast && msg.status) && <Box className={style.messageStatus}>
                <Typography color='primary'>{msg.status}</Typography>
            </Box>
            }
        </Box>
    );
});
const useStyle = makeStyles((theme) => ({
    messageContainer : {
        margin: `0 ${theme.spacing(1)}px  ${theme.spacing(1.5)}px`,
        alignSelf:({self}) => self ? 'flex-end' : 'flex-start',
        display:'flex',
        alignItems:'flex-end',
        position : 'relative',
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
                borderRadius : theme.spacing(1),
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
        padding : theme.spacing(1),
        borderRadius:'6px',
        maxWidth: '560px',
        [theme.breakpoints.down('1100')] : {
            maxWidth : '460px'
        },
        [theme.breakpoints.down('xs')] : {
            maxWidth : '360px'
        },
        [theme.breakpoints.down('520')] : {
            maxWidth : '280px'
        },
        [theme.breakpoints.down('440')] : {
            maxWidth : '200px'
        }

    },
    imgMessage: {
        width : '100%',
        height : '100%',
        maxHeight : '400px',
        objectFit: 'cover',
        cursor : 'pointer',
        '&:hover' : {
            filter : 'contrast(50%)',
        }
    },
    imgMessageItem : ({imgLength}) => (
        imgLength > 1 && {
            // width : ({imgLength}) => imgLength > 3 ? 'calc(100%/3)' : `calc(100%/${imgLength})`,
            position : 'relative',
            width : '100%',
            paddingTop : '100%'
        }
    ),
    imgMessageRatio : ({imgLength}) => (
        imgLength > 1 && {
            position: 'absolute',   
            top : 0,
            left : 0,
            width : '100%',
            height : '100%'
        }
    ),
    imageContainer : ({imgLength}) => (
        imgLength > 1 ?
        {   
            width:'380px',
            display : 'grid',
            gridTemplateColumns : imgLength > 3 ? 'repeat(3,1fr)' : `repeat(${imgLength},1fr)`,
            borderRadius : theme.spacing(1),
            overflow : 'hidden',
            [theme.breakpoints.down('xs')] : {
                width : '300px'
            },
            [theme.breakpoints.down('440')] : {
                maxWidth : '200px'
            }
        } : 
        {
            maxWidth : '380px',
            [theme.breakpoints.down('xs')] : {
                maxWidth : '300px'
            },
            [theme.breakpoints.down('440')] : {
                maxWidth : '200px'
            }
        }
    ),
    videoContainer : {
        maxWidth : '380px',
        borderRadius : theme.spacing(1),
        // overflow : 'hidden',
        [theme.breakpoints.down('xs')] : {
            maxWidth : '300px'
        },
        [theme.breakpoints.down('440')] : {
            maxWidth : '200px'
        }
    },
    videoMessage : {
        width : '100%',
        borderRadius : 'inherit',
        objectFit : 'cover'
    },
    fileContainer : {
        maxWidth:'250px',
        [theme.breakpoints.down('440')] : {
            maxWidth : '200px'
        }
    },
    fileMessage : {
        display:'flex',
        alignItems:'center',
        textDecoration : 'none',
        padding : theme.spacing(1),
        backgroundColor : theme.palette.grey[300],
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
    messageStatus : {
        position :'absolute',
        minWidth : '60px',
        textAlign : 'end',
        bottom : 0,
        right : 0,
        transform : 'translateY(100%)',
    }
}));
export default Message;
