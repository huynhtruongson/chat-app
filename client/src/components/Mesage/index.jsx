import { Avatar, Box, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { useData } from '../../context/DataContext';

const Message = ({ user, self, msg }) => {
    const style = useStyle({ self });
    const {
        user: [userState],
    } = useData();
    return (
        <Box
            mx={1.5}
            mb={1.5}
            alignSelf={self ? 'flex-end' : 'flex-start'}
            display="flex"
        >
            {/* <Box minWidth='40px' mr={1.5}>
                {!self && <Avatar src={user.avatar}/>}
            </Box> */}
            {msg.text && (
                <Box
                    className={style.messageBox}
                    p={1}
                    borderRadius="6px"
                    maxWidth="500px"
                >
                    <Typography variant="body1">{msg.text}</Typography>
                </Box>
            )}
            {msg.media.map((md) => (
                <Box
                    key={md}
                    borderRadius="6px"
                    maxWidth="350px"
                    overflow='hidden'
                >
                    <img className={style.imgMessage} src={URL.createObjectURL(md)} alt='img'/>
                </Box>
            ))}
        </Box>
    );
};
const useStyle = makeStyles((theme) => ({
    messageBox: {
        backgroundColor: ({ self }) =>
            self ? '#0091ff' : theme.palette.grey[200],
        color: ({ self }) => (self ? '#fff' : null),
    },
    imgMessage :  {
        width : '100%',
        height : '100%',
        objectFit : 'cover'
    }
}));
export default Message;
