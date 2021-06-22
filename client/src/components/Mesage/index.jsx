import {Avatar, Box, makeStyles, Typography} from '@material-ui/core';
import {ThumbUp} from '@material-ui/icons';
const Message = ({user, self, msg}) => {
    const style = useStyle({self});
    return (
        <Box
            mx={1.5}
            mb={1.5}
            alignSelf={self ? 'flex-end' : 'flex-start'}
            display='flex'
            alignItems='flex-start'>
            <Box minWidth='40px' mr={1}>
                {!self && <Avatar src={user.avatar} />}
            </Box>
            <Box display='flex' flexDirection='column' align9Items='flex-end'>
                {!!msg.text && msg.text === ':like:' ? (
                    <ThumbUp fontSize='large' color='primary'/>
                ) : (
                    <Box className={style.messageBox} p={1} borderRadius='6px' maxWidth='500px'>
                        <Typography variant='body1'>{msg.text}</Typography>
                    </Box>
                )}
                {msg.media.map((md) => (
                    <Box key={md} borderRadius='6px' maxWidth='350px' overflow='hidden'>
                        <img className={style.imgMessage} src={URL.createObjectURL(md)} alt='img' />
                    </Box>
                ))}
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
        objectFit: 'contain',
    },
}));
export default Message;
