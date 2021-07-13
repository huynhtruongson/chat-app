import React, {useEffect, useState} from 'react';
import {Box, makeStyles, Typography, Button, Avatar, IconButton} from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import Images from '../../constants/Images';
import UserApi from '../../api/userApi';
const FriendRequest = ({handleShowConversation}) => {
    const style = useStyle();
    const [requestList, setRequestList] = useState([]);
    const handleAcceptFriend = async (id) => {
        try {
            const newRequestArr = requestList.map((user) =>
                user._id === id ? {...user, isAccepted: true} : user
            );
            setRequestList(newRequestArr)
            await UserApi.acceptAddFriend(id);
        } catch (error) {
            console.log(error);
        }
    };
    const handleRefuseFriend = async (id) => {
        try {
            const newRequestArr = requestList.filter((user) =>
                user._id !== id
            );
            setRequestList(newRequestArr)
            await UserApi.refuseAddFriend(id);
        } catch (error) {
            console.log(error);
        }
    } 
    useEffect(() => {
        const fetchFriendRequest = async () => {
            try {
                const res = await UserApi.getFriendRequests();
                if (res.status === 200) {
                    setRequestList(res.data);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchFriendRequest();
    }, []);
    return (
        <Box height='100%'>
            <Box display='flex' alignItems='center' borderBottom='1px solid #cacaca' p={1}>
                <IconButton onClick={()=>handleShowConversation(false)} className={style.backBtn}>
                    <ArrowBack color='primary'/>
                </IconButton>
                <Box display='flex' alignItems='center'>
                    <img className={style.addFrIcon} src={Images.ADDFR_ICON} alt='img' />
                    <Typography variant='h6'>Friend Requests ({requestList.length})</Typography>
                </Box>
            </Box>
            <Box p={2}>
                {requestList.map((user) => (
                    <Box key={user._id} className={style.requestItem}>
                        <Box display='flex' alignItems='center'>
                            <Avatar classes={{root: style.requestAvatar}} src={user.avatar} />
                            <Box>
                                <Typography variant='body1' classes={{root: style.requestName}}>
                                    {user.fullname}
                                </Typography>
                                <Typography variant='body2'>View profile</Typography>
                            </Box>
                        </Box>
                        <Box>
                            {user.isAccepted ? <Typography color='primary'>Accepted successfully !</Typography> : 
                                <>
                                    <Button 
                                        onClick={()=>handleRefuseFriend(user._id)}
                                        color='primary' 
                                        size='small'>
                                        Skip
                                    </Button>
                                    <Button
                                        onClick={() => handleAcceptFriend(user._id)}
                                        color='primary'
                                        variant='contained'
                                        size='small'>
                                        Accept
                                    </Button>
                                </>
                            }
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};
const useStyle = makeStyles((theme) => ({
    addFrIcon: {
        width: '48px',
        height: '48px',
        marginRight: theme.spacing(2),
    },
    requestName: {
        fontWeight: 500,
    },
    requestAvatar: {
        width: '48px',
        height: '48px',
        marginRight: theme.spacing(2),
    },
    requestItem: {
        padding: theme.spacing(2),
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: theme.shadows[1],
        borderRadius: theme.spacing(1),
    },
    backBtn : {
        display : 'none',
        [theme.breakpoints.down('sm')] : {
            display : 'block'
        }
    },
}));
export default FriendRequest;
