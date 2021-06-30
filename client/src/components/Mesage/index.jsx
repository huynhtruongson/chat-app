import {Avatar, Box, makeStyles, Typography} from '@material-ui/core';
import {ThumbUp,Description} from '@material-ui/icons';
const formatImages = (images) => {
    const row = Math.ceil(images.length / 3);
    const imgArr = images.map((img, index) => {
        let imgSize = 375 / images.length;
        if (row === 2) {
            imgSize = 375 / 3;
            if (index > 2 && images.length - 3 === 2) imgSize = 375 / 2;
        }
        return {
            src: img.url_cloud,
            style: {
                width: images.length !== 1 ? imgSize+'px' : '100%',
                height: images.length !== 1 ? imgSize+'px' : 'initial',
                objectFit: 'cover',
            },
        };
    });
    return imgArr;
};
const Message = ({user, self, msg, noAvatar, handleShowGallery}) => {
    const style = useStyle({self});
    return (
        <Box
            mx={1}
            alignSelf={self ? 'flex-end' : 'flex-start'}
            display='flex'
            alignItems='flex-end'>
            <Box minWidth='40px' mr={1} mb={1.5}>
                {!self && noAvatar && <Avatar src={user.avatar} />}
            </Box>
            <Box className={style.messageContainer}>
                {msg.text &&
                    (msg.text === ':like:' ? (
                        <ThumbUp fontSize='large' color='primary' />
                    ) : (
                        <Box
                            className={style.textMessage}
                            p={1}
                            borderRadius='6px'
                            maxWidth='500px'
                            mb={1.5}>
                            <Typography variant='body1'>{msg.text}</Typography>
                        </Box>
                    ))}
                {msg.media.length > 0 && (
                    <>
                        <Box className={style.imageContainer}>
                            {formatImages(msg.media.filter((md) => md.resource_type === 'image'))
                                .map(img => 
                                    <img onClick={()=>handleShowGallery(img.src)} key={img.src} src={img.src} style={img.style} alt='img'/>
                                )
                            }
                        </Box>
                        {msg.media.filter((md) => md.resource_type === 'video')
                            .map(video => <Box key={video.url_cloud} className={style.videoContainer}>
                                <video src={video.url_cloud} className={style.videoMessage} controls />
                            </Box>)
                        }
                        {msg.media.filter((md) => md.resource_type === 'raw')
                            .map(file => <Box key={file.url_cloud} mb={1.5} maxWidth='250px'>
                                <a className={style.fileMessage} target='_blank' href={file.url_cloud} rel='noreferrer'>
                                    <Description/>
                                    <Typography variant='inherit'>{file.name}</Typography>
                                </a>
                            </Box>)
                        }
                    </>
                )}
            </Box>
        </Box>
    );
};
const useStyle = makeStyles((theme) => ({
    messageContainer : {
        display:'flex',
        flexDirection:'column',
        alignItems:({self}) => self ? 'flex-end' : 'flex-start'
    },
    textMessage: {
        backgroundColor: ({self}) => (self ? theme.palette.primary.main : theme.palette.grey[200]),
        color: ({self}) => (self ? '#fff' : null),
    },
    imgMessage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    imageContainer : {
        maxWidth:'380px',
        display:'flex' ,
        flexWrap:'wrap',
        marginBottom : theme.spacing(1.5),
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
