import { Avatar, Badge, Box, Button, IconButton, makeStyles, Popover, Typography } from '@material-ui/core'
import { Description,MoreHoriz,DeleteForever } from '@material-ui/icons'
import moment from 'moment'
import React, { useState } from 'react'

const ChatCard = ({user,handleClickUser,active,isConv,isOnline}) => {
    const style = useStyle({active,isOnline})
    const [anchorEl, setAnchorEl] = useState(null);
    const handleOptionBtnClick = (e) => {
        e.stopPropagation() // prevent parent click
        setAnchorEl(e.target)
    }
    const handleDeleteConv = (e) => {
        e.stopPropagation()
    }
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
                <Typography>{user.fullname}</Typography>
                {(isConv) && (
                    user.media.length ? <Box display='flex' alignItems='center' color='#757575'>
                        <Description fontSize='small' />
                        <Typography variant='body2' >{`${user.media.length} file media`}</Typography>
                    </Box> :
                    <Typography variant='body2' noWrap color='textSecondary'>{user.text === ':like:' ? '👍' : user.text}</Typography>
                )
                }
            </Box>
            {isConv && <Box display='flex' flexDirection='column' alignItems='flex-end'>
                <Typography variant='caption' color='textSecondary' >{moment(new Date().toISOString()).fromNow()}</Typography>
                <IconButton onClick={handleOptionBtnClick} size='small' classes={{root : style.optionBtn}}>
                    <MoreHoriz fontSize='small' />
                </IconButton>
                <Popover
                    open={!!anchorEl}
                    anchorEl={anchorEl}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{vertical: "bottom", horizontal: "center"}}
                    transformOrigin={{vertical : 'top',horizontal : 'center'}}>
                    <Button onClick={handleDeleteConv} startIcon={<DeleteForever fontSize='small' color='secondary'/>} color='secondary'>
                        Delete
                    </Button>
                </Popover>
            </Box>
            }
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
        display : ({isOnline}) => isOnline ? 'block' : 'none',
        backgroundColor: '#15A85F',
        width: '12px',
        height: '12px',
        border: '1.5px solid #fff',
        borderRadius: '100rem',
    },
    badgeAnchor: {
        top: '8px',
        right: '6px',
    },
    optionBtn : {
    }
}))
export default ChatCard
