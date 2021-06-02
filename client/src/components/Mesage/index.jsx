import { Avatar, Box, makeStyles, Typography } from '@material-ui/core';
import React from 'react';

const Message = ({ self, avatar, children }) => {
    const style = useStyle({ self });
    return (
        <Box
            mx={1.5}
            mb={1.5}
            alignSelf={self ? 'flex-end' : 'flex-start'}
            display="flex"
        >
            <Box minWidth='40px' mr={1.5}>
                {avatar && <Avatar />}
            </Box>
            <Box className={style.messageBox} p={1} borderRadius="6px" maxWidth="500px">
                <Typography variant="body1">{children}</Typography>
            </Box>
        </Box>
    );
};
const useStyle = makeStyles((theme) => ({
    messageBox: {
        backgroundColor: ({ self }) =>
            self ? '#0091ff' : theme.palette.grey[200],
        color: ({ self }) => (self ? '#fff' : null),
    },
}));
export default Message;
