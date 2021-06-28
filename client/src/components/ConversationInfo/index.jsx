import {Avatar, Box, makeStyles, Typography} from '@material-ui/core';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const ConversationInfo = () => {
    const style = useStyle();
    const {activeConv} = useSelector(state => state.message)
    return (
        <Box display='flex' flexDirection='column' borderLeft='1px solid #cacaca' height='100%'>
            <Box className={style.header}>
                <Box>
                    <Typography classes={{root: style.title}} variant='subtitle2' color='initial'>
                        Conversation Info
                    </Typography>
                </Box>
            </Box>
            <Box className={style.mainContainer}>
                <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center' mt={2}>
                    <Avatar classes={{root : style.avatar}} src={activeConv.avatar} />
                    <Box mt={1}>
                        <Typography classes={{root: style.title}} variant='subtitle2'>{activeConv.fullname}</Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};
const useStyle = makeStyles((theme) => ({
    header : {
        height : '65px',
        display : 'flex',
        justifyContent : 'center',
        alignItems : 'center',
        borderBottom : '1px solid #cacaca'
    },
    title: {
        fontSize: '1.1rem',
    },
    mainContainer : {
        flex: 1,
        overflowY : 'auto'
    },
    avatar : {
        width : '52px',
        height : '52px'
    },
}));
export default ConversationInfo;
