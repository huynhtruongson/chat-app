import { Box ,Avatar,Typography, Button,makeStyles} from '@material-ui/core'
import { useState } from 'react'

const UserCard = ({user,handleClick,handleBtnClick}) => {
    const style = useStyle()
    const [isRequesting,setIsRequesting] = useState(false)
    const btnClick = async () => {
        setIsRequesting(true)
        await handleBtnClick()
        setIsRequesting(false)
    }
    return (
        <Box className={style.container}>
            <Box onClick={handleClick} display='flex' alignItems='center'>
                <Avatar src={user.avatar} />
                <Typography classes={{root : style.username}} variant='subtitle2'>{user.fullname}</Typography>
            </Box>
            {user.isAccepted ? <Typography variant='subtitle1'>Accepted</Typography> : 
                <Button 
                    onClick={btnClick} 
                    classes={{root : style.btn}} 
                    variant="outlined" 
                    color="primary" 
                    size='small'
                    disabled={isRequesting}>
                    {user.isInvited ? 'Accept' : user.isRequested ? 'Cancel Request' : 'Add friend'}
                </Button>
            }
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
