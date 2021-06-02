import { Avatar, Box, IconButton, makeStyles, TextField, Typography } from '@material-ui/core'
import {Info,PhotoLibrary,AttachFile,ThumbUp} from '@material-ui/icons';
import React from 'react'
import Message from '../Mesage';

const MessageBox = () => {
    const style = useStyle()
    return (
        <Box display='flex' flexDirection='column' height='100%'>
            <Box display='flex' justifyContent='space-between' alignItems='center' borderBottom='1px solid #cacaca' p={1}>
                <Box display='flex' alignItems='center'>
                    <Avatar classes={{root :style.avatar}} />
                    <Box ml={0.8}>
                        <Typography classes={{root : style.username}} variant='subtitle2'>Tấn Vinh</Typography>
                        <Typography variant='body2' color='textSecondary'>Active now</Typography>
                    </Box>
                </Box>
                <Box>
                    <IconButton color='primary'>
                        <Info/>
                    </IconButton>
                </Box>
            </Box>
            <Box flex={1} display='flex' overflow='auto' flexDirection='column-reverse'>
                <Message self={true}>
                    1Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure
                    qui maxime accusamus asperiores dolores, voluptatem placeat
                    dolore ex a
                </Message>
                <Message >
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure
                    qui maxime accusamus asperiores dolores, voluptatem placeat
                    dolore ex a
                </Message>
                <Message avatar>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure
                    qui maxime accusamus asperiores dolores, voluptatem placeat
                    dolore ex a
                </Message>
            </Box>
            <Box display='flex' alignItems='center' pt={0.8} borderTop='1px solid #cacaca'>
                <Box display='flex'>
                    <IconButton color='primary'>
                        <PhotoLibrary/>
                    </IconButton>
                    <IconButton color='primary'>
                        <AttachFile/>
                    </IconButton>
                </Box>
                <TextField
                    classes={{root : style.chatInput}}
                    multiline
                    fullWidth
                    variant='outlined'
                    placeholder='Aa'
                    size='small'
                />
                <IconButton color='primary'>
                    <ThumbUp/>
                </IconButton>
            </Box>
        </Box>
    )
}
const useStyle = makeStyles(theme => ({
    avatar: {
        width: '48px',
        height: '48px',
    },
    username : {
        fontSize : '1.1rem',
    },
    chatInput : {
        borderRadius : '100rem'
    }
}))
export default MessageBox
