import React from 'react';
import {Avatar, Box, makeStyles, Typography, IconButton, Tooltip} from '@material-ui/core';
import {ThumbUp,Description,DeleteForever} from '@material-ui/icons';
import { useDispatch } from 'react-redux';
import { getActiveImage } from '../../actions/galleryAction';
import moment from 'moment'
import { isValidURL } from '../../utils';
const Message = React.forwardRef(({user, self, msg, isAvatar,handleDeleteMessage,isLast,displayTime},ref) => {
    const imageList = msg.media.filter((md) => md.resource_type === 'image')
    const videoList = msg.media.filter((md) => md.resource_type === 'video')
    const fileList = msg.media.filter((md) => md.resource_type === 'raw')
    const style = useStyle({self,imgLength : imageList.length});
    const dispatch = useDispatch()
    const handleShowGallery = (url) => {
        dispatch(getActiveImage(url))
    }
    const timeFormat = () => {
        return moment(msg.createdAt).calendar(null,{
            sameDay : 'LT',
            lastDay: '[Yesterday], LT',
            lastWeek: '[Last] dddd, LT',
            sameElse: 'lll'
        })
    }
    const renderText = (text) => {
        if(text === ':like:')
            return <ThumbUp fontSize='large' color='primary' />
        else if(isValidURL(text))
            return <a className={style.textContent} href={text} target='_blank' rel='noreferrer'>{text}</a>
        else 
            return <Typography className={style.textContent} variant='body1'>{text}</Typography>
    }
    return (
        <Box className={style.messageItem}>
            {ref && <div ref={ref} className={style.messageRef}></div>}
            {displayTime && <Box className={style.divider}>
                <Typography variant='caption' color='textSecondary'>{timeFormat()}</Typography>
            </Box>}
            <Box className={style.messageItemContainer}>
                <Box className={style.messageContainer}>
                    {!self &&<Box minWidth='40px' mr={1}>
                        {!self && isAvatar && <Avatar src={user.avatar} />}
                    </Box>}
                    <Box className={style.contentContainer}>
                        {msg.text &&
                            <Box className={style.messageModule}>
                                {self &&
                                    <IconButton onClick={()=>handleDeleteMessage(msg,'text')} size='small' color='secondary' classes={{root : style.deleteBtn}}>
                                        <DeleteForever/>
                                    </IconButton>
                                }
                                <Box className={msg.text !== ':like:' && style.textMessage}>
                                    <Tooltip title={timeFormat()}>
                                        {renderText(msg.text)}
                                    </Tooltip>
                                </Box>
                            </Box>
                        }
                        {imageList.length > 0  &&
                            <Box className={style.messageModule}>
                                {self &&
                                    <IconButton onClick={()=>handleDeleteMessage(msg,'image')} size='small' color='secondary' classes={{root : style.deleteBtn}}>
                                        <DeleteForever/>
                                    </IconButton>
                                }
                                <Tooltip title={timeFormat()}>
                                    <Box className={style.imageContainer}>
                                        {imageList.map(img =>
                                            <Box className={style.imgMessageItem} key={img.url_cloud}>
                                                <Box className={style.imgMessageRatio}>
                                                    <img onClick={()=>handleShowGallery(img.url_cloud)} key={img.url_cloud} src={img.url_cloud} className={style.imgMessage} alt='img'/>
                                                </Box>
                                            </Box>
                                            )
                                        }
                                    </Box>
                                </Tooltip>
                            </Box>
                        }
                        {videoList.length > 0 && videoList.map(video =>
                            <Box className={style.messageModule} key={video.url_cloud}>
                                {self &&
                                    <IconButton onClick={()=>handleDeleteMessage(msg,video._id)} size='small' color='secondary' classes={{root : style.deleteBtn}}>
                                        <DeleteForever/>
                                    </IconButton>
                                }
                                <Tooltip title={timeFormat()}>
                                    <Box className={style.videoContainer}>
                                        <video src={video.url_cloud} className={style.videoMessage} controls />
                                    </Box>
                                </Tooltip>
                            </Box>)
                        }
                        {fileList.length > 0 && fileList.map(file =>
                            <Box className={style.messageModule} key={file.url_cloud}>
                                {self &&
                                    <IconButton onClick={()=>handleDeleteMessage(msg,file._id)} size='small' color='secondary' classes={{root : style.deleteBtn}}>
                                        <DeleteForever/>
                                    </IconButton>
                                }
                                <Tooltip title={timeFormat()}>
                                    <Box className={style.fileContainer}>
                                        <a className={style.fileMessage} target='_blank' href={file.url_cloud} rel='noreferrer'>
                                            <Description/>
                                            <Typography variant='inherit'>{file.name}</Typography>
                                        </a>
                                    </Box>
                                </Tooltip>
                            </Box>)
                        }
                    </Box>
                    {(isLast) && <Box className={style.messageStatus}>
                        <Typography color='primary' variant='caption'>
                            {(self && msg.seen) ? 'Seen' :  msg.status ? msg.status : ''}
                        </Typography>
                    </Box>
                    }
                </Box>
            </Box>
        </Box>
    );
});
const useStyle = makeStyles((theme) => ({
    messageItem : {
        padding: `0 ${theme.spacing(1)}px  ${theme.spacing(1.5)}px`,
    },
    messageItemContainer : {
        display: 'flex',
        justifyContent : ({self}) => self ? 'flex-end' : 'flex-start',
    },
    messageContainer : {
        display:'flex',
        alignItems:'flex-end',
        position : 'relative',
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
    textContent : {
        color: 'inherit',
        wordBreak : 'break-all'
    },
    imgMessage: {
        width : '100%',
        height : '100%',
        maxHeight : ({imgLength}) => imgLength === 1 ? '400px' : 'unset',
        objectFit: 'cover',
        cursor : 'pointer',
        '&:hover' : {
            filter : 'contrast(50%)',
        },
        [theme.breakpoints.down('xs')] : {
            maxHeight : ({imgLength}) => imgLength === 1 ? '300px' : 'unset',
        },
        [theme.breakpoints.down('440')] : {
            maxHeight : ({imgLength}) => imgLength === 1 ? '200px' : 'unset',
        }
    },
    imgMessageItem : ({imgLength}) => (
        imgLength > 1 && {
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
            width:'300px',
            display : 'grid',
            gridTemplateColumns : imgLength > 3 ? 'repeat(3,1fr)' : `repeat(${imgLength},1fr)`,
            borderRadius : theme.spacing(1),
            overflow : 'hidden',
            [theme.breakpoints.down('xs')] : {
                width : '260px'
            },
            [theme.breakpoints.down('440')] : {
                maxWidth : '200px'
            }
        } : 
        {
            maxWidth : '300px',
            [theme.breakpoints.down('xs')] : {
                maxWidth : '260px'
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
    },
    messageRef : {
        paddingBottom : theme.spacing(5)
    },
    deleteBtn : {
        display : 'none',
        padding : '5px',
        marginRight : theme.spacing(1),
    },
    messageModule : {
        display : 'flex',
        alignItems :'center',
        '&:hover' : {
            '&>$deleteBtn' : {
                display : 'block'
            }
        },
    },
    divider : {
        position: 'relative',
        textAlign : 'center',
        '&>.MuiTypography-root' : {
            display : 'inline-block',
            position: 'relative',
            backgroundColor : 'white',
            zIndex : 2,
            padding: '0 8px',
            fontWeight : 500
        },
        '&::before' : {
            content : '""',
            position : 'absolute',
            width  :'100%',
            height: '1px',
            top : '50%',
            left: 0,
            transform: 'translateY(-50%)',
            backgroundColor : theme.palette.text.secondary
        }
    }
}));
export default Message;
