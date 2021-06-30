import {Box, makeStyles, TextField, Typography,IconButton} from "@material-ui/core";
import {Search,PersonAdd} from "@material-ui/icons";
import {useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import {getConversations, getUserMessage} from "../../actions/messageAction";
import UserApi from "../../api/userApi";
import Images from "../../constants/Images";
import ChatCard from "../ChatCard";
const ConversationSidebar = ({showFriendList, handleShowFrRequest,handleShowSearchModal}) => {
    const style = useStyle();
    const {info : {_id : userId}} = useSelector(state => state.user)
    const {conversations,activeConv} = useSelector(state => state.message)
    const [friendList,setFriendList] = useState([])
    const dispatch = useDispatch()
    const handleClickUserConversations = (id) => {
        if (activeConv._id === id) return;
        const user = conversations[conversations.findIndex((cv) => cv._id === id)];
        dispatch(getUserMessage(user));
    };
    const handleClickUserFriends = (id) => {
        handleShowFrRequest(false);
        if (activeConv._id === id) return;
        const user = friendList[friendList.findIndex((user) => user._id === id)];
        dispatch(getUserMessage(user));
    };
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                dispatch(getConversations(userId))
                const res = await UserApi.getFriendList()
                if(res.status === 200)
                    setFriendList(res.data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchUserData()
    }, [dispatch,userId]);
    return (
        <Box>
            <Box display="flex" alignItems="center" px={1} mt={3}>
                <TextField 
                    variant='outlined' 
                    fullWidth 
                    size='small'
                    placeholder='Search'
                    InputProps={{
                        classes:{root : style.searchInput},
                        startAdornment : <Search color='disabled'/>,
                    }}/>
                <IconButton classes={{root : style.addFriendBtn}} onClick={handleShowSearchModal}>
                    <PersonAdd/>
                </IconButton>
            </Box>
            {showFriendList && (
                <Box className={style.friendRequestBtn} onClick={() => handleShowFrRequest(true)}>
                    <img className={style.friendRequestIcon} src={Images.ADDFR_ICON} alt="icon" />
                    <Typography>Friend Request</Typography>
                </Box>
            )}
            <Box display="flex" flexDirection="column">
                {!showFriendList
                    ? conversations?.map((cv) => (
                          <ChatCard
                              active={cv._id === activeConv._id}
                              key={cv._id}
                              user={cv}
                              handleClickUser={() => handleClickUserConversations(cv._id)}
                          />
                      ))
                    : friendList?.map((user) => (
                          <ChatCard
                              active={user._id === activeConv._id}
                              key={user._id}
                              user={user}
                              handleClickUser={() => handleClickUserFriends(user._id)}
                          />
                      ))}
            </Box>
        </Box>
    );
};
const useStyle = makeStyles((theme) => ({
    searchInput : {
        borderRadius : '100rem',
        fontSize : '.85rem',
    },
    searchIcon: {
        fontSize: "30px",
    },
    friendRequestIcon: {
        width: "52px",
        height: "52px",
        marginRight: theme.spacing(2),
    },
    friendRequestBtn: {
        display: "flex",
        alignItems: "center",
        padding: theme.spacing(1),
        cursor: "pointer",
        "&:hover": {
            backgroundColor: theme.palette.grey[200],
        },
    },
    addFriendBtn:{
        padding : '8px',
        marginLeft : theme.spacing(1)
    }
}));
export default ConversationSidebar;
