import {Box,TextField,DialogContent,makeStyles,DialogActions,Typography,Button,LinearProgress, Select, MenuItem} from '@material-ui/core';
import {Search} from '@material-ui/icons';
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getUserMessage} from '../../actions/messageAction';
import UserApi from '../../api/userApi';
import ModalBase from '../ModalBase';
import UserCard from '../UserCard';
import UserProfile from '../UserProfile';
import * as yup from 'yup'
import { updateNewFriend } from '../../actions/userAction';
const schema = yup.object().shape({
    email : yup.string().email()
})
const SearchModal = ({open, onClose,handleShowConversation,handleShowFrRequest}) => {
    const style = useStyle();
    const [searchInput, setSearchInput] = useState('');
    const [searchType,setSearchType] = useState('fullname')
    const [searchList, setSearchList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userDetail, setUserDetail] = useState(null);
    const [searchError,setSearchError] = useState('')
    const {info} = useSelector(state => state.user)
    const socket = useSelector(state => state.socket)
    const dispatch = useDispatch();
    const handleSearch = async () => {
        try {
            if(searchType === 'email') {
                const isValid = await schema.isValid({email : searchInput})
                if(!isValid) {
                    setSearchError('Invalid email!')
                    return
                }
            }
            setLoading(true);
            const params = searchType === 'email' ? {email: searchInput} : {fullname: searchInput};
            const res = await UserApi.searchFriends(params);
            if (res.status === 200) {
                setLoading(false);
                setSearchList(res.data);
            }
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };
    const handleClickUser = (user) => {
        setUserDetail(user);
    };
    const handleChangeInput = (e) => {
        setSearchError('')
        setSearchInput(e.target.value)
    }
    const handleChangeSelect = (e) => {
        setSearchError('')
        setSearchType(e.target.value)
    }
    const handleCloseModal = () => {
        setSearchInput('');
        setSearchList([]);
        setLoading(false);
        setUserDetail(null);
        setSearchType('fullname')
        setSearchError('')
    };
    const handleChatClick = () => {
        dispatch(getUserMessage(userDetail));
        handleShowConversation(true)
        handleShowFrRequest(false)
        onClose();
    };
    const handleRequestClick = async (id) => {
        try {
            const res = await UserApi.requestFriend(id)
            if(res.status === 200) {
                const user = searchList.find(u => u._id === id)
                if(user && !user.isRequested)
                    socket.emit('FRIEND_REQUEST',({info,id}))
                const newSearchList = searchList.map((user) =>
                    user._id === id ? {...user, isRequested: !user.isRequested} : user
                );
                setSearchList(newSearchList)
                if(userDetail)
                setUserDetail({...userDetail,isRequested: !userDetail.isRequested})
                
            }
        }
        catch (error) {
            console.log(error)
        }
    };
    const handleAcceptFriend = async (id) => {
        try {
            const user = searchList.find(u => u._id === id)
            if(user) {
                const res = await UserApi.acceptAddFriend(id);
                if(res.status === 200) {
                    const newSearchList = searchList.map((user) =>
                        user._id === id ? {...user, isAccepted: true} : user
                    );
                    setSearchList(newSearchList)
                    if(userDetail)
                        setUserDetail({...userDetail,isAccepted: true})
                    dispatch(updateNewFriend(user))
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
    const handleRefuseFriend = async (id) => {
        try {
            const res = await UserApi.refuseAddFriend(id);
            if(res.status === 200) {
                const newSearchList = searchList.map((user) =>
                    user._id === id ? {...user,isInvited : false, isRequested: false} : user
                );
                setSearchList(newSearchList)
                if(userDetail)
                    setUserDetail({...userDetail,isInvited : false, isRequested: false})
            }
        } catch (error) {
            console.log(error);
        }
    } 
    return (
        <ModalBase
            open={open}
            onClose={onClose}
            title='Add Friend'
            classes={{paper: style.dialogContainer}}
            onExited={handleCloseModal}>
            <DialogContent classes={{dividers: style.dialogContent}} dividers>
                {loading && (
                    <LinearProgress classes={{root: style.loadingProgress}} color='primary' />
                )}
                {userDetail ? (
                    <UserProfile
                        user={userDetail}
                        handleBackClick={() => setUserDetail(null)}
                        handleChatClick={handleChatClick}
                        handleBtnClick={
                            userDetail.isInvited ? () => handleAcceptFriend(userDetail._id) : 
                            () => handleRequestClick(userDetail._id)
                        }
                        handleRefuseFriend={() => handleRefuseFriend(userDetail._id)}
                    />
                ) : (
                    <Box>
                        <Box display='flex' alignItems='flex-start'>
                            <Select 
                                className={style.searchSelect} 
                                value={searchType} 
                                variant='standard'
                                onChange={handleChangeSelect}
                            >
                                <MenuItem value='fullname'>Name</MenuItem>
                                <MenuItem value='email'>Email</MenuItem>
                            </Select>
                            <TextField
                                value={searchInput}
                                onChange={handleChangeInput}
                                variant='standard'
                                error={!!searchError}
                                helperText={searchError}
                                fullWidth
                                placeholder='Search . . .'
                                InputProps={{
                                    classes: {root: style.searchInput},
                                    endAdornment: <Search color='disabled' />,
                                }}
                            />
                        </Box>
                        <Box mt={1}>
                            <Typography variant='subtitle2' color='textSecondary'>
                                Searching result
                            </Typography>
                        </Box>
                        <Box textAlign='center' mt={1}>
                            {searchList?.length ? (
                                searchList.map((user) => (
                                    <UserCard
                                        key={user._id}
                                        user={user}
                                        handleClick={() => handleClickUser(user)}
                                        handleBtnClick={
                                            user.isInvited ? () => handleAcceptFriend(user._id) : 
                                            () => handleRequestClick(user._id)
                                        }
                                    />
                                ))
                            ) : (
                                <Typography variant='body2'>No Data</Typography>
                            )}
                        </Box>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button classes={{root: style.dialogBtn}} onClick={onClose} color='default'>
                    Cancel
                </Button>
                <Button
                    onClick={handleSearch}
                    classes={{root: style.dialogBtn}}
                    disabled={loading || !searchInput || !!userDetail}
                    color='primary'
                    type='submit'
                    variant='contained'>
                    Search
                </Button>
            </DialogActions>
        </ModalBase>
    );
};
const useStyle = makeStyles((theme) => ({
    dialogContent: {
        padding: theme.spacing(1.5),
        position: 'relative',
    },
    searchInput: {
        borderRadius: '100rem',
        fontSize: '.9rem',
    },
    dialogContainer: {
        width: '380px',
        minHeight: '400px',
    },
    dialogBtn: {
        fontSize: '.9rem',
        textTransform: 'initial',
    },
    loadingProgress: {
        position: 'absolute',
        width: '100%',
        top: 0,
        left: 0,
    },
    searchSelect : {
        fontSize : '.9rem',
        color : theme.palette.grey[700],
        marginRight : theme.spacing(1)
    }
}));
export default SearchModal;
