import {Box,DialogContent,makeStyles,Typography,Avatar} from '@material-ui/core';
import ModalBase from '../ModalBase';
const ProfileModal = ({open,onClose,user}) => {
    const style = useStyle();
    return (
        <ModalBase
            open={open}
            onClose={onClose}
            title='Profile'
            classes={{paper: style.dialogContainer}}>
            <DialogContent classes={{dividers: style.dialogContent}} dividers>
                <Box height='150px' position='relative' mx={-1.5}>
                    <img className={style.backgroundImg} src='https://picsum.photos/600/300' alt='img' />
                    <Avatar classes={{root : style.avatar}} src={user.avatar} />
                </Box>
                <Box textAlign="center" mt={6.5}>
                    <Typography variant="h6">{user.fullname}</Typography>
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
            </DialogContent>
        </ModalBase>
    );
};
const useStyle = makeStyles((theme) => ({
    dialogContent: {
        padding: theme.spacing(1.5),
        position: 'relative',
    },
    dialogContainer: {
        width: '380px',
        minHeight: '400px',
    },
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
    textInfo : {
        fontWeight : 500,
        marginLeft : theme.spacing(1)
    }
}));
export default ProfileModal;
