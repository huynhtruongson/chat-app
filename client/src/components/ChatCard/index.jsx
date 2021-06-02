import { Avatar, Badge, Box, makeStyles, Typography } from '@material-ui/core'
import React from 'react'

const ChatCard = () => {
    const style = useStyle()
    return (
        <Box className={style.chatCard} display='flex' p={1} alignItems='center'>
            <Badge
                variant="dot"
                classes={{
                    dot: style.badgeDot,
                    anchorOriginTopRightRectangle : style.badgeAnchor
                }}
            >
                <Avatar
                    classes={{ root: style.avatar }}
                    src="https://picsum.photos/200/300"
                />
            </Badge>
            <Box flex={1} display='flex' flexDirection='column' justifyContent='center' ml={1} overflow='hidden'>
                <Typography>Sơn Huỳnh</Typography>
                <Typography variant='body2' noWrap color='textSecondary'>Lorem ipsum, dolor sit amet consectetur</Typography>
            </Box>
        </Box>
    )
}
const useStyle = makeStyles(theme => ({
    chatCard : {
        cursor : 'pointer',
        '&:hover' : {
            backgroundColor : theme.palette.grey[100]
        }
    },
    avatar : {
        width: '48px',
        height: '48px',
        border : '2px solid #fff'
    },
    badgeDot: {
        backgroundColor: '#15A85F',
        width: '12px',
        height: '12px',
        border: '1.5px solid #fff',
        borderRadius: '100rem',
    },
    badgeAnchor: {
        top: '8px',
        right: '6px',
    }
}))
export default ChatCard
