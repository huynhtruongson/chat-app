import { Box ,Avatar,Typography, Button,makeStyles} from '@material-ui/core'
import React from 'react'

const UserCard = ({user,handleClick,handleRequestClick,isRequesting}) => {
    const style = useStyle()
    return (
        <Box className={style.container}>
            <Box onClick={handleClick} display='flex' alignItems='center'>
                <Avatar src={user.avatar} />
                <Typography classes={{root : style.username}} variant='subtitle2'>{user.fullname}</Typography>
            </Box>
            <Button 
                onClick={handleRequestClick} 
                classes={{root : style.btn}} 
                variant="outlined" 
                color="primary" 
                size='small'
                disabled={isRequesting}>
                {user.isRequested ? 'Cancel Request' : 'Add friend'}
            </Button>
        </Box>
    )
}
const useStyle = makeStyles(theme => ({
    container : {
        display : 'flex',
        alignItems : 'center',
        marginBottom : theme.spacing(1.5),
        cursor : 'pointer'
    },
    btn : {
        marginLeft : 'auto',
        textTransform : 'initial'
    },
    username : {
        marginLeft : theme.spacing(1)
    }
}))
export default UserCard
