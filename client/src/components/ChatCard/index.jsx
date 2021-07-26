import { Avatar, Badge, Box, Button, IconButton, makeStyles, Popover, Typography } from '@material-ui/core'
import { Description,MoreHoriz,DeleteForever } from '@material-ui/icons'
import moment from 'moment'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { deleteConversation } from '../../actions/messageAction'
import MessageApi from '../../api/messageApi'
import _alert from '../../utils/alert'

const ChatCard = ({user,handleClickUser,active,isConv,isOnline,self,unseen}) => {
    const style = useStyle({active,isOnline,unseen})
    const [anchorEl, setAnchorEl] = useState(null);
    const dispatch = useDispatch()
    const handleOptionBtnClick = (e) => {
        e.stopPropagation() // prevent parent click
        setAnchorEl(e.target)
    }
    const handleDeleteConv = (e) => {
        e.stopPropagation()
        _alert({
            title : 'Delete conversation',
            msg : 'Are you sure you want to delete this conversation.',
            icon : 'warning',
            showCancelButton : true,
            confirmButtonText : 'Delete',
            callback : async ({isConfirmed}) => {
                if(isConfirmed) {
                    try {
                        dispatch(deleteConversation(user._id))
                        await MessageApi.deleteConversation(user._id)
                    } catch (error) {
                        console.log(error)
                    }
                }
            }
        })
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
                    user.media.length ? <Box display='flex' alignItems='center' color={unseen ? 'initial' : '#757575'}>
                        <Description fontSize='small' />
                        <Typography variant='body2' >{`${user.media.length} file media`}</Typography>
                    </Box> :
                    <Typography variant='body2' noWrap color={unseen ? 'initial' : 'textSecondary'}>
                        {self && 'You:'}{user.text === ':like:' ? '👍' : user.text}
                    </Typography>
                )
                }
            </Box>
            {isConv && <Box display='flex' flexDirection='column' alignItems='flex-end' alignSelf='stretch'>
                <Typography variant='caption' color='textSecondary' >{moment(user.update_time ||new Date().toISOString()).fromNow()}</Typography>
                <Box display='flex' alignItems='center'>
                    <IconButton onClick={handleOptionBtnClick} size='small' classes={{root : style.optionBtn}}>
                        <MoreHoriz fontSize='small' />
                    </IconButton>
                    <Box className={style.unseenMark}></Box>
                </Box>
                <Popover
                    open={!!anchorEl}
                    anchorEl={anchorEl}
                    onClose={(e) => {setAnchorEl(null);e.stopPropagation()}}
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
            backgroundColor : theme.palette.grey[200],
            '& $optionBtn' : {
                // display : 'block'
                opacity : 1
            }
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
        // display : 'none'
        opacity : 0
    },
    unseenMark : {
        width : '10px',
        height :'10px',
        borderRadius : '100rem',
        backgroundColor : ({unseen}) => unseen ? '#db342e' : 'transparent'
        
    }
}))
export default ChatCard
