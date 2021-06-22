import { Avatar, Badge, Box, makeStyles, Typography } from '@material-ui/core'
import React from 'react'

const ChatCard = ({user,handleClickUser,active}) => {
    const style = useStyle({active})
    return (
        <Box onClick={handleClickUser} className={style.chatCard} display='flex' p={1} alignItems='center'>
            <Badge
                variant="dot"
                classes={{
                    dot: style.badgeDot,
                    anchorOriginTopRightRectangle : style.badgeAnchor
                }}
            >
                <Avatar
                    classes={{ root: style.avatar }}
                    src={user.avatar}
                />
            </Badge>
            <Box flex={1} display='flex' flexDirection='column' justifyContent='center' ml={1} overflow='hidden'>
                <Typography>{`${user.firstname} ${user.lastname}`}</Typography>
                <Typography variant='body2' noWrap color='textSecondary'>{user.text}</Typography>
            </Box>
        </Box>
    )
}
const useStyle = makeStyles(theme => ({
    chatCard : {
        cursor : 'pointer',
        backgroundColor : ({active}) => active ? '#E5EFFF' : null,
        '&:hover' : {
            backgroundColor : theme.palette.grey[200]
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
