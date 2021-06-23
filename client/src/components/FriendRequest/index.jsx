import React from "react";
import {Box, makeStyles, Typography, Button, Avatar, Paper} from "@material-ui/core";
import Images from "../../constants/Images";
const FriendRequest = () => {
    const style = useStyle();
    return (
        <Box display="flex" flexDirection="column" height="100%">
            <Box display="flex" alignItems="center" borderBottom="1px solid #cacaca" p={1}>
                <img className={style.addFrIcon} src={Images.ADDFR_ICON} alt="img" />
                    <Typography variant="h6">Frien  uests</Typography>
            </Box>
            <Box p={2}>
                <Box className={style.requestItem}>
                    <Box display='flex' alignItems='center'>
                        <Avatar classes={{root : style.requestAvatar}} src="https://picsum.photos/200/300" />
                        <Box>
                            <Typography variant='body1' classes={{root  : style.requestName}}>Chou Tzuyu</Typography>
                            <Typography variant='body2'>View profile</Typography>
                        </Box>
                    </Box>
                    <Box>
                        <Button color='primary' size='small'>Skip</Button>
                        <Button color='primary' vari ant='contained' size='small'>Accept</Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};
const useStyle = makeStyles((theme) => ({
    addFrIcon: {
        width: "48px",
        height: "48px",
        marginRight: theme.spacing(2),
    },
    requestName : {
        fontWeight : 500
    },
    requestAvatar  :{
        width : '48px',
        height : '48px',
        marginRight : theme.spacing(2)
    },
    requestItem : {
        padding : theme.spacing(2),
        display : 'flex',
        justifyContent : 'space-between',
        alignItems : 'center',
        boxShadow : theme.shadows[1],
        borderRadius : theme.spacing(1)
    }
}));
export default FriendRequest;
