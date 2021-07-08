import {Box, makeStyles, TextField, Typography,IconButton} from "@material-ui/core";
import {Search,PersonAdd} from "@material-ui/icons";
import {useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import {getConversations, getUserMessage} from "../../actions/messageAction";
import UserApi from "../../api/userApi";
import Images from "../../constants/Images";
import ChatCard from "../ChatCard";
import useMediaQuery from '@material-ui/core/useMediaQuery';
const ConversationSidebar = ({showFriendList, handleShowFrRequest,handleShowSearchModal,handleShowConversation}) => {
    const style = useStyle();
    const {info : {_id : userId}} = useSelector(state => state.user)
    const {conversations,activeConv} = useSelector(state => state.message)
    const [friendList,setFriendList] = useState([])
    const [search,setSearch] = useState('')
    const dispatch = useDispatch()
    const friendListSearch = friendList.filter(f => f.fullname.toLowerCase().includes(search.toLowerCase()))
    const ConvListSearch = conversations.filter(cv => cv.fullname.toLowerCase().includes(search.toLowerCase()))
    const isMobileBp = useMediaQuery(theme => theme.breakpoints.down('sm'))
    const handleClickUserConversations = (id) => {
        if(isMobileBp)
            handleShowConversation(true)
        if (activeConv._id === id) return;
        const user = conversations[conversations.findIndex((cv) => cv._id === id)];
        dispatch(getUserMessage(user));
    };
    const handleClickUserFriends = (id) => {
        if(isMobileBp)
            handleShowConversation(true)
        handleShowFrRequest(false);
        if (activeConv._id === id) return;
        const user = friendList[friendList.findIndex((user) => user._id === id)];
        dispatch(getUserMessage(user));
    };
    const handleClickFriendRq = () => {
        if(isMobileBp)
            handleShowConversation(true)
        handleShowFrRequest(true)
        
    }
    const handleSearch = (e) => {
        setSearch(e.target.value)
    }
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
                    value={search}
                    onChange={handleSearch}
                    InputProps={{
                        classes:{root : style.searchInput},
                        startAdornment : <Search color='disabled'/>,
                    }}/>
                <IconButton classes={{root : style.addFriendBtn}} onClick={handleShowSearchModal}>
                    <PersonAdd/>
                </IconButton>
            </Box>
            {showFriendList && (
                <Box className={style.friendRequestBtn} onClick={handleClickFriendRq}>
                    <img className={style.friendRequestIcon} src={Images.ADDFR_ICON} alt="icon" />
                    <Typography>Friend Request</Typography>
                </Box>
            )}
            <Box display="flex" flexDirection="column">
                {!showFriendList
                    ? ConvListSearch?.map((cv) => (
                          <ChatCard
                              active={cv._id === activeConv._id}
                              key={cv._id}
                              user={cv}
                              handleClickUser={() => handleClickUserConversations(cv._id)}
                          />
                      ))
                    : friendListSearch?.map((user) => (
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
