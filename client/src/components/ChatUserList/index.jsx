import {Box, makeStyles, TextField, Typography,IconButton} from "@material-ui/core";
import {Search,PersonAdd} from "@material-ui/icons";
import {useEffect} from "react";
import {getConversations, getUserMessage} from "../../actions/messageAction";
import MessageApi from "../../api/messageApi";
import Images from "../../constants/Images";
import {useData} from "../../context/DataContext";
import ChatCard from "../ChatCard";
const ChatUserList = ({showFriendList, handleShowFrRequest}) => {
    const style = useStyle();
    const {
        message: [messageState, dispatch],
        user: [userState],
    } = useData();
    const {conversations, user: msgUser} = messageState;
    const {friends} = userState.info;
    const handleClickUserConversations = (id) => {
        if (msgUser._id === id) return;
        const user = conversations[conversations.findIndex((user) => user._id === id)];
        dispatch(getUserMessage(user));
    };
    const handleClickUserFriends = (id) => {
        if (msgUser._id === id) return;
        const user = friends[friends.findIndex((user) => user._id === id)];
        dispatch(getUserMessage(user));
        handleShowFrRequest(false);
    };
    useEffect(() => {
        const fetchConversations = async (id) => {
            try {
                if (!id) return;
                const res = await MessageApi.getConversations();
                if (res.status === 200) {
                    const formatConv = [];
                    res.data.forEach((cv) => {
                        cv.recipients.forEach((user) => {
                            if (user._id !== id)
                                formatConv.push({...user, text: cv.text, media: cv.media});
                        });
                    });
                    console.log(formatConv);
                    dispatch(getConversations(formatConv));
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchConversations(userState.info._id);
    }, [dispatch, userState.info._id]);
    return (
        <Box>
            <Box display="flex" alignItems="center" px={1} mt={3}>
                {/* <Search classes={{root: style.searchIcon}} color="disabled" /> */}
                <TextField 
                    variant='outlined' 
                    fullWidth 
                    size='small'
                    placeholder='Search'
                    InputProps={{
                        classes:{root : style.searchInput},
                        startAdornment : <Search color='disabled'/>
                    }}/>
                <Box><IconButton><PersonAdd/></IconButton></Box>
            </Box>
            {showFriendList && (
                <Box className={style.addFrBtn} onClick={() => handleShowFrRequest(true)}>
                    <img className={style.addFrIcon} src={Images.ADDFR_ICON} alt="icon" />
                    <Typography>Friend Request</Typography>
                </Box>
            )}
            <Box display="flex" flexDirection="column">
                {!showFriendList
                    ? conversations.map((user) => (
                          <ChatCard
                              active={user._id === msgUser._id}
                              key={user._id}
                              user={user}
                              handleClickUser={() => handleClickUserConversations(user._id)}
                          />
                      ))
                    : friends.map((user) => (
                          <ChatCard
                              active={user._id === msgUser._id}
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
        borderRadius : '100rem'
    },
    searchIcon: {
        fontSize: "30px",
    },
    addFrIcon: {
        width: "52px",
        height: "52px",
        marginRight: theme.spacing(2),
    },
    addFrBtn: {
        display: "flex",
        alignItems: "center",
        padding: theme.spacing(1),
        cursor: "pointer",
        "&:hover": {
            backgroundColor: theme.palette.grey[200],
        },
    },
}));
export default ChatUserList;
