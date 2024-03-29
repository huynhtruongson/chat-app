import { Box,Avatar,Typography, Button, IconButton, makeStyles } from '@material-ui/core'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useState } from 'react';

const UserProfile = (props) => {
    const {user,handleBackClick,handleChatClick,handleBtnClick,handleRefuseFriend} = props
    const style = useStyle()
    const [isRequesting,setIsRequesting] = useState(false)
    const handleRefuseClick = async () => {
        setIsRequesting(true)
        await handleRefuseFriend()
        setIsRequesting(false)
    }
    const handleMainBtnClick = async () => {
        setIsRequesting(true)
        await handleBtnClick()
        setIsRequesting(false)
    }
    return (
        <Box>
            <Box height='150px' position='relative' mx={-1.5}>
                <IconButton    
                    classes={{root : style.backBtn}} 
                    onClick={handleBackClick} 
                    color='secondary'> 
                    <ArrowBackIcon/> 
                </IconButton>
                <img className={style.backgroundImg} src='https://picsum.photos/600/300' alt='img' />
                <Avatar classes={{root : style.avatar}} src={user.avatar} />
            </Box>
            <Box textAlign="center" mt={6.5}>
                <Typography variant="h6">{`${user.firstname} ${user.lastname}`}</Typography>
            </Box>
            <Box display='flex' justifyContent='center'>
                <Button onClick={handleChatClick} classes={{root : style.actionBtn}} variant="outlined" size='small' color='primary'>
                    Chat
                </Button>
                {(!user.isAccepted && user.isInvited) && 
                    <Button 
                        onClick={handleRefuseClick} 
                        classes={{root : style.actionBtn}} 
                        variant="outlined" 
                        size='small'
                        color='primary'
                        disabled={isRequesting}>
                        Skip
                    </Button>
                }
                {!user.isAccepted && 
                    <Button 
                        onClick={handleMainBtnClick} 
                        classes={{root : style.actionBtn}} 
                        variant="contained" 
                        size='small' 
                        color='primary'
                        disabled={isRequesting}>
                        {user.isInvited ? 'Accept' : user.isRequested ? 'Cancel Request' : 'Add Friend'}
                    </Button>
                }
            </Box>
            <Box mt={3}>
                <Box display="flex">
                    <Typography color="textSecondary">Email:</Typography>
                    <Typography classes={{root : style.textInfo}}>{user.email}</Typography>
                </Box>
                <Box display="flex" mt={1}>
                    <Typography color="textSecondary">Firstname:</Typography>
                    <Typography classes={{root : style.textInfo}}>{user.firstname}</Typography>
                </Box>
                <Box display="flex" mt={1}>
                    <Typography color="textSecondary">Lastname:</Typography>
                    <Typography classes={{root : style.textInfo}}>{user.lastname}</Typography>
                </Box>
            </Box>
        </Box>
    )
}
const useStyle = makeStyles(theme => ({
    backgroundImg: {
        height: '100%',
        width: '100%',
        objectFit: 'cover',
    },
    avatar: {
        position:'absolute',
        left : '50%',
        bottom : '0',
        transform : 'translate(-50%,50%)',
        width: '100px',
        height: '100px',
        border: '3px solid #fff',
    },
    backBtn : {
        position: 'absolute',
        top : theme.spacing(1),
        left : theme.spacing(1),
        backgroundColor : 'rgb(0 0 0 / 30%)',
        padding : '8px',
        color : '#fff',
        '&:hover'  : {
            backgroundColor : 'rgb(0 0 0 / 50%)'
        }
    },
    actionBtn : {
        textTransform : 'initial',
        width  : '126px',
        '&+&' : {
            marginLeft : theme.spacing(2)
        }
    },
    textInfo : {
        fontWeight : 500,
        marginLeft : theme.spacing(1)
    }
}))
export default UserProfile
