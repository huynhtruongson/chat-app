import {Avatar, Box, makeStyles, Typography} from '@material-ui/core';
import {ThumbUp} from '@material-ui/icons';

const displayImage = (images,style) => {
    console.log(images)
    return images.map(img => 
    <Box key={img._id} borderRadius='6px' maxWidth='350px' overflow='hidden' mb={1.5}>
        <img className={style} src={img.url_cloud} alt='img' />
    </Box>)
}
const Message = ({user, self, msg, noAvatar}) => {
    const style = useStyle({self});
    return (
        <Box
            mx={1}
            alignSelf={self ? 'flex-end' : 'flex-start'}
            display='flex'
            alignItems='flex-start'>
            <Box minWidth='40px' mr={1} mb={1.5}>
                {!self && noAvatar && <Avatar src={user.avatar} />}
            </Box>
            <Box display='flex' flexDirection='column' alignItems='flex-start'>
                {msg.text && (
                    msg.text === ':like:' ? <ThumbUp fontSize='large' color='primary'/> : 
                    <Box
                        className={style.messageBox}
                        p={1}
                        borderRadius='6px'
                        maxWidth='500px'
                        mb={1.5}>
                        <Typography variant='body1'>{msg.text}</Typography>
                    </Box>
                )}
                {/* {msg.text && <Typography variant='body1'>{msg.text}</Typography>} */}
                {!!msg.media.length && displayImage(msg.media.filter(md => md.resource_type === 'image'),style.imgMessage)
                
                }
            </Box>
        </Box>
    );
};
const useStyle = makeStyles((theme) => ({
    messageBox: {
        backgroundColor: ({self}) => (self ? theme.palette.primary.main : theme.palette.grey[200]),
        color: ({self}) => (self ? '#fff' : null),
    },
    imgMessage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
}));
export default Message;
