import { Box ,Avatar,Typography, Button,makeStyles} from '@material-ui/core'
import React from 'react'

const UserCard = ({user,handleClick}) => {
    const style = useStyle()
    return (
        <Box onClick={handleClick} className={style.container}>
            <Avatar src={user.avatar} />
            <Typography classes={{root : style.username}} variant='subtitle2'>{user.fullname}</Typography>
            <Button classes={{root : style.btn}} variant="outlined" color="primary" size='small'>
                {user.isRequest ? 'Undo' : 'Add friend'}
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
